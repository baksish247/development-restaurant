import Link from 'next/link'
import React from 'react'

function DashboardCard({isactive,imgurl,label,url}) {
  return (
    <Link href={url} className='h-64 w-64 rounded-xl relative  border-2 border-zinc-500/40 hover:scale-105 duration-300 shadow-md shadow-zinc-300 bg-[#d9d9d962] '>
    <img src={imgurl} alt="bgimage" className={`w-full  ${!isactive?"grayscale blur-[2px] opacity-90":"opacity-80"}  h-full rounded-lg`}  />
    {!isactive&&<span className='absolute bottom-20 left-0 right-0 text-center  font-bold text-white uppercase text-2xl '>Coming Soon ....</span> }

    <span className='absolute bottom-4 left-0 right-0 text-center text-xl font-bold text-zinc-200'>{label}</span>
    </Link >
  )
}

export default DashboardCard