import { Router, type IRouter } from "express";
import { executeCommand, checkSolution, type RepoState } from "../lib/gitEngine";
import { db, challengesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ExecuteGitCommandBody, ValidateChallengeBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/git/execute", async (req, res): Promise<void> => {
  const parsed = ExecuteGitCommandBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { command, state } = parsed.data;

  const result = executeCommand(command, state as RepoState);

  res.json({
    newState: result.newState,
    output: result.output,
    error: result.error,
  });
});

router.post("/git/validate", async (req, res): Promise<void> => {
  const parsed = ValidateChallengeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { challengeId, state } = parsed.data;

  const [challenge] = await db
    .select()
    .from(challengesTable)
    .where(eq(challengesTable.id, challengeId))
    .limit(1);

  if (!challenge) {
    res.status(404).json({ error: "Challenge not found" });
    return;
  }

  const expectedState = challenge.expectedState
    ? JSON.parse(challenge.expectedState)
    : undefined;

  const result = checkSolution(state as RepoState, expectedState, challenge.goal);

  res.json(result);
});

export default router;
