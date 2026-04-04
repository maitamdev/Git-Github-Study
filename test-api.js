const { executeCommand } = require('./artifacts/api-server/dist/lib/gitEngine.js');
const repoState = {
  branches: { main: ["C1", "C2"] },
  commits: { 
    C1: { id: "C1", message: "Initial", parent: null, parents: [], timestamp: new Date().toISOString() },
    C2: { id: "C2", message: "Update", parent: "C1", parents: ["C1"], timestamp: new Date().toISOString() }
  },
  HEAD: "main",
  currentCommit: "C2",
  stagedFiles: [],
  workingFiles: ["test.txt"],
};
const res = executeCommand("git status", repoState);
console.log("STATUS:", JSON.stringify(res));
const res2 = executeCommand("git log", repoState);
console.log("LOG:", JSON.stringify(res2));
const res3 = executeCommand("git log --oneline", repoState);
console.log("LOG ONELINE:", JSON.stringify(res3));
