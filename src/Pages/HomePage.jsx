import React from 'react'
import Navbar from '../Components/Navbar'
import HomLayout from '../Components/HomLayout'

function HomePage() {
  return (
    <div className='bg-[#0f0f0f] text-white flex flex-col min-h-screen'>
        <Navbar/>
        <HomLayout/>
    </div>
  )
}

export default HomePage