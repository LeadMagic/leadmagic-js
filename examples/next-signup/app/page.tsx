import { SignupForm } from "./signup-form";

export default function Page() {
  return (
    <main className="mx-auto grid min-h-dvh max-w-sm content-center gap-6 px-4">
      <div className="grid gap-1">
        <h1 className="text-xl font-semibold">Join the waitlist</h1>
        <p className="text-muted-foreground text-sm">
          We check the address when you leave the field.
        </p>
      </div>
      <SignupForm />
    </main>
  );
}
