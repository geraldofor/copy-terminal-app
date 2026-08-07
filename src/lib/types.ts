import type { Id } from "@/convex/_generated/dataModel";

export interface CopyDoc {
  _id: Id<"copies">;
  _creationTime: number;
  template: string;
  title: string;
  content: string;
  input: Record<string, string>;
  createdAt: number;
}

export interface Usage {
  credits: number;
  creditsTotal: number;
  generatedTotal: number;
  savedCount: number;
}
