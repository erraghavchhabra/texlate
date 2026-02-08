import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-blue-50 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto bg-slate-50 shadow-sm mt-12 p-12 md:p-16 ">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#1e1e1e] mb-4 text-center">
          Privacy Policy
        </h1>
        <p className="text-center text-gray-500 mb-12">Last updated: February 2026</p>

        {/* About Texlate */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-[#1e1e1e] mb-4">About Texlate</h2>
          <p className="text-gray-700 mb-2 font-medium">
            Empowering Legal & Official Communication Across India
          </p>
          <p className="text-gray-700 mb-2">
            Texlate was born from a critical observation: Legal professionals, Court clerks, and Government agencies in India struggle with translating vernacular documents. Whether it is an FIR, Chargesheet, or Panchnama, the process of converting these from Hindi, Marathi, Gujarati, or any other vernacular language to English is time-consuming. We bridged this gap using advanced AI.
          </p>
          <p className="text-gray-700">
            We created a Structure-preserving translator that doesn't just translate text—it maintains the visual integrity of scanned court orders and land records, saving you hours of reformatting.
          </p>
        </section>

        {/* Privacy Policy Sections */}
        <section className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">1. Information We Collect</h3>
            <p className="text-gray-700">
              We may collect personal information such as name, email address, phone number, and documents you upload to our platform. This information helps us provide accurate translations and improve our services.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">2. How We Use Your Information</h3>
            <p className="text-gray-700">
              Your information is used to provide translation services, maintain records, communicate updates, and improve our AI translator. We do not sell your information to third parties.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">3. Data Security</h3>
            <p className="text-gray-700">
              We implement strict security measures to protect your data from unauthorized access, alteration, or disclosure. Uploaded documents are encrypted and stored securely.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">4. Sharing Your Information</h3>
            <p className="text-gray-700">
              Texlate does not share your personal data with third-party companies for marketing purposes. We may share data with service providers to improve our platform or comply with legal obligations.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">5. Your Rights</h3>
            <p className="text-gray-700">
              You have the right to access, correct, or delete your personal information. You can also request to stop processing your data at any time by contacting us.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">6. Cookies</h3>
            <p className="text-gray-700">
              Our website uses cookies and similar technologies to enhance user experience and analyze site traffic. You can manage cookie preferences in your browser settings.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">7. Changes to This Policy</h3>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated “Last updated” date.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-12 text-gray-700 text-center">
          <p>
            For any questions about this Privacy Policy or your personal data, please contact us at{" "}
            <a href="mailto:support@texlate.com" className="text-blue-600 font-medium hover:underline">
              support@texlate.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
