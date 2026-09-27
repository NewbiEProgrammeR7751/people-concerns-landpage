import type { LegalDocument } from '../types'

/**
 * Terms and Conditions — English, the source text of the document.
 *
 * Drafted for the Kingdom of Saudi Arabia (PDPL and Implementing Regulations).
 * Have a Saudi-licensed lawyer review before publishing.
 *
 * `{token}` values come from `src/content/company.ts`. See `../types.ts` for the
 * markup this text supports.
 */
const terms: LegalDocument = {
  id: 'terms',
  title: 'Terms and Conditions',
  metaDescription: 'Terms and Conditions for {name}, {shortAddress}.',
  contentsLabel: 'Contents',

  summary: {
    heading: 'The short version',
    blocks: [
      {
        kind: 'p',
        text: 'These terms explain the rules for using the {name} website and member platform, including how you raise a concern with us. In short:',
      },
      {
        kind: 'ul',
        items: [
          "You must be 18 or older, or have a parent or guardian's permission, and keep your account details accurate and secure.",
          "Only submit concerns that are honest and lawful. Don't use the platform for emergencies.",
          'You keep ownership of what you submit; you let us use it only to handle your concern and run the service.',
          'These terms are governed by the laws of the {country}.',
        ],
      },
      {
        kind: 'p',
        text: 'Please read the full terms below. They work together with our [Privacy Policy](/privacy-policy).',
      },
    ],
  },

  sections: [
    {
      n: 1,
      title: 'About these terms',
      blocks: [
        {
          kind: 'p',
          text: 'These Terms and Conditions (the "Terms") govern your access to and use of the website at {website}, the {name} member platform, and any related services, emails and features we provide (together, the "Services").',
        },
        {
          kind: 'p',
          text: 'The Services are operated by {legalName}, a company registered in the {country} under Commercial Registration No. {crNumber}, with its national address at {nationalAddress} ("{name}", "we", "us" or "our").',
        },
        {
          kind: 'p',
          text: 'By creating an account, submitting a concern, or otherwise using the Services, you confirm that you have read, understood and agree to these Terms. If you do not agree, please do not use the Services.',
        },
      ],
    },
    {
      n: 2,
      title: 'Definitions',
      blocks: [
        { kind: 'p', text: 'In these Terms:' },
        {
          kind: 'ul',
          items: [
            '**Member** means a person who has registered for an account on the Services, or who submits a concern through them.',
            '**Concern** means any issue, complaint, feedback, request or report you submit to us through the Services, together with any attachments.',
            '**Content** means text, files, images and other material submitted to or made available through the Services.',
            '**Personal Data** has the meaning given in the Personal Data Protection Law issued by Royal Decree No. (M/19) dated 9/2/1443H, as amended (the "PDPL").',
          ],
        },
      ],
    },
    {
      n: 3,
      title: 'Eligibility and your account',
      blocks: [
        {
          kind: 'p',
          text: 'You must be at least 18 years old to create an account. If you are under 18, you may use the Services only with the consent and supervision of a parent or legal guardian, who accepts these Terms on your behalf.',
        },
        { kind: 'p', text: 'When you register, you agree to:' },
        {
          kind: 'ul',
          items: [
            'provide accurate, current and complete information, and keep it up to date;',
            'keep your password and login details confidential and not share your account with anyone else;',
            'tell us promptly at [{supportEmail}](mailto:{supportEmail}) if you believe your account has been accessed without your permission.',
          ],
        },
        {
          kind: 'p',
          text: 'You are responsible for activity that takes place under your account, unless it results from our failure to take reasonable security measures.',
        },
      ],
    },
    {
      n: 4,
      title: 'Our Services',
      blocks: [
        {
          kind: 'p',
          text: '{name} builds digital applications, including websites and mobile apps. The Services allow Members to raise concerns, track their progress, and communicate with our team.',
        },
        {
          kind: 'p',
          text: 'We may update, improve, suspend or discontinue any part of the Services from time to time. Where a change significantly affects you, we will give you reasonable notice where practical.',
        },
        {
          kind: 'p',
          text: 'If you engage us to design or develop a website, mobile application or other digital product, that engagement will be governed by a separate written agreement. Where that agreement conflicts with these Terms, the separate agreement prevails for that engagement.',
        },
      ],
    },
    {
      n: 5,
      title: 'Submitting a concern',
      blocks: [
        { kind: 'p', text: 'When you submit a concern:' },
        {
          kind: 'ul',
          items: [
            'you confirm that the information you provide is true and accurate to the best of your knowledge;',
            'you will receive a confirmation email from **{noReplyEmail}** with a reference number. This address does not receive replies, so please use the contact details in section 20 or the tracking link in the email to add information;',
            'we aim to begin reviewing your concern within a few minutes of receipt. Review and resolution times are targets, not guarantees, and may depend on the nature of the concern and the information available;',
            'we may contact you for further details, and we may decline to act on a concern that is incomplete, abusive, unlawful or outside the scope of the Services, in which case we will tell you.',
          ],
        },
        {
          kind: 'note',
          text: '**Not for emergencies.** The Services are not an emergency service. If you or anyone else is in immediate danger, contact the relevant emergency services in the Kingdom directly.',
        },
        {
          kind: 'p',
          text: "Please include only the information needed to explain your concern. Avoid sharing sensitive personal data (for example health, financial or criminal information), or other people's personal data, unless it is necessary and you are entitled to share it. See our [Privacy Policy](/privacy-policy) for how we handle this information.",
        },
      ],
    },
    {
      n: 6,
      title: 'Acceptable use',
      blocks: [
        {
          kind: 'p',
          text: 'You agree to use the Services lawfully and respectfully. You must not use the Services to:',
        },
        {
          kind: 'ul',
          items: [
            'submit content that is unlawful, false, misleading, defamatory, threatening, harassing, or that infringes public order, public morals or the privacy of others, including any act prohibited by the Anti-Cyber Crime Law;',
            'impersonate any person or organisation, or misrepresent your connection with them;',
            "submit content you do not have the right to share, including another person's confidential information or intellectual property;",
            'upload viruses, malware or any code designed to disrupt, damage or gain unauthorised access to any system;',
            'attempt to bypass security features, probe for vulnerabilities, or access accounts or data that are not yours;',
            'collect data from the Services by automated means (such as scraping or bots) without our written permission;',
            'overload, interfere with or disrupt the Services or the networks connected to them.',
          ],
        },
        {
          kind: 'p',
          text: 'We may remove content, restrict access, or report matters to the competent authorities where we reasonably believe these rules have been broken or where required by law.',
        },
      ],
    },
    {
      n: 7,
      title: 'Content you submit',
      blocks: [
        {
          kind: 'p',
          text: 'You keep ownership of the content you submit. By submitting it, you grant {name} a non-exclusive, royalty-free licence to store, copy, process and use that content for the purposes of handling your concern, operating and improving the Services, and meeting our legal obligations.',
        },
        {
          kind: 'p',
          text: 'This licence continues for as long as we retain the content in line with our [Privacy Policy](/privacy-policy). It does not allow us to publish your content or use it for marketing without your consent.',
        },
      ],
    },
    {
      n: 8,
      title: 'Intellectual property',
      blocks: [
        {
          kind: 'p',
          text: 'The Services and everything in them, including the {name} name, logo, brand mark, designs, software, text and graphics (excluding content submitted by Members), belong to {name} or its licensors and are protected by the intellectual property laws of the {country} and international treaties.',
        },
        {
          kind: 'p',
          text: 'You may use the Services for their intended purpose only. You must not copy, modify, distribute, sell or create derivative works from any part of the Services, or use our name or brand, without our prior written permission.',
        },
      ],
    },
    {
      n: 9,
      title: 'Fees',
      blocks: [
        {
          kind: 'p',
          text: 'Submitting a concern and using the member platform is free of charge unless we tell you otherwise before you use a paid feature.',
        },
        {
          kind: 'p',
          text: 'Where we offer paid services, prices will be shown in Saudi riyals (SAR) and will include or clearly state any applicable value added tax. Payment terms, invoicing and refunds for paid services will be set out in the relevant order or agreement.',
        },
      ],
    },
    {
      n: 10,
      title: 'Electronic communications',
      blocks: [
        {
          kind: 'p',
          text: 'By using the Services, you agree to receive communications from us electronically, including by email and in-app notices. In line with the Electronic Transactions Law, you agree that electronic records, notices and confirmations we send you have the same legal effect as written documents.',
        },
        {
          kind: 'p',
          text: 'Service messages, such as concern confirmations and updates, are part of the Services and are sent whether or not you have opted in to marketing. We will only send marketing messages with your consent, as described in our [Privacy Policy](/privacy-policy).',
        },
      ],
    },
    {
      n: 11,
      title: 'Privacy and personal data',
      blocks: [
        {
          kind: 'p',
          text: 'We process your personal data in accordance with the PDPL, its Implementing Regulations, and our [Privacy Policy](/privacy-policy), which explains what data we collect, why we collect it, how long we keep it, and your rights. The Privacy Policy is a separate document and does not form part of these Terms.',
        },
      ],
    },
    {
      n: 12,
      title: 'Third-party links and services',
      blocks: [
        {
          kind: 'p',
          text: 'The Services may contain links to, or rely on, websites and services operated by third parties. We are not responsible for their content, security or privacy practices. Your use of third-party services is governed by their own terms.',
        },
      ],
    },
    {
      n: 13,
      title: 'Disclaimers',
      blocks: [
        {
          kind: 'p',
          text: 'We work hard to keep the Services available, secure and accurate. However, to the extent permitted by the laws of the Kingdom, the Services are provided on an "as is" and "as available" basis, and we do not guarantee that they will be uninterrupted, error-free, or that every concern will be resolved in the way you prefer.',
        },
        {
          kind: 'p',
          text: 'Information on the Services is for general purposes and does not constitute legal, financial or professional advice.',
        },
      ],
    },
    {
      n: 14,
      title: 'Limitation of liability',
      blocks: [
        { kind: 'p', text: 'To the extent permitted by the laws of the {country}:' },
        {
          kind: 'ul',
          items: [
            'we are not liable for any indirect or consequential loss, or for loss of profit, revenue, data or goodwill, arising from your use of or inability to use the Services;',
            'our total liability to you for any claim relating to the free Services is limited to {liabilityCap}; for paid services, it is limited to the fees you paid us for the relevant service in the 12 months before the claim.',
          ],
        },
        {
          kind: 'p',
          text: 'Nothing in these Terms excludes or limits any liability that cannot be excluded or limited under the laws of the Kingdom, including liability arising from our wilful misconduct or gross negligence.',
        },
      ],
    },
    {
      n: 15,
      title: 'Your responsibility to us',
      blocks: [
        {
          kind: 'p',
          text: 'You agree to compensate {name} for any loss, damage or reasonable costs (including legal fees) we suffer as a direct result of your breach of these Terms or your misuse of the Services, to the extent permitted by law.',
        },
      ],
    },
    {
      n: 16,
      title: 'Suspension and termination',
      blocks: [
        {
          kind: 'p',
          text: 'You may stop using the Services and ask us to close your account at any time by contacting us.',
        },
        {
          kind: 'p',
          text: 'We may suspend or close your account, with notice where reasonably possible, if you seriously or repeatedly breach these Terms, if we are required to by law or a competent authority, or if continuing to provide the Services to you would expose us or others to legal or security risk.',
        },
        {
          kind: 'p',
          text: 'When your account closes, we will handle your personal data as described in our [Privacy Policy](/privacy-policy). Sections that by their nature should continue, including sections 7, 8, 14, 15 and 18, will survive termination.',
        },
      ],
    },
    {
      n: 17,
      title: 'Changes to these Terms',
      blocks: [
        {
          kind: 'p',
          text: 'We may update these Terms from time to time, for example to reflect changes to the Services or to the law. We will post the updated Terms on this page with a new "Last updated" date, and where the changes are significant we will notify you by email or through the Services before they take effect.',
        },
        {
          kind: 'p',
          text: 'If you continue to use the Services after the changes take effect, you accept the updated Terms. If you do not agree, you should stop using the Services and may close your account.',
        },
      ],
    },
    {
      n: 18,
      title: 'Governing law and disputes',
      blocks: [
        {
          kind: 'p',
          text: 'These Terms are governed by and interpreted in accordance with the laws and regulations in force in the {country}.',
        },
        {
          kind: 'p',
          text: 'If a dispute arises, please contact us first. We will try in good faith to resolve it amicably within 30 days. If it cannot be resolved, it will be referred to the competent courts in the {country}, in the city of {courtCity}.',
        },
        {
          kind: 'p',
          text: 'Nothing in this section affects your right to file a complaint with any competent authority, including the Ministry of Commerce or the Saudi Data and Artificial Intelligence Authority (SDAIA).',
        },
      ],
    },
    {
      n: 19,
      title: 'General',
      blocks: [
        {
          kind: 'ul',
          items: [
            '**Language.** These Terms are provided in English. If we publish an Arabic version and there is any conflict between the two, the Arabic version prevails.',
            '**Entire agreement.** These Terms, together with any separate agreement referred to in section 4, form the entire agreement between you and us about the Services.',
            '**Severability.** If any part of these Terms is found invalid or unenforceable, the rest remains in full effect.',
            '**No waiver.** If we do not enforce a right straight away, we have not given up that right.',
            '**Transfer.** We may transfer our rights and obligations under these Terms to another organisation, for example as part of a restructuring, and will tell you if this happens. You may not transfer your rights without our written consent.',
            '**Events beyond our control.** We are not responsible for delays or failures caused by events outside our reasonable control.',
          ],
        },
      ],
    },
    {
      n: 20,
      title: 'Contact us',
      blocks: [
        { kind: 'p', text: 'If you have any questions about these Terms, please contact us:' },
        {
          kind: 'contact',
          rows: [
            ['Company', '{legalName}, CR No. {crNumber}'],
            ['Email', '[{supportEmail}](mailto:{supportEmail})'],
            ['Phone', '[{phone}]({phoneHref})'],
            ['Address', '{nationalAddress}'],
            ['Hours', '{officeHours}'],
          ],
        },
        {
          kind: 'p',
          text: 'Please note that **{noReplyEmail}** is used for automated messages only and does not receive replies.',
        },
      ],
    },
  ],
}

export default terms
