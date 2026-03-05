import React, { useRef } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom'; // 1. Import Link from react-router-dom

// --- 1. FURNITURE DATA ---
const furnitureDeals = [
  { id: 1, name: "Mattresses", offer: "From ₹2,990", image: "https://rukminim2.flixcart.com/image/120/120/j5ihlzk0/bed-mattress/2/y/c/6-48-75-skbnnldb75x48x06-bonnell-spring-peps-original-imaevnpjqz2mwyrz.jpeg?q=80" },
  { id: 2, name: "Sofa & Sectional", offer: "From ₹7,999", image: "https://rukminim2.flixcart.com/image/120/120/l4d2ljk0/sofa-sectional/x/j/l/left-facing-180-34-aqua-blue-241-3-polyester-80-steffan-l-sheped-original-imagf9zer8ptqhrh.jpeg?q=80" },
  { id: 3, name: "Office Study Chairs", offer: "From ₹1,890", image: "https://rukminim2.flixcart.com/image/120/120/xif0q/office-study-chair/z/t/2/1-teak-sagun-58-42-js-29-beaatho-121-92-original-imagrwgshgp2bhwv.jpeg?q=80" },
  { id: 4, name: "Beds", offer: "From ₹11,790", image: "https://rukminim2.flixcart.com/image/120/120/jm9hfgw0/bed/h/g/g/king-na-rosewood-sheesham-bkwl05nhbs0401d1p-flipkart-perfect-original-imaf97cwhvgnwg95.jpeg?q=80" },
  { id: 5, name: "TV Units", offer: "From ₹1,249", image: "https://rukminim2.flixcart.com/image/120/120/kb9ou4w0/tv-entertainment-unit/f/x/h/particle-board-za0022wh-barewether-white-with-walnut-original-imafsnnntmvsysap.jpeg?q=80" },
  { id: 6, name: "Sofa Beds", offer: "From ₹6,099", image: "https://rukminim2.flixcart.com/image/120/120/xif0q/sofa-bed/3/q/4/-original-imagm9ckhma9u8a3.jpeg?q=80" },
];

// --- 2. APPLIANCES DATA ---
const applianceDeals = [
  { id: 1, name: "Kitchen Essentials", offer: "From ₹1,249", image: "https://rukminim2.flixcart.com/image/312/312/l5h2xe80/mixer-grinder-juicer/j/r/f/-original-imagg4y3grh4tqu7.jpeg?q=70" },
  { id: 2, name: "Home Essentials", offer: "Shop Now!", image: "https://rukminim2.flixcart.com/image/312/312/xif0q/water-purifier/o/k/l/-original-imagpgz3g8g8g8g8.jpeg?q=70" },
  { id: 3, name: "Fans & Geysers", offer: "From ₹799", image: "https://rukminim2.flixcart.com/image/312/312/ktszgy80/fan/n/b/y/44-android-ios-w26-plus-smart-watch-fitpro-yes-original-imag71h5m6y8h55e.jpeg?q=70" },
  { id: 4, name: "Irons", offer: "Under ₹499", image: "https://rukminim2.flixcart.com/image/312/312/xif0q/iron/w/q/w/-original-imagg9k7g8g8g8g8.jpeg?q=70" },
  { id: 5, name: "Vacuum Cleaners", offer: "Min. 40% Off", image: "https://rukminim2.flixcart.com/image/312/312/l4hcx3k0/vacuum-cleaner/w/h/c/sh-220-72-78-sleep-holes-original-imagfcfj4z52x.jpeg?q=70" },
];

