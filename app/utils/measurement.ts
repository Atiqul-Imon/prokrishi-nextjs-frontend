/**
 * Utility functions for handling fractional measurements
 * Supports half kg, 100g, half liter, etc.
 */

export interface MeasurementDisplay {
  value: number;
  unit: string;
  displayText: string;
  isFractional: boolean;
}

/**
 * Format measurement for display without unit conversion
 */
export function formatMeasurement(measurement: number, unit: string): MeasurementDisplay {
  const isFractional = measurement < 1;
  
  // Display measurement as-is without conversion
  if (measurement >= 1) {
    return {
      value: measurement,
      unit,
      displayText: `${measurement} ${unit}`,
      isFractional: false
    };
  } else {
    return {
      value: measurement,
      unit,
      displayText: `${measurement} ${unit}`,
      isFractional: true
    };
  }
}

/**
 * Get price per unit for fractional measurements
 */
export function getPricePerUnit(price: number, measurement: number, unit: string): number {
  return price / measurement;
}

/**
 * Format price per unit for display
 */
export function formatPricePerUnit(price: number, measurement: number, unit: string): string {
  const pricePerUnit = getPricePerUnit(price, measurement, unit);
  
  // Display price per unit without conversion
  return `৳${pricePerUnit.toFixed(2)}/${unit}`;
}

/**
 * Validate measurement input
 */
export function validateMeasurement(
  value: number, 
  unit: string, 
  minOrderQuantity: number = 0.01,
  measurementIncrement: number = 0.01
): { isValid: boolean; error?: string } {
  if (value < minOrderQuantity) {
    return {
      isValid: false,
      error: `Minimum order quantity is ${minOrderQuantity} ${unit}`
    };
  }
  
  if (value % measurementIncrement !== 0) {
    return {
      isValid: false,
      error: `Quantity must be in increments of ${measurementIncrement} ${unit}`
    };
  }
  
  return { isValid: true };
}

/**
 * Get measurement options for dropdown
 */
export function getMeasurementOptions(unit: string, measurementIncrement: number = 0.01): number[] {
  const options: number[] = [];
  
  if (unit === 'kg') {
    // Common kg measurements
    const kgOptions = [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5];
    return kgOptions.filter(option => option % measurementIncrement === 0);
  } else if (unit === 'g') {
    // Common gram measurements
    const gOptions = [100, 250, 500, 750, 1000, 1500, 2000];
    return gOptions.filter(option => option % measurementIncrement === 0);
  } else if (unit === 'l') {
    // Common liter measurements
    const lOptions = [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5];
    return lOptions.filter(option => option % measurementIncrement === 0);
  } else if (unit === 'ml') {
    // Common ml measurements
    const mlOptions = [100, 250, 500, 750, 1000, 1500, 2000];
    return mlOptions.filter(option => option % measurementIncrement === 0);
  } else {
    // For pieces, use whole numbers
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }
}

/**
 * Convert measurement to display text with proper formatting
 */
export function getMeasurementDisplayText(measurement: number, unit: string): string {
  const formatted = formatMeasurement(measurement, unit);
  return formatted.displayText;
}

/**
 * Get common fractional measurements for quick selection
 */
export function getCommonFractionalMeasurements(unit: string): { value: number; label: string }[] {
  if (unit === 'kg') {
    return [
      { value: 0.25, label: '250g (¼ kg)' },
      { value: 0.5, label: '500g (½ kg)' },
      { value: 0.75, label: '750g (¾ kg)' },
      { value: 1, label: '1 kg' }
    ];
  } else if (unit === 'l') {
    return [
      { value: 0.25, label: '250ml (¼ l)' },
      { value: 0.5, label: '500ml (½ l)' },
      { value: 0.75, label: '750ml (¾ l)' },
      { value: 1, label: '1 l' }
    ];
  } else if (unit === 'g') {
    return [
      { value: 100, label: '100g' },
      { value: 250, label: '250g' },
      { value: 500, label: '500g' },
      { value: 1000, label: '1 kg' }
    ];
  } else if (unit === 'ml') {
    return [
      { value: 100, label: '100ml' },
      { value: 250, label: '250ml' },
      { value: 500, label: '500ml' },
      { value: 1000, label: '1 l' }
    ];
  } else {
    return [
      { value: 1, label: '1 pcs' },
      { value: 2, label: '2 pcs' },
      { value: 3, label: '3 pcs' },
      { value: 5, label: '5 pcs' }
    ];
  }
}
