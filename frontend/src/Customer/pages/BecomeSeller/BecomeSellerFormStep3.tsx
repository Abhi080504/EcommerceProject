import { TextField } from '@mui/material'
import React from 'react'

const BecomeSellerFormStep3 = ({ formik }: any) => {
return(
    <div className="space-y-5">
        <h2 className='text-xl font-bold text-center pb-2'>Bank Details</h2>
        <TextField
            fullWidth
            name="bankDetails.accountNumber"
            label="Account Number"
            value={formik.values.bankDetails?.accountNumber}
            onChange={formik.handleChange}
        />
        <TextField
            fullWidth
            name="bankDetails.ifscCode"
            label="IFSC Code"
            value={formik.values.bankDetails?.ifscCode}
            onChange={formik.handleChange}
        />
        <TextField
            fullWidth
            name="bankDetails.accountHolderName"
            label="Account Holder Name"
            value={formik.values.bankDetails?.accountHolderName}
            onChange={formik.handleChange}
        />
    </div>
    );
};
export default BecomeSellerFormStep3