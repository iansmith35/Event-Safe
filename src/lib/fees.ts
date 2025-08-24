/**
 * Fee calculation utilities for EventSafe ticketing
 */

export interface FeeBreakdown {
  platform: number;
  processing: number;
  totalFees: number;
}

/**
 * Calculate platform fees for ticket purchases
 * @param basePriceGBP - Base ticket price in GBP
 * @param qty - Quantity of tickets
 * @param pct - Platform fee percentage (e.g., 8)
 * @param processingGBP - Processing fee per order in GBP (e.g., 1)
 * @returns Fee breakdown with platform fee, processing fee, and total
 */
export function calcPlatformFees(
  basePriceGBP: number, 
  qty: number, 
  pct: number, 
  processingGBP: number
): FeeBreakdown {
  // Platform fee is percentage of base price * quantity
  const platform = +(basePriceGBP * pct / 100 * qty).toFixed(2);
  
  // Processing fee is flat rate per order
  const processing = +processingGBP.toFixed(2);
  
  // Total fees
  const totalFees = +(platform + processing).toFixed(2);

  return {
    platform,
    processing,
    totalFees
  };
}

/**
 * Calculate what the guest pays (clean final price)
 * @param basePriceGBP - Base ticket price in GBP
 * @param qty - Quantity of tickets
 * @param processingGBP - Processing fee per order in GBP
 * @returns Total amount guest pays
 */
export function calcGuestTotal(
  basePriceGBP: number, 
  qty: number, 
  processingGBP: number
): number {
  // Guest pays base price + processing fee (platform fee is absorbed by organiser)
  return +(basePriceGBP * qty + processingGBP).toFixed(2);
}

/**
 * Calculate organiser's net revenue after fees
 * @param basePriceGBP - Base ticket price in GBP
 * @param qty - Quantity of tickets
 * @param pct - Platform fee percentage
 * @param stripeFeeRate - Stripe's fee rate (typically ~2.9% + 20p)
 * @returns Organiser's net revenue after all fees
 */
export function calcOrganiserNet(
  basePriceGBP: number, 
  qty: number, 
  pct: number,
  stripeFeeRate: number = 0.029, // 2.9%
  stripeFeeFixed: number = 0.20   // 20p per transaction
): number {
  const grossRevenue = basePriceGBP * qty;
  const platformFee = +(grossRevenue * pct / 100).toFixed(2);
  
  // Stripe fees calculated on gross revenue
  const stripeFee = +(grossRevenue * stripeFeeRate + stripeFeeFixed).toFixed(2);
  
  const netRevenue = +(grossRevenue - platformFee - stripeFee).toFixed(2);
  
  return Math.max(0, netRevenue); // Ensure non-negative
}

/**
 * Get fee summary for display purposes
 * @param basePriceGBP - Base ticket price in GBP
 * @param qty - Quantity of tickets
 * @param pct - Platform fee percentage
 * @param processingGBP - Processing fee per order in GBP
 * @returns Complete fee breakdown with all calculations
 */
export function getFeeSummary(
  basePriceGBP: number, 
  qty: number, 
  pct: number, 
  processingGBP: number
) {
  const fees = calcPlatformFees(basePriceGBP, qty, pct, processingGBP);
  const guestTotal = calcGuestTotal(basePriceGBP, qty, processingGBP);
  const organiserNet = calcOrganiserNet(basePriceGBP, qty, pct);
  
  return {
    basePriceGBP,
    quantity: qty,
    subtotal: +(basePriceGBP * qty).toFixed(2),
    platformFee: fees.platform,
    processingFee: fees.processing,
    guestTotal,
    organiserNet,
    platformFeePct: pct
  };
}