
const API_BASE_URL = "https://inai-col2.fishrungames.com";

export interface Credentials {
  username: string;
  password: string;
}

export interface UserProfile {
  first_name: string;
  specialization: string;
  specialization_display: string;
  bio: string;
  fee: string;
}

export interface CurrentUser {
  id: number;
  username: string;
  profile: UserProfile;
}

export interface ProfileUpdate {
  first_name?: string;
  specialization?: string;
  bio?: string;
  fee?: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Ошибка сервера: ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function register(
  credentials: Credentials,
): Promise<unknown> {
  return request("/api/register/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function login(
  credentials: Credentials,
): Promise<unknown> {
  return request("/api/login/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function logout(): Promise<unknown> {
  return request("/api/logout/", {
    method: "POST",
  });
}

export function getProfile(): Promise<CurrentUser> {
  return request<CurrentUser>("/api/profile/");
}

export function updateProfile(
  data: ProfileUpdate,
): Promise<CurrentUser> {
  return request<CurrentUser>("/api/profile/", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
