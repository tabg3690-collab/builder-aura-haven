import { Member } from "@shared/members";
import { AuthUser } from "@shared/users";

// Using demo data only - no database connectivity needed

// Demo data for fallback
const getNextWeekDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split("T")[0];
};

const realMembers: Member[] = [
  // Gandevi Mandal Members
  { id: 1, name: "Hiteshbhai Dahyabhai Rohit", zone: "Khergam", mandal: "Gandevi Mandal", dateOfBirth: "1982-03-15", phoneNumber: "+91 98799 06884", email: "hitesh.rohit@gmail.com" },
  { id: 2, name: "Subhashbhai Dahyabhai Rohit", zone: "Khergam", mandal: "Gandevi Mandal", dateOfBirth: "1985-07-22", phoneNumber: "+91 98257 18539", email: "subhash.rohit@gmail.com" },
  { id: 3, name: "Kikubhai Somabhai Rathod", zone: "Khergam", mandal: "Gandevi Mandal", dateOfBirth: "1978-11-08", phoneNumber: "+91 99797 75779", email: "kiku.rathod@gmail.com" },
  { id: 4, name: "Amratbhai Bhekabhai Halpati", zone: "Khergam", mandal: "Gandevi Mandal", dateOfBirth: "1980-12-03", phoneNumber: "+91 74340 75569", email: "amrat.halpati@gmail.com" },
  { id: 5, name: "Jigarbhai Ashokbhai Parmar", zone: "Duwada", mandal: "Gandevi Mandal", dateOfBirth: "1987-05-18", phoneNumber: "+91 63539 81850", email: "jigar.parmar@gmail.com" },
  { id: 6, name: "Maheshbhai Lalubhai Patel", zone: "Rahej", mandal: "Gandevi Mandal", dateOfBirth: "1983-09-14", phoneNumber: "+91 98253 93749", email: "mahesh.patel@gmail.com" },
  { id: 7, name: "Manharbhai Kantibhai Patel", zone: "Gandevi", mandal: "Gandevi Mandal", dateOfBirth: "1979-01-25", phoneNumber: "+91 97251 47534", email: "manhar.patel@gmail.com" },
  { id: 8, name: "Amarbhai Vinodbhai Halpati", zone: "Gandevi", mandal: "Gandevi Mandal", dateOfBirth: "1986-04-17", phoneNumber: "+91 78747 04442", email: "amar.halpati@gmail.com" },
  { id: 9, name: "Mahendrabhai Ravjibhai Patel", zone: "Gandevi", mandal: "Gandevi Mandal", dateOfBirth: "1981-08-30", phoneNumber: "+91 98259 33395", email: "mahendra.patel@gmail.com" },
  { id: 10, name: "Dipakbhai Maganbhai Gamathiya", zone: "Gandevi", mandal: "Gandevi Mandal", dateOfBirth: "1984-06-12", phoneNumber: "+91 90998 45014", email: "dipak.gamathiya@gmail.com" },
  { id: 11, name: "Satishbhai Ashokbhai Gandhi", zone: "Gandevi", mandal: "Gandevi Mandal", dateOfBirth: "1977-10-05", phoneNumber: "+91 99742 52880", email: "satish.gandhi@gmail.com" },
  { id: 12, name: "Nileshbhai Mohanbhai Nayka", zone: "Gandevi", mandal: "Gandevi Mandal", dateOfBirth: "1985-02-28", phoneNumber: "+91 78742 00179", email: "nilesh.nayka@gmail.com" },
  { id: 13, name: "Vinodbhai Dahyabhai Patel", zone: "Kaliyari", mandal: "Kaliyari Mandal", dateOfBirth: "1982-07-15", phoneNumber: "+91 99092 51612", email: "vinod.patel@gmail.com" },
  { id: 14, name: "Sanjaybhai Govindbhai Patel", zone: "Kaliyari", mandal: "Kaliyari Mandal", dateOfBirth: "1980-11-20", phoneNumber: "+91 99253 47004", email: "sanjay.patel@gmail.com" },
  { id: 15, name: "Jitendrabhai Govindbhai Patel", zone: "Kaliyari", mandal: "Kaliyari Mandal", dateOfBirth: "1983-03-08", phoneNumber: "+91 89808 81289", email: "jitendra.patel@gmail.com" },
  { id: 16, name: "Vinodbhai Dhirubhai Patel", zone: "Khakhwada", mandal: "Khakhwada Mandal", dateOfBirth: "1979-09-25", phoneNumber: "+91 88499 58990", email: "vinod.dhiru@gmail.com" },
  { id: 17, name: "Rohanbhai Vinodbhai Patel", zone: "Khakhwada", mandal: "Khakhwada Mandal", dateOfBirth: "1988-01-14", phoneNumber: "+91 78781 83718", email: "rohan.patel@gmail.com" },
  { id: 18, name: "Nileshbhai Thakorbhai Halpati", zone: "Khakhwada", mandal: "Khakhwada Mandal", dateOfBirth: "1984-05-03", phoneNumber: "+91 96012 74885", email: "nilesh.halpati@gmail.com" },
  { id: 19, name: "Vinodbhai Karsanbhai Patel", zone: "Pathri", mandal: "Pathri Mandal", dateOfBirth: "1981-12-18", phoneNumber: "+91 85118 76008", email: "vinod.karsan@gmail.com" },
  { id: 20, name: "Deepkumar Pravinchandra Patel", zone: "Pathri", mandal: "Pathri Mandal", dateOfBirth: "1986-08-07", phoneNumber: "+91 99091 62728", email: "deep.patel@gmail.com" },

  // Dhakwada Mandal Members
  { id: 21, name: "Jagdishbhai Narsinhbhai Patel", zone: "Dhakwada", mandal: "Dhakwada Mandal", dateOfBirth: "1978-04-12", phoneNumber: "+91 98259 66506", email: "jagdish.patel@gmail.com" },
  { id: 22, name: "Natubhai Chhotubhai Patel", zone: "Dhakwada", mandal: "Dhakwada Mandal", dateOfBirth: "1982-09-28", phoneNumber: "+91 82004 66150", email: "natu.patel@gmail.com" },
  { id: 23, name: "Savanbhai Khandubhai Patel", zone: "Dhakwada", mandal: "Dhakwada Mandal", dateOfBirth: "1985-01-15", phoneNumber: "+91 99791 78378", email: "savan.patel@gmail.com" },
  { id: 24, name: "Manharbhai Shantilal Patel", zone: "Dhakwada", mandal: "Dhakwada Mandal", dateOfBirth: "1980-06-22", phoneNumber: "+91 63554 37998", email: "manhar.shanti@gmail.com" },
  { id: 25, name: "Pravinbhai Maganbhai Patel", zone: "Dhakwada", mandal: "Dhakwada Mandal", dateOfBirth: "1983-11-05", phoneNumber: "+91 84698 05105", email: "pravin.patel@gmail.com" },

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
    return realMembers;
  },

  // Get upcoming birthdays
  async getUpcomingBirthdays(days: number = 30): Promise<Member[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return demoMembers.filter((member) => {
      const birthDate = new Date(member.dateOfBirth);
      const thisYear = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate(),
      );
      return thisYear >= today && thisYear <= futureDate;
    });
  },

  // Add new member
  async create(member: Omit<Member, "id">): Promise<Member> {
    const newMember: Member = {
      ...member,
      id: Math.floor(Math.random() * 1000000), // Generate random ID
    };
    demoMembers.push(newMember);
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
    const index = demoMembers.findIndex((m) => m.id === parseInt(id));
    if (index === -1) {
      throw new Error("Member not found");
    }
    demoMembers[index] = { ...demoMembers[index], ...member };
    return demoMembers[index];
  },

  // Delete member
  async delete(id: string): Promise<void> {
    const index = demoMembers.findIndex((m) => m.id === parseInt(id));
    if (index === -1) {
      throw new Error("Member not found");
    }
    demoMembers.splice(index, 1);
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
      totalMembers: demoMembers.length,
      totalZones: 5,
      totalMandals: 20,
      totalFeedback: 0,
    };
  },
};
