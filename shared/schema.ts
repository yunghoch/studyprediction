import { z } from "zod";

export const mbtiTypes = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
] as const;

export type MBTIType = typeof mbtiTypes[number];

export const predictionRequestSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  gender: z.enum(["male", "female"], { required_error: "성별을 선택해주세요" }),
  birthYear: z.string().min(1, "출생년도를 선택해주세요"),
  birthMonth: z.string().min(1, "출생월을 선택해주세요"),
  birthDay: z.string().min(1, "출생일을 선택해주세요"),
  birthHour: z.string().min(1, "출생시를 선택해주세요"),
  birthPeriod: z.enum(["AM", "PM"], { required_error: "오전/오후를 선택해주세요" }),
  calendarType: z.enum(["solar", "lunar"], { required_error: "양력/음력을 선택해주세요" }),
  mbti: z.enum(mbtiTypes, { required_error: "MBTI를 선택해주세요" }),
});

export type PredictionRequest = z.infer<typeof predictionRequestSchema>;

export interface PredictionResult {
  studentName: string;
  sajuAnalysis: {
    fourPillars: string;
    elementAnalysis: string;
    learningInfluence: string;
  };
  mbtiAnalysis: {
    typeDescription: string;
    cognitiveFunction: string;
    learningCharacteristics: string;
  };
  learningStyle: {
    type: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
  };
  studyRecommendations: {
    environment: string;
    environmentSajuBasis: string;
    methods: string[];
    methodsSajuBasis: string;
    schedule: string;
    scheduleSajuBasis: string;
  };
  personalizedTips: string[];
  timestamp: string;
}

// Keep existing user schema for compatibility
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