// --- 3. TOP DEALS (Electronics) ---
const topDeals = [
  { id: 1, name: "Apple iPads", offer: "Shop Now!", image: "https://rukminim2.flixcart.com/image/312/312/l5h2xe80/tablet/j/r/f/-original-imagg4y3grh4tqu7.jpeg?q=70" },
  { id: 2, name: "Instax Cameras", offer: "From ₹3,999", image: "https://rukminim2.flixcart.com/image/312/312/xif0q/instant-camera/o/k/l/-original-imagpgz3g8g8g8g8.jpeg?q=70" },
  { id: 3, name: "Perfume & More", offer: "Min 50% Off", image: "https://rukminim2.flixcart.com/image/312/312/ktszgy80/perfume/n/b/y/44-android-ios-w26-plus-smart-watch-fitpro-yes-original-imag71h5m6y8h55e.jpeg?q=70" },
  { id: 4, name: "Guitars", offer: "Up to 70% Off", image: "https://rukminim2.flixcart.com/image/312/312/xif0q/musical-instrument/w/q/w/-original-imagg9k7g8g8g8g8.jpeg?q=70" },
  { id: 5, name: "Headphones", offer: "Up to 60% Off", image: "https://rukminim2.flixcart.com/image/612/612/kmp7ngw0/headphone/u/g/e/rockerz-450-boat-original-imagfj935vgd2hza.jpeg?q=70" },
];

// --- 4. BOOKS & TOYS ---
const booksToysDeals = [
  { id: 1, name: "Helmets", offer: "From ₹699", image: "https://rukminim2.flixcart.com/image/612/612/xif0q/helmet/j/w/d/-original-imagg9k7g8g8g8g8.jpeg?q=70" },
  { id: 2, name: "Soft Toys", offer: "From ₹149", image: "https://rukminim2.flixcart.com/image/612/612/k2z1t3k0/stuffed-toy/8/n/d/soft-toys-for-girls-kids-teddy-bear-birthday-gift-baby-toys-original-imafm6h8z4z33z3.jpeg?q=70" },
  { id: 3, name: "Action Figures", offer: "Upto 70% Off", image: "https://rukminim2.flixcart.com/image/612/612/l5jxt3k0/action-figure/k/5/l/4-5-iron-man-action-figure-toy-for-kids-3-years-marvel-avengers-original-imagg7j4g6g6g6g6.jpeg?q=70" },
  { id: 4, name: "Fiction Books", offer: "Min 40% Off", image: "https://rukminim2.flixcart.com/image/612/612/kwpam4w0/book/r/u/r/-original-imag9bv6bzstgp2x.jpeg?q=70" },
  { id: 5, name: "Remote Control Toys", offer: "From ₹499", image: "https://rukminim2.flixcart.com/image/612/612/kiqbma80-0/remote-control-toy/g/c/b/remote-control-rock-crawler-monster-truck-4wd-rally-car-original-imafyfn2g6g6g6g6.jpeg?q=70" },
];

// --- 5. HOME ESSENTIALS ---
const homeEssentialsDeals = [
  { id: 1, name: "Water Bottles", offer: "Min 50% Off", image: "https://rukminim2.flixcart.com/image/612/612/l1tmf0w0/bottle/y/i/8/1000-water-bottle-1-litre-bottle-for-school-office-home-gym-original-imagdb8z4z3z3z3.jpeg?q=70" },
  { id: 2, name: "Lunch Boxes", offer: "Min 40% Off", image: "https://rukminim2.flixcart.com/image/612/612/kybvo280/lunch-box/j/w/h/3-stainless-steel-lunch-box-with-bag-3-container-400-ml-each-original-imagakz5z3z3z3z3.jpeg?q=70" },
  { id: 3, name: "Cookware Sets", offer: "From ₹599", image: "https://rukminim2.flixcart.com/image/612/612/k7w8eq80/cookware-set/q/z/u/1-omega-deluxe-granite-3-pc-set-with-240mm-fry-pan-240mm-original-imafq2q2z3z3z3z3.jpeg?q=70" },
  { id: 4, name: "Containers", offer: "Under ₹299", image: "https://rukminim2.flixcart.com/image/612/612/k66sh3k0/container/g/j/k/1-kt-01-kuber-industries-original-imafzpkgz3z3z3z3.jpeg?q=70" },
  { id: 5, name: "Tools & Hardware", offer: "From ₹99", image: "https://rukminim2.flixcart.com/image/612/612/k1jly4w0/tool-kit/z/z/z/1-46-pcs-socket-wrench-set-ratchet-torque-spanner-screwdriver-original-imafh2z3z3z3z3.jpeg?q=70" },
];

