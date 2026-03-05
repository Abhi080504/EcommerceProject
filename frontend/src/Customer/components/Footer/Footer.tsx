import React from 'react';
import { Typography, Button, IconButton, TextField, InputAdornment } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, YouTube, Send, LocationOn, Phone, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="relative z-50 bg-[#3E2C1E] text-white pt-16 pb-8 border-t-4 border-[#F9B233]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        
        {/* --- TOP SECTION: BRAND & NEWSLETTER --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-[#5D4037] pb-12">
            
            {/* 1. Brand Info */}
            <div className="space-y-4">
                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-1px' }}>
                  GSPL <span style={{ color: '#F9B233' }}>Mart</span>
                </Typography>
                <p className="text-[#D7CCC8] text-sm leading-relaxed">
                    Premium organic groceries & lifestyle products delivered to your doorstep in minutes. Experience the gold standard of shopping.
                </p>
                <div className="flex gap-2 pt-2">
                    <SocialButton icon={<Facebook />} />
                    <SocialButton icon={<Twitter />} />
                    <SocialButton icon={<Instagram />} />
                    <SocialButton icon={<LinkedIn />} />
                </div>
            </div>

            {/* 2. Quick Links */}
            <div>
                <h3 className="text-[#F9B233] font-bold mb-6 text-lg">Quick Links</h3>
                <ul className="space-y-3 text-[#EFEBE9] text-sm">
                    <FooterLink onClick={() => { navigate('/about-us'); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300); }}>About Us</FooterLink>
                    <FooterLink onClick={() => { navigate('/become-seller'); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300); }}>Become a Seller</FooterLink>
                    <FooterLink onClick={() => { navigate('/blogs'); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300); }}>Our Blog</FooterLink>
                    <FooterLink onClick={() => { navigate('/privacy-policy'); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300); }}>Privacy Policy</FooterLink>
                    <FooterLink onClick={() => { navigate('/careers'); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300); }}>Careers</FooterLink>
                </ul>
            </div>

            {/* 3. Customer Service */}
            <div>
                <h3 className="text-[#F9B233] font-bold mb-6 text-lg">Customer Care</h3>
                <ul className="space-y-3 text-[#EFEBE9] text-sm">
                    <FooterLink>Help Center</FooterLink>
                    <FooterLink>Returns & Refunds</FooterLink>
                    <FooterLink>Track Order</FooterLink>
                    <FooterLink onClick={() => { navigate('/contact-us'); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300); }}>Contact Us</FooterLink>
                    <FooterLink>Report an Issue</FooterLink>
                </ul>
            </div>

            {/* 4. Newsletter & Contact */}
            <div className="space-y-6">
                <h3 className="text-[#F9B233] font-bold text-lg">Stay Updated</h3>
                <p className="text-[#D7CCC8] text-xs">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                
                {/* Custom Input Field */}
                <div className="flex bg-[#5D4037] p-1 rounded-lg border border-[#8D5A46]">
                    <input 
                        type="email" 
                        placeholder="Your email address" 
                        className="bg-transparent text-white text-sm px-3 w-full outline-none placeholder-[#A1887F]"
                    />
                    <button className="bg-[#F9B233] hover:bg-[#D97706] text-[#3E2C1E] rounded-md px-4 py-2 transition-colors">
                        <Send fontSize="small" />
                    </button>
                </div>

                <div className="space-y-2 pt-2">
                    <ContactItem icon={<LocationOn />} text="402, Galaxy Apts, Mumbai, 400050" />
                    <ContactItem icon={<Phone />} text="+91 98765 43210" />
                    <ContactItem icon={<Email />} text="support@gsplmart.com" />
                </div>
            </div>
        </div>

        {/* --- BOTTOM SECTION: COPYRIGHT & APP LINKS --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[#A1887F] text-xs text-center md:text-left">
                © 2026 GSPL Mart Inc. All rights reserved. <br className="md:hidden"/> Designed with ❤️ in India.
            </p>
            
            <div className="flex gap-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-10 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"/>
            </div>
        </div>

      </div>
    </footer>
  );
};

// --- SUB-COMPONENTS ---

const SocialButton = ({ icon }: { icon: React.ReactNode }) => (
    <IconButton 
        sx={{ 
            color: '#F9B233', 
            bgcolor: 'rgba(255,255,255,0.05)', 
            '&:hover': { bgcolor: '#F9B233', color: '#3E2C1E' } 
        }}
    >
        {icon}
    </IconButton>
);

const FooterLink = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <li 
        className="hover:text-[#F9B233] hover:translate-x-1 transition-all duration-300 flex items-center gap-2"
        onClick={onClick}
        style={{ cursor: 'pointer' }}
    >
        <span className="w-1.5 h-1.5 rounded-full bg-[#5D4037]"></span>
        {children}
    </li>
);

const ContactItem = ({ icon, text }: { icon: any, text: string }) => (
    <div className="flex items-center gap-3 text-[#D7CCC8] text-sm">
        {React.cloneElement(icon, { sx: { fontSize: 18, color: '#F9B233' } })}
        <span>{text}</span>
    </div>
);

export default Footer;