"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import Resizer from "react-image-file-resizer";
import { IoMdClose } from "react-icons/io";

const waiterValidationSchema = Yup.object().shape({
  image: Yup.mixed().required("Image is required"),
  name: Yup.string().required("Name is required"),
  age: Yup.number()
    .required("Age is required")
    .positive("Age must be a positive number")
    .integer("Age must be an integer"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phoneno: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  gender: Yup.string().required("Gender is required"),
  profession: Yup.string().required("Profession is required"),
});

const AddWaiterModalForm = ({ onClose, restaurantid, currentWaiter }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      image: "",
      name: "",
      age: "",
      email: "",
      phoneno: "",
      gender: "Male",
      profession: "Waiter",
    },
    validationSchema: waiterValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const res = await axios.post("/api/addwaiter", {
          formData: values,
          id: restaurantid,
          waiterId: currentWaiter?._id,
        });
        if (res.data.success) {
          toast.success(`Staff ${currentWaiter ? "updated" : "added"} successfully`);
          setTimeout(() => {
            resetForm();
            onClose();
          }, 1000);
          //console.log(restaurantid)
        }
      } catch (e) {
        toast.error(`Error ${currentWaiter ? "updating" : "adding"} staff`);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (currentWaiter) {
      formik.setValues({
        image: currentWaiter.image || "",
        name: currentWaiter.username || "",
        age: currentWaiter.age || "",
        email: currentWaiter.email || "",
        phoneno: currentWaiter.phoneNo || "",
        gender: currentWaiter.gender || "Male",
        profession: currentWaiter.profession || "Waiter",
      });
    }
  }, [currentWaiter]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          formik.setFieldValue("image", uri);
        },
        "base64"
      );
    }
  };

  return (
    <div className="fixed z-50 h-screen w-screen top-0 left-0 flex justify-center items-center bg-black/20 backdrop-blur-sm">
      <div className="bg-gray-100 p-6 rounded-md shadow-md max-w-[50vw] mx-auto relative">
        <Toaster />
        <div className="relative bg-[#ffffff] p-4">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 border-[1px] rounded-full border-orange-700 p-1 hover:bg-[#440129] hover:text-gray-200"
          >
            <IoMdClose />
          </button>

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-[#440129] font-semibold mb-2">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-[#440129]"
                disabled={loading}
              />
              {formik.values.image && (
                <img
                  src={formik.values.image}
                  alt="Selected"
                  className="mt-2 w-32 h-32 object-cover object-center rounded-md"
                />
              )}
              {formik.errors.image && formik.touched.image && (
                <p className="form-error p-[2px] text-[0.65rem] text-rose-500">
                  {formik.errors.image}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="mb-4">
                <label className="block text-[#440129] font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="p-2 rounded-md border-2 w-full text-[#440129] focus:border-[#440129]"
                  disabled={loading}
                />
                {formik.errors.name && formik.touched.name && (
                  <p className="form-error p-[2px] text-[0.65rem] text-rose-500">
                    {formik.errors.name}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-[#440129] font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneno"
                  value={formik.values.phoneno}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="p-2 rounded-md border-2 w-full text-[#440129] focus:border-[#440129]"
                  disabled={loading}
                />
                {formik.errors.phoneno && formik.touched.phoneno && (
                  <p className="form-error p-[2px] text-[0.65rem] text-rose-500">
                    {formik.errors.phoneno}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-[#440129] font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="p-2 rounded-md border-2 w-full text-[#440129] focus:border-[#440129]"
                  disabled={loading}
                />
                {formik.errors.email && formik.touched.email && (
                  <p className="form-error p-[2px] text-[0.65rem] text-rose-500">
                    {formik.errors.email}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-[#440129] font-semibold mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="p-2 py-[9px] rounded-md border-2 w-full text-[#440129] focus:border-[#440129]"
                  disabled={loading}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {formik.errors.gender && formik.touched.gender && (
                  <p className="form-error p-[2px] text-[0.65rem] text-rose-500">
                    {formik.errors.gender}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-[#440129] font-semibold mb-2">
                  Age
                </label>
                <input
                  type="text"
                  name="age"
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="p-2 rounded-md border-2 w-full text-[#440129] focus:border-[#440129]"
                  disabled={loading}
                />
                {formik.errors.age && formik.touched.age && (
                  <p className="form-error p-[2px] text-[0.65rem] text-rose-500">
                    {formik.errors.age}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-[#440129] font-semibold mb-2">
                  Profession
                </label>
                <select
                  name="profession"
                  value={formik.values.profession}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="p-2 py-[9px] rounded-md border-2 w-full text-[#440129] focus:border-[#440129]"
                  disabled={loading}
                >
                  <option value="Waiter">Waiter</option>
                  <option value="Chef">Chef</option>
                </select>
                {formik.errors.profession && formik.touched.profession && (
                  <p className="form-error p-[2px] text-[0.65rem] text-rose-500">
                    {formik.errors.profession}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => formik.resetForm()}
                className="bg-amber-500 text-white py-2 px-4 rounded-md mr-2"
                disabled={loading}
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-orange-500 text-white py-2 px-4 rounded-md flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWaiterModalForm;
