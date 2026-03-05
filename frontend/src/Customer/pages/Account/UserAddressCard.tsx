import React from 'react'
import { Radio } from '@mui/material'

const UserAddressCard = ({ address }: any) => {
  return (
    <div className='p-5 border rounded-md flex bg-white hover:shadow-md transition-shadow'>
      <div className='space-y-3 w-full'>
        <div className='flex justify-between items-start'>
          <h1 className='font-bold text-lg'>{address?.name}</h1>
        </div>

        <p className='text-gray-600 text-sm'>
          {address?.streetAddress}, {address?.localcity}, {address?.city}, {address?.state} - {address?.pincode}
        </p>

        <p className='text-sm font-medium'>
          <strong>Mobile:</strong> {address?.mobile}
        </p>
      </div>
    </div>
  )
}

export default UserAddressCard
