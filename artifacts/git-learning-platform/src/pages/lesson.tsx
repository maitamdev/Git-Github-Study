import Layout from "@/components/layout";
import { useGetLesson, useGetCourse, useCompleteLesson, useValidateChallenge, useExecuteGitCommand, getGetLessonQueryKey, getGetCourseQueryKey } from "@workspace/api-client-react";
import type { RepoState } from "@workspace/api-client-react";
import { useParams, useLocation, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, Terminal as TerminalIcon, GitBranch as GitIcon, CheckSquare, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

import Terminal from "@/components/terminal";
import GitGraph from "@/components/git-graph";
import FileExplorer from "@/components/file-explorer";

export default function Lesson() {
  const params = useParams();
  const lessonId = params.lessonId;
  const [, setLocation] = useLocation();

  const { data: lesson, isLoading: isLessonLoading } = useGetLesson(lessonId!, { query: { queryKey: getGetLessonQueryKey(lessonId!), enabled: !!lessonId } });
  const { data: course, isLoading: isCourseLoading } = useGetCourse(lesson?.moduleId ? lesson.moduleId : "", { query: { queryKey: getGetCourseQueryKey(""), enabled: false } });
  
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

  const [showHint, setShowHint] = useState(false);

  const handleCheckSolution = () => {
    if (!lesson?.challenge || !repoState) return;
    validateChallenge.mutate({ data: { challengeId: lesson.challenge.id, state: repoState } }, {
      onSuccess: (res) => {
        if (res.success) {
          toast.success("🎉 Bài tập hoàn thành! Xuất sắc!");
          // Delay to let them see the toast, then complete lesson
          setTimeout(() => {
            handleComplete();
          }, 1500);
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
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="p-8 max-w-4xl mx-auto w-full space-y-8 flex-1">
              


              <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-primary prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border/40">
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
              <div className="h-[45vh] min-h-[350px] border-t border-border flex shrink-0 bg-background shadow-2xl">
                {/* 1. Task Panel (20%) */}
                 <div className="w-1/5 border-r border-border flex flex-col bg-card/50">
                  <div className="h-10 border-b border-border flex items-center px-4 bg-muted/30">
                    <CheckSquare className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">Nhiệm Vụ</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {lesson.challenge ? (
                      <div className="space-y-4">
                        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                          <p className="text-sm font-medium">Mục tiêu:</p>
                          <p className="text-sm text-muted-foreground mt-1">{lesson.challenge.goal}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium flex items-center justify-between">
                            Hướng dẫn
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setShowHint(!showHint)}>
                              <Lightbulb className="w-3 h-3 mr-1 text-yellow-500" />
                              {showHint ? "Ẩn gợi ý" : "Hiện gợi ý"}
                            </Button>
                          </p>
                          <ul className="space-y-2">
                            {lesson.challenge.hints?.map((hint: string, idx: number) => (
                              <li key={idx} className="text-sm bg-muted/40 p-2 rounded border border-border/50 text-muted-foreground">
                                {showHint ? (
                                  <div dangerouslySetInnerHTML={{ __html: hint.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-primary">$1</code>') }} />
                                ) : (
                                  <span className="blur-sm select-none transition-all duration-300">Nhấn hiện để xem lệnh nhé!</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button className="w-full mt-4" size="sm" onClick={handleCheckSolution} disabled={validateChallenge.isPending}>
                          Kiểm Tra
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Thực hành tự do.</p>
                    )}
                  </div>
                </div>

                {/* 2. File Explorer Panel (20%) */}
                <div className="w-1/5 border-r border-border flex flex-col">
                  <FileExplorer repoState={repoState} />
                </div>

                {/* 3. Terminal Panel (40%) */}
                <div className="w-[40%] border-r border-border flex flex-col">
                  <div className="h-10 border-b border-border flex items-center px-4 bg-[#0f172a] text-slate-300">
                    <TerminalIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Terminal</span>
                  </div>
                  <div className="flex-1 relative">
                    <Terminal onCommand={handleCommand} />
                  </div>
                </div>

                {/* 4. Git Graph Panel (20%) */}
                <div className="w-1/5 flex flex-col bg-slate-900">
                  <div className="h-10 border-b border-slate-800 flex items-center px-4 bg-slate-900 text-slate-300">
                    <GitIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Trực Quan</span>
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
