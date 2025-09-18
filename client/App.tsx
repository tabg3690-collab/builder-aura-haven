import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Setup from "./pages/Setup";
import Zones from "./pages/Zones";
import Members from "./pages/Members";
import AddMember from "./pages/AddMember";
import ImportMembers from "./pages/ImportMembers";
import EditMember from "./pages/EditMember";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";
import DebugTest from "./pages/DebugTest";
import Seva from "./pages/Seva";
import Prasad from "./pages/Prasad";
import ApiTest from "./pages/ApiTest";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/api-test" element={<ApiTest />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="test-dashboard" element={<Dashboard />} />
              <Route path="debug" element={<DebugTest />} />
              <Route path="zones" element={<Zones />} />
              <Route path="members" element={<Members />} />
              <Route
                path="seva"
                element={
                  <ProtectedRoute requireAdmin>
                    <Seva />
                  </ProtectedRoute>
                }
              />
              <Route path="prasad" element={<Prasad />} />
              <Route
                path="members/add"
                element={
                  <ProtectedRoute requireAdmin>
                    <AddMember />
                  </ProtectedRoute>
                }
              />
              <Route
                path="members/import"
                element={
                  <ProtectedRoute requireAdmin>
                    <ImportMembers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="members/:id/edit"
                element={
                  <ProtectedRoute requireAdmin>
                    <EditMember />
                  </ProtectedRoute>
                }
              />
              <Route path="feedback" element={<Feedback />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")! as any;
if (!container.__root) {
  container.__root = createRoot(container);
}
container.__root.render(<App />);
