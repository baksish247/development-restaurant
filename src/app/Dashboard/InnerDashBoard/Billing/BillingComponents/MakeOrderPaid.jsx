import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

function MakeOrderPaid({ order, onClose, fetchorder, restaurantinfo }) {
  const [paymentType, setPaymentType] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [onlineAmount, setOnlineAmount] = useState("");
  console.log(order);
  const handleConfirmPayment = async () => {
    if (!paymentType) {
      toast.error("Please select a payment type");
      return;
    }
    if (paymentType === "hybrid" && (!cashAmount || !onlineAmount)) {
      toast.error("Please fill in both cash and online amounts");
      return;
    }
    toast.loading("Processing payment...");
    try {
      const response = await axios.post("/api/makeorderpaid", {
        order_id: order.order_id,
        paymentType,
        cashAmount: paymentType === "hybrid" ? cashAmount : null,
        onlineAmount: paymentType === "hybrid" ? onlineAmount : null,
      });
      console.log(response);
      if (response.data.success) {
        const res = await axios.post("/api/updateinventoryafterpaid", {
          order_id: order.order_id,
        });
        if (res.data.success) {
          toast.dismiss();
          toast.success("Mark paid and Inventory updated successfully");
          fetchorder(restaurantinfo.restaurantid);
          setTimeout(() => {
            toast.dismiss();
            onClose();
          }, 1000);
        } else {
          toast.dismiss();
          toast("Payment processed successfully. Failed to update inventory");
          fetchorder(restaurantinfo.restaurantid);
          setTimeout(() => {
            toast.dismiss();
            onClose();
          }, 1000);
        }
      } else if (response.data.error == "Not Found") {
        toast.dismiss();
        toast.error("Please generate bill first , then update payment method");
      } else {
        toast.dismiss();
        toast.error("Payment processing failed");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to process payment");
    }
  };

  return (
    <div className="fixed left-0 z-50 backdrop-blur-sm bg-black/20 flex items-center justify-center top-0 w-screen h-screen">
      <div className="w-[90%]">
        <div className="relative bg-[#f9f9f9] max-h-[80%] overflow-y-auto w-[80%] md:w-[50%] lg:w-[32%] mx-auto p-5 rounded-lg">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 border-[1px] rounded-full border-[#440129] p-1 hover:bg-[#440129] hover:text-gray-200"
          >
            <IoMdClose />
          </button>
          <div>
            <Toaster />
            <h2 className="text-lg text-center font-semibold py-1">
              Make Payment
            </h2>
            <hr className="mb-4 mt-1 border-[0.1px] border-black" />
            <div className="flex flex-col space-y-8">
              <div className="flex flex-col">
                <label className="font-semibold mb-2">Payment Type:</label>
                <div className="flex flex-col space-y-2">
                  {["cash", "card", "UPI", "hybrid"].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={paymentType === type}
                        onChange={() => setPaymentType(type)}
                      />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              {paymentType === "hybrid" && (
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col">
                    <label className="font-semibold mb-2">Cash Amount:</label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      className="border-2 border-black rounded-md p-2"
                      placeholder="Enter cash amount"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold mb-2">Online Amount:</label>
                    <input
                      type="number"
                      value={onlineAmount}
                      onChange={(e) => setOnlineAmount(e.target.value)}
                      className="border-2 border-black rounded-md p-2"
                      placeholder="Enter online amount"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={handleConfirmPayment}
                className="px-4 py-2 border-2 rounded-lg hover:bg-[#7a1e4b] hover:scale-95 bg-[#441029] text-white"
              >
                Confirm Payment
              </button>
              <button
                className="px-4 py-2 border-2 rounded-lg hover:bg-[#7a1e4b] hover:scale-95 bg-[#441029] text-white"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MakeOrderPaid;
