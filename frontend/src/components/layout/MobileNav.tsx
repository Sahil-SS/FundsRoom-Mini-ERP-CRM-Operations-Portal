"use client";

import {
  FileText,
  LayoutDashboard,
  Menu,
  Package,
  Users,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { getNavigationForRole } from "@/lib/auth/permissions";
import type { NavigationItem } from "@/lib/auth/permissions";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

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

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  const navigation = getNavigationForRole(user.role);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-slate-200 px-6 py-5 text-left">
          <SheetTitle className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
              F
            </div>

            <div>
              <p className="text-base font-bold">FundsRoom</p>

              <p className="text-xs font-normal text-slate-500">
                Operations Portal
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <nav className="space-y-1 p-4">
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
                onClick={() => setOpen(false)}
                className={[
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")}
              >
                <NavigationIcon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
