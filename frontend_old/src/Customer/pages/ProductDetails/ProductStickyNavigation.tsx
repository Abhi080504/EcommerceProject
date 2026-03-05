import React, { useEffect, useState } from 'react';

const ProductStickyNavigation = () => {
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['overview', 'product-details', 'reviews', 'similar-products'];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Adjust for sticky header height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="sticky top-20 z-40 bg-white shadow-sm border-b border-gray-200 hidden lg:block">
            <div className="max-w-[1200px] mx-auto px-10">
                <div className="flex gap-8 py-3 text-sm font-medium text-gray-600">
                    {['Overview', 'Product Details', 'Reviews', 'Similar Products'].map((item) => {
                        const id = item.toLowerCase().replace(' ', '-');
                        return (
                            <button
                                key={id}
                                onClick={() => scrollToSection(id)}
                                className={`${activeSection === id ? 'text-primary-color border-b-2 border-primary-color' : 'hover:text-primary-color'} pb-1 transition-colors`}
                            >
                                {item}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProductStickyNavigation;
