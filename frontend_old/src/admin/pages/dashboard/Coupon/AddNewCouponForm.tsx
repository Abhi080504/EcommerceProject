import React from 'react';
import { useFormik } from 'formik';
import { Box, Button, TextField, Grid, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch } from '../../../../State/hooks';
import { createCoupon } from '../../../../State/Coupon/couponSlice';

interface CouponFormValues {
  code: string;
  discountPercentage: number;
  validityStartDate: Dayjs | null;
  validityEndDate: Dayjs | null;
  minimumOrderValue: number;
}

const AddNewCouponForm = () => {
  const dispatch = useAppDispatch();

  const formik = useFormik<CouponFormValues>({
    initialValues: {
      code: '',
      discountPercentage: 0,
      validityStartDate: dayjs(),
      validityEndDate: dayjs().add(30, 'day'),
      minimumOrderValue: 0,
    },
    onSubmit: (values) => {
      const formattedValues = {
        ...values,
        validityStartDate: values.validityStartDate ? values.validityStartDate.format("YYYY-MM-DD") : null,
        validityEndDate: values.validityEndDate ? values.validityEndDate.format("YYYY-MM-DD") : null,
      }
      console.log("Coupon Submit", formattedValues);
      dispatch(createCoupon(formattedValues));
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }} className="space-y-4 max-w-4xl mx-auto p-5">
        <Typography variant='h4' className='text-center pb-5'>Create Coupon</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="code"
              label="Coupon Code"
              value={formik.values.code}
              onChange={formik.handleChange}
              InputProps={{
                endAdornment: (
                  <Button onClick={() => {
                    const code = "CPN-" + Math.random().toString(36).substring(2, 8).toUpperCase();
                    formik.setFieldValue("code", code);
                  }} size="small">
                    Generate
                  </Button>
                )
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="discountPercentage"
              label="Discount %"
              type="number"
              value={formik.values.discountPercentage}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DatePicker
              label="Start Date"
              value={formik.values.validityStartDate}
              onChange={(value: Dayjs | null) => formik.setFieldValue('validityStartDate', value)}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DatePicker
              label="End Date"
              value={formik.values.validityEndDate}
              onChange={(value: Dayjs | null) => formik.setFieldValue('validityEndDate', value)}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="minimumOrderValue"
              label="Min Order Value"
              type="number"
              value={formik.values.minimumOrderValue}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button variant="contained" type="submit" fullWidth sx={{ py: 1.5 }}>
              Create Coupon
            </Button>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default AddNewCouponForm;