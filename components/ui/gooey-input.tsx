"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const GooeyInput = ({
  placeholder = "Search...",
  className,
  value,
  onChange,
}: {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn("relative z-10 w-full max-w-sm", className)}>
      <motion.div
        animate={{
          width: isFocused || value ? "100%" : "3rem",
          borderRadius: "9999px",
        }}
        className={cn(
          "relative flex items-center bg-white shadow-md dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden",
          isFocused || value ? "h-12 px-4" : "h-12 w-12 justify-center"
        )}
      >
        <Search
          className="h-5 w-5 text-neutral-500 shrink-0 cursor-pointer"
          onClick={() => {
            if (!isFocused && !value) {
              setIsFocused(true);
            }
          }}
        />
        <motion.input
          animate={{
            opacity: isFocused || value ? 1 : 0,
            width: isFocused || value ? "100%" : "0%",
            marginLeft: isFocused || value ? "0.75rem" : "0",
          }}
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="h-full bg-transparent outline-none text-sm font-medium text-neutral-700 dark:text-neutral-200 placeholder:text-neutral-400 min-w-0"
        />
      </motion.div>
      
      {/* SVG Filter for Gooey Effect */}
      <svg className="hidden">
        <defs>
          <filter id="gooey-effect">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
