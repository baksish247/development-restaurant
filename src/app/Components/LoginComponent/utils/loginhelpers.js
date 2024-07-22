import axios from "axios";
import { toast } from "react-hot-toast";

export const Login = async (values) => {
  try {
    const { data } = await axios.post("/api/login", values);
    if (data.success) {
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("restaurantid", data.restaurantid);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("User not found");
      } else if (error.response.status === 401) {
        toast.error("Invalid password");
      } else {
        toast.error("Invalid credentials");
      }
    } else if (error.request) {
      toast.error("No response from server");
    } else {
      toast.error("An error occurred");
    }
    console.error(error);
    return false;
  }
};

export const Logout = () => {
  if (confirm('Are you sure you want to log out')) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("restaurantid");
    toast.success("Logged out successfully");
    window.location = '/';
  }
};
