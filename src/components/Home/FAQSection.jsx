// FAQSection.jsx
import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqs = [
  {
    question: "Is this suitable for court document translation in India?",
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
  },
  {
    question:
      "Can it read old scanned PDFs?",
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
  },
  {
    question: "Will the format remain the same?",
    answer:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
  },
  {
    question: "Which Indian languages do you support?",
    answer:
      "We support almost all major languages as the input language, including Hindi, Marathi, Gujarati, Telugu Tamil Kannada, Bengali, Assamese & other vernecular languages Mixed-language documents are supported too. You can upload your document having any language including multiple languages in a single document and we will translate the same, Our Al automotically detects the source language and processes it accordingly, whether it's a single language or a mix of multiple",
  },
  {
    question: "Will the format remain the same?",
    answer:
      "We support almost all major languages as the input language, including Hindi, Marathi, Gujarati, Telugu Tamil Kannada, Bengali, Assamese & other vernecular languages Mixed-language documents are supported too. You can upload your document having any language including multiple languages in a single document and we will translate the same, Our Al automotically detects the source language and processes it accordingly, whether it's a single language or a mix of multiple",
  },
  
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden py-20 px-6 sm:px-10 lg:px-16">
      {/* Background Gradient + Vectors */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-indigo-100"></div>
      <div className="absolute -top-20 -left-32 w-96 h-96 bg-indigo-200 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-300 opacity-40 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold  mb-4">
            Frequently Asked Questions
          </h2>
         
        </div>

        {/* FAQ List */}
        <div className="space-y-5 gsap-up-stagger">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm border  border-indigo-100 rounded-2xl  shadow-sm hover:shadow-md transition-all duration-300"
            >
              <button
                className="w-full flex justify-between items-center text-left px-6 py-5 sm:py-4 transition-all"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-800 text-base sm:text-lg pr-4">
                  {faq.question}
                </span>
                <div className="text-indigo-600 flex-shrink-0 transition-transform duration-300">
                  {openIndex === index ? <FaMinus /> : <FaPlus />}
                </div>
              </button>

              {/* Animated Answer */}
              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  openIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 text-gray-600 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
