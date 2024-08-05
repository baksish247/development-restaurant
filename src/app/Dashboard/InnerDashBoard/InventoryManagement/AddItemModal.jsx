import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IoMdArrowDropdown } from "react-icons/io";


const CustomDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 flex items-center  text-left w-full border border-gray-300 rounded-md p-2"
      >
        {value || 'Select an option'}
        <span className="absolute right-2 "><IoMdArrowDropdown/></span>
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full border border-gray-300 rounded-md bg-white max-h-56 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
const AddItemModal = ({ isOpen, onClose, onSave }) => {
  const [itemName, setItemName] = useState("");
  const [group, setGroup] = useState("Vegetable");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Measurable");
  const [btnclicked, setbtnclicked] = useState(false);
  const options = [
    'Baking',
    'Beverages',
    'Bread',
    'Dairy',
    'Fruit',
    'Meat',
    'Mineral',
    'Nuts and Seeds',
    'Oil',
    'Others',
    'Packed food',
    'Poultry',
    'Pulse',
    'Sauce',
    'Seafood',
    'Sweetener',
    'Vegetable'
  ];

  const measureoption=['Measurable','Immeasurable']

  const handleSave = () => {
    setbtnclicked(true);
    if(itemName=="" || amount==""){
      toast.error("Please fill all fields")
      setbtnclicked(false);
    }
    else{
    onSave({ itemName, group, amount, type });
    }
  };

  return (
    <>
    <Toaster/>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Item Name
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter item name"
              />
            </div>
            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Group
              </label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="mt-1 block max-h-20 w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter group"
              >
                <option value="Vegetable">Vegetable</option>
                <option value="Fruit">Fruit</option>
                <option value="Meat">Meat</option>
                <option value="Mineral">Mineral</option>
                <option value="Bread">Bread</option>
                <option value="Pulses">Pulse</option>
                <option value="Sauces">Sauce</option>
                <option value="Poultry">Poultry</option>
                <option value="Seafood">Seafood</option>
                <option value="Nuts and Seeds">Nuts and Seeds</option>
                <option value="Dairy">Dairy</option>
                <option value="Oils">Oil</option>
                <option value="Beverages">Beverages</option>
                <option value="Sweeteners">Sweetener</option>
                <option value="Baking">Baking</option>
                <option value="Packed foods">Packed food</option>
                <option value="Packed foods">Packed food</option>
                <option value="Packed foods">Packed food</option>
                <option value="Packed foods">Packed food</option>
                <option value="Packed foods">Packed food</option>
              </select>
            </div> */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Group
              </label>
              <CustomDropdown
                options={options}
                value={group}
                onChange={setGroup}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter amount"
              />
            </div>
            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="Measurable">Measurable</option>
                <option value="Immeasurable">Immeasurable</option>
              </select>
            </div> */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <CustomDropdown
                options={measureoption}
                value={type}
                onChange={setType}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="border-gray-500 border text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={btnclicked}
                className="bg-orange-500 disabled:cursor-not-allowed disabled:bg-orange-200 hover:bg-orange-400 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddItemModal;
