import { z } from "zod";

// Enum for practice item types
export enum PracticeItemType {
  SCALE = "scale",
  CHORD = "chord",
  FRAGMENT = "fragment",
  PIECE = "piece",
  PROGRESSION = "progression"
}

// Zod schema for practice item
export const PracticeItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.nativeEnum(PracticeItemType),
  title: z.string().min(1),
  difficulty: z.number().int().min(1).max(5),
  targetTempoMin: z.number().int().min(40),
  targetTempoMax: z.number().int().min(40),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastPracticed: z.date().optional(),
  intervalStage: z.number().int().min(0).default(0),
  nextDue: z.date().optional(),
  notes: z.string().optional(),
  // These will be used in future features
  tags: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
});

// Type for practice item
export type PracticeItem = z.infer<typeof PracticeItemSchema>;

// Zod schema for practice session
export const PracticeSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  itemId: z.string(),
  date: z.date(),
  status: z.enum(["completed", "struggled", "skipped"]),
  actualTempo: z.number().int().min(40).optional(),
  notes: z.string().optional(),
});

// Type for practice session
export type PracticeSession = z.infer<typeof PracticeSessionSchema>;

// Leitner box intervals (in days)
export const DEFAULT_INTERVALS = [1, 3, 7, 14, 30]; 