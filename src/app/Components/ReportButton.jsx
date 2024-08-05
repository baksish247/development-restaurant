"use client";
import React, { useState } from 'react';
import { MdOutlineContactSupport } from 'react-icons/md';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

function ReportButton() {
  const {user}=useAuth();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  const [btnclicked, setbtnclicked] = useState(false)

  const handleButtonClick = () => {
    setIsFormVisible(!isFormVisible);
  };

  const generateTicketNumber = () => {
    return 'T-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setbtnclicked(true);
    toast.loading("Reporting issue.")
    const ticketNumber = generateTicketNumber();
    try {
      
      const res=await axios.post('/api/report-issue', {
        restaurant_id:user.restaurantid,
        ticketNumber,
        issueDescription,
      });
      toast.dismiss();
      if(res.data.success){
      toast.success('Issue reported!');
      }
      else{
        toast.error('Failed to report issue.')
      }
      
    } catch (error) {
      toast.error('Failed to report issue. Please try again.');
    }
    finally{
      setbtnclicked(false);
      setIssueDescription("");
      setIsFormVisible(false);
    }
  };

  return (
    <div>
      <Toaster />
      <button
        className="fixed bottom-4 z-40 right-5 w-14 h-14 bg-indigo-500 drop-shadow-md text-white rounded-full hover:bg-indigo-400 flex items-center justify-center shadow-lg focus:outline-none"
        onClick={handleButtonClick}
      >
        <MdOutlineContactSupport className='size-6' />
      </button>

      {isFormVisible && (
        <div className="fixed bottom-20 right-5 w-80 p-4 bg-white rounded-lg shadow-lg z-50 border-2 border-zinc-300">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <textarea
              placeholder="Describe the issue..."
              rows="4"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                disabled={btnclicked}
                className="px-4 py-2 disabled:cursor-not-allowed bg-orange-400 text-white rounded-md"
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
