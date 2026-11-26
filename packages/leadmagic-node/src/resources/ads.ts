import type { RequestOptions, TransportConfig } from "../core/http";
import { send } from "../core/http";
import { compact, invalidLookup, isObj, lookup, nonEmpty } from "../core/shape";
import type { ApiResponse, LookupResult } from "../core/types";

export type GoogleAdsResult = ApiResponse<"google-ads-search">;
export type MetaAdsResult = ApiResponse<"meta-ads-search">;
export type B2BAdsResult = ApiResponse<"b2b-ads-search">;
export type B2BAdDetailsResult = ApiResponse<"b2b-ad-details">;

export interface AdsInput {
  companyName?: string;
  /** Preferred over `companyName`. */
  domain?: string;
  /** At most this many ads, which also caps the credits. Default 10. */
  limit?: number;
}

/** Ads a company runs. Ads platforms are slow: allow up to 30 s per call. */
export interface AdsResource {
  /** B2B network ads. 1 credit plus 1 per ad returned. */
  b2b: (
    input: AdsInput,
    options?: RequestOptions
  ) => Promise<LookupResult<B2BAdsResult>>;
  /** One B2B ad, by library URL, path or numeric id. 2 credits. */
  b2bDetails: (
    input: { adUrl: string },
    options?: RequestOptions
  ) => Promise<LookupResult<B2BAdDetailsResult>>;
  /** Google ads. 1 credit per ad returned. */
  google: (
    input: AdsInput,
    options?: RequestOptions
  ) => Promise<LookupResult<GoogleAdsResult>>;
  /** Meta (Facebook and Instagram) ads. 1 credit per ad returned. */
  meta: (
    input: AdsInput,
    options?: RequestOptions
  ) => Promise<LookupResult<MetaAdsResult>>;
}

export function createAds(config: TransportConfig): AdsResource {
  const search =
    <T extends { ads?: unknown }>(path: string) =>
    async (
      input: AdsInput,
      options?: RequestOptions
    ): Promise<LookupResult<T>> => {
      const body = compact({
        company_domain: input.domain,
        company_name: input.companyName,
        limit: input.limit,
      });
      if (!(body.company_domain || body.company_name)) {
        return invalidLookup(config, "Pass a domain or companyName.", [
          "domain",
          "companyName",
        ]);
      }
      const result = await send<T>(
        config,
        { method: "POST", path, body },
        options
      );
      return lookup(result, (data) => nonEmpty(data.ads));
    };

  return {
    google: search<GoogleAdsResult>("/v1/ads/google-ads-search"),
    meta: search<MetaAdsResult>("/v1/ads/meta-ads-search"),
    b2b: search<B2BAdsResult>("/v1/ads/b2b-ads-search"),
    async b2bDetails(input, options) {
      if (!nonEmpty(input?.adUrl)) {
        return invalidLookup(config, "Pass an adUrl.", ["adUrl"]);
      }
      const result = await send<B2BAdDetailsResult>(
        config,
        {
          method: "POST",
          path: "/v1/ads/b2b-ads-details",
          body: compact({ ad_url: input.adUrl }),
        },
        options
      );
      return lookup(result, (data) => isObj(data.ad_details));
    },
  };
}
