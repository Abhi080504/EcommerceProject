import { Shop } from '@mui/icons-material'
import React from 'react'
import ShopBycategoryCard from './ShopBycategoryCard'

const ShopByCategory = () => {
  return (
    <div className='flex flex-wrap justify-between lg:px-20 gap-7'>
      {[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((item)=><ShopBycategoryCard/>)}
    </div>
  )
}

export default ShopByCategory
