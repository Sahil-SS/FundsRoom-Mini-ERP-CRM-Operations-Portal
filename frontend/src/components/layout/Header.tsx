"use client";

import { usePathname } from "next/navigation";

import MobileNav from "@/components/layout/MobileNav";
import UserMenu from "@/components/layout/UserMenu";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/customers": "Customers",
  "/products": "Products",
  "/inventory": "Inventory",
  "/challans": "Sales Challans",
};

function getPageTitle(pathname: string) {
  const matchingRoute = Object.keys(pageTitles)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname === route || pathname.startsWith(`${route}/`));

  return matchingRoute ? pageTitles[matchingRoute] : "Operations Portal";
}

export default function Header() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />

        <div>
          <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
            {pageTitle}
          </h1>

          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your business operations
          </p>
        </div>
      </div>

      <UserMenu />
    </header>
  );
}
