import React, { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

function ViewOrderDetailsModal({ onClose, order}) {
  const date = new Date(order.createdAt);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");



  return (
    <div className="fixed left-0 z-50 backdrop-blur-sm bg-black/20 flex items-center justify-center top-0 w-screen h-screen">
      <Toaster />
      <div className="w-[90%]">
        <div className="relative  bg-[#f9f9f9] max-h-[80%] overflow-y-auto w-[80%] md:w-[50%] lg:w-[32%] mx-auto  p-5 rounded-lg">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 border-[1px] rounded-full border-indigo-600 p-1 hover:bg-indigo-600 hover:text-gray-200"
          >
            <IoMdClose />
          </button>
    
      
      
      {/* <div className="flex justify-end mt-4 space-x-4">
        <button
          onClick={handleConfirmOrder}
          className="px-4 py-2 border-2 rounded-lg hover:bg-orange-400 hover:scale-95 bg-amber-500 text-white"
        >
          Save Changes
        </button>
        <button
          className="px-8 py-2 border-2 rounded-lg hover:bg-orange-400 hover:scale-95 bg-amber-500 text-white"
          onClick={onClose}
        >
          Cancel
        </button>
      </div> */}
      <div className="bg-white p-2  mt-6 shadow-md border-2 border-gray-300">
              <div className="my-4 flex items-center justify-center text-center">
                <span className="w-1/4 h-[1px] border-[1px] border-dashed border-black"></span>
                <span>&nbsp;TAX INVOICE&nbsp;</span>
                <span className="w-1/4 h-[1px] border-[1px] border-dashed border-black"></span>
              </div>

              <table className="w-full mb-4">
                <tbody>
                  <tr>
                    <td className="text-sm">Bill No.: {order?.bill_no}</td>
                    <td className="text-sm text-right">
                      Date: {day}/{month}/{year}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm">
                      Table No: {order.table_number}
                    </td>
                    <td className="text-sm text-right">
                      Time: {hours}:{minutes}:{seconds}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="w-full border-t-2 border-b-2 border-dotted border-gray-400 mb-4">
                <thead>
                  <tr>
                    <th className="text-sm w-1/2 text-left border-b-2 pb-1 border-dotted border-gray-400">
                      Description
                    </th>
                    <th className="text-sm w-1/6 text-right border-b-2 pb-1 border-dotted border-gray-400">
                      Qty.
                    </th>
                    <th className="text-sm w-1/6 text-right border-b-2 pb-1 border-dotted border-gray-400">
                      Price
                    </th>
                    <th className="text-sm w-1/6 text-right border-b-2 pb-1 border-dotted border-gray-400">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items.map((orderitems, j) => (
                    <React.Fragment key={j}>
                      {orderitems.items.map((item, k) => (
                        <tr key={k}>
                          <td className="text-sm text-left">
                            {item.food.name.toUpperCase()}
                          </td>
                          <td className="text-sm text-right">
                            {parseFloat(item.quantity).toFixed(2)}
                          </td>
                          <td className="text-sm text-right">
                            {parseFloat(item.food.price).toFixed(2)}
                          </td>
                          <td className="text-sm text-right">
                            {(
                              parseFloat(item.quantity) *
                              parseFloat(item.food.price)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              <table className="w-full mb-4">
                <tbody>
                  <tr>
                    <td className="text-sm">SUB TOTAL:</td>
                    <td className="text-sm text-right">
                      {parseFloat(order.initial_bill).toFixed(2)}
                    </td>
                  </tr>
                  {parseFloat(order?.discountamount) > 0.0 && (
                    <React.Fragment>
                      <tr>
                        <td className="text-sm">
                          DISCOUNT @ ({order.discountpercent}%)
                        </td>
                        <td className="text-sm text-right">
                          {parseFloat(order?.discountamount).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-sm">NET AMOUNT</td>
                        <td className="text-sm text-right">
                          {(
                            parseFloat(order.initial_bill) -
                            parseFloat(order?.discountamount)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </React.Fragment>
                  )}
                  <tr>
                    <td className="text-sm">CGST </td>
                    <td className="text-sm text-right">
                      {order?.cgstamount}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm">SGST </td>
                    <td className="text-sm text-right">
                      {order?.sgstamount}
                    </td>
                  </tr>
                  <tr className="border-t-2  py-2 border-gray-300 border-dashed">
                    <td className="text-sm font-bold">GRAND TOTAL</td>
                    <td className="text-sm font-bold text-right">
                      ₹ {order?.total_bill}
                    </td>
                  </tr>
                  
                </tbody>
              </table>
              <table className="w-full mb-4">
                <tbody>
                  <tr>
                    <td className="text-sm">Payment method :&nbsp;&nbsp; {order?.payment_method.paymentType}</td>
                  </tr>
                  {order.customer_name?.length>0 &&<tr>
                    <td className="text-sm">
                      Customer name: {order.customer_name}
                    </td>
                  </tr>}
                  {order.customer_phone?.length>0 &&<tr>
                    <td className="text-sm">
                      Customer Phone: {order.customer_phone}
                    </td>
                  </tr>}
                </tbody>
              </table>

              
            </div>
    </div>
    </div>
    </div>
  );
}

export default ViewOrderDetailsModal;
