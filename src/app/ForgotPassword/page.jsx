import React, { Suspense } from 'react'
import ForgotPassword from './ForgotPassword'

function page() {
  return (
    <div><Suspense fallback={<div>Loading</div>}>
      <ForgotPassword/></Suspense></div>
  )
}

export default page