import { LegalPage, type LegalSection } from "@/components/LegalPage";

const sections: LegalSection[] = [
  {
    title: "Overview",
    body: [
      "CopyForge (\"we\", \"our\", or \"the service\") is an AI-powered copywriting tool operated as an online software-as-a-service (SaaS) platform. This Privacy Policy explains what information we collect, how we use it, and the choices available to you.",
      "By creating an account, using the service as a visitor, or purchasing credits, you agree to the practices described in this policy. If you do not agree, please do not use CopyForge.",
    ],
  },
  {
    title: "Who We Are",
    body: [
      "CopyForge is operated by its owner (the \"Service Operator\"). For privacy questions, data deletion requests, or abuse reports, contact support using the link at the bottom of this page.",
    ],
  },
  {
    title: "Information We Collect",
    body: [
      "We collect only the information needed to operate the service:",
    ],
    bullets: [
      "Account information: your email address, used exclusively for passwordless authentication and essential service communications.",
      "Usage data: the number of copies you generate, credits remaining, and saved copies in your library. This is stored to enforce plan limits and provide your history.",
      "Briefing content: the product, audience, tone, and goal information you enter to generate copy, plus the generated output. This is stored in your private history only if you choose to save it.",
      "Technical data: basic session information required to keep you signed in (see Cookies and Local Storage below).",
    ],
  },
  {
    title: "How We Authenticate You (Email OTP)",
    body: [
      "CopyForge uses passwordless authentication. When you sign in, we send a one-time 6-digit code (OTP) to the email address you provide. You enter that code to complete sign-in. We never store passwords, because none are collected.",
      "The OTP is valid for 15 minutes and can only be used once. If you request a new code, the previous one is invalidated.",
    ],
  },
  {
    title: "Third-Party AI Processing (Google Gemini)",
    body: [
      "Copy generation is powered by Google's Gemini API. When you submit a briefing and request copy, the briefing fields (product, audience, tone, goal, and related fields) are sent to Google for processing, and the generated copy is returned to you.",
      "This means the content of your briefings is processed by Google as part of the AI generation request. We do not send your email address, account identifiers, or other account data to Google for this purpose — only the briefing content needed to generate your copy.",
      "Google's handling of this data is governed by Google's own terms and privacy policy. If you do not want your briefing content processed by Google, you should not use the copy generation feature.",
    ],
  },
  {
    title: "Payments (PayPal)",
    body: [
      "Credit purchases are processed through PayPal. When you choose to buy credits, you are redirected to PayPal to complete the payment. We do not collect or store your full payment card details on CopyForge servers.",
      "We receive a payment confirmation from PayPal (transaction reference, plan or pack purchased, and status) so we can grant the credits you paid for and keep an audit trail. PayPal's own privacy policy applies to the payment itself.",
    ],
  },
  {
    title: "Cookies and Local Storage",
    body: [
      "We use browser local storage and session cookies strictly for session management: keeping you signed in between page loads, remembering your language preference, and remembering your last selected template.",
      "We do not use advertising cookies, cross-site tracking pixels, or third-party analytics trackers that profile you across other websites.",
    ],
  },
  {
    title: "What We Do Not Do",
    body: ["For clarity, we do not:"],
    bullets: [
      "Sell your personal information to anyone.",
      "Share your email address with third parties for marketing.",
      "Send your account data to Google or PayPal beyond what those integrations strictly require.",
      "Use your briefing content to train AI models.",
      "Read or publish your saved copies — they are private to your account.",
    ],
  },
  {
    title: "Data Retention and Deletion",
    body: [
      "Your account data (email, credits, saved copies, and usage history) is retained for as long as your account is active. You can delete individual saved copies at any time from the library.",
      "To delete your account and all associated data, contact support using the link at the bottom of this page. We will process deletion requests within 30 days. Some transaction records may be retained where required for accounting or legal compliance.",
    ],
  },
  {
    title: "Anonymous Visitors",
    body: [
      "You can explore CopyForge as an anonymous visitor without providing an email. Anonymous sessions receive a small trial allowance (not the full welcome credit package) and are subject to stricter daily generation limits. Converting to a registered account preserves your remaining credits and saved copies.",
      "Because anonymous sessions are not tied to a verified email, they carry fewer rights: we cannot recover an anonymous session if you clear your browser storage, and anonymous data may be deleted more aggressively.",
    ],
  },
  {
    title: "Security",
    body: [
      "API keys, payment credentials, and service secrets are stored server-side and are never exposed to the browser. Authentication uses short-lived signed tokens. Access to the production database is restricted to the Service Operator.",
      "No system is perfectly secure. If you believe you have found a security issue, please report it to support rather than exploiting it.",
    ],
  },
  {
    title: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy as the service evolves. Material changes will be reflected on this page with an updated date. Continued use of CopyForge after changes take effect constitutes acceptance of the updated policy.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For any privacy question, data access request, or deletion request, contact us at the support address linked at the bottom of this page.",
    ],
  },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      version="v1.0"
      updated="Last updated: September 2026"
      sections={sections}
    />
  );
}
