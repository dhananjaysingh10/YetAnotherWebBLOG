import React, {useState, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import {useSelector, useDispatch} from 'react-redux';
import {toggleTheme} from '../redux/theme/themeSlice'
import { signoutSuccess } from '../redux/user/userSlice';

export default function Header() {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {theme} = useSelector(state => state.theme);
  const {currentUser} = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  // console.log(currentUser.profilePicture)
  // console.log(searchTerm);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
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

  const hadleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  return (
    <Navbar className="border-b-2">

      {/* <Link to="/" className="self-center whitespace-nowrap text-lg sm:text-2xl font-bold dark:text-white">
        <span className="px-2 py-1 bg-gradient-to-l from-[#fb7185] via-[#a21caf] to-[#6366f1] rounded-lg text-white">CP </span>
        Blog
      </Link> */}
      
      <Link to="/" className="self-center whitespace-nowrap text-lg sm:text-2xl font-bold dark:text-white">
        <div className='text-black flex dark:text-white'>
        <div className='my-1 mx-1'>
        YetAnother
        </div>
        <div className='my-1'>
        <span className="px-2 py-1 bg-gradient-to-r from-amber-400 to-amber-400 rounded-lg text-black">WebBLOG </span>
        </div>
        
        </div>
      </Link>

      <form className='order-2' onSubmit={hadleSubmit}>
        <TextInput
          type="text"
          placeholder="search"
          rightIcon={AiOutlineSearch}
          className="hidden md:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <Button className="w-12 h-10 md:hidden" color="gray">
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={()=>dispatch(toggleTheme())}>
          {(theme === 'light') ?
          <FaMoon /> :
          <FaSun/>}
        </Button>
        {
           currentUser ? 
           (
            
              <Dropdown
                arrowIcon={false}
                inline
                label = {
                  <Avatar
                  alt='user'
                  img={currentUser.profilePicture}
                  rounded
                  />
                }
              >
                <Dropdown.Header>
                  <span className='block text-lg font-bold'>Hi, {currentUser.username}</span>
                  <span className='block text-sm truncate'>{currentUser.email}</span>
                </Dropdown.Header>
                <Link to={'dashboard?tab=profile'}>
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider/>
                {/* <Link to={'dashboard?tab=profile'}> */}
                  <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
                {/* </Link> */}
              </Dropdown>
           ) : 
           (
             <Link to="/sign-in">
              <Button className="text-white     bg-gradient-to-r from-gray-600     to-gray-900" outline>
                Sign In
              </Button>
             </Link>
           )
        } 
        
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <div className="flex flex-col text-lg sm:flex-row gap-2 font-semibold">
          <Navbar.Link active={path === "/"} as={'div'}>
            <Link to="/" className={`block px-2 py-1 sm:py-0 ${path === '/' ? 'text-amber-400' : ''}`}>Home</Link>
          </Navbar.Link>
          <Navbar.Link className='' active={path === "/about"} as={'div'}>
            <Link to="/about" className={`block px-2 py-1 sm:py-0 ${path === '/about' ? 'text-amber-400' : ''}`}>About</Link>
          </Navbar.Link>
          <Navbar.Link className=''  active={path === "/projects" } as={'div'}>
            <Link to="/blogs" className={`block px-2 py-1 sm:py-0 ${path === '/blogs' ? 'text-amber-400' : ''}`}>Blogs</Link>
          </Navbar.Link>
          <Navbar.Link className='' active={path === "/templates"} as={'div'}>
            <Link to="/templates" className={`block px-2 py-1 sm:py-0 ${path === '/templates' ? 'text-amber-400' : ''}`}>Templates</Link>
          </Navbar.Link>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}
