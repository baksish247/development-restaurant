// components/TeamPage.js
import { useAuth } from "@/app/Context/AuthContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddWaiterModalForm from "./AddWaiterModal";
import { IoMdAdd, IoMdRemove, IoMdTrash, IoMdCreate } from "react-icons/io";
import Image from "next/image";

function TeamPage() {
  const {
    user: { restaurantid },
  } = useAuth();
  const [currentWaiter, setCurrentWaiter] = useState({})
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [waiters, setWaiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedWaiters, setSelectedWaiters] = useState([]);

  const closeAddWaiterModal = () => {
    fetchWaiters()
    setOpenAddModal(false);
  };

  const fetchWaiters = async () => {
    try {
     // console.log(restaurantid)
      const response = await axios.post("/api/getwaiters", {
        restaurant_id: restaurantid,
      });
      //console.log(response.data)
      if (response.data.success) {
        setWaiters(response.data.data);
       // console.log(response.data.data);
      }
      setLoading(false);
    } catch (e) {
      toast.error("Failed to fetch waiters");
    }
  };

  useEffect(() => {
    fetchWaiters();
  }, [restaurantid]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setFilter(e.target.value);

  const filteredWaiters = waiters.filter((waiter) => {
    const matchesSearch = waiter.username.toLowerCase().includes(searchTerm.toLowerCase()) || waiter.email.toLowerCase().includes(searchTerm.toLowerCase()) || waiter.phoneNo.toLowerCase().includes(searchTerm.toLowerCase()) || waiter.profession.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || waiter.profession === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCheckboxChange = (waiterId) => {
    setSelectedWaiters((prev) =>
      prev.includes(waiterId)
        ? prev.filter((id) => id !== waiterId)
        : [...prev, waiterId]
    );
  };

  const handleDeleteWaiters = async () => {
    if(confirm('Are you sure you want to delete the selected staffs?')){
    try {
      const response = await axios.post("/api/removewaiter", {
        waiter_ids: selectedWaiters,
      });
      if (response.data.success) {
        toast.success("Waiters deleted successfully");
        fetchWaiters(restaurantid);
        setSelectedWaiters([]);
      } else {
        toast.error("Failed to delete waiters");
      }
    } catch (e) {
      toast.error("Failed to delete waiters");
    }
  }
  };

  const handleEditWaiter = (waiter) => {
    setOpenAddModal(true);
  setCurrentWaiter(waiter);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto mt-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-4 py-2 border border-gray-300 rounded"
            />
            <select
              value={filter}
              onChange={handleFilterChange}
              className="px-4 w-32 py-2 border border-gray-300 rounded"
            >
              <option value="All">All</option>
              <option value="Waiter">Waiter</option>
              <option value="Chef">Chef</option>
            </select>
          </div>
          <div><div className=" flex items-center justify-center space-x-4">
          {selectedWaiters.length > 0 && (
          <div className="">
            <button
              className="bg-red-700 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={handleDeleteWaiters}
            >
              Delete Selected
            </button>
          </div>
        )}
            <button
              className="bg-orange-500 hover:bg-orange-400 text-white px-4 flex items-center justify-center py-2 rounded-lg"
              onClick={() => setOpenAddModal(true)}
            >
              Add Staff&nbsp;
              <span className="text-xl">
                <IoMdAdd />
              </span>
            </button>
            </div>

          </div>
        </div>
        {waiters.length === 0 && (
          <div className="flex justify-center items-center mt-20 text-xl">
            No member registered...<br/>Click on Add Staff button to add a member.
          </div>
        )}
        {waiters.length > 0 && (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sl No.
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profession
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edit
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWaiters.map((waiter, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <img
                      src={waiter.image}
                      alt="profilepic"
                      className="h-10 w-10 bg-slate-100 rounded-full border-2 border-amber-500 object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {waiter.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {waiter.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {waiter.phoneNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {waiter.profession}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      className="text-blue-500 text-lg hover:text-blue-700"
                      onClick={() => handleEditWaiter(waiter)}
                    >
                      <IoMdCreate />
                    </button>
                    {/* <button
                      className="text-red-500 text-lg hover:text-red-700 ml-2"
                      onClick={() => handleDeleteWaiters(waiter._id)}
                    >
                      <IoMdTrash />
                    </button> */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="checkbox"
                      checked={selectedWaiters.includes(waiter._id)}
                      onChange={() => handleCheckboxChange(waiter._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
      </div>
      {openAddModal && (
        <AddWaiterModalForm
        onClose={closeAddWaiterModal}
        restaurantid={restaurantid}
        fetchWaiters={fetchWaiters}
        currentWaiter={currentWaiter} // New prop for current waiter details
      />
      )}
    </div>
  );
}

export default TeamPage;
