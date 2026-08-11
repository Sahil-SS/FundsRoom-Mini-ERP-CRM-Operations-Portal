import type { UserRole } from "@/types/auth";

export interface NavigationItem {
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "layout-dashboard",
    roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"],
  },
  {
    label: "Customers",
    href: "/customers",
    icon: "users",
    roles: ["ADMIN", "SALES", "ACCOUNTS"],
  },
  {
    label: "Products",
    href: "/products",
    icon: "package",
    roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"],
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: "warehouse",
    roles: ["ADMIN", "WAREHOUSE"],
  },
  {
    label: "Challans",
    href: "/challans",
    icon: "file-text",
    roles: ["ADMIN", "SALES", "ACCOUNTS"],
  },
];

export function canAccessNavigation(
  role: UserRole,
  item: NavigationItem,
): boolean {
  return item.roles.includes(role);
}

export function getNavigationForRole(role: UserRole) {
  return navigationItems.filter((item) => canAccessNavigation(role, item));
}
