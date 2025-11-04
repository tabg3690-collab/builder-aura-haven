import { Member } from "@shared/members";
import { AuthUser } from "@shared/users";
import * as XLSX from "xlsx";

// Using demo data only - no database connectivity needed

// Helper function to ensure all members have the new fields
const ensureMemberFields = (member: any): Member => {
  return {
    ...member,
    address: member.address || "",
    dixaDate: member.dixaDate || "",
    category: (member.category as Member["category"]) || "Sadbhav",
    status: member.status || "",
    reference: member.reference || "",
    bloodGroup: member.bloodGroup || "",
    education: member.education || "",
    occupation: member.occupation || "",
    memberId: member.memberId || "",
  } as Member;
};

// Load members from external Excel once, replacing demo data
const excelSourceUrl =
  "https://cdn.builder.io/o/assets%2Fe8a4cf259e0444609aac214d5cbaad39%2Fe8016aeac9f247d09d9d6e0e3046d401?alt=media&token=1c82ca52-32fb-4f53-8048-8ab6d0502a27&apiKey=e8a4cf259e0444609aac214d5cbaad39";
let excelLoaded = false;
let excelLoadInFlight: Promise<void> | null = null;

const parseExcelDate = (value: unknown): string => {
  if (typeof value === "number") {
    // Excel serial date (assuming 1900 date system)
    const date = new Date((value - 25569) * 86400 * 1000);
    if (!isNaN(date.getTime())) return date.toISOString().split("T")[0];
    return "";
  }
  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return "";
    // Try ISO first
    const iso = new Date(raw);
    if (!isNaN(iso.getTime())) return iso.toISOString().split("T")[0];
    // Try common DD/MM/YYYY or DD-MM-YYYY
    const m = raw.match(/^([0-3]?\d)[\/\-]([0-1]?\d)[\/\-](\d{4})$/);
    if (m) {
      const d = parseInt(m[1], 10);
      const mo = parseInt(m[2], 10) - 1;
      const y = parseInt(m[3], 10);
      const dt = new Date(y, mo, d);
      if (!isNaN(dt.getTime())) return dt.toISOString().split("T")[0];
    }
    // Try YYYY/MM/DD or YYYY-MM-DD when not parsed by Date()
    const m2 = raw.match(/^(\d{4})[\/\-]([0-1]?\d)[\/\-]([0-3]?\d)$/);
    if (m2) {
      const y = parseInt(m2[1], 10);
      const mo = parseInt(m2[2], 10) - 1;
      const d = parseInt(m2[3], 10);
      const dt = new Date(y, mo, d);
      if (!isNaN(dt.getTime())) return dt.toISOString().split("T")[0];
    }
  }
  return "";
};

const normalizeKey = (s: string) => s.replace(/\s+/g, "").toLowerCase();
const normalizeName = (s: string) => s.trim().toLowerCase();

