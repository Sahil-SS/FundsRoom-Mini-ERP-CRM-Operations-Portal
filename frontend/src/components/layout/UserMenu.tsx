"use client";

import { LogOut, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-3 sm:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
          <UserCircle className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="max-w-32 truncate text-sm font-medium text-slate-900">
            {user.name}
          </p>

          <p className="text-xs font-medium text-slate-500">{user.role}</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        title="Logout"
        className="text-slate-600 hover:bg-red-50 hover:text-red-600"
      >
        <LogOut className="h-4 w-4" />
        <span className="sr-only">Logout</span>
      </Button>
    </div>
  );
}
