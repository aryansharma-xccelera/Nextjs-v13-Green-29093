import { apiFetch } from "@/lib/api-client";
import { mockUsers } from "@/lib/mock-data";
import { LoginInput, SignUpInput, User } from "@/types";

const USERS_STORAGE_KEY = "auth_users";
const SESSION_STORAGE_KEY = "auth_session";

interface StoredUser extends User {
  password: string;
}

// MOCK: stands in for GET /users — seeds localStorage once from mockUsers.
function loadUsers(): StoredUser[] {
  if (typeof window === "undefined") {
    return mockUsers;
  }
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as StoredUser[];
    } catch {
      return mockUsers;
    }
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mockUsers));
  return mockUsers;
}

function persistUsers(users: StoredUser[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
}

function persistSession(user: User | null): void {
  if (typeof window === "undefined") {
    return;
  }
  if (user) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

function toPublicUser(user: StoredUser): User {
  const { password, ...publicUser } = user;
  return publicUser;
}

// MOCK: stands in for POST /auth/login
function localLogin(input: LoginInput): User {
  const users = loadUsers();
  const normalizedEmail = input.email.trim().toLowerCase();
  const found = users.find((user) => user.email.toLowerCase() === normalizedEmail);
  if (!found || found.password !== input.password) {
    throw new Error("Invalid email or password");
  }
  const publicUser = toPublicUser(found);
  persistSession(publicUser);
  return publicUser;
}

// MOCK: stands in for POST /auth/signup
function localSignUp(input: SignUpInput): User {
  const users = loadUsers();
  const normalizedEmail = input.email.trim().toLowerCase();
  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error("An account with this email already exists");
  }
  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: input.email.trim(),
    password: input.password,
    createdAt: new Date().toISOString(),
  };
  persistUsers([...users, newUser]);
  const publicUser = toPublicUser(newUser);
  persistSession(publicUser);
  return publicUser;
}

// TODO(USE_MOCK): verify path + response shape against the real
// backend's OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

export async function login(input: LoginInput): Promise<User> {
  if (USE_MOCK) {
    return localLogin(input);
  }
  return apiFetch<User>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function signUp(input: SignUpInput): Promise<User> {
  if (USE_MOCK) {
    return localSignUp(input);
  }
  return apiFetch<User>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logout(): void {
  persistSession(null);
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
