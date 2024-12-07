import { AccountingMetricsCalculator } from "../src/index";
import { AccountEntry, CalculatorOptions } from "../src/types";

describe("AccountingMetricsCalculator", () => {
  // Sample data for testing
  const sampleData: AccountEntry[] = [
    // Revenue entries
    {
      account_category: "revenue",
      account_type: "sales",
      value_type: "debit",
      total_value: 100000,
    },
    {
      account_category: "revenue",
      account_type: "services",
      value_type: "debit",
      total_value: 50000,
    },

    // Expense entries
    {
      account_category: "expense",
      account_type: "operational",
      value_type: "credit",
      total_value: 30000,
    },
    {
      account_category: "expense",
      account_type: "marketing",
      value_type: "credit",
      total_value: 10000,
    },

    // Asset entries
    {
      account_category: "assets",
      account_type: "current",
      value_type: "debit",
      total_value: 80000,
    },
    {
      account_category: "assets",
      account_type: "bank",
      value_type: "debit",
      total_value: 50000,
    },
    {
      account_category: "assets",
      account_type: "current_accounts_receivable",
      value_type: "credit",
      total_value: 20000,
    },

    // Liability entries
    {
      account_category: "liability",
      account_type: "current",
      value_type: "credit",
      total_value: 40000,
    },
    {
      account_category: "liability",
      account_type: "current_accounts_payable",
      value_type: "debit",
      total_value: 10000,
    },
  ];

  describe("Revenue Calculation", () => {
    const calculator = new AccountingMetricsCalculator(sampleData);

    it("should correctly calculate total revenue", () => {
      const revenue = calculator.calculateRevenue();
      expect(revenue).toBe(150000);
    });
  });

  describe("Expenses Calculation", () => {
    const calculator = new AccountingMetricsCalculator(sampleData);

    it("should correctly calculate total expenses", () => {
      const expenses = calculator.calculateExpenses();
      expect(expenses).toBe(40000);
    });
  });

  describe("Gross Profit Margin Calculation", () => {
    const calculator = new AccountingMetricsCalculator(sampleData);

    it("should correctly calculate gross profit margin", () => {
      const revenue = calculator.calculateRevenue();
      const grossProfitMargin = calculator.calculateGrossProfitMargin(revenue);

      // Sales debit: 100000, Revenue: 150000
      expect(grossProfitMargin).toBeCloseTo(0.6667, 4);
    });
  });

  describe("Net Profit Margin Calculation", () => {
    const calculator = new AccountingMetricsCalculator(sampleData);

    it("should correctly calculate net profit margin", () => {
      const revenue = calculator.calculateRevenue();
      const expenses = calculator.calculateExpenses();
      const netProfitMargin = calculator.calculateNetProfitMargin(
        revenue,
        expenses
      );

      // (Revenue - Expenses) / Revenue
      expect(netProfitMargin).toBeCloseTo(0.7333, 4);
    });
  });

  describe("Working Capital Ratio Calculation", () => {
    const calculator = new AccountingMetricsCalculator(sampleData);

    it("should correctly calculate working capital ratio", () => {
      const workingCapitalRatio = calculator.calculateWorkingCapitalRatio();

      // Assets (debit - credit): 110000
      // Liabilities (credit - debit): 30000
      // Ratio should be: 110000 / 30000
      expect(workingCapitalRatio).toBeCloseTo(3.6667, 4);
    });
  });

  describe("Metrics Formatting", () => {
    it("should format metrics with default options", () => {
      const calculator = new AccountingMetricsCalculator(sampleData);
      const metrics = calculator.calculateMetrics();

      expect(metrics.Revenue).toBe("$150,000");
      expect(metrics.Expenses).toBe("$40,000");
      expect(metrics["Gross Profit Margin"]).toBe("66.7%");
      expect(metrics["Net Profit Margin"]).toBe("73.3%");
      expect(metrics["Working Capital Ratio"]).toBe("366.7%");
    });

    it("should support custom currency symbol and decimal places", () => {
      const options: CalculatorOptions = {
        currencySymbol: "€",
        decimalPlaces: 2,
      };
      const calculator = new AccountingMetricsCalculator(sampleData, options);
      const metrics = calculator.calculateMetrics();

      expect(metrics.Revenue).toBe("€150,000");
      expect(metrics["Gross Profit Margin"]).toBe("66.67%");
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero revenue scenario", () => {
      const zeroRevenueData: AccountEntry[] = [
        {
          account_category: "expense",
          account_type: "operational",
          value_type: "credit",
          total_value: 10000,
        },
      ];
      const calculator = new AccountingMetricsCalculator(zeroRevenueData);
      const metrics = calculator.calculateMetrics();

      expect(metrics.Revenue).toBe("$0");
      expect(metrics["Gross Profit Margin"]).toBe("0.0%");
      expect(metrics["Net Profit Margin"]).toBe("0.0%");
    });

    it("should handle zero liabilities scenario", () => {
      const zeroLiabilitiesData: AccountEntry[] = [
        {
          account_category: "revenue",
          account_type: "sales",
          value_type: "debit",
          total_value: 100000,
        },
        {
          account_category: "assets",
          account_type: "current",
          value_type: "debit",
          total_value: 50000,
        },
      ];
      const calculator = new AccountingMetricsCalculator(zeroLiabilitiesData);
      const metrics = calculator.calculateMetrics();

      expect(metrics["Working Capital Ratio"]).toBe("0.0%");
    });
  });
});
