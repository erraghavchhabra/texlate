import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-blue-50 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto bg-slate-50 shadow-sm mt-12 p-12 md:p-16 ">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#1e1e1e] mb-4 text-center">
          Terms & Conditions
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

        {/* Terms Sections */}
        <section className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">1. Acceptance of Terms</h3>
            <p className="text-gray-700">
              By accessing or using Texlate’s services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">2. Services Provided</h3>
            <p className="text-gray-700">
              Texlate provides AI-powered translation services for legal and official documents, ensuring accuracy and structure preservation of scanned documents.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">3. User Responsibilities</h3>
            <p className="text-gray-700">
              Users must provide accurate information when using our platform. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">4. Intellectual Property</h3>
            <p className="text-gray-700">
              All content, software, and materials provided by Texlate are the property of Texlate and are protected by copyright and other intellectual property laws. You may not copy, reproduce, or distribute without permission.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">5. Limitations of Liability</h3>
            <p className="text-gray-700">
              Texlate shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use of our services. We make no guarantees regarding translation accuracy or processing times.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">6. Termination</h3>
            <p className="text-gray-700">
              We reserve the right to suspend or terminate your access to our services at any time for violations of these terms or for any reason deemed necessary.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">7. Governing Law</h3>
            <p className="text-gray-700">
              These Terms & Conditions shall be governed by and construed in accordance with the laws of India.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-12 text-gray-700 text-center">
          <p>
            For any questions about these Terms & Conditions, please contact us at{" "}
            <a href="mailto:support@texlate.com" className="text-blue-600 font-medium hover:underline">
              support@texlate.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
