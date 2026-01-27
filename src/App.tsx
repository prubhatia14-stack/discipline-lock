import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChallengeProvider } from "@/context/ChallengeContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import Stakes from "./pages/Stakes";
import Profile from "./pages/Profile";
import Share from "./pages/Share";
import Settings from "./pages/Settings";
import Wallet from "./pages/Wallet";
import Challenges from "./pages/Challenges";
import AuditRules from "./pages/AuditRules";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import { RequireAuth } from "@/components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ChallengeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route
                path="/onboarding"
                element={
                  <RequireAuth>
                    <Onboarding />
                  </RequireAuth>
                }
              />
              <Route
                path="/logs"
                element={
                  <RequireAuth>
                    <Logs />
                  </RequireAuth>
                }
              />
              <Route
                path="/stakes"
                element={
                  <RequireAuth>
                    <Stakes />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path="/share"
                element={
                  <RequireAuth>
                    <Share />
                  </RequireAuth>
                }
              />
              <Route
                path="/settings"
                element={
                  <RequireAuth>
                    <Settings />
                  </RequireAuth>
                }
              />
              <Route
                path="/wallet"
                element={
                  <RequireAuth>
                    <Wallet />
                  </RequireAuth>
                }
              />
              <Route
                path="/challenges"
                element={
                  <RequireAuth>
                    <Challenges />
                  </RequireAuth>
                }
              />
              <Route
                path="/audit-rules"
                element={
                  <RequireAuth>
                    <AuditRules />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ChallengeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
