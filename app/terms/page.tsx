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
    title: "1. Purpose of the Website",
    paragraphs: [
      "This website is an online public catalog of projects. The website displays publicly available information, including project names, descriptions, images, and links to third-party websites.",
    ],
  },
  {
    title: "2. Public Content",
    paragraphs: [
      "All content available on this website is intended for public viewing. The website does not guarantee the accuracy, completeness, or timeliness of any information displayed.",
    ],
  },
  {
    title: "3. Third-Party Links",
    paragraphs: [
      "The website may contain links to third-party websites and services.",
      "The website owner does not own, control, monitor, or endorse third-party websites and is not responsible for their availability, content, privacy practices, security, products, services, or any damages or losses resulting from their use.",
      "Users access third-party websites entirely at their own risk.",
    ],
  },
  {
    title: "4. Disclaimer",
    paragraphs: [
      'The website is provided on an "AS IS" and "AS AVAILABLE" basis without any guarantees regarding its availability, accuracy, reliability, or fitness for any particular purpose.',
      "The website owner does not guarantee uninterrupted availability, error-free operation, or that the website will always be free of bugs, viruses, or other harmful components.",
    ],
  },
  {
    title: "5. Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by applicable law, the website owner shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising from or related to the use of this website or any third-party website linked from it.",
    ],
  },
  {
    title: "6. Intellectual Property",
    paragraphs: [
      "All trademarks, logos, project names, and other intellectual property displayed on this website remain the property of their respective owners.",
      "Their appearance on this website does not imply any affiliation, sponsorship, endorsement, or ownership unless explicitly stated.",
    ],
  },
  {
    title: "7. Content Removal",
    paragraphs: [
      "If you are the owner of any content displayed on this website and believe that it should be removed or corrected, you may contact the website owner. Valid requests will be reviewed within a reasonable time.",
    ],
  },
  {
    title: "8. Changes",
    paragraphs: [
      "The website owner may update or modify these Terms of Service at any time without prior notice. Continued use of the website after changes are published constitutes acceptance of the updated Terms.",
    ],
  },
  {
    title: "9. Contact",
    paragraphs: [
      "For questions regarding these Terms of Service, please contact the website owner using the contact information provided on the website.",
    ],
  },
]

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: July 5, 2026
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
              {section.title === "9. Contact" && (
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
