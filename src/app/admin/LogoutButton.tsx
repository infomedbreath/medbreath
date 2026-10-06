"use client";

import { logoutAction } from "@/app/admin/actions";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-body transition-colors hover:bg-soft hover:text-ink"
      >
        Sign out
      </button>
    </form>
  );
}