import React from 'react'
import ReviewCard from './ReviewCard'
import { Divider } from '@mui/material'
import SimilarProduct from '../ProductDetails/SimilarProduct'
import { useParams } from 'react-router-dom'

const Review = () => {
  const { productId } = useParams<{ productId: string }>();
  return (
    <>
    <div className='p-5 lg:px-20 flex flex-col lg:flex-row gap-20'>
      <section className='w-full md:w-1/2 lg:w-[30%] space-y-2'>

        <img src="data:image/jpeg;base64,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"
          alt="" />

        <div>
          <div>
            <p className='font-bold text-xl'>Ram Clothing</p>
            <p className='text-lg text-gray-600'>Men's White Shirt</p>

          </div>
        </div>
      </section>

      <section className='space-y-5 w- full'>
        {[1, 1, 1].map((item, index) => <div key={index} className='space-y-3'>
          <ReviewCard review={{
            id: index,
            rating: 4.5,
            reviewText: "Value for money product",
            user: { firstName: "Rama", lastName: "Krishna" },
            createdAt: new Date().toISOString()
          }} />
          <Divider />
        </div>)}

      </section>
    </div>

    {/* --- SIMILAR PRODUCTS - Absolute Bottom --- */}
    <div className="px-5 lg:px-20 mt-20 border-t border-[#3E2C1E]/5 pt-20">
        <SimilarProduct currentProductId={Number(productId)} />
    </div>
  </>
  )
}

export default Review
