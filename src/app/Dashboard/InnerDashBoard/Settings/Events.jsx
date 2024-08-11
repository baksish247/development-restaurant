"use client";
import React, { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { FiCalendar, FiClock, FiMapPin, FiUpload } from "react-icons/fi";
import { useAuth } from "@/app/Context/AuthContext";
import axios from "axios";

function Events() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [itemImage, setItemImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("");

  const fetchAllEvents = async () => {
    try {
      const { data } = await axios.get(`/api/getallevents?restaurant_id=${user.restaurantid}`);
      if (data.success) {
        setEvents(data.events);
      } else {
        console.error("Error fetching events");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const addEvent = async (event) => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/addevents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (response.ok) {
        const newEvent = await response.json();
        setEvents([...events, newEvent]);
        toggleModal();
      } else {
        console.error("Error adding event");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (result) => {
    if (result.event === "success") {
      const url = result.info.secure_url;
      setItemImage(url);
    }
  };

  const filterEvents = () => {
    const now = new Date();
    let filteredEvents = [...events];

    switch (filter) {
      case "weekly":
        filteredEvents = filteredEvents.filter((event) => {
          const eventDate = new Date(event.date);
          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return eventDate >= startOfWeek && eventDate <= endOfWeek;
        });
        break;
      case "monthly":
        filteredEvents = filteredEvents.filter((event) => {
          const eventDate = new Date(event.date);
          return (
            eventDate.getMonth() + 1 === parseInt(selectedMonth) &&
            eventDate.getFullYear() === now.getFullYear()
          );
        });
        break;
      case "date":
        filteredEvents = filteredEvents.filter(
          (event) => new Date(event.date).toDateString() === now.toDateString()
        );
        break;
      default:
        break;
    }
    return filteredEvents;
  };

  return (
    <div className="relative w-full p-4">
      <button
        onClick={toggleModal}
        className="absolute right-4 top-4 bg-orange-500 hover:scale-y-105 duration-200 px-4 py-2 text-white rounded-full shadow-md"
      >
        + Add Events
      </button>

      <div className="mt-12">
        <div className="mb-4">
          <button
            onClick={() => setFilter("all")}
            className="mr-4 bg-indigo-500 text-white px-4 py-2 rounded-md"
          >
            All Events
          </button>
          <button
            onClick={() => setFilter("weekly")}
            className="mr-4 bg-indigo-500 text-white px-4 py-2 rounded-md"
          >
            Weekly
          </button>
          <button
            onClick={() => setFilter("monthly")}
            className="mr-4 bg-indigo-500 text-white px-4 py-2 rounded-md"
          >
            Monthly
          </button>
          {filter === "monthly" && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="mr-4 bg-white border border-gray-400 text-gray-700 px-4 py-2 rounded-md"
            >
              <option value="">Select Month</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          )}
          <button
            onClick={() => setFilter("date")}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md"
          >
            Today
          </button>
        </div>

        <p className="text-xl font-semibold text-gray-800 mb-4">All Events</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterEvents().map((event, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
            >
              {event.image && (
                <img
                  src={event.image}
                  alt="Event Banner"
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              )}
              <h3 className="text-lg font-semibold text-indigo-600">
                {event.title}
              </h3>
              <div className="text-gray-600 mt-2 flex items-center">
                <FiMapPin className="mr-2" />
                <span>{event.place}</span>
              </div>
              <div className="text-gray-600 mt-2 flex items-center">
                <FiCalendar className="mr-2" />
                <span>{event.date}</span>
              </div>
              <div className="text-gray-600 mt-2 flex items-center">
                <FiClock className="mr-2" />
                <span>{event.time}</span>
              </div>
              <div className="relative h-24 mt-2 overflow-hidden">
                <div className="h-full overflow-y-auto noscrollbar">
                  <p className="text-gray-600">{event.description}</p>
                </div>
              </div>
              <p className="text-gray-800 font-bold mt-2">Price: ${event.price}</p>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white max-h-[650px] overflow-y-auto p-6 py-2 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Event</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newEvent = {
                  title: formData.get("title"),
                  description: formData.get("description"),
                  image: itemImage,
                  date: formData.get("date"),
                  time: formData.get("time"),
                  place: formData.get("place"),
                  price: formData.get("price"),
                  restaurant_id: user.restaurantid,
                  restaurantname: user.restaurantname ?? "abc",
                };
                addEvent(newEvent);
              }}
            >
              <div
                className={`border-dashed border-2 border-gray-400 p-8 text-center cursor-pointer ${
                  itemImage ? "bg-cover bg-center" : ""
                }`}
                style={{ backgroundImage: `url(${itemImage})` }}
              >
                <CldUploadWidget onUpload={handleImageUpload}>
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className={`${
                        itemImage ? "text-white" : "text-black"
                      } inline-flex items-center px-4 py-2 rounded-md`}
                    >
                      <FiUpload /> &nbsp;
                      {itemImage ? "Change Image" : "Upload Item Image"}
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4 items">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  name="time"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Place</label>
                <input
                  type="text"
                  name="place"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none"
                  required
                />
              </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${
                    isSaving ? "bg-gray-500 cursor-not-allowed" : "bg-green-500"
                  } text-white px-4 py-2 rounded-md`}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
