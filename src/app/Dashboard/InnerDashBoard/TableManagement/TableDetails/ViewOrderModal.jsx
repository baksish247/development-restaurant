import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import EditOrderModal from "./EditOrderModal";
import GenerateBillModal from "./GenerateBillModal";
// import GenerateBillModal from "./GenerateBillModal";


function ViewOrder({ onClose, selectedOrder, restaurantinfo ,fetchorder}) {
  const [editorder, seteditorder] = useState(false);
  const [generatebillorder, setgeneratebillorder] = useState(false);
  console.log(restaurantinfo);

  // const handleOpenEditOrder = () => {
  //   seteditorder(true);
  // };

  const handleCloseEditOrder = () => {
    seteditorder(false);
  };

  // const handleOpenGenerateBillOrder = () => {
  //   setgeneratebillorder(true);
  // };

  const handleCloseGenerateBillOrder = () => {
    setgeneratebillorder(false);
  };

  return (
    <div className="fixed left-0 z-50 backdrop-blur-sm bg-black/20 flex items-center justify-center top-0 w-screen h-screen">
      <div className="w-[90%]">
        <div className="relative  bg-[#f9f9f9] max-h-[80%] overflow-y-auto w-[80%] md:w-[50%] lg:w-[32%] mx-auto  p-5 rounded-lg">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 border-[1px] rounded-full border-[#440129] p-1 hover:bg-[#440129] hover:text-gray-200"
          >
            <IoMdClose />
          </button>
          {!editorder && !generatebillorder && (
            <div>
              {selectedOrder && (
                <>
                  <h2 className="text-lg text-center font-semibold py-1">
                    Order Details
                  </h2>
                  <hr className="mb-4 mt-1 border-[0.1px] border-black" />
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-start space-x-2">
                      <span className="font-semibold">Table Number:</span>
                      <span>{selectedOrder.table_number}</span>
                    </div>
                    <div className="flex justify-start items-center space-x-2 ">
                      <span className="font-semibold text-sm">Order ID:</span>
                      <span className="text-[0.7rem]">
                        {selectedOrder.order_id}
                      </span>
                    </div>
                    {/* <div className="flex justify-between">
                  <span className="font-semibold">Customer ID:</span>
                  <span>{selectedOrder.customer_id}</span>
                </div> */}
                  </div>
                  {/* <hr className="border-[1px] border-dotted border-black my-4"/> */}
                  <div className="flex mt-3 justify-start">
                    <span className="font-semibold">Status:</span>
                    <span>
                      <div className="text-black py-0 px-2">
                        {selectedOrder.order_status === "new"
                          ? "New Order"
                          : selectedOrder.order_status === "waitingforbill"
                          ? "Waiting for bill"
                          : selectedOrder.order_status === "updated"
                          ? "Updated Order"
                          : selectedOrder.order_status === "served"
                          ? "Served"
                          : selectedOrder.order_status === "billgenerated"
                          ? "Bill Generated"
                          : "No status"}
                      </div>
                    </span>
                  </div>
                  <hr className="border-[1px] border-dotted border-black my-4" />
                  <div className="flex flex-col">
                    <span className="font-semibold mb-1">Order Items:</span>
                    {/* {selectedOrder.order_items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.food_name}</span>
                      <span>{item.quantity}</span>
                    </div>
                  ))} */}
                    {selectedOrder.order_items.map((orderitems, j) => (
                      <span key={j}>
                        {orderitems.items.map((item, k) => (
                          <div key={k} className="flex justify-between">
                            <span>
                              {item.food.name}&nbsp;&nbsp;x {item.quantity}
                            </span>
                            <span>
                              ₹
                              {parseFloat(item.quantity) *
                                parseFloat(item.food.price)}
                            </span>
                          </div>
                        ))}
                      </span>
                    ))}
                  </div>

                  <hr className="border-[1px] border-dashed border-black my-4" />
                  <div className="flex justify-between">
                    <span className="font-semibold">Amount :</span>
                    <span>₹ {selectedOrder.initial_bill}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">GST :</span>
                    <span>₹ {selectedOrder.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Amount :</span>
                    <span>₹ {selectedOrder.total_bill}</span>
                  </div>
                </>
              )}
              <div className="mt-6 flex items-center  justify-between">
                <div
                  className="h-10 w-[40%] flex items-center justify-center sm:text-sm lg:text-base bg-[#441029] hover:bg-[#7a1e4b] hover:scale-95 cursor-pointer text-white rounded-lg"
                  onClick={() => {
                    seteditorder(true);
                  }}
                >
                  Edit Order
                </div>
                <div
                  className="h-10 w-[40%] flex items-center justify-center sm:text-sm lg:text-base bg-[#441029] hover:bg-[#7a1e4b] hover:scale-95 cursor-pointer text-white rounded-lg"
                  onClick={() => {
                    setgeneratebillorder(true);
                  }}
                >
                  Generate Bill
                </div>
              </div>
            </div>
          )}
          {editorder && (
            <EditOrderModal
              onClose={handleCloseEditOrder}
              closeafterupdate={onClose}
              order={selectedOrder}
              restaurantinfo={restaurantinfo}
              fetchorder={fetchorder}
            />
          )}
          {generatebillorder && (
            <GenerateBillModal
              onClose={handleCloseGenerateBillOrder}
              closeaftergeneratebill={onClose}
              selectedOrder={selectedOrder}
              restaurantinfo={restaurantinfo}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewOrder;
