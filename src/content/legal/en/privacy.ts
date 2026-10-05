import type { LegalDocument } from '../types'

/**
 * Privacy Policy — English, the source text of the document.
 *
 * Drafted for the Kingdom of Saudi Arabia (PDPL and Implementing Regulations).
 * Have a Saudi-licensed lawyer review before publishing.
 *
 * `{token}` values come from `src/content/company.ts`. See `../types.ts` for the
 * markup this text supports.
 */
const privacy: LegalDocument = {
  id: 'privacy',
  title: 'Privacy Policy',
  metaDescription:
    'How {name} collects, uses, stores and destroys personal data under the Saudi Personal Data Protection Law. {shortAddress}.',
  contentsLabel: 'Contents',

  summary: {
    heading: 'The short version',
    blocks: [
      {
        kind: 'p',
        text: "This policy explains how {name} collects, uses, stores, shares and destroys your personal data, in line with the {country}'s Personal Data Protection Law. In short:",
      },
      {
        kind: 'ul',
        items: [
          'We collect only what we need to create your account, handle your concerns and run our services.',
          'We never sell your personal data, and we send marketing only with your consent.',
          'We use Google reCAPTCHA and other safeguards to protect our forms from spam and abuse.',
          'You can ask to access, copy, correct or destroy your data, or withdraw your consent, at any time.',
          "If you're unhappy with how we handle your data, you can complain to us or to the Saudi Data and Artificial Intelligence Authority (SDAIA).",
        ],
      },
      {
        kind: 'p',
        text: 'This policy is separate from our [Terms and Conditions](/terms-and-conditions).',
      },
    ],
  },

  sections: [
    {
      n: 1,
      title: 'Who we are',
      blocks: [
        {
          kind: 'p',
          text: 'The controller responsible for your personal data is {legalName}, Commercial Registration No. {crNumber}, national address {nationalAddress} ("{name}", "we", "us" or "our").',
        },
        {
          kind: 'p',
          text: 'We process personal data in accordance with the Personal Data Protection Law issued by Royal Decree No. (M/19) dated 9/2/1443H, as amended by Royal Decree No. (M/148) dated 5/9/1444H (the "PDPL"), its Implementing Regulations, the Regulation on Personal Data Transfer outside the Kingdom, and other applicable laws of the {country}.',
        },
        {
          kind: 'p',
          text: 'You can contact us about privacy at [{privacyEmail}](mailto:{privacyEmail}). Our Personal Data Protection Officer is {dpoName}.',
        },
      ],
    },
    {
      n: 2,
      title: 'Scope of this policy',
      blocks: [
        {
          kind: 'p',
          text: 'This policy applies to personal data we process when you visit {website}, create an account, submit or track a concern, receive emails from us (including from {noReplyEmail}), or contact us.',
        },
        {
          kind: 'p',
          text: "It does not cover websites or applications we build for our clients. Those clients are responsible for their own users' personal data and privacy notices, and where we process data on their behalf we do so as their processor under a written agreement.",
        },
      ],
    },
    {
      n: 3,
      title: 'Personal data we collect',
      blocks: [
        { kind: 'p', text: 'We collect the following categories of personal data:' },
        {
          kind: 'table',
          head: ['Category', 'Examples', 'How we collect it'],
          rows: [
            [
              'Identity and contact data',
              'Name, email address, mobile number, preferred language',
              'From you, when you register or submit a concern',
            ],
            [
              'Account data',
              'Username, encrypted password, account settings',
              'From you, when you register',
            ],
            [
              'Concern data',
              'The description of your concern, attachments, reference number, status, dates, our notes and correspondence',
              'From you and our team while handling the concern',
            ],
            [
              'Communication data',
              'Messages you send us, email delivery and open status',
              'From you and our email systems',
            ],
            [
              'Technical data',
              'IP address, device and browser type, pages visited, log and security data',
              'Automatically, through cookies and server logs',
            ],
            [
              'Spam-protection data',
              'Signals Google reCAPTCHA collects to tell people from automated programs, such as your IP address, browser and device details, and how you interact with our pages; the resulting score',
              'Automatically, through Google reCAPTCHA, when you visit our site or use our forms',
            ],
            [
              'Marketing preferences',
              'Whether you have agreed to receive marketing, and when',
              'From you',
            ],
          ],
        },
        {
          kind: 'p',
          text: 'If you do not provide the data marked as required in our forms, we may not be able to create your account or handle your concern.',
        },
      ],
    },
    {
      n: 4,
      title: 'Sensitive personal data',
      blocks: [
        {
          kind: 'p',
          text: 'The PDPL gives extra protection to sensitive data, such as data revealing racial or ethnic origin, religious, intellectual or political belief, security or criminal data, biometric or genetic data used for identification, health data, credit data, and data indicating that one or both parents are unknown.',
        },
        {
          kind: 'p',
          text: 'We do not ask for sensitive data. Please do not include it in a concern unless it is necessary to explain the issue. If you choose to include it, we will process it only to handle your concern, with your explicit consent or where the law otherwise permits, and with additional security safeguards.',
        },
      ],
    },
    {
      n: 5,
      title: 'Why we use your data and our legal basis',
      blocks: [
        {
          kind: 'p',
          text: 'We process personal data only for specified, clear and lawful purposes, and only where the PDPL allows it:',
        },
        {
          kind: 'table',
          head: ['Purpose', 'Legal basis under the PDPL'],
          rows: [
            [
              'Creating and managing your account',
              'Necessary to provide the service you requested (performance of an agreement with you)',
            ],
            [
              'Receiving, reviewing and resolving your concerns, and sending confirmations and updates',
              'Performance of an agreement with you',
            ],
            [
              'Responding to your questions and requests',
              'Performance of an agreement with you, or your consent',
            ],
            [
              'Keeping the Services secure and preventing spam, fraud and misuse, including reCAPTCHA checks and limits on how often forms can be submitted',
              'Our legitimate interests, which do not override your rights (non-sensitive data only)',
            ],
            [
              'Letting you track the status of your concern through the link in your confirmation email or with your reference number and email address',
              'Performance of an agreement with you',
            ],
            [
              'Improving our Services using aggregated or anonymised information',
              'Our legitimate interests',
            ],
            ['Sending marketing messages', 'Your consent'],
            ['Non-essential cookies and analytics', 'Your consent'],
            [
              'Complying with laws, court orders and requests from competent authorities',
              'Legal obligation',
            ],
          ],
        },
        {
          kind: 'p',
          text: 'We will not use your personal data for a purpose that is incompatible with the purpose for which we collected it, unless the law allows it or we obtain your consent.',
        },
      ],
    },
    {
      n: 6,
      title: 'Consent and withdrawing it',
      blocks: [
        {
          kind: 'p',
          text: 'Where we rely on your consent, we ask for it clearly and separately from other terms. You can withdraw your consent at any time through your account settings, the unsubscribe link in our marketing emails, or by contacting us. Withdrawing consent does not affect processing that took place before you withdrew it.',
        },
      ],
    },
    {
      n: 7,
      title: 'Who we share your data with',
      blocks: [
        {
          kind: 'p',
          text: 'We do not sell your personal data. We share it only where necessary, and only with:',
        },
        {
          kind: 'ul',
          items: [
            '**Service providers (processors)** who help us run the Services, such as hosting, email delivery, customer support and security providers. They act on our instructions under written agreements that require them to protect your data and meet PDPL requirements. {processorCategories}',
            '**Competent authorities**, including courts, public prosecution and regulators, where required by law or to protect rights, safety and security.',
            '**Professional advisers**, such as lawyers and auditors, under a duty of confidentiality.',
            '**A successor organisation** if all or part of our business is restructured, merged or transferred, subject to this policy and applicable law.',
          ],
        },
        {
          kind: 'p',
          text: 'Our forms are protected by Google reCAPTCHA. When you use our site, Google receives the spam-protection data described in section 3 and processes it under the [Google Privacy Policy](https://policies.google.com/privacy) and [Google Terms of Service](https://policies.google.com/terms).',
        },
        {
          kind: 'p',
          text: 'If a concern relates to a client or organisation we work with, we share with them only the information needed to resolve it, and we will tell you before we do so unless the law prevents us.',
        },
      ],
    },
    {
      n: 8,
      title: 'Transfers outside the Kingdom',
      blocks: [
        {
          kind: 'p',
          text: 'We store and process personal data in the {country} wherever possible. {hostingStatement}',
        },
        {
          kind: 'p',
          text: "If we need to transfer personal data outside the Kingdom, for example because a service provider operates abroad, we will do so only as permitted by the PDPL and the Regulation on Personal Data Transfer outside the Kingdom. This means the transfer must not harm national security or the Kingdom's vital interests, it will be limited to the minimum data necessary, and it will be protected by appropriate safeguards, such as transfer to a country with an adequate level of protection or the use of standard contractual clauses or binding common rules approved by SDAIA. Where required, we will carry out a risk assessment before the transfer.",
        },
      ],
    },
    {
      n: 9,
      title: 'How we store and protect your data',
      blocks: [
        {
          kind: 'p',
          text: 'Your data is stored in secure electronic systems operated by us and our hosting providers. We use organisational, administrative and technical measures appropriate to the nature and sensitivity of the data, including encryption in transit, access controls based on job role, secure authentication, activity logging, regular backups, and staff confidentiality obligations.',
        },
        {
          kind: 'p',
          text: 'In particular: the tracking link in your confirmation email contains a random code that we store only in a one-way scrambled (hashed) form; the status page shows only your concern\'s status, dates and our notes, never your contact details; records used to limit form submissions store a hashed form of your IP address or email address rather than the address itself; and the page our team uses to manage concerns is password-protected and locks out repeated failed sign-ins.',
        },
        {
          kind: 'p',
          text: 'No system is completely secure, but we review our measures regularly to keep your data protected against unauthorised access, loss, disclosure or alteration.',
        },
      ],
    },
    {
      n: 10,
      title: 'How long we keep your data and how we destroy it',
      blocks: [
        {
          kind: 'p',
          text: 'We keep personal data only for as long as necessary for the purpose for which it was collected, or as required by law. Our standard retention periods are:',
        },
        {
          kind: 'table',
          head: ['Data', 'Retention period'],
          rows: [
            [
              'Account data',
              'While your account is active, and {retentionClosedAccount} after it is closed',
            ],
            [
              'Concern records',
              '{retentionClosedConcern} after the concern is closed, to handle follow-ups and disputes',
            ],
            ['Technical and security logs', '{retentionTechnicalLogs}'],
            [
              'Spam-protection counters (hashed IP address or email address)',
              'Deleted automatically within 1 hour',
            ],
            [
              'Marketing preferences',
              'Until you withdraw consent, then a record of the withdrawal only',
            ],
          ],
        },
        {
          kind: 'p',
          text: 'When the retention period ends, we securely destroy the data or anonymise it so that you can no longer be identified. We may keep data longer if the law requires it or if it is needed for a legal claim, in which case we keep it only for that purpose.',
        },
      ],
    },
    {
      n: 11,
      title: 'Your rights',
      blocks: [
        { kind: 'p', text: 'Under the PDPL, you have the right to:' },
        {
          kind: 'ul',
          items: [
            '**Be informed** about the legal basis and purpose for collecting and processing your personal data, which is what this policy does.',
            '**Access** your personal data held by us.',
            '**Obtain a copy** of your personal data in a clear, readable format.',
            '**Request correction**, completion or updating of your personal data.',
            '**Request destruction** of your personal data when it is no longer needed, subject to any legal requirement to keep it.',
            '**Withdraw your consent** to processing that relies on consent.',
          ],
        },
        {
          kind: 'p',
          text: 'Exercising these rights is free of charge. We may need to verify your identity before responding, and we will respond within the period required by the Implementing Regulations (currently 30 days, which may be extended in limited cases, in which case we will tell you why).',
        },
        {
          kind: 'p',
          text: "In some cases the law allows us to restrict or decline a request, for example where it would reveal another person's data or affect an ongoing investigation. If so, we will explain why.",
        },
      ],
    },
    {
      n: 12,
      title: 'How to make a request or a complaint',
      blocks: [
        {
          kind: 'p',
          text: 'To exercise your rights or raise a privacy concern, email [{privacyEmail}](mailto:{privacyEmail}) or use the contact details in section 19. Please include your name, the email address on your account and a description of your request.',
        },
        {
          kind: 'p',
          text: 'If you are not satisfied with our response, you have the right to file a complaint with the Saudi Data and Artificial Intelligence Authority (SDAIA), the competent authority for personal data protection in the Kingdom, through its official channels at sdaia.gov.sa.',
        },
      ],
    },
    {
      n: 13,
      title: 'Personal data breaches',
      blocks: [
        {
          kind: 'p',
          text: 'If a personal data breach occurs, we will act immediately to contain it. Where required, we will notify SDAIA within 72 hours of becoming aware of it, and we will inform you without undue delay if the breach may cause harm to you or your data, including practical steps you can take to protect yourself.',
        },
      ],
    },
    {
      n: 14,
      title: 'Cookies and similar technologies',
      blocks: [
        { kind: 'p', text: 'We use cookies and similar technologies on our website:' },
        {
          kind: 'ul',
          items: [
            '**Essential cookies** keep you signed in, protect the site and remember your choices. These are necessary for the Services to work.',
            '**Security cookies** set by Google reCAPTCHA help tell people from automated programs and protect our forms from spam. They are necessary for the forms to work.',
            '**Analytics and preference cookies** help us understand how the site is used and improve it. We use these only with your consent.',
          ],
        },
        {
          kind: 'p',
          text: 'You can change your cookie choices at any time through our [cookie settings]({cookieSettingsPath}) or your browser settings. Blocking essential cookies may stop parts of the site from working.',
        },
      ],
    },
    {
      n: 15,
      title: 'Emails and marketing',
      blocks: [
        {
          kind: 'p',
          text: 'Service emails, such as confirmations sent from {noReplyEmail} when you raise a concern, are part of the Services and are not marketing.',
        },
        {
          kind: 'p',
          text: 'We send marketing messages only if you have given your consent. Every marketing message identifies us as the sender and includes a simple way to unsubscribe, and we stop sending them as soon as you opt out.',
        },
      ],
    },
    {
      n: 16,
      title: 'Children',
      blocks: [
        {
          kind: 'p',
          text: 'The Services are intended for people aged 18 and over. We do not knowingly collect personal data from anyone under 18 without the consent of their parent or legal guardian. If you believe a child has provided us with personal data without that consent, please contact us and we will take appropriate steps, including destroying the data where required.',
        },
      ],
    },
    {
      n: 17,
      title: 'Links to other websites',
      blocks: [
        {
          kind: 'p',
          text: 'Our Services may link to websites and services we do not control. This policy does not apply to them, so please review their privacy notices before sharing your data.',
        },
      ],
    },
    {
      n: 18,
      title: 'Changes to this policy',
      blocks: [
        {
          kind: 'p',
          text: 'We may update this policy to reflect changes to our Services, our practices or the law. We will post the updated version on this page with a new "Last updated" date. If the changes are significant, we will notify you by email or through the Services, and where the change requires it, we will ask for your consent again.',
        },
      ],
    },
    {
      n: 19,
      title: 'Contact us',
      blocks: [
        {
          kind: 'contact',
          rows: [
            ['Controller', '{legalName}, CR No. {crNumber}'],
            ['Privacy email', '[{privacyEmail}](mailto:{privacyEmail})'],
            ['Data Protection Officer', '{dpoName}'],
            ['Phone', '[{phone}]({phoneHref})'],
            ['Address', '{nationalAddress}'],
          ],
        },
        {
          kind: 'p',
          text: 'This policy is provided in English. If we publish an Arabic version and there is any conflict between the two, the Arabic version prevails.',
        },
      ],
    },
  ],
}

export default privacy