const loadMembersFromExcel = async () => {
  if (excelLoaded) return;
  if (excelLoadInFlight) return excelLoadInFlight;
  excelLoadInFlight = (async () => {
    try {
      const resp = await fetch(excelSourceUrl);
      if (!resp.ok) {
        excelLoaded = true;
        return;
      }
      const buf = await resp.arrayBuffer();
      const wb = XLSX.read(buf);
      const sheetName = wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

      const parsed: Member[] = [];
      let idCounter = 1;
      for (const row of rows) {
        const obj: any = {};
        // Map common fields by normalized header
        let first = "";
        let middle = "";
        let last = "";
        let full = "";
        for (const [k, v] of Object.entries(row)) {
          const nk = normalizeKey(String(k));
          const val = typeof v === "string" ? v.trim() : v;
          if (nk === "name" || nk === "fullname") full = String(v).trim();
          else if (nk === "firstname" || nk === "first" || nk === "fname")
            first = String(v).trim();
          else if (nk === "middlename" || nk === "middle" || nk === "mname")
            middle = String(v).trim();
          else if (
            nk === "surname" ||
            nk === "lastname" ||
            nk === "last" ||
            nk === "lname"
          )
            last = String(v).trim();
          else if (nk.includes("zone")) obj.zone = String(v).trim();
          else if (nk.includes("mandal")) obj.mandal = String(v).trim();
          else if (nk === "dateofbirth" || nk === "birthdate" || nk === "dob")
            obj.dateOfBirth = parseExcelDate(v);
          else if (nk.includes("dixa")) obj.dixaDate = parseExcelDate(v);
          else if (nk.includes("phone")) obj.phoneNumber = String(v).trim();
          else if (nk.includes("mobile")) obj.phoneNumber = String(v).trim();
          else if (nk.includes("email"))
            obj.email = String(v).trim().toLowerCase();
          else if (nk.includes("address")) obj.address = String(v).trim();
          else if (
            nk.includes("reference") ||
            nk === "ref" ||
            nk === "referredby"
          )
            obj.reference = String(v).trim();
          else if (nk.includes("blood")) obj.bloodGroup = String(v).trim();
          else if (nk.includes("education")) obj.education = String(v).trim();
          else if (nk.includes("occupation") || nk.includes("job"))
            obj.occupation = String(v).trim();
          else if (nk.includes("memberid") || nk === "id" || nk === "memberno")
            obj.memberId = String(v).trim();
          else if (nk.includes("category") || nk.includes("type"))
            obj.category = String(v).trim();
          else if (nk.includes("status")) obj.status = String(v).trim();
        }
        const combined = (
          full || [first, middle, last].filter(Boolean).join(" ")
        )
          .replace(/\s+/g, " ")
          .trim();
        obj.name = combined;
        if (!obj.name) continue; // skip invalid rows
        obj.id = idCounter++;
        // Normalize category values and mapping rule: if category is 'ambrish', set to 'Karyakarta'
        const rawCat = (obj.category || "").toString().toLowerCase();
        let cat: Member["category"] = "Sadbhav";
        if (rawCat.includes("karyakarta")) cat = "Karyakarta";
        else if (rawCat.includes("ambrish"))
          cat = "Karyakarta"; // treat ambrish as Karyakarta per request
        else if (rawCat.includes("sadbhav")) cat = "Sadbhav";
        obj.category = cat;
        parsed.push(ensureMemberFields(obj));
      }
      if (parsed.length) {
        realMembers = parsed;
      } else {
        // If parsing yielded nothing, keep existing but blank out unmapped fields
        realMembers = realMembers.map(ensureMemberFields);
      }
    } catch (e) {
      // On failure, keep existing data
    } finally {
      excelLoaded = true;
    }
  })();
  return excelLoadInFlight;
};

// Real member data from CSV

