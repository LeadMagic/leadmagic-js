import type { RequestOptions, Result, TransportConfig } from "../core/http";
import { invalidInput, send } from "../core/http";
import { compact, segment } from "../core/shape";
import type { ApiResponse } from "../core/types";

export type CreditsResult = ApiResponse<"check-credits">;
export type DashboardResult = ApiResponse<"analytics-dashboard">;
export type UsageResult = ApiResponse<"analytics-usage">;
export type ProductsUsageResult = ApiResponse<"analytics-products">;
export type CreditHistoryResult = ApiResponse<"analytics-credits">;
export type SummaryResult = ApiResponse<"analytics-summary">;
export type DailyResult = ApiResponse<"analytics-daily">;
export type DayResult = ApiResponse<"analytics-day">;

export interface CreditsResource {
  /** Credit balance. Free. */
  get: (options?: RequestOptions) => Promise<Result<CreditsResult>>;
}

export interface DaysInput {
  /** Days to include, 1 to 90. Default 30. */
  days?: number;
}

export interface SummaryInput {
  /** `YYYY-MM-DD`. */
  endDate?: string;
  /** `YYYY-MM-DD`. */
  startDate?: string;
}

/** Usage and spend. Every call is free. */
export interface AnalyticsResource {
  /** Requests and credits per day. */
  credits: (
    input?: DaysInput,
    options?: RequestOptions
  ) => Promise<Result<CreditHistoryResult>>;
  /** Daily request, credit and success counts. */
  daily: (
    input?: DaysInput,
    options?: RequestOptions
  ) => Promise<Result<DailyResult>>;
  /** Balance, rate limits, concurrency and usage right now. */
  dashboard: (options?: RequestOptions) => Promise<Result<DashboardResult>>;
  /** One day, broken down by product. `date` is `YYYY-MM-DD`. */
  day: (date: string, options?: RequestOptions) => Promise<Result<DayResult>>;
  /** Requests, credits and success rate per product. */
  products: (
    input?: DaysInput,
    options?: RequestOptions
  ) => Promise<Result<ProductsUsageResult>>;
  /** Totals for all time, or between two dates. */
  summary: (
    input?: SummaryInput,
    options?: RequestOptions
  ) => Promise<Result<SummaryResult>>;
  /** Requests, credits and chargeable rate per day. */
  usage: (
    input?: DaysInput,
    options?: RequestOptions
  ) => Promise<Result<UsageResult>>;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/u;

export function createCredits(config: TransportConfig): CreditsResource {
  return {
    get: (options) =>
      send(config, { method: "GET", path: "/v1/credits" }, options),
  };
}

export function createAnalytics(config: TransportConfig): AnalyticsResource {
  const byDays =
    <T>(path: string) =>
    (input: DaysInput = {}, options?: RequestOptions): Promise<Result<T>> =>
      send<T>(
        config,
        { method: "GET", path, query: { days: input.days } },
        options
      );
  return {
    dashboard: (options) =>
      send(config, { method: "GET", path: "/v1/analytics/dashboard" }, options),
    usage: byDays<UsageResult>("/v1/analytics/usage"),
    products: byDays<ProductsUsageResult>("/v1/analytics/products"),
    credits: byDays<CreditHistoryResult>("/v1/analytics/credits"),
    daily: byDays<DailyResult>("/v1/analytics/daily"),
    summary: (input, options) =>
      send(
        config,
        {
          method: "GET",
          path: "/v1/analytics/summary",
          query: compact({
            start_date: input?.startDate,
            end_date: input?.endDate,
          }) as Record<string, string>,
        },
        options
      ),
    day: (date, options) =>
      DATE.test(date)
        ? send(
            config,
            { method: "GET", path: `/v1/analytics/day/${segment(date)}` },
            options
          )
        : Promise.resolve(
            invalidInput(config, "Pass the date as YYYY-MM-DD.", ["date"])
          ),
  };
}
