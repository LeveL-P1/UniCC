"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SessionFormProps {
  onSubmit: (data: SessionFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: SessionFormData;
  isEdit?: boolean;
}

export interface SessionFormData {
  date: string;
  platform: string;
  problemsSolved: number;
  easy: number;
  medium: number;
  hard: number;
  timeSpentMinutes: number;
  topics: string[];
  notes: string;
}

const PLATFORMS = [
  "LEETCODE",
  "CODEFORCES",
  "CODECHEF",
  "GEEKSFORGEEKS",
  "HACKERRANK",
  "ATCODER",
  "OTHER",
];

const COMMON_TOPICS = [
  "array", "string", "hash-table", "dynamic-programming",
  "math", "sorting", "greedy", "depth-first-search",
  "binary-search", "breadth-first-search", "tree", "matrix",
  "two-pointers", "binary-tree", "heap", "stack",
  "graph", "sliding-window", "backtracking", "linked-list",
];

const DIFFICULTIES = [
  { key: "easy", label: "Easy", signal: "var(--color-signal-green)" },
  { key: "medium", label: "Medium", signal: "var(--color-signal-orange)" },
  { key: "hard", label: "Hard", signal: "var(--color-signal-violet)" },
] as const;

export function SessionForm({
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
}: SessionFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<SessionFormData>(
    initialData ?? {
      date: new Date().toISOString().split("T")[0],
      platform: "LEETCODE",
      problemsSolved: 0,
      easy: 0,
      medium: 0,
      hard: 0,
      timeSpentMinutes: 0,
      topics: [],
      notes: "",
    }
  );

  const total = useMemo(
    () => formData.easy + formData.medium + formData.hard,
    [formData.easy, formData.medium, formData.hard]
  );

  /** Inline field errors — never a blocking window.alert. */
  const validate = () => {
    const next: Record<string, string> = {};
    if (total === 0) next.problems = "Add at least one problem.";
    if (formData.timeSpentMinutes <= 0) next.time = "Enter the time spent.";
    if (formData.topics.length === 0) next.topics = "Pick at least one topic.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topic: string) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((value) => value !== topic)
        : [...prev.topics, topic],
    }));
    setErrors((prev) => ({ ...prev, topics: "" }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date" htmlFor="date">
          <Input
            id="date"
            type="date"
            required
            value={formData.date}
            onChange={(event) =>
              setFormData({ ...formData, date: event.target.value })
            }
          />
        </Field>

        <Field label="Platform" htmlFor="platform">
          <select
            id="platform"
            required
            value={formData.platform}
            onChange={(event) =>
              setFormData({ ...formData, platform: event.target.value })
            }
            className="h-10 w-full rounded-input border border-[rgba(212,208,201,0.16)] bg-tar px-3 text-body-sm text-bone transition-colors focus-visible:border-bone focus-visible:outline-none"
          >
            {PLATFORMS.map((platform) => (
              <option key={platform} value={platform} className="bg-carbon">
                {platform}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Problems by difficulty" error={errors.problems}>
        <div className="grid grid-cols-3 gap-3">
          {DIFFICULTIES.map((difficulty) => (
            <div key={difficulty.key} className="flex flex-col gap-2">
              <span className="flex items-center gap-1.5 text-[11px] text-ash">
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: difficulty.signal }}
                />
                {difficulty.label}
              </span>
              <Input
                type="number"
                min="0"
                aria-label={difficulty.label}
                value={formData[difficulty.key]}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    [difficulty.key]: parseInt(event.target.value, 10) || 0,
                  });
                  setErrors((prev) => ({ ...prev, problems: "" }));
                }}
              />
            </div>
          ))}
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-smoke">
          Total {total}
        </p>
      </Field>

      <Field label="Time spent (minutes)" htmlFor="time" error={errors.time}>
        <Input
          id="time"
          type="number"
          min="0"
          value={formData.timeSpentMinutes}
          onChange={(event) => {
            setFormData({
              ...formData,
              timeSpentMinutes: parseInt(event.target.value, 10) || 0,
            });
            setErrors((prev) => ({ ...prev, time: "" }));
          }}
        />
      </Field>

      <Field label="Topics practised" error={errors.topics}>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_TOPICS.map((topic) => {
            const active = formData.topics.includes(topic);
            return (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
                aria-pressed={active}
                className={cn(
                  "rounded-pill px-2.5 py-1 text-[11px] transition-colors",
                  active
                    ? "bg-bone text-obsidian"
                    : "bg-tar text-ash hover:text-bone border border-[rgba(212,208,201,0.12)]"
                )}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Notes (optional)" htmlFor="notes">
        <Textarea
          id="notes"
          rows={4}
          value={formData.notes}
          onChange={(event) =>
            setFormData({ ...formData, notes: event.target.value })
          }
          placeholder="Thoughts, learnings, what to revisit…"
        />
      </Field>

      <div className="flex gap-2 border-t border-[rgba(212,208,201,0.12)] pt-6">
        <Button type="submit" size="lg" disabled={loading} className="flex-1">
          {loading ? "Saving…" : isEdit ? "Update session" : "Add session"}
        </Button>
        <Button
          type="button"
          size="lg"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p role="alert" className="text-[12px] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
