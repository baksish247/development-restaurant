"use client";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineArrowDown } from "react-icons/ai";
import axios from "axios";
import UpdateItemModal from "./UpdateItemAmountModal";
import AddNewItem from "./AddNewItem";

const InventoryItems = ({ user }) => {
  const [items, setitems] = useState([]);
  const [loading, setloading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, settotalPages] = useState(0);
  const [updateModal, setupdateModal] = useState(false);
  const [selecteditem, setselecteditem] = useState({});
  const [search, setsearch] = useState("")
  const [addnew, setaddnew] = useState(false)
  const openUpdateModal = (item) => {
    setselecteditem(item);
    setupdateModal(true);
  };
  const onClose = () => {
    setupdateModal(false);
  };
  const closeaddnew=()=>{
    setaddnew(false);
  }
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

  const fetchitems = async () => {
    console.log(user.restaurantid);
    try {
      const res = await axios.post("/api/fetchinventoryitems", {
        restaurant_id: user.restaurantid,
      });
      if (res.data.success) {
        console.log(res.data.data);
        settotalPages(Math.ceil(res.data.data.length / itemsPerPage));
        setitems(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchitems();
  }, []);

  const handleSearchChange = (e) => setsearch(e.target.value);

  const filteredItems = currentItems.filter((items) => {
    const matchesSearch = items.item_name.toLowerCase().includes(search.toLowerCase()) || items.item_group.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="flex rounded-xl flex-col bg-white">
      <div className=" overflow-x-hidden">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border rounded-lg divide-y divide-gray-200">
            <div className="py-3 px-4 flex items-center justify-between">
              <div className="relative max-w-xs">
                <label className="sr-only">Search</label>
                <input
                  type="text"
                  name="hs-table-with-pagination-search"
                  id="hs-table-with-pagination-search"
                  onChange={(e)=>handleSearchChange(e)}
                  className="py-2 px-3 ps-9 block w-full bg-gray-100 border-gray-200 shadow-md rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
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
              <div className=""><button className="px-4 py-1 border rounded-lg bg-gray-100 shadow-md hover:bg-gray-200 border-black" onClick={()=>{setaddnew(true)}}>Add new +</button></div>
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
                      Last Purchase Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      Last Purchase Amount
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
                  {filteredItems.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-800">
                        {item.item_code}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm rounded-full text-gray-800">
                        {item.item_photo}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                        {item.item_name}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                        {item.item_group}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                        {item.last_purchase_date}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800">
                        {item.last_purchase_amount} kgs
                      </td>
                      <td className="px-6 py-4   whitespace-nowrap text-sm text-gray-800 flex items-center justify-start pl-10 w-28 mx-auto">
                        {parseFloat(item.on_hand_amount).toFixed(2)} kgs
                        {item.low && (
                          <AiOutlineArrowDown className="text-red-500 ml-2" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-end whitespace-nowrap text-sm font-medium">
                        <button
                          type="button"
                          onClick={()=>openUpdateModal(item)}
                          className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          <FaEdit className="text-gray-500 cursor-pointer hover:text-blue-500" />
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
                    className={`min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 py-2.5 text-sm rounded-full ${
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
      {updateModal && (
        <UpdateItemModal
          onClose={onClose}
          item={selecteditem}
          fetchitems={fetchitems}
        />
      )}
      {addnew && <AddNewItem onClose={closeaddnew} fetchitems={fetchitems} currentInventoryItems ={items} restaurant_id={user.restaurantid}/>}
    </div>
  );
};

export default InventoryItems;
