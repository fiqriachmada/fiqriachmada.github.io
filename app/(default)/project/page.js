import React from 'react'
import projectItems from './projectItems'

const title = 'project'
export const metadata = {
  title: 'fiqriachmada | ' + title,
  description: 'pernosal site'
}

function Project () {
  return (
    <div className='grid lg:grid-cols-2 gap-4 grid-cols-1'>
      {projectItems.map(projectItem => (
        <div className='bg-white text-black shadow-xl rounded-md mt-5'>
          <div className='p-6 md::px-10'>
            <>
              <div className='flex justify-start pt-5 capitalize'>
                {projectItem.title}
              </div>
              {/* <div className='flex justify-center pt-5'>
                <img
                  src='https://svgshare.com/i/tmn.svg'
                  className='hover:bg-slate-300 hover:rounded-2xl'
                />
              </div> */}
              {/* <div className='text-center pt-5 '>{projectItem.content[1]}</div>
              <div className='text-center pt-5 '>{projectItem.content[2]}</div> */}
            </>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Project
