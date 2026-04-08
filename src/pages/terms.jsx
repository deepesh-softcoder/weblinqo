// Terms.js
import React from "react";
import Typography from "../components/shared/typography";

const Terms = () => {
  return (
    <div className="min-h-screen bg-offWhite">

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <Typography variant="h1" className="text-4xl font-black text-gray-900 mb-6">Terms of Service</Typography>
          <Typography variant="p" className="mb-6 text-gray-600 leading-relaxed">
          Last updated: 10, 15, 2025 <br />
          Welcome to Weblinqo. These Terms and Conditions ("Terms") govern your access to and use of our platform, services, and related features. By using Weblinqo, you agree to these Terms. If you do not agree, you may not use our services
          </Typography>
          
          {/*  */}
          <div className="space-y-8">
            <div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</Typography>
              <Typography variant="p" className="text-gray-600">
              By accessing or using Weblinqo, you confirm that you have read, understood, and agree to be bound by these Terms and our [Privacy Policy]. If you use our services on behalf of an organization, you agree to these Terms on their behalf as well.
              </Typography>
            </div>
            
            <div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-3">2. Eligibility</Typography>
              <Typography variant="p" className="text-gray-600">
                You must be at least 13 years old to use Weblinqo. If you are using the platform on behalf of someone else, you represent that you have the authority to bind them to these Terms.
              </Typography>
            </div>
            
            <div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-3">3. User Accounts</Typography>
              <div className="text-gray-600">
                <ul className="list-disc space-y-2 mt-2 ml-5">
                  <li><Typography variant="span">You are responsible for maintaining the confidentiality of your account and password.</Typography></li>
                  <li><Typography variant="span">You agree to provide accurate, current, and complete information when creating your account.</Typography></li>
                  <li><Typography variant="span">You are responsible for all activity under your account.</Typography></li>
                  <li><Typography variant="span">We may suspend or terminate your account if we believe your actions violate these Terms or harm the platform.</Typography></li>
                </ul>
              </div>
            </div>

            <div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-3">4. Use of the Platform</Typography>
              <div className="text-gray-600">
                <Typography variant="p">You agree to use Weblinqo only for lawful purposes. You may not:</Typography>
                <ul className="list-disc space-y-2 mt-2 ml-5">
                  <li><Typography variant="span">Upload or share unlawful, harmful, or infringing content.</Typography></li>
                  <li><Typography variant="span">Interfere with the security or operation of the platform.</Typography></li>
                  <li><Typography variant="span">Use the service to send spam, scams, or other malicious content.</Typography></li>
                  <li><Typography variant="span">Impersonate another person or entity.</Typography></li>
                </ul>
              </div>
            </div>

            <div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-3">5. Intellectual Property</Typography>
              <div className="text-gray-600">
                <ul className="list-disc space-y-2 mt-2 ml-5">
                  <li><Typography variant="span">All content, trademarks, and materials provided through Weblinqo are owned or licensed by Weblinqo. You may not copy, modify, distribute, or use our materials without prior written permission.</Typography></li>
                  <li><Typography variant="span">You retain ownership of the content you create and upload, but you grant us a non-exclusive license to host and display it to provide the service.</Typography></li>
                </ul>
              </div>
            </div>

            <div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-3">6. Payments and Subscriptions</Typography>
              <div className="text-gray-600">
                <Typography variant="p">Some features of Weblinqo may be available through paid plans:</Typography>
                <ul className="list-disc space-y-2 mt-2 ml-5">
                  <li><Typography variant="span">All prices and billing terms are displayed at checkout.</Typography></li>
                  <li><Typography variant="span">By subscribing, you agree to our payment and renewal terms.</Typography></li>
                  <li><Typography variant="span">We may change pricing at any time with prior notice.</Typography></li>
                  <li><Typography variant="span">All fees are non-refundable unless required by law.</Typography></li>
                </ul>
              </div>
            </div>

            <div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-3">7. Termination</Typography>
              <div className="text-gray-600">
                <Typography variant="p">We reserve the right to suspend or terminate accounts that:</Typography>
                <ul className="list-disc space-y-2 mt-2 ml-5">
                  <li><Typography variant="span">Violate these Terms.</Typography></li>
                  <li><Typography variant="span">Are inactive for an extended period.</Typography></li>
                  <li><Typography variant="span">Engage in fraudulent, abusive, or illegal activities.</Typography></li>
                  <li><Typography variant="span">You may also terminate your account at any time by contacting support. Upon termination, your license to use the platform ends.</Typography></li>
                </ul>
              </div>
            </div>

            <div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-3">8. Disclaimer of Warranties</Typography>
              <Typography variant="p" className="text-gray-600">
              Weblinqo is provided "as is" and "as available." We make no warranties or representations regarding the service's accuracy, reliability, or availability. You use the platform at your own risk.
              </Typography>
            </div>

            <div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-3">9. Limitation of Liability</Typography>
              <Typography variant="p" className="text-gray-600">
              To the maximum extent permitted by law, Weblinqo and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising from your use or inability to use the platform.
              </Typography>
            </div>

            <div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-3">10. Indemnification</Typography>
              <div className="text-gray-600">
                <Typography variant="p">You agree to indemnify and hold harmless Weblinqo, its team, and partners from any claims, liabilities, damages, or expenses arising from:</Typography>
                <ul className="list-disc space-y-2 mt-2 ml-5">
                    <li><Typography variant="span">Your use of the platform.</Typography></li>
                    <li><Typography variant="span">Your content.</Typography></li>
                    <li><Typography variant="span">Your violation of these Terms or any applicable law.</Typography></li>
                </ul>
              </div>
            </div>  

            <div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-3">11. Changes to Terms</Typography>
              <Typography variant="p" className="text-gray-600">
              We may update these Terms from time to time. Changes will be effective upon posting on our website with an updated "Last updated" date. Continued use of the platform means you accept the new Terms.
              </Typography>
            </div>  

            <div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-3">12. Governing Law</Typography>
              <Typography variant="p" className="text-gray-600">
              These Terms are governed by and interpreted under the laws of the United States and the state in which Weblinqo is registered, without regard to conflict of law principles.
              </Typography>
            </div>  

            <div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-3">13. Contact Us</Typography>
              <div className="text-gray-600">
                <ul className="list-disc space-y-2 mt-2 ml-5">
                  <li><Typography variant="span">If you have any questions about these Terms, please contact us at: Email: <a href="mailto:support@weblinqo.com" className="underline text-[#2848f0]" >support@weblinqo.com</a></Typography></li>
                  <li><Typography variant="span">Website: <a href="https://www.weblinqo.com" className="text-[#2848f0]">https://www.weblinqo.com</a></Typography></li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
