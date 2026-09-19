import type { Metadata } from "next"

import { siteConfig } from "lib/site"

const EMAIL = "aanthonymaxgithub@gmail.com"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The Terms of Service governing the use of this public project catalog website.",
  keywords: ["terms of service", "terms of use", "legal", "agreement"],
  alternates: { canonical: "/terms" },
  openGraph: {
    title: `Terms of Service | ${siteConfig.name}`,
    description:
      "The Terms of Service governing the use of this public project catalog website.",
    url: "/terms",
  },
}

const sections = [
  {
    title: "1. About the service",
    paragraphs: [
      "EmbedCatalog is an online catalog for discovering projects and creating or displaying embeds. Some features require an account; some submission and promotional services may be paid.",
    ],
  },
  {
    title: "2. Accounts",
    paragraphs: [
      "You must provide accurate information, keep your credentials secure, and promptly tell us if you believe your account has been compromised. You are responsible for activity carried out through your account.",
      "You must be legally capable of entering these Terms. If you use the service for an organization, you confirm that you have authority to bind it.",
    ],
  },
  {
    title: "3. User content and public listings",
    paragraphs: [
      "You retain ownership of content you submit. You grant the operator a worldwide, non-exclusive, royalty-free license to host, reproduce, adapt for formatting, publish, display, distribute, and promote that content in connection with EmbedCatalog and its related channels.",
      "You confirm that you own or have permission to submit the content, that it is accurate enough for publication, and that its publication does not violate law, privacy, confidentiality, intellectual-property, publicity, or other rights.",
      "Published listings are public. Do not submit confidential information or personal data that should not be publicly displayed.",
    ],
  },
  {
    title: "4. Acceptable use and moderation",
    paragraphs: [
      "You may not use the service for unlawful, fraudulent, abusive, infringing, harmful, misleading, or automated activity that burdens or compromises the service. We may review, reject, restrict, edit for formatting, unpublish, or remove content or accounts that breach these Terms or create risk.",
      "We do not promise to monitor every listing or endorse any listed project.",
    ],
  },
  {
    title: "5. Paid services",
    paragraphs: [
      "Prices, scope, and payment conditions for paid submissions are described in the Project Submission Terms and agreed with the operator by email or another available contact channel. The website does not provide an on-site checkout or integrated payment gateway. After the details are agreed, you may send the payment directly to the operator through PayPal using the payment instructions provided by the operator. PayPal processes that transaction under its own terms and privacy policy. Taxes, PayPal fees, bank fees, and currency-conversion charges may apply unless stated otherwise.",
      "Paid services are not a guarantee of traffic, sales, rankings, approval, publication, or a particular promotional result. Refund rules are described in the Project Submission Terms and do not limit rights that cannot legally be waived.",
    ],
  },
  {
    title: "6. Intellectual Property",
    paragraphs: [
      "EmbedCatalog, its original software, design, text, and branding belong to the operator or its licensors. Project names, logos, trademarks, and submitted materials remain with their respective owners. Their display does not imply affiliation or endorsement.",
      "You may not copy, scrape, frame, reverse engineer, or commercially exploit the service except as allowed by law or by written permission. Open-source code, if any, is governed by its applicable license.",
    ],
  },
  {
    title: "7. Third-party services",
    paragraphs: [
      "The service links to or relies on third parties, including Supabase, analytics providers, PayPal, hosting providers, project websites, and social networks. We do not control their availability, content, security, or privacy practices. Use them at your own risk and review their terms. PayPal is used for direct payments arranged outside the website; the website does not operate or control PayPal's payment infrastructure.",
    ],
  },
  {
    title: "8. Disclaimers and liability",
    paragraphs: [
      'To the maximum extent permitted by law, the service is provided "AS IS" and "AS AVAILABLE" without warranties of availability, accuracy, fitness, or uninterrupted or error-free operation. We are not liable for indirect, incidental, special, consequential, or loss-of-profit damages arising from the service or third-party services.',
      "Nothing in these Terms excludes or limits liability that cannot be excluded under applicable law, including mandatory consumer rights, liability for fraud, or liability for death or personal injury caused by negligence.",
    ],
  },
  {
    title: "9. Suspension and termination",
    paragraphs: [
      "You may stop using the service at any time. We may suspend or terminate access, or discontinue features, when reasonably necessary for security, legal compliance, abuse prevention, non-payment, or a breach of these Terms. Terms that should survive termination will continue to apply.",
    ],
  },
  {
    title: "10. Governing law and contact",
    paragraphs: [
      "These Terms are governed by the laws of the Republic of Kazakhstan, without preventing you from relying on mandatory consumer protections in the country where you live. Courts of Kazakhstan will have jurisdiction to the extent permitted by law.",
      "For questions, notices, or content complaints, contact the operator at the email address below.",
    ],
  },
]

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: September 19, 2026
      </p>

      <p className="mt-6 leading-relaxed text-muted-foreground">
        Welcome to this website. By accessing or using the website, you agree to
        these Terms of Service. If you do not agree with these terms, please do
        not use the website.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <div className="mt-2 flex flex-col gap-3 leading-relaxed text-muted-foreground">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {section.title === "10. Governing law and contact" && (
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${EMAIL}`}
                    className="font-medium text-foreground underline underline-offset-4"
                  >
                    {EMAIL}
                  </a>
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
