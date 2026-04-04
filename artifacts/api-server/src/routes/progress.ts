import { Router, type IRouter } from "express";
import { db, progressTable, sessionsTable, lessonsTable, modulesTable, coursesTable } from "@workspace/db";
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

router.get("/progress", async (req, res): Promise<void> => {
  const userId = await getUserIdFromReq(req);
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const userProgress = await db
    .select()
    .from(progressTable)
    .where(eq(progressTable.userId, userId));

  const completedLessonIds = userProgress.map((p) => p.lessonId);

  const allLessons = await db.select().from(lessonsTable);
  const allModules = await db.select().from(modulesTable);
  const allCourses = await db.select().from(coursesTable).orderBy(asc(coursesTable.order));

  const totalLessons = allLessons.length;
  const completedLessons = completedLessonIds.length;

  const courseProgress = allCourses.map((course) => {
    const courseModuleIds = allModules
      .filter((m) => m.courseId === course.id)
      .map((m) => m.id);
    const courseLessons = allLessons.filter((l) => courseModuleIds.includes(l.moduleId));
    const courseCompleted = courseLessons.filter((l) => completedLessonIds.includes(l.id)).length;

    return {
      courseId: course.id,
      courseTitle: course.title,
      completedLessons: courseCompleted,
      totalLessons: courseLessons.length,
      progressPercent:
        courseLessons.length > 0
          ? Math.round((courseCompleted / courseLessons.length) * 100)
          : 0,
    };
  });

  res.json({
    totalLessons,
    completedLessons,
    progressPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    completedLessonIds,
    courseProgress,
  });
});

router.post("/progress/lesson/:lessonId", async (req, res): Promise<void> => {
  const userId = await getUserIdFromReq(req);
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const raw = Array.isArray(req.params.lessonId)
    ? req.params.lessonId[0]
    : req.params.lessonId;
  const lessonId = raw;

  await db
    .insert(progressTable)
    .values({ userId, lessonId })
    .onConflictDoNothing();

  const userProgress = await db
    .select()
    .from(progressTable)
    .where(eq(progressTable.userId, userId));

  const completedLessonIds = userProgress.map((p) => p.lessonId);
  const allLessons = await db.select().from(lessonsTable);
  const allModules = await db.select().from(modulesTable);
  const allCourses = await db.select().from(coursesTable).orderBy(asc(coursesTable.order));

  const totalLessons = allLessons.length;
  const completedLessons = completedLessonIds.length;

  const courseProgress = allCourses.map((course) => {
    const courseModuleIds = allModules
      .filter((m) => m.courseId === course.id)
      .map((m) => m.id);
    const courseLessons = allLessons.filter((l) => courseModuleIds.includes(l.moduleId));
    const courseCompleted = courseLessons.filter((l) => completedLessonIds.includes(l.id)).length;

    return {
      courseId: course.id,
      courseTitle: course.title,
      completedLessons: courseCompleted,
      totalLessons: courseLessons.length,
      progressPercent:
        courseLessons.length > 0
          ? Math.round((courseCompleted / courseLessons.length) * 100)
          : 0,
    };
  });

  res.json({
    totalLessons,
    completedLessons,
    progressPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    completedLessonIds,
    courseProgress,
  });
});

export default router;
