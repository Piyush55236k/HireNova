import React from 'react'
import { Outlet } from 'react-router-dom';
import Header from '@/components/ui/header';

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <div className="relative z-10 container px-10">
        <main className="min-h-screen ">
          <Header />
          <Outlet />
        </main>
        <div className="text-white p-10 text-center bg-gray-800 mt-10">Made by Piyush All Rights Reserved</div>
      </div>
    </div>
  )
}

export default AppLayout