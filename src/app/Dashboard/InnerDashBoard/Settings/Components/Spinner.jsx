import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <FaSpinner className="animate-spin text-gray-500 text-4xl" />
    </div>
  );
};

export default Spinner;
