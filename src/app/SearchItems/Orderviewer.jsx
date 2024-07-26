"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import goldbg from "../assets/images/gbg.png";
import {FaArrowRight as EastIcon} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { hydrate, clearCart } from "../redux/CartSlice";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

function Orderviewer({ id, order, restaurant_id, cgst, sgst, nooftables }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [table_number, settable_number] = useState("");

  const handleplaceorder = async () => {
    const nettax = (0.01 * (cart.totalPrice * (parseFloat(cgst) + parseFloat(sgst)))).toFixed(2);
    
    try {
      if (id === "neworder") {
        const customerId = "CUS_" + uuidv4().toString();
        const orderId = "ORD_" + uuidv4().toString();
        const orderDetails = {
          customer_id: customerId,
          order_id: orderId,
          restaurant_id: restaurant_id,
          table_number: table_number,
          order_items: [
            {
              items: cart.items,
              notes: notes,
              item_total: cart.totalPrice.toFixed(2),
              charges: nettax,
              total_price: (parseFloat(cart.totalPrice) + parseFloat(nettax)).toFixed(2),
              status: "Confirmed",
            },
          ],
          total_quantity: cart.totalQuantity,
          initial_bill: cart.totalPrice.toFixed(2),
          tax: nettax,
          total_bill: (parseFloat(cart.totalPrice) + parseFloat(nettax)).toFixed(2),
        };

        const res = await axios.post("api/createnewcustomerorder", orderDetails);
        if (res.data.success) {
          toast.success("Order placed successfully");
          setTimeout(() => {
            dispatch(clearCart());
            router.push(`/OrderDetails?order=${orderId}&id=${restaurant_id}`);
          }, 2000);
        } else {
          throw new Error(res.data.error || "Failed to place the order");
        }
      } else {
        const orderDetails = {
          order_id: order,
          new_order_items: {
            items: cart.items,
            notes: notes,
            item_total: cart.totalPrice.toFixed(2),
            charges: nettax,
            total_price: (parseFloat(cart.totalPrice) + parseFloat(nettax)).toFixed(2),
            status: "Confirmed",
          },
          cgst: cgst,
          sgst: sgst,
          new_total_quantity: cart.totalQuantity,
          new_initial_bill: cart.totalPrice.toFixed(2),
        };

        const res = await axios.post("api/updateexistingorder", orderDetails);
        if (res.data.success) {
          toast.success("Order updated successfully");
          setTimeout(() => {
            dispatch(clearCart());
            router.push(`/OrderDetails?order=${order}&id=${restaurant_id}`);
          }, 2000);
        } else {
          throw new Error(res.data.error || "Failed to update the order");
        }
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  const cart = useSelector((state) => state?.cart);

  const [isHydrated, setIsHydrated] = useState(false);
  const [popupopened, setpopupopened] = useState(false);
  const [notes, setnotes] = useState("");

  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem("cartItems")) || [];
      const totalQuantity = JSON.parse(localStorage.getItem("totalQuantity")) || 0;
      const totalPrice = JSON.parse(localStorage.getItem("totalPrice")) || 0;

      if (items.length > 0 || totalQuantity > 0 || totalPrice > 0) {
        dispatch(hydrate({ items, totalQuantity, totalPrice }));
      }
      setIsHydrated(true);
    } catch (error) {
      toast.error("Failed to load cart data");
    }
  }, [dispatch]);

  if (!isHydrated || cart.totalQuantity === 0) {
    return null;
  }

  return (
    <section>
      <Toaster />
      <main className="fixed bottom-[8px] w-full border-t-2 border-[#6C0345] z-50">
        <div className="flex justify-between lg:px-10 px-4 relative items-center h-16 p-2">
          <Image
            src={goldbg}
            priority
            alt="bg"
            width={10000}
            className="-z-10 absolute top-0 left-0"
            height={1000}
          />
          <h2 className="text-[#6C0345] font-bold text-xl mt-2">
            {cart?.totalQuantity} item added <EastIcon />
          </h2>
          <button
            onClick={() => {
              setpopupopened(!popupopened);
            }}
            className="px-6 py-2 mt-2 bg-white border-2 rounded-md text-[#6C0345] border-[#6C0345]"
          >
            Confirm
          </button>
        </div>
        {popupopened && (
          <div className="relative">
            <>
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm z-10"></div>
              <div className="fixed inset-0 flex items-center justify-center z-20">
                <div className="relative bg-[#FFF9EB] p-6 pb-10 rounded-lg shadow-lg">
                  <button
                    onClick={() => setpopupopened(!popupopened)}
                    className="absolute top-2 right-2 text-[#4E0433] hover:scale-95 rounded-xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <h2 className="text-xl font-bold mb-6 text-center text-[#441029]">
                    CONFIRM ORDER
                  </h2>
                  <div className="pb-10">
                    <ul className="list-disc list-inside">
                      {cart?.items?.map((item, i) => (
                        <div key={i}>
                          <li className="text-gray-900 flex justify-between border-b border-dotted border-gray-400 py-1">
                            <span>{item?.name}</span>
                            <span>x {item?.quantity}</span>
                          </li>
                        </div>
                      ))}
                    </ul>
                    <section className="mt-6 mx-4">
                      <h2 className="pl-1 text-sm font-normal mb-[4px]">
                        Add notes for the Chef:
                      </h2>
                      <div className="h-fit min-h-10 bg-white">
                        <textarea
                          id="message"
                          rows="2"
                          value={notes}
                          onChange={(e) => setnotes(e.target.value)}
                          className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border-2 border-[#661268]"
                          placeholder="Write your thoughts here..."
                        ></textarea>
                      </div>
                    </section>
                    <div className="mx-auto text-center mt-2">
                      Total item quantity: {cart?.totalQuantity}
                    </div>
                  </div>
                  {id === "neworder" && (
                    <div className="flex items-center justify-center space-x-4 mb-8">
                      <div className="text-xl font-semibold">Table Number:</div>
                      <div>
                        <input
                          type="number"
                          value={table_number !== "" ? table_number : ''}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(nooftables, e.target.value));
                            settable_number(value);
                          }}
                          className="border-2 border-[#661268] rounded-lg px-4 py-2 w-28"
                          min="0"
                          max={nooftables}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex justify-center items-center">
                    <button
                      onClick={handleplaceorder}
                      disabled={id === "neworder" && table_number === ""}
                      className="px-4 py-2 disabled:bg-[#67515f] bg-[#4E0433] text-white rounded-md"
                    >
                      Place order
                    </button>
                  </div>
                  {id === "neworder" && table_number === "" && (
                    <p className="absolute left-[28%] text-center text-base text-red-900 py-1">
                      Enter table number *
                    </p>
                  )}
                </div>
              </div>
            </>
          </div>
        )}
      </main>
    </section>
  );
}

export default Orderviewer;
