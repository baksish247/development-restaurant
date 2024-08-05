"use client"
import React, { useState } from 'react';
import { MdOutlineContactSupport } from 'react-icons/md';
import  {toast,Toaster} from 'react-hot-toast'

function ReportButton() {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleButtonClick = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    toast.success('Issue reported!');
    setIsFormVisible(false);
  };

  return (
    <div>
      {/* Floating Button */}
      <button
        className="fixed bottom-4 z-40 right-5 w-14 h-14 bg-indigo-500 drop-shadow-md text-white rounded-full hover:bg-indigo-400 flex items-center justify-center shadow-lg focus:outline-none"
        onClick={handleButtonClick}
      >
        <MdOutlineContactSupport className='size-6'/>
      </button>

      {/* Form */}
      {isFormVisible && (
        <div className="fixed bottom-20 right-5 w-80 p-4 bg-white rounded-lg shadow-lg z-50">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <textarea
              placeholder="Describe the issue..."
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-orange-400 text-white rounded-md"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setIsFormVisible(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ReportButton;
