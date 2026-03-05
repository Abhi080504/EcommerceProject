import React, { useState } from 'react';
import UserAddressCard from './UserAddressCard';
import { useAppDispatch, useAppSelector } from '../../../State/hooks';
import { Button, Modal, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddressForm from '../Checkout/AddressForm';
import { loadUserProfile } from '../../../State/Auth/authSlice';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
  outline: "none"
};

const Address = () => {
  const { user } = useAppSelector(state => state.auth);
  const [open, setOpen] = useState(false);

  // Note: Saving address here should ideally call a backend API to add address independently.
  // For now, reusing the structure.

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center pb-2'>
        <div className='flex items-center gap-3'>
          <LocationOnOutlinedIcon sx={{ fontSize: 30, color: '#D97706' }} />
          <div>
            <h1 className='text-xl font-bold text-gray-800'>Saved Addresses</h1>
            <p className='text-gray-500'>Manage your delivery locations</p>
          </div>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            bgcolor: '#D97706',
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: '8px',
            '&:hover': { bgcolor: '#B45309' }
          }}
        >
          Add New Address
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {user?.addresses?.map((item: any) => (
          <UserAddressCard key={item.id} address={item} />
        ))}
        {!user?.addresses?.length && (
          <div className='col-span-full py-10 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300'>
            No saved addresses found.
          </div>
        )}
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <AddressForm onClose={handleClose} />
        </Box>
      </Modal>
    </div>
  )
}

export default Address;
