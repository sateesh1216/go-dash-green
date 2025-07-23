import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { User } from '@/types/auth';
import LoginForm from '@/components/LoginForm';
import AdminDashboard from '@/pages/AdminDashboard';
import UserDashboard from '@/pages/UserDashboard';
import NotFound from "./pages/NotFound";
import { useToast } from '@/hooks/use-toast';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    if (email === 'admin@taxi.com' && password === 'admin123') {
      setUser({ id: '1', email: 'admin@taxi.com', role: 'admin', name: 'Admin User' });
      toast({ title: "Login Successful", description: "Welcome to Admin Dashboard!" });
    } else if (email === 'user@taxi.com' && password === 'user123') {
      setUser({ id: '2', email: 'user@taxi.com', role: 'user', name: 'Driver User' });
      toast({ title: "Login Successful", description: "Welcome to Driver Dashboard!" });
    } else {
      toast({ title: "Login Failed", description: "Invalid credentials.", variant: "destructive" });
      throw new Error('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setUser(null);
    toast({ title: "Logged Out", description: "Successfully logged out." });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!user ? (
            <LoginForm onLogin={handleLogin} />
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  user.role === 'admin' ? (
                    <AdminDashboard user={user} onLogout={handleLogout} />
                  ) : (
                    <UserDashboard user={user} onLogout={handleLogout} />
                  )
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
