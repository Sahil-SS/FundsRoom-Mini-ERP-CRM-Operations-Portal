"use client";

import { CalendarDays, Clock } from "lucide-react";

import type { FollowUp } from "@/types/customer";

interface FollowUpTimelineProps {
  followUps: FollowUp[];
  isLoading: boolean;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function FollowUpTimeline({
  followUps,
  isLoading,
}: FollowUpTimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="animate-pulse rounded-lg bg-slate-100 p-4">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-full rounded bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  if (followUps.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <Clock className="mx-auto h-5 w-5 text-slate-400" />

        <p className="mt-3 text-sm font-semibold text-slate-700">
          No follow-ups yet
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Add a follow-up to start the CRM activity timeline.
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      {followUps.map((followUp) => (
        <div
          key={followUp.id}
          className="relative rounded-lg border border-slate-200 bg-slate-50 p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-500" />

                <p className="text-sm font-semibold text-slate-800">
                  Follow-up
                </p>
              </div>

              <p className="mt-1 text-xs font-medium text-slate-500">
                {formatDate(followUp.followUpDate)}
              </p>
            </div>

            <p className="text-xs text-slate-400">
              Added {formatDate(followUp.createdAt)}
            </p>
          </div>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {followUp.note}
          </p>
        </div>
      ))}
    </div>
  );
}
