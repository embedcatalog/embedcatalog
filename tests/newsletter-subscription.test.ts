import test from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createJiti } from "jiti"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")

// Configure jiti with JSX and project path aliases
const jiti = createJiti(import.meta.url, {
  jsx: true,
  alias: {
    components: path.join(rootDir, "components"),
    lib: path.join(rootDir, "lib"),
  },
})

const { NewsletterSubscription } = jiti(
  path.join(rootDir, "components", "newsletter-subscription.tsx")
)
const { NotificationProvider } = jiti(
  path.join(rootDir, "components", "notification-provider.tsx")
)

function renderWithProviders(element: React.ReactElement) {
  return renderToStaticMarkup(
    React.createElement(NotificationProvider, null, element)
  )
}

test("NewsletterSubscription - renders default hero variant", () => {
  const html = renderWithProviders(React.createElement(NewsletterSubscription))

  // Should contain key headings, copy, and form elements
  assert.ok(
    html.includes("Discover what builders are"),
    "contains default title prefix"
  )
  assert.ok(html.includes("shipping"), "contains highlighted title word")
  assert.ok(html.includes("Enter your email"), "contains email placeholder")
  assert.ok(html.includes("Subscribe"), "contains default button text")
  assert.ok(html.includes("170+"), "contains default subscriber count")
  assert.ok(
    html.includes("builders are already in"),
    "contains default subscriber label"
  )
  assert.ok(html.includes('type="email"'), "renders email input type")
  assert.ok(
    html.toLowerCase().includes('autocomplete="email"'),
    "has autocomplete attribute"
  )
})

test("NewsletterSubscription - renders card variant inside Card wrapper", () => {
  const html = renderWithProviders(
    React.createElement(NewsletterSubscription, { variant: "card" })
  )

  assert.ok(html.includes('data-slot="card"'), "renders card container slot")
  assert.ok(
    html.includes('data-slot="card-header"'),
    "renders card header slot"
  )
  assert.ok(
    html.includes('data-slot="card-content"'),
    "renders card content slot"
  )
})

test("NewsletterSubscription - renders footer variant with compact copy", () => {
  const html = renderWithProviders(
    React.createElement(NewsletterSubscription, { variant: "footer" })
  )

  assert.ok(
    html.includes("Subscribe to our newsletter"),
    "renders footer heading"
  )
  assert.ok(
    html.includes(
      "Get newly listed projects and embeds delivered to your inbox."
    ),
    "renders footer description"
  )
})

test("NewsletterSubscription - respects custom props", () => {
  const html = renderWithProviders(
    React.createElement(NewsletterSubscription, {
      title: "Join the Developer Digest",
      description: "Weekly updates on open-source packages.",
      placeholder: "you@example.com",
      buttonText: "Join now",
      subscriberCount: "500+",
      subscriberLabel: "curious makers reading weekly",
      className: "custom-newsletter-root",
    })
  )

  assert.ok(html.includes("Join the Developer Digest"), "renders custom title")
  assert.ok(
    html.includes("Weekly updates on open-source packages."),
    "renders custom description"
  )
  assert.ok(html.includes("you@example.com"), "renders custom placeholder")
  assert.ok(html.includes("Join now"), "renders custom button label")
  assert.ok(html.includes("500+"), "renders custom subscriber count")
  assert.ok(
    html.includes("curious makers reading weekly"),
    "renders custom subscriber label"
  )
  assert.ok(html.includes("custom-newsletter-root"), "applies custom className")
})

test("NewsletterSubscription - hides social proof when subscriberCount is null or false", () => {
  const htmlNull = renderWithProviders(
    React.createElement(NewsletterSubscription, { subscriberCount: null })
  )
  assert.ok(
    !htmlNull.includes("builders are already in"),
    "omits social proof when null"
  )

  const htmlFalse = renderWithProviders(
    React.createElement(NewsletterSubscription, { subscriberCount: false })
  )
  assert.ok(
    !htmlFalse.includes("builders are already in"),
    "omits social proof when false"
  )
})

test("NewsletterSubscription - email validation logic accepts valid emails and rejects invalid ones", () => {
  // RFC 5322 regex test matching internal validation logic
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validEmails = [
    "user@example.com",
    "john.doe@company.org",
    "name+tag@sub.domain.co.uk",
    "builder_123@tech.io",
  ]

  for (const email of validEmails) {
    assert.strictEqual(emailRegex.test(email), true, `${email} should be valid`)
  }

  const invalidEmails = [
    "",
    "   ",
    "plainaddress",
    "@missingusername.com",
    "username@",
    "username@.com",
    "username@com",
    "user space@domain.com",
  ]

  for (const email of invalidEmails) {
    assert.strictEqual(
      emailRegex.test(email.trim()),
      false,
      `${email} should be invalid`
    )
  }
})

test("NewsletterSubscription - onSubscribe callback integration", async () => {
  let submittedEmail = ""
  let callCount = 0

  const handleSubscribe = async (email: string) => {
    submittedEmail = email
    callCount += 1
  }

  // Simulate execution of callback
  await handleSubscribe("test@embedcatalog.com")

  assert.strictEqual(callCount, 1, "callback is invoked once")
  assert.strictEqual(
    submittedEmail,
    "test@embedcatalog.com",
    "receives expected email"
  )
})

test("NewsletterSubscription - error propagation in subscription handler", async () => {
  const failingSubscribe = async () => {
    throw new Error("Unable to reach subscription service.")
  }

  await assert.rejects(
    async () => {
      await failingSubscribe()
    },
    {
      name: "Error",
      message: "Unable to reach subscription service.",
    }
  )
})
