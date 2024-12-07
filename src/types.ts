export interface AccountEntry {
  account_category: string;
  account_type: string;
  value_type: string;
  total_value: number;
  account_name?: string;
  account_code?: string;
  account_currency?: string;
}

export interface AccountingMetricsResult {
  Revenue: string;
  Expenses: string;
  "Gross Profit Margin": string;
  "Net Profit Margin": string;
  "Working Capital Ratio": string;
}

export interface CalculatorOptions {
  currencySymbol?: string;
  decimalPlaces?: number;
}
