import React from 'react'
import play from '../assets/play.png'
function Navbar() {
  return (
    <div className='bg-[#160106] fixed w-full text-white flex p-2 px-4 gap-2 lg:gap-4 items-center lg:px-16 '>
        <img src={play} alt="Play Icon" className='w-8 h-8 m-4' />
        <h2 className='font-semibold text-[#864456] tracking-wider font-serif text-xl lg:text-4xl'>TubeDown</h2>

    </div>
  )
}

export default Navbar