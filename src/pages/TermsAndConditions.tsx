import { company } from '@/content/company'
import LegalLayout, {
  A,
  B,
  ContactTable,
  Note,
  P,
  Section,
  ShortVersion,
  UL,
  type TocEntry,
} from './LegalLayout'

/**
 * Terms and Conditions, converted from `terms-and-conditions.html`.
 *
 * Drafted for the Kingdom of Saudi Arabia (PDPL and Implementing Regulations).
 * Have a Saudi-licensed lawyer review before publishing.
 *
 * Every value the source marked with <mark class="fill"> now reads from
 * `src/content/company.ts`.
 */

export const ROUTE = '/terms-and-conditions'

const TOC: TocEntry[] = [
  { id: 's1', n: 1, title: 'About these terms' },
  { id: 's2', n: 2, title: 'Definitions' },
  { id: 's3', n: 3, title: 'Eligibility and your account' },
  { id: 's4', n: 4, title: 'Our Services' },
  { id: 's5', n: 5, title: 'Submitting a concern' },
  { id: 's6', n: 6, title: 'Acceptable use' },
  { id: 's7', n: 7, title: 'Content you submit' },
  { id: 's8', n: 8, title: 'Intellectual property' },
  { id: 's9', n: 9, title: 'Fees' },
  { id: 's10', n: 10, title: 'Electronic communications' },
  { id: 's11', n: 11, title: 'Privacy and personal data' },
  { id: 's12', n: 12, title: 'Third-party links and services' },
  { id: 's13', n: 13, title: 'Disclaimers' },
  { id: 's14', n: 14, title: 'Limitation of liability' },
  { id: 's15', n: 15, title: 'Your responsibility to us' },
  { id: 's16', n: 16, title: 'Suspension and termination' },
  { id: 's17', n: 17, title: 'Changes to these Terms' },
  { id: 's18', n: 18, title: 'Governing law and disputes' },
  { id: 's19', n: 19, title: 'General' },
  { id: 's20', n: 20, title: 'Contact us' },
]

const PRIVACY = '/privacy-policy'

