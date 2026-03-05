import { TextField } from '@mui/material'
import React from 'react'

const BecomeSellerFormStep4 = ({ formik }: any) => {
    return (
        <div className='space-y-5'>
            <h2 className='text-xl font-bold text-center pb-2'>Business Details</h2>
            <TextField
                fullWidth
                name="bussinessDetails.bussinessName"
                label="Business Name"
                value={formik.values.bussinessDetails?.bussinessName}
                onChange={formik.handleChange}
            />
            <TextField
                fullWidth
                name="sellerName"
                label="Seller Name"
                value={formik.values.sellerName}
                onChange={formik.handleChange}
            />
            <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
            />
        </div>
    )
}
export default BecomeSellerFormStep4
