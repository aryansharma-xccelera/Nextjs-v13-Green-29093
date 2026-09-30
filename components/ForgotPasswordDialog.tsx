"use client";

import { useState } from "react";
import { validateEmail } from "@/lib/validation";

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordDialog({ isOpen, onClose }: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) {
    return null;
  }

  const emailError = validateEmail(email);

  function handleClose() {
    setEmail("");
    setTouched(false);
    setSuccessMessage("");
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (emailError) {
      setTouched(true);
      return;
    }
    setIsSubmitting(true);
    // MOCK: no real password-reset email service exists yet; simulate the
    // request latency and always report success without sending anything.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    setSuccessMessage(
      `If an account exists for ${email.trim()}, we've sent password reset instructions.`
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-card bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-text-primary">Reset your password</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Enter your account email and we&apos;ll send you reset instructions.
        </p>

        {successMessage ? (
          <>
            <p className="mt-4 rounded-input bg-green-50 px-3 py-2 text-sm text-success">
              {successMessage}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-input bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4">
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
            {touched && emailError && (
              <p className="mt-1 text-xs text-danger">{emailError}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-input border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-input bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send reset link"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
