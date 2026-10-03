const API_URL = "http://localhost:8000"

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Ha ocurrido un error")
  }

  return data
}

export interface Customer {
  id: number
  name: string
  phone: string
}

export interface AuthResponse {
  success: boolean
  accessToken: string
  tokenType: string
  customer: Customer
}

export interface MeResponse {
  id: number
  name: string
  phone: string
  stars: number
  freeDrinkStars: number
  canRedeem: boolean
}

export function login(phone: string, pin: string) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      phone,
      pin,
    }),
  })
}

export function register(
  name: string,
  phone: string,
  pin: string,
) {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      phone,
      pin,
    }),
  })
}

export function getMe(token: string) {
  return request<MeResponse>("/api/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export interface RedemptionResponse {
  success: boolean
  id: number
  code: string
  status: string
  starsUsed: number
}

export function createRedemption(token: string) {
  return request<RedemptionResponse>("/api/redemptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}