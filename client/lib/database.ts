import { Member } from "@shared/members";
import { AuthUser } from "@shared/users";

// Using demo data only - no database connectivity needed

// Helper function to ensure all members have the new fields
const ensureMemberFields = (member: any): Member => {
  return {
    ...member,
    address: member.address || "",
    dixaDate: member.dixaDate || "",
    category: member.category || "Sadbhav",
    reference: member.reference || "",
    bloodGroup: member.bloodGroup || "",
    education: member.education || "",
    occupation: member.occupation || "",
    memberId: member.memberId || ""
  };
};

// Real member data from CSV

const realMembers: Member[] = [
  // Gandevi Mandal Members
  { id: 1, name: "Hiteshbhai Dahyabhai Rohit", zone: "Khergam", mandal: "Gandevi Mandal", dateOfBirth: "1982-03-15", phoneNumber: "9879906884", email: "hitesh.rohit@gmail.com", address: "", dixaDate: "", category: "Sadbhav", reference: "", bloodGroup: "", education: "", occupation: "", memberId: "" },
  { id: 2, name: "Subhashbhai Dahyabhai Rohit", zone: "Khergam", mandal: "Gandevi Mandal", dateOfBirth: "1985-07-22", phoneNumber: "9825718539", email: "subhash.rohit@gmail.com", address: "", dixaDate: "", category: "Sadbhav", reference: "", bloodGroup: "", education: "", occupation: "", memberId: "" },
  { id: 3, name: "Kikubhai Somabhai Rathod", zone: "Khergam", mandal: "Gandevi Mandal", dateOfBirth: "1978-11-08", phoneNumber: "9979775779", email: "kiku.rathod@gmail.com", address: "", dixaDate: "", category: "Sadbhav", reference: "", bloodGroup: "", education: "", occupation: "", memberId: "" },
  { id: 4, name: "Amratbhai Bhekabhai Halpati", zone: "Khergam", mandal: "Gandevi Mandal", dateOfBirth: "1980-12-03", phoneNumber: "7434075569", email: "amrat.halpati@gmail.com", address: "", dixaDate: "", category: "Sadbhav", reference: "", bloodGroup: "", education: "", occupation: "", memberId: "" },
  { id: 5, name: "Jigarbhai Ashokbhai Parmar", zone: "Duwada", mandal: "Gandevi Mandal", dateOfBirth: "1987-05-18", phoneNumber: "6353981850", email: "jigar.parmar@gmail.com", address: "", dixaDate: "", category: "Sadbhav", reference: "", bloodGroup: "", education: "", occupation: "", memberId: "" },
  { id: 6, name: "Maheshbhai Lalubhai Patel", zone: "Rahej", mandal: "Gandevi Mandal", dateOfBirth: "1983-09-14", phoneNumber: "9825393749", email: "mahesh.patel@gmail.com", address: "", dixaDate: "", category: "Sadbhav", reference: "", bloodGroup: "", education: "", occupation: "", memberId: "" },
  { id: 7, name: "Manharbhai Kantibhai Patel", zone: "Gandevi", mandal: "Gandevi Mandal", dateOfBirth: "1979-01-25", phoneNumber: "9725147534", email: "manhar.patel@gmail.com", address: "", dixaDate: "", category: "Sadbhav", reference: "", bloodGroup: "", education: "", occupation: "", memberId: "" },
  { id: 8, name: "Amarbhai Vinodbhai Halpati", zone: "Gandevi", mandal: "Gandevi Mandal", dateOfBirth: "1986-04-17", phoneNumber: "7874704442", email: "amar.halpati@gmail.com", address: "", dixaDate: "", category: "Sadbhav", reference: "", bloodGroup: "", education: "", occupation: "", memberId: "" },
  { id: 9, name: "Mahendrabhai Ravjibhai Patel", zone: "Gandevi", mandal: "Gandevi Mandal", dateOfBirth: "1981-08-30", phoneNumber: "9825933395", email: "mahendra.patel@gmail.com", address: "", dixaDate: "", category: "Sadbhav", reference: "", bloodGroup: "", education: "", occupation: "", memberId: "" },
  { id: 10, name: "Dipakbhai Maganbhai Gamathiya", zone: "Gandevi", mandal: "Gandevi Mandal", dateOfBirth: "1984-06-12", phoneNumber: "9099845014", email: "dipak.gamathiya@gmail.com", address: "", dixaDate: "", category: "Sadbhav", reference: "", bloodGroup: "", education: "", occupation: "", memberId: "" },
  { id: 11, name: "Satishbhai Ashokbhai Gandhi", zone: "Gandevi", mandal: "Gandevi Mandal", dateOfBirth: "1977-10-05", phoneNumber: "9974252880", email: "satish.gandhi@gmail.com", address: "", dixaDate: "", category: "Sadbhav", reference: "", bloodGroup: "", education: "", occupation: "", memberId: "" },
  { id: 12, name: "Nileshbhai Mohanbhai Nayka", zone: "Gandevi", mandal: "Gandevi Mandal", dateOfBirth: "1985-02-28", phoneNumber: "7874200179", email: "nilesh.nayka@gmail.com", address: "", dixaDate: "", category: "Sadbhav", reference: "", bloodGroup: "", education: "", occupation: "", memberId: "" },
  { id: 13, name: "Vinodbhai Dahyabhai Patel", zone: "Kaliyari", mandal: "Kaliyari Mandal", dateOfBirth: "1982-07-15", phoneNumber: "9909251612", email: "vinod.patel@gmail.com", address: "", dixaDate: "", category: "Sadbhav", reference: "", bloodGroup: "", education: "", occupation: "", memberId: "" },
  { id: 14, name: "Sanjaybhai Govindbhai Patel", zone: "Kaliyari", mandal: "Kaliyari Mandal", dateOfBirth: "1980-11-20", phoneNumber: "9925347004", email: "sanjay.patel@gmail.com", address: "", dixaDate: "", category: "Sadbhav", reference: "", bloodGroup: "", education: "", occupation: "", memberId: "" },
  { id: 15, name: "Jitendrabhai Govindbhai Patel", zone: "Kaliyari", mandal: "Kaliyari Mandal", dateOfBirth: "1983-03-08", phoneNumber: "8980881289", email: "jitendra.patel@gmail.com", address: "", dixaDate: "", category: "Sadbhav", reference: "", bloodGroup: "", education: "", occupation: "", memberId: "" },
  { id: 16, name: "Vinodbhai Dhirubhai Patel", zone: "Khakhwada", mandal: "Khakhwada Mandal", dateOfBirth: "1979-09-25", phoneNumber: "+91 88499 58990", email: "vinod.dhiru@gmail.com" },
  { id: 17, name: "Rohanbhai Vinodbhai Patel", zone: "Khakhwada", mandal: "Khakhwada Mandal", dateOfBirth: "1988-01-14", phoneNumber: "+91 78781 83718", email: "rohan.patel@gmail.com" },
  { id: 18, name: "Nileshbhai Thakorbhai Halpati", zone: "Khakhwada", mandal: "Khakhwada Mandal", dateOfBirth: "1984-05-03", phoneNumber: "+91 96012 74885", email: "nilesh.halpati@gmail.com" },
  { id: 19, name: "Vinodbhai Karsanbhai Patel", zone: "Pathri", mandal: "Pathri Mandal", dateOfBirth: "1981-12-18", phoneNumber: "+91 85118 76008", email: "vinod.karsan@gmail.com" },
  { id: 20, name: "Deepkumar Pravinchandra Patel", zone: "Pathri", mandal: "Pathri Mandal", dateOfBirth: "1986-08-07", phoneNumber: "+91 99091 62728", email: "deep.patel@gmail.com" },

  // Dhakwada Mandal Members
  { id: 21, name: "Jagdishbhai Narsinhbhai Patel", zone: "Dhakwada", mandal: "Dhakwada Mandal", dateOfBirth: "1978-04-12", phoneNumber: "+91 98259 66506", email: "jagdish.patel@gmail.com", address: "Main Road, Dhakwada", dixaDate: "2008-02-18", category: "ambrish", reference: "Narsinh Patel", bloodGroup: "O+", education: "Graduate", occupation: "Farmer", memberId: "DM001" },
  { id: 22, name: "Natubhai Chhotubhai Patel", zone: "Dhakwada", mandal: "Dhakwada Mandal", dateOfBirth: "1982-09-28", phoneNumber: "+91 82004 66150", email: "natu.patel@gmail.com", address: "Village Square, Dhakwada", dixaDate: "2010-06-12", category: "Karyakarta", reference: "Chhotu Patel", bloodGroup: "A+", education: "12th Pass", occupation: "Business", memberId: "DM002" },
  { id: 23, name: "Savanbhai Khandubhai Patel", zone: "Dhakwada", mandal: "Dhakwada Mandal", dateOfBirth: "1985-01-15", phoneNumber: "+91 99791 78378", email: "savan.patel@gmail.com", address: "New Area, Dhakwada", dixaDate: "2013-04-20", category: "Sadbhav", reference: "Khandu Patel", bloodGroup: "B+", education: "Graduate", occupation: "Service", memberId: "DM003" },
  { id: 24, name: "Manharbhai Shantilal Patel", zone: "Dhakwada", mandal: "Dhakwada Mandal", dateOfBirth: "1980-06-22", phoneNumber: "+91 63554 37998", email: "manhar.shanti@gmail.com", address: "Temple Road, Dhakwada", dixaDate: "2009-08-15", category: "ambrish", reference: "Shantilal Patel", bloodGroup: "AB+", education: "Graduate", occupation: "Government", memberId: "DM004" },
  { id: 25, name: "Pravinbhai Maganbhai Patel", zone: "Dhakwada", mandal: "Dhakwada Mandal", dateOfBirth: "1983-11-05", phoneNumber: "+91 84698 05105", email: "pravin.patel@gmail.com", address: "Station Area, Dhakwada", dixaDate: "2011-12-08", category: "Karyakarta", reference: "Magan Patel", bloodGroup: "O-", education: "Graduate", occupation: "Banking", memberId: "DM005" },

  // Amalsad Mandal Members
  { id: 26, name: "Rameshbhai Manubhai Patel", zone: "Amalsad", mandal: "Amalsad Mandal", dateOfBirth: "1979-03-18", phoneNumber: "+91 89808 06403", email: "ramesh.patel@gmail.com" },
  { id: 27, name: "Kishorbhai Manubhai Patel", zone: "Amalsad", mandal: "Amalsad Mandal", dateOfBirth: "1982-07-25", phoneNumber: "+91 99099 21451", email: "kishor.patel@gmail.com" },
  { id: 28, name: "Divyeshbhai Mangubhai Patel", zone: "Amalsad", mandal: "Amalsad Mandal", dateOfBirth: "1984-12-08", phoneNumber: "+91 98791 45384", email: "divyesh.patel@gmail.com" },
  { id: 29, name: "Dipakbhai Amrutbhai Patel", zone: "Amalsad", mandal: "Amalsad Mandal", dateOfBirth: "1981-05-14", phoneNumber: "+91 96389 16913", email: "dipak.amrut@gmail.com" },
  { id: 30, name: "Ashwinbhai Satishbhai Patel", zone: "Amalsad", mandal: "Amalsad Mandal", dateOfBirth: "1987-10-02", phoneNumber: "+91 96995 51511", email: "ashwin.patel@gmail.com" },

  // Vapi Mandal Members
  { id: 31, name: "Ashishkumar Rasikbhai Patel", zone: "Vapi", mandal: "Vapi Mandal", dateOfBirth: "1985-02-14", phoneNumber: "+91 98795 23422", email: "ashish.patel@gmail.com" },
  { id: 32, name: "Vivekbhai Jayantibhai Daji", zone: "Vapi", mandal: "Vapi Mandal", dateOfBirth: "1980-08-19", phoneNumber: "+91 98986 15513", email: "vivek.daji@gmail.com" },
  { id: 33, name: "Vishalbhai Surendrabhai Mistry", zone: "Vapi", mandal: "Vapi Mandal", dateOfBirth: "1983-11-26", phoneNumber: "+91 78599 22892", email: "vishal.mistry@gmail.com" },
  { id: 34, name: "Tarakbhai Harshvardhanbhai Patel", zone: "Vapi", mandal: "Vapi Mandal", dateOfBirth: "1978-06-30", phoneNumber: "+91 94274 13345", email: "tarak.patel@gmail.com" },
  { id: 35, name: "Vimalbhai Sureshchandra Solanki", zone: "Vapi", mandal: "Vapi Mandal", dateOfBirth: "1986-04-08", phoneNumber: "+91 99131 23497", email: "vimal.solanki@gmail.com" },

  // Dharampur Mandal Members
  { id: 36, name: "Bhupatsinh Pratapsinh Parmar", zone: "Kharvel", mandal: "Dharampur Mandal", dateOfBirth: "1982-09-12", phoneNumber: "+91 99798 66602", email: "bhupat.parmar@gmail.com" },
  { id: 37, name: "Hareshbhai Gamanbhai Patel", zone: "Kharvel", mandal: "Dharampur Mandal", dateOfBirth: "1984-01-25", phoneNumber: "+91 95867 01814", email: "haresh.patel@gmail.com" },
  { id: 38, name: "Chhibubhai Durlabhbhai Solanki", zone: "Dharampur", mandal: "Dharampur Mandal", dateOfBirth: "1979-07-18", phoneNumber: "+91 95374 65549", email: "chhibu.solanki@gmail.com" },
  { id: 39, name: "Mohanbhai Chhaganbhai Solanki", zone: "Dharampur", mandal: "Dharampur Mandal", dateOfBirth: "1981-03-06", phoneNumber: "+91 99796 85642", email: "mohan.solanki@gmail.com" },
  { id: 40, name: "Bhadreshbhai Chhibubhai Solanki", zone: "Dharampur", mandal: "Dharampur Mandal", dateOfBirth: "1985-11-22", phoneNumber: "+91 95374 65549", email: "bhadresh.solanki@gmail.com" },

  // Valsad Mandal Members
  { id: 41, name: "Chidanandbhai Jinabhai Patel", zone: "Vasan", mandal: "Valsad Mandal", dateOfBirth: "1977-05-14", phoneNumber: "+91 98253 21564", email: "chidanand.patel@gmail.com" },
  { id: 42, name: "Ashokbhai Dhirubhai Patel", zone: "Dungri", mandal: "Valsad Mandal", dateOfBirth: "1983-08-27", phoneNumber: "+91 99740 02901", email: "ashok.dhiru@gmail.com" },
  { id: 43, name: "Viralbhai Harshadrai Joshi", zone: "Valsad", mandal: "Valsad Mandal", dateOfBirth: "1986-12-15", phoneNumber: "+91 90994 08308", email: "viral.joshi@gmail.com" },
  { id: 44, name: "Pareshbhai Mohanbhai Patel", zone: "Valsad", mandal: "Valsad Mandal", dateOfBirth: "1980-02-08", phoneNumber: "+91 98253 29998", email: "paresh.mohan@gmail.com" },
  { id: 45, name: "Tejasbhai Sureshchandra Pujara", zone: "Valsad", mandal: "Valsad Mandal", dateOfBirth: "1984-09-20", phoneNumber: "+91 94273 15007", email: "tejas.pujara@gmail.com" },

  // Additional members from other mandals
  { id: 46, name: "Mineshbhai Bhikhabhai Halpati", zone: "Ancheli", mandal: "Ancheli Mandal", dateOfBirth: "1982-04-16", phoneNumber: "+91 99799 42498", email: "minesh.halpati@gmail.com" },
  { id: 47, name: "Navnitbhai Nanubhai Talaviya", zone: "Samarawadi", mandal: "Samarawadi Mandal", dateOfBirth: "1980-07-30", phoneNumber: "+91 98798 89319", email: "navnit.talaviya@gmail.com" },
  { id: 48, name: "Maheshbhai Manubhai Patel", zone: "Kachholi", mandal: "Kacholi Mandal", dateOfBirth: "1983-10-12", phoneNumber: "+91 99138 60566", email: "mahesh.manu@gmail.com" },
  { id: 49, name: "Narendrabhai Chhanabhai Patel", zone: "Kesli", mandal: "Kesli Mandal", dateOfBirth: "1985-01-28", phoneNumber: "+91 99134 36001", email: "narendra.patel@gmail.com" },
  { id: 50, name: "Jayeshbhai Ramanbhai Patel", zone: "Kakadkuva", mandal: "Kakadkuva Mandal", dateOfBirth: "1979-06-18", phoneNumber: "+91 97731 86226", email: "jayesh.raman@gmail.com" }
];

