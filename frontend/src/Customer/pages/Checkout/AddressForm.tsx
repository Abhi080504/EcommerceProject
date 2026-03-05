import React from "react";
import { Box, TextField, Button, Typography, Grid, IconButton } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import CloseIcon from '@mui/icons-material/Close';

type FormValues = {
  name: string; mobile: string; pincode: string; address: string;
  city: string; state: string; localcity: string;
};

const AddressFormSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  mobile: Yup.string().required("Mobile is required").matches(/^[6-9]\d{9}$/, "Invalid mobile"),
  pincode: Yup.string().required("Pin code is required").matches(/^[1-9][0-9]{5}$/, "Invalid pin code"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  localcity: Yup.string().required("Locality is required"),
});

interface AddressFormProps {
  onClose: () => void;
  onSubmit?: (data: FormValues) => void;
}

const AddressForm = ({ onClose, onSubmit }: AddressFormProps) => {
  const formik = useFormik<FormValues>({
    initialValues: { name: "", mobile: "", pincode: "", address: "", city: "", state: "", localcity: "" },
    validationSchema: AddressFormSchema,
    onSubmit: (v) => {
      if (onSubmit) onSubmit(v);
      onClose();
    },
  });

  return (
    <Box>
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-[#F9B233]/20">
        <Typography variant="h5" fontWeight="900" className="text-[#3E2C1E] tracking-tight">
          Add New Address
        </Typography>
        <IconButton 
          onClick={onClose} 
          sx={{ 
            color: '#8D5A46',
            '&:hover': { 
              bgcolor: '#FFF8F0', 
              color: '#3E2C1E' 
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2.5}>

          <Grid size={{ xs: 12 }}>
            <TextField
              name="name" 
              label="Full Name" 
              fullWidth 
              size="medium"
              value={formik.values.name} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.name && formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  '&.Mui-focused fieldset': {
                    borderColor: '#F9B233',
                    borderWidth: '2px'
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#F9B233',
                  fontWeight: 'bold'
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              name="mobile" 
              label="Mobile Number" 
              fullWidth 
              size="medium"
              value={formik.values.mobile} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.mobile && formik.errors.mobile)}
              helperText={formik.touched.mobile && formik.errors.mobile}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  '&.Mui-focused fieldset': {
                    borderColor: '#F9B233',
                    borderWidth: '2px'
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#F9B233',
                  fontWeight: 'bold'
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              name="pincode" 
              label="Pin Code" 
              fullWidth 
              size="medium"
              value={formik.values.pincode} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.pincode && formik.errors.pincode)}
              helperText={formik.touched.pincode && formik.errors.pincode}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  '&.Mui-focused fieldset': {
                    borderColor: '#F9B233',
                    borderWidth: '2px'
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#F9B233',
                  fontWeight: 'bold'
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              name="address" 
              label="Address (House No, Building, Street)" 
              fullWidth 
              multiline 
              rows={3} 
              size="medium"
              value={formik.values.address} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.address && formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  '&.Mui-focused fieldset': {
                    borderColor: '#F9B233',
                    borderWidth: '2px'
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#F9B233',
                  fontWeight: 'bold'
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              name="localcity" 
              label="Locality / Area" 
              fullWidth 
              size="medium"
              value={formik.values.localcity} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.localcity && formik.errors.localcity)}
              helperText={formik.touched.localcity && formik.errors.localcity}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  '&.Mui-focused fieldset': {
                    borderColor: '#F9B233',
                    borderWidth: '2px'
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#F9B233',
                  fontWeight: 'bold'
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              name="city" 
              label="City" 
              fullWidth 
              size="medium"
              value={formik.values.city} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.city && formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  '&.Mui-focused fieldset': {
                    borderColor: '#F9B233',
                    borderWidth: '2px'
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#F9B233',
                  fontWeight: 'bold'
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              name="state" 
              label="State" 
              fullWidth 
              size="medium"
              value={formik.values.state} 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.state && formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  '&.Mui-focused fieldset': {
                    borderColor: '#F9B233',
                    borderWidth: '2px'
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#F9B233',
                  fontWeight: 'bold'
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                background: 'linear-gradient(135deg, #F9B233 0%, #D97706 100%)',
                color: 'white',
                py: 1.8,
                fontWeight: '900',
                fontSize: '1.1rem',
                borderRadius: '16px',
                textTransform: 'none',
                boxShadow: '0 8px 20px rgba(249, 178, 51, 0.3)',
                transition: 'all 0.3s',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #FFCA28 0%, #FFA000 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 28px rgba(249, 178, 51, 0.4)'
                }
              }}
            >
              Save Address
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddressForm;