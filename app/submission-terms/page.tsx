import type { Metadata } from "next"

import { siteConfig } from "lib/site"

const EMAIL = "aanthonymaxgithub@gmail.com"

export const metadata: Metadata = {
  title: "Project Submission Terms",
  description:
    "The terms that apply when submitting a project, including free and paid plans, fees, and refund policy.",
  keywords: [
    "project submission terms",
    "submission fee",
    "free listing",
    "refund policy",
    "submit project",
  ],
  alternates: { canonical: "/submission-terms" },
  openGraph: {
    title: `Project Submission Terms | ${siteConfig.name}`,
    description:
      "The terms that apply when submitting a project, including free and paid plans, fees, and refund policy.",
    url: "/submission-terms",
  },
}

type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }

type Section = { title: string; blocks: Block[] }

const sections: Section[] = [
  {
    title: "1. Plans",
    blocks: [
      {
        type: "p",
        text: "You can submit a project under one of two plans:",
      },
      {
        type: "ul",
        items: [
          "Free — your project is added to the catalog so people can discover it on the platform. No payment is required.",
          "Premium — a one-time fee of $40 USD. Includes everything in the Free plan, plus promotion in curated articles, X (Twitter) posts, and other relevant channels, as well as premium embeds.",
        ],
      },
      {
        type: "p",
        text: "The paid fee covers the time spent reviewing, preparing, publishing, and promoting your project beyond basic catalog listing.",
      },
    ],
  },
  {
    title: "2. Refund Policy",
    blocks: [
      { type: "p", text: "All payments for the Premium plan are final." },
      {
        type: "p",
        text: "Because the submission fee covers the time spent reviewing, preparing, publishing, and promoting your project, no refunds will be issued after payment has been received, regardless of the number of views, clicks, visitors, sales, or any other results your project may receive.",
      },
      {
        type: "p",
        text: "The Free plan does not involve any payment and therefore has no refund terms.",
      },
    ],
  },
  {
    title: "3. Submission Process",
    blocks: [
      { type: "p", text: "To submit a project, you must provide:" },
      {
        type: "ul",
        items: ["Project title", "Tags", "Short description", "Project URL"],
      },
      {
        type: "p",
        text: "You may optionally provide social links, limited to Twitter (X), YouTube, and a GitHub repository. Any of these are optional, and only the links you provide will be displayed.",
      },
      {
        type: "p",
        text: "Screenshots, formatting, and the final presentation of the project listing are prepared by the website owner in consultation with the client.",
      },
      {
        type: "p",
        text: "The website owner may correct grammar, formatting, or layout without changing the overall meaning of the submitted information.",
      },
    ],
  },
  {
    title: "4. Promotion",
    blocks: [
      {
        type: "p",
        text: "Under the Free plan, your project is listed in the catalog and can be discovered by visitors browsing the platform.",
      },
      {
        type: "p",
        text: "Under the Premium plan, the website owner will make reasonable efforts to publish and promote listed projects through the website and related channels where appropriate, including articles, X posts, and other platforms. Premium projects also receive premium embeds for use on websites and READMEs.",
      },
      {
        type: "p",
        text: "However, no guarantees are made regarding views, traffic, user engagement, sales, search engine rankings, or any other results.",
      },
    ],
  },
  {
    title: "5. Content Requirements",
    blocks: [
      { type: "p", text: "By submitting a project, you confirm that:" },
      {
        type: "ul",
        items: [
          "you are the owner of the project or have permission to submit it;",
          "the information you provide is accurate;",
          "your project does not violate any applicable laws or the rights of third parties.",
        ],
      },
      {
        type: "p",
        text: "The website owner reserves the right to refuse publication or remove any project that is unlawful, misleading, offensive, or otherwise inappropriate.",
      },
    ],
  },
  {
    title: "6. Listing Updates",
    blocks: [
      {
        type: "p",
        text: "Minor corrections after publication may be made at the discretion of the website owner.",
      },
      {
        type: "p",
        text: "Submitting a new or substantially modified project may require a new submission fee if you choose the Premium plan.",
      },
    ],
  },
  {
    title: "7. Contact",
    blocks: [
      {
        type: "p",
        text: "If you have any questions regarding your project submission, please contact the website owner using the contact information provided on the website.",
      },
    ],
  },
]

export default function SubmissionTermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">Project Submission Terms</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Last updated: July 23, 2026
      </p>

      <p className="text-muted-foreground mt-6 leading-relaxed">
        By submitting a project, you agree to the following terms. Projects can
        be added for free or under the paid Premium plan.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <div className="text-muted-foreground mt-2 flex flex-col gap-3 leading-relaxed">
              {section.blocks.map((block, index) =>
                block.type === "ul" ? (
                  <ul key={index} className="flex list-disc flex-col gap-1 pl-5">
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={index}>{block.text}</p>
                )
              )}
              {section.title === "7. Contact" && (
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-foreground font-medium underline underline-offset-4"
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
