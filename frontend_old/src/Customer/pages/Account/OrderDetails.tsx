import { Box, Button, Divider } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import OrderStepper from './OrderStepper'
import { Payments } from '@mui/icons-material'

const OrderDetails = () => {
    const navigate=useNavigate()
  return (
    <Box className='space-y-5 '>

<section className='flex flex-col gap-5 justify-center items-center'>
<img className='w-[100px]' src={"http://res.cloudinary.com/dxoqwusir/image/upload/v1727452042/pro-ray-android-ios-cellecor-yes-original-imagydnsrany7qhy_1_m9n9t5.webp"}
alt=""/>

<div className='text-sm space-y-1 text-center'>
<h1 className='font-bold'>{"Virani Clothing"}
</h1>
<p>Cellecor RAY 1.43" AMOLED Display | 700 NITS | AOD | BT-Calling | AI
Voice | Split Screen Smartwatch (Black Strap, Free Size)</p>
<p>
    <strong>Size :</strong>
M
</p>
</div>
<div>
<Button onClick={() => navigate(`/reviews/${5}/create`)}>Write Review</Button>
</div>
</section>

<section className='border p-5'>
    <OrderStepper orderStatus={"SHIPPED"}/>

</section>

<div className='border p-5'>
    <h1 className='font-bold pb-3'>Delivery Address</h1>
    <div className='text-sm space-y-2'>
    <div className='flex gap-5 font-medium'>
        <p>{"Zosh"}</p>
        <Divider flexItem orientation='vertical' />
        <p>{1234557843}</p>
    </div>
    <p>
        Enter Address
    </p>
    </div>
</div>

<div className='border space-y-4'>

    <div className='flex justify-between text-sm pt-5 px-5'>
        <div className='space-y-1'>
            <p className='font-bold'>Total Item Price</p>
            <p>You Saved <span className='text-green-500 font-medium text-xs'>Rs {9999}.00</span>
            on this item</p>
        </div>

        <p className='font-medium'>Rs 999.00</p>
    </div>

    <div className='px-5'>
        <div className='bg-teal-50 px-5 py-2 text-xs font-medium flex items-center gap-3'>
            <Payments/>
            <p>Pay On Delivery</p>


        </div>
    </div>

</div>
<Divider/>
<div className='px-5 pb-5'>
    <p className='text-x5'><strong>Sold by : </strong>{"Brand Name"}</p>
</div>

<div className='p-10'>
    <Button
    disabled={true}
    // onClick={handleCancelOrder}
    color='error' sx={{py:"0.7rem"}} className='' variant='outlined'
    fullWidth>
        {true?"order canceled" : "Canceled Order"}
    </Button>
</div>
</Box>
  )
}

export default OrderDetails
