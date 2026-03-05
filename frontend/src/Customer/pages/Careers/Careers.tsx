import React from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  ShoppingCart,
  Handshake,
  AccountBalance,
  ArrowBack,
} from "@mui/icons-material";

const Careers = () => {
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
      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[100px] opacity-15 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
          <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[48px] p-12 md:p-16 shadow-[0_20px_50px_rgba(62,44,30,0.1)] max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-black text-[#3E2C1E] mb-6 tracking-tighter">
              Careers That <span className="text-[#F9B233]">Move You</span>
            </h1>
            <p className="text-[#3E2C1E] max-w-2xl mx-auto text-lg md:text-xl font-medium opacity-80 leading-relaxed">
              Be part of a fast-growing ecommerce company where innovation,
              teamwork, and growth drive everything we do.
            </p>
          </div>
        </div>
      </div>

      {/* ================= WHY WORK WITH GSPL MART ================= */}
      <section className="w-full py-20">
        <div className="container max-w-[1200px] mx-auto px-4 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="mb-6">
                <h2 className="text-3xl md:text-5xl font-black text-[#3E2C1E] tracking-tighter">
                  Why Work with <br />
                  <span className="text-[#F9B233]">GSPL Mart?</span>
                </h2>
              </div>

              <p className="text-[#3E2C1E] leading-relaxed mb-8 font-medium opacity-85 text-lg">
                GSPL Mart is redefining how people shop online. From fashion and
                electronics to groceries and home essentials, we're building a
                platform that prioritizes simplicity, trust, and innovation. Join
                our growing team and help shape the future of ecommerce while
                creating meaningful experiences for millions of shoppers.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-4 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 hover:shadow-lg transition-all">
                  <span className="text-[#F9B233] mt-1">
                    <TrendingUp fontSize="large" />
                  </span>
                  <span className="text-[#3E2C1E] font-medium opacity-85">
                    Culture of continuous learning and growth
                  </span>
                </li>
                <li className="flex items-start gap-4 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 hover:shadow-lg transition-all">
                  <span className="text-[#F9B233] mt-1">
                    <ShoppingCart fontSize="large" />
                  </span>
                  <span className="text-[#3E2C1E] font-medium opacity-85">
                    Work on real-world ecommerce products used by thousands
                  </span>
                </li>
                <li className="flex items-start gap-4 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 hover:shadow-lg transition-all">
                  <span className="text-[#F9B233] mt-1">
                    <Handshake fontSize="large" />
                  </span>
                  <span className="text-[#3E2C1E] font-medium opacity-85">
                    Open, collaborative, and transparent work environment
                  </span>
                </li>
                <li className="flex items-start gap-4 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 hover:shadow-lg transition-all">
                  <span className="text-[#F9B233] mt-1">
                    <AccountBalance fontSize="large" />
                  </span>
                  <span className="text-[#3E2C1E] font-medium opacity-85">
                    Competitive compensation and employee benefits
                  </span>
                </li>
              </ul>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[48px] overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                  alt="Work with GSPL Mart"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#F9B233]/20 rounded-[32px] -z-10 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CURRENT OPENINGS ================= */}
      <section className="w-full py-20 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F9B233]/5 rounded-full blur-3xl"></div>

        <div className="container max-w-[1400px] mx-auto px-4 lg:px-10 relative z-10">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-[#3E2C1E] tracking-tighter">
              Current <span className="text-[#F9B233]">Openings</span>
            </h2>
          </div>

          {/* Job Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1️⃣ Web Developer */}
            <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-2xl font-black text-[#3E2C1E] mb-2 tracking-tight">
                Web Developer (MERN Stack)
              </h3>

              <p className="text-sm text-[#3E2C1E] opacity-60 font-medium mb-4 flex items-center gap-2">
                📍 Mumbai
              </p>

              <p className="text-[#3E2C1E] opacity-75 font-medium mb-6 leading-relaxed">
                Looking for a MERN Stack Developer to build scalable web
                applications using MongoDB, Express, React, and Node.js.
              </p>

              <div className="bg-[#F9B233]/20 text-sm font-black text-[#3E2C1E] px-4 py-2 rounded-xl inline-block mb-6">
                Type: Full-time
              </div>

              <button className="w-full mt-4 bg-[#F9B233] hover:bg-[#3E2C1E] text-[#3E2C1E] hover:text-[#F9B233] font-black py-3 rounded-2xl transition-all duration-300 uppercase tracking-wider">
                Click to Apply
              </button>
            </div>

            {/* 2️⃣ DevOps Engineer */}
            <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-2xl font-black text-[#3E2C1E] mb-2 tracking-tight">
                DevOps Engineer
              </h3>

              <p className="text-sm text-[#3E2C1E] opacity-60 font-medium mb-4 flex items-center gap-2">
                📍 Mumbai
              </p>

              <p className="text-[#3E2C1E] opacity-75 font-medium mb-6 leading-relaxed">
                We are looking for a DevOps Engineer to manage deployments,
                cloud infrastructure, CI/CD pipelines, and system reliability.
              </p>

              <div className="bg-[#F9B233]/20 text-sm font-black text-[#3E2C1E] px-4 py-2 rounded-xl inline-block mb-6">
                Type: Full-time
              </div>

              <button className="w-full mt-4 bg-[#F9B233] hover:bg-[#3E2C1E] text-[#3E2C1E] hover:text-[#F9B233] font-black py-3 rounded-2xl transition-all duration-300 uppercase tracking-wider">
                Click to Apply
              </button>
            </div>

            {/* 3️⃣ Marketing Intern */}
            <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-2xl font-black text-[#3E2C1E] mb-2 tracking-tight">
                Marketing Intern
              </h3>

              <p className="text-sm text-[#3E2C1E] opacity-60 font-medium mb-4 flex items-center gap-2">
                📍 Mumbai
              </p>

              <p className="text-[#3E2C1E] opacity-75 font-medium mb-6 leading-relaxed">
                Looking for marketing interns to support digital campaigns,
                content strategy, and brand initiatives effectively.
              </p>

              <div className="bg-[#F9B233]/20 text-sm font-black text-[#3E2C1E] px-4 py-2 rounded-xl inline-block mb-6">
                Type: Internship
              </div>

              <button className="w-full mt-4 bg-[#F9B233] hover:bg-[#3E2C1E] text-[#3E2C1E] hover:text-[#F9B233] font-black py-3 rounded-2xl transition-all duration-300 uppercase tracking-wider">
                Click to Apply
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= APPLY NOW SECTION ================= */}
      <section className="w-full py-20">
        <div className="container max-w-[800px] mx-auto px-4 lg:px-10">
          <div className="bg-[#F9B233]/10 backdrop-blur-md border-2 border-[#F9B233]/30 rounded-[48px] p-12 text-center shadow-lg">
            <h2 className="text-3xl md:text-4xl font-black text-[#3E2C1E] mb-4 tracking-tight">
              Don't See Your Role?
            </h2>
            <p className="text-[#3E2C1E] opacity-85 font-medium mb-8 text-lg">
              We're always looking for talented individuals. Send us your resume
              and we'll keep you in mind for future opportunities!
            </p>
            <button className="bg-[#F9B233] hover:bg-[#3E2C1E] text-[#3E2C1E] hover:text-[#F9B233] font-black px-12 py-4 rounded-2xl transition-all duration-300 uppercase tracking-wider text-lg shadow-lg hover:shadow-xl">
              Send Your Resume
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
