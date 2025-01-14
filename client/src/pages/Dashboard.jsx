import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardProfile from '../components/DashboardProfile'
import DashboardSidebar from '../components/DashboardSidebar'
import DashboardPosts from '../components/DashboardPosts';
import DashboardUsers from '../components/DashboardUsers';
import DashboardComments from '../components/DashboardComments';
import DashboardComponent from '../components/DashboardComponent';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
    console.log(tabFromUrl)
    // console.log(urlParams)
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
          {/* sidebar */}
          <DashboardSidebar/>
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashboardProfile/>}
      {tab === 'posts' && <DashboardPosts/>}
      {tab === 'users' && <DashboardUsers/>}
      {tab === 'comments' && <DashboardComments/>}
      {tab === 'dash' && <DashboardComponent/>}
    </div>
  )
}
