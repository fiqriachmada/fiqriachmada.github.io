'use client'

import React from 'react'
import aboutItems from './aboutItems'

function About () {
  return (
    <div>
      {aboutItems.map(aboutItem => (
        <div className='bg-white text-black shadow-xl rounded-md'>
          <div className='p-6 lg:px-32'>
            <div className='flex justify-center pt-5 capitalize'>
              {aboutItem.welcome}
            </div>
            <div className='flex justify-center pt-5'>
              <img
                src='https://svgshare.com/i/tmn.svg'
                className='hover:opacity-70'
              />
            </div>
            <div className='text-center pt-5 '>{aboutItem.content[1]}</div>
            <div className='text-center pt-5 '>{aboutItem.content[2]}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default About
