"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";

function FinalBill({
  restaurantinfo,
  selectedOrder,
  discountPercentage,
  discountdescription,
}) {
  const [customerphone_no, setcustomerphone_no] = useState("");
  const date = new Date(selectedOrder.createdAt);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const hasFetchedBill = useRef(false);
  const [orderbill, setorderbill] = useState();
  const [qrcode, setqrcode] = useState("");

  const fetchtipqr = async () => {
    const res = await axios.post("/api/getqrcodefortip", {
      url: `${process.env.NEXT_PUBLIC_QR_URL}?id=${restaurantinfo.restaurantid}`,
    });
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
      setorderbill(res.data.data);
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

  const handleDownload = async () => {
    try {
      const invoice = document.getElementById("invoice");

      // Ensure the invoice has rendered completely before capturing
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay to ensure rendering

      // Capture the invoice content
      const canvas = await html2canvas(invoice, {
        scale: 2, // Use a higher scale for better quality
        useCORS: true, // Ensure CORS is handled if you're loading images from a different domain
        windowWidth: invoice.scrollWidth,
        windowHeight: invoice.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      // Get image data URL in PNG format
      const imgData = canvas.toDataURL("image/png");

      // Create a new jsPDF instance with A4 size
      const pdf = new jsPDF("p", "pt", "a4"); // Changed to A4 size for better quality

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate image size and position to fit PDF page
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const width = imgWidth * ratio;
      const height = imgHeight * ratio;
      const xOffset = (pdfWidth - width) / 2;
      const yOffset = (pdfHeight - height) / 2;

      // Add image to PDF
      pdf.addImage(imgData, "PNG", xOffset, yOffset, width, height);
      pdf.save(`invoice-${selectedOrder.order_id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const handlePrint = () => {
    const invoice = document.getElementById("invoice").innerHTML;
    //console.log(invoice);

    const iframe = document.createElement("iframe");
    iframe.style.position = "relative";
    iframe.style.width = "4in"; // Set width for 4-inch thermal label printer
    iframe.style.height = "6in"; // Set height for 6-inch thermal label printer
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
              width: 80mm; /* Set width for 4-inch thermal label printer */
              height: 100%; /* Set height for 6-inch thermal label printer */
          }
  
          .invoice-container {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              width: 100%;
              padding: 0.25in; /* Adjust padding to fit within label */
          }
  
          .invoice {
              background-color: #ffffff;
              padding: 0.25in;
              border: 1px solid #ccc;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              width: 100%;
              height: 100%;
              box-sizing: border-box;
          }
  
          .restaurant-name,
          .restaurant-info,
          .qr-code {
              text-align: center;
          }
  
          .restaurant-name {
              font-weight: bold;
              font-size: 1.2rem;
              margin-bottom: 0.1in;
          }
  
          .restaurant-info {
              font-size: 0.9rem;
              margin-bottom: 0.1in;
          }
  
          .tax-invoice {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 0.1in;
          }
  
          .border-line {
              flex: 1;
              height: 1px;
              border-top: 1px dashed #000;
          }
  
          .tax-invoice span {
              margin: 0 10px;
          }
          .text-center-span{
          text-align:center;
          }
  
          table {
              width: 100%;
              margin-bottom: 0.1in;
              border-collapse: collapse;
          }
  
          table td,
          table th {
              font-size: 0.75rem;
              padding: 4px;
              border: 1px solid #ddd;
          }
  
          .items-table {
              border-top: 1px solid #ccc;
              border-bottom: 1px solid #ccc;
              border-style: dashed;
          }
  
          .items-table th {
              text-align: left;
              border-bottom: 1px solid #ccc;
              padding-bottom: 4px;
          }
  
          .summary-table {
              border-top: 1px solid #ccc;
          }
  
          .summary-table .grand-total {
              border-top: 1px solid #ccc;
              font-weight: bold;
          }
  
          .thank-you {
              text-align: center;
              font-size: 0.7rem;
              margin: 0.1in 0;
          }
  
          .qr-code img {
              height: 1in;
              width: 1in;
              margin-bottom: 0.1in;
          }
  
          .footer-text {
              text-align: center;
              font-size: 0.7rem;
              font-weight: light;
          }
          
      </style>
  </head>
  <body>
      <div class="invoice-container">
          <div class="invoice">
              <h6 class="restaurant-name">${restaurantinfo.restaurantname.toUpperCase()}</h6>
              <p class="restaurant-info">
                  ${restaurantinfo.restaurantaddress.toUpperCase()}
                  <br />
                  PHONE NO.: ${restaurantinfo.restaurantphoneNo}
              </p>
              <div class="my-4 flex items-center justify-center text-center">
                  <span class="border-line"></span>
                  <span class='text-center-span'>&nbsp;TAX INVOICE&nbsp;</span>
                  <span class="border-line"></span>
              </div>
  
              <table class="invoice-details">
                  <tbody>
                      <tr>
                          <td class="text-sm">Bill No.: ${
                            orderbill?.bill_no
                          }</td>
                          <td class="text-sm text-right">Date: ${day}/${month}/${year}</td>
                      </tr>
                      <tr>
                          <td class="text-sm">Table No: ${
                            selectedOrder.table_number
                          }</td>
                          <td class="text-sm text-right">Time: ${hours}:${minutes}:${seconds}</td>
                      </tr>
                  </tbody>
              </table>
  
              <table class="items-table">
                  <thead>
                      <tr>
                          <th class="text-sm">Description</th>
                          <th class="text-sm text-right">Qty.</th>
                          <th class="text-sm text-right">Price</th>
                          <th class="text-sm text-right">Value</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${selectedOrder.order_items
                        .map((orderitems, j) =>
                          orderitems.items
                            .map(
                              (item, k) =>
                                `<tr key="${k}">
                            <td class="text-sm text-left">${item.food.name.toUpperCase()}</td>
                            <td class="text-sm text-right">${parseFloat(
                              item.quantity
                            ).toFixed(2)}</td>
                            <td class="text-sm text-right">${parseFloat(
                              item.food.price
                            ).toFixed(2)}</td>
                            <td class="text-sm text-right">${(
                              parseFloat(item.quantity) *
                              parseFloat(item.food.price)
                            ).toFixed(2)}</td>
                          </tr>`
                            )
                            .join("")
                        )
                        .join("")}
                  </tbody>
              </table>
  
              <table class="summary-table">
                  <tbody>
                      <tr>
                          <td class="text-sm">SUB TOTAL:</td>
                          <td class="text-sm text-right">${parseFloat(
                            selectedOrder.initial_bill
                          ).toFixed(2)}</td>
                      </tr>
                      ${
                        parseFloat(orderbill?.discountamount) > 0.0
                          ? `
                        <tr>
                            <td class="text-sm">DISCOUNT @ (${
                              orderbill.discountpercent
                            }%)</td>
                            <td class="text-sm text-right">${parseFloat(
                              orderbill?.discountamount
                            ).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td class="text-sm">NET AMOUNT</td>
                            <td class="text-sm text-right">${(
                              parseFloat(selectedOrder.initial_bill) -
                              parseFloat(orderbill?.discountamount)
                            ).toFixed(2)}</td>
                        </tr>`
                          : ""
                      }
                      <tr>
                          <td class="text-sm">CGST @ (${
                            restaurantinfo.cgst
                          }%)</td>
                          <td class="text-sm text-right">${
                            orderbill?.cgstamount
                          }</td>
                      </tr>
                      <tr>
                          <td class="text-sm">SGST @ (${
                            restaurantinfo.sgst
                          }%)</td>
                          <td class="text-sm text-right">${
                            orderbill?.sgstamount
                          }</td>
                      </tr>
                      <tr class="grand-total">
                          <td class="text-sm font-bold">GRAND TOTAL</td>
                          <td class="text-sm font-bold text-right">₹ ${
                            orderbill?.total_bill
                          }</td>
                      </tr>
                  </tbody>
              </table>
  
              <p class="thank-you">
                  Like our services? Scan to treat our team.
              </p>
              <div class="qr-code">
                  <img src="${qrcode}" class="img" alt="QR Code">
              </div>
              <p class="footer-text">
                  THANK YOU! VISIT AGAIN
                  <br />
                  HAVE A NICE DAY!
              </p>
          </div>
      </div>
  </body>
  </html>
    `);
    doc.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

    const sendbilltophone = async() => {
      await axios.post('/api/sendbilltophone',{order_id:selectedOrder.order_id,phone:customerphone_no})
    const url = `https://wa.me/${customerphone_no}?text=${encodeURIComponent(
      `Hello! Here is your bill:\n\nRestaurant: ${
        restaurantinfo.restaurantname
      }\nBill No.: ${
        orderbill?.bill_no
      }\nDate: ${day}/${month}/${year}\nTime: ${hours}:${minutes}:${seconds}\n\nItems:\n${selectedOrder.order_items
        .map((item) =>
          item.items
            .map(
              (i) =>
                `${i.food.name.toUpperCase()} x ${i.quantity} @ ${i.food.price} = ${
                  i.quantity * i.food.price
                }`
            )
            .join("\n")
        )
        .join("\n")}\n\nSubtotal: ${parseFloat(
        selectedOrder.initial_bill
      ).toFixed(2)}\nDiscount: ${parseFloat(orderbill?.discountamount).toFixed(
        2
      )}\nNet Amount: ${(
        parseFloat(selectedOrder.initial_bill) -
        parseFloat(orderbill?.discountamount)
      ).toFixed(2)}\nCGST: ${orderbill?.cgstamount}\nSGST: ${
        orderbill?.sgstamount
      }\nGrand Total: ₹ ${orderbill?.total_bill}`
    )}`;

    window.open(url, "_blank");
    toast.success("Bill sent to phone");
  };

  if (!orderbill)
    return (
      <div className="flex justify-center flex-col items-center h-32">
        <span className="loader"></span>
      </div>
    );

  return (
    <>
      {orderbill && (
        <div className="lg:mx-4 overflow-hidden">
          <Toaster />
          <div className="  lg:p-1 -mx-3 lg:mx-0" id="invoice">
            <div className="bg-white p-2   shadow-md border-2 border-gray-300">
              <h6 className="font-bold text-center mb-4 text-xl">
                {restaurantinfo.restaurantname.toUpperCase()}
              </h6>
              <p className="text-center mb-4">
                {restaurantinfo.restaurantaddress.toUpperCase()}
                <br />
                PHONE NO.: {restaurantinfo.restaurantphoneNo}
              </p>
              <div className="my-4 flex items-center justify-center text-center">
                <span className="w-1/4 h-[1px] border-[1px] border-dashed border-black"></span>
                <span>&nbsp;TAX INVOICE&nbsp;</span>
                <span className="w-1/4 h-[1px] border-[1px] border-dashed border-black"></span>
              </div>

              <table className="w-full mb-4">
                <tbody>
                  <tr>
                    <td className="text-sm">Bill No.: {orderbill?.bill_no}</td>
                    <td className="text-sm text-right">
                      Date: {day}/{month}/{year}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm">
                      Table No: {selectedOrder.table_number}
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
                  {selectedOrder.order_items.map((orderitems, j) => (
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
                      {parseFloat(selectedOrder.initial_bill).toFixed(2)}
                    </td>
                  </tr>
                  {parseFloat(orderbill?.discountamount) > 0.0 && (
                    <React.Fragment>
                      <tr>
                        <td className="text-sm">
                          DISCOUNT @ ({orderbill.discountpercent}%)
                        </td>
                        <td className="text-sm text-right">
                          {parseFloat(orderbill?.discountamount).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-sm">NET AMOUNT</td>
                        <td className="text-sm text-right">
                          {(
                            parseFloat(selectedOrder.initial_bill) -
                            parseFloat(orderbill?.discountamount)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </React.Fragment>
                  )}
                  <tr>
                    <td className="text-sm">CGST @ ({restaurantinfo.cgst}%)</td>
                    <td className="text-sm text-right">
                      {orderbill?.cgstamount}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm">SGST @ ({restaurantinfo.sgst}%)</td>
                    <td className="text-sm text-right">
                      {orderbill?.sgstamount}
                    </td>
                  </tr>
                  <tr className="border-t-2 border-gray-300 border-dashed">
                    <td className="text-sm font-bold">GRAND TOTAL</td>
                    <td className="text-sm font-bold text-right">
                      ₹ {orderbill?.total_bill}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className="text-center text-[.8rem] mb-4">
                Like our services? Scan to treat our team.
              </p>
              <div className="flex justify-center mb-4">
                <img src={qrcode} alt="QR Code" className="h-[8rem] w-[8rem]" />
              </div>
              <p className="text-center text-sm font-light mb-1">
                THANK YOU! VISIT AGAIN
              </p>
              <p className="text-center text-sm font-light">HAVE A NICE DAY!</p>
            </div>
          </div>

          <div className="flex justify-between my-4">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 px-4 py-2 border border-gray-400 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <span>Download Bill</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-4 py-2 border border-gray-400 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <span>Print Bill</span>
            </button>
          </div>
          <div className="mb-2 w-full">
            <input
              type="tel"
              value={customerphone_no}
              onChange={(e) => setcustomerphone_no(e.target.value)}
              placeholder="Customer's Phone Number"
              className="px-4 w-full py-2 border text-center border-gray-400 rounded-md "
            />
            </div>
            <div className="text-center">
            <button
              onClick={sendbilltophone}
              className="space-x-1  w-full py-2 text-white border  bg-amber-500 rounded-md hover:bg-amber-400 "
            >
              <span>Send e-bill</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default FinalBill;
