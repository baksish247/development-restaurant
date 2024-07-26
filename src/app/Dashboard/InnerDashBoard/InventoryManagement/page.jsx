"use client";
import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineArrowDown } from "react-icons/ai";

const InventoryManagement = () => {
  const items = [
    {
      code: "V01456",
      photo: "🥦",
      name: "Broccoli",
      group: "Vegetable",
      lastPurchase: "03 May 2021",
      onHand: "10 Kg",
    },
    {
      code: "V01457",
      photo: "🍆",
      name: "Aubergine",
      group: "Vegetable",
      lastPurchase: "04 May 2021",
      onHand: "8 Kg",
    },
    {
      code: "V01458",
      photo: "🥕",
      name: "Carrot",
      group: "Vegetable",
      lastPurchase: "04 May 2021",
      onHand: "12 Kg",
    },
    {
      code: "V01459",
      photo: "🌶️",
      name: "Chili",
      group: "Vegetable",
      lastPurchase: "05 May 2021",
      onHand: "4.5 Kg",
    },
    {
      code: "V01460",
      photo: "🍋",
      name: "Lemon",
      group: "Vegetable",
      lastPurchase: "03 May 2021",
      onHand: "1 Kg",
      low: true,
    },
    {
      code: "M01461",
      photo: "🍗",
      name: "Chicken",
      group: "Meat",
      lastPurchase: "02 May 2021",
      onHand: "56 P",
    },
    {
      code: "M01462",
      photo: "🥩",
      name: "Beef Liver",
      group: "Meat",
      lastPurchase: "03 May 2021",
      onHand: "4 Kg",
      low: true,
    },
    {
      code: "M01463",
      photo: "🥩",
      name: "Beef",
      group: "Meat",
      lastPurchase: "02 May 2021",
      onHand: "43 Kg",
    },
    {
      code: "F01464",
      photo: "🐟",
      name: "Salmon Fish",
      group: "Fish",
      lastPurchase: "06 May 2021",
      onHand: "23 Kg",
    },
    {
      code: "F01465",
      photo: "🍤",
      name: "Shrimp",
      group: "Fish",
      lastPurchase: "02 May 2021",
      onHand: "13 Kg",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col ">
      <div className=" overflow-x-hidden">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border rounded-lg divide-y divide-gray-200">
            <div className="py-3 px-4">
              <div className="relative max-w-xs">
                <label className="sr-only">Search</label>
                <input
                  type="text"
                  name="hs-table-with-pagination-search"
                  id="hs-table-with-pagination-search"
                  className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="Search for items"
                />
                <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                  <svg
                    className="size-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="lg:overflow-hidden  overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      Item Code
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      Photo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      Item Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      Item Group
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      Last Purchase
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      On Hand
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-800">
                        {item.code}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm rounded-full text-gray-800">
                        {item.photo}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {item.group}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                        {item.lastPurchase}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800 flex items-center justify-start pl-10 w-28 mx-auto">
                        {item.onHand}
                        {item.low && (
                          <AiOutlineArrowDown className="text-red-500 ml-2" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-end whitespace-nowrap text-sm font-medium">
                        <button
                          type="button"
                          className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          <FaEdit className="text-gray-500 cursor-pointer hover:text-blue-500" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          <FaTrashAlt className="text-gray-500 cursor-pointer hover:text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="py-1 px-4">
              <nav
                className="flex items-center space-x-1"
                aria-label="Pagination"
              >
                <button
                  type="button"
                  className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Previous"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <span aria-hidden="true">«</span>
                  <span className="sr-only">Previous</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    type="button"
                    className={`min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 py-2.5 text-sm rounded-full ${
                      currentPage === i + 1 ? "bg-gray-200" : ""
                    }`}
                    aria-current={currentPage === i + 1 ? "page" : undefined}
                    onClick={() => handlePageClick(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                  aria-label="Next"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <span aria-hidden="true">»</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
