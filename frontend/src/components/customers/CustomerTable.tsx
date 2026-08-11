"use client";

import { Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";

import StatusBadge from "@/components/common/StatusBadge";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Customer } from "@/types/customer";

interface CustomerTableProps {
  customers: Customer[];
}

function formatCustomerType(type: Customer["type"]) {
  return type.charAt(0) + type.slice(1).toLowerCase();
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
        <p className="font-semibold text-slate-900">No customers found</p>

        <p className="mt-1 text-sm text-slate-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-212.5 text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Customer
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Business
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Mobile
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Type
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Status
              </th>

              <th className="w-20 px-5 py-3.5 text-right font-semibold text-slate-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {customer.name}
                    </p>

                    {customer.email && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {customer.email}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {customer.businessName || "—"}
                </td>

                <td className="px-5 py-4 font-medium text-slate-700">
                  {customer.mobile}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {formatCustomerType(customer.type)}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={customer.status} />
                </td>

                <td className="px-5 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Actions for ${customer.name}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link
                          href={`/customers/${customer.id}`}
                          className="flex w-full items-center"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View customer
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
