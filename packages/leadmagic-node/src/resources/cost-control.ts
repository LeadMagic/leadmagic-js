import type { RequestOptions, Result, TransportConfig } from "../core/http";
import { invalidInput, send } from "../core/http";
import { compact, invalidPage, nonEmpty, paged, segment } from "../core/shape";
import type { PageResult } from "../core/types";

/* -------------------------------------------------------------------------- */
/* Budgets                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * `monthly` resets each calendar month; `total` never resets. Batches over
 * budget are refused at submit with `budget_exceeded` (402).
 */
export type BudgetPeriod = "monthly" | "total";

export interface Budget {
  createdAt: string;
  id: string;
  maxCredits: number;
  period: BudgetPeriod | (string & Record<never, never>);
  scope: "client" | "user" | (string & Record<never, never>);
  scopeValue: string;
}

export interface BudgetStatus extends Budget {
  consumedCredits: number;
  isExceeded: boolean;
  remainingCredits: number;
}

export interface CreateBudgetInput {
  /** Most credits batches for this scope may use. */
  maxCredits: number;
  /** Default `total`. */
  period?: BudgetPeriod;
  /** `client` caps one of your batch clients; `user` caps one team member. */
  scope: "client" | "user";
  /** The clientId, or the user's id. */
  scopeValue: string;
}

export interface UpdateBudgetInput {
  maxCredits?: number;
  period?: BudgetPeriod;
}

/** Credit caps for batches, per client or per team member. */
export interface BudgetsResource {
  /** Adds a cap. One per scope and value. */
  create: (
    input: CreateBudgetInput,
    options?: RequestOptions
  ) => Promise<Result<Budget>>;
  /** Removes a cap. */
  delete: (
    id: string,
    options?: RequestOptions
  ) => Promise<Result<{ deleted: boolean }>>;
  list: (options?: RequestOptions) => Promise<Result<Budget[]>>;
  /** Every cap with what is left. */
  status: (options?: RequestOptions) => Promise<Result<BudgetStatus[]>>;
  update: (
    id: string,
    input: UpdateBudgetInput,
    options?: RequestOptions
  ) => Promise<Result<Budget>>;
}

const PERIODS = new Set<string>(["monthly", "total"]);

/** Why a budget cannot be sent, or null. Shared with the Zod schemas. */
export function checkBudget(
  input: Partial<CreateBudgetInput>,
  creating: boolean
): { message: string; param: string[] } | null {
  if (creating && !(input.scope === "client" || input.scope === "user")) {
    return { message: "scope must be client or user.", param: ["scope"] };
  }
  if (creating && !nonEmpty(input.scopeValue)) {
    return {
      message: "Pass the clientId or user id as scopeValue.",
      param: ["scopeValue"],
    };
  }
  const max = input.maxCredits;
  if (
    (creating || max !== undefined) &&
    !(typeof max === "number" && Number.isFinite(max) && max > 0)
  ) {
    return {
      message: "maxCredits must be a number above 0.",
      param: ["maxCredits"],
    };
  }
  if (input.period !== undefined && !PERIODS.has(input.period)) {
    return { message: "period must be monthly or total.", param: ["period"] };
  }
  return null;
}

export function createBudgets(config: TransportConfig): BudgetsResource {
  const route = (id: string) => `/v1/batch/budgets/${segment(id.trim())}`;
  const refuse = <T>(problem: { message: string; param: string[] }) =>
    Promise.resolve(invalidInput<T>(config, problem.message, problem.param));
  const needsId = <T>(id: string): Promise<Result<T>> | null =>
    nonEmpty(id)
      ? null
      : refuse<T>({ message: "Pass the budget id.", param: ["id"] });

  return {
    create: (input, options) => {
      const problem = checkBudget(input, true);
      return problem
        ? refuse(problem)
        : send(
            config,
            {
              method: "POST",
              path: "/v1/batch/budgets",
              body: compact({
                scope: input.scope,
                scope_value: input.scopeValue,
                max_credits: input.maxCredits,
                period: input.period,
              }),
            },
            options
          );
    },
    list: (options) =>
      send(config, { method: "GET", path: "/v1/batch/budgets" }, options),
    status: (options) =>
      send(
        config,
        { method: "GET", path: "/v1/batch/budgets/status" },
        options
      ),
    update: (id, input, options) => {
      const problem =
        input.maxCredits === undefined && input.period === undefined
          ? {
              message: "Pass maxCredits or period.",
              param: ["maxCredits", "period"],
            }
          : checkBudget(input, false);
      if (problem) {
        return refuse(problem);
      }
      return (
        needsId<Budget>(id) ??
        send(
          config,
          {
            method: "PATCH",
            path: route(id),
            body: compact({
              max_credits: input.maxCredits,
              period: input.period,
            }),
          },
          options
        )
      );
    },
    delete: (id, options) =>
      needsId<{ deleted: boolean }>(id) ??
      send(config, { method: "DELETE", path: route(id) }, options),
  };
}

