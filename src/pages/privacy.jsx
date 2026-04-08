// Privacy.js
import React from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-offWhite" >

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <h1 className="text-4xl font-black text-gray-900 mb-6">Privacy Policy</h1>
          <p className="mb-6 text-gray-600 leading-relaxed">
          Last updated: 10-15-2025<br />
          Welcome to Weblinqo.<br />
          Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit or use our platform.<br />
          By using Weblinqo, you agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of the platform.

          </p>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="text-gray-600">
              We may collect the following types of information:
              <ul className="list-disc space-y-2 mt-2">
                <li><b>Personal Information — </b>such as your name, email address, phone number, or payment details when you sign up, subscribe, or make a purchase.</li>
                <li><b>Profile Information — </b> content, links, and other information you choose to display publicly on your Weblinqo profile.</li>
                <li><b>Usage Data — </b> information on how you interact with the platform, including browser type, device information, IP address, and pages visited.</li>
                <li><b>Cookies & Tracking Technologies —</b> to enhance your experience and analyze site usage.</li>
              </ul>
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-600">
                We use the collected information to:
                <ul className="list-disc space-y-2 mt-2">
                  <li>Provide, operate, and improve our platform.</li>
                  <li>Personalize your experience and profile page.</li>
                  <li>Send updates, notifications, and marketing communications (with your consent).</li>
                  <li>Analyze usage to enhance security and performance.</li>
                  <li>Comply with legal obligations.</li>
                </ul>
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. How We Share Information</h2>
              <p className="text-gray-600">
                We do not sell your personal data. We may share your information only in these cases:
                <ul className="list-disc space-y-2 mt-2">
                  <li>With service providers (such as hosting, payment processors, or analytics tools) who support our operations.</li>
                  <li>When required by law, regulation, or legal process.</li>
                  <li>To protect Weblinqo's rights, property, or safety, and that of our users.</li>
                </ul>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Your Choices and Rights</h2>
              <p className="text-gray-600">
                <ul className="list-disc space-y-2 mt-2">
                  <li>You can update your account information at any time.</li>
                  <li>You may opt out of receiving promotional emails by clicking "Unsubscribe" in any message.</li>
                  <li>You may request to delete your account and personal data by contacting us directly.</li>
                </ul>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Cookies</h2>
              <p className="text-gray-600">
                We use cookies and similar technologies to:
                <ul className="list-disc space-y-2 mt-2">
                  <li>Keep you signed in.</li>
                  <li>Remember your preferences.</li>
                  <li>Analyze platform traffic and performance.</li>
                  <li>You can control cookies through your browser settings. Some features may not function properly if you disable them.</li>
                </ul>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Data Security</h2>
              <p className="text-gray-600">
                <ul className="list-disc space-y-2 mt-2">
                  <li>We take reasonable measures to protect your data from unauthorized access, loss, or misuse.</li>
                  <li>However, no system is completely secure, and we cannot guarantee absolute security.</li>
                </ul>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. International Users</h2>
              <p className="text-gray-600">
                <ul className="list-disc space-y-2 mt-2">
                  <li>If you access Weblinqo from outside the United States, please note that your data may be processed and stored in the U.S. or other countries where our service providers operate.</li>
                </ul>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Children's Privacy</h2>
              <p className="text-gray-600">
                <ul className="list-disc space-y-2 mt-2">
                  <li>Weblinqo is not intended for children under 13.</li>
                  <li>We do not knowingly collect personal data from minors. If we learn that a child's data has been collected, we will delete it promptly.</li>
                </ul>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
              <p className="text-gray-600">
                <ul className="list-disc space-y-2 mt-2">
                  <li>We may update this Privacy Policy from time to time.</li>
                  <li>When we do, we will revise the "Last updated" date and notify users as appropriate.</li>
                </ul>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
              <p className="text-gray-600">
                <ul className="list-disc space-y-2 mt-2">
                  <li>If you have questions about this Privacy Policy or your personal data, please contact us at Email: <a href="mailto:support@weblinqo.com" className="underline text-[#2848f0]" >support@weblinqo.com</a>
                  </li>
                  <li>Website: <a href="https://www.weblinqo.com" className="text-[#2848f0]">https://www.weblinqo.com</a></li>
                </ul>
              </p>
            </div>
          </div>
          
          {/* <p className="mt-12 text-sm text-gray-500">Last updated: July 13, 2025</p> */}
        </div>
      </div>
    </div>
  );
};

export default Privacy;