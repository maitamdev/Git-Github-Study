import Layout from "@/components/layout";
import { useListCourses, useGetProgress } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, Trophy, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const levelMap: Record<string, string> = {
  beginner: "Cơ bản",
  intermediate: "Trung cấp",
  advanced: "Nâng cao",
};

export default function Home() {
  const { data: courses, isLoading: isLoadingCourses } = useListCourses();
  const { data: progress, isLoading: isLoadingProgress } = useGetProgress();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto w-full p-8 space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Lộ Trình Học Tập</h1>
          <p className="text-muted-foreground text-lg">Chinh phục Git từ lệnh cơ bản đến quy trình nâng cao.</p>
        </div>

        {progress && (
          <div className="bg-secondary/50 rounded-lg p-6 border border-border flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Tiến Độ Tổng Thể</h2>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                Đã hoàn thành {progress.completedLessons}/{progress.totalLessons} bài học
              </div>
            </div>
            <div className="w-1/3 flex items-center gap-4">
              <div className="flex-1">
                <Progress value={progress.progressPercent} className="h-3" />
              </div>
              <span className="font-bold text-lg">{Math.round(progress.progressPercent)}%</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingCourses ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="flex flex-col h-full bg-card/50">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="flex-1">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            courses?.map((course) => (
              <Card key={course.id} className="flex flex-col h-full transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/5">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={
                      course.level === 'beginner' ? 'default' :
                      course.level === 'intermediate' ? 'secondary' : 'destructive'
                    }>
                      {levelMap[course.level] || course.level}
                    </Badge>
                    {course.progressPercent === 100 && (
                      <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10">Hoàn thành</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.totalLessons} bài học</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Tự theo tiến độ</span>
                      </div>
                    </div>
                    {(course.progressPercent ?? 0) > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Tiến độ</span>
                          <span className="font-medium">{Math.round(course.progressPercent ?? 0)}%</span>
                        </div>
                        <Progress value={course.progressPercent} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/course/${course.id}`} className="w-full">
                    <Button className="w-full" variant={(course.progressPercent ?? 0) > 0 ? "secondary" : "default"}>
                      {(course.progressPercent ?? 0) > 0 ? "Tiếp tục học" : "Bắt đầu học"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
