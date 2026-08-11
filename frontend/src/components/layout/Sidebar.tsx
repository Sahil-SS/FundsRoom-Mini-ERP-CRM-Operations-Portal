"use client";

import {
  FileText,
  LayoutDashboard,
  Package,
  Users,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { getNavigationForRole } from "@/lib/auth/permissions";
import type { NavigationItem } from "@/lib/auth/permissions";

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  users: Users,
  package: Package,
  warehouse: Warehouse,
  "file-text": FileText,
};

function NavigationIcon({ icon }: { icon: NavigationItem["icon"] }) {
  const Icon = iconMap[icon as keyof typeof iconMap];

  if (!Icon) {
    return null;
  }

  return <Icon className="h-4.5 w-4.5" />;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const navigation = getNavigationForRole(user.role);

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
            F
          </div>

          <div>
            <p className="text-base font-bold tracking-tight text-slate-900">
              FundsRoom
            </p>

            <p className="text-[11px] font-medium text-slate-500">
              Operations Portal
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")}
            >
              <NavigationIcon icon={item.icon} />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="truncate text-sm font-semibold text-slate-900">
            {user.name}
          </p>

          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {user.role}
          </p>
        </div>
      </div>
    </aside>
  );
}
