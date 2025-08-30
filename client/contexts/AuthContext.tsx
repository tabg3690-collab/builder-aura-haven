import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthUser } from "@shared/users";
import { usersAPI, membersAPI } from "@/lib/database";
// Check if Neon database is configured
const isNeonConfigured = !!import.meta.env.VITE_NEON_DATABASE_URL;

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  canEdit: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("haricharan_auth_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("haricharan_auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // If database is not configured, authenticate against members for read-only access
      if (!isNeonConfigured) {
        // Admin backdoor (optional)
        if (email === "admin@gmail.com" && password === "admin123") {
          const demoAdmin: AuthUser = {
            id: "demo-admin",
            email: "admin@gmail.com",
            role: "admin",
            name: "Demo Administrator",
          };
          setUser(demoAdmin);
          localStorage.setItem("haricharan_auth_user", JSON.stringify(demoAdmin));
          setIsLoading(false);
          return true;
        }

        const members = await membersAPI.getAll();
        const targetEmail = email.trim().toLowerCase();
        const member = members.find((m) => m.email.trim().toLowerCase() === targetEmail);
        if (member) {
          const key = member.name.toLowerCase().replace(/[^a-z]/g, "");
          const expected = `${key}!23`;
          if (password === expected) {
            const demoUser: AuthUser = {
              id: String(member.id),
              email: member.email,
              role: "user",
              name: member.name,
            };
            setUser(demoUser);
            localStorage.setItem("haricharan_auth_user", JSON.stringify(demoUser));
            setIsLoading(false);
            return true;
          }
        }
        setIsLoading(false);
        return false;
      }

      // Use database authentication
      const authenticatedUser = await usersAPI.authenticate(email, password);

      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem(
          "haricharan_auth_user",
          JSON.stringify(authenticatedUser),
        );
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("haricharan_auth_user");
  };

  const isAdmin = user?.role === "admin";
  const canEdit = user?.role === "admin";

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAdmin,
    canEdit,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // During development hot reload, context might be temporarily undefined
    console.warn(
      "useAuth called outside AuthProvider - this might be a hot reload issue",
    );
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
