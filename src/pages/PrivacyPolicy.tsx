import { company } from '@/content/company'
import LegalLayout, {
  A,
  B,
  ContactTable,
  GridTable,
  P,
  Section,
  ShortVersion,
  UL,
  type TocEntry,
} from './LegalLayout'

/**
 * Privacy Policy, converted from `privacy-policy.html`.
 *
 * Drafted for the Kingdom of Saudi Arabia (PDPL and Implementing Regulations).
 * Have a Saudi-licensed lawyer review before publishing.
 *
 * Every value the source marked with <mark class="fill"> now reads from
 * `src/content/company.ts`.
 */

export const ROUTE = '/privacy-policy'

const TOC: TocEntry[] = [
  { id: 's1', n: 1, title: 'Who we are' },
  { id: 's2', n: 2, title: 'Scope of this policy' },
  { id: 's3', n: 3, title: 'Personal data we collect' },
  { id: 's4', n: 4, title: 'Sensitive personal data' },
  { id: 's5', n: 5, title: 'Why we use your data and our legal basis' },
  { id: 's6', n: 6, title: 'Consent and withdrawing it' },
  { id: 's7', n: 7, title: 'Who we share your data with' },
  { id: 's8', n: 8, title: 'Transfers outside the Kingdom' },
  { id: 's9', n: 9, title: 'How we store and protect your data' },
  { id: 's10', n: 10, title: 'How long we keep your data and how we destroy it' },
  { id: 's11', n: 11, title: 'Your rights' },
  { id: 's12', n: 12, title: 'How to make a request or a complaint' },
  { id: 's13', n: 13, title: 'Personal data breaches' },
  { id: 's14', n: 14, title: 'Cookies and similar technologies' },
  { id: 's15', n: 15, title: 'Emails and marketing' },
  { id: 's16', n: 16, title: 'Children' },
  { id: 's17', n: 17, title: 'Links to other websites' },
  { id: 's18', n: 18, title: 'Changes to this policy' },
  { id: 's19', n: 19, title: 'Contact us' },
]

