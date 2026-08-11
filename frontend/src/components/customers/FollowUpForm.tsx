"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface FollowUpFormProps {
  isSubmitting: boolean;
  onSubmit: (values: { note: string; followUpDate: string }) => void;
  onCancel: () => void;
  serverError?: string;
}

export default function FollowUpForm({
  isSubmitting,
  onSubmit,
  onCancel,
  serverError,
}: FollowUpFormProps) {
  const [note, setNote] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (note.trim().length < 1) {
      setError("Follow-up note is required.");
      return;
    }

    if (note.trim().length > 1000) {
      setError("Follow-up note cannot exceed 1000 characters.");
      return;
    }

    if (!followUpDate) {
      setError("Follow-up date is required.");
      return;
    }

    const date = new Date(followUpDate);

    if (Number.isNaN(date.getTime())) {
      setError("Enter a valid follow-up date.");
      return;
    }

    setError(null);

    onSubmit({
      note: note.trim(),
      followUpDate: date.toISOString(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-800">{serverError}</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Follow-up Date
          <span className="ml-1 text-red-500">*</span>
        </label>

        <Input
          type="datetime-local"
          value={followUpDate}
          onChange={(event) => setFollowUpDate(event.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Note
          <span className="ml-1 text-red-500">*</span>
        </label>

        <Textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="What should the sales team follow up on?"
          rows={5}
          disabled={isSubmitting}
        />

        <p className="text-right text-xs text-slate-400">{note.length}/1000</p>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Follow-up"}
        </Button>
      </div>
    </form>
  );
}
