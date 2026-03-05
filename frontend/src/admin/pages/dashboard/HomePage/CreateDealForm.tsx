import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Box, Button, TextField, Typography, Paper } from '@mui/material'
import { useAppDispatch } from '../../../../State/hooks'
import { createDeal } from '../../../../State/Deals/dealSlice'

const validationSchema = Yup.object({
  discount: Yup.number().required("Discount is required").min(1, "Must be at least 1%"),
  category: Yup.object().shape({
      id: Yup.number().required("Category Id is required"),
  })
});

const CreateDealForm = () => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      discount: 0,
      category: {
        id: ""
      }
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const dealData = {
        discount: Number(values.discount),
        category: {
          id: Number(values.category.id)
        }
      };
      
      dispatch(createDeal(dealData));
      formik.resetForm();
      // Ideally show a snackbar here, but alert for now as a fallback
      alert("Deal Created Successfully");
    },
  });

  return (
    <Box sx={{ maxWidth: 500, width: '100%', p: 2 }}>
       <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, textAlign: 'center', color: '#1e293b' }}>
            Create New Deal
        </Typography>
        <form onSubmit={formik.handleSubmit}>
            <TextField
                fullWidth
                id="category.id"
                name="category.id"
                label="Category ID"
                placeholder="Enter Category ID (e.g. 10)"
                type="number"
                value={formik.values.category.id}
                onChange={formik.handleChange}
                // @ts-ignore
                error={formik.touched.category?.id && Boolean(formik.errors.category?.id)}
                // @ts-ignore
                helperText={formik.touched.category?.id && formik.errors.category?.id}
                sx={{ mb: 3 }}
            />
            <TextField
                fullWidth
                id="discount"
                name="discount"
                label="Discount Percentage"
                placeholder="Enter discount %"
                type="number"
                value={formik.values.discount}
                onChange={formik.handleChange}
                error={formik.touched.discount && Boolean(formik.errors.discount)}
                helperText={formik.touched.discount && formik.errors.discount}
                sx={{ mb: 4 }}
            />
            <Button 
                color="primary" 
                variant="contained" 
                fullWidth 
                type="submit"
                size="large"
                disableElevation
                sx={{ 
                    py: 1.5, 
                    borderRadius: 2, 
                    fontWeight: 600,
                    backgroundColor: '#0f172a',
                    '&:hover': {
                        backgroundColor: '#334155',
                    }
                }}
            >
                Create Deal
            </Button>
        </form>
       </Paper>
    </Box>
  )
}

export default CreateDealForm
