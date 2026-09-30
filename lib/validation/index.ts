export function validateRequiredString(value: string, fieldName: string): string {
  if (!value || !value.trim()) {
    return `${fieldName} is required`;
  }
  return "";
}

export function validateAmount(value: string): string {
  if (!value || !value.trim()) {
    return "Amount is required";
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return "Amount must be a valid number";
  }
  if (numeric <= 0) {
    return "Amount must be a positive number greater than zero";
  }
  return "";
}

export function validateDate(value: string): string {
  if (!value) {
    return "Date is required";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Date must be valid";
  }
  return "";
}

export function validateEmail(value: string): string {
  if (!value || !value.trim()) {
    return "Email is required";
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value.trim())) {
    return "Enter a valid email address";
  }
  return "";
}

export function validatePassword(value: string): string {
  if (!value) {
    return "Password is required";
  }
  if (value.length < 6) {
    return "Password must be at least 6 characters";
  }
  return "";
}

export function validateConfirmPassword(password: string, confirmPassword: string): string {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return "";
}

export function validateCategoryName(value: string, existingNames: string[]): string {
  if (!value || !value.trim()) {
    return "Category name is required";
  }
  if (value.trim().length < 2) {
    return "Category name must be at least 2 characters";
  }
  const normalized = value.trim().toLowerCase();
  if (existingNames.some((name) => name.toLowerCase() === normalized)) {
    return "This category already exists";
  }
  return "";
}
