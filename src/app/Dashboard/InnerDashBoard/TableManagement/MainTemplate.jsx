import React from 'react'
import TableCard from './TableDetails/TableCard'

function MainTemplate() {
  return (
    <div className='lg:px-20 grid grid-cols-2 lg:grid-cols-7 lg:gap-6 gap-4  justify-items-center mt-10'>
        <TableCard/>
        <TableCard/>
        <TableCard/>
        <TableCard/>
        <TableCard/>
        <TableCard/>
        <TableCard/>
        <TableCard/>
        <TableCard/>
        <TableCard/>

    </div>
  )
}

export default MainTemplate