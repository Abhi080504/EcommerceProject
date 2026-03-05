import React from 'react';
import { useFormik } from 'formik';
import { Box, Button, TextField, Grid, Typography, Paper, InputAdornment } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch } from '../../../../State/hooks';
import { createCoupon } from '../../../../State/Coupon/couponSlice';
import { Discount, CalendarMonth, LocalOffer, AttachMoney } from '@mui/icons-material';

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
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 3, 
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
        }}
      >
        <Typography variant='h5' sx={{ 
          fontWeight: 700, 
          background: 'linear-gradient(135deg, #00927c 0%, #0f9f8f 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1, 
          textAlign: 'center' 
        }}>
          Create New Coupon
        </Typography>
        <Typography variant='body2' sx={{ color: '#64748b', mb: 4, textAlign: 'center' }}>
          Create a new discount coupon for your customers
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                name="code"
                label="Coupon Code"
                placeholder="e.g. SUMMER25"
                value={formik.values.code}
                onChange={formik.handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOffer sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <Button 
                      onClick={() => {
                        const code = "CPN-" + Math.random().toString(36).substring(2, 8).toUpperCase();
                        formik.setFieldValue("code", code);
                      }} 
                      size="small"
                      sx={{ 
                        textTransform: 'none', 
                        color: '#0f172a', 
                        fontWeight: 600,
                        backgroundColor: '#f1f5f9',
                        '&:hover': { backgroundColor: '#e2e8f0' }
                      }}
                    >
                      Generate
                    </Button>
                  )
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 2 } 
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                name="discountPercentage"
                label="Discount %"
                type="number"
                placeholder="e.g. 10"
                value={formik.values.discountPercentage}
                onChange={formik.handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Discount sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="Start Date"
                value={formik.values.validityStartDate}
                onChange={(value: Dayjs | null) => formik.setFieldValue('validityStartDate', value)}
                sx={{ width: '100%', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                slots={{ openPickerIcon: CalendarMonth }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="End Date"
                value={formik.values.validityEndDate}
                onChange={(value: Dayjs | null) => formik.setFieldValue('validityEndDate', value)}
                sx={{ width: '100%', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                slots={{ openPickerIcon: CalendarMonth }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                name="minimumOrderValue"
                label="Min Order Value"
                type="number"
                placeholder="e.g. 500"
                value={formik.values.minimumOrderValue}
                onChange={formik.handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button 
                variant="contained" 
                type="submit" 
                fullWidth 
                disableElevation
                sx={{ 
                  py: 1.5, 
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: 15,
                  backgroundColor: '#0f172a',
                  textTransform: 'none',
                  mt: 1,
                  '&:hover': { 
                    backgroundColor: '#334155',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Create Coupon
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default AddNewCouponForm;