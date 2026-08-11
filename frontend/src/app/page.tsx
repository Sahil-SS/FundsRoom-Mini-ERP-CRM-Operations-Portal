import { ArrowRight, Boxes, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl text-center">
          {/* Brand */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-lg">
            <Boxes className="h-7 w-7" />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            FundsRoom
          </p>

          {/* Hero */}
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Business operations,
            <span className="block text-slate-400">managed in one place.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            A streamlined ERP and CRM operations portal for managing customers,
            products, inventory, sales challans, and day-to-day business
            workflows.
          </p>

          {/* Login CTA */}
          <div className="mt-9 flex justify-center">
            <Link
              href="/login"
              className="group inline-flex items-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-slate-100 hover:shadow-xl"
            >
              Sign in to dashboard
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-3">
            <FeatureCard
              icon={ShieldCheck}
              title="Role-based access"
              description="Secure workflows for Admin, Sales, Warehouse and Accounts."
            />

            <FeatureCard
              icon={Boxes}
              title="Inventory control"
              description="Track stock levels and inventory movements in real time."
            />

            <FeatureCard
              icon={FileText}
              title="Sales challans"
              description="Create, confirm, cancel and export professional challans."
            />
          </div>

          {/* Footer */}
          <p className="mt-14 text-xs text-slate-600">
            FundsRoom · ERP & CRM Operations Portal
          </p>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-left transition hover:border-slate-700 hover:bg-slate-900">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
        <Icon className="h-5 w-5 text-slate-300" />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-white">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
