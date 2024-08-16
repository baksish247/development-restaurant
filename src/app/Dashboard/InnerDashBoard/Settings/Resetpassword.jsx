"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "@/app/Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

function ResetPassword() {
  const {user}=useAuth();
  console.log(user);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation schema with Yup
  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old Password is required."),
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

  const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    setIsLoading(true);
    setSuccessMessage("");
    try {
      const response = await axios.post("/api/resetpassword", {
        name:user.name,
        resid:user.restaurantid,
        password: values.oldPassword,
        newpassword: values.newPassword,
      });

      if (response.data.success) {
        toast.success("Password has been successfully reset.");
        resetForm();
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred while resetting your password." );
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Toaster/>
      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <h2 className="text-2xl font-bold mb-10 text-center">Reset Password</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Old Password
              </label>
              <Field
                type="password"
                name="oldPassword"
                className="mt-1 block w-full p-2 border rounded-md"
              />
              <ErrorMessage
                name="oldPassword"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <Field
                type="password"
                name="newPassword"
                className="mt-1 block w-full p-2 border rounded-md"
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <Field
                type="password"
                name="confirmPassword"
                className="mt-1 block w-full p-2 border rounded-md"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {successMessage && (
              <p className="text-green-500 text-sm">{successMessage}</p>
            )}

            <button
              type="submit"
              className={`w-full bg-indigo-600 text-white p-2 rounded-md ${
                isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading
                ? "Resetting Password..."
                : "Reset Password"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ResetPassword;
