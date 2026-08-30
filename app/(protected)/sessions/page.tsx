"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { Surface, Tag } from "@/components/ui/surface";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-header";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyNote } from "@/components/ui/empty-note";
import { PlatformMark } from "@/components/ui/platform-mark";
import { SessionForm, type SessionFormData } from "@/components/sessions/SessionsForm";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  date: string;
  platform: string;
  problemsSolved: number;
  easy: number;
  medium: number;
  hard: number;
  timeSpentMinutes: number;
  topics: string[];
  notes: string | null;
}

const DIFFICULTY_TONE = {
  easy: "text-signal-green",
  medium: "text-signal-orange",
  hard: "text-signal-violet",
} as const;

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Session | null>(null);
  const [filter, setFilter] = useState("ALL");

  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch("/api/sessions");
      const data = await response.json();
      setSessions(data.sessions ?? []);
    } catch {
      toast.error("Could not load sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditing(null);
  };

  const save = async (formData: SessionFormData) => {
    const isEdit = Boolean(editing);
    const url = isEdit ? `/api/sessions/${editing?.id}` : "/api/sessions";

    try {
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          problemsSolved: formData.easy + formData.medium + formData.hard,
        }),
      });

      if (!response.ok) throw new Error();
      toast.success(isEdit ? "Session updated" : "Session added");
      closeDrawer();
      void fetchSessions();
    } catch {
      toast.error(isEdit ? "Could not update session" : "Could not add session");
    }
  };

  const remove = async (session: Session) => {
    if (!confirm("Delete this session? This cannot be undone.")) return;

    try {
      const response = await fetch(`/api/sessions/${session.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      toast.success("Session deleted");
      void fetchSessions();
    } catch {
      toast.error("Could not delete session");
    }
  };

  const platforms = useMemo(
    () => ["ALL", ...new Set(sessions.map((session) => session.platform))],
    [sessions]
  );

  const visible = useMemo(
    () =>
      filter === "ALL"
        ? sessions
        : sessions.filter((session) => session.platform === filter),
    [sessions, filter]
  );

  const totals = useMemo(
    () =>
      visible.reduce(
        (acc, session) => ({
          problems: acc.problems + session.problemsSolved,
          minutes: acc.minutes + session.timeSpentMinutes,
        }),
        { problems: 0, minutes: 0 }
      ),
    [visible]
  );

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Practice log</Eyebrow>
          <h1 className="mt-3 text-[24px] font-light leading-[1.15] tracking-[-0.48px] text-chalk md:text-[30px] md:tracking-[-0.6px]">
            Sessions
          </h1>
          <p className="mt-3 max-w-[52ch] text-body-sm text-ash">
            What you log here feeds velocity, consistency and the topic
            breakdown on the overview.
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => {
            setEditing(null);
            setDrawerOpen(true);
          }}
        >
          <Plus size={15} />
          Add session
        </Button>
      </header>

      {/* Filter + running totals */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-1">
          {platforms.map((platform) => (
            <button
              key={platform}
              type="button"
              onClick={() => setFilter(platform)}
              aria-pressed={filter === platform}
              className={cn(
                "rounded-pill px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
                filter === platform
                  ? "bg-bone text-obsidian"
                  : "bg-carbon text-ash hairline hover:text-bone"
              )}
            >
              {platform}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.1em] text-smoke">
          <span>
            {visible.length} session{visible.length === 1 ? "" : "s"}
          </span>
          <span className="text-bone">{totals.problems} solved</span>
          <span>{Math.round((totals.minutes / 60) * 10) / 10}h</span>
        </div>
      </div>

      <Surface padded={false} className="overflow-hidden">
        {loading ? (
          <div className="flex flex-col gap-px bg-[rgba(212,208,201,0.12)]">
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} className="h-16 animate-pulse bg-carbon" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="p-6">
            <EmptyNote
              icon={FileText}
              title={filter === "ALL" ? "No sessions yet" : `No ${filter} sessions`}
              body={
                filter === "ALL"
                  ? "Log what you solved and UNICC starts reporting velocity and consistency."
                  : "Nothing recorded on this platform so far."
              }
              action={{
                label: "Add session",
                onClick: () => {
                  setEditing(null);
                  setDrawerOpen(true);
                },
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse">
              <thead>
                <tr className="hairline-b">
                  {["Date", "Platform", "Topics", "Solved", "E", "M", "H", "Time", ""].map(
                    (heading, index) => (
                      <th
                        key={heading || index}
                        scope="col"
                        className={cn(
                          "px-5 py-3.5 font-mono text-[10px] font-normal uppercase tracking-[0.1em] text-smoke",
                          index >= 3 && index <= 7 ? "text-right" : "text-left"
                        )}
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {visible.map((session) => (
                  <tr
                    key={session.id}
                    className="group transition-colors hairline-b last:border-b-0 hover:bg-tar"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-[13px] text-bone">
                      {new Date(session.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-2.5">
                        <PlatformMark platform={session.platform} size={24} />
                        <span className="text-[13px] text-ash">
                          {session.platform}
                        </span>
                      </span>
                    </td>
                    <td className="max-w-[220px] px-5 py-4">
                      <span className="flex flex-wrap gap-1">
                        {session.topics.slice(0, 2).map((topic) => (
                          <Tag key={topic} className="normal-case">
                            {topic}
                          </Tag>
                        ))}
                        {session.topics.length > 2 ? (
                          <Tag>+{session.topics.length - 2}</Tag>
                        ) : null}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-[13px] text-chalk tabular-nums">
                      {session.problemsSolved}
                    </td>
                    <td className={cn("px-5 py-4 text-right font-mono text-[13px] tabular-nums", DIFFICULTY_TONE.easy)}>
                      {session.easy}
                    </td>
                    <td className={cn("px-5 py-4 text-right font-mono text-[13px] tabular-nums", DIFFICULTY_TONE.medium)}>
                      {session.medium}
                    </td>
                    <td className={cn("px-5 py-4 text-right font-mono text-[13px] tabular-nums", DIFFICULTY_TONE.hard)}>
                      {session.hard}
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-[13px] text-ash tabular-nums">
                      {session.timeSpentMinutes}m
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                        <Button
                          variant="quiet"
                          size="icon-sm"
                          aria-label="Edit session"
                          onClick={() => {
                            setEditing(session);
                            setDrawerOpen(true);
                          }}
                        >
                          <Pencil size={13} />
                        </Button>
                        <Button
                          variant="quiet"
                          size="icon-sm"
                          aria-label="Delete session"
                          className="hover:text-destructive"
                          onClick={() => remove(session)}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Surface>

      <Drawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        title={editing ? "Edit session" : "Add session"}
        description={
          editing
            ? "Changes recompute your analytics on save."
            : "Record what you solved and how long it took."
        }
      >
        <SessionForm
          onSubmit={save}
          onCancel={closeDrawer}
          isEdit={Boolean(editing)}
          initialData={
            editing
              ? {
                  date: editing.date.split("T")[0],
                  platform: editing.platform,
                  problemsSolved: editing.problemsSolved,
                  easy: editing.easy,
                  medium: editing.medium,
                  hard: editing.hard,
                  timeSpentMinutes: editing.timeSpentMinutes,
                  topics: editing.topics,
                  notes: editing.notes ?? "",
                }
              : undefined
          }
        />
      </Drawer>
    </div>
  );
}
