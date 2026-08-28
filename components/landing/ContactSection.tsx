"use client";

import { useState } from "react";
import { Github, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-header";
import { Link001 } from "@/components/ui/skiper-ui/skiper40";
import { Reveal } from "@/components/motion/Reveal";

const CONTACT_EMAIL = "P1.dev@proton.me";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  /**
   * There is no mail backend, so rather than a form that silently discards
   * input, we hand the composed message to the visitor's mail client.
   */
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`UNICC — message from ${name || "a visitor"}`);
    const body = encodeURIComponent(
      `${message}\n\n—\n${name || "Anonymous"}${email ? ` <${email}>` : ""}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="frame scroll-mt-24 py-20 lg:py-[112px]">
      <Reveal>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-20">
          {/* Details */}
          <div>
            <Eyebrow>Contact</Eyebrow>
            <h2 className="mt-6 max-w-[14ch] text-[32px] font-light leading-[1.1] tracking-[-0.64px] text-chalk md:text-[40px]">
              Questions, bugs, or a platform we should add.
            </h2>

            <dl className="mt-10 flex flex-col gap-6">
              <div>
                <dt className="eyebrow">Email</dt>
                <dd className="mt-2 text-body-sm text-bone">
                  <Link001 href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link001>
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Elsewhere</dt>
                <dd className="mt-3 flex items-center gap-3">
                  <a
                    href="https://github.com/LeveL-P1"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="flex size-9 items-center justify-center rounded-pill text-ash transition-colors hover:bg-carbon hover:text-chalk"
                  >
                    <Github size={16} />
                  </a>
                  <a
                    href="https://twitter.com/Level_p1"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Twitter"
                    className="flex size-9 items-center justify-center rounded-pill text-ash transition-colors hover:bg-carbon hover:text-chalk"
                  >
                    <Twitter size={16} />
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Based</dt>
                <dd className="mt-2 text-body-sm text-ash">India — UTC+5:30</dd>
              </div>
            </dl>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="flex flex-col gap-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <Field
                id="contact-name"
                label="Name"
                value={name}
                onChange={setName}
                placeholder="Your name"
              />
              <Field
                id="contact-email"
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contact-message" className="eyebrow">
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="What's on your mind?"
                className="resize-none border-b border-[rgba(212,208,201,0.16)] bg-transparent pb-3 text-body-sm text-bone outline-none transition-colors placeholder:text-smoke focus:border-bone"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" size="lg" variant="solid">
                Send message
              </Button>
              <p className="text-[12px] text-smoke">Opens in your mail client.</p>
            </div>
          </form>
        </div>
      </Reveal>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="border-b border-[rgba(212,208,201,0.16)] bg-transparent pb-3 text-body-sm text-bone outline-none transition-colors placeholder:text-smoke focus:border-bone"
      />
    </div>
  );
}
