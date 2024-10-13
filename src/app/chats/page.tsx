import Sidebar from '@/components/Sidebar'
import React from 'react'


const Dashboard = () => {
  return (
    <div className="flex">
        <div className="flex-[1] p-4 border-r-4 border-1-slate-200">
            <Sidebar />
        </div>
        <div className="flex-[5]"></div>
    </div>
  )
}

export default Dashboard