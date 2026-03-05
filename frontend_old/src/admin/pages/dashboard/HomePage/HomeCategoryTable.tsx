import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from '../../../../State/hooks';
import { fetchHomeCategories, updateHomeCategory } from '../../../../State/HomeCategory/homeCategorySlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  image: Yup.string().required('Image URL is required'),
  categoryId: Yup.string().required('Category ID is required'),
  section: Yup.string().required('Section is required')
});

const HomeCategoryTable = () => {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state: any) => state.homeCategory);

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchHomeCategories());
  }, [dispatch]);

  const handleOpen = (category: any) => {
    setSelectedCategory(category);
    formik.setValues({
      name: category.name,
      image: category.image,
      categoryId: category.categoryId,
      section: category.section || 'SHOP_BY_CATEGORIES'
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      image: '',
      categoryId: '',
      section: 'SHOP_BY_CATEGORIES'
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (selectedCategory) {
        dispatch(updateHomeCategory({
          id: selectedCategory.id,
          data: values
        }));
        handleClose();
      }
    },
  });

  return (
    <Box>
      <Card>
        <CardHeader
          title="Home Categories"
          sx={{ pt: 2, alignItems: "center", "& .MuiCardHeader-action": { mt: 0.6 } }}
        />
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category Id</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((item: any) => (
                <TableRow hover key={item.id} sx={{ "&:last-of-type td, &:last-of-type th": { border: 0 } }}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <img src={item.image} alt={item.name} className='w-16 h-16 object-contain' />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.categoryId}</TableCell>
                  <TableCell>{item.section}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(item)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Edit Category
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="image"
              name="image"
              label="Image URL"
              value={formik.values.image}
              onChange={formik.handleChange}
              error={formik.touched.image && Boolean(formik.errors.image)}
              helperText={formik.touched.image && formik.errors.image}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              id="categoryId"
              name="categoryId"
              label="Category Id"
              value={formik.values.categoryId}
              onChange={formik.handleChange}
              error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
              helperText={formik.touched.categoryId && formik.errors.categoryId}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="section-select-label">Section</InputLabel>
              <Select
                labelId="section-select-label"
                id="section"
                name="section"
                value={formik.values.section}
                label="Section"
                onChange={formik.handleChange}
              >
                <MenuItem value="SHOP_BY_CATEGORIES">Shop By Categories</MenuItem>
                <MenuItem value="GRID">Grid</MenuItem>
                <MenuItem value="ELECTRIC_CATEGORIES">Electric Categories</MenuItem>
                <MenuItem value="DEALS">Deals</MenuItem>
              </Select>
            </FormControl>

            <Button color="primary" variant="contained" fullWidth type="submit">
              Update
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default HomeCategoryTable;