/* -------------------------------------------------------------------------- */
/* Suppression lists                                                          */
/* -------------------------------------------------------------------------- */

export interface SuppressionList {
  createdAt?: string;
  /** Emails on the list. */
  emailCount: number;
  listId: string;
}

export interface SuppressionListPage {
  /** SHA-256 of each lowercased email: LeadMagic never stores the address. */
  emails: string[];
  limit: number;
  listId: string;
  offset: number;
  total: number;
}

/**
 * Emails batches must never touch. A batch item whose `input.email` is on any
 * of your lists is skipped as `suppressed` and costs nothing. Only batches
 * read these lists, not single API calls.
 */
export interface SuppressionListsResource {
  /** Adds emails to a list. */
  addEmails: (
    listId: string,
    emails: string[],
    options?: RequestOptions
  ) => Promise<Result<{ added: number }>>;
  /** Creates a list with its first emails, or adds to it if it exists. */
  create: (
    listId: string,
    emails: string[],
    options?: RequestOptions
  ) => Promise<Result<SuppressionList>>;
  /** Removes the list and every email on it. */
  delete: (
    listId: string,
    options?: RequestOptions
  ) => Promise<Result<{ deleted: boolean }>>;
  /** One page of the list's hashed emails. */
  get: (
    listId: string,
    input?: { limit?: number; offset?: number },
    options?: RequestOptions
  ) => Promise<PageResult<SuppressionListPage, string>>;
  list: (options?: RequestOptions) => Promise<Result<SuppressionList[]>>;
  removeEmails: (
    listId: string,
    emails: string[],
    options?: RequestOptions
  ) => Promise<Result<{ removed: number }>>;
}

const MAX_LIST_PAGE = 1000;
const DEFAULT_LIST_PAGE = 200;

/** Why an email list cannot be sent, or null. Shared with the Zod schemas. */
export function checkEmails(
  emails: unknown
): { message: string; param: string[] } | null {
  if (!Array.isArray(emails) || emails.length === 0) {
    return { message: "Pass at least one email.", param: ["emails"] };
  }
  const bad = emails.findIndex(
    (e) => typeof e !== "string" || !e.includes("@")
  );
  return bad === -1
    ? null
    : {
        message: `emails[${bad}] is not an email address.`,
        param: [`emails.${bad}`],
      };
}

export function createSuppressionLists(
  config: TransportConfig
): SuppressionListsResource {
  const route = (id: string) =>
    `/v1/batch/suppression-lists/${segment(id.trim())}`;
  const check = (listId: string, emails: unknown) =>
    nonEmpty(listId)
      ? checkEmails(emails)
      : { message: "Pass the listId.", param: ["listId"] };
  const refuse = <T>(problem: { message: string; param: string[] }) =>
    Promise.resolve(invalidInput<T>(config, problem.message, problem.param));
  const clean = (emails: string[]) => emails.map((e) => e.trim());

  return {
    create: (listId, emails, options) => {
      const problem = check(listId, emails);
      return problem
        ? refuse(problem)
        : send(
            config,
            {
              method: "POST",
              path: "/v1/batch/suppression-lists",
              body: { list_id: listId.trim(), emails: clean(emails) },
            },
            options
          );
    },
    list: (options) =>
      send(
        config,
        { method: "GET", path: "/v1/batch/suppression-lists" },
        options
      ),
    get: async (listId, given, options) => {
      if (!nonEmpty(listId)) {
        return invalidPage(config, "Pass the listId.", ["listId"]);
      }
      const limit = Math.min(
        MAX_LIST_PAGE,
        Math.max(1, Math.floor(given?.limit ?? DEFAULT_LIST_PAGE))
      );
      const offset = Math.max(0, given?.offset ?? 0);
      const result = await send<SuppressionListPage>(
        config,
        { method: "GET", path: route(listId), query: { limit, offset } },
        options
      );
      return paged(result, {
        items: (data) => data.emails,
        nextOffset: (data) =>
          offset + (data.emails?.length ?? 0) < data.total
            ? offset + data.emails.length
            : null,
      });
    },
    delete: (listId, options) =>
      nonEmpty(listId)
        ? send(config, { method: "DELETE", path: route(listId) }, options)
        : refuse({ message: "Pass the listId.", param: ["listId"] }),
    addEmails: (listId, emails, options) => {
      const problem = check(listId, emails);
      return problem
        ? refuse(problem)
        : send(
            config,
            {
              method: "POST",
              path: `${route(listId)}/emails`,
              body: { emails: clean(emails) },
            },
            options
          );
    },
    removeEmails: (listId, emails, options) => {
      const problem = check(listId, emails);
      return problem
        ? refuse(problem)
        : send(
            config,
            {
              method: "DELETE",
              path: `${route(listId)}/emails`,
              body: { emails: clean(emails) },
            },
            options
          );
    },
  };
}
