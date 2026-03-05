import React, { useEffect } from 'react';
import OrderItem from './OrderItem';
import { useAppDispatch, useAppSelector } from '../../../State/hooks';
import { fetchUserOrders } from '../../../State/Order/orderThunks';
import { CircularProgress, Box, Typography } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

const Orders = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector(state => state.order);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <Box className='flex justify-center items-center h-[50vh]'>
        <CircularProgress sx={{ color: '#D97706' }} />
      </Box>
    );
  }

  return (
    <div className='text-sm min-h-screen space-y-6'>
      <div className='flex items-center gap-3 pb-2'>
        <ShoppingBagOutlinedIcon sx={{ fontSize: 30, color: '#D97706' }} />
        <div>
          <h1 className='text-xl font-bold text-gray-800'>My Orders</h1>
          <p className='text-gray-500'>View and track your order history</p>
        </div>
      </div>

      {!orders?.length ? (
        <div className='flex flex-col items-center justify-center p-10 bg-white border border-gray-200 rounded-xl text-center space-y-3'>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 60, color: '#E5E7EB' }} />
          <Typography variant="h6" color="text.secondary">No orders yet</Typography>
          <Typography variant="body2" color="text.secondary">Looks like you haven't placed any orders yet.</Typography>
        </div>
      ) : (
        <div className='space-y-4'>
          {orders.map((order: any) =>
            order?.orderItems?.map((item: any) => (
              <OrderItem key={item.id} item={item} order={order} />
            ))
          )}
        </div>
      )}

    </div>
  )
}

export default Orders;
