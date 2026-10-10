"use client"

import * as React from "react"
import { Check, Loader2 } from "lucide-react"

import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import { useNotification } from "components/notification-provider"
import { cn } from "lib/utils"

export interface NewsletterSubscriptionProps {
  /**
   * Title or headline displayed above the subscription form.
   * Accepts text or elements with highlights.
   */
  title?: React.ReactNode

  /**
   * Explanatory copy under the title.
   */
  description?: React.ReactNode

  /**
   * Placeholder string for the email input field. Defaults to "Enter your email".
   */
  placeholder?: string

  /**
   * Text displayed on the submission button. Defaults to "Subscribe".
   */
  buttonText?: string

  /**
   * Social proof subscriber metric (e.g., "170+" or 250). Pass null or false to hide.
   */
  subscriberCount?: React.ReactNode

  /**
   * Descriptive text following the subscriber counter. Defaults to "builders are already in".
   */
  subscriberLabel?: string

  /**
   * Visual layout variant:
   * - "default": Centered or hero-style section matching OrcDev showcase
   * - "card": Bordered card container
   * - "footer": Compact layout designed for site footers and sidebars
   */
  variant?: "default" | "card" | "footer"

  /**
   * Optional custom CSS class name for the wrapper element.
   */
  className?: string

  /**
   * Optional callback invoked when the user submits a valid email.
   * If omitted, a brief mock subscription is performed.
   */
  onSubscribe?: (email: string) => Promise<void> | void
}

type SubmissionStatus = "idle" | "loading" | "success" | "error"

/**
 * Basic RFC 5322-compliant email format check for client-side feedback.
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function NewsletterSubscription({
  title,
  description,
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  subscriberCount = "170+",
  subscriberLabel = "builders are already in",
  variant = "default",
  className,
  onSubscribe,
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = React.useState("")
  const [status, setStatus] = React.useState<SubmissionStatus>("idle")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const { notify } = useNotification()
  const instanceId = React.useId()
  const inputId = `newsletter-email-${instanceId}`
  const errorId = `newsletter-error-${instanceId}`

  // Default content tailored to EmbedCatalog and variant
  const resolvedTitle =
    title ??
    (variant === "footer" ? (
      "Subscribe to our newsletter"
    ) : (
      <React.Fragment>
        Discover what builders are{" "}
        <span className="text-primary">shipping</span>
      </React.Fragment>
    ))

  const resolvedDescription =
    description ??
    (variant === "footer"
      ? "Get newly listed projects and embeds delivered to your inbox."
      : "If you're building in the open, we'll send curated roundups of top developer tools, open-source projects, and practical embeds. No fluff, unsubscribe whenever.")

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
    if (status === "error") {
      setStatus("idle")
      setErrorMessage(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedEmail = email.trim()

    // Validate email before proceeding
    if (!trimmedEmail) {
      setStatus("error")
      setErrorMessage("Please enter your email address.")
      return
    }

    if (!isValidEmail(trimmedEmail)) {
      setStatus("error")
      setErrorMessage("Please enter a valid email address.")
      return
    }

    setStatus("loading")
    setErrorMessage(null)

    try {
      if (onSubscribe) {
        await onSubscribe(trimmedEmail)
      } else {
        // Fallback simulation when backend integration is pending
        await new Promise((resolve) => setTimeout(resolve, 600))
      }

      setStatus("success")
      setEmail("")
      notify("Subscribed successfully! Welcome aboard.")
    } catch (error) {
      setStatus("error")
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Subscription failed. Please try again."
      )
    }
  }

  const handleReset = () => {
    setStatus("idle")
    setErrorMessage(null)
    setEmail("")
  }

  // Render success feedback once subscription completes
  const renderSuccessState = () => (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm"
    >
      <div className="flex items-center gap-2 font-medium text-foreground">
        <Check className="size-4 text-green-600 dark:text-green-400" />
        <span>You&apos;re subscribed!</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Thanks for joining. We&apos;ll keep you posted on new releases and
        projects.
      </p>
      <button
        type="button"
        onClick={handleReset}
        className="cursor-pointer self-start text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        Subscribe another email
      </button>
    </div>
  )

  // Render form input and attached button
  const renderForm = () => (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="w-full space-y-2">
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <div
          role="group"
          data-slot="button-group"
          className={cn(
            "flex w-full items-stretch rounded-md ring-offset-background transition-shadow",
            "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2"
          )}
        >
          <Input
            id={inputId}
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={placeholder}
            value={email}
            onChange={handleEmailChange}
            disabled={status === "loading"}
            aria-invalid={status === "error"}
            aria-describedby={errorMessage ? errorId : undefined}
            className={cn(
              "h-10 flex-1 rounded-r-none border-r-0 shadow-none focus-visible:border-input focus-visible:ring-0 focus-visible:ring-offset-0",
              status === "error" &&
                "border-destructive aria-invalid:border-destructive"
            )}
          />
          <Button
            type="submit"
            disabled={status === "loading"}
            className="h-10 min-w-28 shrink-0 rounded-l-none px-4"
          >
            {status === "loading" ? (
              <React.Fragment>
                <Loader2 className="size-4 animate-spin" />
                <span>Subscribing...</span>
              </React.Fragment>
            ) : (
              buttonText
            )}
          </Button>
        </div>
        {errorMessage && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium text-destructive"
          >
            {errorMessage}
          </p>
        )}
      </div>
    </form>
  )

  const renderSocialProof = () => {
    if (subscriberCount === null || subscriberCount === false) return null
    return (
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{subscriberCount}</span>{" "}
        {subscriberLabel}
      </p>
    )
  }

  // Footer layout: compact and streamlined
  if (variant === "footer") {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <div>
          <h3 className="text-sm font-medium">{resolvedTitle}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {resolvedDescription}
          </p>
        </div>

        {status === "success" ? renderSuccessState() : renderForm()}

        {renderSocialProof()}
      </div>
    )
  }

  // Card layout: framed in a clean card container
  if (variant === "card") {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="gap-1.5 pb-4">
          <CardTitle className="text-lg">{resolvedTitle}</CardTitle>
          <CardDescription className="text-sm">
            {resolvedDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {status === "success" ? renderSuccessState() : renderForm()}
          {renderSocialProof()}
        </CardContent>
      </Card>
    )
  }

  // Default layout: hero/section style inspired by OrcDev
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-4 text-center lg:items-start lg:text-left",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
          {resolvedTitle}
        </h3>
        <p className="max-w-2xl text-sm text-balance text-muted-foreground">
          {resolvedDescription}
        </p>
      </div>

      <div className="w-full max-w-md">
        {status === "success" ? renderSuccessState() : renderForm()}
      </div>

      {renderSocialProof()}
    </div>
  )
}

export { NewsletterSubscription }
