import Layout from "@/components/layout";
import { useGetCourse } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Course() {
  const params = useParams();
  const courseId = params.courseId;
  const { data: course, isLoading } = useGetCourse(courseId!, { query: { enabled: !!courseId } });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto w-full p-8 space-y-8">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
          <div className="space-y-4 mt-8">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto w-full p-8 text-center">
          <h1 className="text-2xl font-bold">Không tìm thấy khóa học</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto w-full p-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">{course.title}</h1>
          <p className="text-xl text-muted-foreground">{course.description}</p>
          
          <div className="flex items-center gap-4 max-w-md pt-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Tiến độ khóa học</span>
                <span className="text-muted-foreground">{Math.round(course.progressPercent ?? 0)}%</span>
              </div>
              <Progress value={course.progressPercent} className="h-3" />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Nội Dung Khóa Học</h2>
          <Accordion type="multiple" defaultValue={course.modules.map(m => m.id)} className="space-y-4">
            {course.modules.map((module) => (
              <AccordionItem key={module.id} value={module.id} className="bg-card border border-border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50 transition-colors">
                  <div className="flex flex-col items-start text-left">
                    <div className="text-sm text-muted-foreground mb-1 font-normal">Chương {module.order}</div>
                    <div className="text-lg font-semibold">{module.title}</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 pb-0">
                  <div className="flex flex-col divide-y divide-border border-t border-border">
                    {module.lessons.map((lesson) => (
                      <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                        <div className="flex items-center p-4 hover:bg-secondary/50 transition-colors group cursor-pointer">
                          <div className="mr-4">
                            {lesson.isCompleted ? (
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : (
                              <Circle className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium group-hover:text-primary transition-colors">{lesson.title}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                              {lesson.videoUrl && (
                                <span className="flex items-center gap-1">
                                  <PlayCircle className="h-3.5 w-3.5" /> Video
                                </span>
                              )}
                              {lesson.hasPractice && (
                                <span className="flex items-center gap-1">
                                  Bài thực hành Terminal
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Layout>
  );
}
