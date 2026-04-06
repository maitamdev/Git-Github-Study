import { executeCommand, initRepo } from './artifacts/api-server/src/lib/gitEngine.js';

const state = initRepo();
console.log("STATE:", state);

const res1 = executeCommand("git status", state);
console.log("STATUS:", res1);

const res2 = executeCommand("git commit -m 'test'", res1.newState);
console.log("COMMIT:", res2);

const res3 = executeCommand("git log", res2.newState);
console.log("LOG:", res3);
