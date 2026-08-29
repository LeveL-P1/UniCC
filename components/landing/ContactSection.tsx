"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eyebrow } from "@/components/ui/section-header";
import { Reveal } from "@/components/motion/Reveal";

const CONTACT_EMAIL = "P1.dev@proton.me";

const CHANNELS = [
  { label: "GitHub", value: "LeveL-P1", href: "https://github.com/LeveL-P1" },
  { label: "X", value: "@Level_p1", href: "https://twitter.com/Level_p1" },
  {
    label: "Issues",
    value: "UniCC repo",
    href: "https://github.com/LeveL-P1/UniCC/issues",
  },
] as const;

/**
 * Contact reads as a spec sheet: mono labels, hairline rows, one Carbon
 * surface holding both halves. The form composes a mailto rather than
 * pretending to have a backend, and the address is independently copyable
 * for anyone who would rather not hand off to a mail client.
 */
export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      toast.success("Address copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the address");
    }
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(
      `UNICC — message from ${name || "a visitor"}`
    );
    const body = encodeURIComponent(
      `${message}\n\n—\n${name || "Anonymous"}${email ? ` <${email}>` : ""}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="frame scroll-mt-24 py-20 lg:py-[112px]">
      <Reveal>
        {/* No surface fill — the system is flat over near-black, so this sits
            directly on the canvas and lets hairlines carry the structure. */}
        <div className="overflow-hidden rounded-card hairline">
          <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
            {/* Left rail — the spec sheet */}
            <div className="flex flex-col p-8 lg:border-r lg:border-[rgba(212,208,201,0.12)] lg:p-10">
              <Eyebrow>Contact</Eyebrow>
              {/* Each phrase is an inline-block, so the line can only break
                  between them — never mid-phrase. That guarantees 4 words then
                  3 words at every width, instead of stranding one or two.
                  text-balance alone did not hold up at 375px. */}
              <h2 className="mt-5 max-w-[24ch] text-[24px] font-light leading-[1.15] tracking-[-0.5px] text-chalk md:text-[34px] md:tracking-[-0.7px]">
                <span className="inline-block">Tell me what&rsquo;s broken</span>{" "}
                <span className="inline-block">or what&rsquo;s missing.</span>
              </h2>

              <dl className="mt-10 flex flex-col">
                {/* Email gets its own row with a copy affordance. */}
                <div className="flex items-center gap-4 py-3.5 hairline-b">
                  <dt className="eyebrow w-20 shrink-0">Email</dt>
                  <dd className="flex min-w-0 flex-1 items-center justify-between gap-2">
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="truncate text-[13px] text-bone transition-colors hover:text-chalk"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    <button
                      type="button"
                      onClick={copyEmail}
                      aria-label="Copy email address"
                      className="flex size-7 shrink-0 items-center justify-center rounded-pill text-smoke transition-colors hover:bg-tar hover:text-bone"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </dd>
                </div>

                {CHANNELS.map((channel) => (
                  <div
                    key={channel.label}
                    className="flex items-center gap-4 py-3.5 hairline-b"
                  >
                    <dt className="eyebrow w-20 shrink-0">{channel.label}</dt>
                    <dd className="min-w-0 flex-1">
                      <a
                        href={channel.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-1 text-[13px] text-bone transition-colors hover:text-chalk"
                      >
                        {channel.value}
                        <ArrowUpRight
                          size={12}
                          className="text-smoke transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                        />
                      </a>
                    </dd>
                  </div>
                ))}

                <div className="flex items-center gap-4 py-3.5">
                  <dt className="eyebrow w-20 shrink-0">Based</dt>
                  <dd className="text-[13px] text-ash">India — UTC+5:30</dd>
                </div>
              </dl>
            </div>

            {/* Right — the form */}
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-6 border-t border-[rgba(212,208,201,0.12)] p-8 lg:border-t-0 lg:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2.5">
                  <Label htmlFor="contact-name">Name</Label>
                  <Input
                    id="contact-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-2.5">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  required
                  rows={6}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="What's on your mind?"
                  className="min-h-[140px] flex-1"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[12px] text-smoke">
                  Opens your mail client — nothing is sent from this page.
                </p>
                <Button type="submit" size="lg">
                  Compose message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
