/**
 * Fee Calculation Utilities
 * Handles platform fees, processing fees, and pricing calculations
 */

export interface FeeBreakdown {
  platform: number;
  processing: number;
  totalFees: number;
}

/**
 * Calculate platform fees for an order
 * Platform fee is absorbed by the organiser, so guests see clean pricing
 * 
 * @param basePriceGBP - Base ticket price in GBP
 * @param qty - Quantity of tickets
 * @param pct - Platform fee percentage (e.g., 8 for 8%)
 * @param processingGBP - Processing fee per order in GBP
 */
export function calcPlatformFees(
  basePriceGBP: number,
  qty: number,
  pct: number,
  processingGBP: number
): FeeBreakdown {
  // Platform fee is calculated as percentage of total ticket value
  const platform = +(basePriceGBP * pct / 100 * qty).toFixed(2);
  
  // Processing fee is per order, not per ticket
  const processing = +processingGBP.toFixed(2);
  
  const totalFees = +(platform + processing).toFixed(2);
  
  return {
    platform,
    processing,
    totalFees
  };
}

/**
 * Calculate guest-visible price (clean price without platform fee)
 * 
 * @param basePriceGBP - Base ticket price
 * @param qty - Quantity of tickets
 * @param processingGBP - Processing fee (shown to guest)
 */
export function calcGuestTotal(
  basePriceGBP: number,
  qty: number,
  processingGBP: number
): number {
  const ticketTotal = +(basePriceGBP * qty).toFixed(2);
  const processing = +processingGBP.toFixed(2);
  return +(ticketTotal + processing).toFixed(2);
}

/**
 * Calculate organiser net amount after platform fees
 * 
 * @param basePriceGBP - Base ticket price
 * @param qty - Quantity of tickets
 * @param platformFeePct - Platform fee percentage
 */
export function calcOrganiserNet(
  basePriceGBP: number,
  qty: number,
  platformFeePct: number
): number {
  const grossRevenue = basePriceGBP * qty;
  const platformFee = grossRevenue * platformFeePct / 100;
  return +(grossRevenue - platformFee).toFixed(2);
}

/**
 * Calculate Stripe fees (approximate)
 * Standard Stripe fee is 2.9% + 30p per successful charge
 * 
 * @param amountGBP - Amount being charged in GBP
 */
export function calcStripeFees(amountGBP: number): number {
  const percentageFee = amountGBP * 0.029; // 2.9%
  const fixedFee = 0.30; // 30p
  return +(percentageFee + fixedFee).toFixed(2);
}

/**
 * Create a complete fee breakdown for an order
 */
export interface CompleteBreakdown {
  ticketPrice: number;
  quantity: number;
  subtotal: number;
  processingFee: number;
  guestTotal: number;
  platformFee: number;
  stripeFee: number;
  organiserNet: number;
}

export function createCompleteBreakdown(
  basePriceGBP: number,
  qty: number,
  platformFeePct: number,
  processingFeeGBP: number
): CompleteBreakdown {
  const subtotal = +(basePriceGBP * qty).toFixed(2);
  const processingFee = +processingFeeGBP.toFixed(2);
  const guestTotal = +(subtotal + processingFee).toFixed(2);
  const platformFee = +(subtotal * platformFeePct / 100).toFixed(2);
  const stripeFee = calcStripeFees(guestTotal);
  const organiserNet = +(subtotal - platformFee).toFixed(2);

  return {
    ticketPrice: +basePriceGBP.toFixed(2),
    quantity: qty,
    subtotal,
    processingFee,
    guestTotal,
    platformFee,
    stripeFee,
    organiserNet
  };
}