import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const coursesTable = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull().default("beginner"),
  imageUrl: text("image_url"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const modulesTable = pgTable("modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id").notNull().references(() => coursesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const lessonsTable = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  moduleId: uuid("module_id").notNull().references(() => modulesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  videoUrl: text("video_url"),
  content: text("content").notNull().default(""),
  hasPractice: text("has_practice").notNull().default("false"),
  durationSeconds: integer("duration_seconds"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const challengesTable = pgTable("challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id").notNull().references(() => lessonsTable.id, { onDelete: "cascade" }).unique(),
  goal: text("goal").notNull(),
  hints: text("hints").array().notNull().default([]),
  initialState: text("initial_state").notNull(),
  expectedState: text("expected_state"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({ id: true, createdAt: true });
export const insertModuleSchema = createInsertSchema(modulesTable).omit({ id: true, createdAt: true });
export const insertLessonSchema = createInsertSchema(lessonsTable).omit({ id: true, createdAt: true });
export const insertChallengeSchema = createInsertSchema(challengesTable).omit({ id: true, createdAt: true });

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof coursesTable.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modulesTable.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessonsTable.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challengesTable.$inferSelect;
