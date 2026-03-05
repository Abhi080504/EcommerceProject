import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
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
  MenuItem,
  styled,
  tableCellClasses
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Class, ListAlt } from '@mui/icons-material';
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
  borderRadius: 3,
  outline: 'none'
};

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  image: Yup.string().required('Image URL is required'),
  categoryId: Yup.string().required('Category ID is required'),
  section: Yup.string().required('Section is required')
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1e293b',
    color: theme.palette.common.white,
    fontWeight: 700,
    fontSize: 13,
    borderBottom: 'none',
    padding: '18px 16px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderBottom: '1px solid #f1f5f9',
    color: '#475569',
    padding: '20px 16px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: '#f8fafc' },
  '&:hover': { 
    backgroundColor: '#e2e8f0', 
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1.001)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  },
  '&:last-child td, &:last-child th': { border: 0 },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const HomeCategoryTable = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state: any) => state.homeCategory);

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
      <Paper 
        elevation={0}
        sx={{ 
            borderRadius: 3, 
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                background: 'linear-gradient(135deg, #00927c 0%, #0f9f8f 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex', 
                alignItems: 'center', 
                gap: 1 
            }}>
                <Class sx={{ color: '#00927c' }} /> Home Categories
            </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                Manage categories displayed on the home page
            </Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <StyledTableCell>Id</StyledTableCell>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Category Id</StyledTableCell>
                <StyledTableCell>Section</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((item: any) => (
                <StyledTableRow key={item.id}>
                  <StyledTableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>#{item.id}</StyledTableCell>
                  <StyledTableCell>
                    <Box 
                        component="img"
                        src={item.image} 
                        alt={item.name} 
                        sx={{
                            width: 48,
                            height: 48,
                            objectFit: 'contain',
                            borderRadius: 1.5,
                            border: '1px solid #e2e8f0',
                            p: 0.5,
                            bgcolor: '#fff'
                        }}
                    />
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{item.name}</StyledTableCell>
                  <StyledTableCell>{item.categoryId}</StyledTableCell>
                  <StyledTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b', fontSize: 13 }}>
                        <ListAlt sx={{ fontSize: 16 }} />
                        {item.section?.replace(/_/g, ' ')}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button 
                        onClick={() => handleOpen(item)}
                        size="small" 
                        sx={{ 
                            minWidth: 'auto',
                            color: '#0f172a',
                            bgcolor: '#f1f5f9',
                            borderRadius: 1,
                            p: 1,
                            '&:hover': { bgcolor: '#e2e8f0' }
                        }}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ mb: 1, fontWeight: 700, color: '#1e293b' }}>
            Edit Category
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: '#64748b' }}>
            Update home category details
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

            <FormControl fullWidth sx={{ mb: 3 }}>
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

            <Button 
                color="primary" 
                variant="contained" 
                fullWidth 
                type="submit"
                disableElevation
                sx={{ 
                    py: 1.5,
                    backgroundColor: '#0f172a',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': { backgroundColor: '#334155' }
                }}
            >
              Update
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default HomeCategoryTable;
