import React from "react";
import { Box, Grid, TextField } from "@mui/material";

const BecomeSellerFormStep2 = ({ formik }: any) => {
    return (
        <Box>
            <h2 className='text-xl font-bold text-center pb-6'>Pickup Address</h2>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <TextField name="pickUpAddress.name" label="Name" fullWidth value={formik.values.pickUpAddress?.name} onChange={formik.handleChange} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <TextField name="pickUpAddress.mobile" label="Mobile" fullWidth value={formik.values.pickUpAddress?.mobile} onChange={formik.handleChange} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <TextField name="pickUpAddress.pincode" label="Pincode" fullWidth value={formik.values.pickUpAddress?.pincode} onChange={formik.handleChange} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField name="pickUpAddress.address" label="Address" fullWidth value={formik.values.pickUpAddress?.address} onChange={formik.handleChange} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TextField name="pickUpAddress.locality" label="Locality" fullWidth value={formik.values.pickUpAddress?.locality} onChange={formik.handleChange} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <TextField name="pickUpAddress.city" label="City" fullWidth value={formik.values.pickUpAddress?.city} onChange={formik.handleChange} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <TextField name="pickUpAddress.state" label="State" fullWidth value={formik.values.pickUpAddress?.state} onChange={formik.handleChange} />
                </Grid>
            </Grid>
        </Box>
    );
};
export default BecomeSellerFormStep2;
