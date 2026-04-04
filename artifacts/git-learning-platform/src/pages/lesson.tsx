import Layout from "@/components/layout";
import { useGetLesson, useGetCourse, useCompleteLesson, useValidateChallenge, useExecuteGitCommand, RepoState } from "@workspace/api-client-react";
import { useParams, useLocation, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, Terminal as TerminalIcon, GitBranch as GitIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import ReactPlayer from "react-player";
import Terminal from "@/components/terminal";
import GitGraph from "@/components/git-graph";

export default function Lesson() {
  const params = useParams();
  const lessonId = params.lessonId;
  const [, setLocation] = useLocation();

  const { data: lesson, isLoading: isLessonLoading } = useGetLesson(lessonId!, { query: { enabled: !!lessonId } });
  const { data: course, isLoading: isCourseLoading } = useGetCourse(lesson?.moduleId ? lesson.moduleId : "", { query: { enabled: false } });
  
  const executeGitCommand = useExecuteGitCommand();
  const validateChallenge = useValidateChallenge();
  const completeLessonMutation = useCompleteLesson();

  const [repoState, setRepoState] = useState<RepoState | null>(null);

  useEffect(() => {
    if (lesson) {
      if (lesson.challenge?.initialState) {
        setRepoState(lesson.challenge.initialState);
      } else {
        setRepoState({
          branches: { main: [] },
          commits: {},
          HEAD: 'main',
          currentCommit: ''
        });
      }
    }
  }, [lesson]);

  const handleCommand = async (command: string): Promise<string> => {
    if (!repoState) return "";
    try {
      const res = await executeGitCommand.mutateAsync({ data: { command, state: repoState } });
      if (res.newState) {
        setRepoState(res.newState);
      }
      return res.output + (res.error ? `\nLỗi: ${res.error}` : "");
    } catch (e: any) {
      return `Lỗi: ${e.message || 'Không xác định'}`;
    }
  };

  const handleCheckSolution = () => {
    if (!lesson?.challenge || !repoState) return;
    validateChallenge.mutate({ data: { challengeId: lesson.challenge.id, state: repoState } }, {
      onSuccess: (res) => {
        if (res.success) {
          toast.success("🎉 Bài tập hoàn thành! Xuất sắc!");
        } else {
          toast.error(res.message || "Chưa đúng, thử lại nhé!");
        }
      },
      onError: () => {
        toast.error("Không thể kiểm tra bài tập");
      }
    });
  };

  const handleComplete = () => {
    completeLessonMutation.mutate({ lessonId: lesson!.id }, {
      onSuccess: () => {
        toast.success("✅ Hoàn thành bài học!");
        if (lesson?.nextLessonId) {
          setLocation(`/lesson/${lesson.nextLessonId}`);
        } else {
          setLocation(`/`);
        }
      }
    });
  };

  if (isLessonLoading || !lesson) {
    return (
      <Layout>
        <div className="p-8"><Skeleton className="h-screen w-full" /></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-full bg-background overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg">{lesson.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {lesson.challenge && (
              <Button variant="outline" size="sm" onClick={handleCheckSolution} disabled={validateChallenge.isPending}>
                Kiểm tra
              </Button>
            )}
            <Button size="sm" onClick={handleComplete} disabled={completeLessonMutation.isPending} className="bg-primary text-primary-foreground">
              Hoàn thành & Tiếp tục <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="p-8 max-w-4xl mx-auto w-full space-y-8 flex-1">
              
              {lesson.videoUrl && (
                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-border shadow-sm">
                  <ReactPlayer url={lesson.videoUrl} width="100%" height="100%" controls />
                </div>
              )}

              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          {...props}
                          children={String(children).replace(/\n$/, '')}
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                        />
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {lesson.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Bottom Panel for Practice */}
            {lesson.hasPractice && repoState && (
              <div className="h-[40vh] min-h-[300px] border-t border-border flex shrink-0 bg-card">
                <div className="w-1/2 border-r border-border flex flex-col">
                  <div className="h-10 border-b border-border flex items-center px-4 bg-muted/30">
                    <TerminalIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Terminal</span>
                  </div>
                  <div className="flex-1 relative">
                    <Terminal onCommand={handleCommand} />
                  </div>
                </div>
                <div className="w-1/2 flex flex-col">
                  <div className="h-10 border-b border-border flex items-center px-4 bg-muted/30">
                    <GitIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Sơ đồ Git</span>
                  </div>
                  <div className="flex-1 relative">
                    <GitGraph repoState={repoState} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
