export interface SellerMetrics {
  monthlySalesVolume: number; // Number of orders per month
  returnRate: number; // Percentage (0-100)
  onTimeDeliveryRate: number; // Percentage (0-100)
  cancellationRate: number; // Percentage (0-100)
  inventoryAccuracy: number; // Percentage (0-100)
  monthsOnPlatform: number; // Months since joining
}

export interface CalculationResult {
  qualityScore: number; // 0-100
  monthlyTokenReward: number;
  penalties: number;
  baseEmission: number;
  qualityMultiplier: number;
  timeDecayFactor: number;
  projection6Months: number;
  projection12Months: number;
  breakdown: {
    returnRateScore: number;
    deliveryScore: number;
    cancellationScore: number;
    inventoryScore: number;
  };
  suggestions: string[];
}

// Constants
const BASE_EMISSION_PER_ORDER = 0.1; // Base tokens per order
const TIME_DECAY_RATE = 0.02; // 2% decay per month
const MIN_QUALITY_SCORE = 50; // Minimum quality score to receive tokens
const PENALTY_THRESHOLD_RETURNS = 15; // Return rate threshold for penalties
const PENALTY_THRESHOLD_CANCELLATIONS = 10; // Cancellation rate threshold

/**
 * Calculate quality score based on seller metrics
 * Weighted average with emphasis on returns and delivery
 */
export function calculateQualityScore(metrics: SellerMetrics): {
  score: number;
  breakdown: CalculationResult['breakdown'];
} {
  // Return rate: lower is better (inverted)
  const returnRateScore = Math.max(0, 100 - metrics.returnRate * 2);
  
  // Delivery performance: higher is better
  const deliveryScore = metrics.onTimeDeliveryRate;
  
  // Cancellation rate: lower is better (inverted)
  const cancellationScore = Math.max(0, 100 - metrics.cancellationRate * 3);
  
  // Inventory accuracy: higher is better
  const inventoryScore = metrics.inventoryAccuracy;
  
  // Weighted average (returns and delivery are most important)
  const weights = {
    returnRate: 0.35,
    delivery: 0.30,
    cancellation: 0.20,
    inventory: 0.15,
  };
  
  const score =
    returnRateScore * weights.returnRate +
    deliveryScore * weights.delivery +
    cancellationScore * weights.cancellation +
    inventoryScore * weights.inventory;
  
  return {
    score: Math.round(score * 100) / 100,
    breakdown: {
      returnRateScore: Math.round(returnRateScore * 100) / 100,
      deliveryScore: Math.round(deliveryScore * 100) / 100,
      cancellationScore: Math.round(cancellationScore * 100) / 100,
      inventoryScore: Math.round(inventoryScore * 100) / 100,
    },
  };
}

/**
 * Calculate time decay factor for token emission
 * Emission decreases over time to create scarcity
 */
export function calculateTimeDecayFactor(monthsOnPlatform: number): number {
  // Exponential decay: emission decreases by TIME_DECAY_RATE per month
  return Math.max(0.1, Math.exp(-TIME_DECAY_RATE * monthsOnPlatform));
}

/**
 * Calculate quality multiplier
 * Higher quality scores get more tokens
 */
export function calculateQualityMultiplier(qualityScore: number): number {
  if (qualityScore < MIN_QUALITY_SCORE) {
    return 0; // No tokens if quality is too low
  }
  
  // Linear scaling from 0.5x to 2.0x based on quality score
  const minMultiplier = 0.5;
  const maxMultiplier = 2.0;
  const normalizedScore = (qualityScore - MIN_QUALITY_SCORE) / (100 - MIN_QUALITY_SCORE);
  
  return minMultiplier + normalizedScore * (maxMultiplier - minMultiplier);
}

/**
 * Calculate penalties for poor performance
 */
