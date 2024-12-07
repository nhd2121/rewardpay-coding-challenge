import * as fs from "fs";
import * as path from "path";
import {
  AccountEntry,
  AccountingMetricsResult,
  CalculatorOptions,
} from "./types";

export class AccountingMetricsCalculator {
  private data: AccountEntry[];
  private options: Required<CalculatorOptions>;

  constructor(data: AccountEntry[], options: CalculatorOptions = {}) {
    this.data = data;
    this.options = {
      currencySymbol: "$",
      decimalPlaces: 1,
      ...options,
    };
  }

  // Format currency without cents
  private formatCurrency(value: number): string {
    return `${this.options.currencySymbol}${Math.round(
      value
    ).toLocaleString()}`;
  }

  // Format percentage to specified decimal places
  private formatPercentage(value: number): string {
    return `${(value * 100).toFixed(this.options.decimalPlaces)}%`;
  }

  // Calculate Revenue
  calculateRevenue(): number {
    return this.data
      .filter((entry) => entry.account_category === "revenue")
      .reduce((sum, entry) => sum + entry.total_value, 0);
  }

  // Calculate Expenses
  calculateExpenses(): number {
    return this.data
      .filter((entry) => entry.account_category === "expense")
      .reduce((sum, entry) => sum + entry.total_value, 0);
  }

  // Calculate Gross Profit Margin
  calculateGrossProfitMargin(revenue: number): number {
    if (revenue === 0) {
      return 0; // Avoid division by zero
    }

    const salesDebit = this.data
      .filter(
        (entry) =>
          entry.account_type === "sales" && entry.value_type === "debit"
      )
      .reduce((sum, entry) => sum + entry.total_value, 0);

    return salesDebit / revenue;
  }

  // Calculate Net Profit Margin
  calculateNetProfitMargin(revenue: number, expenses: number): number {
    if (revenue === 0) {
      return 0; // Return 0% when there is no revenue
    }
    return (revenue - expenses) / revenue;
  }

  // Calculate Working Capital Ratio
  calculateWorkingCapitalRatio(): number {
    // Calculate Assets
    const assets =
      this.data
        .filter(
          (entry) =>
            entry.account_category === "assets" &&
            entry.value_type === "debit" &&
            ["current", "bank", "current_accounts_receivable"].includes(
              entry.account_type
            )
        )
        .reduce((sum, entry) => sum + entry.total_value, 0) -
      this.data
        .filter(
          (entry) =>
            entry.account_category === "assets" &&
            entry.value_type === "credit" &&
            ["current", "bank", "current_accounts_receivable"].includes(
              entry.account_type
            )
        )
        .reduce((sum, entry) => sum + entry.total_value, 0);

    // Calculate Liabilities
    const liabilities =
      this.data
        .filter(
          (entry) =>
            entry.account_category === "liability" &&
            entry.value_type === "credit" &&
            ["current", "current_accounts_payable"].includes(entry.account_type)
        )
        .reduce((sum, entry) => sum + entry.total_value, 0) -
      this.data
        .filter(
          (entry) =>
            entry.account_category === "liability" &&
            entry.value_type === "debit" &&
            ["current", "current_accounts_payable"].includes(entry.account_type)
        )
        .reduce((sum, entry) => sum + entry.total_value, 0);

    return liabilities > 0 ? assets / liabilities : 0;
  }

  // Main method to calculate all metrics
  calculateMetrics(): AccountingMetricsResult {
    const revenue = this.calculateRevenue();
    const expenses = this.calculateExpenses();
    const grossProfitMargin = this.calculateGrossProfitMargin(revenue);
    const netProfitMargin = this.calculateNetProfitMargin(revenue, expenses);
    const workingCapitalRatio = this.calculateWorkingCapitalRatio();

    return {
      Revenue: this.formatCurrency(revenue),
      Expenses: this.formatCurrency(expenses),
      "Gross Profit Margin": this.formatPercentage(grossProfitMargin),
      "Net Profit Margin": this.formatPercentage(netProfitMargin),
      "Working Capital Ratio": this.formatPercentage(workingCapitalRatio),
    };
  }
}

function main() {
  try {
    // Read the data.json
    const rawData = fs.readFileSync(path.resolve("data.json"), "utf8");
    const parsedData = JSON.parse(rawData);

    // Extract the data array
    const accountEntries = parsedData.data;

    // Create calculator instance
    const calculator = new AccountingMetricsCalculator(accountEntries);

    // Calculate and display metrics
    const metrics = calculator.calculateMetrics();

    console.log("Accounting Metrics:");
    Object.entries(metrics).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

main();
