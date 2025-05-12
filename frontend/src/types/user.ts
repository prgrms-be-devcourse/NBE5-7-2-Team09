// src/types/user.ts

export interface UserProfile {
  nickname: string;
  email: string;
  phoneNumber: string;
  points: number;
}

export interface Subscription {
  isActive: boolean;
  plan?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
}

export interface ProfileUpdateRequest {
  nickname?: string;
  phoneNumber?: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data?: UserProfile;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}
