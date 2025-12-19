export interface SellerMetrics {
  monthlySalesVolume: number; // Number of orders per month
  returnRate: number; // Percentage (0-100)
  onTimeDeliveryRate: number; // Percentage (0-100)
  ratings: number; // Rating score (0-100)
  monthsOnPlatform: number; // Months since joining (for time decay calculation)
  totalMarketSales?: number; // Total market sales (optional, defaults to estimated value)
}

export interface CalculationResult {
  qualityScore: number; // 0-1 (normalized)
  weeklyTokenReward: number;
  monthlyTokenReward: number;
  sellerPool: number; // Current seller pool size
  salesShare: number; // Seller's share of market sales
  timeDecayFactor: number;
  projection6Months: number;
  projection12Months: number;
  breakdown: {
    returnRateComponent: number;
    deliveryComponent: number;
    ratingsComponent: number;
  };
  suggestions: string[];
}

// Constants from PDF formula
const TOTAL_SUPPLY = 1000000; // Total token supply (can be adjusted)
const SBASE = 0.25 * TOTAL_SUPPLY; // 25% of total supply for seller pool
const DELTA = 0.15; // Pool reduction rate (δ = 0.15)
const MIN_QUALITY_SCORE = 0.6; // Minimum quality score (0-1) to receive tokens
const WSALES = 0.5; // Weight for sales shares in allocation
const WQUALITY = 0.5; // Weight for quality scores in allocation
const WEEKS_PER_MONTH = 4.33; // Average weeks per month
const DEFAULT_MARKET_SALES_MULTIPLIER = 100; // Default multiplier for market sales estimation

/**
 * Calculate quality score based on PDF formula (10.2)
 * quality_scores = 0.4 · (1 − return_rates) + 0.3 · on_time_deliverys + 0.3 · ratings
 * All values normalized to 0-1 range
 */
export function calculateQualityScore(metrics: SellerMetrics): {
  score: number;
  breakdown: CalculationResult['breakdown'];
} {
  // Normalize return rate: (1 - return_rate) where return_rate is 0-1
  const returnRateNormalized = metrics.returnRate / 100; // Convert percentage to 0-1
  const returnRateComponent = 0.4 * (1 - returnRateNormalized);
  
  // Normalize delivery rate: on_time_delivery is 0-1
  const deliveryRateNormalized = metrics.onTimeDeliveryRate / 100; // Convert percentage to 0-1
  const deliveryComponent = 0.3 * deliveryRateNormalized;
  
  // Normalize ratings: ratings is 0-1
  const ratingsNormalized = metrics.ratings / 100; // Convert percentage to 0-1
  const ratingsComponent = 0.3 * ratingsNormalized;
  
  // Total quality score (0-1 range)
  const score = returnRateComponent + deliveryComponent + ratingsComponent;
  
  return {
    score: Math.max(0, Math.min(1, Math.round(score * 1000) / 1000)), // Clamp to 0-1, 3 decimal places
    breakdown: {
      returnRateComponent: Math.round(returnRateComponent * 1000) / 1000,
      deliveryComponent: Math.round(deliveryComponent * 1000) / 1000,
      ratingsComponent: Math.round(ratingsComponent * 1000) / 1000,
    },
  };
}

/**
 * Calculate seller pool using PDF formula (10.2)
 * Tseller_pool(t) = Sbase · exp(−δ · (t − tlaunch))
 * Where t is in years, δ = 0.15
 */
export function calculateSellerPool(yearsSinceLaunch: number): number {
  // Exponential decay: Sbase · exp(-δ · years)
  return SBASE * Math.exp(-DELTA * yearsSinceLaunch);
}

/**
 * Calculate time decay factor (normalized, for display purposes)
 */
export function calculateTimeDecayFactor(yearsSinceLaunch: number): number {
  // Returns the decay factor as a ratio (0-1)
  return Math.exp(-DELTA * yearsSinceLaunch);
}

/**
 * Calculate sales share: total_sales_s / total_market_sales
 */
export function calculateSalesShare(
  sellerSales: number,
  totalMarketSales: number
): number {
  if (totalMarketSales === 0) return 0;
  return sellerSales / totalMarketSales;
}

/**
 * Generate improvement suggestions based on metrics
 */
export function generateSuggestions(metrics: SellerMetrics, qualityScore: number): string[] {
  const suggestions: string[] = [];
  
  if (qualityScore < MIN_QUALITY_SCORE) {
    suggestions.push(
      `⚠️ Ваш балл качества ${(qualityScore * 100).toFixed(1)}% ниже минимума ${(MIN_QUALITY_SCORE * 100)}%. Вы не получите токены. Улучшите показатели!`
    );
  }
  
  if (metrics.returnRate > 10) {
    const impact = (metrics.returnRate - 10) * 0.004; // 0.4 weight * 0.01 per %
    suggestions.push(
      `Снизьте процент возвратов с ${metrics.returnRate.toFixed(1)}% до 10% - это увеличит балл качества на ${(impact * 100).toFixed(2)}%`
    );
  }
  
  if (metrics.onTimeDeliveryRate < 95) {
    const impact = (95 - metrics.onTimeDeliveryRate) * 0.003; // 0.3 weight * 0.01 per %
    suggestions.push(
      `Улучшите доставку в срок с ${metrics.onTimeDeliveryRate.toFixed(1)}% до 95% - это добавит ${(impact * 100).toFixed(2)}% к баллу качества`
    );
  }
  
  if (metrics.ratings < 90) {
    const impact = (90 - metrics.ratings) * 0.003; // 0.3 weight * 0.01 per %
    suggestions.push(
      `Повысьте рейтинг с ${metrics.ratings.toFixed(1)}% до 90% - это добавит ${(impact * 100).toFixed(2)}% к баллу качества`
    );
  }
  
  if (suggestions.length === 0) {
    suggestions.push("Отличные показатели! Продолжайте поддерживать высокое качество.");
  }
  
  return suggestions;
}

