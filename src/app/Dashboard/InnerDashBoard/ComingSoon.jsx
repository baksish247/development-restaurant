import Image from 'next/image'
import React from 'react'
import waiting from '../../assets/images/coming.png'

function ComingSoon() {
  return (
    <div className=' h-fit'>
        <Image src={waiting} alt='waitingbg' width={1000} className='md:h-[60%] mix-blend-multiply md:w-[60%] ' height={1000}/>


    </div>
  )
}

export default ComingSoon