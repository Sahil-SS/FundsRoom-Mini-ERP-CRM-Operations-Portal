import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">FundsRoom</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            ERP + CRM Operations Portal
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