/**
 * Main calculation function using PDF formula (10.2)
 * Tmint_seller(s, t) = Tseller_pool(t) · (Wsales · sales_shares + Wquality · quality_scores)
 */
export function calculateTokenRewards(metrics: SellerMetrics): CalculationResult {
  // Convert months to years for time decay calculation
  const yearsSinceLaunch = metrics.monthsOnPlatform / 12;
  
  // Calculate seller pool: Tseller_pool(t) = Sbase · exp(−δ · (t − tlaunch))
  const sellerPool = calculateSellerPool(yearsSinceLaunch);
  const timeDecayFactor = calculateTimeDecayFactor(yearsSinceLaunch);
  
  // Calculate quality score (0-1 range)
  const { score: qualityScore, breakdown } = calculateQualityScore(metrics);
  
  // Check minimum quality threshold
  if (qualityScore < MIN_QUALITY_SCORE) {
    // No tokens if quality is below threshold
    return {
      qualityScore,
      weeklyTokenReward: 0,
      monthlyTokenReward: 0,
      sellerPool: Math.round(sellerPool * 100) / 100,
      salesShare: 0,
      timeDecayFactor: Math.round(timeDecayFactor * 1000) / 1000,
      projection6Months: 0,
      projection12Months: 0,
      breakdown,
      suggestions: generateSuggestions(metrics, qualityScore),
    };
  }
  
  // Calculate sales share: total_sales_s / total_market_sales
  const totalMarketSales = metrics.totalMarketSales || 
    (metrics.monthlySalesVolume * DEFAULT_MARKET_SALES_MULTIPLIER);
  const salesShare = calculateSalesShare(metrics.monthlySalesVolume, totalMarketSales);
  
  // Calculate weekly token reward using formula:
  // Tmint_seller(s, t) = Tseller_pool(t) · (Wsales · sales_shares + Wquality · quality_scores)
  // Note: This is weekly distribution, so we divide the pool by weeks in a year
  const weeksInYear = 52;
  const weeklyPool = sellerPool / weeksInYear;
  
  const allocationFactor = WSALES * salesShare + WQUALITY * qualityScore;
  const weeklyTokenReward = weeklyPool * allocationFactor;
  
  // Calculate monthly reward (approximate)
  const monthlyTokenReward = weeklyTokenReward * WEEKS_PER_MONTH;
  
  // Calculate projections (accounting for pool decay over time)
  let projection6Months = 0;
  let projection12Months = 0;
  
  for (let month = 1; month <= 12; month++) {
    const futureYears = (metrics.monthsOnPlatform + month) / 12;
    const futurePool = calculateSellerPool(futureYears);
    const futureWeeklyPool = futurePool / weeksInYear;
    const futureWeeklyReward = futureWeeklyPool * allocationFactor;
    const futureMonthlyReward = futureWeeklyReward * WEEKS_PER_MONTH;
    
    if (month <= 6) {
      projection6Months += futureMonthlyReward;
    }
    projection12Months += futureMonthlyReward;
  }
  
  // Generate suggestions
  const suggestions = generateSuggestions(metrics, qualityScore);
  
  return {
    qualityScore: Math.round(qualityScore * 1000) / 1000,
    weeklyTokenReward: Math.round(weeklyTokenReward * 100) / 100,
    monthlyTokenReward: Math.round(monthlyTokenReward * 100) / 100,
    sellerPool: Math.round(sellerPool * 100) / 100,
    salesShare: Math.round(salesShare * 10000) / 10000, // 4 decimal places for small shares
    timeDecayFactor: Math.round(timeDecayFactor * 1000) / 1000,
    projection6Months: Math.round(projection6Months * 100) / 100,
    projection12Months: Math.round(projection12Months * 100) / 100,
    breakdown,
    suggestions,
  };
}

/**
 * Generate projection data for charts
 */
export function generateProjectionData(
  monthlyReward: number,
  months: number = 12
): Array<{ month: number; tokens: number; cumulative: number }> {
  const data = [];
  let cumulative = 0;
  
  for (let i = 1; i <= months; i++) {
    cumulative += monthlyReward;
    data.push({
      month: i,
      tokens: monthlyReward,
      cumulative: Math.round(cumulative * 100) / 100,
    });
  }
  
  return data;
}

