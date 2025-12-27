import React from "react";
import { 
  DocumentTextIcon,
  ExclamationCircleIcon,
  CreditCardIcon,
  LockClosedIcon,
  ScaleIcon,
  CogIcon,
  EnvelopeIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

const TermsConditions = () => {
  const lastUpdated = "January 15, 2024";

  const sections = [
    {
      id: 1,
      title: "Nature of Our Products (Important)",
      icon: DocumentTextIcon,
      content: `Odlo Fashion sells digital products only, including but not limited to:
• Branding kits
• Logo templates
• Social media templates
• Posters & prints
• 3D fashion assets
• Mockups
• Bundles & digital collections

⚠️ IMPORTANT: No physical products are shipped.

All products are delivered digitally via:
• Secure download links
• Email delivery
• Customer account access`
    },
    {
      id: 2,
      title: "Digital Product Delivery",
      content: `• Delivery occurs electronically after successful payment confirmation.
• Access is granted immediately or within a clearly stated delivery window.
• Once digital access is provided, the product is considered delivered and consumed.

This delivery model complies with Stripe's Digital Goods policy.`
    },
    {
      id: 3,
      title: "Payments & Pricing",
      icon: CreditCardIcon,
      content: `• All prices are listed in USD unless stated otherwise.
• Payments are processed securely via Stripe and approved payment methods.
• We do not store or access your payment card information.

By completing a purchase, you authorize Odlo Fashion to charge the full amount displayed at checkout.`
    },
    {
      id: 4,
      title: "No Refund Policy (Critical Clause)",
      icon: ExclamationCircleIcon,
      content: `Due to the digital, downloadable, and instantly accessible nature of our products:

⚠️ ALL SALES ARE FINAL.

We do not offer refunds, returns, or exchanges once:
• Payment is completed, AND
• Digital access or delivery is provided

This policy aligns with Stripe's non-refundable digital goods standards.

By purchasing, you explicitly waive any right to a refund based on:
• Change of mind
• Incompatibility
• Subjective dissatisfaction
• Business decisions
• Client or third-party feedback`
    },
    {
      id: 5,
      title: "Chargebacks & Payment Disputes",
      content: `Unauthorized chargebacks or disputes violate these Terms.

If a dispute is initiated without contacting us first:
• We reserve the right to permanently revoke access
• Block future purchases
• Submit evidence to Stripe including:
  - Proof of delivery
  - IP logs
  - Download/access records
  - Agreement to these Terms

False disputes may result in legal action where applicable.`
    },
    {
      id: 6,
      title: "License & Usage Rights",
      icon: ShieldCheckIcon,
      content: `Upon purchase, you receive a non-exclusive, non-transferable license to use the digital product.

You MAY:
• Use assets for your own brand or client projects
• Use them commercially in marketing or branding

You MAY NOT:
• Resell, redistribute, or sublicense the assets
• Share files publicly or privately
• Claim authorship or ownership
• Upload assets to marketplaces or stock platforms

Violation of license terms results in immediate termination of rights.`
    },
    {
      id: 7,
      title: "Intellectual Property",
      content: `All products remain the intellectual property of Odlo Fashion.

Purchasing a product does not transfer ownership—only usage rights.

All website content, designs, layouts, descriptions, and visuals are protected by international copyright laws.`
    },
    {
      id: 8,
      title: "Product Representation",
      content: `We strive for accurate descriptions and previews. However:
• Previews are illustrative
• Final files may vary slightly in layout or format
• No guarantees are made regarding specific business results

We do not promise sales, growth, or engagement outcomes.`
    },
    {
      id: 9,
      title: "Technical Responsibility",
      icon: CogIcon,
      content: `It is the customer's responsibility to:
• Ensure software compatibility (Photoshop, Canva, Blender, etc.)
• Have the technical knowledge required to use digital assets

We are not responsible for user-side technical limitations.`
    },
    {
      id: 10,
      title: "Account Responsibility",
      content: `If account access is provided:
• You are responsible for maintaining confidentiality
• Sharing login details is prohibited
• Abuse may result in access termination`
    },
    {
      id: 11,
      title: "Fraud Prevention",
      icon: LockClosedIcon,
      content: `We reserve the right to:
• Cancel suspicious orders
• Delay delivery for verification
• Refuse service to high-risk transactions

This protects both Odlo Fashion and Stripe compliance.`
    },
    {
      id: 12,
      title: "Limitation of Liability",
      icon: ScaleIcon,
      content: `Odlo Fashion shall not be liable for:
• Indirect or consequential damages
• Loss of revenue or profit
• Brand or reputational outcomes
• Third-party platform changes

Maximum liability is limited to the purchase amount paid.`
    },
    {
      id: 13,
      title: "Modifications to Products or Terms",
      content: `We may:
• Update products
• Improve assets
• Modify these Terms at any time

Continued use of the site constitutes acceptance of updates.`
    },
    {
      id: 14,
      title: "Governing Law",
      content: `These Terms are governed by applicable international commercial laws.

Any disputes shall first be attempted to be resolved amicably before legal action.`
    },
    {
      id: 15,
      title: "Contact & Support",
      icon: EnvelopeIcon,
      content: `For billing or access issues, contact us at:
📧 support@odlofashion.com

We aim to respond within 48 business hours.`
    },
    {
      id: 16,
      title: "Acceptance of Terms",
      content: `By completing a purchase, you confirm that:
• You have read and understood these Terms
• You agree to the no-refund policy
• You consent to digital delivery
• You accept Stripe-compliant processing`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-5 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ScaleIcon className="h-10 w-10 text-gray-800" />
            <h1 className="text-4xl font-bold text-gray-900">Terms & Conditions</h1>
          </div>
          <p className="text-gray-600">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Warning Banner */}
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-semibold">⚠️ Important Notice</p>
              <p className="text-yellow-700 text-sm mt-1">
                By accessing, browsing, or purchasing from odlofashion.com, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use this website.
              </p>
            </div>
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
            Why this protects you with Stripe
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Clearly defines digital goods",
              "Explicitly states no refunds",
              "Documents delivery confirmation",
              "Limits chargeback abuse",
              "Aligns with Stripe's Digital Products Policy",
              "Protects payout timelines"
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
          <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Odlo Fashion</h3>
            <p className="text-gray-300 italic">Luxury Designed. Digitally Delivered.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;