import React, { useEffect, useState } from 'react';
import { HiStar } from 'react-icons/hi';
import { useParams, useNavigate } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble, BsTelegram, BsLinkedin } from 'react-icons/bs';
export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [cfData, setCfData] = useState(null);
  const { username } = useParams();
  const navigate = useNavigate();
  const imageFileURL = 'https://userpic.codeforces.org/no-title.jpg'
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/profile/${username}`);
        if (!response.ok) {
          console.log("cf")
        }
        const data = await response.json();
        setUser(data);
        if (data.cf) {
          const cfResponse = await fetch(`https://codeforces.com/api/user.info?handles=${data.cf}`);
          const cfResult = await cfResponse.json();
          if (cfResult.status === 'OK') {
            setCfData(cfResult.result[0]);
          } else {
            console.error('Failed to fetch CF data:', cfResult.comment);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username, navigate]);

  const getRatingColor = (rating) => {
    // console.log("infuncall");
    if (rating < 1200) { return { color: '#808080' }; }
    if (rating < 1400) { return { color: '#008000' }; }
    if (rating < 1600) { return { color: '#03A89E' }; }
    if (rating < 1900) { return { color: '#0000ff' }; }
    if (rating < 2100) { return { color: '#a0a' }; }
    if (rating < 2300) { return { color: '#FF8C00' }; }
    if (rating < 2400) { return { color: '#FF8C00' }; }
    if (rating < 2600) { return { color: '#ff0000' }; }
    if (rating < 2600) { return { color: '#ff0000' }; }
    if (rating < 3000) { return { color: '#ff000' }; }
    if (rating < 4000) { return { color: '#ff0000' }; }
  };
// console.log(cfData);
// console.log(cfData.avatar);
  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }} className='min-h-screen'>

      <div className='flex flex-col border '>

        <div className='flex gap-5 justify-between border p-5 flex-wrap'>
          <div className='flex flex-col gap-2'>
            {/* {user && user.isAdmin && (<span className='text-red-700 bg-amber-400 max-w-12'>Admin</span>)} */}
            <div className='flex items-center gap-2'>
              <span className='font-bold text-3xl' style={cfData ? getRatingColor(cfData.rating) : { color: 'gray' }} >{user.username}</span>
              {user && user.isAdmin && (<span className='text-amber-400 text-3xl'><HiStar /></span>)}
            </div>
            {user && user.name && <p className='text-gray-500'> {user.name}</p>}
            {user && user.organization && <p className='text-gray-500'> {user.organization}</p>}
            <p className='text-gray-500'>email: {user.email}</p>
            <div className='flex gap-2'>
              {user && user.github && <BsGithub size={25} color="black" href={`${user.github}`} />}
              {user && user.linkedin && <BsLinkedin size={25} color="black" href={`${user.linkedin}`} />}
            </div>
          </div>
          <div>
            <img src={cfData && cfData.titlePhoto|| imageFileURL}
              className='w-60 h-64 object-cover border-2 border-[lightgray]'
            />
          </div>
        </div>

        {/* <div>
          <div className='flex flex-row gap-2 border'>
            <img
              src="https://cdn.iconscout.com/icon/free/png-256/codeforces-3628695-3029920.png"
              alt="Codeforces Icon"
              style={{ width: "100px", height: "100px" }}
            />
            <img
              src="https://cdn.iconscout.com/icon/free/png-256/leetcode-3521542-2944960.png"
              alt="LeetCode Icon"
              style={{ width: "100px", height: "100px" }}
            />
            <a href="https://imgbb.com/"><img src="https://i.ibb.co/5hRsGmx/atcoder.png" alt="atcoder" border="0" /></a>
            <a href="https://ibb.co/58gXrVc"><img src="https://i.ibb.co/0MRpC3J/codechef.jpg" alt="codechef" border="0" /></a>
          </div>
        </div> */}
        <div>
          <div
            className="flex flex-row gap-2 border p-4 justify-center items-center"
            style={{ flexWrap: "nowrap", overflowX: "auto" }}
          >
            {user && user.cf && (            
            <a href={`https://codeforces.com/profile/${user.cf}`}>
              <img
                src="https://cdn.iconscout.com/icon/free/png-256/codeforces-3628695-3029920.png"
                alt="Codeforces Icon"
                className="w-16 h-16"
              />
            </a>
            )}

            {user && user.leetcode && (
            <a href={`https://leetcode.com/u/${user.leetcode}/`}>
              <img
                src="https://cdn.iconscout.com/icon/free/png-256/leetcode-3521542-2944960.png"
                alt="LeetCode Icon"
                className="w-16 h-16 rounded-full"
                />
            </a>
            )}
            {user && user.atcoder && (
            <a href={`https://atcoder.jp/users/${user.atcoder}`}>
              <img
                src="https://i.ibb.co/5hRsGmx/atcoder.png"
                alt="atcoder"
                className="w-16 h-16 rounded-full"
              />
            </a>
            )}
            {user && user.cc && (
            <a href={`https://www.codechef.com/users/${user.cc}`}>
              <img
                src="https://i.ibb.co/0MRpC3J/codechef.jpg"
                alt="codechef"
                className="w-16 h-16 rounded-full"
              />
            </a>
            )}     
            {user && user.gfg && (           
            <a href={`https://www.geeksforgeeks.org/user/${user.gfg}`}>
              <img 
                src="https://i.ibb.co/w4WYTN0/gfg.png" 
                alt="gfg" 
                className="w-16 h-16 rounded-full"
              />
            </a>
            )}
            {
              user && !user.cf && !user.cc && !user.leetcode && !user.atcoder && !user.gfg && (
                <img src="https://i.ibb.co/VxgxtKG/noob.jpg" alt="noob" border="0" className="w-24 h-14 "/>
              )
            }
          </div>
        </div>

        
      </div>

    </div>
  );
}
