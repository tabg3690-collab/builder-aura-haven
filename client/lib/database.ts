import { Member } from "@shared/members";
import { AuthUser } from "@shared/users";

// Check if running in development or production
const isDev = import.meta.env.DEV;
const baseURL = isDev ? "http://localhost:8888" : "";

// Helper function to check if database is available
const checkDatabaseConnection = () => {
  const neonUrl = import.meta.env.VITE_NEON_DATABASE_URL;
  return !!neonUrl;
};

// Demo data for fallback
const demoMembers: Member[] = [
  {
    id: 1,
    name: "Rajesh Patel",
    zone: "Vapi",
    mandal: "Vapi Central",
    dateOfBirth: "1985-03-15",
    phoneNumber: "+91 98765 43210",
    email: "rajesh.patel@gmail.com"
  },
  {
    id: 2,
    name: "Priya Shah",
    zone: "Gandevi",
    mandal: "Gandevi North",
    dateOfBirth: "1990-07-22",
    phoneNumber: "+91 87654 32109",
    email: "priya.shah@gmail.com"
  },
  {
    id: 3,
    name: "Amit Kumar",
    zone: "Valsad",
    mandal: "Valsad East",
    dateOfBirth: "1988-11-08",
    phoneNumber: "+91 76543 21098",
    email: "amit.kumar@gmail.com"
  }
];

// Members API
export const membersAPI = {
  // Get all members
  async getAll(): Promise<Member[]> {
    if (!checkDatabaseConnection()) {
      // Return demo data if database not configured
      return demoMembers;
    }

    try {
      const response = await fetch(`${baseURL}/api/members`);
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      const data = await response.json();
      return data.map(this.transformMember);
    } catch (error) {
      console.warn("Database API failed, falling back to demo data:", error);
      return demoMembers;
    }
  },

  // Get upcoming birthdays
  async getUpcomingBirthdays(days: number = 30): Promise<Member[]> {
    checkDatabaseConnection();
    const response = await fetch(
      `${baseURL}/api/members?upcoming=true&days=${days}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch upcoming birthdays");
    }
    const data = await response.json();
    return data.map(this.transformMember);
  },

  // Add new member
  async create(member: Omit<Member, "id">): Promise<Member> {
    checkDatabaseConnection();
    const response = await fetch(`${baseURL}/api/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: member.name,
        zone: member.zone,
        mandal: member.mandal,
        dateOfBirth: member.dateOfBirth,
        phoneNumber: member.phoneNumber,
        email: member.email,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create member");
    }

    const data = await response.json();
    return this.transformMember(data);
  },

  // Bulk import members
  async bulkCreate(members: Omit<Member, "id">[]): Promise<Member[]> {
    checkDatabaseConnection();
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
    checkDatabaseConnection();
    const response = await fetch(`${baseURL}/api/members?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(member),
    });

    if (!response.ok) {
      throw new Error("Failed to update member");
    }

    const data = await response.json();
    return this.transformMember(data);
  },

  // Delete member
  async delete(id: string): Promise<void> {
    checkDatabaseConnection();
    const response = await fetch(`${baseURL}/api/members?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete member");
    }
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
    checkDatabaseConnection();
    const response = await fetch(`${baseURL}/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      throw new Error("Failed to submit feedback");
    }

    return response.json();
  },

  // Get all feedback (admin only)
  async getAll(): Promise<any[]> {
    checkDatabaseConnection();
    const response = await fetch(`${baseURL}/api/feedback`);
    if (!response.ok) {
      throw new Error("Failed to fetch feedback");
    }
    return response.json();
  },
};

// Users API
export const usersAPI = {
  // Authenticate user
  async authenticate(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    checkDatabaseConnection();
    const response = await fetch(`${baseURL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Authentication failed");
    }

    return response.json();
  },

  // Create new user (admin only)
  async create(user: {
    email: string;
    password: string;
    role: "admin" | "user";
    name: string;
  }): Promise<AuthUser> {
    // This would need to be implemented as a separate function
    throw new Error("User creation not implemented yet");
  },

  // Get all users (admin only)
  async getAll(): Promise<AuthUser[]> {
    checkDatabaseConnection();
    const response = await fetch(`${baseURL}/api/auth/users`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.json();
  },
};

// Stats API
export const statsAPI = {
  async getStats() {
    checkDatabaseConnection();
    const response = await fetch(`${baseURL}/api/stats`);
    if (!response.ok) {
      throw new Error("Failed to fetch stats");
    }
    return response.json();
  },
};
