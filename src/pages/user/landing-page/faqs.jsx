import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import SectionTitle from './section-title';

// faq questions
const faqs = [
  {
    question: '1. What is Weblinqo?',
    answer:
      'Weblinqo is a link-in-bio tool that lets you create a personalized landing page where you can share all your links, content, and social profiles in one place.',
  },
  {
    question: '2. Is Weblinqo free to use?',
    answer:
      'Yes! You can start completely free and customize your page in minutes. We also offer premium features for advanced branding and analytics.',
  },
  {
    question: '3. Do I need to know coding or design?',
    answer:
      'Not at all. Weblinqo is built for everyone—just drag, drop, and publish.',
  },
  {
    question: '4. What can I add to my Weblinqo page?',
    answer:
      'You can add links to your Instagram, TikTok, X (Twitter), YouTube, website, online store, videos, podcasts, events, and more.',
  },
  {
    question: '5. How do I share my Weblinqo page?',
    answer:
      'Once your page is live, just copy your unique Weblinqo link and paste it in your social media bios.',
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  // toggle on each faq click
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="px-4 flex justify-center items-center flex-col">
        <SectionTitle title={'Frequently Asked Questions'}/>
      <div className="bg-white rounded-2xl overflow-hidden shadow-md w-full max-w-2xl border border-gray-300">
        {/* <h2 className="text-3xl font-bold text-center py-6">FAQ</h2> */}
        {faqs.map((item, index) => (
          <div key={index} className="border-t border-gray-200">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full bg-[#2848F040] text-left px-5 py-6 text-size-20 font-normal text-black flex justify-between items-center focus:outline-none"
            >
              <span>{item.question}</span>
              <FaChevronDown
                className={`transition-transform text-size-16 duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="bg-white px-6 py-5 text-gray-800 font-normal text-size-16 border-t border-gray-300">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
