"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A switch, drawn as a pill. Bone when on, Tar when off — no chromatic
 * accent, because a settings toggle is not a data point.
 */
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-pill border transition-colors",
        checked
          ? "border-bone bg-bone"
          : "border-[rgba(212,208,201,0.2)] bg-tar hover:border-[rgba(212,208,201,0.36)]"
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 520, damping: 34 }}
        className={cn(
          "block size-3.5 rounded-full",
          checked ? "ml-auto mr-[3px] bg-obsidian" : "ml-[3px] bg-smoke"
        )}
      />
    </button>
  );
}

export function ToggleRow({
  label,
  description,
  icon: Icon,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  icon?: LucideIcon;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-4 py-4 hairline-b last:border-b-0 last:pb-0 first:pt-0">
      {Icon ? (
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-icon bg-tar text-smoke">
          <Icon size={14} />
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <p className="text-body-sm text-bone">{label}</p>
        <p className="mt-1 max-w-[48ch] text-[12px] text-smoke">{description}</p>
      </div>

      <div className="pt-1">
        <Switch checked={checked} onChange={onChange} label={label} />
      </div>
    </div>
  );
}

/** Two-option pill selector for mutually exclusive settings. */
export function ChoiceRow<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; icon?: LucideIcon }[];
}) {
  return (
    <div className="flex gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-pill px-4 py-2.5 text-[13px] transition-colors",
              active
                ? "bg-bone text-obsidian"
                : "bg-tar text-ash hairline hover:text-bone"
            )}
          >
            {option.icon ? <option.icon size={14} /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
