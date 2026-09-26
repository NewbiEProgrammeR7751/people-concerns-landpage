/**
 * Single source of truth for the legal / contact values that the source HTML
 * documents shipped as <mark class="fill"> placeholders.
 *
 * Values come from the Commercial Registration and the National Address
 * certificate. The pages render them verbatim, so editing a value here updates
 * every place it appears in both documents — and the confirmation email, which
 * reads its contact details from the same object.
 *
 * These are published legal statements, not copy. Changing one changes what the
 * business has committed to in a document members have already read.
 */

export const company = {
  /** Trading name used throughout the prose. */
  name: 'People Concerns',

  /**
   * Legal name exactly as printed on the Commercial Registration. Kept separate
   * from `name` because the Terms cite it as the contracting entity.
   */
  legalName: 'People Concerns',

  /**
   * Commercial Registration number.
   * Appears twice in the Terms (s1, s20) and twice in the Privacy Policy (s1, s19).
   */
  crNumber: '7055132117',

  /** City of the registered office, per the National Address certificate. */
  city: 'Riyadh',
  country: 'Kingdom of Saudi Arabia',

  /** Short form used in the hero, meta description and footers. */
  get shortAddress() {
    return `${this.city}, ${this.country}`
  },

  /**
   * Full Saudi national address, verbatim from the National Address
   * certificate. A literal rather than a template because the postal code sits
   * mid-string, between the city and the country.
   */
  nationalAddress:
    'Building 4384, Additional No. 7247, Al Narjis Dist., Riyadh 13343, Kingdom of Saudi Arabia',

  /** City whose courts hear disputes under Terms s18. */
  courtCity: 'Riyadh',

  /** Contact number as published, in the local format. */
  phone: '0555578897',

  /**
   * The same number in E.164 for the `tel:` link. Held separately because a
   * local-format href cannot be dialled from outside the Kingdom, and the
   * published display form is deliberately left as-is.
   */
  phoneE164: '+966555578897',
  get phoneHref() {
    return `tel:${this.phoneE164}`
  },

  supportEmail: 'support@peopleconcerns.com',
  privacyEmail: 'privacy@peopleconcerns.com',
  noReplyEmail: 'NoReply@peopleconcerns.com',

  website: 'www.peopleconcerns.com',
  websiteUrl: 'https://www.peopleconcerns.com',

  /** Published office hours. */
  officeHours: 'Sunday to Thursday, 9:00 AM to 5:00 PM',

  /** Personal Data Protection Officer named in the Privacy Policy (s1, s19). */
  dpoName: 'Rawad Medhir',

  /** Terms s14 — liability cap for the free tier. */
  liabilityCap: 'SAR 500',

  /**
   * Privacy Policy s10 — retention periods, one per row of the table. These are
   * published commitments: shortening one means destroying data sooner than the
   * policy a member already read, so change them deliberately.
   */
  retention: {
    closedAccount: '12 months',
    closedConcern: '3 years',
    technicalLogs: '12 months',
  },

  /** Privacy Policy s8 — hosting location statement. */
  hostingStatement: 'Our primary hosting is located in the Kingdom of Saudi Arabia.',

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
