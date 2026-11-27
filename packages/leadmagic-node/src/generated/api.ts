// Generated from spec/openapi.json (LeadMagic API 1.4.35) by scripts/generate.mjs.
// Do not edit. Run `pnpm -F leadmagic-node generate` after updating the spec.

export interface paths {
    "/v1/credits": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Check Credits
         * @description Check your current credit balance.
         */
        get: operations["check-credits"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/analytics/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Dashboard Overview
         * @description Get a real-time snapshot of your account including credits, rate limits, and usage statistics.
         */
        get: operations["analytics-dashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/analytics/usage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Usage Summary
         * @description Get daily usage summary with requests, credits consumed, and chargeable rates.
         */
        get: operations["analytics-usage"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/analytics/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Products Breakdown
         * @description Get per-product usage with requests, credits, and success rates.
         */
        get: operations["analytics-products"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/analytics/credits": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Credit History
         * @description Get credit consumption history with daily breakdown.
         */
        get: operations["analytics-credits"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/analytics/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * All-Time Summary
         * @description Get lifetime statistics for your account.
         */
        get: operations["analytics-summary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/analytics/daily": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Daily Metrics
         * @description Get detailed daily metrics with performance data.
         */
        get: operations["analytics-daily"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/analytics/day/{date}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Day Breakdown
         * @description Get per-product breakdown for a specific day.
         */
        get: operations["analytics-day"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/people/email-validation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Email Validation
         * @description Validate an email address for deliverability and get company enrichment data.
         */
        post: operations["email-validation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/people/email-finder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Email Finder
         * @description Find a person's work email address using their name and company information.
         */
        post: operations["email-finder"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/people/personal-email-finder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Personal Email Finder
         * @description Provide a B2B Profile URL and get back the personal emails of the person.
         */
        post: operations["personal-email-finder"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/people/b2b-profile-email": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * B2B Person Profile to Email
         * @description Provide a B2B person profile and get back the work email of the person.
         */
        post: operations["b2b-profile-email"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/people/profile-search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * B2B Person Profile
         * @description Retrieve comprehensive B2B person profile information including work history, education, certifications, and more.
         */
        post: operations["profile-search"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/people/b2b-profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Email Address to B2B Person Profile
         * @description Use this endpoint to find a B2B person profile based on the provided email.
         */
        post: operations["email-to-b2b-profile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/people/mobile-finder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mobile Finder
         * @description Find a person's mobile phone number using their profile URL or email address.
         */
        post: operations["mobile-finder"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/people/job-change-detector": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Job Change Detector
         * @description Monitor employee transitions and detect when someone has changed jobs. Costs 3 credits per check. The submitted company_name is authoritative; a company_domain lookup only adds matcher aliases. job_change_detected is true only when status is JOB_CHANGE_DETECTED. When the profile URL does not resolve, the response is status PROFILE_NOT_FOUND with resolution_reason PROFILE_NOT_FOUND and credits_consumed 0: nothing is charged.
         */
        post: operations["job-change-detector"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/companies/company-search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Company Search
         * @description Search for companies and retrieve comprehensive company intelligence including funding, employees, industry, and more.
         */
        post: operations["company-search"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/companies/company-funding": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Company Funding
         * @description Provide the Company Domain or Company Name and get back the complete funding details of the company.
         */
        post: operations["company-funding"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/companies/competitors-search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Competitors Search
         * @description Find competitors of a company by analyzing market position and industry data.
         */
        post: operations["competitors-search"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/companies/technographics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Company Technographics
         * @description Get detailed technology stack information for any company by providing their domain.
         */
        post: operations["technographics"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/people/role-finder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Role Finder
         * @description Provide a job title and a company name, company domain, or company profile URL to find a matching person.
         */
        post: operations["role-finder"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/people/employee-finder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Employee Finder
         * @description Find employees at a company. Returns a list of employees with their profiles, titles, and locations. Costs 0.05 credits per employee returned: free when no employees are found.
         */
        post: operations["employee-finder"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/people/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * People Search
         * @description Find professional profiles by company, title, role, seniority, and recorded profile attributes. Choose a person before requesting Email Finder or Mobile Finder separately. Search does not expose contact values or availability indicators.
         */
        post: operations["people-search"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/companies/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Company Search
         * @description Canonical V3 company identity lookup and discovery using the documented supported criteria. Check ignored_filters and warnings for selected criteria that were not applied.
         */
        post: operations["company-search-v3"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/companies/lookalike": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Company Lookalike
         * @description Find similar companies from a seed domain or description using company context and recorded
         *     attributes. Similarity scores describe ranking closeness, not a buying-fit probability.
         *     Costs **5 credits** when one or more lookalikes are returned; **free** when empty.
         *     Common aliases (`domain`, `website`, `company_website`, `name`) and misspellings
         *     (`companny_domain`, `limmit`, …) are accepted and remapped. `preview: true` is
         *     chatbot-UI only: API keys receive 400.
         */
        post: operations["company-lookalike-v3"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/jobs/jobs-finder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Jobs Finder
         * @description LeadMagic's Jobs Finder
         */
        post: operations["jobs-finder"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/local-leads/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Search Local Leads
         * @description Search 59 million local business listings by location, category, name or map radius.
         *     Each lead is the full listing: address, coordinates, phones, emails, website and socials.
         *
         *     Pages hold **25 leads** and the size is fixed: `limit`, `offset` and `page` return 400.
         *     Page with `next_cursor`. A search holds up to 1,000 leads for 30 minutes.
         *
         *     **Zero credits** on Professional (5 requests/second) and Ultimate (10 requests/second),
         *     within the fair-use ceilings of 10 million records/month and 13,333 searches/day shared
         *     across People, Company, Jobs and Local Leads Search. Other plans pay **1 credit per page**
         *     at 5 requests/second. A page that is read again within 30 minutes is not charged again.
         *
         *     Every search needs a `country`, a point (`lat` and `lon`), a `website_domain`,
         *     `email_domain` or `email`, or a `name` of five or more characters.
         */
        post: operations["local-leads-search-v3"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/local-leads/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Local Lead Categories
         * @description The category names Local Leads Search uses, most common first, with the number of
         *     listings in each. **Free** on every plan.
         */
        get: operations["local-leads-categories-v3"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/jobs/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Job Search
         * @description Search jobs with title, occupation taxonomy, company, location, tag, salary, seniority, and date filters. The endpoint resolves friendly values into normalized filter IDs before searching. Company objects do not include logo fields.
         */
        post: operations["job-search"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/search/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Search Stats
         * @description Free helper endpoint that returns cached professional-profile and company counts, technology coverage, capabilities, and top dimensions for Jobs, Company, and People Search. Email and phone availability rollups are not exposed.
         */
        post: operations["search-stats-v3"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/jobs-search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Job Search Alias
         * @description Alias for POST /v3/jobs/search.
         */
        post: operations["job-search-alias"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/jobs/search/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Resolve Job Search filters
         * @description Resolve friendly companies, countries, tags, occupation taxonomy values, and titles into canonical filter IDs. This endpoint does not return job rows and is free.
         */
        post: operations["job-search-resolve"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/jobs/search/companies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Job Search Companies Helper
         * @description Company autocomplete and cards for Job Search.
         */
        get: operations["job-search-companies"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/jobs/search/tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Job Search Tags Helper
         * @description Tag autocomplete with occupation taxonomy metadata.
         */
        get: operations["job-search-tags"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/jobs/search/titles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Job Search Titles Helper
         * @description Title autocomplete with occupation taxonomy metadata.
         */
        get: operations["job-search-titles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/jobs/search/occupation-taxonomy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Job Search Occupation Taxonomy Helper
         * @description Occupation taxonomy autocomplete with level1, level2, and level3 IDs and labels.
         */
        get: operations["job-search-occupation-taxonomy"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/jobs/search/locations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Job Search Locations Helper
         * @description Country, region, state, and city autocomplete for exact geo filters.
         */
        get: operations["job-search-locations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/jobs/search/catalogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Job Search Catalogs
         * @description Filter catalogs for countries, regions, job types, industries, company types, seniority, and public-safe Jobs Search stats.
         */
        get: operations["job-search-catalogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/jobs/search/roles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Job Search Roles Helper
         * @description Role autocomplete for occupation-based filtering, mapped to occupation taxonomy IDs.
         */
        get: operations["job-search-roles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/jobs/search/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Job Search Dataset Stats
         * @description Public-safe dataset statistics for the Jobs Search index: totals and freshness. Free.
         */
        get: operations["job-search-stats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/jobs/search/job-board/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Job Board Stats
         * @description Alias of Job Search Dataset Stats for job-board integrations. Free.
         */
        get: operations["job-board-stats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v3/jobs/search/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Job Search Export
         * @description Bulk export of job postings using the full Job Search filter vocabulary. Returns up to 5,000 jobs per request with descriptions included by default. Credit-metered on all plans.
         */
        post: operations["job-search-export"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/jobs/countries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Job Country
         * @description Use this API to retrieve the country ID, which can then be used in the Jobs Finder API to filter jobs by country.
         */
        get: operations["job-country"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/jobs/regions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Job Region
         * @description Use this API to retrieve the region ID, which can then be used in the Jobs Finder API to filter jobs by region.
         */
        get: operations["job-regions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/jobs/job-types": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Job Type
         * @description Use this API to retrieve the Job Type ID, which can then be used in the Jobs Finder API to filter jobs by Job Type.
         */
        get: operations["job-types"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/jobs/company-types": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Job Company Type
         * @description Use this API to retrieve the Company Type ID, which can then be used in the Jobs Finder API to filter jobs by Company Type.
         */
        get: operations["job-company-types"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/jobs/industries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Job Industry
         * @description Use this API to retrieve the Industry ID, which can then be used in the Jobs Finder API to filter jobs by Industry.
         */
        get: operations["job-industry"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/ads/google-ads-search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Google Ads Search
         * @description Search for Google Ads run by a company to understand their advertising strategy.
         */
        post: operations["google-ads-search"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/ads/meta-ads-search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Meta Ads Search
         * @description Search for Meta Ads by company domain or name.
         */
        post: operations["meta-ads-search"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/ads/b2b-ads-search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * B2B Search Ads
         * @description Search for B2B ads by company domain or name. Charged 1 base credit plus 1 credit per ad returned (minimum 1 credit).
         */
        post: operations["b2b-ads-search"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/ads/b2b-ads-details": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * B2B Ad Details
         * @description Get detailed information about a specific B2B ad using its ad library URL, path, or numeric ID.
         */
        post: operations["b2b-ad-details"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/submit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit Bulk Job
         * @description Submit data for bulk enrichment. Provide exactly one of rows (JSON array), csv (string), fileUrl (HTTPS URL), or scrape (browser rendering config). The job is processed asynchronously; use the returned jobId to poll status via GET /bulk/jobs/{jobId}. **Security**: fileUrl and callback.url are SSRF-validated server-side. Private/internal IP ranges, localhost, cloud metadata endpoints (169.254.169.254), and non-HTTPS protocols are rejected.
         */
        post: operations["bulk-submit"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/jobs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Bulk Jobs
         * @description Retrieve a paginated list of bulk jobs owned by the authenticated account, newest first.
         */
        get: operations["bulk-job-list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/jobs/{jobId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Bulk Job Status
         * @description Retrieve the current status and progress of a specific bulk job. Accepts progress-token auth from the submit response.
         */
        get: operations["bulk-job-status"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/jobs/{jobId}/review": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Review Bulk Job (Cancel or Approve)
         * @description Cancel a queued or processing bulk job by submitting {"action": "reject"}, or resume a paused job with {"action": "approve"}. Completed or failed jobs cannot be reviewed.
         */
        post: operations["bulk-job-review"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/jobs/{jobId}/results": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Bulk Job Results
         * @description Retrieve paginated row-level results for a bulk job as JSON.
         */
        get: operations["bulk-job-results"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/jobs/{jobId}/download": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Download Bulk Job Results as CSV
         * @description Stream the full results as a CSV file. No pagination: all rows are included.
         */
        get: operations["bulk-job-download"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/capabilities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Bulk API Capabilities
         * @description Return the machine-readable bulk enrichment capability and tool manifest.
         */
        get: operations["bulk-capabilities"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/validate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Validate a Bulk Submission
         * @description Validate a bulk submission payload without persisting or processing a job.
         */
        post: operations["bulk-validate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/local-leads": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit a Local Leads Search
         * @description Find local businesses for keyword × location combinations. Each unique combination is one search, charged 200 credits up front. US ZIP codes are resolved to their city before anything is charged. Set `dryRun` to preview the resolved grid and cost without charging.
         */
        post: operations["bulk-local-leads"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/progress": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Lightweight Bulk Job Progress
         * @description Return a compact progress snapshot for frequent polling. This route authenticates with the signed `token`, `exp`, and `subject` query parameters from the submit response, not with `X-API-Key`. Call the `progressUrl` returned by `POST /bulk/submit` as-is. Until the first shard reports, the route returns 404; use `GET /bulk/jobs/{jobId}` with your API key for status in the meantime.
         */
        get: operations["bulk-job-progress"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/jobs/{jobId}/errors": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Failed Bulk Job Rows
         * @description Return failed rows and their error details for a bulk job.
         */
        get: operations["bulk-job-errors"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/jobs/{jobId}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Bulk Job Events
         * @description Return the append-only event log for a bulk job.
         */
        get: operations["bulk-job-events"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/jobs/{jobId}/stream": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Stream Bulk Job Progress
         * @description Open a server-sent events stream for real-time bulk job progress.
         */
        get: operations["bulk-job-stream"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/jobs/{jobId}/pause": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Pause a Bulk Job
         * @description Pause a queued or running bulk job.
         */
        post: operations["bulk-job-pause"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/jobs/{jobId}/resume": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Resume a Bulk Job
         * @description Resume a paused bulk job.
         */
        post: operations["bulk-job-resume"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/jobs/{jobId}/restart": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Restart a Bulk Job
         * @description Restart a bulk job in full, from failed rows, or from a specified position.
         */
        post: operations["bulk-job-restart"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bulk/jobs/{jobId}/priority": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Bulk Job Priority
         * @description Change the processing priority of a queued or running bulk job.
         */
        patch: operations["bulk-job-priority"];
        trace?: never;
    };
    "/v1/batch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Batches
         * @description List batches across all products for the authenticated organization.
         */
        get: operations["batch-list"];
        put?: never;
        /**
         * Submit a Mixed-Product Batch
         * @description Submit a batch containing items for one or more enrichment products.
         */
        post: operations["batch-submit"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/batch/{batchId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Batch Status
         * @description Return status, progress, cost, and metadata for a mixed-product batch.
         */
        get: operations["batch-status"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/{product}/batch/{batchId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Batch Metadata
         * @description Update batch metadata or its associated client within the mutable window.
         */
        patch: operations["batch-update"];
        trace?: never;
    };
    "/v1/batch/campaign/{campaignId}/metrics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Campaign Metrics
         * @description Aggregate usage and success metrics across batches in a campaign.
         */
        get: operations["batch-campaign-metrics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/batch/clients": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Batch Clients
         * @description List client records for the authenticated organization.
         */
        get: operations["batch-client-list"];
        put?: never;
        /**
         * Create a Batch Client
         * @description Create an organization-scoped client for segmenting downstream batch work.
         */
        post: operations["batch-client-create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/batch/clients/{clientId}/metrics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Batch Client Metrics
         * @description Return aggregate batch usage and success metrics for a client.
         */
        get: operations["batch-client-metrics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/batch/clients/{clientId}/webhooks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Batch Client Webhooks
         * @description List delivery webhooks configured for a client.
         */
        get: operations["batch-client-webhook-list"];
        put?: never;
        /**
         * Create a Batch Client Webhook
         * @description Register a webhook for client batch lifecycle events.
         */
        post: operations["batch-client-webhook-create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/batch/providers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List External Batch Providers
         * @description List external enrichment providers registered by the organization.
         */
        get: operations["batch-provider-list"];
        put?: never;
        /**
         * Create an External Batch Provider
         * @description Register an HTTPS external enrichment provider.
         */
        post: operations["batch-provider-create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/batch/preview-cost": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Preview Batch Cost
         * @description Estimate the credit cost and budget impact of a batch enrichment without reserving or consuming credits. FREE dry-run.
         */
        post: operations["preview-cost-mixed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/batch/budgets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Credit Budgets
         * @description List all credit budgets for the authenticated account.
         */
        get: operations["list-budgets"];
        put?: never;
        /**
         * Create Credit Budget
         * @description Create a new credit budget to cap spend per scope.
         */
        post: operations["create-budget"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/batch/budgets/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Budget Status
         * @description Consumption status for all budgets.
         */
        get: operations["budget-status"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/batch/budgets/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete Credit Budget
         * @description Hard-delete a credit budget.
         */
        delete: operations["delete-budget"];
        options?: never;
        head?: never;
        /**
         * Update Credit Budget
         * @description Update max_credits, period, alert_threshold_pct, and/or alert_email.
         */
        patch: operations["update-budget"];
        trace?: never;
    };
    "/v1/batch/suppression-lists": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Suppression Lists
         * @description List all suppression lists for the authenticated account.
         */
        get: operations["list-suppression-lists"];
        put?: never;
        /**
         * Create Suppression List
         * @description Create a new suppression list with initial emails. Emails are SHA-256 hashed server-side.
         */
        post: operations["create-suppression-list"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/batch/suppression-lists/{listId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Suppression List
         * @description Get list details and paginated email hashes.
         */
        get: operations["get-suppression-list"];
        put?: never;
        post?: never;
        /**
         * Delete Suppression List
         * @description Delete an entire suppression list.
         */
        delete: operations["delete-suppression-list"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/batch/suppression-lists/{listId}/emails": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add Emails to Suppression List
         * @description Add emails to an existing suppression list. Emails are SHA-256 hashed server-side.
         */
        post: operations["add-suppression-emails"];
        /**
         * Remove Emails from Suppression List
         * @description Remove emails from a suppression list.
         */
        delete: operations["remove-suppression-emails"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description RFC 9457 Problem Details error response */
        ErrorResponse: {
            /**
             * @description Always false for error responses
             * @example false
             */
            success: boolean;
            /** @description Array of error details (typically one, but can be multiple) */
            errors: components["schemas"]["ErrorDetail"][];
            meta?: components["schemas"]["ResponseMeta"];
        };
        /** @description RFC 9457 compliant error detail */
        ErrorDetail: {
            /**
             * Format: uri
             * @description RFC 9457 - URI reference identifying the error type
             * @example https://api.leadmagic.io/errors/validation_error
             */
            type: string;
            /**
             * @description RFC 9457 - Short human-readable summary
             * @example Request validation failed. Check your input parameters.
             */
            title: string;
            /**
             * @description RFC 9457 - HTTP status code
             * @example 400
             */
            status: number;
            /**
             * @description RFC 9457 - Human-readable explanation specific to this occurrence
             * @example The email field is required but was not provided.
             */
            detail?: string;
            /**
             * Format: uri-reference
             * @description RFC 9457 - URI reference for this specific occurrence
             * @example /v1/people/email-validation#req_abc123
             */
            instance?: string;
            /**
             * @description Machine-readable error code for programmatic handling
             * @example validation_error
             */
            code?: string;
            /**
             * @description Parameters that caused the error
             * @example [
             *       "email"
             *     ]
             */
            param?: string[];
            /**
             * @description Suggested action to resolve the error
             * @example Provide a valid email address in the 'email' field.
             */
            action?: string;
            /**
             * Format: uri
             * @description Link to relevant documentation
             * @example https://leadmagic.io/docs/v1/making-api-calls#error-handling
             */
            docs?: string;
            /** @description Additional context specific to this error type. 404 route_not_found errors include suggested_endpoint (canonical path to use instead) in this object; validation errors include the offending field and received value. */
            context?: {
                [key: string]: unknown;
            };
        };
        /** @description Metadata included in all responses */
        ResponseMeta: {
            /**
             * Format: uuid
             * @description Unique identifier for this request (use for debugging/support)
             * @example ea6e3248-f4d2-437d-bca3-20881b529129
             */
            request_id?: string;
            /**
             * Format: date-time
             * @description ISO 8601 timestamp when the response was generated
             * @example 2024-02-01T12:00:00.000Z
             */
            timestamp?: string;
            /**
             * @description API environment (production, staging)
             * @example production
             */
            environment?: string;
        };
        /**
         * @example {
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/validation_error",
         *           "title": "Request validation failed. Check your input parameters.",
         *           "status": 400,
         *           "code": "validation_error",
         *           "param": [
         *             "email"
         *           ],
         *           "detail": "Email format is invalid. Expected format: user@domain.com",
         *           "action": "Provide a valid email address in the 'email' field.",
         *           "docs": "https://leadmagic.io/docs/v1/making-api-calls#error-handling"
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        ValidationError: components["schemas"]["ErrorResponse"];
        /**
         * @example {
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/missing_required_field",
         *           "title": "Missing required field: email. Add this field to your request.",
         *           "status": 400,
         *           "code": "missing_required_field",
         *           "param": [
         *             "email"
         *           ],
         *           "docs": "https://leadmagic.io/docs/v1/making-api-calls#error-handling"
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        MissingFieldError: components["schemas"]["ErrorResponse"];
        /**
         * @example {
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/invalid_json",
         *           "title": "Invalid JSON in request body. Check your JSON syntax.",
         *           "status": 400,
         *           "code": "invalid_json",
         *           "docs": "https://leadmagic.io/docs/v1/making-api-calls#error-handling"
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        InvalidJsonError: components["schemas"]["ErrorResponse"];
        /**
         * @example {
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/invalid_parameter",
         *           "title": "Invalid parameter: experience_level. Valid options: entry, mid, senior, executive.",
         *           "status": 400,
         *           "code": "invalid_parameter",
         *           "param": [
         *             "experience_level"
         *           ],
         *           "docs": "https://leadmagic.io/docs/v1/making-api-calls#error-handling"
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        InvalidParameterError: components["schemas"]["ErrorResponse"];
        /**
         * @example {
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/missing_authentication",
         *           "title": "Authentication required. Provide a valid API key in the X-API-Key header (case-insensitive).",
         *           "status": 401,
         *           "code": "missing_authentication",
         *           "docs": "https://leadmagic.io/docs/v1/authentication"
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        MissingAuthenticationError: components["schemas"]["ErrorResponse"];
        /**
         * @example {
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/invalid_api_key",
         *           "title": "Invalid API key. The key does not exist or is incorrect.",
         *           "status": 401,
         *           "code": "invalid_api_key",
         *           "docs": "https://leadmagic.io/docs/v1/authentication"
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        InvalidApiKeyError: components["schemas"]["ErrorResponse"];
        /**
         * @example {
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/insufficient_permissions",
         *           "title": "Access denied to this resource. Upgrade your plan or contact support.",
         *           "status": 403,
         *           "code": "insufficient_permissions",
         *           "docs": "https://leadmagic.io/docs/v1/authentication"
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        InsufficientPermissionsError: components["schemas"]["ErrorResponse"];
        /**
         * @example {
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/insufficient_credits",
         *           "title": "Insufficient credits: need 5, have 2.50. Add credits to continue.",
         *           "status": 402,
         *           "code": "insufficient_credits",
         *           "detail": "This request requires 5 credit(s) but your account only has 2.50 credits remaining.",
         *           "action": "Add credits to your account at https://app.leadmagic.io/settings/billing or contact support@leadmagic.io for enterprise plans.",
         *           "docs": "https://leadmagic.io/docs/v1/credits",
         *           "context": {
         *             "credits_required": 5,
         *             "credits_available": 2.5,
         *             "credits_needed": 2.5
         *           }
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        InsufficientCreditsError: components["schemas"]["ErrorResponse"];
        /**
         * @description The API key is valid, but the account it belongs to no longer has an active subscription.
         *     Retrying, rotating the key, or adding credits does not help. Resubscribe at
         *     https://app.leadmagic.io/settings/billing and retry with the same key. Repeated retries
         *     return `429` with `Retry-After`.
         * @example {
         *       "type": "https://api.leadmagic.io/errors/org_closed",
         *       "title": "Subscription Ended",
         *       "status": 402,
         *       "detail": "This API key belongs to an account whose subscription has ended. Resubscribe at https://app.leadmagic.io/settings/billing.",
         *       "code": "org_closed",
         *       "action": "Resubscribe at https://app.leadmagic.io/settings/billing, then retry with the same key. Contact support@leadmagic.io if you believe this is a mistake.",
         *       "docs": "https://leadmagic.io/docs/v1/credits",
         *       "instance": "/v1/people/email-finder",
         *       "trace": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       },
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/org_closed",
         *           "title": "Subscription Ended",
         *           "status": 402,
         *           "detail": "This API key belongs to an account whose subscription has ended. Resubscribe at https://app.leadmagic.io/settings/billing.",
         *           "code": "org_closed",
         *           "action": "Resubscribe at https://app.leadmagic.io/settings/billing, then retry with the same key. Contact support@leadmagic.io if you believe this is a mistake.",
         *           "docs": "https://leadmagic.io/docs/v1/credits"
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        OrgClosedError: components["schemas"]["ErrorResponse"];
        /**
         * @example {
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/resource_not_found",
         *           "title": "Resource not found.",
         *           "status": 404,
         *           "code": "resource_not_found",
         *           "docs": "https://leadmagic.io/docs/v1/making-api-calls#error-handling"
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        ResourceNotFoundError: components["schemas"]["ErrorResponse"];
        /**
         * @example {
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/profile_not_found",
         *           "title": "Profile not found or not accessible",
         *           "status": 404,
         *           "code": "profile_not_found",
         *           "docs": "https://leadmagic.io/docs/v1/making-api-calls#error-handling"
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        ProfileNotFoundError: components["schemas"]["ErrorResponse"];
        /**
         * @example {
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/rate_limit_exceeded",
         *           "title": "Email product allowance exceeded. Wait for Retry-After before retrying.",
         *           "status": 429,
         *           "code": "rate_limit_exceeded",
         *           "detail": "You have exceeded the maximum allowed request rate. Please wait before making additional requests.",
         *           "action": "Wait 42 seconds before retrying. Consider implementing exponential backoff.",
         *           "docs": "https://leadmagic.io/docs/v1/making-api-calls#rate-limits",
         *           "context": {
         *             "limit": 600,
         *             "window": "1 minute",
         *             "remaining": 0,
         *             "reset_at": 1706745642,
         *             "retry_after_seconds": 42
         *           }
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        RateLimitExceededError: components["schemas"]["ErrorResponse"];
        /**
         * @example {
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/INTERNAL_ERROR",
         *           "title": "Something went wrong on our end. Our team has been notified and is investigating.",
         *           "status": 500,
         *           "code": "INTERNAL_ERROR",
         *           "detail": "This is a temporary server error. The issue has been automatically reported to our team.",
         *           "action": "Wait 30 seconds and retry your request. If the problem persists, contact support@leadmagic.io",
         *           "docs": "https://leadmagic.io/docs/v1/making-api-calls#error-handling"
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        InternalServerError: components["schemas"]["ErrorResponse"];
        /**
         * @example {
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/external_service_error",
         *           "title": "Error communicating with external service. Please try again.",
         *           "status": 502,
         *           "code": "external_service_error",
         *           "docs": "https://leadmagic.io/docs/v1/making-api-calls#error-handling"
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        ExternalServiceError: components["schemas"]["ErrorResponse"];
        /**
         * @example {
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/service_unavailable",
         *           "title": "Service temporarily unavailable. Please try again later.",
         *           "status": 503,
         *           "code": "service_unavailable",
         *           "docs": "https://leadmagic.io/docs/v1/making-api-calls#error-handling"
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        ServiceUnavailableError: components["schemas"]["ErrorResponse"];
        /**
         * @example {
         *       "success": false,
         *       "errors": [
         *         {
         *           "type": "https://api.leadmagic.io/errors/conflict",
         *           "title": "Resource conflict detected.",
         *           "status": 409,
         *           "code": "conflict",
         *           "docs": "https://leadmagic.io/docs/v1/making-api-calls#error-handling"
         *         }
         *       ],
         *       "meta": {
         *         "request_id": "ea6e3248-f4d2-437d-bca3-20881b529129",
         *         "timestamp": "2024-02-01T12:00:00.000Z"
         *       }
         *     }
         */
        ConflictError: components["schemas"]["ErrorResponse"];
        /**
         * @description Possible success messages for email validation
         * @enum {string}
         */
        EmailValidationMessages: "Email is valid." | "Email is invalid." | "Unable to determine email validity.";
        /**
         * @description Possible success messages for email finder
         * @enum {string}
         */
        EmailFinderMessages: "Valid email found." | "No email found for this person at this company.";
        /**
         * @description Possible success messages for mobile finder
         * @enum {string}
         */
        MobileFinderMessages: "Mobile number found." | "No mobile number found for this contact.";
        /**
         * @description Possible success messages for profile search
         * @enum {string}
         */
        ProfileSearchMessages: "Profile found." | "Profile not found or not accessible.";
        /**
         * @description Possible success messages for company search
         * @enum {string}
         */
        CompanySearchMessages: "Company found." | "Company not found";
        /**
         * @description Possible success messages for role finder
         * @enum {string}
         */
        RoleFinderMessages: "Role found." | "No matching role found at this company.";
        /**
         * @description Possible success messages for employee finder
         * @enum {string}
         */
        EmployeeFinderMessages: "Employees found." | "No employees found for this company.";
        /**
         * @description Possible success messages for job change detector
         * @enum {string}
         */
        JobChangeDetectorMessages: "No job change detected. Still employed at expected company." | "Job change detected. Person has moved to a new company." | "Never worked at the expected company.";
        /**
         * @description Possible success messages for competitors search
         * @enum {string}
         */
        CompetitorsSearchMessages: "Competitors found." | "No competitors found for this company.";
        /**
         * @description Possible success messages for company funding
         * @enum {string}
         */
        CompanyFundingMessages: "Funding data found." | "Company funding data not found";
        /**
         * @description Possible success messages for technographics
         * @enum {string}
         */
        TechnographicsMessages: "Technologies found." | "No technology data found for this domain.";
        /**
         * @description Possible success messages for ads search endpoints
         * @enum {string}
         */
        AdsSearchMessages: "Ads found." | "No ads found for this company.";
        /**
         * @description Possible success messages for personal email finder
         * @enum {string}
         */
        PersonalEmailFinderMessages: "Personal email found." | "No personal email found for this contact.";
        /**
         * @description Possible success messages for B2B profile to email
         * @enum {string}
         */
        B2BProfileToEmailMessages: "Email found for this profile." | "No email found for this profile.";
        /**
         * @description Possible success messages for email to B2B profile
         * @enum {string}
         */
        EmailToB2BProfileMessages: "Profile URL found." | "No profile found for this email.";
        /** @description Rate limit headers returned with every response */
        RateLimitHeaders: {
            /**
             * @description IETF Standard - Maximum requests per minute
             * @example 600
             */
            "RateLimit-Limit"?: number;
            /**
             * @description IETF Standard - Requests remaining this minute
             * @example 587
             */
            "RateLimit-Remaining"?: number;
            /**
             * @description IETF Standard - Seconds until limit resets
             * @example 42
             */
            "RateLimit-Reset"?: number;
            /**
             * @description Legacy - Maximum requests per minute
             * @example 600
             */
            "X-RateLimit-Limit"?: number;
            /**
             * @description Legacy - Requests remaining this minute
             * @example 587
             */
            "X-RateLimit-Remaining"?: number;
            /**
             * @description Legacy - Unix timestamp when limit resets
             * @example 1706745600
             */
            "X-RateLimit-Reset"?: number;
            /**
             * @description Daily request limit
             * @example 500000
             */
            "X-RateLimit-Limit-Daily"?: number;
            /**
             * @description Requests remaining today
             * @example 485000
             */
            "X-RateLimit-Remaining-Daily"?: number;
            /**
             * @description Unix timestamp when daily limit resets
             * @example 1706832000
             */
            "X-RateLimit-Reset-Daily"?: number;
            /**
             * @description Wallet credits remaining after this request
             * @example 15432.5
             */
            "X-Credits-Remaining"?: number;
            /**
             * @description Credits reserved for this route before finalization (may exceed credits actually charged)
             * @example 1
             */
            "X-Credits-Cost"?: number;
            /**
             * @description Credits actually charged after finalization (matches body credits_consumed)
             * @example 1
             */
            "X-Credits-Consumed"?: number;
            /**
             * @description Wallet credit balance at authorization
             * @example 15433.5
             */
            "X-Credits-Total"?: number;
            /**
             * @description Maximum credits that could be charged for this request
             * @example 1
             */
            "X-Credits-Max-Cost"?: number;
            /** @description Correlation id for support troubleshooting */
            "X-Request-Id"?: string;
            /**
             * @description Diagnostic flag; enforced Finder, Validation and platform limits still reject excess work.
             * @example false
             */
            "X-RateLimit-Soft-Mode"?: string;
            /**
             * @description Daily usage as percentage
             * @example 15
             */
            "X-RateLimit-Daily-Usage-Percent"?: number;
            /**
             * @description Current minute usage as percentage
             * @example 5
             */
            "X-RateLimit-RPM-Usage-Percent"?: number;
            /**
             * @description Seconds to wait before retrying (only on 429 responses)
             * @example 42
             */
            "Retry-After"?: number;
        };
        /** @description Request body for submitting a bulk enrichment job via POST /bulk/submit. Provide exactly one of rows, csv, fileUrl, or scrape. */
        BulkSubmissionRequest: {
            /**
             * @description The enrichment product to run on each row (e.g. email_finder, email_validation, mobile_finder, profile_search, company_search).
             * @example email_finder
             */
            product: string;
            /** @description JSON array of row objects for /bulk/json (or /bulk/submit auto-detect). Each row is an object whose keys match the input fields the selected product expects. */
            rows?: {
                [key: string]: unknown;
            }[];
            /** @description Inline CSV string for /bulk/csv (or /bulk/submit). */
            csv?: string;
            /**
             * Format: uri
             * @description Public HTTPS URL to a remote file (CSV, JSON, JSONL). SSRF-validated server-side.
             */
            fileUrl?: string;
            /**
             * @description File format for fileUrl submissions.
             * @enum {string}
             */
            format?: "csv" | "json" | "jsonl";
            /** @description Browser-rendering config for /bulk/scrape (or /bulk/submit). */
            scrape?: {
                /** Format: uri */
                url?: string;
                /** @enum {string} */
                mode?: "scrape" | "crawl" | "content" | "markdown" | "links" | "json" | "snapshot";
                extractPrompt?: string;
                render?: boolean;
                maxPages?: number;
                maxDepth?: number;
            };
            /** @description Optional column mapping from CSV/JSON columns to product input fields. */
            inputMapping?: {
                [key: string]: {
                    source?: string;
                    column?: string;
                    value?: unknown;
                };
            };
            /** @description Webhook configuration. */
            callback?: {
                /**
                 * Format: uri
                 * @description HTTPS URL to receive a POST on completion/failure. SSRF-validated.
                 */
                url?: string;
                /**
                 * @default [
                 *       "completed"
                 *     ]
                 */
                events: ("completed" | "failed" | "canceled" | "any" | "job.completed" | "job.failed" | "job.canceled")[];
                inlineResults?: boolean;
                secret?: string;
                metadata?: {
                    [key: string]: unknown;
                };
            };
            /** @description Optional idempotency key for safe retries. */
            idempotencyKey?: string;
            metadata?: {
                [key: string]: unknown;
            };
            presetId?: string;
            outputTransform?: {
                /**
                 * @description Use the current model for new transforms. Existing requests with the legacy Llama ID use the current model.
                 * @example @cf/deepseek-ai/deepseek-v4.1-flash-1017
                 * @enum {string}
                 */
                model: "@cf/deepseek-ai/deepseek-v4.1-flash-1017" | "@cf/meta/llama-3.1-8b-instruct";
                prompt: string;
                jsonSchema: unknown;
            };
            priority?: number;
            fileName?: string;
        };
        /** @description Response for a successful bulk job submission. HTTP 202 Accepted. */
        BulkSubmissionResponse: {
            /**
             * Format: uuid
             * @description UUID identifier for the bulk job.
             * @example a1b2c3d4-e5f6-7890-abcd-ef1234567890
             */
            jobId: string;
            /** @description The enrichment product this job is running. */
            product: string;
            endpoint?: string | null;
            /** @description Total number of rows in the submission. */
            totalRows: number;
            /**
             * @description Always 'uploaded' for a freshly submitted job.
             * @example uploaded
             */
            status: string;
            queue: {
                position?: number;
                started?: boolean;
                /** Format: date-time */
                queuedAt?: string;
            };
            /** Format: uri */
            statusUrl?: string;
            /** Format: uri */
            streamUrl?: string;
            wsUrl?: string;
            /** Format: uri */
            resultsUrl?: string;
            /** Format: uri */
            rowsUrl?: string;
            /** Format: uri */
            errorsUrl?: string;
            /** Format: uri */
            eventsUrl?: string;
            /** Format: uri */
            eventsExportUrl?: string;
            /** Format: uri */
            logsUrl?: string;
            /** Format: uri */
            downloadUrl?: string;
            /** Format: uri */
            progressUrl?: string;
            /** @description Progress token for follow-up reads without the API key. */
            token?: string;
            /** @description Unix timestamp when the progress token expires. */
            exp?: number;
        };
        JobSummary: {
            /** Format: uuid */
            job_id: string;
            status: string;
            products?: string[] | null;
            submission_product?: string | null;
            submission_endpoint?: string | null;
            total_rows: number;
            processed_items: number;
            succeeded_items: number;
            failed_items: number;
            total_credits_consumed?: string | null;
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            started_at?: string | null;
            /** Format: date-time */
            completed_at?: string | null;
            /** Format: date-time */
            last_progress_at?: string | null;
            file_name?: string | null;
        };
        JobsListResponse: {
            jobs: components["schemas"]["JobSummary"][];
            limit: number;
            offset: number;
        };
        JobSnapshot: {
            /** Format: uuid */
            job_id: string;
            status: string;
            products?: string[] | null;
            submission_product?: string | null;
            submission_endpoint?: string | null;
            execution_mode?: string | null;
            total_rows: number;
            processed_items: number;
            succeeded_items: number;
            failed_items: number;
            skipped_items: number;
            total_credits_consumed?: string | null;
            total_duration_ms?: number | null;
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            started_at?: string | null;
            /** Format: date-time */
            completed_at?: string | null;
            /** Format: date-time */
            last_progress_at?: string | null;
            file_name?: string | null;
            callback_url?: string | null;
            callback_event?: string | null;
            priority?: number | null;
            /** @description Optional output transform applied to result rows. */
            output_transform?: Record<string, never> | null;
        };
        JobDetailResponse: components["schemas"]["JobSnapshot"] & {
            links?: {
                statusUrl?: string;
                streamUrl?: string;
                wsUrl?: string;
                resultsUrl?: string;
                rowsUrl?: string;
                errorsUrl?: string;
                eventsUrl?: string;
                eventsExportUrl?: string;
                logsUrl?: string;
                downloadUrl?: string;
                progressUrl?: string;
                token?: string;
                exp?: number;
            };
        };
        ReviewResponse: {
            /** Format: uuid */
            jobId: string;
            /** @enum {string} */
            status: "running" | "canceled";
        };
        JobRow: {
            /** Format: uuid */
            id: string;
            row_index: number;
            status: string;
            lm_input?: Record<string, never> | null;
            lm_output?: Record<string, never> | null;
            credits_consumed?: string | null;
            error_message?: string | null;
            http_status_code?: number | null;
            response_time_ms?: number | null;
            completed_at?: string | null;
        };
        JobRowsResponse: {
            rows: components["schemas"]["JobRow"][];
            limit: number;
            offset: number;
        };
        PreviewCostRequest: {
            items: {
                /** @description Required for mixed-product mode. Omitted for per-product mode. */
                product?: string;
                input?: {
                    [key: string]: unknown;
                };
                client_id?: string;
                client_name?: string;
                metadata?: {
                    [key: string]: unknown;
                };
            }[];
            /** @description User ID to check against configured Credit Budgets. */
            budget_user_id?: string;
            client_id?: string;
            client_name?: string;
            metadata?: {
                [key: string]: unknown;
            };
        };
        PreviewCostResponse: {
            totalItems: number;
            creditsPerItem?: number | null;
            totalCredits: number;
            estimatedCostUsd: number;
            perProduct: {
                product?: string;
                items?: number;
                creditsPerItem?: number;
                credits?: number;
            }[];
            clientCreditRemaining?: string | null;
            willExceedBudget: boolean;
        };
        Budget: {
            id?: string;
            scope?: string;
            scope_value?: string;
            max_credits?: number;
            period?: string;
            alert_threshold_pct?: number;
            alert_email?: string;
        };
        BudgetStatus: {
            scope?: string;
            scopeValue?: string;
            maxCredits?: number;
            remainingCredits?: number;
            isExceeded?: boolean;
        };
        SuppressionList: {
            list_id?: string;
            count?: number;
            /** Format: date-time */
            created_at?: string;
        };
    };
    responses: {
        /**
         * @description Bad Request - The request was malformed or contains invalid parameters.
         *
         *     **Common causes:**
         *     - Missing required fields
         *     - Invalid field format (e.g., malformed email)
         *     - Invalid JSON syntax
         *     - Invalid parameter values
         */
        BadRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["ValidationError"];
            };
        };
        /**
         * @description Unauthorized - Authentication failed.
         *
         *     **Common causes:**
         *     - Missing X-API-Key header
         *     - Invalid or expired API key
         *     - Malformed API key
         */
        Unauthorized: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["MissingAuthenticationError"] | components["schemas"]["InvalidApiKeyError"];
            };
        };
        /**
         * @description Forbidden - You don't have permission to access this resource.
         *
         *     **Common causes:**
         *     - API key doesn't have access to this endpoint
         *     - Plan limitations
         */
        Forbidden: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["InsufficientPermissionsError"];
            };
        };
        /**
         * @description Payment Required - The request can't be paid for. Check `code`:
         *     - `insufficient_credits`: add credits at https://app.leadmagic.io/settings/billing
         *     - `credits_frozen`: credits are temporarily unavailable; contact support@leadmagic.io
         *     - `org_closed`: the key is valid but the subscription has ended. Resubscribe at
         *       https://app.leadmagic.io/settings/billing, then retry with the same key. Retrying without
         *       resubscribing won't help, and repeated retries return `429` with `Retry-After`.
         */
        PaymentRequired: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["InsufficientCreditsError"] | components["schemas"]["OrgClosedError"];
            };
        };
        /**
         * @description Not Found - The requested resource could not be found.
         *
         *     **Common causes:**
         *     - Profile doesn't exist or is not accessible
         *     - Company not found in our database
         *     - Invalid URL or identifier
         */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["ResourceNotFoundError"] | components["schemas"]["ProfileNotFoundError"];
            };
        };
        /** @description Conflict - The request conflicts with the current state of the resource. */
        Conflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["ConflictError"];
            };
        };
        /**
         * @description Too Many Requests - Rate limit exceeded.
         *
         *     **Action required:** Check the `Retry-After` header for when to retry.
         *
         *     Also returned when the same rejected API key (`401 invalid_api_key` or `402 org_closed`)
         *     is retried 10 or more times within 10 minutes. The key is paused for 15 minutes, then
         *     1 hour, then 24 hours if retries continue. Fix the key or resubscribe instead of retrying.
         *
         *     **Headers returned:**
         *     - `Retry-After`: Seconds until you can retry
         *     - `RateLimit-Limit`: Your limit per minute
         *     - `RateLimit-Remaining`: Remaining requests this minute
         *     - `RateLimit-Reset`: Seconds until limit resets
         */
        RateLimitExceeded: {
            headers: {
                /** @description Seconds to wait before retrying */
                "Retry-After"?: number;
                /** @description Maximum requests per minute */
                "RateLimit-Limit"?: number;
                /** @description Remaining requests this minute */
                "RateLimit-Remaining"?: number;
                /** @description Seconds until limit resets */
                "RateLimit-Reset"?: number;
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["RateLimitExceededError"];
            };
        };
        /**
         * @description Internal Server Error - Something went wrong on our end.
         *
         *     **Action required:** Wait 30 seconds and retry. If the problem persists, contact support@leadmagic.io
         */
        InternalServerError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["InternalServerError"];
            };
        };
        /**
         * @description Bad Gateway - Error communicating with an upstream service.
         *
         *     **Action required:** Retry after a brief delay.
         */
        BadGateway: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["ExternalServiceError"];
            };
        };
        /**
         * @description Service Unavailable - The service is temporarily unavailable.
         *
         *     **Action required:** Retry after a brief delay.
         */
        ServiceUnavailable: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["ServiceUnavailableError"];
            };
        };
    };
    parameters: {
        /**
         * @description UUID identifier of the bulk job.
         * @example a1b2c3d4-e5f6-7890-abcd-ef1234567890
         */
        BulkJobId: string;
    };
    requestBodies: never;
    headers: {
        /** @description Effective organization request ceiling for the current minute. */
        RateLimitLimit: number;
        /** @description Requests remaining in the effective organization minute window. */
        RateLimitRemaining: number;
        /** @description Unix epoch second when the current minute window resets. */
        RateLimitReset: number;
        /** @description Effective organization sustained Search RPS ceiling. */
        SearchRpsLimit: number;
        /** @description Tokens remaining in the current sustained Search RPS window. */
        SearchRpsRemaining: number;
        /** @description Unix epoch second when the sustained Search RPS window refills. */
        SearchRpsReset: number;
    };
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    "check-credits": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful credits retrieval */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 2200 */
                        credits?: number;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "analytics-dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Dashboard data retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        user?: {
                            /** @example user_abc123 */
                            id?: string;
                            /** @example developer@leadmagic.io */
                            email?: string;
                        };
                        credits?: {
                            /** @example 15432.5 */
                            current?: number;
                            /** @example $154.33 */
                            formatted?: string;
                        };
                        rate_limit?: {
                            minute?: {
                                /** @example 600 */
                                limit?: number;
                                /** @example 45 */
                                used?: number;
                                /** @example 555 */
                                remaining?: number;
                                /** @example 15 */
                                utilization?: number;
                            };
                            daily?: {
                                /** @example 500000 */
                                limit?: number;
                                /** @example 12500 */
                                used?: number;
                                /** @example 487500 */
                                remaining?: number;
                                /** @example 2.5 */
                                utilization?: number;
                            };
                        };
                        concurrency?: {
                            /** @example 0 */
                            current?: number;
                            /** @example 23 */
                            peak?: number;
                            /** @example 0 */
                            active_reservations?: number;
                        };
                        stats?: {
                            today?: {
                                /** @example 1250 */
                                requests?: number;
                                /** @example 875.5 */
                                credits?: number;
                                /** @example 1100 */
                                chargeable_requests?: number;
                                /** @example 88 */
                                chargeable_rate?: number;
                                /** @example 5 */
                                unique_products?: number;
                            };
                            this_week?: {
                                /** @example 8500 */
                                requests?: number;
                                /** @example 5200.25 */
                                credits?: number;
                                /** @example 7200 */
                                chargeable_requests?: number;
                                /** @example 84.7 */
                                chargeable_rate?: number;
                                /** @example 8 */
                                unique_products?: number;
                            };
                            this_month?: {
                                /** @example 45000 */
                                requests?: number;
                                /** @example 28500 */
                                credits?: number;
                                /** @example 38000 */
                                chargeable_requests?: number;
                                /** @example 84.4 */
                                chargeable_rate?: number;
                                /** @example 12 */
                                unique_products?: number;
                            };
                        };
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "analytics-usage": {
        parameters: {
            query?: {
                /** @description Number of days to include (1-90) */
                days?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Usage summary retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        period?: {
                            /**
                             * Format: date
                             * @example 2024-01-02
                             */
                            start?: string;
                            /**
                             * Format: date
                             * @example 2024-02-01
                             */
                            end?: string;
                            /** @example 30 */
                            days?: number;
                        };
                        summary?: {
                            /** @example 45000 */
                            total_requests?: number;
                            /** @example 38000 */
                            chargeable_requests?: number;
                            /** @example 28500 */
                            total_credits?: number;
                            /** @example 0.63 */
                            avg_credits_per_request?: number;
                            /** @example 84.4 */
                            chargeable_rate?: number;
                            /** @example 12 */
                            unique_products?: number;
                        };
                        daily?: {
                            /**
                             * Format: date
                             * @example 2024-02-01
                             */
                            date?: string;
                            /** @example 1250 */
                            total_requests?: number;
                            /** @example 1100 */
                            chargeable_requests?: number;
                            /** @example 875.5 */
                            total_credits?: number;
                            /** @example 5 */
                            unique_products_used?: number;
                        }[];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    "analytics-products": {
        parameters: {
            query?: {
                /** @description Number of days to include (1-90) */
                days?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Products breakdown retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        period?: {
                            /** Format: date */
                            start?: string;
                            /** Format: date */
                            end?: string;
                            days?: number;
                        };
                        products?: {
                            [key: string]: {
                                /** @example 20000 */
                                total_requests?: number;
                                /** @example 1000 */
                                total_credits?: number;
                                /** @example 19500 */
                                successful_requests?: number;
                                /** @example 500 */
                                failed_requests?: number;
                                /** @example 97.5 */
                                success_rate?: number;
                                /** @example 0.25 */
                                avg_credits_per_request?: number;
                            };
                        };
                        daily?: Record<string, never>[];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "analytics-credits": {
        parameters: {
            query?: {
                /** @description Number of days to include (1-90) */
                days?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Credit history retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        period?: {
                            /** Format: date */
                            start?: string;
                            /** Format: date */
                            end?: string;
                            days?: number;
                        };
                        summary?: {
                            /** @example 28500 */
                            total_credits?: number;
                            /** @example 45000 */
                            total_requests?: number;
                            /** @example 38000 */
                            chargeable_requests?: number;
                            /** @example 0.63 */
                            avg_credits_per_request?: number;
                            /** @example 84.4 */
                            chargeable_rate?: number;
                        };
                        daily?: {
                            /** Format: date */
                            date?: string;
                            total_credits?: number;
                            total_requests?: number;
                            chargeable_requests?: number;
                        }[];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "analytics-summary": {
        parameters: {
            query?: {
                /** @description Start date (YYYY-MM-DD) */
                start_date?: string;
                /** @description End date (YYYY-MM-DD) */
                end_date?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Summary statistics retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 1250000 */
                        total_api_requests?: number;
                        /** @example 425000.5 */
                        total_credits_consumed?: number;
                        /** @example 15 */
                        unique_products_used?: number;
                        /** @example 1150000 */
                        successful_requests?: number;
                        /** @example 100000 */
                        failed_requests?: number;
                        /** @example 92 */
                        success_rate?: number;
                        /** @example 245 */
                        avg_response_time_ms?: number;
                        /**
                         * Format: date-time
                         * @example 2023-06-15T10:30:00.000Z
                         */
                        first_request?: string | null;
                        /**
                         * Format: date-time
                         * @example 2024-02-01T14:22:00.000Z
                         */
                        last_request?: string | null;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "analytics-daily": {
        parameters: {
            query?: {
                /** @description Number of days to include (1-90) */
                days?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Daily metrics retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        period?: {
                            /** Format: date */
                            start?: string;
                            /** Format: date */
                            end?: string;
                            days?: number;
                        };
                        data?: {
                            /** Format: date */
                            date?: string;
                            total_requests?: number;
                            successful_requests?: number;
                            failed_requests?: number;
                            total_credits?: number;
                            p50_latency_ms?: number;
                            p95_latency_ms?: number;
                            p99_latency_ms?: number;
                            error_rate?: number;
                        }[];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "analytics-day": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Date in YYYY-MM-DD format */
                date: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Day breakdown retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * Format: date
                         * @example 2024-02-01
                         */
                        date?: string;
                        summary?: {
                            /** @example 875.5 */
                            total_credits?: number;
                            /** @example 1250 */
                            total_requests?: number;
                            /** @example 8 */
                            products_count?: number;
                        };
                        products?: {
                            /** @example email_validation */
                            product_id?: string;
                            /** @example 500 */
                            requests?: number;
                            /** @example 25 */
                            credits?: number;
                            /** @example 2.86 */
                            credits_percentage?: number;
                            /** @example 0.25 */
                            avg_credits_per_request?: number;
                            /** @example 0.25 */
                            max_credits?: number;
                        }[];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    "email-validation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: email
                     * @description Email address to validate
                     * @example alex.rivera@example.com
                     */
                    email: string;
                };
            };
        };
        responses: {
            /** @description Successful validation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example alex.rivera@example.com */
                        email?: string;
                        /** @example valid */
                        email_status?: string;
                        /** @example 0.25 */
                        credits_consumed?: number;
                        /** @example Email is valid. */
                        message?: string;
                        /** @example mx1.example.com */
                        mx_record?: string;
                        /** @example Example Mail */
                        mx_provider?: string;
                        /**
                         * @description Security gateway vendor name
                         * @example null
                         */
                        mx_gateway?: string | null;
                        /**
                         * @description Security gateway type
                         * @example null
                         */
                        mx_gateway_type?: string | null;
                        /** @example false */
                        mx_security_gateway?: boolean;
                        /** @example Leadmagic */
                        company_name?: string;
                        /** @example Internet */
                        company_industry?: string;
                        /** @example 11-50 */
                        company_size?: string;
                        /** @example 2022 */
                        company_founded?: number;
                        /** @example Private */
                        company_type?: string;
                        company_location?: {
                            /** @example Boston, Massachusetts, United States */
                            name?: string;
                            /** @example Boston */
                            locality?: string;
                            /** @example Massachusetts */
                            region?: string;
                            /** @example Boston */
                            metro?: string;
                            /** @example United States */
                            country?: string;
                            /** @example North America */
                            continent?: string;
                            /** @example 1 Seaport Lane */
                            street_address?: string;
                            /** @example null */
                            address_line_2?: string | null;
                            /** @example 02210 */
                            postal_code?: string;
                            /** @example null */
                            geo?: string | null;
                        };
                        /**
                         * @description Legacy field name for the B2B company profile.
                         * @example linkedin.com/company/acme
                         */
                        company_linkedin_url?: string;
                        /** @example 75153174 */
                        company_linkedin_id?: string;
                        /** @example null */
                        company_facebook_url?: string | null;
                        /** @example null */
                        company_twitter_url?: string | null;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "email-finder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description First name of the person (optional if full_name provided). A single initial (`J`) is accepted when `last_name` is a full surname.
                     * @default Alex
                     */
                    first_name?: string;
                    /**
                     * @description Last name of the person (optional)
                     * @default Rivera
                     */
                    last_name?: string | null;
                    /**
                     * @description Full name of the person (alternative to first_name + last_name). An initial plus a surname (`J Orjuela`) is accepted.
                     * @default Alex Rivera
                     */
                    full_name?: string | null;
                    /**
                     * @description Company domain name (required if company_name not provided; aliases company_domain, website, url accepted)
                     * @default leadmagic.io
                     */
                    domain?: string;
                    /**
                     * @description Company name (required if domain not provided; aliases company, organization, employer accepted)
                     * @default LeadMagic
                     */
                    company_name?: string;
                    /**
                     * @description B2B profile URL or username. Identifies the person and their company on its own, then the email is validated the same way as a name plus domain.
                     * @example https://www.linkedin.com/in/alex-rivera
                     */
                    profile_url?: string | null;
                    /**
                     * @description By default, an email found on a domain unrelated to the requested one is returned as a free not-found (`domain_mismatch: true`, `credits_consumed: 0`). Set to `true` to return that email instead, flagged `domain_mismatch: true` and charged like any other valid find.
                     * @default false
                     */
                    allow_domain_mismatch?: boolean;
                };
            };
        };
        responses: {
            /** @description Successful response with email details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example alex.rivera@example.com */
                        email?: string;
                        /** @example valid */
                        status?: string;
                        /** @example 1 */
                        credits_consumed?: number;
                        /** @example Valid email found. */
                        message?: string;
                        /** @example Alex */
                        first_name?: string;
                        /** @example Rivera */
                        last_name?: string;
                        /** @example leadmagic.io */
                        domain?: string;
                        /** @example alt3.mx1.example.com */
                        mx_record?: string;
                        /** @example Example Mail */
                        mx_provider?: string;
                        /** @example false */
                        mx_security_gateway?: boolean;
                        /**
                         * @description Whether the domain has MX records
                         * @example true
                         */
                        has_mx?: boolean;
                        /** @description Complete list of MX records with priorities */
                        mx_records_full?: {
                            /** @example 10 */
                            priority?: number;
                            /** @example mx1.example.com */
                            exchange?: string;
                        }[];
                        /** @example Leadmagic */
                        company_name?: string;
                        /** @example  */
                        company_industry?: string;
                        /** @example 11-50 */
                        company_size?: string;
                        /** @example 2022 */
                        company_founded?: number;
                        company_location?: {
                            /** @example boston, massachusetts, united states */
                            name?: string;
                            /** @example boston */
                            locality?: string;
                            /** @example massachusetts */
                            region?: string;
                            /** @example boston, massachusetts */
                            metro?: string;
                            /** @example united states */
                            country?: string;
                            /** @example north america */
                            continent?: string;
                            /** @example 1 seaport lane */
                            street_address?: string;
                            address_line_2?: string;
                            /** @example 02210 */
                            postal_code?: string;
                            /** @example 42.35,-71.06 */
                            geo?: string;
                        };
                        /** @example leadmagichq */
                        company_profile_url?: string;
                        /** @example 75153174 */
                        company_profile_id?: string;
                        /** @example  */
                        company_facebook_url?: string;
                        /** @example  */
                        company_twitter_url?: string;
                        /** @example private */
                        company_type?: string;
                        /**
                         * @description The domain that was searched. Present when the result is on a different domain.
                         * @example leadmagic.io
                         */
                        requested_domain?: string;
                        /**
                         * @description True when the only email found is on a domain unrelated to `requested_domain`. Free not-found by default; returned and charged only with `allow_domain_mismatch: true`.
                         * @example false
                         */
                        domain_mismatch?: boolean;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "personal-email-finder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Professional profile URL or identifier
                     * @default alex-rivera
                     */
                    profile_url: string;
                };
            };
        };
        responses: {
            /** @description Successful response with personal email details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example alex-rivera */
                        profile_url?: string;
                        /** @example 2 */
                        credits_consumed?: number;
                        /** @example Personal Email Found. */
                        message?: string;
                        /** @example Alex Rivera */
                        name?: string;
                        /** @example alex-riveral@gmail.com */
                        first_personal_email?: string;
                        /**
                         * @example [
                         *       "alex-riveral@gmail.com"
                         *     ]
                         */
                        personal_emails?: string[];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "b2b-profile-email": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description B2B person profile URL or slug
                     * @default alex-rivera
                     */
                    profile_url: string;
                };
            };
        };
        responses: {
            /** @description Successful response with profile and email details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example alex-rivera */
                        profile_url?: string;
                        /** @example 5 */
                        credits_consumed?: number;
                        /** @example Email Found. */
                        message?: string;
                        /** @example alex.rivera@example.com */
                        email?: string;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "profile-search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description B2B person profile URL or slug
                     * @example alex-rivera
                     */
                    profile_url: string;
                };
            };
        };
        responses: {
            /** @description Successful response with profile information */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example alex-rivera */
                        profile_url?: string;
                        /** @example 1 */
                        credits_consumed?: number;
                        /** @example Alex */
                        first_name?: string | null;
                        /** @example Rivera */
                        last_name?: string | null;
                        /** @example Alex Rivera */
                        full_name?: string | null;
                        /** @example Growth & AI Expert | Founder LeadMagic */
                        professional_title?: string | null;
                        /** @example SaaS Founder */
                        bio?: string | null;
                        /** @example LeadMagic */
                        company_name?: string | null;
                        /** @example Internet */
                        company_industry?: string | null;
                        /** @example leadmagic.io */
                        company_website?: string | null;
                        /** @example 205 */
                        total_tenure_months?: string | null;
                        /** @example 6240 */
                        total_tenure_days?: string | null;
                        /** @example 17 */
                        total_tenure_years?: string | null;
                        /**
                         * @description Follower count range for privacy (e.g. "45K-50K", "1M+")
                         * @example 45K-50K
                         */
                        followers_range?: string | null;
                        personal_website?: {
                            /** @example https://leadmagic.io */
                            name?: string;
                            /** @example https://leadmagic.io */
                            link?: string;
                        } | null;
                        /** @example United States */
                        country?: string | null;
                        /** @example Greater Boston */
                        location?: string | null;
                        work_experience?: {
                            /** @example Founder */
                            position_title?: string;
                            /** @example LeadMagic */
                            company_name?: string;
                            /** @example Sep 2022 - Present · 3 yrs 2 mos */
                            employment_period?: string;
                            /**
                             * @description Only included when domain is available
                             * @example leadmagic.io
                             */
                            company_website?: string | null;
                            /**
                             * @description Only included when domain is available
                             * @example https://logo.leadmagic.io/leadmagic.io
                             */
                            company_logo_url?: string | null;
                        }[] | null;
                        education?: {
                            /** @example University of Maine */
                            institution_name?: string;
                            /** @example University of Maine */
                            degree?: string;
                            /** @example  */
                            attendance_period?: string;
                        }[] | null;
                        certifications?: {
                            /** @example Revenue Architect */
                            certification_name?: string;
                            /** @example Winning by Design */
                            issuing_organization?: string;
                            /** @example Issued Nov 2020 */
                            issue_date?: string;
                        }[] | null;
                        honors?: {
                            /** @example Hortonworks - MVP NorthEast - Region - 2016 */
                            title?: string;
                            /** @example Issued by Hortonworks · Jan 2016 */
                            description?: string;
                        }[] | null;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "email-to-b2b-profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Provide the Work Email of the person
                     * @default alex.rivera@example.com
                     */
                    work_email?: string;
                    /**
                     * @description Provide the Personal Email of the person
                     * @default alex-riveral@gmail.com
                     */
                    personal_email?: string;
                };
            };
        };
        responses: {
            /** @description Successful response with B2B profile details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example jouellette */
                        profile_url?: string;
                        /** @example Profile URL found */
                        message?: string;
                        /** @example 10 */
                        credits_consumed?: number;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "mobile-finder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Provide their Social Media URL
                     * @default alex-rivera
                     */
                    profile_url?: string;
                    /**
                     * @description Provide the Work Email of the person
                     * @default alex.rivera@example.com
                     */
                    work_email?: string;
                    /**
                     * @description Provide the Personal Email of the person
                     * @default alex-riveral@gmail.com
                     */
                    personal_email?: string;
                };
            };
        };
        responses: {
            /** @description Successful response with mobile details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example alex-rivera */
                        profile_url?: string | null;
                        /**
                         * @description Email address used in lookup (if provided)
                         * @example alex.rivera@example.com
                         */
                        email?: string | null;
                        /**
                         * @description Mobile phone number if found
                         * @example 12077523358
                         */
                        mobile_number?: string | null;
                        /** @example 5 */
                        credits_consumed?: number;
                        /**
                         * @description Status message about the result
                         * @example Mobile number found.
                         */
                        message?: string;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "job-change-detector": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Professional profile URL or identifier
                     * @example alex-rivera
                     */
                    profile_url: string;
                    /**
                     * @description Expected company name (either company_name or company_domain is required)
                     * @example Example Robotics
                     */
                    company_name?: string;
                    /**
                     * @description Expected company domain (either company_name or company_domain is required)
                     * @example smartlead.ai
                     */
                    company_domain?: string;
                };
            };
        };
        responses: {
            /** @description Successful job change detection */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description true only when status is JOB_CHANGE_DETECTED.
                         * @example false
                         */
                        job_change_detected?: boolean;
                        /**
                         * @description NO_CHANGE: the expected employer is a current role. JOB_CHANGE_DETECTED: a different primary employer is current, or the matched role has an explicit end date with nothing current, or the expected employer is absent from history while another primary employer is current. NEVER_WORKED_THERE: the expected employer is absent from history and no primary current role is listed. AMBIGUOUS_CURRENT_EMPLOYMENT: multiple substantive current roles; not safe to call. CURRENT_EMPLOYMENT_UNKNOWN: the expected employer matched but the role carries no dates; unknown, not a change. PROFILE_NOT_FOUND: the profile URL did not resolve; credits_consumed is 0.
                         * @example NEVER_WORKED_THERE
                         * @enum {string}
                         */
                        status?: "NO_CHANGE" | "JOB_CHANGE_DETECTED" | "NEVER_WORKED_THERE" | "AMBIGUOUS_CURRENT_EMPLOYMENT" | "CURRENT_EMPLOYMENT_UNKNOWN" | "PROFILE_NOT_FOUND";
                        /**
                         * @description Why the status was chosen. PROFILE_NOT_FOUND accompanies status PROFILE_NOT_FOUND.
                         * @example EXPECTED_COMPANY_NOT_FOUND_IN_HISTORY
                         * @enum {string}
                         */
                        resolution_reason?: "CURRENT_COMPANY_MATCHES_EXPECTED" | "CURRENT_COMPANY_DIFFERS_FROM_EXPECTED" | "EXPECTED_COMPANY_NOT_FOUND_IN_HISTORY" | "NO_CURRENT_POSITION_FOUND" | "NO_EXPERIENCE_HISTORY_FOUND" | "MULTIPLE_CURRENT_POSITIONS_FOUND" | "PROFILE_NOT_FOUND";
                        /** @example Alex Rivera has never worked at Example Robotics according to their comprehensive employment history. They are currently working at Leadmagic as Founder for 3 years. Their complete employment history shows experience at Leadmagic, Atlas Guild, Northstar Labs, and 7 other companies. The expected company does not appear in any current or past positions, confirming they have never been employed there. */
                        summary?: string;
                        /** @example Alex Rivera */
                        employee_name?: string;
                        /** @example Example Robotics */
                        expected_company?: string;
                        /** @example Leadmagic */
                        current_company?: string;
                        current_position?: {
                            /** @example Founder */
                            title?: string;
                            /** @example Leadmagic */
                            company?: string;
                            /** @example Sep 2022 */
                            start_date?: string;
                            /** @example 1111 */
                            days_at_job?: number;
                            /** @example 3 years */
                            tenure_formatted?: string;
                            /** @example true */
                            is_current_position?: boolean;
                        };
                        tenure_stats?: {
                            /** @example 26 */
                            average_tenure_months?: number;
                            /** @example 2 years 2 months */
                            average_tenure_formatted?: string;
                            /** @example 10 */
                            total_positions?: number;
                            /** @example 73 */
                            longest_tenure_months?: number;
                            /** @example 6 years 1 month */
                            longest_tenure_formatted?: string;
                            /** @example 1 */
                            shortest_tenure_months?: number;
                            /** @example 1 month */
                            shortest_tenure_formatted?: string;
                        };
                        /**
                         * @example [
                         *       {
                         *         "title": "Founder",
                         *         "company": "Leadmagic",
                         *         "duration": "Sep 2022 - Present",
                         *         "is_present": true
                         *       },
                         *       {
                         *         "title": "Executive Member",
                         *         "company": "Atlas Guild",
                         *         "duration": "Aug 2019 - Present",
                         *         "is_present": true
                         *       },
                         *       {
                         *         "title": "Advisor",
                         *         "company": "Northstar Labs",
                         *         "duration": "Feb 2023 - Jan 2024",
                         *         "is_present": false
                         *       },
                         *       {
                         *         "title": "Advisor",
                         *         "company": "Sales Community",
                         *         "duration": "May 2020 - Dec 2023",
                         *         "is_present": false
                         *       },
                         *       {
                         *         "title": "Advisor",
                         *         "company": "Astronomer",
                         *         "duration": "Jul 2020 - Sep 2023",
                         *         "is_present": false
                         *       }
                         *     ]
                         */
                        work_history?: {
                            /** @example Founder */
                            title?: string;
                            /** @example LeadMagic */
                            company?: string;
                            /** @example Sep 2022 - Present */
                            duration?: string;
                            /** @example true */
                            is_present?: boolean;
                        }[];
                        /** @example true */
                        profile_found?: boolean;
                        /** @example alex-rivera */
                        profile_url?: string;
                        /**
                         * @description 3 per check; 0 when status is PROFILE_NOT_FOUND.
                         * @example 3
                         */
                        credits_consumed?: number;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "company-search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Business company profile URL or identifier
                     * @default leadmagichq
                     */
                    profile_url?: string;
                    /**
                     * @description Provide Company Domain
                     * @default leadmagic.io
                     */
                    company_domain?: string;
                    /**
                     * @description Provide Company Name
                     * @default Leadmagic
                     */
                    company_name?: string;
                };
            };
        };
        responses: {
            /** @description Successful response with company details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Status message
                         * @example Company found
                         */
                        message?: string;
                        /**
                         * @description Number of credits consumed for this request
                         * @example 1
                         */
                        credits_consumed?: number;
                        /**
                         * @description Always `stored`: the answer comes from the LeadMagic company database. A miss is `Company not found` and free.
                         * @example stored
                         * @enum {string}
                         */
                        data_source?: "stored";
                        /** @example LeadMagic */
                        companyName?: string;
                        /**
                         * @description No longer populated. Always `null`; the key is kept for existing integrations.
                         * @example null
                         */
                        companyId?: number | null;
                        locations?: {
                            /** @example US */
                            country?: string;
                            /** @example Boston */
                            city?: string;
                            /** @example Massachusetts */
                            geographicArea?: string;
                            /** @example 02210 */
                            postalCode?: string;
                            /** @example 1 Seaport Ln */
                            line1?: string;
                            /** @example null */
                            line2?: string | null;
                            /** @example Headquarters */
                            description?: string;
                            /** @example true */
                            headquarter?: boolean;
                            /** @example Boston */
                            localizedName?: string;
                            /**
                             * @description Not returned. Always `null`.
                             * @example null
                             */
                            latitude?: number | null;
                            /**
                             * @description Not returned. Always `null`.
                             * @example null
                             */
                            longitude?: number | null;
                        }[];
                        /** @example 9 */
                        employeeCount?: number;
                        /**
                         * @example [
                         *       "Sales",
                         *       "Marketing",
                         *       "ABM",
                         *       "RevOps"
                         *     ]
                         */
                        specialities?: string[];
                        employeeCountRange?: {
                            /** @example 11 */
                            start?: number;
                            /** @example 50 */
                            end?: number;
                        };
                        /** @example Example Robotics provides enterprise software solutions for B2B companies. Their platform helps teams streamline operations and drive growth. */
                        tagline?: string;
                        /**
                         * @description No longer populated. Always `null`; the key is kept for existing integrations.
                         * @example null
                         */
                        followerCount?: number | null;
                        /** @example Internet */
                        industry?: string;
                        /** @example LeadMagic tells you exactly what businesses are on your website and helps you enrich your contact and company data. */
                        description?: string;
                        /** @example https://leadmagic.io */
                        websiteUrl?: string;
                        headquarter?: {
                            /** @example US */
                            country?: string;
                            /** @example Boston */
                            city?: string;
                            /** @example Massachusetts */
                            geographicArea?: string;
                            /** @example 02210 */
                            postalCode?: string;
                            /** @example 1 Seaport Ln */
                            line1?: string;
                            /** @example null */
                            line2?: string | null;
                            /** @example Headquarters */
                            description?: string;
                        };
                        foundedOn?: {
                            /** @example null */
                            month?: number | null;
                            /** @example 2022 */
                            year?: number;
                            /** @example null */
                            day?: number | null;
                        };
                        /**
                         * @description No longer populated. Always `null`; the key is kept for existing integrations.
                         * @example null
                         */
                        universalName?: string | null;
                        /**
                         * @description No longer populated. Always `null`; the key is kept for existing integrations.
                         * @example null
                         */
                        hashtag?: string | null;
                        /** @example leadmagichq */
                        url?: string;
                        /**
                         * @description Company logo URL from logo.leadmagic.io (generated from company domain)
                         * @example https://logo.leadmagic.io/leadmagic.io
                         */
                        logo_url?: string | null;
                        /**
                         * @description Year the company was founded
                         * @example 2009
                         */
                        founded_year?: string | null;
                        /**
                         * @description Ownership type (Public, Private, or Acquired)
                         * @example Private
                         */
                        ownership_status?: string | null;
                        /**
                         * @description Estimated annual revenue
                         * @example 5100000000
                         */
                        revenue?: number | null;
                        /**
                         * @description Human-readable revenue format
                         * @example 5.1B
                         */
                        revenue_formatted?: string | null;
                        /**
                         * @description Employee count range
                         * @example 5,000 - 10,000
                         */
                        employee_range?: string | null;
                        /**
                         * @description Total funding raised, as formatted text. `$0` means no funding is recorded, not a confirmed zero.
                         * @example $9.8B
                         */
                        total_funding?: string | null;
                        /**
                         * @description No longer populated. Always `null`; the key is kept for existing integrations.
                         * @example null
                         */
                        funding_rounds?: number | null;
                        /**
                         * @description Type of most recent funding round
                         * @example Equity
                         */
                        last_funding_round?: string | null;
                        /**
                         * @description No longer populated. Always `null`; the key is kept for existing integrations.
                         * @example null
                         */
                        last_funding_amount?: number | null;
                        /**
                         * @description No longer populated. Always `null`; the key is kept for existing integrations.
                         * @example null
                         */
                        last_funding_date?: string | null;
                        /**
                         * @description No longer populated. Always `null`; the key is kept for existing integrations.
                         * @example null
                         */
                        competitors?: string[] | null;
                        /**
                         * @description No longer populated. Always `null`; the key is kept for existing integrations.
                         * @example null
                         */
                        acquisitions_count?: number | null;
                        /**
                         * @description No longer populated. Always `null`; the key is kept for existing integrations.
                         * @example null
                         */
                        twitter_url?: string | null;
                        /**
                         * @description Professional company profile URL. Also returned as `linkedin_url` and `url`.
                         * @example https://www.linkedin.com/company/leadmagichq
                         */
                        b2b_url?: string | null;
                        /**
                         * @description Whether any recorded profile at the company has an email on file.
                         * @example true
                         */
                        email_found?: boolean;
                        /**
                         * @description Whether any recorded profile at the company has a phone on file.
                         * @example true
                         */
                        mobile_found?: boolean;
                        /**
                         * @description No longer populated. Always `null`; the key is kept for existing integrations.
                         * @example null
                         */
                        active_web?: boolean | null;
                        /**
                         * @description No longer populated. Always `null`; the key is kept for existing integrations.
                         * @example null
                         */
                        facebook_url?: string | null;
                        /**
                         * @description No longer populated. Always `null`; the key is kept for existing integrations.
                         * @example null
                         */
                        stock_ticker?: string | null;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "company-funding": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Provide Company Name
                     * @default leadmagic
                     */
                    company_name?: string;
                    /**
                     * @description Provide Company Domain
                     * @default leadmagic.io
                     */
                    company_domain?: string;
                };
            };
        };
        responses: {
            /** @description Successful response with company funding details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        basicInfo?: {
                            /** @example LeadMagic Inc */
                            companyName?: string;
                            /** @example Example Robotics provides enterprise software solutions for B2B companies. */
                            description?: string;
                            /** @example LeadMagic */
                            shortName?: string;
                            /** @example 2015 */
                            founded?: string;
                            headquarters?: {
                                /** @example Palo Alto */
                                city?: string;
                                /** @example California */
                                state?: string;
                                /** @example USA */
                                country?: string;
                                /** @example Palo Alto, California, USA */
                                fullAddress?: string;
                            };
                            /** @example leadmagic.io */
                            primaryDomain?: string;
                            /** @example 1-650-276-3068 */
                            phone?: string;
                            /** @example NEW */
                            status?: string;
                            /** @example 2422 */
                            followers?: number;
                            /** @example Private */
                            ownership?: string;
                        };
                        financialInfo?: {
                            /** @example 178000000 */
                            revenue?: number;
                            /** @example 178M */
                            formattedRevenue?: string;
                            /** @example 584000000 */
                            totalFunding?: number;
                            /** @example 584M */
                            formattedFunding?: string;
                            lastFundingRound?: {
                                /** @example Series E */
                                round?: string;
                                /**
                                 * Format: date-time
                                 * @example 2021-05-01T00:00:00.000Z
                                 */
                                date?: string;
                                /** @example 250000000 */
                                amount?: number;
                            };
                        };
                        /**
                         * @example [
                         *       {
                         *         "round": "Series E",
                         *         "date": "2021-05-01T00:00:00.000Z",
                         *         "amount": "$250,000,000",
                         *         "investors": [
                         *           "Franklin Templeton",
                         *           "Coatue",
                         *           "Sequoia",
                         *           "Thrive Capital",
                         *           "Tiger Global"
                         *         ]
                         *       },
                         *       {
                         *         "round": "Series D",
                         *         "date": "2020-08-01T00:00:00.000Z",
                         *         "amount": "$200,000,000",
                         *         "investors": [
                         *           "Coatue",
                         *           "Index Ventures",
                         *           "Thrive Capital",
                         *           "Battery Ventures",
                         *           "NextWorld Capital",
                         *           "Norwest Venture Partners",
                         *           "Sequoia Capital",
                         *           "Wing Venture Capital"
                         *         ]
                         *       },
                         *       {
                         *         "round": "Series C",
                         *         "date": "2019-12-01T00:00:00.000Z",
                         *         "amount": "$65,000,000",
                         *         "investors": [
                         *           "Sequoia Capital",
                         *           "Battery Ventures",
                         *           "Norwest Venture Partners",
                         *           "Wing Venture Capital",
                         *           "NextWorld Capital",
                         *           "Cisco Investments"
                         *         ]
                         *       }
                         *     ]
                         */
                        fundingHistory?: {
                            /** @example Series E */
                            round?: string;
                            /**
                             * Format: date-time
                             * @example 2021-05-01T00:00:00.000Z
                             */
                            date?: string;
                            /** @example $250,000,000 */
                            amount?: string;
                            /**
                             * @example [
                             *       "Franklin Templeton",
                             *       "Coatue",
                             *       "Sequoia",
                             *       "Thrive Capital",
                             *       "Tiger Global"
                             *     ]
                             */
                            investors?: string[];
                        }[];
                        companySize?: {
                            /** @example 1100 */
                            employees?: number;
                            /** @example 1,000 - 5,000 */
                            employeeRange?: string;
                            /** @example N/A */
                            employeeGrowth?: string;
                        };
                        leadership?: {
                            ceo?: {
                                /** @example Amit */
                                firstName?: string;
                                /** @example Bendov */
                                lastName?: string;
                                /** @example Co-Founder & CEO */
                                designation?: string;
                                /** @example amitbendov */
                                b2b_profile?: string;
                                /** @example https://twitter.com/banditmove */
                                twitter?: string;
                            };
                        };
                        industryAndSectors?: {
                            /**
                             * @example [
                             *       "Sales Enablement Software",
                             *       "Business Intelligence (BI)"
                             *     ]
                             */
                            industrySectors?: string[];
                            /**
                             * @example [
                             *       "Software, Internet & Computer Services"
                             *     ]
                             */
                            industries?: string[];
                            /** @example N/A */
                            technologyStack?: string;
                        };
                        /**
                         * @example [
                         *       {
                         *         "name": "BoostUp",
                         *         "revenue": "$6",
                         *         "employees": "85",
                         *         "totalFunding": "$425",
                         *         "headquarters": {
                         *           "city": "Santa Clara",
                         *           "state": "US-CA",
                         *           "country": "USA",
                         *           "fullAddress": "Santa Clara, US-CA, USA"
                         *         },
                         *         "founded": "2018-01-01T00:00:00.000Z",
                         *         "ownership": "Private",
                         *         "website": "https://www.boostup.ai"
                         *       },
                         *       {
                         *         "name": "ExecVision",
                         *         "revenue": "$43",
                         *         "employees": "31",
                         *         "totalFunding": "$81",
                         *         "headquarters": {
                         *           "city": "Arlington",
                         *           "state": "US-VA",
                         *           "country": "USA",
                         *           "fullAddress": "Arlington, US-VA, USA"
                         *         },
                         *         "founded": "2015-01-01T00:00:00.000Z",
                         *         "ownership": "Private",
                         *         "website": "https://www.execvision.io"
                         *       },
                         *       {
                         *         "name": "Seismic",
                         *         "revenue": "$375",
                         *         "employees": 1000,
                         *         "totalFunding": "$940",
                         *         "headquarters": {
                         *           "city": "San Diego",
                         *           "state": "US-CA",
                         *           "country": "USA",
                         *           "fullAddress": "San Diego, US-CA, USA"
                         *         },
                         *         "founded": "2010-01-01T00:00:00.000Z",
                         *         "ownership": "Private",
                         *         "website": "https://seismic.com"
                         *       }
                         *     ]
                         */
                        topCompetitors?: {
                            /** @example Chorus */
                            name?: string;
                            /** @example $21 */
                            revenue?: string;
                            /** @example 200 */
                            employees?: string;
                            /** @example $1,003 */
                            totalFunding?: string;
                            headquarters?: {
                                /** @example San Francisco */
                                city?: string;
                                /** @example US-CA */
                                state?: string;
                                /** @example USA */
                                country?: string;
                                /** @example San Francisco, US-CA, USA */
                                fullAddress?: string;
                            };
                            /**
                             * Format: date-time
                             * @example 2015-01-01T00:00:00.000Z
                             */
                            founded?: string;
                            /** @example Private */
                            ownership?: string;
                            /** @example https://www.chorus.ai */
                            website?: string;
                        }[];
                        /**
                         * @example [
                         *       {
                         *         "companyName": "Vayo",
                         *         "acquisitionDate": "2020-09-01T00:00:00.000Z",
                         *         "description": "Vayo is a SaaS-based firm that analyzes, integrates and converts customer data into actionable insights for business",
                         *         "source": "https://techcrunch.com/2020/09/01/fresh-off-200m-series-d-leadmagic-acquires-early-stage-startup-vayo"
                         *       },
                         *       {
                         *         "companyName": "ONDiGO",
                         *         "acquisitionDate": "2018-04-01T00:00:00.000Z",
                         *         "description": "ONDiGO is a CRM platform that offers customer retention and management services to professionals and micro-businesses.",
                         *         "source": "https://www.prnewswire.com/news-releases/leadmagic-acquires-ondigo-to-extend-its-conversation-intelligence-platform-300630168.html"
                         *       }
                         *     ]
                         */
                        acquisitions?: {
                            /** @example Vayo */
                            companyName?: string;
                            /**
                             * Format: date-time
                             * @example 2020-09-01T00:00:00.000Z
                             */
                            acquisitionDate?: string;
                            /** @example Vayo is a SaaS-based firm that analyzes, integrates and converts customer data into actionable insights for business */
                            description?: string;
                            /** @example https://techcrunch.com/2020/09/01/fresh-off-200m-series-d-leadmagic-acquires-early-stage-startup-vayo */
                            source?: string;
                        }[];
                        /**
                         * @example [
                         *       {
                         *         "platform": "twitter",
                         *         "url": "https://twitter.com/leadmagic"
                         *       },
                         *       {
                         *         "platform": "facebook",
                         *         "url": "https://www.facebook.com/To.LeadMagicHQ"
                         *       },
                         *       {
                         *         "platform": "b2b_profile",
                         *         "url": "leadmagichq"
                         *       }
                         *     ]
                         */
                        socialMedia?: {
                            /** @example twitter */
                            platform?: string;
                            /** @example https://twitter.com/leadmagic */
                            url?: string;
                        }[];
                        /**
                         * @example [
                         *       {
                         *         "title": "Example Robotics: Example Robotics Launches New Enterprise Platform",
                         *         "source": "TechCrunch",
                         *         "date": "2024-08-07T08:40:00.000Z"
                         *       },
                         *       {
                         *         "title": "Example Robotics: Example Robotics Partners with Example CRM",
                         *         "source": "Business Wire",
                         *         "date": "2024-06-26T22:15:00.000Z"
                         *       },
                         *       {
                         *         "title": "Example Robotics Named Best SaaS Solution in 2024 Industry Awards",
                         *         "source": "Forbes",
                         *         "date": "2024-06-26T00:00:00.000Z"
                         *       }
                         *     ]
                         */
                        news?: {
                            /** @example Example Robotics: Example Robotics Launches New Enterprise Platform */
                            title?: string;
                            /** @example Martech Cube */
                            source?: string;
                            /**
                             * Format: date-time
                             * @example 2024-08-07T08:40:00.000Z
                             */
                            date?: string;
                        }[];
                        /**
                         * @example [
                         *       {
                         *         "title": "Press Release: Example Robotics Announces Strategic Partnership with Example Robotics",
                         *         "source": "PR Newswire",
                         *         "date": "2024-10-17T22:21:00.000Z"
                         *       },
                         *       {
                         *         "title": "Press Release: Example Robotics Named a Winner in The Cloud Awards",
                         *         "source": "PR Newswire",
                         *         "date": "2024-10-09T18:28:00.000Z"
                         *       },
                         *       {
                         *         "title": "Press Release: Example Robotics Recognized as Industry Leader by Example Research",
                         *         "source": "Business Wire",
                         *         "date": "2024-09-04T18:50:00.000Z"
                         *       }
                         *     ]
                         */
                        pressReleases?: {
                            /** @example Press Release: Example Robotics Announces Strategic Partnership with Example Robotics */
                            title?: string;
                            /** @example PR Newswire */
                            source?: string;
                            /**
                             * Format: date-time
                             * @example 2024-10-17T22:21:00.000Z
                             */
                            date?: string;
                        }[];
                        /**
                         * @example [
                         *       {
                         *         "type": "partnership",
                         *         "text": "Example Robotics Announces Strategic Partnership with Example Robotics",
                         *         "date": "2024-10-17T22:21:00.000Z",
                         *         "src": "https://www.prnewswire.com/news-releases/acme-corp-announces-partnership-302271451.html",
                         *         "source": "PR Newswire"
                         *       },
                         *       {
                         *         "type": "award",
                         *         "text": "Example Robotics Named a Winner in The Cloud Awards",
                         *         "date": "2024-10-09T18:28:00.000Z",
                         *         "src": "https://www.prnewswire.com/news-releases/acme-corp-cloud-awards-302271452.html",
                         *         "source": "PR Newswire"
                         *       }
                         *     ]
                         */
                        keyHighlights?: {
                            /** @example partnership */
                            type?: string;
                            /** @example Example Robotics Announces Strategic Partnership with Example Robotics */
                            text?: string;
                            /**
                             * Format: date-time
                             * @example 2024-10-17T22:21:00.000Z
                             */
                            date?: string;
                            /** @example https://www.prnewswire.com/news-releases/acme-corp-announces-partnership-302271451.html */
                            src?: string;
                            /** @example PR Newswire */
                            source?: string;
                        }[];
                        /** @example Example Robotics provides enterprise software solutions for B2B companies. Example Robotics was founded in 2018. Example Robotics's headquarters is located in San Francisco, California, USA. */
                        summarySection?: string;
                        /** @example 4 */
                        credits_consumed?: number;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "competitors-search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Company website domain
                     * @example leadmagic.io
                     */
                    company_domain?: string;
                    /**
                     * @description Company profile URL or identifier (optional)
                     * @example leadmagichq
                     */
                    company_url?: string;
                    /**
                     * @description Company name
                     * @example LeadMagic
                     */
                    company_name?: string;
                };
            };
        };
        responses: {
            /** @description Successful response with competitors details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        competitors?: {
                            /** @example LeadMagic */
                            name?: string;
                            /** @example LeadMagic is a company that develops a conversation intelligence platform for B2B sales teams. */
                            shortDescription?: string;
                            /** @example 2015 */
                            founded_year?: string;
                            /** @example private */
                            companyType?: string;
                            /** @example San Francisco, US */
                            hq?: string;
                            /** @example 1504 */
                            employeesCount?: number;
                            /** @example 7250000000 */
                            valuation?: number;
                            tags?: {
                                /** @example Technology */
                                name?: string;
                                /** @example technology */
                                slug?: string;
                                /** @example true */
                                primary?: boolean;
                            }[];
                            /** @example 7611 */
                            twitter_followers?: number;
                            /** @example 1 */
                            growth?: number;
                            /**
                             * @example [
                             *       "Dublin, IE",
                             *       "Ramat Gan, IL",
                             *       "Atlanta, US",
                             *       "Chicago, US"
                             *     ]
                             */
                            non_hq_locations?: string[];
                            /** @example false */
                            more_locations?: boolean;
                            financial_metrics?: {
                                /** @example USD */
                                currency_code?: string;
                                /** @example Y, 2020 */
                                period?: string;
                                /** @example 37500000 */
                                revenue?: number;
                                /** @example null */
                                cost_of_goods_sold?: number | null;
                                /** @example null */
                                gross_profit?: number | null;
                                /** @example null */
                                net_income?: number | null;
                            };
                            operating_metrics?: {
                                /** @example Dec, 2019 */
                                period?: string;
                                /** @example 700.0 */
                                value?: string;
                                /** @example Enterprise Customers */
                                definition?: string;
                                /** @example Customers */
                                operating_metric_group?: string;
                                /** @example null */
                                currency_code?: string | null;
                            }[];
                            funding_metrics?: {
                                /** @example about 3 years */
                                date?: string;
                                /** @example 250000000 */
                                latest?: number;
                                /** @example USD */
                                currency_code?: string;
                                /** @example 581000000 */
                                total?: number;
                            };
                            twitterEngagement?: {
                                /** @example leadmagichq */
                                handle?: string;
                                analytics?: {
                                    /** @example 2023-07-12T00:00:00 */
                                    collectedAt?: string;
                                    /** @example 6384 */
                                    tweets?: number;
                                    /** @example 1854 */
                                    following?: number;
                                    /** @example 7611 */
                                    followers?: number;
                                    /** @example 0 */
                                    tweetsForPeriod?: number;
                                    /** @example 0 */
                                    avgTweetsPerDay?: number;
                                    /** @example 0 */
                                    avgRetweetsPerTweet?: number;
                                    /** @example 0 */
                                    avgLikesPerTweet?: number;
                                    /** @example 0 */
                                    tweetsPercentageEngagementForPeriod?: number;
                                }[];
                            };
                        }[];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
            502: components["responses"]["BadGateway"];
            503: components["responses"]["ServiceUnavailable"];
        };
    };
    technographics: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description The domain of the company to analyze
                     * @example leadmagic.io
                     */
                    company_domain: string;
                };
            };
        };
        responses: {
            /** @description Successful response with technology stack information */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 1 */
                        credits_consumed?: number;
                        /** @example Technology stack information retrieved successfully */
                        message?: string;
                        /** @description Array of technologies found. Omitted or empty when no data is available. */
                        data?: {
                            /**
                             * @description The name of the technology
                             * @example Google Analytics
                             */
                            name?: string;
                            /**
                             * @description Description of the technology
                             * @example Google Analytics is a web analytics service offered by Google that tracks and reports website traffic.
                             */
                            description?: string;
                            /**
                             * @description Categories this technology belongs to
                             * @example [
                             *       "Analytics",
                             *       "Marketing"
                             *     ]
                             */
                            categories?: string[];
                            /** @description Sub-technologies or related tools */
                            sub_technologies?: {
                                /**
                                 * @description Name of the sub-technology
                                 * @example Google Analytics 4
                                 */
                                name?: string;
                                /**
                                 * @description Description of the sub-technology
                                 * @example The latest version of Google Analytics with enhanced privacy features
                                 */
                                description?: string;
                                /**
                                 * @description Categories for the sub-technology
                                 * @example [
                                 *       "Analytics",
                                 *       "Privacy-focused"
                                 *     ]
                                 */
                                categories?: string[];
                            }[];
                        }[];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
            503: components["responses"]["ServiceUnavailable"];
        };
    };
    "role-finder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Company name
                     * @default leadmagic
                     */
                    company_name?: string;
                    /**
                     * @description Company domain
                     * @default leadmagic.io
                     */
                    company_domain?: string;
                    /**
                     * @description Company profile URL
                     * @example https://www.linkedin.com/company/example
                     */
                    linkedin_url?: string;
                    /**
                     * @description Enter the job title you want to find in the company.
                     * @default ceo
                     */
                    job_title: string;
                };
            };
        };
        responses: {
            /** @description Successful response with role details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Alex Rivera */
                        name?: string;
                        /** @example https://www.linkedin.com/in/alex-rivera */
                        profile_url?: string;
                        /** @example Alex */
                        first_name?: string;
                        /** @example Rivera */
                        last_name?: string;
                        /**
                         * @description Role Found on a match or Role not found. on a miss.
                         * @example Role Found
                         */
                        message?: string;
                        /** @example 2 */
                        credits_consumed?: number;
                        /** @description Current job title reported by the source. */
                        job_title?: string | null;
                        /** @example Leadmagic */
                        company_name?: string;
                        /** @example leadmagic.io */
                        company_website?: string;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
            503: components["responses"]["ServiceUnavailable"];
        };
    };
    "employee-finder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Company website domain (preferred: more accurate than company_name)
                     * @default leadmagic.io
                     */
                    company_domain?: string;
                    /**
                     * @description Company name. Use if domain is not available.
                     * @default leadmagic
                     */
                    company_name?: string;
                    /**
                     * @description Maximum number of employees to return
                     * @default 10
                     */
                    limit?: number;
                };
            };
        };
        responses: {
            /** @description Successful response with employee list */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        employees?: {
                            /** @example Alex */
                            first_name?: string;
                            /** @example Rivera */
                            last_name?: string;
                            /** @example Alex Rivera */
                            full_name?: string;
                            /** @example linkedin.com/in/alex-rivera */
                            profile_url?: string;
                            /** @example VP of Sales */
                            job_title?: string;
                            /** @example San Francisco, CA */
                            location?: string;
                        }[];
                        /**
                         * @description Total employees found (may exceed returned count when limit is set)
                         * @example 150
                         */
                        total_count?: number;
                        /**
                         * @description Credits used (0.05 per employee returned)
                         * @example 0.5
                         */
                        credits_consumed?: number;
                        message?: components["schemas"]["EmployeeFinderMessages"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "people-search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "company_filters": {
                 *         "company_domains": [
                 *           "leadmagic.io"
                 *         ],
                 *         "crm_tech": [
                 *           "Salesforce"
                 *         ]
                 *       },
                 *       "people_filters": {
                 *         "contact_job_level": [
                 *           "VP",
                 *           "Director"
                 *         ],
                 *         "contact_job_function": [
                 *           "Sales"
                 *         ],
                 *         "is_sales": true
                 *       },
                 *       "titles": [
                 *         "VP Sales",
                 *         "Head of Revenue"
                 *       ],
                 *       "limit": 10
                 *     }
                 */
                "application/json": {
                    /** @example leadmagic.io */
                    company_domain?: string;
                    /** @example LeadMagic */
                    company_name?: string;
                    /**
                     * @description B2B company profile URL or slug.
                     * @example https://www.linkedin.com/company/acme/
                     */
                    linkedin_url?: string;
                    /** @description Employer criteria supported by People Search: identity, industry, classification, headcount, revenue, founding year, headquarters, funding, and technology. tech_stack and each *_tech criterion accept at most 50 values and require every requested technology; more values match no records. This is a subset of standalone Company Search. Unsupported selected keys are listed in ignored_filters with warnings; accepted input does not guarantee application. */
                    company_filters?: {
                        [key: string]: unknown;
                    };
                    /** @description Current professional-profile filters for name, title/function/level, persona, residence and job geography, profile identity, headline/about-me/description, recorded industry, language, seniority, job count, and connections. Residence, job location, and company headquarters are distinct filters and AND together. Freeform location/contact_location accepts at most five comma-separated terms; more terms match no records. This limit does not apply to explicit geography arrays. contact_job_function accepts short chips such as Sales or full standard department labels; contact_job_level selects exact levels. Role flags are stored title/function heuristics and can be incomplete or misclassified; they do not verify buying authority. Prefer contact_job_function and explicit titles for precise roles. min_seniority is an inclusive 0-5 role-rank floor (0 Other/unclassified, 1 Staff, 2 Manager, 3 Director, 4 VP, 5 C-Team), not buying-authority confidence. contact_persona matches literal label text ignoring case. Multiple values in the same supported text/enum array are OR'd; different filter keys are AND'd. Numeric bounds are inclusive. Prior-title history and follower counts are unavailable. Contact details are obtained through separate Email Finder or Mobile Finder requests. Selected criteria the current search cannot apply appear in top-level ignored_filters and warnings. */
                    people_filters?: {
                        [key: string]: unknown;
                    };
                    /** @example VP Sales */
                    title?: string;
                    /** @example Head of Revenue */
                    job_title?: string;
                    titles?: string[];
                    roles?: string[];
                    /** @description Free-text people/title query. */
                    query?: string;
                    /** @default true */
                    include_company?: boolean;
                    /**
                     * @description Accepted for backwards compatibility; not required and does not enable contact values in search.
                     * @default false
                     */
                    confirm_credit_charge?: boolean;
                    /**
                     * @description Offset requests allow up to 10000 rows; cursor-based pages are capped at 50.
                     * @default 25
                     */
                    limit?: number;
                    /** @description Opaque signed next_cursor from the previous page. Send unchanged with the same filters, a limit no greater than 50, and offset 0. */
                    cursor?: string;
                    /**
                     * @deprecated
                     * @description Legacy offset pagination; prefer cursor. Unstable ordering, uncached. Restart at offset 0 to obtain a cursor.
                     * @default 0
                     */
                    offset?: number;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        responses: {
            /** @description People search results */
            200: {
                headers: {
                    "RateLimit-Limit": components["headers"]["RateLimitLimit"];
                    "RateLimit-Remaining": components["headers"]["RateLimitRemaining"];
                    "RateLimit-Reset": components["headers"]["RateLimitReset"];
                    "X-RateLimit-RPS-Limit": components["headers"]["SearchRpsLimit"];
                    "X-RateLimit-RPS-Remaining": components["headers"]["SearchRpsRemaining"];
                    "X-RateLimit-RPS-Reset": components["headers"]["SearchRpsReset"];
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "People found",
                     *       "credits_consumed": 0,
                     *       "count": 120,
                     *       "returned_count": 25,
                     *       "limit_applied": 25,
                     *       "offset": 25,
                     *       "has_more": true,
                     *       "next_cursor": null,
                     *       "metadata": {
                     *         "query_name": "people_search_v3",
                     *         "query_path": "full_search",
                     *         "pagination": "offset"
                     *       },
                     *       "people": [
                     *         {
                     *           "contact_linkedin_url": "https://www.linkedin.com/in/jane-doe",
                     *           "contact_linkedin_username": "jane-doe",
                     *           "contact_first_name": "Jane",
                     *           "contact_last_name": "Doe",
                     *           "contact_full_name": "Jane Doe",
                     *           "contact_linkedin_headline": "Sales Director | B2B Software",
                     *           "contact_linkedin_about_me": "B2B software sales leader",
                     *           "contact_city": "Boston",
                     *           "contact_state": "Massachusetts",
                     *           "contact_state_code": "MA",
                     *           "contact_country": "United States",
                     *           "contact_country_code": "US",
                     *           "contact_region": "NORAM",
                     *           "contact_continent": "North America",
                     *           "contact_job_title": "Founder",
                     *           "contact_job_function": "General Business & Management",
                     *           "contact_job_level": "C-Team",
                     *           "contact_job_description": "LeadMagic is the Best B2B Email & Mobile Finder",
                     *           "contact_job_start_date": "2022-09-01",
                     *           "contact_job_count": 15,
                     *           "contact_persona": "Founder/Co-Founder",
                     *           "contact_company_name": "Leadmagic",
                     *           "company_domain": "leadmagic.io",
                     *           "seniority_score": 5,
                     *           "followers": null,
                     *           "company": {
                     *             "company_domain": "leadmagic.io",
                     *             "company_name": "Leadmagic",
                     *             "company_website": "https://www.leadmagic.io",
                     *             "company_industry_linkedin": "Internet Publishing",
                     *             "employee_range": "11 to 50",
                     *             "employee_min": 11,
                     *             "employee_max": 50,
                     *             "linkedin_employee_count": 10,
                     *             "revenue_range": "$1M to <$10M",
                     *             "revenue_min": "4000000",
                     *             "revenue_max": "4000000",
                     *             "hq_country": "United States",
                     *             "hq_country_code": "US",
                     *             "hq_city": "Boston",
                     *             "hq_state": "Massachusetts",
                     *             "founded_year": 2022,
                     *             "linkedin_followers": null,
                     *             "growth_rate": null,
                     *             "linkedin_url": "https://www.linkedin.com/company/acme",
                     *             "company_headline": "The data provider other data providers use. Emails, mobiles, and company data that don't bounce."
                     *           }
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        message?: string;
                        /** @description Finalized search credits; 1 per returned person on metered plans, or 0 for eligible included-plan searches. Separate enrichment requests are charged independently. */
                        credits_consumed?: number;
                        credit_preview?: {
                            [key: string]: unknown;
                        };
                        people?: ({
                            contact_linkedin_url?: string | null;
                            contact_linkedin_username?: string | null;
                            contact_first_name?: string | null;
                            contact_last_name?: string | null;
                            contact_full_name?: string | null;
                            contact_linkedin_headline?: string | null;
                            contact_linkedin_industry?: string | null;
                            contact_linkedin_about_me?: string | null;
                            contact_city?: string | null;
                            contact_state?: string | null;
                            contact_state_code?: string | null;
                            contact_country?: string | null;
                            contact_country_code?: string | null;
                            contact_region?: string | null;
                            contact_continent?: string | null;
                            contact_job_title?: string | null;
                            /** @description Standard department label for the person's current role (e.g. Sales & Business Development). Filter requests may use short chips such as Sales; responses always return this standard label. */
                            contact_job_function?: string | null;
                            contact_job_level?: string | null;
                            contact_job_description?: string | null;
                            contact_job_start_date?: string | null;
                            contact_job_count?: number | null;
                            contact_persona?: string | null;
                            contact_job_city?: string | null;
                            contact_job_country?: string | null;
                            contact_job_country_code?: string | null;
                            contact_job_region?: string | null;
                            contact_job_continent?: string | null;
                            contact_job_state?: string | null;
                            contact_job_state_code?: string | null;
                            contact_company_name?: string | null;
                            company_domain?: string | null;
                            contact_education?: string | null;
                            contact_skills?: string | null;
                            contact_certifications?: string | null;
                            contact_languages?: string | null;
                            contact_websites?: string | null;
                            /** @description Role rank: 0 Other/unclassified, 1 Staff, 2 Manager, 3 Director, 4 VP, 5 C-Team. Does not verify buying authority. */
                            seniority_score?: number | null;
                            is_cio?: boolean | null;
                            is_it_leader?: boolean | null;
                            is_security?: boolean | null;
                            is_revops?: boolean | null;
                            is_recruiting?: boolean | null;
                            is_engineering?: boolean | null;
                            is_sales?: boolean | null;
                            is_marketing?: boolean | null;
                            is_operations?: boolean | null;
                            /** @description Legacy compatibility field; may be absent or null. Not a supported discovery filter. */
                            job_observation_count?: number | null;
                            /** @description Legacy compatibility field; may be absent or null. Not a supported discovery filter. */
                            distinct_company_count?: number | null;
                            /** @description Legacy compatibility field; may be absent or null. Not a supported discovery filter. */
                            followers?: number | null;
                            company?: {
                                [key: string]: unknown;
                            } | null;
                            /** @description Compatibility metadata, if present. Does not enable contact values in search. */
                            unlock?: {
                                [key: string]: unknown;
                            } | null;
                        } & {
                            [key: string]: unknown;
                        })[];
                        companies?: {
                            [key: string]: unknown;
                        }[];
                        /** @description Number of people returned in this page, not total audience size. */
                        count?: number;
                        /** @description Number of people returned in this page. */
                        returned_count?: number;
                        /** @description Qualified keys of selected criteria that were not applied. */
                        ignored_filters?: string[];
                        /** @description Explanations of unavailable or unapplied criteria. */
                        warnings?: string[];
                        limit_applied?: number;
                        offset?: number;
                        has_more?: boolean;
                        /** @description Opaque signed token for the next page, or null on the last page. Send back as cursor with offset 0. Cursor pagination is stable and cached. */
                        next_cursor?: string | null;
                        metadata?: {
                            /**
                             * @description snapshot/cursor for cursor/first-page responses; offset for legacy offset responses.
                             * @enum {string}
                             */
                            pagination?: "snapshot" | "cursor" | "offset";
                        } & {
                            [key: string]: unknown;
                        };
                    } & {
                        [key: string]: unknown;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            429: components["responses"]["RateLimitExceeded"];
        };
    };
    "company-search-v3": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "limit": 10,
                 *       "company_filters": {
                 *         "company_domains": [
                 *           "leadmagic.io"
                 *         ],
                 *         "country_codes": [
                 *           "US"
                 *         ],
                 *         "crm_tech": [
                 *           "Salesforce"
                 *         ],
                 *         "has_funding": true
                 *       }
                 *     }
                 */
                "application/json": {
                    /**
                     * @description Direct one-company lookup input. Returns one rich company row plus legacy-friendly aliases when no broad filters or explicit limit are supplied.
                     * @example leadmagic.io
                     */
                    company_domain?: string;
                    /** @description Alias for company_domain. */
                    domain?: string;
                    /** @description Company website URL or domain. */
                    website?: string;
                    /** @description Company name lookup input. */
                    company_name?: string;
                    /** @description Company profile URL. */
                    profile_url?: string;
                    /** @description Company profile URL. */
                    linkedin_url?: string;
                    /** @description Supported discovery criteria include identity, headquarters, industry/classification, headcount, revenue, founding year, funding, profile counts, recorded flags, company text, and technology. Identity arrays form an OR group; other selected attributes AND with it. Numeric/date bounds are inclusive. Each requested technology and specialty must match; company_martech category values are alternatives. tech_stack and each *_tech criterion accept at most 50 values; more values match no records. Office-presence geography, followers/growth, and custom ordering are unavailable. Search does not expose email or phone availability. Unsupported selected keys appear in ignored_filters and warnings. */
                    company_filters?: {
                        [key: string]: unknown;
                    };
                    query?: string;
                    /** @default 10 */
                    limit?: number;
                    /** @description Opaque next_cursor from the previous page. Send unchanged with the same filters and limit. */
                    cursor?: string;
                    /**
                     * @deprecated
                     * @description Legacy offset pagination; prefer cursor. Unstable ordering, uncached. Restart at offset 0 to obtain a cursor.
                     * @default 0
                     */
                    offset?: number;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        responses: {
            /** @description Company search results */
            200: {
                headers: {
                    "RateLimit-Limit": components["headers"]["RateLimitLimit"];
                    "RateLimit-Remaining": components["headers"]["RateLimitRemaining"];
                    "RateLimit-Reset": components["headers"]["RateLimitReset"];
                    "X-RateLimit-RPS-Limit": components["headers"]["SearchRpsLimit"];
                    "X-RateLimit-RPS-Remaining": components["headers"]["SearchRpsRemaining"];
                    "X-RateLimit-RPS-Reset": components["headers"]["SearchRpsReset"];
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Companies found",
                     *       "credits_consumed": 0,
                     *       "count": 120,
                     *       "returned_count": 25,
                     *       "limit_applied": 25,
                     *       "offset": 25,
                     *       "has_more": true,
                     *       "next_cursor": null,
                     *       "metadata": {
                     *         "pagination": "offset"
                     *       },
                     *       "companies": [
                     *         {
                     *           "company_domain": "leadmagic.io",
                     *           "company_name": "Leadmagic",
                     *           "company_website": "https://www.leadmagic.io",
                     *           "employee_range": "11 to 50"
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        message?: string;
                        credits_consumed?: number;
                        companies?: ({
                            company_domain?: string;
                            company_name?: string;
                            company_website?: string;
                            company_industry_linkedin?: string;
                            employee_range?: string;
                            employee_min?: number;
                            employee_max?: number;
                            linkedin_employee_count?: number;
                            revenue_range?: string;
                            revenue_min?: string;
                            revenue_max?: string;
                            hq_country?: string;
                            hq_country_code?: string;
                            hq_city?: string;
                            hq_state?: string;
                            hq_street?: string | null;
                            hq_postcode?: string | null;
                            hq_region?: string;
                            hq_continent?: string | null;
                            /** @description Compatibility alias populated from headquarters data, not office presence. */
                            location_city?: string | null;
                            /** @description Compatibility alias populated from headquarters data, not office presence. */
                            location_country_code?: string | null;
                            /** @description Compatibility alias populated from headquarters data, not office presence. */
                            location_region?: string | null;
                            /** @description Compatibility alias populated from headquarters data, not office presence. */
                            location_state_code?: string | null;
                            founded_year?: number | null;
                            specialties?: string | null;
                            total_funding?: number | null;
                            funding_investor_count?: number | null;
                            last_funding_type?: string | null;
                            last_funding_date?: string | null;
                            last_funding_amount?: number | null;
                            /** @description Not returned in standard company search responses. */
                            lead_investors?: string | null;
                            /** @description Unavailable in current discovery data; returned as null. */
                            linkedin_followers?: number | null;
                            /** @description Unavailable in current discovery data; returned as null. */
                            growth_rate?: number | null;
                            linkedin_url?: string | null;
                            linkedin_claimed?: boolean;
                            company_headline?: string | null;
                            company_about?: string | null;
                            company_entity_type?: string | null;
                            company_legal_type?: string | null;
                            has_tech_stack?: boolean;
                            total_contacts?: number;
                            sic_code?: string | null;
                            naics_code?: string | null;
                            sic_description?: string | null;
                            naics_description?: string | null;
                            predicted_naics_2022_code?: string | null;
                            domain_tld?: string;
                            total_app_reviews?: number;
                            crm_tech?: string | null;
                            marketing_automation_tech?: string | null;
                            sales_automation_tech?: string | null;
                            analytics_tech?: string | null;
                            cloud_provider_tech?: string | null;
                            development_tech?: string | null;
                            ecommerce_tech?: string | null;
                            erp_tech?: string | null;
                            email_hosting_tech?: string | null;
                            email_security_tech?: string | null;
                            abm_tech?: string | null;
                            cms_tech?: string | null;
                            conversation_intelligence_tech?: string | null;
                            app_security_tech?: string | null;
                            cloud_security_tech?: string | null;
                            company_martech?: string | null;
                            category?: string[];
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @description Present for one-company lookup requests. */
                        found?: boolean;
                        /** @description Present for one-company lookup requests. Contains the first returned company row. */
                        company?: {
                            [key: string]: unknown;
                        } | null;
                        /** @description Present for one-company lookup requests. Alias for company.company_name. */
                        companyName?: string | null;
                        /** @description Present for one-company lookup requests. Alias for company.company_domain. */
                        companyDomain?: string | null;
                        /** @description Present for one-company lookup requests. Alias for company.company_website. */
                        websiteUrl?: string | null;
                        /** @description Present for one-company lookup requests. Alias for company.linkedin_url. */
                        linkedinUrl?: string | null;
                        /** @description Number of companies returned in this page, not total audience size. */
                        count?: number;
                        /** @description Number of companies returned in this page. */
                        returned_count?: number;
                        /** @description Qualified keys of selected criteria that were not applied. */
                        ignored_filters?: string[];
                        /** @description Explanations of unavailable or unapplied criteria. */
                        warnings?: string[];
                        limit_applied?: number;
                        offset?: number;
                        has_more?: boolean;
                        /** @description Opaque signed token for the next page, or null on the last page. Send back as cursor with offset 0. Cursor pagination is stable and cached. */
                        next_cursor?: string | null;
                        interpreted_search?: {
                            [key: string]: unknown;
                        };
                        metadata?: {
                            /**
                             * @description snapshot/cursor for cursor/first-page responses; offset for legacy offset responses.
                             * @enum {string}
                             */
                            pagination?: "snapshot" | "cursor" | "offset";
                        } & {
                            [key: string]: unknown;
                        };
                    } & {
                        [key: string]: unknown;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            429: components["responses"]["RateLimitExceeded"];
        };
    };
    "company-lookalike-v3": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "company_domain": "leadmagic.io",
                 *       "company_filters": {
                 *         "country_codes": [
                 *           "US"
                 *         ],
                 *         "employee_ranges": [
                 *           "51 to 200",
                 *           "201 to 500"
                 *         ],
                 *         "crm_tech": [
                 *           "Salesforce"
                 *         ],
                 *         "has_tech_stack": true
                 *       },
                 *       "limit": 25
                 *     }
                 */
                "application/json": {
                    /**
                     * @description Seed company domain. Aliases include domain, website, company_website, seed.domain. Typos like companny_domain are remapped.
                     * @example leadmagic.io
                     */
                    company_domain?: string;
                    /** @description Alias for company_domain. */
                    domain?: string;
                    /** @description Seed website URL or domain. */
                    website?: string;
                    /** @description Alias for website. */
                    company_website?: string;
                    /** @description Seed company name used as text intent when no domain is supplied. */
                    company_name?: string;
                    /** @description Alias for company_name. */
                    name?: string;
                    /** @description Free-text seed description. */
                    description?: string;
                    /** @description Alias for description. */
                    company_description?: string;
                    /** @description Optional seed object. Prefer seed.domain. */
                    seed?: {
                        [key: string]: unknown;
                    };
                    /** @description Subset of the Company Search filters: HQ country_codes, employee_ranges, min/max_employees, revenue_ranges, min/max_revenue, industries, sic_codes, naics_codes, founded_after/before, has_funding, min/max_total_funding, has_tech_stack, tech_stack, and the *_tech technographic columns. Follower-count and growth bounds are unsupported. Other Company Search filters (e.g. presence location_country_codes, hq_city) are echoed in interpreted_search but not applied. Check ignored_filters and warnings. Alias filters. */
                    company_filters?: {
                        [key: string]: unknown;
                    };
                    /** @description Alias for company_filters. */
                    filters?: {
                        [key: string]: unknown;
                    };
                    /**
                     * @description Free preview: chatbot UI only. API/MCP clients receive 400.
                     * @default false
                     */
                    preview?: boolean;
                    /**
                     * @description Page size. Pages hold at most 100 companies: values 101-2000 are clamped to 100 (metadata.limit_clamped, requested_limit, applied_limit, and a Warning header); values above 2000 return 400. Page with offset = metadata.next_offset. Typos like limmit are remapped.
                     * @default 25
                     */
                    limit?: number;
                    /**
                     * @description Offset into the similarity ranking (100, 200, …). Lookalike has no cursor. Deeper pages take longer.
                     * @default 0
                     */
                    offset?: number;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        responses: {
            /** @description Company lookalike results (flat JSON body: not wrapped in data) */
            200: {
                headers: {
                    /** @description Credits reserved before finalization (5) */
                    "X-Credits-Cost"?: number;
                    /** @description Credits actually charged (0 or 5) */
                    "X-Credits-Consumed"?: number;
                    /** @description Wallet credits remaining after this request */
                    "X-Credits-Remaining"?: number;
                    "X-Credits-Total"?: number;
                    "X-Request-Id"?: string;
                    "RateLimit-Remaining"?: number;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "message": "Lookalike companies found",
                     *       "credits_consumed": 5,
                     *       "companies": [
                     *         {
                     *           "company_domain": "tomba.io",
                     *           "company_name": "Tomba.Io",
                     *           "similarity": "0.8800"
                     *         }
                     *       ],
                     *       "count": 1,
                     *       "returned_count": 1,
                     *       "limit_applied": 25,
                     *       "offset": 0,
                     *       "interpreted_search": {
                     *         "seed": {
                     *           "domain": "leadmagic.io"
                     *         },
                     *         "company_filters": {}
                     *       },
                     *       "metadata": {
                     *         "query_name": "company_lookalike_v3",
                     *         "query_path": "lookalike",
                     *         "preview": false
                     *       }
                     *     }
                     */
                    "application/json": {
                        /**
                         * @description "Lookalike companies found", "No lookalike companies found", or a narrow-your-filters-or-retry message when metadata.degraded is true.
                         * @example Lookalike companies found
                         */
                        message: string;
                        /**
                         * @description Flat 5 when results returned; 0 when empty or degraded
                         * @example 5
                         */
                        credits_consumed: number;
                        companies: ({
                            company_domain?: string;
                            company_name?: string;
                            company_website?: string;
                            company_industry_linkedin?: string;
                            employee_range?: string;
                            employee_min?: number;
                            employee_max?: number;
                            linkedin_employee_count?: number;
                            revenue_range?: string;
                            revenue_min?: string;
                            revenue_max?: string;
                            hq_country?: string;
                            hq_country_code?: string;
                            hq_city?: string;
                            hq_state?: string;
                            /**
                             * @description Similarity score as a four-place decimal string between "0" and "1"
                             * @example 0.7801
                             */
                            similarity?: string;
                            source_seed_domain?: string;
                            /** @example https://logo.leadmagic.io/privy.io */
                            company_logo_url?: string;
                            lead_investors?: string;
                            growth_rate?: number;
                            category?: string[];
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @example 5 */
                        count: number;
                        /** @example 5 */
                        returned_count: number;
                        /** @example 25 */
                        limit_applied?: number;
                        /** @example 0 */
                        offset?: number;
                        /** @description Normalized seed and company_filters used for the query */
                        interpreted_search?: {
                            [key: string]: unknown;
                        };
                        metadata?: {
                            /** @example company_lookalike_v3 */
                            query_name?: string;
                            /** @example lookalike */
                            query_path?: string;
                            preview?: boolean;
                            /** @description True when this page came back full; request metadata.next_offset next */
                            has_more?: boolean;
                            /** @description Offset for the next page, or null when has_more is false */
                            next_offset?: number | null;
                            /** @description Present (true) when the requested limit exceeded the 100-row page */
                            limit_clamped?: boolean;
                            /** @description The limit sent, when clamped */
                            requested_limit?: number;
                            /** @description The page size used, when clamped */
                            applied_limit?: number;
                            /** @description True when upstream was unavailable or the query ran past its time budget; the response is empty and free */
                            degraded?: boolean;
                        } & {
                            [key: string]: unknown;
                        };
                    } & {
                        [key: string]: unknown;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            429: components["responses"]["RateLimitExceeded"];
        };
    };
    "jobs-finder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "company_website": "clay.com",
                 *       "job_title": "RevOps Engineer",
                 *       "country_id": "US",
                 *       "has_remote": true,
                 *       "posted_within": 30,
                 *       "page": 1,
                 *       "per_page": 20
                 *     }
                 */
                "application/json": {
                    /**
                     * @description Provide the Company Name. (Optional)
                     * @example Clay
                     */
                    company_name?: string;
                    /**
                     * @description Provide the Company Website. (Optional)
                     * @example clay.com
                     */
                    company_website?: string;
                    /**
                     * @description Provide the Job Title.
                     * @example RevOps Engineer
                     */
                    job_title?: string;
                    /**
                     * @description Location of the job
                     * @example United States
                     */
                    location?: string;
                    /**
                     * @description Indicates the required experience level for the job. Choose "entry" for Entry Level, "mid" for Mid Level, "senior" for Senior Level, or "executive" for Executive Level. If not specified, jobs from all experience levels will be included.
                     * @example senior
                     */
                    experience_level?: string;
                    /**
                     * @description Filters jobs based on specific keywords or phrases found in the job description. Results include each job's `description` only when this filter is sent.
                     * @example leadmagic
                     */
                    job_description?: string;
                    /**
                     * @description Filter jobs by city name. Pair with `country_id` to disambiguate cities that share a name.
                     * @example Austin
                     */
                    city_name?: string;
                    /**
                     * @description Filter jobs by country code, such as US or GB. Use the country helper for supported values.
                     * @example US
                     */
                    country_id?: string;
                    /**
                     * @description Filter jobs by region ID.
                     * @example 5
                     */
                    region_id?: number;
                    /**
                     * @description Filter jobs by job type ID.
                     * @example 1
                     */
                    job_type_id?: number;
                    /**
                     * @description Filter jobs by company type ID.
                     * @example 1
                     */
                    company_type_id?: number;
                    /**
                     * @description Filter jobs by company industry ID.
                     * @example 7
                     */
                    company_industry_id?: number;
                    /**
                     * @description Minimum company size. Size is recorded as a band (0-1, 2-10, 11-50, 51-200, 201-500, 501-1,000, 1,001-5,000, 5,001-10,000, 10,001+), so the bound selects every band it overlaps.
                     * @example 51
                     */
                    min_employees?: number;
                    /**
                     * @description Maximum company size, matched by size band in the same way as `min_employees`.
                     * @example 10000
                     */
                    max_employees?: number;
                    /**
                     * @description Determines whether the jobs offer remote work options. Set to true to include remote-only listings, or false to include non-remote listings.
                     * @example true
                     */
                    has_remote?: boolean;
                    /**
                     * @description Specify the number of days within which the job was posted.
                     * @example 30
                     */
                    posted_within?: number;
                    /**
                     * Format: date
                     * @description Filters jobs posted on or after a specific date. Use the format YYYY-MM-DD.
                     * @example 2026-05-01
                     */
                    posted_after?: string;
                    /**
                     * Format: date
                     * @description Filters jobs posted on or before a specific date. Use the format YYYY-MM-DD.
                     * @example 2026-05-15
                     */
                    posted_before?: string;
                    /**
                     * @description Page number
                     * @default 1
                     */
                    page?: number;
                    /**
                     * @description Provide number of results needed per page. (Maximum per_page can be 50)
                     * @default 20
                     */
                    per_page?: number;
                };
            };
        };
        responses: {
            /** @description Successful response with job listings */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @default 0 */
                        total_count: number;
                        /** @default 0 */
                        page: number;
                        /** @default 0 */
                        per_page: number;
                        /** @default 0 */
                        total_pages: number;
                        /** @default 0 */
                        credits_consumed: number;
                        results?: {
                            company?: {
                                /** @example LeadMagic */
                                name?: string;
                                /** @example https://leadmagic.io */
                                website_url?: string;
                                /** @example leadmagichq */
                                b2b_profile_url?: string | null;
                                /** @example leadmagichq */
                                twitter_handle?: string | null;
                                /** @example https://github.com/leadmagic */
                                github_url?: string | null;
                            };
                            title?: string;
                            location?: string;
                            types?: {
                                /** @default 0 */
                                id: number;
                                name?: string;
                            }[];
                            cities?: {
                                /** @default 0 */
                                geonameid: number;
                                asciiname?: string;
                                name?: string;
                            }[];
                            country?: Record<string, never>;
                            timezone?: string;
                            latitude?: string;
                            longitude?: string;
                            countries?: {
                                code?: string;
                                name?: string;
                            }[];
                            region?: Record<string, never>;
                            regions?: {
                                /** @default 0 */
                                id: number;
                                name?: string;
                            }[];
                            /** @default true */
                            has_remote: boolean;
                            published?: string;
                            description?: string;
                            application_url?: string;
                            language?: string | null;
                            /** @default true */
                            clearance_required: boolean;
                            salary_min?: string | null;
                            salary_max?: string | null;
                            salary_currency?: string | null;
                            experience_level?: string;
                        }[];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "local-leads-search-v3": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "country": "US",
                 *       "region_code": "TX",
                 *       "city": [
                 *         "Austin",
                 *         "Dallas"
                 *       ],
                 *       "category": "plumbing",
                 *       "has_email": true
                 *     }
                 */
                "application/json": {
                    /** @description Two-letter country code. Up to 5 per search. */
                    country?: string | string[];
                    /** @description State or region code, such as TX. Alias region. Needs country. */
                    region_code?: string | string[];
                    /** @description City name. Needs country. */
                    city?: string | string[];
                    /** @description Postal code. A 5-digit US ZIP also matches ZIP+4 listings. Needs country. */
                    postal_code?: string | string[];
                    /** @description Text contained in the street address. Needs country. */
                    street?: string;
                    /** @description Exact category name, from GET /v3/local-leads/categories. */
                    category?: string | string[];
                    /** @description Text contained in the category name. roof matches roofing. */
                    category_contains?: string | string[];
                    /** @description Broader category group, such as food_and_drink. */
                    category_group?: string | string[];
                    /** @description business, civic or place. */
                    kind?: string | string[];
                    /** @description Text contained in the business name. */
                    name?: string;
                    /** @description Website host. A bare host, a www. host or a URL. Alias domain. */
                    website_domain?: string | string[];
                    /** @description Domain of an email on the listing. */
                    email_domain?: string | string[];
                    /** @description An exact email address on the listing. */
                    email?: string;
                    /** @description A phone number in any format, 7 to 15 digits. Needs country. */
                    phone?: string;
                    has_email?: boolean;
                    /** @description An email on the business's own domain, not a free mailbox. */
                    has_business_email?: boolean;
                    has_phone?: boolean;
                    has_website?: boolean;
                    has_social?: boolean;
                    is_chain?: boolean;
                    min_confidence?: number;
                    /** @description high or medium. */
                    confidence_tier?: string | string[];
                    /** @description open, unknown, temporarily_closed or permanently_closed. */
                    operating_status?: string | string[];
                    /** @description True keeps open and unknown listings only. */
                    exclude_closed?: boolean;
                    /** @description Latitude of a point search. Send with lon. Results are nearest first. */
                    lat?: number;
                    /** @description Longitude of a point search. Send with lat. */
                    lon?: number;
                    /**
                     * @description Radius of a point search, in metres.
                     * @default 50000
                     */
                    radius_m?: number;
                    /**
                     * @description Not allowed with a point search.
                     * @default confidence
                     * @enum {string}
                     */
                    sort?: "confidence" | "name";
                    /** @description next_cursor from the previous page, sent with the same filters. */
                    cursor?: string;
                };
            };
        };
        responses: {
            /** @description One page of local leads (flat JSON body: not wrapped in data) */
            200: {
                headers: {
                    /** @description unmetered on Professional and Ultimate, metered on other plans */
                    "X-LeadMagic-Search-Tier"?: "unmetered" | "metered";
                    /** @description cold for a new search, hit when the stored result list was reused */
                    "X-LeadMagic-Search-Cache"?: "cold" | "hit";
                    /** @description Credits charged by this request (0 or 1) */
                    "X-Credits-Consumed"?: number;
                    /** @description Wallet credits remaining after this request */
                    "X-Credits-Remaining"?: number;
                    "X-RateLimit-RPS-Limit": components["headers"]["SearchRpsLimit"];
                    "X-RateLimit-RPS-Remaining": components["headers"]["SearchRpsRemaining"];
                    "X-Request-Id"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Local leads found */
                        message: string;
                        /**
                         * @description 0 on Professional and Ultimate, and 0 when the page was already paid for
                         * @example 1
                         */
                        credits_consumed: number;
                        /** @description Present when the page was first read by an earlier request */
                        credits_previously_consumed?: number;
                        leads: ({
                            /** @description Stable listing id. Use it to remove duplicates. */
                            id?: string;
                            name?: string;
                            /** @enum {string} */
                            kind?: "business" | "civic" | "place";
                            is_chain?: boolean;
                            /** @example plumbing */
                            category?: string;
                            /** @example services_and_business */
                            category_group?: string;
                            categories?: string[];
                            /** @description True when the category was read from the business name. */
                            category_inferred?: boolean;
                            street?: string;
                            city?: string;
                            region?: string;
                            region_code?: string;
                            postal_code?: string;
                            /** @example US */
                            country?: string;
                            lat?: number;
                            lon?: number;
                            /** @description Metres from the point. Point searches only. */
                            distance_m?: number;
                            /** @description Address fields filled in from neighbouring listings. */
                            filled?: string[];
                            phone?: string | null;
                            phones?: string[];
                            email?: string | null;
                            emails?: string[];
                            email_domain?: string;
                            website?: string | null;
                            website_domain?: string;
                            socials?: string[];
                            has_email?: boolean;
                            has_phone?: boolean;
                            has_website?: boolean;
                            has_social?: boolean;
                            has_business_email?: boolean;
                            /** @description 0 to 1 */
                            confidence?: number;
                            /** @enum {string} */
                            confidence_tier?: "high" | "medium";
                            /** @enum {string} */
                            operating_status?: "open" | "unknown" | "temporarily_closed" | "permanently_closed";
                        } & {
                            [key: string]: unknown;
                        })[];
                        /**
                         * @description Leads in this page
                         * @example 25
                         */
                        count: number;
                        /**
                         * @description Always 25
                         * @example 25
                         */
                        page_size: number;
                        /**
                         * @description Every listing the search matches; null when the count did not finish in time
                         * @example 20627
                         */
                        total?: number | null;
                        /** @description More pages remain in the stored result list */
                        has_more: boolean;
                        /** @description Send back as cursor for the next page; null on the last page */
                        next_cursor?: string | null;
                        /** @description The search matches more than the 1,000 leads it holds */
                        has_more_beyond_snapshot?: boolean;
                        /** @description This is the last page of the 1,000 and more listings exist */
                        snapshot_limit_reached?: boolean;
                        /** @description The filters as they were applied */
                        interpreted_search?: {
                            [key: string]: unknown;
                        };
                        metadata?: {
                            /** @example local_leads_search_v3 */
                            query_name?: string;
                            /** @example snapshot */
                            pagination?: string;
                            snapshot_id?: string;
                            snapshot_page_start?: number;
                            /** @enum {string} */
                            snapshot_cache_status?: "cold" | "hit";
                        } & {
                            [key: string]: unknown;
                        };
                    } & {
                        [key: string]: unknown;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            /** @description The cursor expired (restart_required) or the search is past its 1,000 leads (snapshot_limit_reached) */
            410: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            429: components["responses"]["RateLimitExceeded"];
            503: components["responses"]["ServiceUnavailable"];
        };
    };
    "local-leads-categories-v3": {
        parameters: {
            query?: {
                /**
                 * @description Two-letter country code. Comma-separate up to 5.
                 * @example US
                 */
                country?: string;
                /**
                 * @description Keep categories in one group. Comma-separate several.
                 * @example food_and_drink
                 */
                category_group?: string;
                /**
                 * @description Text contained in the category name.
                 * @example plumb
                 */
                q?: string;
                limit?: number;
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Categories with listing counts */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        results: {
                            /** @example plumbing */
                            category?: string;
                            /** @example services_and_business */
                            category_group?: string;
                            /**
                             * @description Listings in this category
                             * @example 38268
                             */
                            places?: number;
                        }[];
                        /** @example 1 */
                        count: number;
                        /** @example 0 */
                        credits_consumed?: number;
                    } & {
                        [key: string]: unknown;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    "job-search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "titles": {
                 *         "include": [
                 *           "Engineer"
                 *         ],
                 *         "vector": false
                 *       },
                 *       "occupationTaxonomy": {
                 *         "level2": [
                 *           "DevOps"
                 *         ]
                 *       },
                 *       "location": {
                 *         "countries": [
                 *           "US"
                 *         ]
                 *       },
                 *       "postedWithin": 30,
                 *       "limit": 5,
                 *       "totalMode": "none",
                 *       "mode": "fast",
                 *       "autoResolve": true
                 *     }
                 */
                "application/json": {
                    titles?: {
                        include?: string[];
                        exclude?: string[];
                        /** @default false */
                        vector?: boolean;
                    };
                    occupationTaxonomy?: {
                        level1?: (string | number)[];
                        level2?: (string | number)[];
                        level3?: (string | number)[];
                    };
                    companies?: {
                        include?: string[];
                        exclude?: string[];
                        ids?: number[];
                    };
                    location?: {
                        countries?: (string | number)[];
                        regions?: (string | number)[];
                        states?: (string | number)[];
                        cities?: (string | number)[];
                    };
                    tags?: {
                        include?: (string | number)[];
                        exclude?: (string | number)[];
                    };
                    salary?: {
                        min_usd?: number;
                        max_usd?: number;
                    };
                    seniority?: string[];
                    /** Format: date */
                    postedAfter?: string;
                    /** Format: date */
                    postedBefore?: string;
                    /** @description Include jobs posted within the last N days. */
                    postedWithin?: number;
                    languages?: string[];
                    hasRemote?: boolean;
                    jobTypeIds?: number[];
                    industryIds?: number[];
                    companyTypeIds?: number[];
                    companySizeCodes?: number[];
                    /** @default 25 */
                    limit?: number;
                    /** @description Opaque cursor from pagination.next_cursor. Send unchanged with the same filters and limit. */
                    cursor?: string;
                    /**
                     * @description Include job description text. Enabling descriptions may increase response time.
                     * @default false
                     */
                    includeDescription?: boolean;
                    /**
                     * @description Include facet metadata. Enabling facets may increase response time.
                     * @default false
                     */
                    includeFacets?: boolean;
                    /**
                     * @default capped
                     * @enum {string}
                     */
                    totalMode?: "none" | "capped" | "exact";
                    /**
                     * @description fast returns paginated browsing results when descriptions and facets are omitted; deep enables broader text matching.
                     * @default fast
                     * @enum {string}
                     */
                    mode?: "fast" | "deep";
                    /** @default true */
                    autoResolve?: boolean;
                };
            };
        };
        responses: {
            /** @description Job search results */
            200: {
                headers: {
                    "RateLimit-Limit": components["headers"]["RateLimitLimit"];
                    "RateLimit-Remaining": components["headers"]["RateLimitRemaining"];
                    "RateLimit-Reset": components["headers"]["RateLimitReset"];
                    "X-RateLimit-RPS-Limit": components["headers"]["SearchRpsLimit"];
                    "X-RateLimit-RPS-Remaining": components["headers"]["SearchRpsRemaining"];
                    "X-RateLimit-RPS-Reset": components["headers"]["SearchRpsReset"];
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "signals": [
                     *         {
                     *           "title": "Full-Stack Software Engineer",
                     *           "company": {
                     *             "id": 102413,
                     *             "name": "Example Company",
                     *             "website_url": "https://example.com"
                     *           },
                     *           "occupation_taxonomy": {
                     *             "level1": {
                     *               "id": 1,
                     *               "name": "Developer"
                     *             },
                     *             "level2": {
                     *               "id": 20,
                     *               "name": "Full-Stack Development"
                     *             },
                     *             "level3": {
                     *               "id": 774,
                     *               "name": "Full-stack software engineer"
                     *             }
                     *           }
                     *         }
                     *       ],
                     *       "total": 3,
                     *       "totalMode": "capped",
                     *       "credits_consumed": 1
                     *     }
                     */
                    "application/json": {
                        signals?: Record<string, never>[];
                        total?: number;
                        totalMode?: string;
                        pagination?: {
                            limit?: number;
                            returned?: number;
                            has_more?: boolean;
                            next_cursor?: string | null;
                        };
                        has_more?: boolean;
                        next_cursor?: string | null;
                        resolved?: Record<string, never>;
                        credits_consumed?: number;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            429: components["responses"]["RateLimitExceeded"];
            503: components["responses"]["ServiceUnavailable"];
        };
    };
    "search-stats-v3": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                /**
                 * @example {
                 *       "products": [
                 *         "jobs",
                 *         "company",
                 *         "people"
                 *       ],
                 *       "sections": [
                 *         "coverage",
                 *         "top"
                 *       ],
                 *       "limit": 10
                 *     }
                 */
                "application/json": {
                    /**
                     * @description Search products to include: jobs, company, and/or people stats.
                     * @default [
                     *       "jobs",
                     *       "company",
                     *       "people"
                     *     ]
                     */
                    products?: ("jobs" | "company" | "people")[];
                    /**
                     * @description Stat sections to return: coverage counts, top dimensions, and/or filter capabilities.
                     * @default [
                     *       "coverage",
                     *       "top",
                     *       "capabilities"
                     *     ]
                     */
                    sections?: ("coverage" | "top" | "capabilities")[];
                    /**
                     * @description Max top values per dimension. Defaults to 3.
                     * @default 3
                     */
                    limit?: number;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        responses: {
            /** @description Search stats results */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            429: components["responses"]["RateLimitExceeded"];
        };
    };
    "job-search-alias": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "titles": {
                 *         "include": [
                 *           "Software Engineer"
                 *         ],
                 *         "vector": false
                 *       },
                 *       "location": {
                 *         "countries": [
                 *           "US"
                 *         ]
                 *       },
                 *       "limit": 5,
                 *       "totalMode": "none",
                 *       "mode": "fast"
                 *     }
                 */
                "application/json": {
                    titles?: {
                        include?: string[];
                        /** @default false */
                        vector?: boolean;
                    };
                    location?: {
                        countries?: string[];
                    };
                    tags?: {
                        include?: string[];
                    };
                    /** @default 25 */
                    limit?: number;
                    /**
                     * @default capped
                     * @enum {string}
                     */
                    totalMode?: "none" | "capped" | "exact";
                    /**
                     * @default fast
                     * @enum {string}
                     */
                    mode?: "fast" | "deep";
                };
            };
        };
        responses: {
            /** @description Job search results */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "job-search-resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    companies?: {
                        include?: string[];
                        exclude?: string[];
                        ids?: number[];
                    };
                    tags?: {
                        include?: (string | number)[];
                        exclude?: (string | number)[];
                    };
                    occupationTaxonomy?: {
                        level1?: (string | number)[];
                        level2?: (string | number)[];
                        level3?: (string | number)[];
                    };
                    location?: {
                        countries?: (string | number)[];
                        regions?: (string | number)[];
                        states?: (string | number)[];
                        cities?: (string | number)[];
                    };
                    titles?: {
                        include?: string[];
                        exclude?: string[];
                    };
                };
            };
        };
        responses: {
            /** @description Resolved filters */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "job-search-companies": {
        parameters: {
            query?: {
                /** @example leadmagic */
                q?: string;
                /** @example leadmagic.io */
                domain?: string;
                /** @example 10 */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Company helper results */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "companies": [
                     *         {
                     *           "id": 102413,
                     *           "name": "LeadMagic",
                     *           "domain": "leadmagic.io",
                     *           "logo_domain": "leadmagic.io"
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    "job-search-tags": {
        parameters: {
            query?: {
                /** @example kuber */
                q?: string;
                /** @example 2 */
                tag_type?: number;
                /** @example 10 */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Tag helper results */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "tags": [
                     *         {
                     *           "id": 482,
                     *           "name": "kubernetes",
                     *           "tag_type": 2,
                     *           "occupation_taxonomy": {
                     *             "level1": {
                     *               "id": 1,
                     *               "name": "Developer"
                     *             },
                     *             "level2": {
                     *               "id": 20,
                     *               "name": "DevOps"
                     *             }
                     *           }
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    "job-search-titles": {
        parameters: {
            query?: {
                /** @example devops engineer */
                q?: string;
                /** @example 10 */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Title helper results */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "titles": [
                     *         {
                     *           "id": 774,
                     *           "name": "DevOps Engineer",
                     *           "occupation_taxonomy": {
                     *             "level1": {
                     *               "id": 1,
                     *               "name": "Developer"
                     *             },
                     *             "level2": {
                     *               "id": 20,
                     *               "name": "DevOps"
                     *             },
                     *             "level3": {
                     *               "id": 774,
                     *               "name": "DevOps Engineer"
                     *             }
                     *           }
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    "job-search-occupation-taxonomy": {
        parameters: {
            query?: {
                /** @example DevOps */
                q?: string;
                /** @example level2 */
                level?: "level1" | "level2" | "level3";
                /** @example 10 */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Occupation taxonomy helper results */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "occupation_taxonomy": [
                     *         {
                     *           "id": 1700834,
                     *           "name": ".NET & DevOps",
                     *           "type": 2,
                     *           "level1": {
                     *             "id": 7,
                     *             "name": "Engineer"
                     *           },
                     *           "level2": {
                     *             "id": 1700834,
                     *             "name": ".NET & DevOps"
                     *           },
                     *           "level3": null,
                     *           "path": "Engineer > .NET & DevOps"
                     *         }
                     *       ],
                     *       "credits_consumed": 0
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    "job-search-locations": {
        parameters: {
            query?: {
                /** @example United */
                q?: string;
                /** @example country */
                type?: "country" | "region" | "state" | "city";
                /** @example 10 */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Location helper results */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "locations": [
                     *         {
                     *           "id": 840,
                     *           "name": "United States",
                     *           "type": "country"
                     *         },
                     *         {
                     *           "id": 826,
                     *           "name": "United Kingdom",
                     *           "type": "country"
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    "job-search-catalogs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Catalog response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "countries": [
                     *         {
                     *           "id": 840,
                     *           "name": "United States"
                     *         },
                     *         {
                     *           "id": 826,
                     *           "name": "United Kingdom"
                     *         }
                     *       ],
                     *       "job_types": [
                     *         {
                     *           "id": 1,
                     *           "name": "Full-time"
                     *         },
                     *         {
                     *           "id": 2,
                     *           "name": "Part-time"
                     *         },
                     *         {
                     *           "id": 3,
                     *           "name": "Contract"
                     *         }
                     *       ],
                     *       "industries": [
                     *         {
                     *           "id": 96,
                     *           "name": "Software"
                     *         }
                     *       ],
                     *       "company_types": [
                     *         {
                     *           "id": 1,
                     *           "name": "Private"
                     *         },
                     *         {
                     *           "id": 2,
                     *           "name": "Public"
                     *         }
                     *       ],
                     *       "seniority": [
                     *         {
                     *           "id": 1,
                     *           "name": "Entry"
                     *         },
                     *         {
                     *           "id": 5,
                     *           "name": "VP"
                     *         }
                     *       ],
                     *       "stats": {
                     *         "total_jobs_indexed": 12500000,
                     *         "freshness_days": 1
                     *       }
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    "job-search-roles": {
        parameters: {
            query?: {
                /** @example revenue operations */
                q?: string;
                /** @example 10 */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Role helper results */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "roles": [
                     *         {
                     *           "id": 20,
                     *           "name": "Revenue Operations",
                     *           "occupation_taxonomy": {
                     *             "level1": {
                     *               "id": 5,
                     *               "name": "Operations"
                     *             },
                     *             "level2": {
                     *               "id": 20,
                     *               "name": "Revenue Operations"
                     *             }
                     *           }
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    "job-search-stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Dataset statistics */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "stats": {
                     *         "total_jobs_indexed": 12500000,
                     *         "freshness_days": 1
                     *       }
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    "job-board-stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Dataset statistics */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "stats": {
                     *         "total_jobs_indexed": 12500000,
                     *         "freshness_days": 1
                     *       }
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    "job-search-export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "titles": {
                 *         "include": [
                 *           "Software Engineer"
                 *         ]
                 *       },
                 *       "location": {
                 *         "countries": [
                 *           "US"
                 *         ]
                 *       },
                 *       "postedWithin": 30,
                 *       "limit": 500
                 *     }
                 */
                "application/json": {
                    /** @description Same title filters as Job Search, including include/exclude and vector. */
                    titles?: {
                        [key: string]: unknown;
                    };
                    companies?: {
                        [key: string]: unknown;
                    };
                    location?: {
                        [key: string]: unknown;
                    };
                    tags?: {
                        [key: string]: unknown;
                    };
                    occupationTaxonomy?: {
                        [key: string]: unknown;
                    };
                    salary?: {
                        [key: string]: unknown;
                    };
                    workModes?: number[];
                    /** @description Days back, max 365. */
                    postedWithin?: number;
                    /** @default true */
                    includeDescription?: boolean;
                    /** @default true */
                    includeCompany?: boolean;
                    /**
                     * @description Maximum jobs to export. Cursor pagination is not supported on export; narrow filters instead.
                     * @default 100
                     */
                    limit?: number;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        responses: {
            /** @description Exported jobs */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "jobs": [
                     *         {
                     *           "id": "j_01hxyz",
                     *           "title": "Software Engineer",
                     *           "company": {
                     *             "name": "Example Corp",
                     *             "domain": "example.com"
                     *           },
                     *           "location": "United States",
                     *           "posted_at": "2026-08-01",
                     *           "description": "Full posting text…"
                     *         }
                     *       ],
                     *       "total_returned": 500,
                     *       "credits_consumed": 500
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    "job-country": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response with country list */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        id?: string;
                        name?: string;
                    }[];
                };
            };
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "job-regions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response with region list */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @default 0 */
                        id: number;
                        name?: string;
                    }[];
                };
            };
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "job-types": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response with job type list */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @default 0 */
                        id: number;
                        name?: string;
                    }[];
                };
            };
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "job-company-types": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response with company type list */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @default 0 */
                        id: number;
                        name?: string;
                    }[];
                };
            };
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "job-industry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response with industry list */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @default 0 */
                        id: number;
                        name?: string;
                    }[];
                };
            };
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "google-ads-search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Company domain name
                     * @default leadmagic.io
                     * @example leadmagic.io
                     */
                    company_domain?: string;
                    /**
                     * @description Company name
                     * @default leadmagic
                     * @example leadmagic
                     */
                    company_name?: string;
                    /**
                     * @description Maximum number of ads to return. Because you are charged 1 credit per ad returned, this also caps the credits spent on the request. Omit to return every ad found.
                     * @example 10
                     */
                    limit?: number;
                };
            };
        };
        responses: {
            /** @description Successful response with ads details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Google Ads retrieved successfully */
                        message?: string;
                        /** @example 2 */
                        credits_consumed?: number;
                        /** @example 2 */
                        ads_count?: number;
                        ads?: {
                            /** @example 123456 */
                            advertiser_id?: string;
                            /** @example 789012 */
                            creative_id?: string;
                            /** @example https://www.example.com/ad */
                            original_url?: string;
                            variants?: {
                                /** @example <img src="https://tpc.googlesyndication.com/archive/simgad/6399633577457746150" height="173" width="380"> */
                                content?: string;
                                /** @example 173 */
                                height?: number | null;
                                /** @example 380 */
                                width?: number | null;
                            }[];
                            /** @example 2023-01-01 */
                            start?: string;
                            /** @example 2023-12-31 */
                            last_seen?: string;
                            /** @example Example Company */
                            advertiser_name?: string;
                            /** @example Text */
                            format?: string;
                        }[];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
            502: components["responses"]["BadGateway"];
            503: components["responses"]["ServiceUnavailable"];
        };
    };
    "meta-ads-search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Company domain name
                     * @default leadmagic.io
                     * @example leadmagic.io
                     */
                    company_domain?: string;
                    /**
                     * @description Company name
                     * @default leadmagic
                     * @example leadmagic
                     */
                    company_name?: string;
                    /**
                     * @description Maximum number of ads to return. Because you are charged 1 credit per ad returned, this also caps the credits spent on the request. Omit to return every ad found.
                     * @example 10
                     */
                    limit?: number;
                };
            };
        };
        responses: {
            /** @description Successful response with ads details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Meta Ads retrieved successfully */
                        message?: string;
                        /** @example 1 */
                        credits_consumed?: number;
                        /** @example 1 */
                        ads_count?: number;
                        /** @description Array of ad objects (structure varies by ad type) */
                        ads?: Record<string, never>[];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
            502: components["responses"]["BadGateway"];
            503: components["responses"]["ServiceUnavailable"];
        };
    };
    "b2b-ads-search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Company domain name
                     * @default gong.io
                     * @example gong.io
                     */
                    company_domain?: string;
                    /**
                     * @description Company name
                     * @default gong
                     * @example gong
                     */
                    company_name?: string;
                    /**
                     * @description Maximum number of ads to return. Because you are charged 1 credit per ad returned, this also caps the per-ad credits spent on the request; the 1 base credit per search still applies. Omit to return every ad found.
                     * @example 10
                     */
                    limit?: number;
                };
            };
        };
        responses: {
            /** @description Successful response with ads details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example B2B ads found for the given company. */
                        message?: string;
                        /** @example 25 */
                        credits_consumed?: number;
                        /** @example 24 */
                        ads_count?: number;
                        company?: {
                            name?: string | null;
                            domain?: string | null;
                            industry?: string | null;
                            company_size?: string | null;
                            /** @description B2B company profile URL (/company/{slug}) */
                            linkedin_url?: string | null;
                            logo_url?: string | null;
                            city?: string | null;
                            state?: string | null;
                            country?: string | null;
                        };
                        ads?: {
                            ad_id?: string;
                            headline?: string | null;
                            description?: string | null;
                            content?: string;
                            link?: string;
                            ad_url?: string;
                            image_url?: string | null;
                            carousel_images?: string[];
                            ad_type?: string | null;
                            creative_type?: string | null;
                            advertiser?: string | null;
                            /** @description Advertiser B2B company profile URL (/company/{slug}) */
                            advertiser_linkedin_url?: string | null;
                            cta_text?: string | null;
                            landing_page_url?: string | null;
                        }[];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
            502: components["responses"]["BadGateway"];
            503: components["responses"]["ServiceUnavailable"];
        };
    };
    "b2b-ad-details": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description B2B ad library URL, path (/ad-library/detail/{id}), or numeric ad ID
                     * @example 1436673673
                     */
                    ad_url: string;
                };
            };
        };
        responses: {
            /** @description Successful response with ad details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Ad details retrieved successfully */
                        message?: string;
                        /** @example 2 */
                        credits_consumed?: number;
                        company?: {
                            name?: string | null;
                            domain?: string | null;
                            industry?: string | null;
                            company_size?: string | null;
                            linkedin_url?: string | null;
                            logo_url?: string | null;
                            city?: string | null;
                            state?: string | null;
                            country?: string | null;
                        };
                        /** @description Normalized ad object (same shape as B2B Ads Search) plus raw source payload */
                        ad_details?: {
                            ad_id?: string;
                            headline?: string | null;
                            description?: string | null;
                            content?: string;
                            link?: string;
                            ad_url?: string;
                            ad_type?: string | null;
                            creative_type?: string | null;
                            advertiser?: string | null;
                            advertiser_linkedin_url?: string | null;
                            cta_text?: string | null;
                            landing_page_url?: string | null;
                            image_url?: string | null;
                            carousel_images?: string[];
                            video_url?: string | null;
                            targeting?: Record<string, never> | null;
                            total_impressions?: string | null;
                            impressions_by_country?: unknown[];
                            message_ad?: Record<string, never> | null;
                            /** @description Original ad payload for unmapped fields */
                            raw?: Record<string, never>;
                        };
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
            502: components["responses"]["BadGateway"];
            503: components["responses"]["ServiceUnavailable"];
        };
    };
    "bulk-submit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "product": "email_finder",
                 *       "rows": [
                 *         {
                 *           "profile_url": "https://www.linkedin.com/in/jane-doe",
                 *           "company_name": "LeadMagic"
                 *         }
                 *       ],
                 *       "callback": {
                 *         "url": "https://hooks.example.com/leadmagic/bulk",
                 *         "events": [
                 *           "completed"
                 *         ]
                 *       }
                 *     }
                 */
                "application/json": components["schemas"]["BulkSubmissionRequest"];
            };
        };
        responses: {
            /** @description Bulk job accepted and queued for processing. */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BulkSubmissionResponse"];
                };
            };
            /** @description Bad request. The request body failed validation, or a provided URL failed SSRF validation (SSRF_VALIDATION_FAILED). */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["responses"]["BadRequest"];
                };
            };
            401: components["responses"]["Unauthorized"];
            402: components["responses"]["PaymentRequired"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "bulk-job-list": {
        parameters: {
            query?: {
                /** @description Filter jobs by current status. */
                status?: string;
                /** @description Filter jobs by enrichment product. */
                product?: string;
                /** @description Number of jobs per page. */
                limit?: number;
                /** @description Number of jobs to skip. */
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated list of bulk jobs. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobsListResponse"];
                };
            };
            401: components["responses"]["Unauthorized"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "bulk-job-status": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description UUID identifier of the bulk job.
                 * @example a1b2c3d4-e5f6-7890-abcd-ef1234567890
                 */
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Current status of the requested bulk job. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "job_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                     *       "status": "processing",
                     *       "products": [
                     *         "email_finder"
                     *       ],
                     *       "submission_product": "email_finder",
                     *       "submission_endpoint": null,
                     *       "execution_mode": null,
                     *       "total_rows": 5000,
                     *       "processed_items": 2125,
                     *       "succeeded_items": 2080,
                     *       "failed_items": 45,
                     *       "skipped_items": 0,
                     *       "total_credits_consumed": "2080.00",
                     *       "total_duration_ms": null,
                     *       "created_at": "2026-07-09 14:30:00 UTC",
                     *       "started_at": "2026-07-09 14:30:05 UTC",
                     *       "completed_at": null,
                     *       "last_progress_at": "2026-07-09 14:35:12 UTC",
                     *       "file_name": "q3-contacts.csv",
                     *       "callback_url": "https://hooks.example.com/leadmagic/bulk",
                     *       "callback_event": "completed",
                     *       "priority": 0,
                     *       "output_transform": null,
                     *       "links": {
                     *         "statusUrl": "https://api.leadmagic.io/bulk/jobs/a1b2c3d4-e5f6-7890-abcd-ef1234567890?token=...",
                     *         "streamUrl": "https://api.leadmagic.io/bulk/jobs/a1b2c3d4-e5f6-7890-abcd-ef1234567890/stream?token=...",
                     *         "wsUrl": "wss://api.leadmagic.io/bulk/jobs/a1b2c3d4-e5f6-7890-abcd-ef1234567890/ws?token=...",
                     *         "resultsUrl": "https://api.leadmagic.io/bulk/jobs/a1b2c3d4-e5f6-7890-abcd-ef1234567890/results?token=...",
                     *         "rowsUrl": "https://api.leadmagic.io/bulk/jobs/a1b2c3d4-e5f6-7890-abcd-ef1234567890/rows?token=...",
                     *         "errorsUrl": "https://api.leadmagic.io/bulk/jobs/a1b2c3d4-e5f6-7890-abcd-ef1234567890/errors?token=...",
                     *         "eventsUrl": "https://api.leadmagic.io/bulk/jobs/a1b2c3d4-e5f6-7890-abcd-ef1234567890/events?token=...",
                     *         "eventsExportUrl": "https://api.leadmagic.io/bulk/jobs/a1b2c3d4-e5f6-7890-abcd-ef1234567890/events/export?token=...",
                     *         "logsUrl": "https://api.leadmagic.io/bulk/jobs/a1b2c3d4-e5f6-7890-abcd-ef1234567890/logs?token=...",
                     *         "downloadUrl": "https://api.leadmagic.io/bulk/jobs/a1b2c3d4-e5f6-7890-abcd-ef1234567890/download?token=...",
                     *         "progressUrl": "https://api.leadmagic.io/bulk/jobs/a1b2c3d4-e5f6-7890-abcd-ef1234567890/progress?token=...",
                     *         "token": "prt_abc123...",
                     *         "exp": 1752259200
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["JobDetailResponse"];
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "bulk-job-review": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description UUID identifier of the bulk job.
                 * @example a1b2c3d4-e5f6-7890-abcd-ef1234567890
                 */
                jobId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "action": "reject"
                 *     }
                 */
                "application/json": {
                    /** @enum {string} */
                    action: "approve" | "reject";
                };
            };
        };
        responses: {
            /** @description Review action confirmed. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReviewResponse"];
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "bulk-job-results": {
        parameters: {
            query?: {
                limit?: number;
                offset?: number;
                /** @description Filter rows by status. */
                status?: string;
            };
            header?: never;
            path: {
                /** @description UUID identifier of the bulk job. */
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated row results. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobRowsResponse"];
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "bulk-job-download": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description UUID identifier of the bulk job. */
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description CSV stream. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/csv": string;
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "bulk-capabilities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Bulk capability manifest. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "bulk-validate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BulkSubmissionRequest"];
            };
        };
        responses: {
            /** @description Validation result. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    "bulk-local-leads": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Business types to search (max 25). Each keyword runs once per location; duplicates are charged once.
                     * @example [
                     *       "plumber",
                     *       "hvac contractor"
                     *     ]
                     */
                    keywords: string[];
                    /**
                     * @description Locations to search (max 100): city names ("Austin", "Austin, TX", "Toronto") or US ZIP codes ("78704"). ZIPs resolve to their city; unrecognized ZIPs and non-US postal codes return 400. Outside the US, use the city name and set the country with countryCodes.
                     * @example [
                     *       "Austin, TX",
                     *       "75201"
                     *     ]
                     */
                    cities: string[];
                    /**
                     * @description Two-letter country codes aligned by index with `cities`, or a single code applied to every city. Defaults to `US`.
                     * @example [
                     *       "US"
                     *     ]
                     */
                    countryCodes?: string[];
                    /**
                     * @description Label for the resulting job, shown in the dashboard.
                     * @example texas-trades
                     */
                    fileName?: string;
                    /** @description Return the resolved searches, `creditsRequired`, and remaining daily capacity without charging or queueing. */
                    dryRun?: boolean;
                    /** @description Promotional key that waives credit charges when valid. */
                    magicKey?: string;
                };
            };
        };
        responses: {
            /** @description Dry-run preview (only when `dryRun` is true). Nothing is charged. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "dryRun": true,
                     *       "totalSearches": 2,
                     *       "creditsPerSearch": 200,
                     *       "creditsRequired": 400,
                     *       "locations": [
                     *         {
                     *           "input": "78704",
                     *           "resolved": "Austin, TX",
                     *           "country": "US"
                     *         }
                     *       ],
                     *       "fitsCapacity": true
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            /** @description Local-leads job accepted and credits charged. */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "jobId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                     *       "product": "local_leads_finder",
                     *       "totalSearches": 2,
                     *       "status": "processing",
                     *       "position": 0,
                     *       "creditsCharged": 400,
                     *       "locations": [
                     *         {
                     *           "input": "78704",
                     *           "resolved": "Austin, TX",
                     *           "country": "US"
                     *         },
                     *         {
                     *           "input": "Winston-Salem, NC",
                     *           "resolved": "Winston, NC",
                     *           "country": "US"
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        /** Format: uuid */
                        jobId: string;
                        /** @example local_leads_finder */
                        product: string;
                        /** @description Unique keyword × location searches in the job. */
                        totalSearches: number;
                        /** @enum {string} */
                        status: "processing" | "queued";
                        /** @description Queue position when status is queued. */
                        position?: number;
                        /** @description Credits charged up front (totalSearches × 200, or 0 with a valid magic key). */
                        creditsCharged: number;
                        /** @description Each input location with the value that was searched. */
                        locations: {
                            input?: string;
                            resolved?: string;
                            country?: string;
                        }[];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            /** @description Not enough credits for the search grid. Nothing was queued. */
            402: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The run exceeds today's remaining Local Leads capacity (`local_leads_capacity`). Nothing was charged; retry later or with fewer searches. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "bulk-job-progress": {
        parameters: {
            query: {
                /** @description UUID identifier of the bulk job. */
                jobId: string;
                /** @description Signed progress token returned as `token` when the job was submitted. */
                token: string;
                /** @description Token expiry (Unix seconds) returned as `exp` when the job was submitted. */
                exp: number;
                /** @description Token subject embedded in the submitted `progressUrl`. Required for current tokens; omitted only by legacy web-app tokens. */
                subject?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Lightweight progress snapshot. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "jobId": "8ad9bffd-bbcd-4561-b5fe-b222a2c6f998",
                     *       "status": "completed",
                     *       "totalShards": 1,
                     *       "completedShards": 1,
                     *       "succeeded": 1,
                     *       "failed": 0,
                     *       "skipped": 0,
                     *       "creditsConsumed": 0.13,
                     *       "pipelineStep": 1,
                     *       "pipelineTotal": 1
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    "bulk-job-errors": {
        parameters: {
            query?: {
                /** @description Rows to return per page. */
                limit?: number;
                /** @description Zero-based row offset for pagination. */
                offset?: number;
                /** @description Filter failed rows by status. */
                status?: string;
            };
            header?: never;
            path: {
                /**
                 * @description UUID identifier of the bulk job.
                 * @example a1b2c3d4-e5f6-7890-abcd-ef1234567890
                 */
                jobId: components["parameters"]["BulkJobId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated failed rows. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "rows": [
                     *         {
                     *           "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
                     *           "row_index": 42,
                     *           "status": "failed",
                     *           "lm_input": {
                     *             "email": "invalid-format"
                     *           },
                     *           "lm_output": null,
                     *           "error_message": "Invalid email format: invalid-format",
                     *           "http_status_code": 422,
                     *           "response_time_ms": 45,
                     *           "completed_at": "2026-07-09 14:30:06 UTC"
                     *         }
                     *       ],
                     *       "limit": 100,
                     *       "offset": 0
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    "bulk-job-events": {
        parameters: {
            query?: {
                /** @description Events to return, newest first. */
                limit?: number;
            };
            header?: never;
            path: {
                /**
                 * @description UUID identifier of the bulk job.
                 * @example a1b2c3d4-e5f6-7890-abcd-ef1234567890
                 */
                jobId: components["parameters"]["BulkJobId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated job events. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "events": [
                     *         {
                     *           "event_id": "e1f2g3h4-i5j6-7890-k1mn-opqrstuvwxyz",
                     *           "job_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                     *           "event_type": "row.failed",
                     *           "source": "queue-consumer",
                     *           "level": "error",
                     *           "message": "Row 42 failed: Invalid email format",
                     *           "stage": "enrichment",
                     *           "status": "processing",
                     *           "details": {
                     *             "row_index": 42,
                     *             "error": "Invalid email format",
                     *             "http_status_code": 422
                     *           },
                     *           "created_at": "2026-07-09 14:30:06 UTC"
                     *         }
                     *       ],
                     *       "limit": 50
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    "bulk-job-stream": {
        parameters: {
            query?: {
                token?: string;
            };
            header?: never;
            path: {
                /**
                 * @description UUID identifier of the bulk job.
                 * @example a1b2c3d4-e5f6-7890-abcd-ef1234567890
                 */
                jobId: components["parameters"]["BulkJobId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Server-sent event stream. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/event-stream": string;
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    "bulk-job-pause": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description UUID identifier of the bulk job.
                 * @example a1b2c3d4-e5f6-7890-abcd-ef1234567890
                 */
                jobId: components["parameters"]["BulkJobId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Job paused. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    "bulk-job-resume": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description UUID identifier of the bulk job.
                 * @example a1b2c3d4-e5f6-7890-abcd-ef1234567890
                 */
                jobId: components["parameters"]["BulkJobId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Job resumed. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    "bulk-job-restart": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description UUID identifier of the bulk job.
                 * @example a1b2c3d4-e5f6-7890-abcd-ef1234567890
                 */
                jobId: components["parameters"]["BulkJobId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /**
                     * @description Which rows to reprocess.
                     * @default full
                     * @enum {string}
                     */
                    mode?: "full" | "failed_only" | "from_row" | "from_shard";
                    /** @description Zero-based row to restart from. Required when `mode` is `from_row`. */
                    startRowIndex?: number;
                    /** @description Zero-based shard to restart from. Required when `mode` is `from_shard`. */
                    startShardIndex?: number;
                };
            };
        };
        responses: {
            /** @description Restart accepted. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "jobId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                     *       "restarted": true,
                     *       "newJobId": null,
                     *       "mode": "failed_only",
                     *       "started": false,
                     *       "position": 1
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    "bulk-job-priority": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description UUID identifier of the bulk job.
                 * @example a1b2c3d4-e5f6-7890-abcd-ef1234567890
                 */
                jobId: components["parameters"]["BulkJobId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Integer priority from -1000 to 1000. Jobs start at 0. Strings such as `"low"` are rejected with 400.
                     * @example 10
                     */
                    priority: number;
                };
            };
        };
        responses: {
            /** @description Priority updated. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "jobId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                     *       "priority": 100
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    "batch-list": {
        parameters: {
            query?: {
                product?: string;
                status?: string;
                client_id?: string;
                limit?: number;
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated batch list. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "batch-submit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Batch items. Each item carries `product` (required for mixed-product batches), `input`, and optional `client_id`, `client_name`, and `metadata`. */
                    items: {
                        /**
                         * @description Product to run this item against.
                         * @example email_validation
                         */
                        product?: string;
                        /**
                         * @description Product-specific input fields.
                         * @example {
                         *       "email": "alex.rivera@example.com"
                         *     }
                         */
                        input?: Record<string, never>;
                        client_id?: string;
                        client_name?: string;
                        metadata?: Record<string, never>;
                    }[];
                    /** @description Submitting the same key twice returns the original batch instead of creating a duplicate. */
                    idempotencyKey?: string;
                    /** @description Arbitrary metadata stored with the batch. */
                    metadata?: Record<string, never>;
                    /** @description Associate the whole batch with a client record. */
                    client_id?: string;
                    /** @description Client name recorded alongside the batch. */
                    client_name?: string;
                    /** @description Charge the batch against this member's credit budget. */
                    budget_user_id?: string;
                    /**
                     * Format: uri
                     * @description HTTPS URL notified when the batch completes. SSRF-validated: must resolve to a public IP.
                     */
                    webhook_url?: string;
                    /**
                     * @description Queue priority for this batch.
                     * @enum {string}
                     */
                    priority?: "normal" | "low";
                };
            };
        };
        responses: {
            /** @description Batch accepted. */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "batchId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                     *       "status": "accepted",
                     *       "items_count": 2
                     *     }
                     */
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    "batch-status": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Identifier of the batch returned when it was submitted.
                 * @example b1c2d3e4-f5a6-7890-bcde-f12345678901
                 */
                batchId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Batch status. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    "batch-update": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Enrichment product slug, e.g. `email-finder`. Hyphens and underscores are both accepted.
                 * @example email-finder
                 */
                product: string;
                /**
                 * @description Identifier of the batch returned when it was submitted.
                 * @example b1c2d3e4-f5a6-7890-bcde-f12345678901
                 */
                batchId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    metadata?: {
                        [key: string]: unknown;
                    };
                    client_id?: string;
                };
            };
        };
        responses: {
            /** @description Updated batch. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    "batch-campaign-metrics": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Campaign identifier used to group related batches.
                 * @example c1d2e3f4-a5b6-7890-cdef-123456789012
                 */
                campaignId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Campaign metrics. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    "batch-client-list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Client list. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "batch-client-create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Unique client identifier (slug). Lowercase, alphanumeric with hyphens.
                     * @example acme-corp
                     */
                    name: string;
                    /**
                     * @description Human-readable display name.
                     * @example Acme Corporation
                     */
                    display_name?: string;
                    /**
                     * Format: email
                     * @description Contact email for notifications.
                     */
                    contact_email?: string;
                    /** @description Optional billing rate applied to this client. */
                    billing_rate?: number;
                    /** @description Internal notes. */
                    notes?: string;
                    /** @description Industry classification. */
                    industry?: string;
                    /** @description Client website. */
                    website?: string;
                    /** @description Phone number. */
                    phone?: string;
                    /** @description Physical address object. */
                    address?: Record<string, never>;
                    /** @description Arbitrary custom fields stored with the client. */
                    custom_fields?: Record<string, never>;
                };
            };
        };
        responses: {
            /** @description Client created. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    "batch-client-metrics": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description UUID of the client record, returned when the client was created.
                 * @example d1e2f3a4-b5c6-7890-def1-234567890123
                 */
                clientId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Client metrics. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    "batch-client-webhook-list": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description UUID of the client record, returned when the client was created.
                 * @example d1e2f3a4-b5c6-7890-def1-234567890123
                 */
                clientId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Client webhook list. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "batch-client-webhook-create": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description UUID of the client record, returned when the client was created.
                 * @example d1e2f3a4-b5c6-7890-def1-234567890123
                 */
                clientId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    [key: string]: unknown;
                };
            };
        };
        responses: {
            /** @description Webhook created. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    "batch-provider-list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Provider list with credentials redacted. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "batch-provider-create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Display name for the provider.
                     * @example acme-enrichment
                     */
                    name: string;
                    /**
                     * Format: uri
                     * @description HTTPS endpoint to call. Private IP addresses are rejected.
                     * @example https://api.acme.com/enrich
                     */
                    baseUrl: string;
                    /**
                     * @description How the credential is presented to the provider.
                     * @enum {string}
                     */
                    authType: "api_key" | "bearer" | "header";
                    /**
                     * @description Header or parameter name carrying the credential.
                     * @example X-API-Key
                     */
                    authCredentialName: string;
                    /** @description Credential value. Redacted in every response. */
                    authCredentialValue: string;
                    /**
                     * @description HTTP method used for provider calls.
                     * @enum {string}
                     */
                    defaultMethod?: "GET" | "POST";
                    /** @description Extra headers sent with every provider call. */
                    defaultHeaders?: Record<string, never>;
                    /** @description Requests per minute ceiling for this provider. */
                    rateLimitRpm?: number;
                    /** @description Maps provider response fields onto LeadMagic output columns. */
                    responseMapping?: Record<string, never>;
                    /**
                     * Format: uri
                     * @description URL polled to determine provider health.
                     */
                    healthCheckUrl?: string;
                    /**
                     * @description HTTP status treated as healthy.
                     * @example 200
                     */
                    healthCheckExpectedStatus?: number;
                };
            };
        };
        responses: {
            /** @description Provider created with credentials redacted. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    "preview-cost-mixed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "items": [
                 *         {
                 *           "product": "email_finder",
                 *           "input": {
                 *             "profile_url": "https://www.linkedin.com/in/jane-doe"
                 *           }
                 *         }
                 *       ],
                 *       "budget_user_id": "user_abc123"
                 *     }
                 */
                "application/json": components["schemas"]["PreviewCostRequest"];
            };
        };
        responses: {
            /** @description Cost estimate returned (no credits consumed). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PreviewCostResponse"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            429: components["responses"]["RateLimitExceeded"];
            500: components["responses"]["InternalServerError"];
        };
    };
    "list-budgets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of budgets. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Budget"][];
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "create-budget": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "scope": "user",
                 *       "scope_value": "user_abc123",
                 *       "max_credits": 10000,
                 *       "period": "monthly",
                 *       "alert_threshold_pct": 0.8,
                 *       "alert_email": "ops@example.com"
                 *     }
                 */
                "application/json": {
                    scope: string;
                    scope_value: string;
                    max_credits: number;
                    period?: string;
                    alert_threshold_pct?: number;
                    /** Format: email */
                    alert_email?: string;
                };
            };
        };
        responses: {
            /** @description Budget created. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Budget"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            429: components["responses"]["RateLimitExceeded"];
        };
    };
    "budget-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Budget consumption status. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BudgetStatus"][];
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "delete-budget": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Identifier of the credit budget.
                 * @example bg_4a7d2e9c1f60
                 */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Budget deleted. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    "update-budget": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Identifier of the credit budget.
                 * @example bg_4a7d2e9c1f60
                 */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    max_credits?: number;
                    period?: string;
                    alert_threshold_pct?: number;
                    alert_email?: string;
                };
            };
        };
        responses: {
            /** @description Updated budget. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Budget"];
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
        };
    };
    "list-suppression-lists": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of suppression lists. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuppressionList"][];
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "create-suppression-list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "list_id": "bounced-2026-q3",
                 *       "emails": [
                 *         "bounced1@example.com"
                 *       ]
                 *     }
                 */
                "application/json": {
                    list_id: string;
                    emails: string[];
                };
            };
        };
        responses: {
            /** @description Suppression list created. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuppressionList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    "get-suppression-list": {
        parameters: {
            query?: {
                limit?: number;
                offset?: number;
            };
            header?: never;
            path: {
                /**
                 * @description Identifier of the suppression list.
                 * @example sl_9f2c1d7e4b8a
                 */
                listId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List details with paginated hashes. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuppressionList"];
                };
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "delete-suppression-list": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Identifier of the suppression list.
                 * @example sl_9f2c1d7e4b8a
                 */
                listId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List deleted. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["Unauthorized"];
        };
    };
    "add-suppression-emails": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Identifier of the suppression list.
                 * @example sl_9f2c1d7e4b8a
                 */
                listId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    emails: string[];
                };
            };
        };
        responses: {
            /** @description Emails added. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
    "remove-suppression-emails": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Identifier of the suppression list.
                 * @example sl_9f2c1d7e4b8a
                 */
                listId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    emails: string[];
                };
            };
        };
        responses: {
            /** @description Emails removed. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
        };
    };
}
