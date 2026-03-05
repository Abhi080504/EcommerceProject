import { Button, Step, StepLabel, Stepper } from '@mui/material'
import { useFormik } from 'formik';
import React, { useState } from 'react'
import BecomeSellerFormStep1 from './BecomeSellerFormStep1';
import BecomeSellerFormStep2 from './BecomeSellerFormStepBase';
import BecomeSellerFormStep3 from './BecomeSellerFormStep3';
import BecomeSellerFormStep4 from './BecomeSellerFormStep4';
import { createSeller } from '../../../State/Auth/sellerRegisterApi';
import { showToast } from '../../../context/ToastContext';

const steps = [
    "Contact Details",
    "Pickup Address",
    "Bank Account",
    "Business Info",
];

const SellerAccountForm = () => {
    const [activeStep, setActiveStep] = useState(0);

    const formik = useFormik({
        initialValues: {
            email: "", otp: "", gstin: "", mobile: "",
            pickUpAddress: { name: "", mobile: "", pincode: "", address: "", locality: "", city: "", state: "" },
            bankDetails: { accountNumber: "", ifscCode: "", accountHolderName: "" },
            sellerName: "",
            bussinessDetails: { bussinessName: "" },
            password: ""
        },
        onSubmit: async (values) => {
            try {
                await createSeller(values);
                showToast("Seller registration submitted successfully! Under review.", "success");
                // window.location.href = "/become-seller/success"; 
            } catch (error) {
                console.error("Registration Error", error);
                showToast("Failed to submit registration. Please check fields.", "error");
            }
        }
    });

    const handleNext = () => {
        let isValid = false;

        if (activeStep === 0) {
            // Step 1: Contact Details (Mobile, Email, OTP)
            // Note: GSTIN moved/removed from this step as per new design
            if (formik.values.email && formik.values.otp && formik.values.mobile) {
                isValid = true;
            }
        } else if (activeStep === 1) {
            // Step 2: Pickup Address
            const { name, mobile, pincode, address, city, state, locality } = formik.values.pickUpAddress;
            if (name && mobile && pincode && address && city && state && locality) {
                isValid = true;
            }
        } else if (activeStep === 2) {
            // Step 3: Bank Details
            const { accountNumber, ifscCode, accountHolderName } = formik.values.bankDetails;
            if (accountNumber && ifscCode && accountHolderName) {
                isValid = true;
            }
        } else if (activeStep === 3) {
            // Step 4: Business Info
            if (formik.values.sellerName && formik.values.bussinessDetails.bussinessName && formik.values.password) {
                isValid = true;
            }
        }

        if (isValid) {
            if (activeStep < steps.length - 1) {
                setActiveStep((prev) => prev + 1);
            } else {
                formik.handleSubmit();
            }
        } else {
            // Mark all fields in the current step as touched to show errors
            formik.setTouched({
                ...formik.touched,
                ...(activeStep === 0 && { email: true, otp: true, mobile: true }),
                ...(activeStep === 1 && { pickUpAddress: Object.keys(formik.values.pickUpAddress).reduce((acc, K) => ({ ...acc, [K]: true }), {}) }),
            })
            showToast("Please fill all required fields before proceeding.", "warning");
        }
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    return (
        // FIX: Removed 'h-full' and 'justify-between' to prevent overflow. 
        // Added 'flex flex-col' and 'min-h' to ensure it takes up space but doesn't force push content out.
        <div className='flex flex-col min-h-[450px]'>

            {/* 1. Custom Brown Stepper */}
            <div className='mb-8'>
                <Stepper activeStep={activeStep} alternativeLabel
                    sx={{
                        '& .MuiStepIcon-root.Mui-active': { color: '#632713' },
                        '& .MuiStepIcon-root.Mui-completed': { color: '#632713' },
                        '& .MuiStepLabel-label.Mui-active': { fontWeight: 'bold', color: '#632713' },
                        '& .MuiStepLabel-label': { color: '#8D5A46' }
                    }}
                >
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>

            {/* 2. Form Content Area */}
            {/* 'flex-1' will allow this area to grow/shrink as needed */}
            <div className='flex-1 py-2'>
                {activeStep === 0 && <BecomeSellerFormStep1 formik={formik} />}
                {activeStep === 1 && <BecomeSellerFormStep2 formik={formik} />}
                {activeStep === 2 && <BecomeSellerFormStep3 formik={formik} />}
                {activeStep === 3 && <BecomeSellerFormStep4 formik={formik} />}
            </div>

            {/* 3. Navigation Buttons */}
            {/* Added 'mt-auto' to push buttons to the bottom of the min-height area, but not further */}
            <div className='flex items-center justify-between pt-6 border-t border-[#FDE3CF] mt-auto pb-2'>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{
                        color: '#632713',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: '#FFF5E6' }
                    }}
                >
                    Back
                </Button>

                <Button
                    variant='contained'
                    onClick={handleNext}
                    sx={{
                        bgcolor: '#22C55E', // Green to match design
                        px: 4,
                        py: 1,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#16A34A' }
                    }}
                >
                    {activeStep === steps.length - 1 ? "Submit Application" : "Next Step"}
                </Button>
            </div>
        </div>
    )
}


export default SellerAccountForm;