export function calculatePenalties(metrics: SellerMetrics): number {
  let penalties = 0;
  
  // Penalty for high return rate
  if (metrics.returnRate > PENALTY_THRESHOLD_RETURNS) {
    const excessReturns = metrics.returnRate - PENALTY_THRESHOLD_RETURNS;
    penalties += excessReturns * 5; // 5 tokens per percentage point above threshold
  }
  
  // Penalty for high cancellation rate
  if (metrics.cancellationRate > PENALTY_THRESHOLD_CANCELLATIONS) {
    const excessCancellations = metrics.cancellationRate - PENALTY_THRESHOLD_CANCELLATIONS;
    penalties += excessCancellations * 3; // 3 tokens per percentage point above threshold
  }
  
  return penalties;
}

/**
 * Calculate base emission based on sales volume
 */
export function calculateBaseEmission(
  monthlySalesVolume: number,
  timeDecayFactor: number
): number {
  const baseEmission = monthlySalesVolume * BASE_EMISSION_PER_ORDER;
  return baseEmission * timeDecayFactor;
}

/**
 * Generate improvement suggestions based on metrics
 */
export function generateSuggestions(metrics: SellerMetrics): string[] {
  const suggestions: string[] = [];
  
  if (metrics.returnRate > 10) {
    suggestions.push(
      `Снизьте процент возвратов с ${metrics.returnRate.toFixed(1)}% до 10% - это увеличит токены на ${Math.round((metrics.returnRate - 10) * 2 * 0.35)}%`
    );
  }
  
  if (metrics.onTimeDeliveryRate < 95) {
    suggestions.push(
      `Улучшите доставку в срок с ${metrics.onTimeDeliveryRate.toFixed(1)}% до 95% - это добавит ${Math.round((95 - metrics.onTimeDeliveryRate) * 0.30)}% к качеству`
    );
  }
  
  if (metrics.cancellationRate > 5) {
    suggestions.push(
      `Снизьте отмены с ${metrics.cancellationRate.toFixed(1)}% до 5% - это уменьшит штрафы на ${Math.round((metrics.cancellationRate - 5) * 3)} токенов`
    );
  }
  
  if (metrics.inventoryAccuracy < 98) {
    suggestions.push(
      `Повысьте точность остатков с ${metrics.inventoryAccuracy.toFixed(1)}% до 98% - это улучшит общий балл качества`
    );
  }
  
  if (suggestions.length === 0) {
    suggestions.push("Отличные показатели! Продолжайте поддерживать высокое качество.");
  }
  
  return suggestions;
}

/**
 * Main calculation function
 */
export function calculateTokenRewards(metrics: SellerMetrics): CalculationResult {
  // Calculate quality score
  const { score: qualityScore, breakdown } = calculateQualityScore(metrics);
  
  // Calculate time decay
  const timeDecayFactor = calculateTimeDecayFactor(metrics.monthsOnPlatform);
  
  // Calculate base emission
  const baseEmission = calculateBaseEmission(metrics.monthlySalesVolume, timeDecayFactor);
  
  // Calculate quality multiplier
  const qualityMultiplier = calculateQualityMultiplier(qualityScore);
  
  // Calculate penalties
  const penalties = calculatePenalties(metrics);
  
  // Calculate monthly token reward
  const monthlyTokenReward = Math.max(
    0,
    baseEmission * qualityMultiplier - penalties
  );
  
  // Calculate projections
  const projection6Months = monthlyTokenReward * 6;
  const projection12Months = monthlyTokenReward * 12;
  
  // Generate suggestions
  const suggestions = generateSuggestions(metrics);
  
  return {
    qualityScore,
    monthlyTokenReward: Math.round(monthlyTokenReward * 100) / 100,
    penalties: Math.round(penalties * 100) / 100,
    baseEmission: Math.round(baseEmission * 100) / 100,
    qualityMultiplier: Math.round(qualityMultiplier * 100) / 100,
    timeDecayFactor: Math.round(timeDecayFactor * 100) / 100,
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