const TERMS = '/terms-and-conditions'

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      route={ROUTE}
      title="Privacy Policy"
      documentTitle={`Privacy Policy | ${company.name}`}
      metaDescription={`How ${company.name} collects, uses, stores and destroys personal data under the Saudi Personal Data Protection Law. ${company.shortAddress}.`}
      toc={TOC}
    >
      <ShortVersion>
        <P>
          This policy explains how {company.name} collects, uses, stores, shares and destroys your
          personal data, in line with the {company.country}'s Personal Data Protection Law. In short:
        </P>
        <UL>
          <li>
            We collect only what we need to create your account, handle your concerns and run our
            services.
          </li>
          <li>We never sell your personal data, and we send marketing only with your consent.</li>
          <li>
            You can ask to access, copy, correct or destroy your data, or withdraw your consent, at
            any time.
          </li>
          <li>
            If you're unhappy with how we handle your data, you can complain to us or to the Saudi
            Data and Artificial Intelligence Authority (SDAIA).
          </li>
        </UL>
        <P>
          This policy is separate from our <A href={TERMS}>Terms and Conditions</A>.
        </P>
      </ShortVersion>

      <Section n={1} title="Who we are">
        <P>
          The controller responsible for your personal data is {company.legalName}, Commercial
          Registration No. {company.crNumber}, national address {company.nationalAddress} ("
          {company.name}", "we", "us" or "our").
        </P>
        <P>
          We process personal data in accordance with the Personal Data Protection Law issued by
          Royal Decree No. (M/19) dated 9/2/1443H, as amended by Royal Decree No. (M/148) dated
          5/9/1444H (the "PDPL"), its Implementing Regulations, the Regulation on Personal Data
          Transfer outside the Kingdom, and other applicable laws of the {company.country}.
        </P>
        <P>
          You can contact us about privacy at{' '}
          <A href={`mailto:${company.privacyEmail}`}>{company.privacyEmail}</A>. Our Personal Data
          Protection Officer is {company.dpoName}.
        </P>
      </Section>

      <Section n={2} title="Scope of this policy">
        <P>
          This policy applies to personal data we process when you visit {company.website}, create an
          account, submit or track a concern, receive emails from us (including from{' '}
          {company.noReplyEmail}), or contact us.
        </P>
        <P>
          It does not cover websites or applications we build for our clients. Those clients are
          responsible for their own users' personal data and privacy notices, and where we process
          data on their behalf we do so as their processor under a written agreement.
        </P>
      </Section>

      <Section n={3} title="Personal data we collect">
        <P>We collect the following categories of personal data:</P>
        <GridTable
          head={['Category', 'Examples', 'How we collect it']}
          rows={[
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
              "The description of your concern, attachments, reference number, dates, our notes and correspondence",
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
              'Marketing preferences',
              'Whether you have agreed to receive marketing, and when',
              'From you',
            ],
          ]}
        />
        <P>
          If you do not provide the data marked as required in our forms, we may not be able to
          create your account or handle your concern.
        </P>
      </Section>

      <Section n={4} title="Sensitive personal data">
        <P>
          The PDPL gives extra protection to sensitive data, such as data revealing racial or ethnic
          origin, religious, intellectual or political belief, security or criminal data, biometric or
          genetic data used for identification, health data, credit data, and data indicating that one
          or both parents are unknown.
        </P>
        <P>
          We do not ask for sensitive data. Please do not include it in a concern unless it is
          necessary to explain the issue. If you choose to include it, we will process it only to
          handle your concern, with your explicit consent or where the law otherwise permits, and with
          additional security safeguards.
        </P>
      </Section>

      <Section n={5} title="Why we use your data and our legal basis">
        <P>
          We process personal data only for specified, clear and lawful purposes, and only where the
          PDPL allows it:
        </P>
        <GridTable
          head={['Purpose', 'Legal basis under the PDPL']}
          rows={[
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
              'Keeping the Services secure, preventing fraud and misuse',
              'Our legitimate interests, which do not override your rights (non-sensitive data only)',
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
          ]}
        />
        <P>
          We will not use your personal data for a purpose that is incompatible with the purpose for
          which we collected it, unless the law allows it or we obtain your consent.
        </P>
      </Section>

      <Section n={6} title="Consent and withdrawing it">
        <P>
          Where we rely on your consent, we ask for it clearly and separately from other terms. You
          can withdraw your consent at any time through your account settings, the unsubscribe link
          in our marketing emails, or by contacting us. Withdrawing consent does not affect processing
          that took place before you withdrew it.
        </P>
      </Section>

      <Section n={7} title="Who we share your data with">
        <P>We do not sell your personal data. We share it only where necessary, and only with:</P>
        <UL>
          <li>
            <B>Service providers (processors)</B> who help us run the Services, such as hosting,
            email delivery, customer support and security providers. They act on our instructions
            under written agreements that require them to protect your data and meet PDPL
            requirements.
            {company.processorCategories ? ` ${company.processorCategories}` : ''}
          </li>
          <li>
            <B>Competent authorities</B>, including courts, public prosecution and regulators, where
            required by law or to protect rights, safety and security.
          </li>
          <li>
            <B>Professional advisers</B>, such as lawyers and auditors, under a duty of
            confidentiality.
          </li>
          <li>
            <B>A successor organisation</B> if all or part of our business is restructured, merged or
            transferred, subject to this policy and applicable law.
          </li>
        </UL>
        <P>
          If a concern relates to a client or organisation we work with, we share with them only the
          information needed to resolve it, and we will tell you before we do so unless the law
          prevents us.
        </P>
      </Section>

      <Section n={8} title="Transfers outside the Kingdom">
        <P>
          We store and process personal data in the {company.country} wherever possible.{' '}
          {company.hostingStatement}
        </P>
        <P>
          If we need to transfer personal data outside the Kingdom, for example because a service
          provider operates abroad, we will do so only as permitted by the PDPL and the Regulation on
          Personal Data Transfer outside the Kingdom. This means the transfer must not harm national
          security or the Kingdom's vital interests, it will be limited to the minimum data necessary,
          and it will be protected by appropriate safeguards, such as transfer to a country with an
          adequate level of protection or the use of standard contractual clauses or binding common
          rules approved by SDAIA. Where required, we will carry out a risk assessment before the
          transfer.
        </P>
      </Section>

      <Section n={9} title="How we store and protect your data">
        <P>
          Your data is stored in secure electronic systems operated by us and our hosting providers.
          We use organisational, administrative and technical measures appropriate to the nature and
          sensitivity of the data, including encryption in transit, access controls based on job role,
          secure authentication, activity logging, regular backups, and staff confidentiality
          obligations.
        </P>
        <P>
          No system is completely secure, but we review our measures regularly to keep your data
          protected against unauthorised access, loss, disclosure or alteration.
        </P>
      </Section>

      <Section n={10} title="How long we keep your data and how we destroy it">
        <P>
          We keep personal data only for as long as necessary for the purpose for which it was
          collected, or as required by law. Our standard retention periods are:
        </P>
        <GridTable
          head={['Data', 'Retention period']}
          rows={[
            [
              'Account data',
              `While your account is active, and ${company.retention.closedAccount} after it is closed`,
            ],
            [
              'Concern records',
              `${company.retention.closedConcern} after the concern is closed, to handle follow-ups and disputes`,
            ],
            ['Technical and security logs', company.retention.technicalLogs],
            [
              'Marketing preferences',
              'Until you withdraw consent, then a record of the withdrawal only',
            ],
          ]}
        />
        <P>
          When the retention period ends, we securely destroy the data or anonymise it so that you
          can no longer be identified. We may keep data longer if the law requires it or if it is
          needed for a legal claim, in which case we keep it only for that purpose.
        </P>
      </Section>

      <Section n={11} title="Your rights">
        <P>Under the PDPL, you have the right to:</P>
        <UL>
          <li>
            <B>Be informed</B> about the legal basis and purpose for collecting and processing your
            personal data, which is what this policy does.
          </li>
          <li>
            <B>Access</B> your personal data held by us.
          </li>
          <li>
            <B>Obtain a copy</B> of your personal data in a clear, readable format.
          </li>
          <li>
            <B>Request correction</B>, completion or updating of your personal data.
          </li>
          <li>
            <B>Request destruction</B> of your personal data when it is no longer needed, subject to
            any legal requirement to keep it.
          </li>
          <li>
            <B>Withdraw your consent</B> to processing that relies on consent.
          </li>
        </UL>
        <P>
          Exercising these rights is free of charge. We may need to verify your identity before
          responding, and we will respond within the period required by the Implementing Regulations
          (currently 30 days, which may be extended in limited cases, in which case we will tell you
          why).
        </P>
        <P>
          In some cases the law allows us to restrict or decline a request, for example where it would
          reveal another person's data or affect an ongoing investigation. If so, we will explain why.
        </P>
      </Section>

      <Section n={12} title="How to make a request or a complaint">
        <P>
          To exercise your rights or raise a privacy concern, email{' '}
          <A href={`mailto:${company.privacyEmail}`}>{company.privacyEmail}</A> or use the contact
          details in section 19. Please include your name, the email address on your account and a
          description of your request.
        </P>
        <P>
          If you are not satisfied with our response, you have the right to file a complaint with the
          Saudi Data and Artificial Intelligence Authority (SDAIA), the competent authority for
          personal data protection in the Kingdom, through its official channels at sdaia.gov.sa.
        </P>
      </Section>

      <Section n={13} title="Personal data breaches">
        <P>
          If a personal data breach occurs, we will act immediately to contain it. Where required, we
          will notify SDAIA within 72 hours of becoming aware of it, and we will inform you without
          undue delay if the breach may cause harm to you or your data, including practical steps you
          can take to protect yourself.
        </P>
      </Section>

      <Section n={14} title="Cookies and similar technologies">
        <P>We use cookies and similar technologies on our website:</P>
        <UL>
          <li>
            <B>Essential cookies</B> keep you signed in, protect the site and remember your choices.
            These are necessary for the Services to work.
          </li>
          <li>
            <B>Analytics and preference cookies</B> help us understand how the site is used and
            improve it. We use these only with your consent.
          </li>
        </UL>
        <P>
          You can change your cookie choices at any time through our{' '}
          <A href={company.cookieSettingsPath}>cookie settings</A> or your browser settings. Blocking
          essential cookies may stop parts of the site from working.
        </P>
      </Section>

      <Section n={15} title="Emails and marketing">
        <P>
          Service emails, such as confirmations sent from {company.noReplyEmail} when you raise a
          concern, are part of the Services and are not marketing.
        </P>
        <P>
          We send marketing messages only if you have given your consent. Every marketing message
          identifies us as the sender and includes a simple way to unsubscribe, and we stop sending
          them as soon as you opt out.
        </P>
      </Section>

      <Section n={16} title="Children">
        <P>
          The Services are intended for people aged 18 and over. We do not knowingly collect personal
          data from anyone under 18 without the consent of their parent or legal guardian. If you
          believe a child has provided us with personal data without that consent, please contact us
          and we will take appropriate steps, including destroying the data where required.
        </P>
      </Section>

      <Section n={17} title="Links to other websites">
        <P>
          Our Services may link to websites and services we do not control. This policy does not
          apply to them, so please review their privacy notices before sharing your data.
        </P>
      </Section>

      <Section n={18} title="Changes to this policy">
        <P>
          We may update this policy to reflect changes to our Services, our practices or the law. We
          will post the updated version on this page with a new "Last updated" date. If the changes
          are significant, we will notify you by email or through the Services, and where the change
          requires it, we will ask for your consent again.
        </P>
      </Section>

      <Section n={19} title="Contact us">
        <ContactTable
          rows={[
            ['Controller', `${company.legalName}, CR No. ${company.crNumber}`],
            [
              'Privacy email',
              <A href={`mailto:${company.privacyEmail}`}>{company.privacyEmail}</A>,
            ],
            ['Data Protection Officer', company.dpoName],
            ['Phone', <A href={company.phoneHref}>{company.phone}</A>],
            ['Address', company.nationalAddress],
          ]}
        />
        <P>
          This policy is provided in English. If we publish an Arabic version and there is any
          conflict between the two, the Arabic version prevails.
        </P>
      </Section>
    </LegalLayout>
  )
}
