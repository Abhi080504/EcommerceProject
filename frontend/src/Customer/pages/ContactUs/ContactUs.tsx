import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Email,
  LocationOn,
  ArrowBack,
} from "@mui/icons-material";

const ContactUs = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFeedback = () => {
    const trimmedFeedback = feedback.trim();

    if (!trimmedFeedback) {
      return "Feedback cannot be empty.";
    }

    if (!/^[A-Za-z\s.,!?']+$/.test(trimmedFeedback)) {
      return "Feedback should contain text only (no numbers or special characters).";
    }

    if (trimmedFeedback.length < 10) {
      return "Feedback must be at least 10 characters long.";
    }

    if (trimmedFeedback.length > 500) {
      return "Feedback cannot exceed 500 characters.";
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateFeedback();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        feedback: feedback.trim(),
        source: "contact-page",
        createdAt: new Date().toISOString(),
      };

      console.log("Feedback submitted:", payload);

      setFeedback("");
      alert("Thank you for your feedback! ✨");
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[100px] opacity-15 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
          <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[48px] p-12 md:p-16 shadow-[0_20px_50px_rgba(62,44,30,0.1)] max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-black text-[#3E2C1E] mb-6 tracking-tighter">
              Get in <span className="text-[#F9B233]">Touch</span>
            </h1>
            <p className="text-[#3E2C1E] max-w-2xl text-lg md:text-xl font-medium opacity-80 leading-relaxed">
              Have questions or need assistance? GSPL Mart is here to help you
              with all your shopping needs.
            </p>
          </div>
        </div>
      </div>

      {/* ================= CONTACT CONTENT ================= */}
      <div className="container mx-auto px-4 lg:px-20 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black text-[#3E2C1E] tracking-tighter">
              Contact <span className="text-[#F9B233]">GSPL Mart</span>
            </h2>
          </div>

          <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_rgba(62,44,30,0.05)]">
            <p className="text-[#3E2C1E] leading-relaxed text-justify text-lg font-medium opacity-85">
              Have a question about your order, need help finding a product, or
              facing an issue? The GSPL Mart support team is here to assist you
              at every step. Reach out to us through call, email, or visit our
              office — and we'll make sure your shopping experience stays smooth
              and hassle-free.
            </p>
          </div>
        </div>
      </div>

      {/* ================= REACH US SECTION ================= */}
      <div className="w-full py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F9B233]/5 rounded-full blur-3xl"></div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-10 relative z-10">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-[#3E2C1E] tracking-tighter">
              Reach Us
            </h2>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Customer Support */}
            <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 bg-[#F9B233]/10 rounded-full flex items-center justify-center text-4xl mb-6 border border-[#F9B233]/20 shadow-inner mx-auto">
                <Phone className="text-[#F9B233]" />
              </div>
              <h3 className="font-black text-[#3E2C1E] uppercase text-sm tracking-[3px] mb-3">
                Customer Support
              </h3>
              <p className="text-xs font-medium text-[#3E2C1E] opacity-60 mb-1">
                +91 98765 43210
              </p>
              <p className="text-xs font-medium text-[#3E2C1E] opacity-60">
                +91 98765 43211
              </p>
            </div>

            {/* Email Assistance */}
            <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 bg-[#F9B233]/10 rounded-full flex items-center justify-center text-4xl mb-6 border border-[#F9B233]/20 shadow-inner mx-auto">
                <Email className="text-[#F9B233]" />
              </div>
              <h3 className="font-black text-[#3E2C1E] uppercase text-sm tracking-[3px] mb-3">
                Email Assistance
              </h3>
              <p className="text-xs font-medium text-[#3E2C1E] opacity-60 mb-1">
                support@gsplmart.com
              </p>
              <p className="text-xs font-medium text-[#3E2C1E] opacity-60">
                care@gsplmart.com
              </p>
            </div>

            {/* Corporate Office */}
            <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 bg-[#F9B233]/10 rounded-full flex items-center justify-center text-4xl mb-6 border border-[#F9B233]/20 shadow-inner mx-auto">
                <LocationOn className="text-[#F9B233]" />
              </div>
              <h3 className="font-black text-[#3E2C1E] uppercase text-sm tracking-[3px] mb-3">
                Corporate Office
              </h3>
              <p className="text-xs font-medium text-[#3E2C1E] opacity-60 mb-1">
                GSPL Mart Headquarters
              </p>
              <p className="text-xs font-medium text-[#3E2C1E] opacity-60">
                402, Galaxy Apts, Mumbai, 400050
              </p>
            </div>
          </div>

          {/* Map Section */}
          <div className="w-full h-[400px] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(62,44,30,0.1)] border border-white/60">
            <iframe
              title="GSPL Mart Location"
              src="https://www.google.com/maps?q=Mumbai,India&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* ================= FEEDBACK SECTION ================= */}
      <div className="w-full py-16">
        <div className="container max-w-[1200px] mx-auto px-4 lg:px-20">
          {/* Section Heading */}
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black text-[#3E2C1E] tracking-tighter">
              We Value Your <span className="text-[#F9B233]">Feedback</span>
            </h2>
          </div>

          <p className="text-[#3E2C1E] text-center mb-8 font-medium opacity-70">
            Your feedback helps us serve you better
          </p>

          {/* Feedback Form */}
          <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_rgba(62,44,30,0.05)]">
            <form
              className="flex flex-col items-center"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Textarea */}
              <textarea
                rows={6}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your feedback or shopping experience here..."
                maxLength={500}
                className={`w-full max-w-[900px] p-4 border rounded-2xl resize-none mb-2 text-[#3E2C1E] bg-white/60 backdrop-blur-sm
                  focus:outline-none focus:ring-2 font-medium
                  ${
                    error
                      ? "border-red-400 focus:ring-red-400"
                      : "border-[#F9B233]/30 focus:ring-[#F9B233]"
                  }`}
              />

              {/* Character Counter */}
              <div className="w-full max-w-[900px] text-right text-xs text-[#3E2C1E] opacity-60 mb-4 font-medium">
                {feedback.length}/500 characters
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-sm mb-4 text-center font-medium">
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-10 py-4 rounded-2xl font-black uppercase tracking-wider transition-all duration-300 text-lg shadow-lg hover:shadow-xl
                  ${
                    isSubmitting
                      ? "bg-[#F9B233]/50 cursor-not-allowed text-[#3E2C1E]/50"
                      : "bg-[#F9B233] hover:bg-[#3E2C1E] text-[#3E2C1E] hover:text-[#F9B233]"
                  }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
