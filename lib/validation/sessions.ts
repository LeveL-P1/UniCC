import { Prisma } from "@prisma/client";
import { isRecord, parseBoundedInteger, parseDate, parsePlatform } from "@/lib/validation/common";

const MAX_NOTES_LENGTH = 2000;
const MAX_TOPICS = 25;
const MAX_TOPIC_LENGTH = 64;

export type SessionCreateInput = {
  date: Date;
  platform: NonNullable<ReturnType<typeof parsePlatform>>;
  problemsSolved: number;
  easy: number;
  medium: number;
  hard: number;
  timeSpentMinutes: number;
  topics: string[];
  notes: string | null;
};

export type SessionUpdateInput = Partial<SessionCreateInput>;

export function parseTopics(value: unknown): string[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > MAX_TOPICS) return null;

  const topics = value.map((topic) => (typeof topic === "string" ? topic.trim() : "")).filter(Boolean);
  if (topics.some((topic) => topic.length > MAX_TOPIC_LENGTH)) return null;
  return [...new Set(topics)];
}

function parseNotes(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return null;
  const notes = value.trim();
  return notes.length > MAX_NOTES_LENGTH ? null : notes || null;
}

export function parseCreateSessionBody(body: unknown): { data?: SessionCreateInput; error?: string } {
  if (!isRecord(body)) return { error: "Request body must be an object" };

  const date = parseDate(body.date);
  if (!date) return { error: "date must be a valid date" };

  const platform = parsePlatform(body.platform);
  if (!platform) return { error: "platform must be a supported platform" };

  const problemsSolved = parseBoundedInteger(body.problemsSolved, { min: 0, max: 10000, fallback: 0 });
  const easy = parseBoundedInteger(body.easy, { min: 0, max: 10000, fallback: 0 });
  const medium = parseBoundedInteger(body.medium, { min: 0, max: 10000, fallback: 0 });
  const hard = parseBoundedInteger(body.hard, { min: 0, max: 10000, fallback: 0 });
  const timeSpentMinutes = parseBoundedInteger(body.timeSpentMinutes, { min: 0, max: 100000, fallback: 0 });
  const topics = parseTopics(body.topics);
  const notes = parseNotes(body.notes);

  if (problemsSolved === null || easy === null || medium === null || hard === null) {
    return { error: "problem counts must be non-negative whole numbers" };
  }
  if (timeSpentMinutes === null) return { error: "timeSpentMinutes must be a non-negative whole number" };
  if (topics === null) return { error: "topics must be an array of short strings" };
  if (body.notes !== undefined && notes === null && typeof body.notes !== "string") {
    return { error: "notes must be text" };
  }

  return {
    data: {
      date,
      platform,
      problemsSolved,
      easy,
      medium,
      hard,
      timeSpentMinutes,
      topics,
      notes,
    },
  };
}

export function parseUpdateSessionBody(body: unknown): { data?: SessionUpdateInput; error?: string } {
  if (!isRecord(body)) return { error: "Request body must be an object" };

  const data: SessionUpdateInput = {};
  if (body.date !== undefined) {
    const date = parseDate(body.date);
    if (!date) return { error: "date must be a valid date" };
    data.date = date;
  }
  if (body.platform !== undefined) {
    const platform = parsePlatform(body.platform);
    if (!platform) return { error: "platform must be a supported platform" };
    data.platform = platform;
  }

  const numberFields = ["problemsSolved", "easy", "medium", "hard", "timeSpentMinutes"] as const;
  for (const field of numberFields) {
    if (body[field] === undefined) continue;
    const value = parseBoundedInteger(body[field], {
      min: 0,
      max: field === "timeSpentMinutes" ? 100000 : 10000,
    });
    if (value === null) return { error: `${field} must be a non-negative whole number` };
    data[field] = value;
  }

  if (body.topics !== undefined) {
    const topics = parseTopics(body.topics);
    if (topics === null) return { error: "topics must be an array of short strings" };
    data.topics = topics;
  }

  if (body.notes !== undefined) {
    const notes = parseNotes(body.notes);
    if (notes === null && typeof body.notes !== "string" && body.notes !== null) return { error: "notes must be text" };
    data.notes = notes;
  }

  return { data };
}

export function parseSessionQuery(searchParams: URLSearchParams) {
  const where: Prisma.CodingSessionWhereInput = {};
  const platform = searchParams.get("platform");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const limitRaw = searchParams.get("limit");

  if (platform) {
    const parsed = parsePlatform(platform);
    if (!parsed) return { error: "platform must be a supported platform" };
    where.platform = parsed;
  }

  if (startDate || endDate) {
    const dateFilter: Prisma.DateTimeFilter = {};
    if (startDate) {
      const parsed = parseDate(startDate);
      if (!parsed) return { error: "startDate must be a valid date" };
      dateFilter.gte = parsed;
    }
    if (endDate) {
      const parsed = parseDate(endDate);
      if (!parsed) return { error: "endDate must be a valid date" };
      dateFilter.lte = parsed;
    }
    where.date = dateFilter;
  }

  const limit = parseBoundedInteger(limitRaw, { min: 1, max: 200 });
  if (limitRaw && limit === null) return { error: "limit must be between 1 and 200" };

  return { where, take: limit ?? undefined };
}
