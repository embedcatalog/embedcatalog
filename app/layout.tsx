import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "components/theme-provider"
import { AuthProvider } from "components/auth-provider"
import { Header } from "components/header"
import { Footer } from "components/footer"
import { HacktoberfestBanner } from "components/hacktoberfest-banner"
import { GithubStars } from "components/github-stars"
import { NotificationProvider } from "components/notification-provider"
import { ScrollToTopButton } from "components/scroll-to-top-button"
import { siteConfig } from "lib/site"

const SITE_NAME = siteConfig.name
const SITE_DESCRIPTION = siteConfig.slogan

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Projects | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "projects",
    "project catalog",
    "project showcase",
    "submit project",
    "developer tools",
    "tags",
    "portfolio",
  ],
  authors: [{ name: "Anthony Max", url: "https://x.com/aanthonymax" }],
  creator: "Anthony Max",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `Projects | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [
      {
        url: "/images/preview.png",
        width: 1071,
        height: 602,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    creator: "@aanthonymax",
    images: ["/images/preview.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
    >
      <body>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <div className="flex min-h-svh flex-col">
                <HacktoberfestBanner />
                <Header githubSlot={<GithubStars />} />
                <div className="flex-1">{children}</div>
                <Footer />
                <ScrollToTopButton />
              </div>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