const GrocerySection = ({ title }: { title: string }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (offset: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    const getDataByTitle = () => {
        if (title.includes("Furniture")) return furnitureDeals;
        if (title.includes("Appliances")) return applianceDeals;
        if (title.includes("Electronics")) return topDeals;
        if (title.includes("Books") || title.includes("Toys")) return booksToysDeals;
        if (title.includes("Home Essentials") || title.includes("Essentials")) return homeEssentialsDeals;
        return furnitureDeals;
    };

    const itemsToRender = getDataByTitle();

    return (
        <div className='py-6 px-4 lg:px-6 relative z-20 group bg-white border-b border-gray-100'> 
            
            {/* Header */}
            <div className='px-4 lg:px-5 py-4 flex justify-between items-center border-b border-gray-100'>
                 <h2 className='text-[22px] font-medium text-black'>{title}</h2>
                 
                 <div className='flex gap-2'>
                    <IconButton 
                        onClick={() => scroll(-300)} 
                        sx={{ bgcolor: '#2874f0', color: 'white', height: '36px', width: '36px', boxShadow: 2, '&:hover': {bgcolor: '#1c54b2'} }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                    <IconButton 
                        onClick={() => scroll(300)} 
                        sx={{ bgcolor: '#2874f0', color: 'white', height: '36px', width: '36px', boxShadow: 2, '&:hover': {bgcolor: '#1c54b2'} }}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                 </div>
            </div>
            
            <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 scrollbar-hide py-4 px-4"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {itemsToRender.map((item) => (
                    // 2. Wrap the card in a Link component
                    <Link 
                        to={`/product/${item.id}`} // Links to /product/1, /product/2, etc.
                        key={item.id} 
                        className="min-w-[160px] md:min-w-[190px] snap-start h-full cursor-pointer hover:shadow-lg transition-shadow rounded-md p-3 border border-transparent hover:border-gray-200 block text-inherit no-underline"
                    >
                         {/* Card Layout */}
                         <div className="w-full h-[150px] mb-3 flex items-center justify-center p-2">
                             <img 
                                src={item.image} 
                                alt={item.name} 
                                className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300" 
                             />
                         </div>

                         <div className="text-center space-y-1">
                             <h3 className="font-medium text-gray-800 text-[14px] leading-tight">
                                {item.name}
                             </h3>
                             <p className="text-black font-bold text-[15px]">
                                {item.offer}
                             </p>
                         </div>
                    </Link>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="absolute left-0 top-[55%] -translate-y-1/2 hidden lg:group-hover:block z-10">
                <IconButton 
                    onClick={() => scroll(-300)} 
                    sx={{
                        bgcolor: 'white', 
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)', 
                        height: '40px', 
                        width: '40px',
                        borderRadius: '4px', 
                        '&:hover': {bgcolor: 'white'}
                    }}
                >
                    <ChevronLeftIcon sx={{ color: 'black' }} />
                </IconButton>
            </div>
            <div className="absolute right-0 top-[55%] -translate-y-1/2 hidden lg:group-hover:block z-10">
                <IconButton 
                    onClick={() => scroll(300)} 
                    sx={{
                        bgcolor: 'white', 
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)', 
                        height: '40px', 
                        width: '40px',
                        borderRadius: '4px',
                        '&:hover': {bgcolor: 'white'}
                    }}
                >
                    <ChevronRightIcon sx={{ color: 'black' }} />
                </IconButton>
            </div>
        </div>
    )
}

export default GrocerySection;