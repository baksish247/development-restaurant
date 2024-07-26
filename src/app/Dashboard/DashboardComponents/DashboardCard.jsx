import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function DashboardCard({ isactive, imgurl, label, url }) {
  return (
    <Link href={url} className='h-64 w-80 rounded-xl relative border-2 border-zinc-500/40 hover:scale-105 duration-300 shadow-md shadow-zinc-300 bg-[#d9d9d962]'>
      <div className='relative w-full h-full'>
        <Image src={imgurl} alt="bgimage" className={`w-full ${!isactive ? "grayscale-[60%] blur-[2px] opacity-90" : "opacity-80"} h-full rounded-lg`} />
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg'></div>
      </div>
      {!isactive && <span className='absolute bottom-20 left-0 right-0 text-center font-bold text-white uppercase text-2xl'>Coming Soon ....</span>}
      <span className='absolute bottom-4 left-0 right-0 text-center text-xl font-bold text-zinc-200'>{label}</span>
    </Link>
  )
}

export default DashboardCard
