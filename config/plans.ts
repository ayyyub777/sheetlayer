export enum SupportType {
  Email = "Email support",
  Priority = "Priority support",
  Dedicated = "24/7 Dedicated support",
}

export enum CacheDuration {
  OneHour = "1 hour",
  CustomTTL = "Custom TTL",
  Advanced = "Custom Rules",
}

export enum RowLimit {
  TenThousand = "10,000 rows",
  OneHundredThousand = "100,000 rows",
  Unlimited = "Unlimited",
}

export enum RateLimit {
  TenPerSecond = "10 req/s",
  FiftyPerSecond = "50 req/s",
  Custom = "Custom limits",
}

export enum PlanFeatureName {
  ApiCalls = "API Calls",
  ConnectedSheets = "Connected Sheets",
  CacheDuration = "Cache Duration",
  RowLimit = "Row Limit",
  RateLimit = "Rate Limit",
  Support = "Support",
  SLA = "SLA",
}

export type PlanFeature = {
  name: PlanFeatureName
  description: string
  value: string | number | boolean
}

export type Plan = {
  description: string
  features: PlanFeature[]
}

const sharedFeatures = {
  apiCalls: (limit: string) => ({
    name: PlanFeatureName.ApiCalls,
    description: "Monthly API request limit",
    value: limit,
  }),
  connectedSheets: (limit: string) => ({
    name: PlanFeatureName.ConnectedSheets,
    description: "Number of spreadsheets you can connect",
    value: limit,
  }),
  cacheDuration: (duration: CacheDuration) => ({
    name: PlanFeatureName.CacheDuration,
    description: "How long data is cached",
    value: duration,
  }),
  rowLimit: (limit: RowLimit) => ({
    name: PlanFeatureName.RowLimit,
    description: "Maximum rows per sheet",
    value: limit,
  }),
  rateLimit: (limit: RateLimit) => ({
    name: PlanFeatureName.RateLimit,
    description: "Requests per second",
    value: limit,
  }),
  support: (type: SupportType) => ({
    name: PlanFeatureName.Support,
    description: "Support response time",
    value: type,
  }),
  sla: (uptime: string) => ({
    name: PlanFeatureName.SLA,
    description: "Service Level Agreement",
    value: uptime,
  }),
}

export const plans: Record<string, Plan> = {
  "Basic plan": {
    description: "Perfect for small projects",
    features: [
      sharedFeatures.apiCalls("50,000 calls/month"),
      sharedFeatures.connectedSheets("3 sheets"),
      sharedFeatures.cacheDuration(CacheDuration.OneHour),
      sharedFeatures.rowLimit(RowLimit.TenThousand),
      sharedFeatures.rateLimit(RateLimit.TenPerSecond),
      sharedFeatures.support(SupportType.Email),
    ],
  },
  "Business plan": {
    description: "Ideal for growing businesses",
    features: [
      sharedFeatures.apiCalls("500,000 calls/month"),
      sharedFeatures.connectedSheets("15 sheets"),
      sharedFeatures.cacheDuration(CacheDuration.CustomTTL),
      sharedFeatures.rowLimit(RowLimit.OneHundredThousand),
      sharedFeatures.rateLimit(RateLimit.FiftyPerSecond),
      sharedFeatures.support(SupportType.Priority),
    ],
  },
  "Enterprise plan": {
    description: "For large organizations",
    features: [
      sharedFeatures.apiCalls("Unlimited"),
      sharedFeatures.connectedSheets("Unlimited sheets"),
      sharedFeatures.cacheDuration(CacheDuration.Advanced),
      sharedFeatures.rowLimit(RowLimit.Unlimited),
      sharedFeatures.rateLimit(RateLimit.Custom),
      sharedFeatures.support(SupportType.Dedicated),
      sharedFeatures.sla("99.99% uptime"),
    ],
  },
}

export function getPlanByName(name: string | null): Plan | undefined {
  return plans[name || ""]
}
