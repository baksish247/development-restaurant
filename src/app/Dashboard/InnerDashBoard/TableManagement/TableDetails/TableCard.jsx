import React from 'react'

function TableCard() {
  return (
    <div className="border-dashed border-2 rounded-lg h-28 w-36 bg-sky-500/30 border-gray-500 relative flex flex-col">
  <div className="flex-none rounded-t-lg h-6 bg-white flex items-center justify-center">
    <span className="text-zinc-800">01</span>
  </div>
  <div className="flex-1 p-4">
    <div className="absolute bottom-4 left-4">
      <p className="text-[0.7rem]">Ordered: 20 min ago</p>
      <p className="text-[0.7rem]">Status: Served</p>
      <p className="text-[0.7rem]">Bill: ₹1000</p>
    </div>
  </div>
</div>

  )
}

export default TableCard