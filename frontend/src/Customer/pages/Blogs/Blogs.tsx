import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

// Sample blog data for GSPL Mart
const blogData = [
  {
    id: 1,
    title: "Top 10 Fashion Trends for 2026",
    excerpt: "Discover the hottest fashion trends that are dominating the runways and streets this year.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
    date: "Feb 10, 2026",
    category: "Fashion",
  },
  {
    id: 2,
    title: "Smart Home Gadgets You Need",
    excerpt: "Transform your living space with these innovative smart home devices and automation solutions.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800",
    date: "Feb 8, 2026",
    category: "Electronics",
  },
  {
    id: 3,
    title: "Healthy Eating on a Budget",
    excerpt: "Learn how to maintain a nutritious diet while shopping smart and saving money on groceries.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
    date: "Feb 5, 2026",
    category: "Groceries",
  },
  {
    id: 4,
    title: "Home Décor Ideas for Small Spaces",
    excerpt: "Maximize your space with creative décor solutions that make small rooms feel larger and more inviting.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
    date: "Feb 3, 2026",
    category: "Home & Living",
  },
  {
    id: 5,
    title: "Must-Have Accessories This Season",
    excerpt: "Complete your look with these trendy accessories that add style and personality to any outfit.",
    image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800",
    date: "Jan 30, 2026",
    category: "Accessories",
  },
  {
    id: 6,
    title: "Tech Buying Guide 2026",
    excerpt: "Make informed decisions with our comprehensive guide to buying the latest electronics and gadgets.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
    date: "Jan 28, 2026",
    category: "Electronics",
  },
];

const Blogs = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#F5F1E8] selection:bg-[#F9B233] selection:text-[#3E2C1E] py-20">
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
      {/* Decorative Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3E2C1E] rounded-full mix-blend-multiply filter blur-[100px] opacity-15 animate-blob"></div>
      <div className="fixed top-[20%] right-[-10%] w-[400px] h-[400px] bg-[#F9B233] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="container max-w-[1400px] mx-auto px-4 lg:px-10 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-[#3E2C1E] tracking-tighter mb-6">
            GSPL Mart <span className="text-[#F9B233]">Blogs</span>
          </h1>
          <p className="text-[#3E2C1E] text-lg font-medium opacity-85 max-w-3xl mx-auto">
            Shopping tips, product guides, and lifestyle advice to help you make
            better purchasing decisions at GSPL Mart.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogData.map((blog) => (
            <div
              key={blog.id}
              className="bg-white/50 backdrop-blur-md border border-white/70 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
            >
              {/* Blog Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#F9B233] text-[#3E2C1E] px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
                    {blog.category}
                  </span>
                </div>
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <p className="text-xs text-[#3E2C1E] opacity-60 font-medium mb-3">
                  {blog.date}
                </p>
                <h3 className="text-xl font-black text-[#3E2C1E] mb-3 tracking-tight group-hover:text-[#F9B233] transition-colors">
                  {blog.title}
                </h3>
                <p className="text-[#3E2C1E] opacity-75 font-medium leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
