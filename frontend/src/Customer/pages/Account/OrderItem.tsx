import React from 'react'
import { Box, Grid, Paper, Chip } from '@mui/material'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useNavigate } from 'react-router-dom';

const OrderItem = ({ item, order }: any) => {
  const navigate = useNavigate();

  return (
    <Paper elevation={0}
      className='border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer p-4'
      onClick={() => navigate(`/account/order/${order?.id}/${item?.id}`)}
    >
      {/* 1. Image & Title */}
      <Grid size={{ xs: 12, md: 6 }}>
        <div className='flex items-center gap-4'>
          <div className='w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200'>
            <img
              className='w-full h-full object-cover'
              src={item?.product?.images?.[0] || ""}
              alt={item?.product?.title}
            />
          </div>
          <div>
            <h3 className='font-bold text-gray-800 line-clamp-1'>{item?.product?.title}</h3>
            <p className='text-sm text-gray-500'>Size: {item?.size}</p>
            <p className='text-sm text-gray-500'>Quantity: {item?.quantity}</p>
          </div>
        </div>
      </Grid>

      {/* 2. Price */}
      <Grid size={{ xs: 4, md: 2 }}>
        <p className='font-bold text-gray-800'>₹{item?.sellingPrice || item?.product?.sellingPrice}</p>
      </Grid>

      {/* 3. Status */}
      <Grid size={{ xs: 4, md: 2 }}>
        <div className="flex flex-col gap-1 items-start">
          <Chip
            label={order?.orderStatus || "PLACED"}
            size="small"
            sx={{
              bgcolor: order?.orderStatus === 'DELIVERED' ? '#DEF7EC' : '#FFF8E1',
              color: order?.orderStatus === 'DELIVERED' ? '#03543F' : '#D97706',
              fontWeight: 'bold'
            }}
          />
          <p className='text-xs text-gray-400'>
            On {new Date(order?.orderDate).toLocaleDateString()}
          </p>
        </div>
      </Grid>

      {/* 4. Action (Rate) */}
      <Grid size={{ xs: 4, md: 2 }} className='text-right'>
        <div className='flex items-center justify-end gap-1 text-[#D97706] bg-[#FFF8E1] px-3 py-1 rounded-full w-fit ml-auto'>
          <StarBorderIcon fontSize='small' />
          <span className='text-sm font-bold'>Rate</span>
        </div>
      </Grid>
    </Paper>
  )
}

export default OrderItem