let realMembers: Member[] = [
  // Gandevi Mandal Members
  {
    id: 1,
    name: "Hiteshbhai Dahyabhai Rohit",
    zone: "Khergam",
    mandal: "Gandevi Mandal",
    dateOfBirth: "1982-03-15",
    phoneNumber: "9879906884",
    email: "hitesh.rohit@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 2,
    name: "Subhashbhai Dahyabhai Rohit",
    zone: "Khergam",
    mandal: "Gandevi Mandal",
    dateOfBirth: "1985-07-22",
    phoneNumber: "9825718539",
    email: "subhash.rohit@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 3,
    name: "Kikubhai Somabhai Rathod",
    zone: "Khergam",
    mandal: "Gandevi Mandal",
    dateOfBirth: "1978-11-08",
    phoneNumber: "9979775779",
    email: "kiku.rathod@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 4,
    name: "Amratbhai Bhekabhai Halpati",
    zone: "Khergam",
    mandal: "Gandevi Mandal",
    dateOfBirth: "1980-12-03",
    phoneNumber: "7434075569",
    email: "amrat.halpati@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 5,
    name: "Jigarbhai Ashokbhai Parmar",
    zone: "Duwada",
    mandal: "Gandevi Mandal",
    dateOfBirth: "1987-05-18",
    phoneNumber: "6353981850",
    email: "jigar.parmar@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 6,
    name: "Maheshbhai Lalubhai Patel",
    zone: "Rahej",
    mandal: "Gandevi Mandal",
    dateOfBirth: "1983-09-14",
    phoneNumber: "9825393749",
    email: "mahesh.patel@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 7,
    name: "Manharbhai Kantibhai Patel",
    zone: "Gandevi",
    mandal: "Gandevi Mandal",
    dateOfBirth: "1979-01-25",
    phoneNumber: "9725147534",
    email: "manhar.patel@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 8,
    name: "Amarbhai Vinodbhai Halpati",
    zone: "Gandevi",
    mandal: "Gandevi Mandal",
    dateOfBirth: "1986-04-17",
    phoneNumber: "7874704442",
    email: "amar.halpati@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 9,
    name: "Mahendrabhai Ravjibhai Patel",
    zone: "Gandevi",
    mandal: "Gandevi Mandal",
    dateOfBirth: "1981-08-30",
    phoneNumber: "9825933395",
    email: "mahendra.patel@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 10,
    name: "Dipakbhai Maganbhai Gamathiya",
    zone: "Gandevi",
    mandal: "Gandevi Mandal",
    dateOfBirth: "1984-06-12",
    phoneNumber: "9099845014",
    email: "dipak.gamathiya@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 11,
    name: "Satishbhai Ashokbhai Gandhi",
    zone: "Gandevi",
    mandal: "Gandevi Mandal",
    dateOfBirth: "1977-10-05",
    phoneNumber: "9974252880",
    email: "satish.gandhi@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 12,
    name: "Nileshbhai Mohanbhai Nayka",
    zone: "Gandevi",
    mandal: "Gandevi Mandal",
    dateOfBirth: "1985-02-28",
    phoneNumber: "7874200179",
    email: "nilesh.nayka@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 13,
    name: "Vinodbhai Dahyabhai Patel",
    zone: "Kaliyari",
    mandal: "Kaliyari Mandal",
    dateOfBirth: "1982-07-15",
    phoneNumber: "9909251612",
    email: "vinod.patel@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 14,
    name: "Sanjaybhai Govindbhai Patel",
    zone: "Kaliyari",
    mandal: "Kaliyari Mandal",
    dateOfBirth: "1980-11-20",
    phoneNumber: "9925347004",
    email: "sanjay.patel@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 15,
    name: "Jitendrabhai Govindbhai Patel",
    zone: "Kaliyari",
    mandal: "Kaliyari Mandal",
    dateOfBirth: "1983-03-08",
    phoneNumber: "8980881289",
    email: "jitendra.patel@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 16,
    name: "Vinodbhai Dhirubhai Patel",
    zone: "Khakhwada",
    mandal: "Khakhwada Mandal",
    dateOfBirth: "1979-09-25",
    phoneNumber: "+91 88499 58990",
    email: "vinod.dhiru@gmail.com",
  },
  {
    id: 17,
    name: "Rohanbhai Vinodbhai Patel",
    zone: "Khakhwada",
    mandal: "Khakhwada Mandal",
    dateOfBirth: "1988-01-14",
    phoneNumber: "+91 78781 83718",
    email: "rohan.patel@gmail.com",
  },
  {
    id: 18,
    name: "Nileshbhai Thakorbhai Halpati",
    zone: "Khakhwada",
    mandal: "Khakhwada Mandal",
    dateOfBirth: "1984-05-03",
    phoneNumber: "+91 96012 74885",
    email: "nilesh.halpati@gmail.com",
  },
  {
    id: 19,
    name: "Vinodbhai Karsanbhai Patel",
    zone: "Pathri",
    mandal: "Pathri Mandal",
    dateOfBirth: "1981-12-18",
    phoneNumber: "+91 85118 76008",
    email: "vinod.karsan@gmail.com",
  },
  {
    id: 20,
    name: "Deepkumar Pravinchandra Patel",
    zone: "Pathri",
    mandal: "Pathri Mandal",
    dateOfBirth: "1986-08-07",
    phoneNumber: "+91 99091 62728",
    email: "deep.patel@gmail.com",
  },

  // Dhakwada Mandal Members
  {
    id: 21,
    name: "Jagdishbhai Narsinhbhai Patel",
    zone: "Dhakwada",
    mandal: "Dhakwada Mandal",
    dateOfBirth: "1978-04-12",
    phoneNumber: "9825966506",
    email: "jagdish.patel@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 22,
    name: "Natubhai Chhotubhai Patel",
    zone: "Dhakwada",
    mandal: "Dhakwada Mandal",
    dateOfBirth: "1982-09-28",
    phoneNumber: "8200466150",
    email: "natu.patel@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 23,
    name: "Savanbhai Khandubhai Patel",
    zone: "Dhakwada",
    mandal: "Dhakwada Mandal",
    dateOfBirth: "1985-01-15",
    phoneNumber: "9979178378",
    email: "savan.patel@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 24,
    name: "Manharbhai Shantilal Patel",
    zone: "Dhakwada",
    mandal: "Dhakwada Mandal",
    dateOfBirth: "1980-06-22",
    phoneNumber: "6355437998",
    email: "manhar.shanti@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },
  {
    id: 25,
    name: "Pravinbhai Maganbhai Patel",
    zone: "Dhakwada",
    mandal: "Dhakwada Mandal",
    dateOfBirth: "1983-11-05",
    phoneNumber: "8469805105",
    email: "pravin.patel@gmail.com",
    address: "",
    dixaDate: "",
    category: "Sadbhav",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  },

  // Amalsad Mandal Members
  {
    id: 26,
    name: "Rameshbhai Manubhai Patel",
    zone: "Amalsad",
    mandal: "Amalsad Mandal",
    dateOfBirth: "1979-03-18",
    phoneNumber: "+91 89808 06403",
    email: "ramesh.patel@gmail.com",
  },
  {
    id: 27,
    name: "Kishorbhai Manubhai Patel",
    zone: "Amalsad",
    mandal: "Amalsad Mandal",
    dateOfBirth: "1982-07-25",
    phoneNumber: "+91 99099 21451",
    email: "kishor.patel@gmail.com",
  },
  {
    id: 28,
    name: "Divyeshbhai Mangubhai Patel",
    zone: "Amalsad",
    mandal: "Amalsad Mandal",
    dateOfBirth: "1984-12-08",
    phoneNumber: "+91 98791 45384",
    email: "divyesh.patel@gmail.com",
  },
  {
    id: 29,
    name: "Dipakbhai Amrutbhai Patel",
    zone: "Amalsad",
    mandal: "Amalsad Mandal",
    dateOfBirth: "1981-05-14",
    phoneNumber: "+91 96389 16913",
    email: "dipak.amrut@gmail.com",
  },
  {
    id: 30,
    name: "Ashwinbhai Satishbhai Patel",
    zone: "Amalsad",
    mandal: "Amalsad Mandal",
    dateOfBirth: "1987-10-02",
    phoneNumber: "+91 96995 51511",
    email: "ashwin.patel@gmail.com",
  },

  // Vapi Mandal Members
  {
    id: 31,
    name: "Ashishkumar Rasikbhai Patel",
    zone: "Vapi",
    mandal: "Vapi Mandal",
    dateOfBirth: "1985-02-14",
    phoneNumber: "+91 98795 23422",
    email: "ashish.patel@gmail.com",
  },
  {
    id: 32,
    name: "Vivekbhai Jayantibhai Daji",
    zone: "Vapi",
    mandal: "Vapi Mandal",
    dateOfBirth: "1980-08-19",
    phoneNumber: "+91 98986 15513",
    email: "vivek.daji@gmail.com",
  },
  {
    id: 33,
    name: "Vishalbhai Surendrabhai Mistry",
    zone: "Vapi",
    mandal: "Vapi Mandal",
    dateOfBirth: "1983-11-26",
    phoneNumber: "+91 78599 22892",
    email: "vishal.mistry@gmail.com",
  },
  {
    id: 34,
    name: "Tarakbhai Harshvardhanbhai Patel",
    zone: "Vapi",
    mandal: "Vapi Mandal",
    dateOfBirth: "1978-06-30",
    phoneNumber: "+91 94274 13345",
    email: "tarak.patel@gmail.com",
  },
  {
    id: 35,
    name: "Vimalbhai Sureshchandra Solanki",
    zone: "Vapi",
    mandal: "Vapi Mandal",
    dateOfBirth: "1986-04-08",
    phoneNumber: "+91 99131 23497",
    email: "vimal.solanki@gmail.com",
  },

  // Dharampur Mandal Members
  {
    id: 36,
    name: "Bhupatsinh Pratapsinh Parmar",
    zone: "Kharvel",
    mandal: "Dharampur Mandal",
    dateOfBirth: "1982-09-12",
    phoneNumber: "+91 99798 66602",
    email: "bhupat.parmar@gmail.com",
  },
  {
    id: 37,
    name: "Hareshbhai Gamanbhai Patel",
    zone: "Kharvel",
    mandal: "Dharampur Mandal",
    dateOfBirth: "1984-01-25",
    phoneNumber: "+91 95867 01814",
    email: "haresh.patel@gmail.com",
  },
  {
    id: 38,
    name: "Chhibubhai Durlabhbhai Solanki",
    zone: "Dharampur",
    mandal: "Dharampur Mandal",
    dateOfBirth: "1979-07-18",
    phoneNumber: "+91 95374 65549",
    email: "chhibu.solanki@gmail.com",
  },
  {
    id: 39,
    name: "Mohanbhai Chhaganbhai Solanki",
    zone: "Dharampur",
    mandal: "Dharampur Mandal",
    dateOfBirth: "1981-03-06",
    phoneNumber: "+91 99796 85642",
    email: "mohan.solanki@gmail.com",
  },
  {
    id: 40,
    name: "Bhadreshbhai Chhibubhai Solanki",
    zone: "Dharampur",
    mandal: "Dharampur Mandal",
    dateOfBirth: "1985-11-22",
    phoneNumber: "+91 95374 65549",
    email: "bhadresh.solanki@gmail.com",
  },

  // Valsad Mandal Members
  {
    id: 41,
    name: "Chidanandbhai Jinabhai Patel",
    zone: "Vasan",
    mandal: "Valsad Mandal",
    dateOfBirth: "1977-05-14",
    phoneNumber: "+91 98253 21564",
    email: "chidanand.patel@gmail.com",
  },
  {
    id: 42,
    name: "Ashokbhai Dhirubhai Patel",
    zone: "Dungri",
    mandal: "Valsad Mandal",
    dateOfBirth: "1983-08-27",
    phoneNumber: "+91 99740 02901",
    email: "ashok.dhiru@gmail.com",
  },
  {
    id: 43,
    name: "Viralbhai Harshadrai Joshi",
    zone: "Valsad",
    mandal: "Valsad Mandal",
    dateOfBirth: "1986-12-15",
    phoneNumber: "+91 90994 08308",
    email: "viral.joshi@gmail.com",
  },
  {
    id: 44,
    name: "Pareshbhai Mohanbhai Patel",
    zone: "Valsad",
    mandal: "Valsad Mandal",
    dateOfBirth: "1980-02-08",
    phoneNumber: "+91 98253 29998",
    email: "paresh.mohan@gmail.com",
  },
  {
    id: 45,
    name: "Tejasbhai Sureshchandra Pujara",
    zone: "Valsad",
    mandal: "Valsad Mandal",
    dateOfBirth: "1984-09-20",
    phoneNumber: "+91 94273 15007",
    email: "tejas.pujara@gmail.com",
  },

  // Additional members from other mandals
  {
    id: 46,
    name: "Mineshbhai Bhikhabhai Halpati",
    zone: "Ancheli",
    mandal: "Ancheli Mandal",
    dateOfBirth: "1982-04-16",
    phoneNumber: "+91 99799 42498",
    email: "minesh.halpati@gmail.com",
  },
  {
    id: 47,
    name: "Navnitbhai Nanubhai Talaviya",
    zone: "Samarawadi",
    mandal: "Samarawadi Mandal",
    dateOfBirth: "1980-07-30",
    phoneNumber: "+91 98798 89319",
    email: "navnit.talaviya@gmail.com",
  },
  {
    id: 48,
    name: "Maheshbhai Manubhai Patel",
    zone: "Kachholi",
    mandal: "Kacholi Mandal",
    dateOfBirth: "1983-10-12",
    phoneNumber: "+91 99138 60566",
    email: "mahesh.manu@gmail.com",
  },
  {
    id: 49,
    name: "Narendrabhai Chhanabhai Patel",
    zone: "Kesli",
    mandal: "Kesli Mandal",
    dateOfBirth: "1985-01-28",
    phoneNumber: "+91 99134 36001",
    email: "narendra.patel@gmail.com",
  },
  {
    id: 50,
    name: "Jayeshbhai Ramanbhai Patel",
    zone: "Kakadkuva",
    mandal: "Kakadkuva Mandal",
    dateOfBirth: "1979-06-18",
    phoneNumber: "+91 97731 86226",
    email: "jayesh.raman@gmail.com",
  },
].map(ensureMemberFields);

// Members API
export const membersAPI = {
  // Get all members
  async getAll(): Promise<Member[]> {
    await loadMembersFromExcel();
    return realMembers.map(ensureMemberFields);
  },

  // Get upcoming birthdays
  async getUpcomingBirthdays(days: number = 30): Promise<Member[]> {
    await loadMembersFromExcel();
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return realMembers
      .filter((member) => {
        const birthDate = new Date(member.dateOfBirth);
        if (isNaN(birthDate.getTime())) return false;
        const thisYear = new Date(
          today.getFullYear(),
          birthDate.getMonth(),
          birthDate.getDate(),
        );
        return thisYear >= today && thisYear <= futureDate;
      })
      .sort((a, b) => {
        const aDate = new Date(a.dateOfBirth);
        const bDate = new Date(b.dateOfBirth);
        const aNext = new Date(
          today.getFullYear(),
          aDate.getMonth(),
          aDate.getDate(),
        );
        const bNext = new Date(
          today.getFullYear(),
          bDate.getMonth(),
          bDate.getDate(),
        );
        return aNext.getTime() - bNext.getTime();
      })
      .map(ensureMemberFields);
  },

  // Add new member
  async create(member: Omit<Member, "id">): Promise<Member> {
    const newMember: Member = {
      ...member,
      id: Math.floor(Math.random() * 1000000), // Generate random ID
    };
    realMembers.push(newMember);
    return newMember;
  },

  // Bulk import members
  async bulkCreate(members: Omit<Member, "id">[]): Promise<Member[]> {
    const results = [];
    for (const member of members) {
      const result = await this.create(member);
      results.push(result);
    }
    return results;
  },

  // Update member
  async update(
    id: string,
    member: Partial<Omit<Member, "id">>,
  ): Promise<Member> {
    const index = realMembers.findIndex((m) => m.id === parseInt(id));
    if (index === -1) {
      throw new Error("Member not found");
    }
    realMembers[index] = { ...realMembers[index], ...member };
    return realMembers[index];
  },

  // Delete member
  async delete(id: string): Promise<void> {
    const index = realMembers.findIndex((m) => m.id === parseInt(id));
    if (index === -1) {
      throw new Error("Member not found");
    }
    realMembers.splice(index, 1);
  },

  // Transform database member to frontend member
  transformMember(dbMember: any): Member {
    return ensureMemberFields({
      id: parseInt(dbMember.id.replace(/-/g, "").substring(0, 8), 16),
      name: dbMember.name,
      zone: dbMember.zone,
      mandal: dbMember.mandal,
      dateOfBirth: dbMember.date_of_birth,
      phoneNumber: dbMember.phone_number,
      email: dbMember.email,
    });
  },
};

// Feedback API
export const feedbackAPI = {
  // Create feedback
  async create(feedback: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<any> {
    console.log("Feedback submitted:", feedback);
    return { message: "Feedback submitted successfully!" };
  },

  // Get all feedback (admin only)
  async getAll(): Promise<any[]> {
    return []; // Return empty array for demo
  },
};

// Seva (donations) in-memory store and API
import type { SevaRecord, SevaType } from "@shared/seva";
import { SEVA_TYPES } from "@shared/seva";

const defaultSevaRecord = (): SevaRecord => {
  const rec: Partial<SevaRecord> = {};
  for (const t of SEVA_TYPES) {
    rec[t as SevaType] = { amount: 0, date: "", note: "" };
  }
  return rec as SevaRecord;
};

const memberSevaStore: Record<number, SevaRecord> = {};

export const sevaAPI = {
  async getByMember(memberId: string): Promise<SevaRecord> {
    const id = parseInt(memberId, 10);
    if (!memberSevaStore[id]) memberSevaStore[id] = defaultSevaRecord();
    return JSON.parse(JSON.stringify(memberSevaStore[id]));
  },
  async update(memberId: string, data: SevaRecord): Promise<SevaRecord> {
    const id = parseInt(memberId, 10);
    memberSevaStore[id] = JSON.parse(JSON.stringify(data));
    return JSON.parse(JSON.stringify(memberSevaStore[id]));
  },
  types(): SevaType[] {
    return [...SEVA_TYPES];
  },
};

// Prasad packets in-memory store and API
import type { PrasadRecord } from "@shared/prasad";

let prasadStore: Record<string, PrasadRecord> | null = null;

const ensurePrasadSeeded = () => {
  if (prasadStore) return;
  prasadStore = {};
  const mandals = Array.from(new Set(realMembers.map((m) => m.mandal)));
  for (const mandal of mandals) {
    prasadStore[mandal] = {
      mandal,
      pouch: 0,
      smallBox: 0,
      bigBox: 0,
    };
  }
};

export const prasadAPI = {
  async getAll(): Promise<PrasadRecord[]> {
    ensurePrasadSeeded();
    return Object.values(prasadStore!);
  },
  async update(
    mandal: string,
    changes: Partial<Omit<PrasadRecord, "mandal">>,
  ): Promise<PrasadRecord> {
    ensurePrasadSeeded();
    const current = prasadStore![mandal] || {
      mandal,
      pouch: 0,
      smallBox: 0,
      bigBox: 0,
    };
    const updated: PrasadRecord = { ...current, ...changes } as PrasadRecord;
    prasadStore![mandal] = updated;
    return updated;
  },
};

// Users API
export const usersAPI = {
  // Authenticate user
  async authenticate(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    // Admin demo login
    if (email === "prabhuswami@gmail.com" && password === "Prabhu!23") {
      return {
        id: "1",
        email: "prabhuswami@gmail.com",
        name: "Prabhudarshan Swami",
        role: "admin",
      };
    }

    // Demo admin: sahipat / sahishnu
    if (email === "sahipat@gmail.com" && password === "sahishnu!23") {
      return {
        id: "2",
        email: "sahipat@gmail.com",
        name: "Sahishnu Patel",
        role: "admin",
      };
    }

    // Member read-only login: email matches member.email and password is name (letters only, lowercase) + !23
    const targetEmail = email.trim().toLowerCase();
    const member = realMembers.find(
      (m) => m.email.trim().toLowerCase() === targetEmail,
    );
    if (member) {
      const localPart = targetEmail.split("@")[0];
      const key = localPart.replace(/[^a-z]/g, "");
      const expected = `${key}!23`;
      if (password === expected) {
        return {
          id: String(member.id),
          email: member.email,
          name: member.name,
          role: "user",
        };
      }
    }

    return null; // Invalid credentials
  },

  // Create new user (admin only)
  async create(user: {
    email: string;
    password: string;
    role: "admin" | "user";
    name: string;
  }): Promise<AuthUser> {
    throw new Error("User creation not implemented in demo mode");
  },

  // Get all users (admin only)
  async getAll(): Promise<AuthUser[]> {
    return [
      {
        id: "1",
        email: "prabhuswami@gmail.com",
        name: "Prabhudarshan Swami",
        role: "admin",
      },
      {
        id: "2",
        email: "sahipat@gmail.com",
        name: "Sahishnu Patel",
        role: "admin",
      },
    ];
  },
};

// Stats API
export const statsAPI = {
  async getStats() {
    return {
      totalMembers: realMembers.length,
      totalZones: 5,
      totalMandals: 20,
      totalFeedback: 0,
    };
  },
};
