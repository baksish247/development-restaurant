"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function ForgotPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState("request"); // 'request' or 'reset'

  useEffect(() => {
    if (token) {
      setFormType("reset");
    } else {
      setFormType("request");
    }
  }, [token]);

  // Validation schema for requesting password reset email
  const requestValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required."),
  });

  // Validation schema for resetting password
  const resetValidationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters.")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
      .matches(/\d/, "Password must contain at least one number.")
      .matches(
        /[@$!%*?&#]/,
        "Password must contain at least one special character."
      )
      .required("New Password is required."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match.")
      .required("Confirm New Password is required."),
  });

  const handleRequestSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/forgetpassword_generatelink", {
        email: values.email,
      });

      if (response.data.success) {
        toast.success("Password reset email has been sent.");
        resetForm();
      } else {
        toast.error(response.data.error || "Failed to send reset email.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleResetSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/forgetpassword_verifylink", {
        token: token,
        password: values.newPassword,
      });

      if (response.data.success) {
        toast.success("Password has been successfully reset.");
        resetForm();
        router.push("/"); 
      } else {
        toast.error(response.data.error || "Failed to reset password.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-40 p-6 bg-white shadow-md rounded-md">
      <Toaster />
      <h2 className="text-2xl font-bold mb-6 text-center">
        {formType === "request" ? "Forgot Password" : "Reset Password"}
      </h2>
      <Formik
        initialValues={
          formType === "request"
            ? { email: "" }
            : { newPassword: "", confirmPassword: "" }
        }
        validationSchema={
          formType === "request"
            ? requestValidationSchema
            : resetValidationSchema
        }
        onSubmit={
          formType === "request" ? handleRequestSubmit : handleResetSubmit
        }
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {formType === "request" && (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            )}

            {formType === "reset" && (
              <>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <Field
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter new password"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Confirm new password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className={`w-full bg-indigo-600 text-white py-2 rounded-md transition duration-200 ${
                isSubmitting || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700"
              }`}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading
                ? formType === "request"
                  ? "Sending Email..."
                  : "Resetting Password..."
                : formType === "request"
                ? "Send Reset Email"
                : "Reset Password"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ForgotPassword;
