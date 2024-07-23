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
    return <>Loading...</>;
  }
  return (
    
   <>
   {/* <TopBar title="Table Management"/> */}
   <MainTemplate user={user}/>
   </>
  )
}

export default page