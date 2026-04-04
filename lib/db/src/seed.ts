import { db, coursesTable, modulesTable, lessonsTable, challengesTable } from "./index.js";
import { initRepo } from "../../../artifacts/api-server/src/lib/gitEngine.js";

async function runSeed() {
  console.log("🌱 Starting Database Seed...");

  try {
    // 1. Insert Course
    const [course] = await db.insert(coursesTable).values({
      title: "Git & GitHub Basics",
      description: "Learn version control from scratch with interactive terminal challenges.",
      level: "beginner",
      imageUrl: "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png",
      order: 1,
    }).returning();

    console.log(`✅ Created Course: ${course.title}`);

    // 2. Insert Module
    const [module1] = await db.insert(modulesTable).values({
      courseId: course.id,
      title: "Introduction to Version Control",
      order: 1,
    }).returning();

    console.log(`✅ Created Module: ${module1.title}`);

    // 3. Insert Lessons
    const [lesson1, lesson2] = await db.insert(lessonsTable).values([
      {
        moduleId: module1.id,
        title: "1. What is Git?",
        content: "Git is a distributed version control system...",
        hasPractice: "false",
        order: 1,
      },
      {
        moduleId: module1.id,
        title: "2. Your First Commit",
        content: "Let's create our first commit using the interactive terminal.",
        hasPractice: "true",
        order: 2,
      }
    ]).returning();

    console.log(`✅ Created Lessons`);

    // 4. Insert Challenge for Lesson 2
    const baseRepoState = {
      branches: { main: ["C1"] },
      commits: { C1: { id: "C1", message: "Initial commit", parent: null, parents: [], timestamp: new Date().toISOString() } },
      HEAD: "main",
      currentCommit: "C1",
      stagedFiles: [],
      workingFiles: ["readme.md"],
    };

    const expectedState = JSON.parse(JSON.stringify(baseRepoState));
    expectedState.commits["C2"] = { id: "C2", message: "Add readme", parent: "C1", parents: ["C1"] };
    expectedState.branches.main.push("C2");
    expectedState.currentCommit = "C2";

    await db.insert(challengesTable).values({
      lessonId: lesson2.id,
      goal: "Use 'git add .' and 'git commit -m \"Add readme\"' to save your changes.",
      hints: ["Try typing 'git add .' first", "Then type 'git commit -m \"Add readme\"'"],
      initialState: JSON.stringify(baseRepoState),
      expectedState: JSON.stringify(expectedState),
    });

    console.log(`✅ Created Practice Challenge`);
    console.log("🎉 Seeding complete!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

// Since DATABASE_URL is required, only run if it exists
if (process.env.DATABASE_URL) {
  runSeed();
} else {
  console.log("⚠️  DATABASE_URL is not set. Skipping seed.");
}
