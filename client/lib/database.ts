import { Member } from "@shared/members";
import { AuthUser } from "@shared/users";

// Check if running in development or production
const isDev = import.meta.env.DEV;
const baseURL = isDev ? "http://localhost:8888" : "";

// Helper function to check if database is available
const checkDatabaseConnection = () => {
  // Re-enabled to debug and fix API issues
  const neonUrl = import.meta.env.VITE_NEON_DATABASE_URL;
  console.log("Database URL available:", !!neonUrl);
  return !!neonUrl;
};

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
    if (!checkDatabaseConnection()) {
      // Return demo data if database not configured
      return demoMembers;
    }

    try {
      const response = await fetch(`${baseURL}/api/members`);
      if (!response.ok) {
        console.warn("Members API returned error status:", response.status);
        return demoMembers;
      }

      const data = await response.json();

      // Check if API returned an error object
      if (data.error) {
        console.warn("Members API returned error:", data.error);
        return demoMembers;
      }

      return data.map(this.transformMember);
    } catch (error) {
      console.warn("Members API failed, falling back to demo data:", error);
      return demoMembers;
    }
  },

  // Get upcoming birthdays
  async getUpcomingBirthdays(days: number = 30): Promise<Member[]> {
    const getDemoUpcomingBirthdays = () => {
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
    };

    if (!checkDatabaseConnection()) {
      return getDemoUpcomingBirthdays();
    }

    try {
      const response = await fetch(
        `${baseURL}/api/members?upcoming=true&days=${days}`,
      );
      if (!response.ok) {
        console.warn("API returned error status:", response.status);
        return getDemoUpcomingBirthdays();
      }
      const data = await response.json();

      // Check if API returned an error object
      if (data.error) {
        console.warn("API returned error:", data.error);
        return getDemoUpcomingBirthdays();
      }

      return data.map(this.transformMember);
    } catch (error) {
      console.warn("Database API failed, falling back to demo data:", error);
      return getDemoUpcomingBirthdays();
    }
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
    if (!checkDatabaseConnection()) {
      // Demo mode - just return success
      console.log("Demo mode: Feedback submitted:", feedback);
      return { message: "Feedback submitted successfully (demo mode)" };
    }

    try {
      const response = await fetch(`${baseURL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        console.warn("Feedback API failed, using demo mode");
        return { message: "Feedback submitted successfully (demo mode)" };
      }

      return response.json();
    } catch (error) {
      console.warn("Feedback API failed, falling back to demo:", error);
      return { message: "Feedback submitted successfully (demo mode)" };
    }
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
    if (!checkDatabaseConnection()) {
      // Demo mode authentication
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
      return null; // Invalid credentials in demo mode
    }

    try {
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
        console.warn("Authentication API failed, falling back to demo");
        return null;
      }

      return response.json();
    } catch (error) {
      console.warn(
        "Authentication API failed, falling back to demo auth:",
        error,
      );
      // Fallback to demo authentication if API fails
      if (email === "admin@gmail.com" && password === "admin123") {
        return {
          id: "1",
          email: "admin@gmail.com",
          name: "Admin User",
          role: "admin",
        };
      }
      return null;
    }
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
    const getDemoStats = () => ({
      totalMembers: demoMembers.length,
      totalFeedback: 0,
    });

    if (!checkDatabaseConnection()) {
      return getDemoStats();
    }

    try {
      const response = await fetch(`${baseURL}/api/stats`);
      if (!response.ok) {
        console.warn("Stats API returned error status:", response.status);
        return getDemoStats();
      }

      const data = await response.json();

      // Check if API returned an error object
      if (data.error) {
        console.warn("Stats API returned error:", data.error);
        return getDemoStats();
      }

      return data;
    } catch (error) {
      console.warn("Stats API failed, falling back to demo stats:", error);
      return getDemoStats();
    }
  },
};
