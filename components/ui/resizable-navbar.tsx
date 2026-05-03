"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export const Navbar = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("fixed top-4 inset-x-0 mx-auto w-fit z-50", className)}>
      {children}
    </div>
  );
};

export const NavBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "hidden md:flex items-center justify-between gap-6 rounded-full border border-neutral-200 bg-white/70 px-6 py-3 shadow-md backdrop-blur-md dark:border-neutral-800 dark:bg-black/70",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({
  items,
  className,
}: {
  items: { name: string; link: string }[];
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center gap-6", className)}>
      {items.map((item, idx) => (
        <a
          key={idx}
          href={item.link}
          className="text-sm font-medium text-neutral-600 transition-colors hover:text-black dark:text-neutral-300 dark:hover:text-white"
        >
          {item.name}
        </a>
      ))}
    </div>
  );
};

export const MobileNav = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 md:hidden px-4 max-w-sm mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-full border border-neutral-200 bg-white/70 px-6 py-3 shadow-md backdrop-blur-md dark:border-neutral-800 dark:bg-black/70",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  isOpen,
  onClose,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={cn(
            "absolute inset-x-4 top-16 flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl dark:border-neutral-800 dark:bg-black",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
    >
      {isOpen ? <X size={18} /> : <Menu size={18} />}
    </button>
  );
};

export const NavbarLogo = () => {
  return (
    <a href="/" className="flex items-center gap-2">
      <span className="text-xl font-bold tracking-tight text-black dark:text-white">
        UniCC
      </span>
    </a>
  );
};

export const NavbarButton = ({
  variant = "primary",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
}) => {
  return (
    <button
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
        variant === "primary"
          ? "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          : "bg-neutral-100 text-black hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
