import { Router, type IRouter } from "express";
import { db, coursesTable, modulesTable, lessonsTable, progressTable, sessionsTable } from "@workspace/db";
import { eq, asc, inArray } from "drizzle-orm";

const router: IRouter = Router();
const SESSION_COOKIE = "session_id";

async function getUserIdFromReq(req: any): Promise<string | null> {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return null;
  const { sessionsTable: st, usersTable: ut } = await import("@workspace/db");
  const [session] = await db.select().from(st).where(eq(st.id, token)).limit(1);
  if (!session || session.expiresAt < new Date()) return null;
  return session.userId;
}

router.get("/courses", async (req, res): Promise<void> => {
  const userId = await getUserIdFromReq(req);

  const courses = await db
    .select()
    .from(coursesTable)
    .orderBy(asc(coursesTable.order));

  const allLessons = await db.select().from(lessonsTable);
  const allModules = await db.select().from(modulesTable);

  const moduleIdToCourseId: Record<string, string> = {};
  for (const mod of allModules) {
    moduleIdToCourseId[mod.id] = mod.courseId;
  }

  const lessonsPerCourse: Record<string, number> = {};
  const courseLessonsMap: Record<string, typeof allLessons> = {};

  for (const lesson of allLessons) {
    const courseId = moduleIdToCourseId[lesson.moduleId];
    if (courseId) {
      lessonsPerCourse[courseId] = (lessonsPerCourse[courseId] ?? 0) + 1;
      if (!courseLessonsMap[courseId]) {
        courseLessonsMap[courseId] = [];
      }
      courseLessonsMap[courseId].push(lesson);
    }
  }

  let completedByLesson: Set<string> = new Set();
  if (userId) {
    const progress = await db.select().from(progressTable).where(eq(progressTable.userId, userId));
    completedByLesson = new Set(progress.map((p) => p.lessonId));
  }

  const result = courses.map((c) => {
    const total = lessonsPerCourse[c.id] ?? 0;
    const courseLessons = courseLessonsMap[c.id] ?? [];
    const completed = courseLessons
      .filter((l) => completedByLesson.has(l.id))
      .length;

    return {
      id: c.id,
      title: c.title,
      description: c.description,
      level: c.level,
      totalLessons: total,
      imageUrl: c.imageUrl,
      completedLessons: completed,
      progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  res.json(result);
});

router.get("/courses/:courseId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.courseId)
    ? req.params.courseId[0]
    : req.params.courseId;
  const courseId = raw;

  const userId = await getUserIdFromReq(req);

  const [course] = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, courseId))
    .limit(1);

  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  const modules = await db
    .select()
    .from(modulesTable)
    .where(eq(modulesTable.courseId, courseId))
    .orderBy(asc(modulesTable.order));

  let completedByLesson: Set<string> = new Set();
  if (userId) {
    const progress = await db.select().from(progressTable).where(eq(progressTable.userId, userId));
    completedByLesson = new Set(progress.map((p) => p.lessonId));
  }

  const modulesWithLessons = await Promise.all(
    modules.map(async (mod) => {
      const lessons = await db
        .select()
        .from(lessonsTable)
        .where(eq(lessonsTable.moduleId, mod.id))
        .orderBy(asc(lessonsTable.order));

      return {
        id: mod.id,
        courseId: mod.courseId,
        title: mod.title,
        order: mod.order,
        lessons: lessons.map((l) => ({
          id: l.id,
          moduleId: l.moduleId,
          title: l.title,
          order: l.order,
          hasPractice: l.hasPractice === "true",
          videoUrl: l.videoUrl,
          durationSeconds: l.durationSeconds,
          isCompleted: completedByLesson.has(l.id),
        })),
      };
    })
  );

  const allLessonCount = modulesWithLessons.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = modulesWithLessons.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.isCompleted).length,
    0
  );

  res.json({
    id: course.id,
    title: course.title,
    description: course.description,
    level: course.level,
    totalLessons: allLessonCount,
    imageUrl: course.imageUrl,
    completedLessons: completedCount,
    progressPercent: allLessonCount > 0 ? Math.round((completedCount / allLessonCount) * 100) : 0,
    modules: modulesWithLessons,
  });
});

export default router;
