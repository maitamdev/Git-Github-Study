import { useGetMe, useLogout } from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { GitBranch, LogOut, User } from "lucide-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: user, isError } = useGetMe();
  const [, setLocation] = useLocation();
  const logout = useLogout();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isError) {
      setLocation("/login");
    }
  }, [isError, setLocation]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        setLocation("/login");
      }
    });
  };

  if (!user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Đang tải...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 z-10">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary font-bold text-xl hover:opacity-80 transition-opacity">
          <img src="/git-logo.png" alt="Git Logo" className="h-8" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium bg-secondary py-1 px-3 rounded-full">
            <User className="h-4 w-4" />
            {user.name}
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
