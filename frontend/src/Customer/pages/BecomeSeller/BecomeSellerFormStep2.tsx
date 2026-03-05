import React from "react";
import { Box, Grid, TextField } from "@mui/material";

const BecomeSellerFormStep2 = ({formik}:any) => {
  return (
    <Box>
        <h2 className='text-xl font-bold text-center pb-6'>Pickup Address</h2>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField name="pickupAddress.name" label="Name" fullWidth value={formik.values.pickupAddress?.name} onChange={formik.handleChange} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField name="pickupAddress.mobile" label="Mobile" fullWidth value={formik.values.pickupAddress?.mobile} onChange={formik.handleChange} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField name="pickupAddress.pincode" label="Pincode" fullWidth value={formik.values.pickupAddress?.pincode} onChange={formik.handleChange} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField name="pickupAddress.address" label="Address" fullWidth value={formik.values.pickupAddress?.address} onChange={formik.handleChange} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField name="pickupAddress.city" label="City" fullWidth value={formik.values.pickupAddress?.city} onChange={formik.handleChange} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField name="pickupAddress.state" label="State" fullWidth value={formik.values.pickupAddress?.state} onChange={formik.handleChange} />
          </Grid>
        </Grid>
    </Box>
  );
};
export default BecomeSellerFormStep2;