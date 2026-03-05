import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#F5F1E8] selection:bg-[#F9B233] selection:text-[#3E2C1E]">
      {/* Back Button */}
      <div className="fixed top-24 left-6 z-50">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/50 backdrop-blur-md border border-white/70 rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-[#F9B233] hover:border-[#F9B233] transition-all duration-300 group"
          aria-label="Go back"
        >
          <ArrowBack className="text-[#3E2C1E] group-hover:text-white transition-colors" />
        </button>
      </div>
      {/* ================= HEADER ================= */}
      <div className="relative py-20 text-center px-4 overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[100px] opacity-15 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-[#3E2C1E] mb-6 tracking-tighter">
            Privacy <span className="text-[#F9B233]">Policy</span>
          </h1>
          <p className="text-[#3E2C1E] max-w-3xl mx-auto text-lg leading-relaxed font-medium opacity-85">
            At GSPL Mart, your privacy matters to us. This Privacy Policy
            explains how we collect, use, share, and protect your personal
            information when you use our ecommerce services.
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="container max-w-[1200px] mx-auto px-4 lg:px-20 pb-20">
        <div className="space-y-6">
          {/* Section Card 1 */}
          <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-black text-[#3E2C1E] mb-4 tracking-tight">
              <span className="text-[#F9B233]">1.</span> Scope of This Privacy Policy
            </h2>
            <p className="text-[#3E2C1E] leading-relaxed font-medium opacity-85">
              This Privacy Policy governs the use of the GSPL Mart website and
              related services (collectively, the "Platform"). It applies to all
              customers, shoppers, and visitors who access or use our
              services.
            </p>
          </div>

          {/* Section Card 2 */}
          <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-black text-[#3E2C1E] mb-4 tracking-tight">
              <span className="text-[#F9B233]">2.</span> Personal Data We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-[#3E2C1E] font-medium opacity-85">
              <li>Name, email address, and contact number</li>
              <li>Account login and profile details</li>
              <li>Shipping and billing addresses</li>
              <li>Order history and shopping preferences</li>
              <li>Payment details processed via secure gateways</li>
              <li>Device and usage data for analytics and security</li>
            </ul>
          </div>

          {/* Section Card 3 */}
          <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-black text-[#3E2C1E] mb-4 tracking-tight">
              <span className="text-[#F9B233]">3.</span> How We Use Your Personal Data
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-[#3E2C1E] font-medium opacity-85">
              <li>To process orders and deliver products</li>
              <li>To send order confirmations, updates, and support communications</li>
              <li>To process payments securely and prevent fraud</li>
              <li>To personalize your shopping experience</li>
              <li>To improve platform performance and user experience</li>
              <li>To comply with legal and regulatory requirements</li>
            </ul>
          </div>

          {/* Section Card 4 */}
          <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-black text-[#3E2C1E] mb-4 tracking-tight">
              <span className="text-[#F9B233]">4.</span> Sharing of Personal Data
            </h2>
            <p className="text-[#3E2C1E] leading-relaxed font-medium opacity-85 mb-3">
              We share personal data only when necessary and with trusted
              partners such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#3E2C1E] font-medium opacity-85">
              <li>Sellers and product vendors on our platform</li>
              <li>Shipping and logistics partners</li>
              <li>Payment gateway and financial service partners</li>
              <li>Analytics and technology service providers</li>
              <li>Government or regulatory authorities when required by law</li>
            </ul>
          </div>

          {/* Section Card 5 */}
          <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-black text-[#3E2C1E] mb-4 tracking-tight">
              <span className="text-[#F9B233]">5.</span> Data Storage and Retention
            </h2>
            <p className="text-[#3E2C1E] leading-relaxed font-medium opacity-85">
              Your personal data is retained only for as long as required to
              fulfill the purposes outlined in this Policy or as required by
              applicable laws. We implement appropriate security measures to protect
              your data during storage.
            </p>
          </div>

          {/* Section Card 6 */}
          <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-black text-[#3E2C1E] mb-4 tracking-tight">
              <span className="text-[#F9B233]">6.</span> Your Rights
            </h2>
            <p className="text-[#3E2C1E] leading-relaxed font-medium opacity-85">
              You have the right to access, correct, update, or request deletion
              of your personal data. You may also withdraw consent for data
              processing, subject to legal obligations. Contact us to exercise
              these rights.
            </p>
          </div>

          {/* Section Card 7 */}
          <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-black text-[#3E2C1E] mb-4 tracking-tight">
              <span className="text-[#F9B233]">7.</span> Data Protection Practices
            </h2>
            <p className="text-[#3E2C1E] leading-relaxed font-medium opacity-85">
              We use industry-standard security measures including encryption,
              secure servers, and access controls to safeguard your personal
              information against unauthorized access, loss, or misuse.
            </p>
          </div>

          {/* Section Card 8 */}
          <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-black text-[#3E2C1E] mb-4 tracking-tight">
              <span className="text-[#F9B233]">8.</span> Third-Party Websites and Services
            </h2>
            <p className="text-[#3E2C1E] leading-relaxed font-medium opacity-85">
              GSPL Mart is not responsible for the privacy practices of
              third-party websites or services linked on our Platform. We encourage
              you to review their privacy policies before sharing any information.
            </p>
          </div>

          {/* Section Card 9 */}
          <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-black text-[#3E2C1E] mb-4 tracking-tight">
              <span className="text-[#F9B233]">9.</span> Children's Privacy
            </h2>
            <p className="text-[#3E2C1E] leading-relaxed font-medium opacity-85">
              We do not knowingly collect personal data from individuals under
              the age of 18. If you believe we have collected information from a
              minor, please contact us immediately.
            </p>
          </div>

          {/* Section Card 10 */}
          <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-black text-[#3E2C1E] mb-4 tracking-tight">
              <span className="text-[#F9B233]">10.</span> Changes to This Policy
            </h2>
            <p className="text-[#3E2C1E] leading-relaxed font-medium opacity-85">
              GSPL Mart may update this Privacy Policy periodically to reflect
              changes in our practices or legal requirements. Continued use of the
              Platform indicates acceptance of the updated Policy.
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-[#F9B233]/10 backdrop-blur-md border-2 border-[#F9B233]/30 rounded-[32px] p-8 shadow-lg">
            <h2 className="text-2xl font-black text-[#3E2C1E] mb-4 tracking-tight">
              <span className="text-[#F9B233]">11.</span> Contact Us / Grievance Officer
            </h2>
            <p className="text-[#3E2C1E] leading-relaxed font-medium opacity-85 mb-4">
              If you have questions or concerns regarding this Privacy Policy,
              please contact us at:
            </p>
            <div className="space-y-2">
              <p className="font-black text-[#3E2C1E] flex items-center gap-2">
                <span className="text-[#F9B233]">📧</span> support@gsplmart.com
              </p>
              <p className="font-black text-[#3E2C1E] flex items-center gap-2">
                <span className="text-[#F9B233]">📍</span> GSPL Mart Headquarters, 402 Galaxy Apts, Mumbai, 400050
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
