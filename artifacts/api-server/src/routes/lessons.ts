import { Router, type IRouter } from "express";
import { db, lessonsTable, modulesTable, challengesTable, sessionsTable, progressTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router: IRouter = Router();
const SESSION_COOKIE = "session_id";

async function getUserIdFromReq(req: any): Promise<string | null> {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return null;
  const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, token)).limit(1);
  if (!session || session.expiresAt < new Date()) return null;
  return session.userId;
}

router.get("/lessons/:lessonId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.lessonId)
    ? req.params.lessonId[0]
    : req.params.lessonId;
  const lessonId = raw;

  const [lesson] = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.id, lessonId))
    .limit(1);

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const [module] = await db
    .select()
    .from(modulesTable)
    .where(eq(modulesTable.id, lesson.moduleId))
    .limit(1);

  const [challenge] = await db
    .select()
    .from(challengesTable)
    .where(eq(challengesTable.lessonId, lessonId))
    .limit(1);

  const siblingLessons = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.moduleId, lesson.moduleId))
    .orderBy(asc(lessonsTable.order));

  const idx = siblingLessons.findIndex((l) => l.id === lessonId);
  const prevLessonId = idx > 0 ? siblingLessons[idx - 1].id : undefined;
  const nextLessonId = idx < siblingLessons.length - 1 ? siblingLessons[idx + 1].id : undefined;

  const userId = await getUserIdFromReq(req);
  let isCompleted = false;
  if (userId) {
    const [progress] = await db
      .select()
      .from(progressTable)
      .where(eq(progressTable.userId, userId))
      .limit(100);
    isCompleted = !!progress;
  }

  res.json({
    id: lesson.id,
    moduleId: lesson.moduleId,
    title: lesson.title,
    order: lesson.order,
    hasPractice: lesson.hasPractice === "true",
    videoUrl: lesson.videoUrl,
    durationSeconds: lesson.durationSeconds,
    isCompleted,
    content: lesson.content,
    prevLessonId,
    nextLessonId,
    challenge: challenge
      ? {
          id: challenge.id,
          lessonId: challenge.lessonId,
          goal: challenge.goal,
          hints: challenge.hints ?? [],
          initialState: JSON.parse(challenge.initialState),
          expectedState: challenge.expectedState
            ? JSON.parse(challenge.expectedState)
            : undefined,
        }
      : undefined,
  });
});

export default router;
