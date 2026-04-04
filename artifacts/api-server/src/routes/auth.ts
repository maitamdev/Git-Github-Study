import { Router, type IRouter } from "express";
import { db, usersTable, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, generateSessionToken } from "../lib/auth";
import { RegisterBody, LoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

const SESSION_COOKIE = "session_id";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password, name } = parsed.data;

  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existing) {
    res.status(400).json({ error: "Email already in use" });
    return;
  }

  const passwordHash = hashPassword(password);
  const [user] = await db
    .insert(usersTable)
    .values({ email, passwordHash, name })
    .returning();

  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const [session] = await db
    .insert(sessionsTable)
    .values({ id: token, userId: user.id, expiresAt })
    .returning();

  res.cookie(SESSION_COOKIE, session.id, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: expiresAt,
  });

  res.status(201).json({ user: { id: user.id, email: user.email, name: user.name } });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const [session] = await db
    .insert(sessionsTable)
    .values({ id: token, userId: user.id, expiresAt })
    .returning();

  res.cookie(SESSION_COOKIE, session.id, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: expiresAt,
  });

  res.json({ user: { id: user.id, email: user.email, name: user.name } });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, token));
  }
  res.clearCookie(SESSION_COOKIE);
  res.json({ success: true });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.id, token))
    .limit(1);

  if (!session || session.expiresAt < new Date()) {
    res.status(401).json({ error: "Session expired" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, session.userId))
    .limit(1);

  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json({ id: user.id, email: user.email, name: user.name });
});

export default router;
