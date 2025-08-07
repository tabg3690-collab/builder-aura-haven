import { supabase, DatabaseMember, DatabaseFeedback, DatabaseUser, isSupabaseConfigured } from './supabase';
import { Member } from '@shared/members';
import { AuthUser } from '@shared/users';

// Helper function to check if database is available
const checkDatabaseConnection = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Database not configured. Please set up your Supabase credentials in the .env file.');
  }
};

// Members API
export const membersAPI = {
  // Get all members
  async getAll(): Promise<Member[]> {
    checkDatabaseConnection();
    const { data, error } = await supabase!
      .from('members')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching members:', error);
      throw new Error('Failed to fetch members');
    }

    return (data || []).map(this.transformMember);
  },

  // Get upcoming birthdays
  async getUpcomingBirthdays(days: number = 30): Promise<Member[]> {
    checkDatabaseConnection();
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const { data, error } = await supabase!
      .from('members')
      .select('*')
      .order('date_of_birth');

    if (error) {
      console.error('Error fetching upcoming birthdays:', error);
      throw new Error('Failed to fetch upcoming birthdays');
    }

    if (!data) return [];

    // Filter birthdays in the next specified days
    return data
      .map(this.transformMember)
      .filter(member => {
        const birthDate = new Date(member.dateOfBirth);
        const currentYear = today.getFullYear();
        const thisYearBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
        const nextYearBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
        
        const daysUntilThisYear = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const daysUntilNextYear = Math.ceil((nextYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        return (daysUntilThisYear >= 0 && daysUntilThisYear <= days) || 
               (daysUntilThisYear < 0 && daysUntilNextYear <= days);
      })
      .sort((a, b) => {
        const birthDateA = new Date(a.dateOfBirth);
        const birthDateB = new Date(b.dateOfBirth);
        const currentYear = today.getFullYear();
        const thisYearBirthdayA = new Date(currentYear, birthDateA.getMonth(), birthDateA.getDate());
        const thisYearBirthdayB = new Date(currentYear, birthDateB.getMonth(), birthDateB.getDate());
        
        const effectiveDateA = thisYearBirthdayA < today ? 
          new Date(currentYear + 1, birthDateA.getMonth(), birthDateA.getDate()) : thisYearBirthdayA;
        const effectiveDateB = thisYearBirthdayB < today ? 
          new Date(currentYear + 1, birthDateB.getMonth(), birthDateB.getDate()) : thisYearBirthdayB;
        
        return effectiveDateA.getTime() - effectiveDateB.getTime();
      });
  },

  // Add new member
  async create(member: Omit<Member, 'id'>): Promise<Member> {
    checkDatabaseConnection();
    const { data, error } = await supabase!
      .from('members')
      .insert([{
        name: member.name,
        zone: member.zone,
        mandal: member.mandal,
        date_of_birth: member.dateOfBirth,
        phone_number: member.phoneNumber,
        email: member.email
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating member:', error);
      throw new Error('Failed to create member');
    }

    return this.transformMember(data);
  },

  // Bulk import members
  async bulkCreate(members: Omit<Member, 'id'>[]): Promise<Member[]> {
    checkDatabaseConnection();
    const membersData = members.map(member => ({
      name: member.name,
      zone: member.zone,
      mandal: member.mandal,
      date_of_birth: member.dateOfBirth,
      phone_number: member.phoneNumber,
      email: member.email
    }));

    const { data, error } = await supabase
      .from('members')
      .insert(membersData)
      .select();

    if (error) {
      console.error('Error bulk creating members:', error);
      throw new Error('Failed to import members');
    }

    return (data || []).map(this.transformMember);
  },

  // Update member
  async update(id: string, member: Partial<Omit<Member, 'id'>>): Promise<Member> {
    const updateData: Partial<DatabaseMember> = {};
    
    if (member.name) updateData.name = member.name;
    if (member.zone) updateData.zone = member.zone;
    if (member.mandal) updateData.mandal = member.mandal;
    if (member.dateOfBirth) updateData.date_of_birth = member.dateOfBirth;
    if (member.phoneNumber) updateData.phone_number = member.phoneNumber;
    if (member.email) updateData.email = member.email;
    
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('members')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating member:', error);
      throw new Error('Failed to update member');
    }

    return this.transformMember(data);
  },

  // Delete member
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting member:', error);
      throw new Error('Failed to delete member');
    }
  },

  // Transform database member to frontend member
  transformMember(dbMember: DatabaseMember): Member {
    return {
      id: parseInt(dbMember.id.replace(/-/g, '').substring(0, 8), 16), // Convert UUID to number for compatibility
      name: dbMember.name,
      zone: dbMember.zone,
      mandal: dbMember.mandal,
      dateOfBirth: dbMember.date_of_birth,
      phoneNumber: dbMember.phone_number,
      email: dbMember.email
    };
  }
};

// Feedback API
export const feedbackAPI = {
  // Create feedback
  async create(feedback: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<DatabaseFeedback> {
    const { data, error } = await supabase
      .from('feedback')
      .insert([feedback])
      .select()
      .single();

    if (error) {
      console.error('Error creating feedback:', error);
      throw new Error('Failed to submit feedback');
    }

    return data;
  },

  // Get all feedback (admin only)
  async getAll(): Promise<DatabaseFeedback[]> {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching feedback:', error);
      throw new Error('Failed to fetch feedback');
    }

    return data || [];
  }
};

// Users API
export const usersAPI = {
  // Authenticate user
  async authenticate(email: string, password: string): Promise<AuthUser | null> {
    // In a real implementation, you would hash the password and compare
    // For now, we'll use a simple comparison (NOT SECURE - implement proper hashing)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    // TODO: Implement proper password hashing comparison
    // For demo purposes, we'll compare plain text (NEVER do this in production)
    if (this.verifyPassword(password, data.password_hash)) {
      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id);

      return {
        id: data.id,
        email: data.email,
        role: data.role,
        name: data.name
      };
    }

    return null;
  },

  // Create new user (admin only)
  async create(user: {
    email: string;
    password: string;
    role: 'admin' | 'user';
    name: string;
  }): Promise<AuthUser> {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: user.email,
        password_hash: this.hashPassword(user.password), // TODO: Implement proper hashing
        role: user.role,
        name: user.name
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }

    return {
      id: data.id,
      email: data.email,
      role: data.role,
      name: data.name
    };
  },

  // Get all users (admin only)
  async getAll(): Promise<AuthUser[]> {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role, name, created_at')
      .order('created_at');

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }

    return data || [];
  },

  // Simple password hashing (implement proper bcrypt in production)
  hashPassword(password: string): string {
    // TODO: Implement proper password hashing with bcrypt
    return password; // NEVER do this in production
  },

  // Simple password verification (implement proper bcrypt in production)
  verifyPassword(password: string, hash: string): boolean {
    // TODO: Implement proper password verification with bcrypt
    return password === hash; // NEVER do this in production
  }
};

// Stats API
export const statsAPI = {
  async getStats() {
    const [membersCount, zonesCount, feedbackCount] = await Promise.all([
      supabase.from('members').select('id', { count: 'exact' }),
      supabase.from('members').select('zone', { count: 'exact' }).group('zone'),
      supabase.from('feedback').select('id', { count: 'exact' })
    ]);

    return {
      totalMembers: membersCount.count || 0,
      totalZones: 5, // Fixed number as we have specific zones
      totalMandals: 20, // Fixed number as calculated before
      totalFeedback: feedbackCount.count || 0
    };
  }
};
