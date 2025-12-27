import React from "react";
import { 
  ShieldCheckIcon,
  CreditCardIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  LockClosedIcon,
  EnvelopeIcon,
  UserIcon,
  CogIcon
} from "@heroicons/react/24/outline";

const PrivacyPolicy = () => {
  const lastUpdated = "January 15, 2024";

  const sections = [
    {
      id: 1,
      title: "Information We Collect",
      icon: DocumentTextIcon,
      content: `We collect information only when necessary to operate our services, process payments, and comply with legal obligations.

Personal Information May Include:
• Full name
• Email address
• Billing address
• Country and IP address
• Account login information (if applicable)

This data is collected when you:
• Create an account
• Make a purchase
• Contact customer support
• Subscribe to updates`
    },
    {
      id: 2,
      title: "Payment Information (Stripe)",
      icon: CreditCardIcon,
      content: `All payments are processed securely by Stripe.

⚠️ IMPORTANT: Odlo Fashion does NOT store or process credit/debit card details.

Stripe may collect:
• Card details
• Transaction metadata
• Fraud-prevention signals

Stripe complies with PCI-DSS standards.
Stripe's Privacy Policy applies in parallel.`
    },
    {
      id: 3,
      title: "How We Use Your Information",
      icon: CogIcon,
      content: `We use collected data for the following legitimate purposes:
• Processing payments and digital delivery
• Granting product access
• Customer support and communication
• Order confirmations and invoices
• Fraud detection and prevention
• Legal compliance
• Improving user experience

We do not sell, rent, or trade your personal data.`
    },
    {
      id: 4,
      title: "Legal Basis for Processing (GDPR)",
      icon: ShieldCheckIcon,
      content: `Under GDPR, we process personal data based on:
• Contractual necessity: to deliver purchased products
• Legal obligations: accounting, tax, fraud prevention
• Legitimate interests: security, service improvement
• Consent: email communication (where applicable)`
    },
    {
      id: 5,
      title: "Cookies & Tracking Technologies",
      icon: GlobeAltIcon,
      content: `Odlo Fashion uses cookies to:
• Maintain secure sessions
• Remember user preferences
• Enable analytics
• Ensure checkout functionality

Cookies may include:
• Essential cookies (required for site operation)
• Analytics cookies (performance insights)

You may disable cookies in your browser, but this may affect site functionality.`
    },
    {
      id: 6,
      title: "Third-Party Services",
      content: `We share data only with trusted providers, including:
• Stripe — payment processing & fraud prevention
• WooCommerce — order and account management
• Hosting providers — website operation
• Analytics tools — site performance tracking

All third parties comply with applicable data protection laws.`
    },
    {
      id: 7,
      title: "Data Security",
      icon: LockClosedIcon,
      content: `We implement industry-standard security measures:
• SSL encryption
• Secure servers
• Restricted access controls
• Encrypted communications

While no system is 100% secure, we take all reasonable steps to protect your data.`
    },
    {
      id: 8,
      title: "Your Rights Under GDPR",
      icon: UserIcon,
      content: `If you are located in the EU or covered by GDPR, you have the right to:
• Access your personal data
• Request correction of inaccurate data
• Request deletion ("right to be forgotten")
• Restrict or object to processing
• Data portability
• Withdraw consent at any time

To exercise these rights, contact us at:
📧 privacy@odlofashion.com

We respond within 30 days, as required by law.`
    },
    {
      id: 9,
      title: "International Data Transfers",
      content: `Your data may be processed outside your country of residence, including regions with different data protection laws.

We ensure appropriate safeguards are in place for international transfers.`
    },
    {
      id: 10,
      title: "Children's Privacy",
      content: `Odlo Fashion does not knowingly collect data from individuals under the age of 18.

If you believe a minor has provided data, contact us immediately for removal.`
    },
    {
      id: 11,
      title: "Fraud Prevention & Risk Monitoring",
      content: `To protect against unauthorized transactions, we may:
• Monitor IP addresses
• Analyze transaction patterns
• Share risk data with Stripe

This ensures secure payments and helps prevent chargebacks.`
    },
    {
      id: 12,
      title: "Changes to This Privacy Policy",
      content: `We may update this Privacy Policy from time to time.

Updates will be posted on this page with a revised "Last Updated" date.
Continued use of the site constitutes acceptance of changes.`
    },
    {
      id: 13,
      title: "Contact Information",
      icon: EnvelopeIcon,
      content: `For privacy-related inquiries, contact:

📧 privacy@odlofashion.com
🌐 odlofashion.com`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-5 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShieldCheckIcon className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <p className="text-gray-700 mb-4">
            At <span className="font-semibold">Odlo Fashion</span> ("Odlo," "we," "us," or "our"), accessible via <span className="font-semibold">odlofashion.com</span>, protecting your privacy and personal data is a core priority.
          </p>
          <p className="text-gray-700">
            This Privacy Policy explains <span className="font-semibold">what data we collect, how we use it, how it is protected, and your rights</span> under applicable data protection laws, including the <span className="font-semibold">General Data Protection Regulation (GDPR)</span>.
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-center font-medium">
              By using our website or purchasing our products, you consent to the practices described in this policy.
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {Icon && <Icon className="h-6 w-6 text-gray-700 flex-shrink-0 mt-1" />}
                    <h2 className="text-xl font-bold text-gray-900">
                      {section.id}. {section.title}
                    </h2>
                  </div>
                  <div className="text-gray-700 whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compliance Section */}
        <div className="mt-12 bg-white rounded-xl shadow p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why this policy protects you
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Meets GDPR transparency requirements",
              "Aligns with Stripe data handling rules",
              "Clearly separates payment processing responsibility",
              "Reduces compliance risk",
              "Supports timely Stripe payouts",
              "Strengthens dispute defense"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <ShieldCheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <div className="bg-linear-to-r from-black to-gray-800 text-white rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Odlo Fashion</h3>
            <p className="text-gray-300 italic">Luxury Designed. Digitally Delivered.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;