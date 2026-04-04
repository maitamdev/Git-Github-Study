import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">Trang bạn tìm không tồn tại</p>
      <Link href="/">
        <Button>Về trang chủ</Button>
      </Link>
    </div>
  );
}
