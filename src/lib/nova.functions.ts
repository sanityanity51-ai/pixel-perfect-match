import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runStructured, NovaError } from "./nova-ai.server";

const MAX = 60000;
const str = (o: Record<string, unknown>) => ({ type: "object", additionalProperties: false, required: Object.keys(o), properties: o });
const arr = { type: "array", items: { type: "string" } };

// Simple per-instance rate limit
const hits = new Map<string, number[]>();
function rateLimit(key: string) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < 60000);
  if (list.length >= 20) throw new NovaError("You have reached the usage limit. Please wait a minute.", 429);
  list.push(now);
  hits.set(key, list);
}

async function safe<T>(fn: () => Promise<T>): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    rateLimit("global");
    return { ok: true, data: await fn() };
  } catch (e) {
    return { ok: false, error: e instanceof NovaError ? e.message : "Something went wrong while processing your request. Please try again." };
  }
}

export type ResearchResult = { topic: string; summary: string; facts: string[]; insights: string[]; recommendations: string[] };
export const runResearch = createServerFn({ method: "POST" })
  .validator((d) => z.object({ input: z.string().trim().min(3).max(MAX), length: z.enum(["short", "standard", "detailed"]) }).parse(d))
  .handler(({ data }) =>
    safe(() =>
      runStructured<ResearchResult>(
        `Research assistant. Produce a ${data.length} summary. "facts" = key points stated in or well-established about the input (no assumptions). "insights" = your observations, clearly AI-derived. "recommendations" = practical next steps. Keep facts, insights and recommendations strictly separate.`,
        data.input,
        "research",
        str({ topic: { type: "string" }, summary: { type: "string" }, facts: arr, insights: arr, recommendations: arr }),
      ),
    ),
  );

export type MeetingResult = {
  summary: string;
  key_points: string[];
  decisions: string[];
  action_items: { task: string; person: string; deadline: string }[];
  important_dates: { date: string; event: string }[];
};
export const runMeeting = createServerFn({ method: "POST" })
  .validator((d) => z.object({ input: z.string().trim().min(10).max(MAX) }).parse(d))
  .handler(({ data }) =>
    safe(() =>
      runStructured<MeetingResult>(
        `Meeting notes summarizer. Only include decisions explicitly stated. For action items use "Not specified" for missing person or deadline. Never guess.`,
        data.input,
        "meeting",
        str({
          summary: { type: "string" },
          key_points: arr,
          decisions: arr,
          action_items: { type: "array", items: str({ task: { type: "string" }, person: { type: "string" }, deadline: { type: "string" } }) },
          important_dates: { type: "array", items: str({ date: { type: "string" }, event: { type: "string" } }) },
        }),
      ),
    ),
  );

export type EmailResult = { subject: string; body: string };
export const runEmail = createServerFn({ method: "POST" })
  .validator((d) =>
    z.object({
      recipient: z.string().max(300),
      purpose: z.string().max(1000),
      message: z.string().trim().min(3).max(20000),
      tone: z.enum(["Formal", "Professional", "Friendly", "Persuasive", "Polite", "Casual"]),
      length: z.enum(["short", "standard", "detailed"]),
      mode: z.enum(["new", "improve"]),
    }).parse(d),
  )
  .handler(({ data }) =>
    safe(() =>
      runStructured<EmailResult>(
        `${data.mode === "improve" ? "Improve the provided email draft." : "Write a new email."} Tone: ${data.tone}. Length: ${data.length}. Natural, human, no jargon. Include greeting, body, closing and a sign-off placeholder "[Your name]" unless a name is given. Do not invent facts the user did not provide.`,
        `Recipient/audience: ${data.recipient || "Not specified"}\nPurpose: ${data.purpose || "Not specified"}\nContent:\n${data.message}`,
        "email",
        str({ subject: { type: "string" }, body: { type: "string" } }),
      ),
    ),
  );
