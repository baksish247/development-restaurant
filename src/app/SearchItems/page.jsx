import React, { Suspense } from 'react';
import LoadingPage from '../Components/LoadingPage';
import SearchPage from './SearchPage';



function Page() {
  return (
    <Suspense fallback={<div><LoadingPage/></div>}>
      <SearchPage/>
    </Suspense>
  );
}

export default Page;