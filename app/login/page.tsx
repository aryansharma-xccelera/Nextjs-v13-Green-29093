"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { login, signUp } from "@/lib/stores/auth-store";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateRequiredString,
} from "@/lib/validation";
import { ROUTES } from "@/lib/constants";
import { ForgotPasswordDialog } from "@/components/ForgotPasswordDialog";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const errors = {
    name: mode === "signup" ? validateRequiredString(name, "Name") : "",
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword:
      mode === "signup" ? validateConfirmPassword(password, confirmPassword) : "",
  };

  const isValid =
    !errors.name && !errors.email && !errors.password && !errors.confirmPassword;

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setTouched(false);
    setFormError("");
    setFormSuccess("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (!isValid) {
      setTouched(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const user =
        mode === "signin"
          ? await login({ email, password })
          : await signUp({ name, email, password });
      const message =
        mode === "signin"
          ? `Welcome back, ${user.name}!`
          : `Account created — welcome, ${user.name}!`;
      setFormSuccess(message);
      toast.success(message);
      setTimeout(() => {
        router.push(ROUTES.dashboard);
      }, 500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md rounded-card bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33"
              />
            </svg>
          </div>
          <span className="text-xl font-semibold text-text-primary">
            ExpenseTracker
          </span>
        </div>

        <div className="mb-6 flex rounded-input border border-border p-1">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`flex-1 rounded-input py-2 text-sm font-semibold transition-colors ${
              mode === "signin"
                ? "bg-primary text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 rounded-input py-2 text-sm font-semibold transition-colors ${
              mode === "signup"
                ? "bg-primary text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-text-primary">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="Jane Doe"
              />
              {touched && errors.name && (
                <p className="mt-1 text-xs text-danger">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-semibold text-text-primary">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setTouched(true)}
              className="w-full rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="you@example.com"
            />
            {touched && errors.email && (
              <p className="mt-1 text-xs text-danger">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-text-primary">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() => setTouched(true)}
              className="w-full rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
            {touched && errors.password && (
              <p className="mt-1 text-xs text-danger">{errors.password}</p>
            )}
          </div>

          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-text-primary">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                onBlur={() => setTouched(true)}
                className="w-full rounded-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="••••••••"
              />
              {touched && errors.confirmPassword && (
                <p className="mt-1 text-xs text-danger">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {mode === "signin" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {formError && (
            <p className="rounded-input bg-red-50 px-3 py-2 text-sm text-danger">
              {formError}
            </p>
          )}
          {formSuccess && (
            <p className="rounded-input bg-green-50 px-3 py-2 text-sm text-success">
              {formSuccess}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-input bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? mode === "signin"
                ? "Signing in..."
                : "Creating account..."
              : mode === "signin"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-text-secondary">
          Demo credentials: demo@example.com / password123
        </p>
      </div>

      <ForgotPasswordDialog
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </div>
  );
}
