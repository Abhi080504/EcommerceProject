import React from "react";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
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
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h6" fontWeight="bold">Add New Address</Typography>
        <CloseIcon onClick={onClose} className="cursor-pointer text-gray-500 hover:text-gray-800" />
      </div>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>

          <Grid size={{ xs: 12 }}>
            <TextField
              name="name" label="Name" fullWidth size="small"
              value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={Boolean(formik.touched.name && formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              name="mobile" label="Mobile" fullWidth size="small"
              value={formik.values.mobile} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={Boolean(formik.touched.mobile && formik.errors.mobile)}
              helperText={formik.touched.mobile && formik.errors.mobile}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              name="pincode" label="Pin Code" fullWidth size="small"
              value={formik.values.pincode} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={Boolean(formik.touched.pincode && formik.errors.pincode)}
              helperText={formik.touched.pincode && formik.errors.pincode}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              name="address" label="Address (House No, Building, Street)" fullWidth multiline rows={2} size="small"
              value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={Boolean(formik.touched.address && formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              name="city" label="City" fullWidth size="small"
              value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={Boolean(formik.touched.city && formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <TextField
              name="state" label="State" fullWidth size="small"
              value={formik.values.state} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={Boolean(formik.touched.state && formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              name="localcity" label="Locality" fullWidth size="small"
              value={formik.values.localcity} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={Boolean(formik.touched.localcity && formik.errors.localcity)}
              helperText={formik.touched.localcity && formik.errors.localcity}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#0C831F',
                py: 1.5,
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#096b19' }
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