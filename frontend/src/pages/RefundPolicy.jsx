import React from "react";
import { 
  DocumentTextIcon,
  ExclamationCircleIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  XCircleIcon,
  EnvelopeIcon 
} from "@heroicons/react/24/outline";

const RefundPolicy = () => {
  const lastUpdated = "January 15, 2024";

  const sections = [
    {
      id: 1,
      title: "Digital Products Only",
      icon: DocumentTextIcon,
      content: `Odlo Fashion sells digital goods exclusively, including but not limited to:
• Branding kits
• Logo templates
• Social media templates
• Posters & prints
• 3D fashion assets
• Mockups
• Bundles and digital collections

No physical products are shipped. All products are delivered electronically via secure access, download links, or email.`
    },
    {
      id: 2,
      title: "No Refund Policy",
      icon: ExclamationCircleIcon,
      content: `ALL SALES ARE FINAL.

Once a payment is successfully processed and digital access or delivery is provided, the transaction is considered completed and fulfilled.

We do not offer refunds, returns, exchanges, or cancellations under any circumstances, including but not limited to:
• Change of mind
• Accidental purchase
• Lack of use or technical knowledge
• Compatibility issues
• Business decisions
• Client or third-party feedback
• Dissatisfaction based on personal preference

This policy is in line with Stripe's Digital Goods guidelines and international consumer protection standards for digital products.`
    },
    {
      id: 3,
      title: "Why Refunds Are Not Offered",
      icon: XCircleIcon,
      content: `Digital products:
• Are delivered instantly or on a scheduled basis
• Cannot be "returned" once accessed
• Can be copied or stored permanently

For this reason, refund requests cannot be honored once delivery has occurred.`
    },
    {
      id: 4,
      title: "Pre-Purchase Transparency",
      icon: ShieldCheckIcon,
      content: `To ensure informed purchasing decisions:
• Product descriptions are detailed and accurate
• Preview images and examples are provided
• File formats and use cases are clearly stated
• Checkout includes explicit consent acknowledgment

Customers are encouraged to review all details before completing payment.`
    },
    {
      id: 5,
      title: "Duplicate Payments or Billing Errors",
      icon: CreditCardIcon,
      content: `Refunds may be considered only in the rare event of:
• Duplicate charges caused by a technical error
• Proven system malfunction during payment

Such cases must be reported within 48 hours of the transaction and will be reviewed on a case-by-case basis.

Approval is not guaranteed.`
    },
    {
      id: 6,
      title: "Unauthorized Payments",
      content: `If you believe a payment was made without your authorization:
• Contact us immediately before initiating a chargeback
• We will investigate the issue promptly

Unauthorized chargebacks without prior contact may result in:
• Loss of access to purchased products
• Account suspension
• Dispute submission with Stripe using delivery and consent evidence`
    },
    {
      id: 7,
      title: "Chargebacks & Payment Disputes",
      content: `Initiating a chargeback does not override this Refund Policy.

In the event of a dispute, Odlo Fashion may submit evidence including:
• Proof of digital delivery
• Checkout consent records
• IP address and transaction logs
• Agreement to Terms & Conditions and Refund Policy

Fraudulent or unjustified disputes may lead to permanent account restrictions.`
    },
    {
      id: 8,
      title: "Exceptions",
      content: `Refunds will not be issued for:
• Partial use of a product
• Failure to read descriptions or policies
• Delays caused by banks or payment processors
• Customer-side technical issues

No exceptions will be made once access is granted.`
    },
    {
      id: 9,
      title: "Policy Acceptance",
      content: `By completing a purchase, you confirm that:
• You understand the product is digital
• You accept that delivery is electronic
• You acknowledge the no-refund policy
• You agree to all checkout terms

This acceptance is logged for compliance and dispute resolution purposes.`
    },
    {
      id: 10,
      title: "Contact Information",
      icon: EnvelopeIcon,
      content: `For billing concerns or questions regarding this policy:

📧 billing@odlofashion.com
📧 support@odlofashion.com

Response time: Within 48 business hours`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-5 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ExclamationCircleIcon className="h-10 w-10 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">Refund Policy</h1>
          </div>
          <p className="text-gray-600">
            Last Updated: {lastUpdated}
          </p>
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold text-center">
              ⚠️ ALL SALES ARE FINAL • NO REFUNDS, RETURNS, OR EXCHANGES
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <p className="text-gray-700">
            At <span className="font-semibold">Odlo Fashion</span>, we specialize in <span className="font-semibold">premium digital products</span> designed for professional and commercial use. Because of the nature of our offerings, we maintain a <span className="font-semibold text-red-600">strict no-refund policy</span>, which is clearly communicated before purchase.
          </p>
          <p className="text-gray-700 mt-4">
            By completing a purchase on <span className="font-semibold">odlofashion.com</span>, you acknowledge and agree to the terms outlined below.
          </p>
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

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Odlo Fashion</h3>
            <p className="text-gray-300 italic">Luxury Designed. Digitally Delivered.</p>
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                This policy is designed to protect both our customers and our business in accordance with international digital goods regulations and Stripe's terms of service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;