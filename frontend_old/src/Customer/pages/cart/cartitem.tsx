import React, { useState } from 'react'
import { Add, Remove } from '@mui/icons-material'

const CartItem = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className='p-4 flex gap-4 items-center bg-white'>
        {/* Image */}
        <div className='w-[70px] h-[70px] border border-gray-200 rounded-lg flex items-center justify-center p-1'>
            <img 
                className='w-full h-full object-contain' 
                src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/86446a.jpg"
                alt='Product' 
            />
        </div>

        {/* Details */}
        <div className='flex-1'>
            <h3 className='font-semibold text-gray-800 text-[14px] leading-tight line-clamp-2'>
                Amul Taaza Toned Fresh Milk
            </h3>
            <p className='text-gray-500 text-xs mt-1'>500 ml</p>
            <div className='flex items-center gap-2 mt-1'>
                 <span className='font-bold text-gray-900'>₹27</span>
                 <span className='text-gray-400 text-xs line-through'>₹30</span>
            </div>
        </div>

        {/* Counter Button */}
        <div className='flex flex-col items-end gap-1'>
            <div className='bg-[#EC6426] rounded-lg flex items-center text-white w-[70px] h-[32px] justify-between px-1 shadow-sm'>
                <button 
                    onClick={() => setQuantity(q => Math.max(0, q-1))}
                    className='w-6 flex items-center justify-center hover:bg-[#0a6e19] rounded'
                >
                    <Remove sx={{fontSize: 16}}/>
                </button>
                <span className='text-sm font-bold'>{quantity}</span>
                <button 
                    onClick={() => setQuantity(q => q+1)}
                    className='w-6 flex items-center justify-center hover:bg-[#0a6e19] rounded'
                >
                    <Add sx={{fontSize: 16}}/>
                </button>
            </div>
        </div>          
    </div>
  )
}

export default CartItem