// Members API
export const membersAPI = {
  // Get all members
  async getAll(): Promise<Member[]> {
    return realMembers.map(ensureMemberFields);
  },

  // Get upcoming birthdays
  async getUpcomingBirthdays(days: number = 30): Promise<Member[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return realMembers.filter((member) => {
      const birthDate = new Date(member.dateOfBirth);
      const thisYear = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate(),
      );
      return thisYear >= today && thisYear <= futureDate;
    }).map(ensureMemberFields);
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
    return {
      id: parseInt(dbMember.id.replace(/-/g, "").substring(0, 8), 16), // Convert UUID to number for compatibility
      name: dbMember.name,
      zone: dbMember.zone,
      mandal: dbMember.mandal,
      dateOfBirth: dbMember.date_of_birth,
      phoneNumber: dbMember.phone_number,
      email: dbMember.email,
    };
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

// Users API
export const usersAPI = {
  // Authenticate user
  async authenticate(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    // Demo authentication
    if (email === "prabhuswami@gmail.com" && password === "Prabhu!23") {
      return {
        id: "1",
        email: "prabhuswami@gmail.com",
        name: "Prabhudarshan Swami",
        role: "admin",
      };
    }
    if (email === "sahipat@gmail.com" && password === "sahishnu!23") {
      return {
        id: "2",
        email: "sahipat@gmail.com",
        name: "Sahishnu Patel",
        role: "user",
      };
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
        role: "user",
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
