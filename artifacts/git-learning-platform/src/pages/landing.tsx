import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal } from "lucide-react";
import { useEffect } from "react";

export default function Landing() {
  const { data: user, isLoading } = useGetMe();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  // Removed isLoading check to ensure 0-second perceived parse time
  // Wait silently in background and redirect later if authenticated

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
      {/* Navbar */}
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md fixed top-0 w-full z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-2">
          <img src="/git-logo.png" alt="Git Logo" className="h-8" />
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:inline-flex font-medium">Đăng nhập</Button>
          </Link>
          <Link href="/register">
            <Button className="font-semibold shadow-sm">Đăng ký ngay</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl space-y-8 relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Nắm vững <span className="text-primary bg-clip-text">Git & GitHub</span> <br /> qua thực hành
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Học lập trình không dừng ở lý thuyết. Nền tảng đem lại trải nghiệm Giả lập Terminal và File System chân thực giúp bạn chinh phục Git mà không sợ hỏng máy tính.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg font-semibold w-full sm:w-auto shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                Bắt đầu học miễn phí <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold w-full sm:w-auto">
                Đã có tài khoản
              </Button>
            </Link>
          </div>
        </div>

        {/* Browser Mockup / Graphic */}
        <div className="mt-20 w-full max-w-5xl bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden relative z-10">
          <div className="flex items-center px-4 py-3 bg-secondary/30 border-b border-border/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="mx-auto bg-background/50 rounded-md text-xs text-muted-foreground px-12 py-1 font-mono">
              terminal - git-learning-platform
            </div>
          </div>
          <div className="relative aspect-[21/9] bg-background p-8 flex flex-col items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
             
             <div className="text-left w-full max-w-2xl mx-auto space-y-4 z-10 font-mono text-sm md:text-base">
               <div className="flex items-center gap-2 text-muted-foreground">
                 <span className="text-green-500">➜</span>
                 <span className="text-blue-400">~/projects/git-hero</span>
                 <span className="text-foreground">git init</span>
               </div>
               <div className="text-muted-foreground pl-4">Initialized empty Git repository in /projects/git-hero/.git/</div>
               
               <div className="flex items-center gap-2 text-muted-foreground mt-4">
                 <span className="text-green-500">➜</span>
                 <span className="text-blue-400">~/projects/git-hero</span>
                 <span className="text-yellow-500 font-bold">git status</span>
               </div>
               <div className="text-muted-foreground pl-4">On branch main<br/>No commits yet</div>
               
               <div className="flex flex-col gap-2 text-muted-foreground mt-4 items-center justify-center pt-8">
                 <Terminal className="h-12 w-12 text-primary/50 animate-pulse" />
               </div>
             </div>
          </div>
        </div>
      </main>
      
      {/* Background glow effects */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
    </div>
  );
}
