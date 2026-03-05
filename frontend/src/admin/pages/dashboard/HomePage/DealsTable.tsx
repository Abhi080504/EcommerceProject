import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  TextField,
  Typography,
  Paper,
  styled,
  tableCellClasses,
  Chip,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { LocalOffer, Discount } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../../State/hooks";
import {
  fetchDeals,
  createDeal,
  deleteDeal,
} from "../../../../State/Deals/dealSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
  outline: "none",
};

const validationSchema = Yup.object({
  discount: Yup.number()
    .required("Discount is required")
    .min(1, "Must be at least 1%"),
  category: Yup.object().shape({
    id: Yup.number().required("Category Id is required"),
  }),
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1e293b",
    color: theme.palette.common.white,
    fontWeight: 700,
    fontSize: 13,
    borderBottom: "none",
    padding: "18px 16px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderBottom: "1px solid #f1f5f9",
    color: "#475569",
    padding: "20px 16px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: "#f8fafc" },
  "&:hover": {
    backgroundColor: "#e2e8f0",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "scale(1.001)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  "&:last-child td, &:last-child th": { border: 0 },
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
}));

const DealsTable = () => {
  const dispatch = useAppDispatch();
  const { deals } = useAppSelector((state: any) => state.deal);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDeals());
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      dispatch(deleteDeal(id));
    }
  };

  const formik = useFormik({
    initialValues: {
      discount: 0,
      category: {
        id: "",
      },
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const dealData = {
        discount: Number(values.discount),
        category: {
          id: Number(values.category.id),
        },
      };

      dispatch(createDeal(dealData));
      handleClose();
    },
  });

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #00927c 0%, #0f9f8f 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <LocalOffer sx={{ color: "#00927c" }} /> Active Deals
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Manage special discounts and offers
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            disableElevation
            sx={{
              borderRadius: 2,
              backgroundColor: "#0f172a",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": {
                backgroundColor: "#334155",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.3)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Create Deal
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <StyledTableCell>Id</StyledTableCell>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell align="center">Discount</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deals.map((item: any) => (
                <StyledTableRow key={item.id}>
                  <StyledTableCell
                    sx={{ fontFamily: "monospace", fontWeight: 600 }}
                  >
                    #{item.id}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box
                      component="img"
                      src={item.category?.image}
                      alt=""
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: "contain",
                        borderRadius: 1,
                        border: "1px solid #e2e8f0",
                        p: 0.5,
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                    {item.category?.name || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Chip
                      label={`${item.discount}% OFF`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: "#ecfdf5",
                        color: "#10b981",
                        borderRadius: 1,
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton
                      onClick={() => handleDelete(item.id)}
                      sx={{
                        color: "#ef4444",
                        "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
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
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            sx={{ mb: 1, fontWeight: 700, color: "#1e293b" }}
          >
            Create New Deal
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: "#64748b" }}>
            Add a new discount deal to a category
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="category.id"
              name="category.id"
              label="Category ID"
              placeholder="e.g. 52"
              type="number"
              value={formik.values.category.id}
              onChange={formik.handleChange}
              error={
                formik.touched.category?.id &&
                Boolean(formik.errors.category?.id)
              }
              // @ts-ignore
              helperText={
                formik.touched.category?.id && formik.errors.category?.id
              }
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">#</InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              id="discount"
              name="discount"
              label="Discount Percentage"
              placeholder="e.g. 20"
              type="number"
              value={formik.values.discount}
              onChange={formik.handleChange}
              error={formik.touched.discount && Boolean(formik.errors.discount)}
              helperText={formik.touched.discount && formik.errors.discount}
              sx={{ mb: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Discount sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              disableElevation
              sx={{
                py: 1.5,
                backgroundColor: "#0f172a",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                "&:hover": { backgroundColor: "#334155" },
              }}
            >
              Create Deal
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default DealsTable;
