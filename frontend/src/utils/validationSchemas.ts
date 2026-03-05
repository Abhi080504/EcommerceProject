import * as Yup from 'yup';

const mobileRegExp = /^[6-9]\d{9}$/;

// --- LOGIN SCHEMAS ---
export const emailSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
});

export const loginSchema = emailSchema.shape({
    otp: Yup.string()
        .required('OTP is required')
        .length(6, 'OTP must be 6 digits')
});

// --- REGISTER SCHEMAS ---
export const registerSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .required('Full Name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    mobile: Yup.string()
        .matches(mobileRegExp, 'Phone number is not valid')
        .required('Mobile number is required')
});

export const registerVerifySchema = registerSchema.shape({
    otp: Yup.string()
        .required('OTP is required')
        .length(6, 'OTP must be 6 digits')
});

export const addressSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    mobile: Yup.string()
        .matches(mobileRegExp, 'Phone number is not valid')
        .required('Mobile number is required'),
    pinCode: Yup.string()
        .length(6, 'Pincode must be 6 digits')
        .required('Pincode is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    locality: Yup.string().required('Locality is required')
});

export const createProductSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().positive('Price must be positive').required('Price is required'),
    discountedPrice: Yup.number().positive('Discounted Price must be positive'),
    discountPersent: Yup.number().min(0).max(100),
    quantity: Yup.number().min(0).integer().required('Quantity is required'),
    brand: Yup.string().required('Brand is required'),
    color: Yup.string().required('Color is required'),
});
