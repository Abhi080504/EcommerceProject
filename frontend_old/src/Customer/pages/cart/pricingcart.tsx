import React, { useState } from 'react';
import { Button, Divider, Box, Typography } from '@mui/material';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';

const PricingCart = () => {
  const [selectedTip, setSelectedTip] = useState<number | null>(null);

  // Tips Data
  const tips = [10, 20, 30, 50];

  return (
    <div className='w-full'>
        
      {/* 1. DELIVERY PARTNER TIP */}
      <div className="mb-6 p-4 bg-white rounded-xl border border-[#E0D8CC] shadow-sm">
          <h3 className="font-bold text-[#3E2C1E] text-md mb-1">Delivery Partner Tip</h3>
          <p className="text-xs text-[#8D5A46] mb-4">The entire amount goes to your delivery partner.</p>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {tips.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedTip(selectedTip === amount ? null : amount)}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl border transition-all min-w-[80px] justify-center
                        ${selectedTip === amount 
                            ? 'bg-[#FFF8E1] border-[#F9B233] shadow-[0_0_0_1px_#F9B233]' // Active: Cream BG + Gold Border
                            : 'bg-white border-[#E0D8CC] hover:border-[#D97706]' // Default
                        }
                    `}
                  >
                      {/* Emoji Icon */}
                      <span className="text-lg">🥰</span>
                      
                      {/* Amount */}
                      <span className={`font-bold text-sm ${selectedTip === amount ? 'text-[#3E2C1E]' : 'text-[#5D4037]'}`}>
                          ₹{amount}
                      </span>
                  </button>
              ))}
          </div>
      </div>

      {/* 2. BILL DETAILS */}
      <div className="space-y-3 mb-6 px-1">
          <h3 className="font-bold text-[#3E2C1E] text-md mb-3">Bill Details</h3>
          
          {/* Item Total */}
          <div className="flex justify-between text-sm text-[#5D4037] items-center">
              <div className="flex items-center gap-1.5">
                  <ElectricBoltIcon sx={{ fontSize: 16, color: '#D97706' }} />
                  <span>Item Total</span>
              </div>
              <span className="font-bold text-[#3E2C1E]">₹81</span>
          </div>

          {/* Delivery Fee */}
          <div className="flex justify-between text-sm text-[#5D4037] items-center">
              <div className="flex items-center gap-1.5">
                  <ElectricBoltIcon sx={{ fontSize: 16, color: '#D97706' }} />
                  <span>Delivery Fee</span>
              </div>
              <div className="flex items-center gap-2">
                  <span className="line-through text-[#A1887F] text-xs">₹25</span>
                  <span className="text-[#D97706] font-bold text-xs uppercase tracking-wide">FREE</span>
              </div>
          </div>

          {/* Handling Charge */}
          <div className="flex justify-between text-sm text-[#5D4037] items-center">
              <div className="flex items-center gap-1.5">
                  <ElectricBoltIcon sx={{ fontSize: 16, color: '#D97706' }} />
                  <span>Handling Charge</span>
              </div>
              <span className="font-bold text-[#3E2C1E]">₹4</span>
          </div>
          
          {/* Selected Tip Row */}
          {selectedTip && (
              <div className="flex justify-between text-sm text-[#5D4037] items-center animate-fade-in">
                  <div className="flex items-center gap-1.5">
                      <span className="text-sm">🥰</span>
                      <span>Delivery Tip</span>
                  </div>
                  <span className="font-bold text-[#3E2C1E]">₹{selectedTip}</span>
              </div>
          )}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-[#D7CCC8] my-4"></div>

      {/* 3. TO PAY */}
      <div className="flex justify-between items-center mb-6 px-1">
          <span className="text-lg font-bold text-[#3E2C1E]">To Pay</span>
          <span className="text-xl font-black text-[#3E2C1E]">₹{85 + (selectedTip || 0)}</span>
      </div>

      {/* 4. SAVINGS STRIP */}
      <div className="bg-[#FFF8E1] border border-[#F9B233]/30 rounded-lg py-3 px-4 mb-2 flex items-center justify-center gap-2 text-[#D97706] text-sm font-bold shadow-sm">
          <span>You saved ₹38 on this order! 🎉</span>
      </div>

      {/* CSS for Fade Animation */}
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

    </div>
  );
};

export default PricingCart;