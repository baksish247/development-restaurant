import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import FinalBill from "./FinalBillModal";
import { Toaster } from "react-hot-toast";
// import FinalBill from "./FinalBill";

const GenerateBillModal = ({
  onClose,
  selectedOrder,
  restaurantinfo,
}) => {
  //console.log(restaurantinfo);
  const [discountOption, setDiscountOption] = useState("no");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [finalBill, setFinalBill] = useState(null);
  const [finaltax, setfinaltax] = useState(null);
  const [discountdescription, setdiscountdescription] = useState("");
  const [openfinalBill, setopenfinalBill] = useState(false);

  const handleopenfinalbill = () => {
    setopenfinalBill(true);
  };
  const handleclosefinalbill = () => {
    setopenfinalBill(false);
    onClose();
  };

  const handleDiscountOptionChange = (event) => {
    setDiscountOption(event.target.value);
    if (event.target.value === "no") {
      setDiscountPercentage(0);
      setdiscountdescription("");
    }
  };

  const handleDiscountPercentageChange = (event) => {
    if(parseFloat(event.target.value) >=0 )
    {setDiscountPercentage(event.target.value);}
    else{
      setDiscountPercentage(0);
    }
  };
  const handleDiscountDescriptionChange = (event) => {
    setdiscountdescription(event.target.value);
  };
  const [discountamount, setdiscountamount] = useState("");
  const calculateFinalBill = () => {
    let total = selectedOrder.total_bill;
    let initial = selectedOrder.initial_bill;
    let sgstamount = 0,
      cgstamount = 0;
    if (discountOption === "yes" && discountPercentage > 0) {
      const discount = initial * discountPercentage * 0.01;
      initial -= discount;
      setdiscountamount(discount.toFixed(2));
      sgstamount = parseFloat(restaurantinfo.sgst) * initial * 0.01;
      cgstamount = parseFloat(restaurantinfo.cgst) * initial * 0.01;
      total = (initial + cgstamount + sgstamount).toFixed(2);
      //console.log(sgstamount, cgstamount);
      setfinaltax((cgstamount + sgstamount).toFixed(2));
    } else {
      setfinaltax(selectedOrder.tax);
    }
    setFinalBill(parseFloat(total).toFixed(2));
  };

  return (
    <div className="fixed left-0 z-50 backdrop-blur-sm bg-black/20 flex items-center justify-center top-0 w-screen h-screen">
      <Toaster />
      <div className="w-[90%]">
        <div className="relative  bg-[#f9f9f9] max-h-[80%] overflow-y-auto w-[80%] md:w-[50%] lg:w-[32%] mx-auto  p-5 rounded-lg">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 border-[1px] rounded-full border-amber-500 p-1 hover:bg-orange-500 hover:text-gray-200"
          >
            <IoMdClose />
          </button>
      <div className="max-h-[80vh] overflow-y-auto noscrollbar ">
        {!openfinalBill && <div><h2 className="text-lg text-center font-semibold py-1">
          Generate Final Bill
        </h2>
        <hr className="mb-3 border-[0.1px] border-black" />
        <div className="flex flex-col space-y-4">
          <div className="flex justify-start items-center space-x-1">
            <span className="font-semibold w-52">Apply Discount:</span>
            <select
              value={discountOption}
              onChange={handleDiscountOptionChange}
              className="w-full  p-2 border border-gray-300 rounded-md"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          {discountOption === "yes" && (
            <div>
              <div className="flex justify-start items-center space-x-1 mb-2">
                <span className="font-semibold w-52">Discount %:</span>
                <div className="w-full">
                  <input
                    type="number"
                    value={discountPercentage}
                    placeholder="10"
                    min="1"
                    onChange={handleDiscountPercentageChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-start items-center space-x-1">
                <span className="font-semibold w-52">
                  Discount Description:
                </span>
                <div className="w-full">
                  <textarea
                    value={discountdescription}
                    placeholder="Student offer"
                    onChange={handleDiscountDescriptionChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  ></textarea>
                </div>
              </div>
            </div>
          )}
          <div
            className="bg-orange-400 text-center py-2 text-white w-full h-10 rounded-xl hover:scale-y-90 duration-200 cursor-pointer hover:bg-amber-400"
            onClick={calculateFinalBill}
          >
            Apply
          </div>
          {finalBill !== null && finaltax !== null && (
            <>
              <div className="mt-4">
                <div className="flex items-center justify-center mb-2">
                  <MdOutlineKeyboardDoubleArrowDown />
                </div>

                {selectedOrder && (
                  <div>
                    <h2 className="text-lg text-center font-semibold py-1">
                      Order Details
                    </h2>
                    <hr className="mb-4 mt-1 border-[0.1px] border-black" />
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-start space-x-2">
                        <span className="font-semibold">Table Number:</span>
                        <span>{selectedOrder.table_number}</span>
                      </div>
                      <div className="flex justify-start space-x-2 ">
                        <span className="font-semibold text-sm">Order ID:</span>
                        <span className="text-sm">
                          {selectedOrder.order_id}
                        </span>
                      </div>
                    </div>

                    <hr className="border-[1px] border-dotted border-black my-4" />
                    <div className="flex flex-col">
                      <span className="font-semibold mb-1">Order Items:</span>

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
                      <span className="font-semibold">Amount:</span>
                      <span>₹ {selectedOrder.initial_bill}</span>
                    </div>
                    {discountPercentage != "0" && (
                      <div>
                        <div className="flex justify-between">
                          <span className="font-semibold">
                            Discount ({discountPercentage}%):
                          </span>
                          <span>₹ {discountamount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Payable Amount:</span>
                          <span>
                            ₹{" "}
                            {(
                              selectedOrder.initial_bill - discountamount
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        GST and Service Tax:
                      </span>
                      <span>₹ {finaltax}</span>
                    </div>

                    <div className="flex justify-between mt-2">
                      <span className="font-semibold">Total Amount:</span>
                      <span>₹ {finalBill}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-6 flex items-center justify-center">
                <div
                  className="bg-orange-400 h-10 text-center py-2 text-white duration-200 cursor-pointer px-16 rounded-xl w-full hover:scale-y-95 hover:bg-amber-400"
                  onClick={() => {
                    calculateFinalBill();
                    handleopenfinalbill();
                  }}
                >
                  Generate Bill
                </div>
              </div>
            </>
          )}
        </div></div>}
        {openfinalBill && (
          <>
            <h2 className="text-lg text-center font-semibold py-1">
              Final Bill
            </h2>
            <hr className="mb-3 border-[0.1px] border-black mx-auto w-20" />
            <FinalBill
                restaurantinfo={restaurantinfo}
                selectedOrder={selectedOrder}
                discountPercentage={discountPercentage}
                discountdescription={discountdescription}
              />
          </>
        )}
      </div>
    </div>
    </div>
    </div>
  );
};

export default GenerateBillModal;
