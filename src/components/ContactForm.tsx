"use client";

import { useState } from "react";
import { site } from "@/data/site";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const phone = String(data.get("phone") || "");
    const message = String(data.get("message") || "");

    const subject = `Website enquiry from ${name || "visitor"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      "",
      message,
    ].join("\n");

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const field =
    "h-12 rounded-lg border border-line bg-white px-4 text-sm outline-none transition-colors placeholder:text-body/60 focus:border-brand-ink";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Your name *" className={field} />
        <input
          name="email"
          type="email"
          required
          placeholder="Your email *"
          className={field}
        />
      </div>
      <input
        name="phone"
        placeholder="Phone / WhatsApp"
        className={`${field} w-full`}
      />
      <textarea
        name="message"
        required
        rows={5}
        placeholder="Your message *"
        className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-body/60 focus:border-brand-ink"
      />
      <button
        type="submit"
        className="rounded-full bg-brand px-8 py-3.5 text-sm font-medium text-brand-deep transition-colors hover:bg-brand-dark"
      >
        Send message
      </button>
      {sent && (
        <p className="text-sm text-brand-ink">
          Thank you. Your email client should open with the message ready to
          send. You can also email us directly at {site.email}.
        </p>
      )}
    </form>
  );
}
