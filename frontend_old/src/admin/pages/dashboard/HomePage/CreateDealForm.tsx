import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../State/hooks';
import { fetchHomeCategories } from '../../../../State/HomeCategory/homeCategorySlice';
import { createDeal } from '../../../../State/Deals/dealSlice';

const CreateDealForm = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state: any) => state.homeCategory);

  useEffect(() => {
    dispatch(fetchHomeCategories());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      discount: 0,
      category: ""
    },
    onSubmit: (values) => {
      const dealData = {
        discount: values.discount,
        category: {
          id: values.category
        }
      };
      dispatch(createDeal(dealData));
    }

  })
  return (
    <Box component={"form"} onSubmit={formik.handleSubmit}
      className="space-y-6">

      <Typography variant='h4' className='text-center'>
        Create Deal
      </Typography>

      <TextField
        name="discount"
        label="Discount (%)"
        fullWidth value={formik.values.discount}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={Boolean(formik.touched.discount && formik.errors.discount)}
        helperText={formik.touched.discount && formik.errors.discount}
      />

      <FormControl fullWidth>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          name="category"
          value={formik.values.category}
          label="Category"
          onChange={formik.handleChange}
        >
          {categories.map((item: any) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button fullWidth sx={{ py: ".9rem" }} type='submit' variant="contained">
        Create Deal
      </Button>

    </Box>
  )
}

export default CreateDealForm