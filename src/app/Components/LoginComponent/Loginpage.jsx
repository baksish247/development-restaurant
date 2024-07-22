"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import icontop from "../../assets/images/logo.svg";
import logo from "../../assets/images/baksish1.png";
import { useFormik } from "formik";
import { loginSchema } from "./utils/validator";
import { Login } from "./utils/loginhelpers";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/Context/AuthContext";

function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/Dashboard");
    }
  }, [loading, user, router]);

  const initialValues = {
    email: "",
    password: "",
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: async (values, action) => {
        setIsSubmitting(true);
        toast.loading("Logging in...");
        const success = await Login(values);
        toast.dismiss(); // Remove the loading toast
        if (success) {
          toast.success("Logged in successfully");
          window.location = '/Dashboard';
        } else {
          toast.error("Login failed");
        }
        setIsSubmitting(false);
        action.resetForm();
      },
    });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null;
  }

  return (
    <div>
      <Toaster />
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <div className="flex relative justify-center">
            <Image
              src={icontop}
              className="mix-blend-difference"
              height={100}
              width={150}
              alt="icon-difference"
              priority
            />
            <Image
              src={logo}
              alt="logoicon"
              className="mix-blend-multiply absolute top-[3.8rem] h-6 w-20"
              priority
              height={1000}
              width={1000}
            />
          </div>
          <h1 className="text-2xl font-semibold text-center text-gray-500 mb-6">
            Welcome Back!
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm text-gray-600"
              >
                Phone No / Email
              </label>
              <input
                type="text"
                id="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                name="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required=""
              />
              {errors.email && touched.email && (
                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                name="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required=""
              />
              {errors.password && touched.password && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.password}
                </div>
              )}
              <a
                href="#"
                className="block underline text-right text-xs text-cyan-600 mt-2"
              >
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-32 bg-gradient-to-r from-fuchsia-950 bg-[#441029] text-white py-2 rounded-lg mx-auto block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 mt-4 mb-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-xs text-gray-600 text-center mt-10">
            © 2024 Baksish.in
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
