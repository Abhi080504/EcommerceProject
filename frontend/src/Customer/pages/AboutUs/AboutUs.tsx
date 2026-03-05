import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Checkroom,
  Home as HomeIcon,
  Smartphone,
  Watch,
  AutoAwesome,
  Shield,
  LocalShipping,
  CreditCard,
  Headset,
  ArrowBack,
} from "@mui/icons-material";

const AboutUs = () => {
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
      <div className="relative w-full h-[80vh] overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[100px] opacity-15 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[30%] w-[450px] h-[450px] rounded-full mix-blend-multiply filter blur-[90px] opacity-15 animate-blob animation-delay-4000"></div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
          <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[48px] p-12 md:p-16 shadow-[0_20px_50px_rgba(62,44,30,0.1)] max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-black text-[#3E2C1E] mb-6 tracking-tighter">
              Your Trusted Shopping{" "}
              <span className="text-[#F9B233]">Destination</span>
            </h1>
            <p className="text-[#3E2C1E] max-w-2xl text-lg md:text-xl font-medium opacity-80 leading-relaxed">
              Discover quality products across fashion, electronics, home
              essentials, and more — all curated to bring you the best shopping
              experience.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-8 bg-[#F9B233] hover:bg-[#3E2C1E] text-[#3E2C1E] hover:text-[#F9B233] font-black px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg uppercase tracking-wider"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>

      {/* ================= ABOUT CONTENT ================= */}
      <div className="container mx-auto px-4 lg:px-20 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black text-[#3E2C1E] tracking-tighter">
              About <span className="text-[#F9B233]">GSPL Mart</span>
            </h2>
          </div>

          <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_rgba(62,44,30,0.05)]">
            <p className="text-[#3E2C1E] leading-relaxed text-justify text-lg font-medium opacity-85">
              GSPL Mart is your one-stop ecommerce platform designed to
              simplify online shopping and bring quality products right to your
              doorstep. Inspired by leading retail brands, we bring together
              fashion, electronics, home essentials, groceries, and lifestyle
              products in one easy-to-use platform. Whether you're looking for
              the latest trends in clothing, cutting-edge gadgets, everyday
              groceries, or home decor, GSPL Mart helps you shop with
              confidence and convenience.
            </p>
            <p className="text-[#3E2C1E] leading-relaxed text-justify text-lg font-medium opacity-85 mt-6">
              With real-time inventory, competitive pricing, secure
              transactions, and fast delivery, GSPL Mart ensures a smooth
              shopping experience from browsing to checkout. Our platform
              focuses on transparency, reliability, and customer satisfaction —
              so you always know you're getting authentic products at the best
              value. At GSPL Mart, we believe shopping should be stress-free
              and accessible for everyone. That's why we continuously innovate
              to offer smarter search, personalized recommendations, exclusive
              deals, and round-the-clock support, helping you shop more and
              worry less.
            </p>
          </div>
        </div>
      </div>

      {/* ================= SERVICES SECTION ================= */}
      <div className="w-full py-16 relative overflow-hidden">
        {/* Background blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F9B233]/5 rounded-full blur-3xl"></div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-10 relative z-10">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-[#3E2C1E] tracking-tighter">
              What We <span className="text-[#F9B233]">Offer</span>
            </h2>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Fashion */}
            <div
              className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[24px] p-8 text-center cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2 hover:bg-[#F9B233]/10 transition-all duration-300 group"
              onClick={() => navigate("/products/men-s-kurta")}
            >
              <div className="text-5xl mb-4 text-[#F9B233] group-hover:scale-110 transition-transform duration-300 flex justify-center">
                <Checkroom />
              </div>
              <p className="font-black text-[#3E2C1E] text-sm uppercase tracking-wider">
                Fashion
              </p>
            </div>

            {/* Electronics */}
            <div
              className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[24px] p-8 text-center cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2 hover:bg-[#F9B233]/10 transition-all duration-300 group"
              onClick={() => navigate("/products/electronics")}
            >
              <div className="text-5xl mb-4 text-[#F9B233] group-hover:scale-110 transition-transform duration-300 flex justify-center">
                <Smartphone />
              </div>
              <p className="font-black text-[#3E2C1E] text-sm uppercase tracking-wider">
                Electronics
              </p>
            </div>

            {/* Home & Living */}
            <div
              className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[24px] p-8 text-center cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2 hover:bg-[#F9B233]/10 transition-all duration-300 group"
              onClick={() => { navigate("/"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <div className="text-5xl mb-4 text-[#F9B233] group-hover:scale-110 transition-transform duration-300 flex justify-center">
                <HomeIcon />
              </div>
              <p className="font-black text-[#3E2C1E] text-sm uppercase tracking-wider">
                Home
              </p>
            </div>

            {/* Accessories */}
            <div
              className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[24px] p-8 text-center cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2 hover:bg-[#F9B233]/10 transition-all duration-300 group"
              onClick={() => navigate("/products/accessories")}
            >
              <div className="text-5xl mb-4 text-[#F9B233] group-hover:scale-110 transition-transform duration-300 flex justify-center">
                <Watch />
              </div>
              <p className="font-black text-[#3E2C1E] text-sm uppercase tracking-wider">
                Accessories
              </p>
            </div>

            {/* Groceries */}
            <div
              className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[24px] p-8 text-center cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2 hover:bg-[#F9B233]/10 transition-all duration-300 group"
              onClick={() => { navigate("/grocery"); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300); }}
            >
              <div className="text-5xl mb-4 text-[#F9B233] group-hover:scale-110 transition-transform duration-300 flex justify-center">
                <ShoppingBag />
              </div>
              <p className="font-black text-[#3E2C1E] text-sm uppercase tracking-wider">
                Groceries
              </p>
            </div>

            {/* Premium */}
            <div
              className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[24px] p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 hover:bg-[#F9B233]/10 transition-all duration-300 group"
            >
              <div className="text-5xl mb-4 text-[#F9B233] group-hover:scale-110 transition-transform duration-300 flex justify-center">
                <AutoAwesome />
              </div>
              <p className="font-black text-[#3E2C1E] text-sm uppercase tracking-wider">
                Premium
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= WHY CHOOSE US SECTION ================= */}
      <div className="w-full py-16 relative">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-[#3E2C1E] tracking-tighter">
              Why Choose <span className="text-[#F9B233]">GSPL Mart?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Quality Assurance */}
            <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 bg-[#F9B233]/10 rounded-full flex items-center justify-center text-4xl mb-6 border border-[#F9B233]/20 shadow-inner mx-auto">
                <Shield className="text-[#F9B233]" />
              </div>
              <h4 className="font-black text-[#3E2C1E] uppercase text-sm tracking-[3px] mb-3">
                Quality Assured
              </h4>
              <p className="text-xs font-medium text-[#3E2C1E] opacity-60 leading-relaxed">
                100% authentic products from verified sellers and brands
              </p>
            </div>

            {/* Fast Delivery */}
            <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 bg-[#F9B233]/10 rounded-full flex items-center justify-center text-4xl mb-6 border border-[#F9B233]/20 shadow-inner mx-auto">
                <LocalShipping className="text-[#F9B233]" />
              </div>
              <h4 className="font-black text-[#3E2C1E] uppercase text-sm tracking-[3px] mb-3">
                Fast Delivery
              </h4>
              <p className="text-xs font-medium text-[#3E2C1E] opacity-60 leading-relaxed">
                Quick and reliable shipping to your doorstep nationwide
              </p>
            </div>

            {/* Secure Payments */}
            <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 bg-[#F9B233]/10 rounded-full flex items-center justify-center text-4xl mb-6 border border-[#F9B233]/20 shadow-inner mx-auto">
                <CreditCard className="text-[#F9B233]" />
              </div>
              <h4 className="font-black text-[#3E2C1E] uppercase text-sm tracking-[3px] mb-3">
                Secure Payments
              </h4>
              <p className="text-xs font-medium text-[#3E2C1E] opacity-60 leading-relaxed">
                Safe and encrypted payment gateway for all transactions
              </p>
            </div>

            {/* 24/7 Support */}
            <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-20 h-20 bg-[#F9B233]/10 rounded-full flex items-center justify-center text-4xl mb-6 border border-[#F9B233]/20 shadow-inner mx-auto">
                <Headset className="text-[#F9B233]" />
              </div>
              <h4 className="font-black text-[#3E2C1E] uppercase text-sm tracking-[3px] mb-3">
                24/7 Support
              </h4>
              <p className="text-xs font-medium text-[#3E2C1E] opacity-60 leading-relaxed">
                Round-the-clock customer service for all your queries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TRUST STATS SECTION ================= */}
      <div className="w-full py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl"></div>

        <div className="container max-w-[1200px] mx-auto px-4 lg:px-20 relative z-10">
          <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-[48px] p-12 shadow-[0_20px_50px_rgba(62,44,30,0.05)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
              {/* Happy Customers */}
              <div>
                <h3 className="text-4xl md:text-5xl font-black text-[#F9B233] mb-2 tracking-tighter">
                  100K+
                </h3>
                <p className="text-[#3E2C1E] font-black uppercase text-xs tracking-widest opacity-70">
                  Happy Customers
                </p>
              </div>

              {/* Products */}
              <div>
                <h3 className="text-4xl md:text-5xl font-black text-[#F9B233] mb-2 tracking-tighter">
                  50K+
                </h3>
                <p className="text-[#3E2C1E] font-black uppercase text-xs tracking-widest opacity-70">
                  Products Listed
                </p>
              </div>

              {/* Orders */}
              <div>
                <h3 className="text-4xl md:text-5xl font-black text-[#F9B233] mb-2 tracking-tighter">
                  200K+
                </h3>
                <p className="text-[#3E2C1E] font-black uppercase text-xs tracking-widest opacity-70">
                  Orders Delivered
                </p>
              </div>

              {/* Sellers */}
              <div>
                <h3 className="text-4xl md:text-5xl font-black text-[#F9B233] mb-2 tracking-tighter">
                  1000+
                </h3>
                <p className="text-[#3E2C1E] font-black uppercase text-xs tracking-widest opacity-70">
                  Trusted Sellers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <div className="w-full py-16">
        <div className="container max-w-[1200px] mx-auto px-4 lg:px-20">
          {/* Section Heading */}
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-[#3E2C1E] tracking-tighter">
              What Our Customers Say
            </h2>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 text-center">
              <p className="text-[#3E2C1E] italic mb-6 leading-relaxed font-medium opacity-85">
                "Shopping at GSPL Mart was amazing! The product quality
                exceeded my expectations and delivery was super fast. Highly
                recommended!"
              </p>
              <p className="font-black text-[#F9B233] uppercase text-sm tracking-wider">
                — Priya Sharma
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 text-center">
              <p className="text-[#3E2C1E] italic mb-6 leading-relaxed font-medium opacity-85">
                "I love the variety of products available. From fashion to
                electronics, everything is authentic and reasonably priced. GSPL
                Mart is my go-to store!"
              </p>
              <p className="font-black text-[#F9B233] uppercase text-sm tracking-wider">
                — Rahul Verma
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 text-center">
              <p className="text-[#3E2C1E] italic mb-6 leading-relaxed font-medium opacity-85">
                "The customer service is exceptional! They helped me track my
                order and resolved my query instantly. Shopping here is always a
                pleasant experience."
              </p>
              <p className="font-black text-[#F9B233] uppercase text-sm tracking-wider">
                — Anjali Desai
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
