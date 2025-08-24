/**
 * Configuration types for EventSafe admin features
 */

export type Features = {
  ticketing: boolean;
  map: boolean;
  ai: boolean;
  guestAccounts: boolean;
  hostAccounts: boolean;
  venueAccounts: boolean;
  doorScan: boolean;
  guestToGuestScan: boolean;
  court: boolean;
  staffSeats: boolean;
  refundsEnabled: boolean;
  newSignups: boolean;
  notifications: boolean;
};

export type Pricing = {
  platformFeePct: number; // 8
  processingFeeGBP: number; // 1
  guestMembershipGBPPerYear: number; // 3
  venueSubscriptionGBPPerMonth: number; // 40
  courtCaseGBP: number; // 3
};

export type Limits = {
  aiGuestDailyMessages: number;
};

export type AdminFlags = {
  globalReadOnly: boolean; // emergency kill switch
};

export type EntityStatus = {
  suspended?: boolean;
  notes?: string;
};

// Default configurations
export const DEFAULT_FEATURES: Features = {
  ticketing: true,
  map: true,
  ai: true,
  guestAccounts: true,
  hostAccounts: true,
  venueAccounts: true,
  doorScan: true,
  guestToGuestScan: false,
  court: false,
  staffSeats: false,
  refundsEnabled: true,
  newSignups: true,
  notifications: true,
};

export const DEFAULT_PRICING: Pricing = {
  platformFeePct: 8,
  processingFeeGBP: 1,
  guestMembershipGBPPerYear: 3,
  venueSubscriptionGBPPerMonth: 40,
  courtCaseGBP: 3,
};

export const DEFAULT_LIMITS: Limits = {
  aiGuestDailyMessages: 10,
};

export const DEFAULT_ADMIN_FLAGS: AdminFlags = {
  globalReadOnly: false,
};