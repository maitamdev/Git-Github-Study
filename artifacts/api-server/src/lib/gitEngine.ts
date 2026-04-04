export interface Commit {
  id: string;
  message: string;
  parent: string | null;
  parents: string[];
  branch?: string;
  timestamp: string;
}

export interface RepoState {
  branches: Record<string, string[]>;
  commits: Record<string, Commit>;
  HEAD: string;
  currentCommit: string;
  stagedFiles?: string[];
  workingFiles?: string[];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

export function initRepo(): RepoState {
  const c1: Commit = {
    id: "C1",
    message: "Initial commit",
    parent: null,
    parents: [],
    timestamp: new Date().toISOString(),
  };
  return {
    branches: { main: ["C1"] },
    commits: { C1: c1 },
    HEAD: "main",
    currentCommit: "C1",
    stagedFiles: [],
    workingFiles: [],
  };
}

export function executeCommand(
  command: string,
  state: RepoState
): { newState: RepoState; output: string; error?: string } {
  const parts = command.trim().split(/\s+/);
  const [cmd, sub, ...args] = parts;

  // Handle direct commands like 'clear' or 'help'
  if (cmd === "clear") {
    return { newState: state, output: "__CLEAR__" };
  }
  if (cmd === "help") {
    return executeCommand("git help", state);
  }

  if (cmd !== "git") {
    return { newState: state, output: "", error: `command not found: ${cmd}` };
  }

  const s: RepoState = JSON.parse(JSON.stringify(state));

  switch (sub) {
    case "init": {
      const newState = initRepo();
      return { newState, output: "Initialized empty Git repository" };
    }

    case "commit": {
      if (args[0] !== "-m") {
        return { newState: s, output: "", error: 'Usage: git commit -m "message"' };
      }
      const message = args.slice(1).join(" ").replace(/^["']|["']$/g, "");
      if (!message) {
        return { newState: s, output: "", error: "Aborting commit due to empty commit message." };
      }
      const id = "C" + generateId();
      const commit: Commit = {
        id,
        message,
        parent: s.currentCommit || null,
        parents: s.currentCommit ? [s.currentCommit] : [],
        branch: s.HEAD,
        timestamp: new Date().toISOString(),
      };
      s.commits[id] = commit;
      if (s.HEAD in s.branches) {
        if (!s.branches[s.HEAD].includes(id)) {
          s.branches[s.HEAD] = [...s.branches[s.HEAD], id];
        }
      }
      s.currentCommit = id;
      s.stagedFiles = [];
      return {
        newState: s,
        output: `[${s.HEAD} ${id.substring(0, 7)}] ${message}\n 1 file changed, 1 insertion(+)`,
      };
    }

    case "branch": {
      if (args.length === 0) {
        const branchList = Object.keys(s.branches)
          .map((b) => (b === s.HEAD ? `* ${b}` : `  ${b}`))
          .join("\n");
        return { newState: s, output: branchList };
      }
      const branchName = args[0];
      if (args[0] === "-d" || args[0] === "-D") {
        const target = args[1];
        if (!target) {
          return { newState: s, output: "", error: "Usage: git branch -d <branchname>" };
        }
        if (!(target in s.branches)) {
          return { newState: s, output: "", error: `error: branch '${target}' not found.` };
        }
        if (target === s.HEAD) {
          return { newState: s, output: "", error: `error: Cannot delete the branch '${target}' which you are currently on.` };
        }
        delete s.branches[target];
        return { newState: s, output: `Deleted branch ${target}.` };
      }
      if (branchName in s.branches) {
        return { newState: s, output: "", error: `fatal: A branch named '${branchName}' already exists.` };
      }
      const currentCommits = s.branches[s.HEAD] ?? [];
      s.branches[branchName] = [...currentCommits];
      return { newState: s, output: `Đã tạo nhánh mới '${branchName}' từ '${s.HEAD}'.\nSử dụng 'git checkout ${branchName}' để chuyển sang nhánh này.` };
    }

    case "switch":
    case "checkout": {
      if (args[0] === "-b") {
        const newBranch = args[1];
        if (!newBranch) {
          return { newState: s, output: "", error: "Usage: git checkout -b <branch>" };
        }
        if (newBranch in s.branches) {
          return { newState: s, output: "", error: `fatal: A branch named '${newBranch}' already exists.` };
        }
        const currentCommits = s.branches[s.HEAD] ?? [];
        s.branches[newBranch] = [...currentCommits];
        s.HEAD = newBranch;
        return { newState: s, output: `Switched to a new branch '${newBranch}'` };
      }
      const target = args[0];
      if (!(target in s.branches)) {
        return { newState: s, output: "", error: `error: pathspec '${target}' did not match any file(s) known to git` };
      }
      s.HEAD = target;
      const commits = s.branches[target] ?? [];
      s.currentCommit = commits[commits.length - 1] ?? "";
      return { newState: s, output: `Switched to branch '${target}'` };
    }

    case "merge": {
      const sourceBranch = args[0];
      if (!sourceBranch) {
        return { newState: s, output: "", error: "Usage: git merge <branch>" };
      }
      if (!(sourceBranch in s.branches)) {
        return { newState: s, output: "", error: `merge: ${sourceBranch} - not something we can merge` };
      }
      if (sourceBranch === s.HEAD) {
        return { newState: s, output: "Already up to date." };
      }
      const sourceCommits = s.branches[sourceBranch] ?? [];
      const targetCommits = s.branches[s.HEAD] ?? [];
      const sourceHead = sourceCommits[sourceCommits.length - 1] ?? "";
      const targetHead = targetCommits[targetCommits.length - 1] ?? "";
      if (!sourceHead) {
        return { newState: s, output: "Already up to date." };
      }
      const mergeId = "C" + generateId();
      const mergeCommit: Commit = {
        id: mergeId,
        message: `Merge branch '${sourceBranch}' into ${s.HEAD}`,
        parent: targetHead || null,
        parents: [targetHead, sourceHead].filter(Boolean),
        timestamp: new Date().toISOString(),
      };
      s.commits[mergeId] = mergeCommit;
      s.branches[s.HEAD] = [...targetCommits, ...sourceCommits.filter((c) => !targetCommits.includes(c)), mergeId];
      s.currentCommit = mergeId;
      return {
        newState: s,
        output: `Merge made by the 'ort' strategy.\n 1 file changed, 1 insertion(+)`,
      };
    }

    case "log": {
      if (!s.currentCommit || Object.keys(s.commits).length === 0) {
        return { newState: s, output: "fatal: your current branch has no commits yet" };
      }
      const lines: string[] = [];
      let current: string | null = s.currentCommit;
      let count = 0;
      while (current && count < 10) {
        const commit: Commit = s.commits[current];
        if (!commit) break;
        lines.push(`commit ${commit.id}`);
        lines.push(`Date: ${commit.timestamp}`);
        lines.push(`\n    ${commit.message}\n`);
        current = commit.parent;
        count++;
      }
      return { newState: s, output: lines.join("\n") };
    }

    case "status": {
      const staged = (s.stagedFiles ?? []).length;
      const working = (s.workingFiles ?? []).length;
      let out = `On branch ${s.HEAD}\n`;
      if (staged > 0) {
        out += `Changes to be committed:\n  (${staged} file(s))\n`;
      }
      if (working > 0) {
        out += `Changes not staged for commit:\n  (${working} file(s))\n`;
      }
      if (staged === 0 && working === 0) {
        out += "nothing to commit, working tree clean";
      }
      return { newState: s, output: out };
    }

    case "add": {
      const file = args[0] ?? ".";
      s.stagedFiles = [...(s.stagedFiles ?? []), file];
      s.workingFiles = (s.workingFiles ?? []).filter((f) => f !== file);
      const fileName = file === "." ? "tất cả thay đổi" : `file '${file}'`;
      return { newState: s, output: `Đã thêm ${fileName} vào staging area.\nGõ 'git status' để kiểm tra, hoặc 'git commit -m "..."' để lưu.` };
    }

    case "stash": {
      const stashSub = args[0] ?? "push";
      if (stashSub === "push" || stashSub === "save") {
        s.workingFiles = [];
        s.stagedFiles = [];
        return { newState: s, output: "Saved working directory and index state WIP on " + s.HEAD };
      }
      if (stashSub === "pop") {
        return { newState: s, output: "No stash entries found." };
      }
      return { newState: s, output: "", error: `git stash ${stashSub}: not implemented` };
    }

    case "rebase": {
      const targetBranch = args[0];
      if (!targetBranch) {
        return { newState: s, output: "", error: "Usage: git rebase <branch>" };
      }
      if (!(targetBranch in s.branches)) {
        return { newState: s, output: "", error: `fatal: invalid upstream '${targetBranch}'` };
      }
      return { newState: s, output: `Successfully rebased and updated refs/heads/${s.HEAD}.` };
    }

    case "reset": {
      if (args[0] === "--hard" && args[1] === "HEAD~1") {
        const commits = s.branches[s.HEAD] ?? [];
        if (commits.length <= 1) {
          return { newState: s, output: "", error: "Already at root commit" };
        }
        const newCommits = commits.slice(0, -1);
        s.branches[s.HEAD] = newCommits;
        s.currentCommit = newCommits[newCommits.length - 1] ?? "";
        return { newState: s, output: `HEAD is now at ${s.currentCommit}` };
      }
      return { newState: s, output: "", error: "Usage: git reset --hard HEAD~1" };
    }

    case "tag": {
      const tagName = args[0];
      if (!tagName) {
        return { newState: s, output: Object.keys(s.commits).join("\n") };
      }
      return { newState: s, output: `Tagged ${s.currentCommit} as ${tagName}` };
    }

    case "help":
    case "--help": {
      return {
        newState: s,
        output: `Các lệnh Git được hỗ trợ:
  init       Khởi tạo repository
  status     Xem trạng thái working tree
  add        Thêm file vào staging area (vd: git add .)
  commit     Lưu thay đổi (vd: git commit -m "messsage")
  log        Xem lịch sử commit
  branch     Quản lý nhánh (vd: git branch <name>)
  checkout   Chuyển nhánh (vd: git checkout <name>)
  switch     Chuyển nhánh (tương tự checkout)
  merge      Gộp nhánh (vd: git merge <name>)
  push       Đẩy code lên remote (giả lập)
  pull       Kéo code từ remote (giả lập)
  stash      Cất thay đổi chưa commit
  rebase     Chuyển base của nhánh
  reset      Quay lại commit cũ
  tag        Gắn thẻ cho commit

Các lệnh khác:
  clear      Xóa màn hình terminal
  help       Xem trợ giúp này
`,
      };
    }
    
    // Giả lập push, pull
    case "push": {
      return { newState: s, output: `Đang đẩy dữ liệu lên remote...\nTo https://github.com/user/repo.git\n   ${s.currentCommit.substring(0,7)}..${generateId().substring(0,7)}  ${s.HEAD} -> ${s.HEAD}` };
    }
    
    case "pull": {
      return { newState: s, output: `Đang lấy dữ liệu từ remote...\nTrạng thái: Already up to date.` };
    }

    default:
      return {
        newState: s,
        output: "",
        error: `git: '${sub}' is not a git command. See 'git help'.`,
      };
  }
}

export interface ValidationResult {
  success: boolean;
  message: string;
  details: string[];
}

export function checkSolution(
  state: RepoState,
  expectedState: RepoState | undefined,
  challengeGoal: string
): ValidationResult {
  if (!expectedState) {
    return {
      success: Object.keys(state.commits).length > 0,
      message:
        Object.keys(state.commits).length > 0
          ? "Great work! Challenge complete."
          : "Complete the challenge steps first.",
      details: [],
    };
  }

  const details: string[] = [];
  let success = true;

  const expectedBranches = Object.keys(expectedState.branches);
  for (const branch of expectedBranches) {
    if (!(branch in state.branches)) {
      details.push(`Missing branch: '${branch}'`);
      success = false;
    }
  }

  const currentCommitCount = Object.keys(state.commits).length;
  const expectedCommitCount = Object.keys(expectedState.commits).length;
  if (currentCommitCount < expectedCommitCount) {
    details.push(
      `Expected at least ${expectedCommitCount} commits, but found ${currentCommitCount}`
    );
    success = false;
  }

  if (expectedState.HEAD && state.HEAD !== expectedState.HEAD) {
    details.push(`HEAD should be on branch '${expectedState.HEAD}', but is on '${state.HEAD}'`);
    success = false;
  }

  return {
    success,
    message: success
      ? "Challenge complete! Well done."
      : "Not quite there yet. Check the hints and try again.",
    details,
  };
}
