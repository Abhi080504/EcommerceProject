import { Button, Step, StepLabel, Stepper } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import BecomeSellerFormStep1 from "./BecomeSellerFormStep1";
import BecomeSellerFormStep2 from "./BecomeSellerFormStep2";
import BecomeSellerFormStep3 from "./BecomeSellerFormStep3";
import BecomeSellerFormStep4 from "./BecomeSellerFormStep4";
import { createSeller } from "../../../State/Auth/sellerRegisterApi";

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
      mobile: "",
      otp: "",
      isOtpVerified: false, // ✅ REQUIRED
      pickupAddress: {
        name: "",
        mobile: "",
        pincode: "",
        address: "",
        city: "",
        state: "",
      },
      bankDetails: {
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
      },
      sellerName: "",
      email: "",
      password: "",
      businessDetails: {
        businessName: "",
      },
    },
    onSubmit: async (values) => {
      try {
        await createSeller(values);
        alert("Seller registered successfully 🎉");
      } catch (err) {
        alert("Registration failed");
      }
    },
  });

  // ✅ CORRECT handleNext (INSIDE component)
  const handleNext = () => {
    if (activeStep === 0 && !formik.values.isOtpVerified) {
      alert("Please verify OTP first");
      return;
    }

    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      formik.handleSubmit();
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <div className="flex flex-col min-h-[450px]">
      {/* STEPPER */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* FORM STEPS */}
      <div className="flex-1 py-4">
        {activeStep === 0 && (
          <BecomeSellerFormStep1
            formik={formik}
            onOtpVerified={() =>
              formik.setFieldValue("isOtpVerified", true)
            }
          />
        )}
        {activeStep === 1 && <BecomeSellerFormStep2 formik={formik} />}
        {activeStep === 2 && <BecomeSellerFormStep3 formik={formik} />}
        {activeStep === 3 && <BecomeSellerFormStep4 formik={formik} />}
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="flex justify-between pt-4">
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          {activeStep === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default SellerAccountForm;
