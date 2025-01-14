import React ,{ useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {Sidebar} from 'flowbite-react';
import {HiChartPie, HiArrowSmRight, HiDocumentText, HiUser, HiUserGroup, HiAnnotation} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import {useDispatch} from 'react-redux';
import { useSelector } from 'react-redux';
export default function DashboardSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const {currentUser} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
    console.log(tabFromUrl)
    // console.log(urlParams)
  }, [location.search]);

  const handleSignOut = async()=>{
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',

      })
      const data = await res.json();
      if(!res.ok) {
        console.log(data.message);
      }
      else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-100">
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                {currentUser && currentUser.isAdmin && (
                  <Link to='/dashboard?tab=dash'>
                    <Sidebar.Item
                      active={tab === 'dash' || !tab}
                      icon={HiChartPie}
                      as='div'
                    >
                      Dashboard
                    </Sidebar.Item>
                  </Link>
                )}
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab==='profile'} icon={HiUser}    label = {currentUser.isAdmin?'Admin':'User'} labelColor='dark' as='div'>
                        Profile
                    </Sidebar.Item>
                </Link>
                {
                  currentUser.isAdmin && (<Link to='/dashboard?tab=posts'>
                                            <Sidebar.Item active={tab==='posts'} icon={HiDocumentText} as='div'>
                                                Posts
                                            </Sidebar.Item>
                                         </Link>)
                }

                {
                  currentUser.isAdmin && (<Link to='/dashboard?tab=users'>
                                            <Sidebar.Item active={tab==='users'} icon={HiUserGroup} as='div'>
                                                Users
                                            </Sidebar.Item>
                                         </Link>)
                }

                {
                  currentUser.isAdmin && (<Link to='/dashboard?tab=comments'>
                                            <Sidebar.Item active={tab==='comments'} icon={HiAnnotation} as='div'>
                                                Comments
                                            </Sidebar.Item>
                                         </Link>)
                }
                
                <Sidebar.Item active={tab==='sign-out'} icon={HiArrowSmRight} className = 'cursor-pointer' onClick={handleSignOut}>
                    Sign Out
                </Sidebar.Item>
                

            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
    </div>
  )
}
