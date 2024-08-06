import React, { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function EditOrderModal({ onClose, closeafterupdate, order, restaurantinfo , fetchorder}) {
  //console.log(order);
  //console.log(restaurantinfo)
  const [updatedQty, setUpdatedQty] = useState({});
  const [deleteitems, setDeleteItems] = useState([]);

  const handleUpdateAdd = (id, initialQuantity) => {
    setUpdatedQty((prevState) => {
      const newQty =
        prevState[id] !== undefined
          ? prevState[id] + 1
          : parseInt(initialQuantity) + 1;
      return { ...prevState, [id]: newQty };
    });
  };

  const handleUpdateremove = (id, initialQuantity) => {
    setUpdatedQty((prevState) => {
      const currentQty =
        prevState[id] !== undefined ? prevState[id] : parseInt(initialQuantity);
      const newQty = currentQty > 0 ? currentQty - 1 : 0;
      return { ...prevState, [id]: newQty };
    });
  };

  const handleDeleteItem = (id) => {
    if (!deleteitems.includes(id)) {
      setDeleteItems([...deleteitems, id]);
    }
  };

  const handlesavechanges = () => {
    //console.log("abc");
    //console.log(updatedQty);
    //console.log(deleteitems)
  };

  const handleConfirmOrder = async () => {
    toast.loading("Confirming order");
    if (updatedQty) {
      await axios.post("/api/updatequantity", { updatedQty });
    }
    if (deleteitems.length > 0) {
      await axios.post("/api/deleteitems", { deleteitems });
    }
    const updateres = await axios.post("/api/updatetaxandquantity", {
      orderId: order.order_id,
      cgst: restaurantinfo.cgst,
      sgst: restaurantinfo.sgst,
    });
    if (updateres.data.success) {
      toast.dismiss();
      toast.success("Order updated successfully");
      fetchorder();
      setTimeout(() => {
        toast.dismiss();
        closeafterupdate();
      }, 500); 
    } else {
      toast.dismiss();
      toast.error("Failed to update order items");
    }
  };

  return (
    <div>
      <Toaster />
      <h2 className="text-lg text-center font-semibold py-1">Edit Order</h2>
      <hr className="mb-4 mt-1 border-[0.1px] border-black" />
      <div className="flex flex-col space-y-2">
        <div className="flex justify-start space-x-2">
          <span className="font-semibold">Table Number:</span>
          <span>{order.table_number}</span>
        </div>
        <div className="flex justify-start items-center space-x-2 ">
          <span className="font-semibold text-sm">Order ID:</span>
          <span className="text-[0.7rem]">{order.order_id}</span>
        </div>
      </div>
      <div className="flex mt-3 justify-start ">
        <span className="font-semibold">Status:</span>
        <span>
          <div className="text-black py-0 px-2">
            {order.order_status === "new"
              ? "New Order"
              : order.order_status === "waitingforbill"
              ? "Waiting for bill"
              : order.order_status === "updated"
              ? "Updated Order"
              : order.order_status === "served"
              ? "Served"
              : order.order_status === "billgenerated"
              ? "Bill Generated"
              : "No status"}
          </div>
        </span>
      </div>
      <hr className="border-[1px] border-dotted border-black my-4" />
      <div className="font-semibold mb-4">Order Items:</div>
      <div className="flex flex-col">
        {order.order_items.map((orderitems, j) => (
          <span key={j}>
            {orderitems.items.map((item, k) => (
              <div
                key={k}
                className={`flex justify-between mb-3 ${
                  deleteitems.includes(item._id) ? "line-through" : ""
                }`}
              >
                <span className="capitalize">{item.food.name}</span>
                <span>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex rounded-md border-2 border-black shadow-inner justify-center text-center w-24 h-8 items-center">
                      <span
                        onClick={() =>
                          handleUpdateremove(item._id, item.quantity)
                        }
                        className="cursor-pointer h-full flex items-center justify-center w-1/3 border-r-2 border-black text-black"
                      >
                        <IoMdRemove />
                      </span>
                      <span className="text-base h-full pt-1 text-center w-1/3 text-black">
                        {updatedQty[item._id] ?? item.quantity}
                      </span>
                      <span
                        onClick={() => handleUpdateAdd(item._id, item.quantity)}
                        className="cursor-pointer w-1/3 h-full flex items-center justify-center  border-l-2 border-black text-black"
                      >
                        <IoMdAdd />
                      </span>
                    </div>
                    <span className="cursor-pointer text-2xl hover:text-rose-600">
                      <MdDeleteForever
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to delete ${item.food.name}?`
                            )
                          ) {
                            handleDeleteItem(item._id);
                          }
                        }}
                      />
                    </span>
                  </div>
                </span>
              </div>
            ))}
          </span>
        ))}
      </div>
      <div className="flex justify-end mt-4 space-x-4">
        <button
          onClick={handleConfirmOrder}
          className="px-4 py-2 border-2 rounded-lg hover:bg-orange-500 hover:scale-95 bg-amber-500 text-white"
        >
          Save Changes
        </button>
        <button
          className="px-8 py-2 border-2 rounded-lg hover:bg-orange-500 hover:scale-95 bg-amber-500 text-white"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditOrderModal;
