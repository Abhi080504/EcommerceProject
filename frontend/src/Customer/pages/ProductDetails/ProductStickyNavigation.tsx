import React, { useEffect, useState, useMemo } from 'react';

const getSections = (isGrocery: boolean) => [
    { id: 'product-details', label: 'About this item' },
    !isGrocery && { id: 'from-the-brand', label: 'From the Brand' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'similar-products', label: 'Similar' },
].filter(Boolean) as { id: string, label: string }[];

const ProductStickyNavigation = ({ isGrocery }: { isGrocery: boolean }) => {
    const sections = useMemo(() => getSections(isGrocery), [isGrocery]);
    const theme = {
        primary: isGrocery ? "#1B5E20" : "#3E2C1E",
        accent: isGrocery ? "#FFB300" : "#F9B233",
        bg: "rgba(255, 255, 255, 0.8)",
        shadow: isGrocery ? "rgba(27, 94, 32, 0.05)" : "rgba(62, 44, 30, 0.05)",
        btnActiveText: isGrocery ? "#1B5E20" : "#3E2C1E",
    };

    const [activeSection, setActiveSection] = useState<string>('product-details');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsVisible(scrollPosition > 300);

            // Spy logic with improved thresholding
            const offset = 200; // Offset for sticky navbar height + buffer

            // Catch for the very bottom of the page to highlight the last section
            const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
            if (isAtBottom) {
                setActiveSection(sections[sections.length - 1].id);
                return;
            }

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i].id);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    // If the top of the section has reached the scroll-spy threshold
                    if (rect.top <= offset) {
                        setActiveSection(sections[i].id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // Offset for the sticky header itself + some breathing room
            const yOffset = -150;
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
            <div 
                style={{ borderBottomColor: `${theme.primary}0d`, boxShadow: `0 4px 30px ${theme.shadow}` }}
                className="bg-white/80 backdrop-blur-xl border-b"
            >
                <div className="max-w-[1400px] mx-auto px-4 lg:px-10 flex items-center h-16 overflow-x-auto no-scrollbar gap-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`
                                whitespace-nowrap px-6 py-2 text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-full
                                ${activeSection === section.id
                                    ? '' 
                                    : 'hover:bg-white/50'
                                }
                            `}
                            style={{
                                backgroundColor: activeSection === section.id ? theme.accent : 'transparent',
                                color: activeSection === section.id ? theme.btnActiveText : `${theme.primary}80`,
                                boxShadow: activeSection === section.id ? `0 4px 15px ${theme.accent}4d` : 'none'
                            }}
                        >
                            {section.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductStickyNavigation;
