/**
 * Single source of truth for the legal / contact values that the source HTML
 * documents shipped as <mark class="fill"> placeholders.
 *
 * Everything marked  TODO(legal)  still needs a real value from the business
 * before the Terms and Privacy pages go live. The pages render these verbatim,
 * so filling a value here updates every place it appears in both documents.
 */

export const company = {
  /** Trading name used throughout the prose. */
  name: 'People Concerns',

  /**
   * Legal name exactly as printed on the Commercial Registration. Kept separate
   * from `name` because the Terms cite it as the contracting entity.
   * TODO(legal): replace with the legal name on the CR if it differs.
   */
  legalName: 'People Concerns',

  /**
   * Commercial Registration number.
   * Appears twice in the Terms (s1, s20) and twice in the Privacy Policy (s1, s19).
   */
  crNumber: '7055132117',

  /** City of the registered office. */
  city: 'Jeddah',
  country: 'Kingdom of Saudi Arabia',

  /** Short form used in the hero, meta description and footers. */
  get shortAddress() {
    return `${this.city}, ${this.country}`
  },

  /**
   * Full Saudi national address.
   * TODO(legal): replace with building no., street, district and postal code.
   */
  get nationalAddress() {
    return `[Building no., street, district, postal code], ${this.city}, ${this.country}`
  },

  /**
   * City whose courts hear disputes under Terms s18. Defaults to the city of the
   * registered office.
   * TODO(legal): confirm the venue with counsel — it need not match `city`.
   */
  get courtCity() {
    return this.city
  },

  /** TODO(legal): replace the placeholder switchboard number. */
  phone: '+966 11 000 0000',
  get phoneHref() {
    return `tel:${this.phone.replace(/[^+\d]/g, '')}`
  },

  supportEmail: 'support@peopleconcerns.com',
  privacyEmail: 'privacy@peopleconcerns.com',
  noReplyEmail: 'NoReply@peopleconcerns.com',

  website: 'www.peopleconcerns.com',
  websiteUrl: 'https://www.peopleconcerns.com',

  /** TODO(legal): confirm the published office hours. */
  officeHours: 'Sunday to Thursday, 9:00 to 17:00',

  /** Personal Data Protection Officer named in the Privacy Policy (s1, s19). */
  dpoName: 'Rawad Medhir',

  /** Terms s14 — liability cap for the free tier. TODO(legal): confirm the amount. */
  liabilityCap: 'SAR 500',

  /** Privacy Policy s10 — retention periods. TODO(legal): confirm each period. */
  retention: {
    closedAccount: '12 months',
    closedConcern: '3 years',
    technicalLogs: '12 months',
  },

  /** Privacy Policy s8 — hosting location statement. TODO(legal): confirm. */
  hostingStatement: 'Our primary hosting is located in the Kingdom.',

  /**
   * Privacy Policy s7 — optional list of processor categories.
   * Set to null to omit the sentence entirely.
   */
  processorCategories: 'These currently cover cloud hosting and email delivery.' as string | null,

  /** Privacy Policy s14 — where the cookie preferences UI lives. */
  cookieSettingsPath: '/#cookie-settings',
} as const

/** Both legal documents share one version and revision date. */
export const legalRevision = {
  version: '1.0',
  lastUpdated: '23 September 2026',
} as const
