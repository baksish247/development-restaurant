"use client"
import React ,{useEffect} from 'react'
// import TopBar from '../DashboardComponents/TopBar'
import MainTemplate from './MainTemplate'
import { useAuth } from '@/app/Context/AuthContext';
import { useRouter } from 'next/navigation';

function page() {
  const { user, loading } = useAuth();
  //console.log(user , loading);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className="flex justify-center items-center mt-40">
    <span className="loader"></span>
  </div>;
  }
  return (
    
   <>
   {/* <TopBar title="Table Management"/> */}
   <MainTemplate user={user}/>
   <div className='flex flex-wrap justify-end space-x-4 absolute top-[105px] right-4'>
   <div className=' space-x-2   flex justify-between items-center'>
    <span className='h-4 w-4 bg-red-300 rounded-full border  border-black'/>
    <span>Waiting For Bill</span>
   </div>
   <div className=' space-x-2   flex justify-between items-center'>
    <span className='h-4 w-4 bg-green-300 rounded-full border  border-black'/>
    <span>New</span>
   </div>
   <div className=' space-x-2   flex justify-between items-center'>
    <span className='h-4 w-4 bg-blue-300 rounded-full border  border-black'/>
    <span>Served</span>
   </div>
   <div className=' space-x-2   flex justify-between items-center'>
    <span className='h-4 w-4 bg-gray-200 rounded-full border  border-black'/>
    <span>Bill Generated</span>
   </div>
   <div className=' space-x-2   flex justify-between items-center'>
    <span className='h-4 w-4 bg-amber-100 rounded-full border  border-black'/>
    <span>Updated</span>
   </div>
   <div className=' space-x-2   flex justify-between items-center'>
    <span className='h-4 w-4 bg-white rounded-full border  border-black'/>
    <span>Empty</span>
   </div>
   </div>
   </>
  )
}

export default page