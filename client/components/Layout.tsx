import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-primary truncate max-w-[160px] sm:max-w-[260px]">
                  Haricharan Database
                </h1>
              </div>
              <div className="ml-2 sm:ml-6 flex space-x-4 sm:space-x-8 overflow-x-auto whitespace-nowrap">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-gray-700",
                    )
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/zones"
                  className={({ isActive }) =>
                    cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-gray-700",
                    )
                  }
                >
                  Zones
                </NavLink>
                <NavLink
                  to="/members"
                  className={({ isActive }) =>
                    cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-gray-700",
                    )
                  }
                >
                  Members
                </NavLink>
                <NavLink
                  to="/feedback"
                  className={({ isActive }) =>
                    cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-gray-700",
                    )
                  }
                >
                  Feedback
                </NavLink>
                {user?.role === "admin" && (
                  <NavLink
                    to="/seva"
                    className={({ isActive }) =>
                      cn(
                        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                        isActive
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-gray-700",
                      )
                    }
                  >
                    Seva
                  </NavLink>
                )}
                <NavLink
                  to="/prasad"
                  className={({ isActive }) =>
                    cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:border-gray-300 hover:text-gray-700",
                    )
                  }
                >
                  Prasad
                </NavLink>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:block">{user?.name}</span>
                    {user?.role === "admin" && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        Admin
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.role === "admin" && (
                    <>
                      <DropdownMenuItem className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Privileges</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
