import { useState } from 'react';

const AddItemModal = ({ isOpen, onClose, onSave }) => {
  const [itemName, setItemName] = useState('');
  const [group, setGroup] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');

  const handleSave = () => {
    onSave({ itemName, group, amount, type });
    
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter item name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Group</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter group"
              >
              <option value="Vegetable">Vegetable</option>
              <option value="Fruit">Fruit</option>
              <option value="Meat">Meat</option>
              <option value="Mineral">Mineral</option>
              <option value="Sauces">Sauces</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter amount"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="Measurable">Measurable</option>
                <option value="Immeasurable">Immeasurable</option>
              </select>
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
                className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-md"
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
