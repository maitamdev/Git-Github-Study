import { FolderGit2, FileText, FileCode, FileJson, File, ChevronRight, ChevronDown } from "lucide-react";
import type { RepoState } from "@workspace/api-client-react";
import { useState } from "react";

interface FileExplorerProps {
  repoState: RepoState;
}

export default function FileExplorer({ repoState }: FileExplorerProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Derive file system state
  const fileSystem = repoState?.fileSystem || {};
  const stagedFiles = repoState?.stagedFiles || [];
  const workingFiles = repoState?.workingFiles || [];
  const files = Object.keys(fileSystem).sort();

  // Also include files that are tracked in working/staged but might have been logically "deleted"
  // so they still show up as deleted
  const allKnownFiles = new Set([
    ...files,
    ...stagedFiles,
    ...workingFiles,
  ]);

  const sortedAllFiles = Array.from(allKnownFiles).sort();

  const getFileIcon = (filename: string) => {
    if (filename.endsWith(".ts") || filename.endsWith(".tsx") || filename.endsWith(".js")) return <FileCode className="w-4 h-4 text-blue-400" />;
    if (filename.endsWith(".json")) return <FileJson className="w-4 h-4 text-yellow-400" />;
    if (filename.endsWith(".md") || filename.endsWith(".txt")) return <FileText className="w-4 h-4 text-slate-400" />;
    return <File className="w-4 h-4 text-slate-300" />;
  };

  const getFileBadge = (filename: string) => {
    const isStaged = stagedFiles.includes(filename);
    const isWorking = workingFiles.includes(filename);
    const existsInFs = filename in fileSystem;

    if (isStaged) {
      if (!existsInFs) return <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-1 rounded">D</span>; // Staged Deletion
      return <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1 rounded">S</span>; // Staged (Added/Modified)
    }

    if (isWorking) {
      if (!existsInFs) return <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-1 rounded">D</span>; // Deleted but not staged
      
      // If it exists in previous commit, it's Modified, else Untracked
      // We will just simplify it to Modified/Untracked based on standard U/M
      const prevCommitId = repoState.currentCommit;
      const prevFiles = prevCommitId ? repoState.commits[prevCommitId]?.files || {} : {};
      
      if (filename in prevFiles) {
        return <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">M</span>; // Modified
      }
      return <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1 rounded">U</span>; // Untracked
    }

    return null; // Unmodified tracked file
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f1d] text-slate-300 border-r border-border font-mono text-sm">
      <div className="h-10 border-b border-border flex items-center px-4 bg-[#0f172a] shrink-0">
        <FolderGit2 className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">Tệp Tin</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
        <div 
          className="flex items-center px-2 py-1 cursor-pointer hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}
          <span className="font-semibold text-xs tracking-wider uppercase">Project</span>
        </div>

        {isOpen && (
          <div className="mt-1 flex flex-col">
            {sortedAllFiles.length === 0 ? (
              <div className="px-8 py-2 text-xs text-slate-500 italic">Thư mục trống</div>
            ) : (
              sortedAllFiles.map((filename) => {
                const isStaged = stagedFiles.includes(filename);
                const isWorking = workingFiles.includes(filename);
                const isChanged = isStaged || isWorking;
                
                return (
                  <div 
                    key={filename} 
                    className={`flex items-center justify-between px-8 py-1.5 hover:bg-slate-800/50 cursor-default transition-colors ${isChanged ? 'text-slate-200' : 'text-slate-500'}`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {getFileIcon(filename)}
                      <span className="truncate">{filename}</span>
                    </div>
                    <div>
                      {getFileBadge(filename)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      
      <div className="p-3 text-xs border-t border-border/50 bg-[#0f172a]/50 leading-relaxed text-slate-400">
        <p className="font-semibold text-slate-300 mb-1">Gợi ý lệnh:</p>
        <code className="block bg-slate-900 px-1 py-0.5 rounded text-green-400 mb-1">touch main.js</code>
        <code className="block bg-slate-900 px-1 py-0.5 rounded text-green-400 mb-1">echo "code" &gt; main.js</code>
        <code className="block bg-slate-900 px-1 py-0.5 rounded text-green-400">rm main.js</code>
      </div>
    </div>
  );
}
