import React from 'react';

const Switch = ({ isChecked, handleChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isChecked}
        onChange={handleChange}
      />
      <div className="w-12 h-6 border border-orange-700 bg-gray-200 rounded-full outline-2  peer peer-focus:ring-[1px] peer-focus:ring-orange-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-[22px] after:transition-all peer-checked:bg-orange-500"></div>
    </label>
  );
};

export default Switch;
