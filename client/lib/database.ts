import { Member } from "@shared/members";
import { AuthUser } from "@shared/users";

// Using demo data only - no database connectivity needed

// Demo data for fallback
const getNextWeekDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split("T")[0];
};

const demoMembers: Member[] = [
  {
    id: 1,
    name: "Rajesh Patel",
    zone: "Vapi",
    mandal: "Vapi Central",
    dateOfBirth: "1985-03-15",
    phoneNumber: "+91 98765 43210",
    email: "rajesh.patel@gmail.com",
  },
  {
    id: 2,
    name: "Priya Shah",
    zone: "Gandevi",
    mandal: "Gandevi North",
    dateOfBirth: getNextWeekDate(), // This will show as upcoming birthday
    phoneNumber: "+91 87654 32109",
    email: "priya.shah@gmail.com",
  },
  {
    id: 3,
    name: "Amit Kumar",
    zone: "Valsad",
    mandal: "Valsad East",
    dateOfBirth: "1988-11-08",
    phoneNumber: "+91 76543 21098",
    email: "amit.kumar@gmail.com",
  },
  {
    id: 4,
    name: "Kavita Desai",
    zone: "Dharampur",
    mandal: "Dharampur West",
    dateOfBirth: "1992-12-03",
    phoneNumber: "+91 65432 10987",
    email: "kavita.desai@gmail.com",
  },
  {
    id: 5,
    name: "Suresh Mehta",
    zone: "Amalsad",
    mandal: "Amalsad South",
    dateOfBirth: "1987-05-18",
    phoneNumber: "+91 54321 09876",
    email: "suresh.mehta@gmail.com",
  },
];

// Members API
export const membersAPI = {
  // Get all members
  async getAll(): Promise<Member[]> {
    return demoMembers;
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
    if (email === "admin@gmail.com" && password === "admin123") {
      return {
        id: "1",
        email: "admin@gmail.com",
        name: "Admin User",
        role: "admin",
      };
    }
    if (email === "user@gmail.com" && password === "user123") {
      return {
        id: "2",
        email: "user@gmail.com",
        name: "Demo User",
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
        email: "admin@gmail.com",
        name: "Admin User",
        role: "admin",
      },
      {
        id: "2",
        email: "user@gmail.com",
        name: "Demo User",
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