export default function TermsAndConditions() {
  return (
    <LegalLayout
      route={ROUTE}
      title="Terms and Conditions"
      documentTitle={`Terms and Conditions | ${company.name}`}
      metaDescription={`Terms and Conditions for ${company.name}, ${company.shortAddress}.`}
      toc={TOC}
    >
      <ShortVersion>
        <P>
          These terms explain the rules for using the {company.name} website and member platform,
          including how you raise a concern with us. In short:
        </P>
        <UL>
          <li>
            You must be 18 or older, or have a parent or guardian's permission, and keep your account
            details accurate and secure.
          </li>
          <li>
            Only submit concerns that are honest and lawful. Don't use the platform for emergencies.
          </li>
          <li>
            You keep ownership of what you submit; you let us use it only to handle your concern and
            run the service.
          </li>
          <li>These terms are governed by the laws of the {company.country}.</li>
        </UL>
        <P>
          Please read the full terms below. They work together with our{' '}
          <A href={PRIVACY}>Privacy Policy</A>.
        </P>
      </ShortVersion>

      <Section n={1} title="About these terms">
        <P>
          These Terms and Conditions (the "Terms") govern your access to and use of the website at{' '}
          {company.website}, the {company.name} member platform, and any related services, emails and
          features we provide (together, the "Services").
        </P>
        <P>
          The Services are operated by {company.legalName}, a company registered in the{' '}
          {company.country} under Commercial Registration No. {company.crNumber}, with its national
          address at {company.nationalAddress} ("{company.name}", "we", "us" or "our").
        </P>
        <P>
          By creating an account, submitting a concern, or otherwise using the Services, you confirm
          that you have read, understood and agree to these Terms. If you do not agree, please do not
          use the Services.
        </P>
      </Section>

      <Section n={2} title="Definitions">
        <P>In these Terms:</P>
        <UL>
          <li>
            <B>Member</B> means a person who has registered for an account on the Services, or who
            submits a concern through them.
          </li>
          <li>
            <B>Concern</B> means any issue, complaint, feedback, request or report you submit to us
            through the Services, together with any attachments.
          </li>
          <li>
            <B>Content</B> means text, files, images and other material submitted to or made
            available through the Services.
          </li>
          <li>
            <B>Personal Data</B> has the meaning given in the Personal Data Protection Law issued by
            Royal Decree No. (M/19) dated 9/2/1443H, as amended (the "PDPL").
          </li>
        </UL>
      </Section>

      <Section n={3} title="Eligibility and your account">
        <P>
          You must be at least 18 years old to create an account. If you are under 18, you may use
          the Services only with the consent and supervision of a parent or legal guardian, who
          accepts these Terms on your behalf.
        </P>
        <P>When you register, you agree to:</P>
        <UL>
          <li>provide accurate, current and complete information, and keep it up to date;</li>
          <li>
            keep your password and login details confidential and not share your account with anyone
            else;
          </li>
          <li>
            tell us promptly at <A href={`mailto:${company.supportEmail}`}>{company.supportEmail}</A>{' '}
            if you believe your account has been accessed without your permission.
          </li>
        </UL>
        <P>
          You are responsible for activity that takes place under your account, unless it results
          from our failure to take reasonable security measures.
        </P>
      </Section>

      <Section n={4} title="Our Services">
        <P>
          {company.name} builds digital applications, including websites and mobile apps. The
          Services allow Members to raise concerns, track their progress, and communicate with our
          team.
        </P>
        <P>
          We may update, improve, suspend or discontinue any part of the Services from time to time.
          Where a change significantly affects you, we will give you reasonable notice where
          practical.
        </P>
        <P>
          If you engage us to design or develop a website, mobile application or other digital
          product, that engagement will be governed by a separate written agreement. Where that
          agreement conflicts with these Terms, the separate agreement prevails for that engagement.
        </P>
      </Section>

      <Section n={5} title="Submitting a concern">
        <P>When you submit a concern:</P>
        <UL>
          <li>
            you confirm that the information you provide is true and accurate to the best of your
            knowledge;
          </li>
          <li>
            you will receive a confirmation email from <B>{company.noReplyEmail}</B> with a reference
            number. This address does not receive replies, so please use the contact details in
            section 20 or the tracking link in the email to add information;
          </li>
          <li>
            we aim to begin reviewing your concern within a few minutes of receipt. Review and
            resolution times are targets, not guarantees, and may depend on the nature of the concern
            and the information available;
          </li>
          <li>
            we may contact you for further details, and we may decline to act on a concern that is
            incomplete, abusive, unlawful or outside the scope of the Services, in which case we will
            tell you.
          </li>
        </UL>
        <Note>
          <B>Not for emergencies.</B> The Services are not an emergency service. If you or anyone
          else is in immediate danger, contact the relevant emergency services in the Kingdom
          directly.
        </Note>
        <P>
          Please include only the information needed to explain your concern. Avoid sharing sensitive
          personal data (for example health, financial or criminal information), or other people's
          personal data, unless it is necessary and you are entitled to share it. See our{' '}
          <A href={PRIVACY}>Privacy Policy</A> for how we handle this information.
        </P>
      </Section>

      <Section n={6} title="Acceptable use">
        <P>
          You agree to use the Services lawfully and respectfully. You must not use the Services to:
        </P>
        <UL>
          <li>
            submit content that is unlawful, false, misleading, defamatory, threatening, harassing,
            or that infringes public order, public morals or the privacy of others, including any act
            prohibited by the Anti-Cyber Crime Law;
          </li>
          <li>
            impersonate any person or organisation, or misrepresent your connection with them;
          </li>
          <li>
            submit content you do not have the right to share, including another person's
            confidential information or intellectual property;
          </li>
          <li>
            upload viruses, malware or any code designed to disrupt, damage or gain unauthorised
            access to any system;
          </li>
          <li>
            attempt to bypass security features, probe for vulnerabilities, or access accounts or
            data that are not yours;
          </li>
          <li>
            collect data from the Services by automated means (such as scraping or bots) without our
            written permission;
          </li>
          <li>
            overload, interfere with or disrupt the Services or the networks connected to them.
          </li>
        </UL>
        <P>
          We may remove content, restrict access, or report matters to the competent authorities
          where we reasonably believe these rules have been broken or where required by law.
        </P>
      </Section>

      <Section n={7} title="Content you submit">
        <P>
          You keep ownership of the content you submit. By submitting it, you grant {company.name} a
          non-exclusive, royalty-free licence to store, copy, process and use that content for the
          purposes of handling your concern, operating and improving the Services, and meeting our
          legal obligations.
        </P>
        <P>
          This licence continues for as long as we retain the content in line with our{' '}
          <A href={PRIVACY}>Privacy Policy</A>. It does not allow us to publish your content or use
          it for marketing without your consent.
        </P>
      </Section>

      <Section n={8} title="Intellectual property">
        <P>
          The Services and everything in them, including the {company.name} name, logo, brand mark,
          designs, software, text and graphics (excluding content submitted by Members), belong to{' '}
          {company.name} or its licensors and are protected by the intellectual property laws of the{' '}
          {company.country} and international treaties.
        </P>
        <P>
          You may use the Services for their intended purpose only. You must not copy, modify,
          distribute, sell or create derivative works from any part of the Services, or use our name
          or brand, without our prior written permission.
        </P>
      </Section>

      <Section n={9} title="Fees">
        <P>
          Submitting a concern and using the member platform is free of charge unless we tell you
          otherwise before you use a paid feature.
        </P>
        <P>
          Where we offer paid services, prices will be shown in Saudi riyals (SAR) and will include
          or clearly state any applicable value added tax. Payment terms, invoicing and refunds for
          paid services will be set out in the relevant order or agreement.
        </P>
      </Section>

      <Section n={10} title="Electronic communications">
        <P>
          By using the Services, you agree to receive communications from us electronically,
          including by email and in-app notices. In line with the Electronic Transactions Law, you
          agree that electronic records, notices and confirmations we send you have the same legal
          effect as written documents.
        </P>
        <P>
          Service messages, such as concern confirmations and updates, are part of the Services and
          are sent whether or not you have opted in to marketing. We will only send marketing
          messages with your consent, as described in our <A href={PRIVACY}>Privacy Policy</A>.
        </P>
      </Section>

      <Section n={11} title="Privacy and personal data">
        <P>
          We process your personal data in accordance with the PDPL, its Implementing Regulations,
          and our <A href={PRIVACY}>Privacy Policy</A>, which explains what data we collect, why we
          collect it, how long we keep it, and your rights. The Privacy Policy is a separate document
          and does not form part of these Terms.
        </P>
      </Section>

      <Section n={12} title="Third-party links and services">
        <P>
          The Services may contain links to, or rely on, websites and services operated by third
          parties. We are not responsible for their content, security or privacy practices. Your use
          of third-party services is governed by their own terms.
        </P>
      </Section>

      <Section n={13} title="Disclaimers">
        <P>
          We work hard to keep the Services available, secure and accurate. However, to the extent
          permitted by the laws of the Kingdom, the Services are provided on an "as is" and "as
          available" basis, and we do not guarantee that they will be uninterrupted, error-free, or
          that every concern will be resolved in the way you prefer.
        </P>
        <P>
          Information on the Services is for general purposes and does not constitute legal,
          financial or professional advice.
        </P>
      </Section>

      <Section n={14} title="Limitation of liability">
        <P>To the extent permitted by the laws of the {company.country}:</P>
        <UL>
          <li>
            we are not liable for any indirect or consequential loss, or for loss of profit, revenue,
            data or goodwill, arising from your use of or inability to use the Services;
          </li>
          <li>
            our total liability to you for any claim relating to the free Services is limited to{' '}
            {company.liabilityCap}; for paid services, it is limited to the fees you paid us for the
            relevant service in the 12 months before the claim.
          </li>
        </UL>
        <P>
          Nothing in these Terms excludes or limits any liability that cannot be excluded or limited
          under the laws of the Kingdom, including liability arising from our wilful misconduct or
          gross negligence.
        </P>
      </Section>

      <Section n={15} title="Your responsibility to us">
        <P>
          You agree to compensate {company.name} for any loss, damage or reasonable costs (including
          legal fees) we suffer as a direct result of your breach of these Terms or your misuse of
          the Services, to the extent permitted by law.
        </P>
      </Section>

      <Section n={16} title="Suspension and termination">
        <P>
          You may stop using the Services and ask us to close your account at any time by contacting
          us.
        </P>
        <P>
          We may suspend or close your account, with notice where reasonably possible, if you
          seriously or repeatedly breach these Terms, if we are required to by law or a competent
          authority, or if continuing to provide the Services to you would expose us or others to
          legal or security risk.
        </P>
        <P>
          When your account closes, we will handle your personal data as described in our{' '}
          <A href={PRIVACY}>Privacy Policy</A>. Sections that by their nature should continue,
          including sections 7, 8, 14, 15 and 18, will survive termination.
        </P>
      </Section>

      <Section n={17} title="Changes to these Terms">
        <P>
          We may update these Terms from time to time, for example to reflect changes to the Services
          or to the law. We will post the updated Terms on this page with a new "Last updated" date,
          and where the changes are significant we will notify you by email or through the Services
          before they take effect.
        </P>
        <P>
          If you continue to use the Services after the changes take effect, you accept the updated
          Terms. If you do not agree, you should stop using the Services and may close your account.
        </P>
      </Section>

      <Section n={18} title="Governing law and disputes">
        <P>
          These Terms are governed by and interpreted in accordance with the laws and regulations in
          force in the {company.country}.
        </P>
        <P>
          If a dispute arises, please contact us first. We will try in good faith to resolve it
          amicably within 30 days. If it cannot be resolved, it will be referred to the competent
          courts in the {company.country}, in the city of {company.courtCity}.
        </P>
        <P>
          Nothing in this section affects your right to file a complaint with any competent
          authority, including the Ministry of Commerce or the Saudi Data and Artificial Intelligence
          Authority (SDAIA).
        </P>
      </Section>

      <Section n={19} title="General">
        <UL>
          <li>
            <B>Language.</B> These Terms are provided in English. If we publish an Arabic version and
            there is any conflict between the two, the Arabic version prevails.
          </li>
          <li>
            <B>Entire agreement.</B> These Terms, together with any separate agreement referred to in
            section 4, form the entire agreement between you and us about the Services.
          </li>
          <li>
            <B>Severability.</B> If any part of these Terms is found invalid or unenforceable, the
            rest remains in full effect.
          </li>
          <li>
            <B>No waiver.</B> If we do not enforce a right straight away, we have not given up that
            right.
          </li>
          <li>
            <B>Transfer.</B> We may transfer our rights and obligations under these Terms to another
            organisation, for example as part of a restructuring, and will tell you if this happens.
            You may not transfer your rights without our written consent.
          </li>
          <li>
            <B>Events beyond our control.</B> We are not responsible for delays or failures caused by
            events outside our reasonable control.
          </li>
        </UL>
      </Section>

      <Section n={20} title="Contact us">
        <P>If you have any questions about these Terms, please contact us:</P>
        <ContactTable
          rows={[
            ['Company', `${company.legalName}, CR No. ${company.crNumber}`],
            [
              'Email',
              <A href={`mailto:${company.supportEmail}`}>{company.supportEmail}</A>,
            ],
            ['Phone', <A href={company.phoneHref}>{company.phone}</A>],
            ['Address', company.nationalAddress],
            ['Hours', company.officeHours],
          ]}
        />
        <P>
          Please note that <B>{company.noReplyEmail}</B> is used for automated messages only and does
          not receive replies.
        </P>
      </Section>
    </LegalLayout>
  )
}
