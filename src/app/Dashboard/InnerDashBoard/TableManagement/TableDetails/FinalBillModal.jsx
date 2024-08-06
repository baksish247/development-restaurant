"use client";

import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

function FinalBill({
  restaurantinfo,
  selectedOrder,
  discountPercentage,
  discountdescription,
}) {
  //console.log(restaurantinfo);
  //console.log(selectedOrder);
  const [customerphone_no, setcustomerphone_no] = useState("")
  const date = new Date(selectedOrder.createdAt);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  ///console.log(restaurantinfo);
  const hasFetchedBill = useRef(false);
  const [orderbill, setorderbill] = useState();
  const [qrcode, setqrcode] = useState("");
  const fetchtipqr = async () => {
    const res = await axios.post("/api/getqrcodefortip", {
      url: `${process.env.NEXT_PUBLIC_QR_URL}/id=${restaurantinfo.restaurantid}`,
    });
    //console.log(res.data);
    setqrcode(res.data.qrCodeDataURL);
  };

  const fetchgeneratedbill = async (
    order_id,
    cgst,
    sgst,
    discountamount,
    discountpercent,
    discountdescription,
    total_amount
  ) => {
    try {
      const res = await axios.post("/api/generatebill", {
        order_id,
        cgst,
        sgst,
        discountamount,
        discountpercent,
        discountdescription,
        total_amount,
      });
     // console.log(res);
      setorderbill(res.data.data);
      //console.log(res.data.data);
      toast.success("Mark the order as paid once the customer has paid.");
    } catch (e) {
      toast.error("Failed to generate bill");
    }
  };

  useEffect(() => {
    if (hasFetchedBill.current) return;
    fetchtipqr();
    let initial = selectedOrder.initial_bill;
    let discountamount = (
      parseFloat(discountPercentage) *
      parseFloat(initial) *
      0.01
    ).toFixed(2);
    let final = initial - discountamount;
    const cgst = (
      0.01 *
      (parseFloat(restaurantinfo.cgst) * parseFloat(final))
    ).toFixed(2);
    const sgst = (
      0.01 *
      (parseFloat(restaurantinfo.sgst) * parseFloat(final))
    ).toFixed(2);
    let total_amount = (
      parseFloat(final) +
      parseFloat(cgst) +
      parseFloat(sgst)
    ).toFixed(2);
    fetchgeneratedbill(
      selectedOrder.order_id,
      cgst,
      sgst,
      discountamount,
      discountPercentage,
      discountdescription,
      total_amount
    );
    hasFetchedBill.current = true;
  }, []);

  const sendbilltophone=()=>{
    toast.success("Bill sent to phone")
  }
  // const handleDownload = async () => {
  //   const invoice = document.getElementById("invoice");
  //   const canvas = await html2canvas(invoice, {
  //     scale: 2, // Increase the scale for better resolution
  //     useCORS: true,
  //     windowWidth: invoice.scrollWidth,
  //     windowHeight: invoice.scrollHeight,
  //   });

  //   const imgData = canvas.toDataURL("image/jpeg", 0.7); // Reduce quality to 70%
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = pdf.internal.pageSize.getHeight();
  //   const imgProps = pdf.getImageProperties(imgData);
  //   const imgWidth = imgProps.width;
  //   const imgHeight = imgProps.height;

  //   const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

  //   const width = imgWidth * ratio;
  //   const height = imgHeight * ratio;

  //   pdf.addImage(imgData, "JPEG", 0, 0, width, height);
  //   pdf.save(`invoice-${selectedOrder.order_id}.pdf`);
  // };
  // const handlePrint = () => {
  //   const invoice = document.getElementById("invoice").outerHTML;
  //   const iframe = document.createElement("iframe");
  //   iframe.style.position = "absolute";
  //   iframe.style.width = "0px";
  //   iframe.style.height = "0px";
  //   iframe.style.border = "none";
  //   document.body.appendChild(iframe);

  //   const doc = iframe.contentWindow.document;
  //   doc.open();
  //   doc.write("<html><head><title>Invoice</title>");
  //   doc.write(
  //     "<style>@page { size: auto; margin: 10mm; } body { font-family: Arial, sans-serif; }</style>"
  //   );
  //   doc.write("</head><body>");
  //   doc.write(invoice);
  //   doc.write("</body></html>");
  //   doc.close();

  //   iframe.contentWindow.focus();
  //   iframe.contentWindow.print();

  //   setTimeout(() => {
  //     document.body.removeChild(iframe);
  //   }, 1000);
  // };

  if (!orderbill)
    return (
      <div className="flex items-center justify-center">
        <Toaster />
        <div className="flex items-center justify-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
      </div>
    );
    if(orderbill) {
      //console.log(orderbill)
    }
  return (
    <>
      {orderbill && (
        <div className="mx-4">
          <div
            id="invoice"
            className=" bg-white -mx-3 py-8 mt-10 p-4 shadow-md border-2 border-gray-300"
          >
            <Toaster />
            <h6 className="font-bold text-center mb-4 text-xl">
              {restaurantinfo.restaurantname.toUpperCase()}
            </h6>
            <p className="text-center mb-4">
              {restaurantinfo.restaurantaddress.toUpperCase()}
              <br />
              PHONE NO. : {restaurantinfo.restaurantphoneNo}
            </p>
            <div className="my-4 flex items-center justify-center text-center">
              <span className="w-1/4 h-[1px] border-[1px] border-dashed border-black"></span>
              <span>&nbsp;TAX INVOICE&nbsp;</span>
              <span className="w-1/4 h-[1px] border-[1px] border-dashed border-black"></span>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">
                Bill No.: {orderbill?.bill_no}
              </p>
              <p className="text-sm">
                Date: {day}/{month}/{year}
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">
                Table No: {selectedOrder.table_number}
              </p>
              <p className="text-sm">
                Time: {hours}:{minutes}:{seconds}
              </p>
            </div>
            <div className="border-t-2 mt-4 border-b-2 py-2 mb-4 border-dotted border-gray-400">
              <div className="flex justify-start mb-2 space-x-4 border-b-2 pb-1 border-dotted border-gray-400">
                <p className="text-sm w-[50%]">
                  Description
                </p>
                <p className="text-sm w-[15%] pl-[0.1rem]">
                  Qty.
                </p>
                <p className="text-sm w-[15%] pl-[0.2rem]">
                  Price
                </p>
                <p className="text-sm w-[15%] pl-[0.3rem]">
                  Value
                </p>
              </div>

              {/* Repeat for each item */}
              {selectedOrder.order_items.map((orderitems, j) => (
                <span key={j}>
                  {orderitems.items.map((item, k) => (
                    <div key={k} className="flex justify-start mt-1 space-x-4">
                      <p className="text-sm w-[50%]">
                        {item.food.name.toUpperCase()}
                      </p>
                      <p className="text-sm w-[15%]">
                        {parseFloat(item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm w-[15%]">
                        {parseFloat(item.food.price).toFixed(2)}
                      </p>
                      <p className="text-sm w-[15%]">
                        {(
                          parseFloat(item.quantity) *
                          parseFloat(item.food.price)
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </span>
              ))}
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">SUB TOTAL: </p>
              <p className="text-sm">
                {parseFloat(selectedOrder.initial_bill).toFixed(2)}
              </p>
            </div>
            {parseFloat(orderbill?.discountamount)>0.0 && <div><div className="flex justify-between mb-2">
              <p className="text-sm">
                DISCOUNT @ ({orderbill.discountpercent}%)
              </p>
              <p className="text-sm">
                {parseFloat(orderbill?.discountamount).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">NET AMOUNT</p>
              <p className="text-sm">
              {(
                  parseFloat(selectedOrder.initial_bill) -
                  parseFloat(orderbill?.discountamount)
                ).toFixed(2)}
              </p>
            </div></div>}
            <div className="flex justify-between mb-2">
              <p className="text-sm">
                CGST @ ({restaurantinfo.cgst}%)
              </p>
              <p className="text-sm">
                {orderbill?.cgstamount}
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">
                SGST @ ({restaurantinfo.sgst}%)
              </p>
              <p className="text-sm">
                {orderbill?.sgstamount}
              </p>
            </div>
            <div className="border-b-2 border-gray-300 border-dashed mb-2"></div>
            <div className="flex justify-between mb-2">
              <p className="text-sm font-bold">
                GRAND TOTAL
              </p>
              <p className="text-sm font-bold">
              ₹ {orderbill?.total_bill}
              </p>
            </div>
            <div className="border-b-2 border-gray-300 border-dashed mb-8"></div>
            {/* <div className="text-center text-sm my-4">GSTIN No. : {restaurantinfo.gstin}</div> */}
            <p className="text-center text-[.8rem]">
              Like our services? Scan to treat our team.
            </p>
            <div className="flex justify-center">
              <img
                src={qrcode}
                alt="QR Code"
                className="h-[8rem] w-[8rem]"
              />
            </div>
            
            <p className="text-center text-sm font-light mb-1 mt-4">
              THANK YOU! VISIT AGAIN
            </p>
            <p className="text-center text-sm font-light mb-4">
              HAVE A NICE DAY!
            </p>
          </div>
          
          <div className="flex justify-between my-4">
            <button
              // onClick={handleDownload}
              className="flex items-center space-x-1 px-4 py-2 border border-gray-400 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {/* <DownloadForOffline className="mr-2" /> */}
              <span>Download Bill</span>
            </button>
            <button
              // onClick={handlePrint}
              className="flex items-center space-x-1 px-4 py-2 border border-gray-400 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {/* <Print className="mr-2" /> */}
              <span>Print Bill</span>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <input
              type="tel"
              value={customerphone_no}
              onChange={(e)=>setcustomerphone_no(e.target.value)}
              placeholder="Customer's Phone Number"
              className="px-4 w-60 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 mr-2"
            />
            <button
              onClick={sendbilltophone}
              className="flex items-center space-x-1 px-4 py-2 border border-gray-400 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {/* <SimCardDownload className="mr-2" /> */}
              <span>Send e-bill</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default FinalBill;
