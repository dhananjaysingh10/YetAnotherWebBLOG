import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Templates from './pages/Templates'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import FooterComponent from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import AdminOnlyPrivateRoute from './components/AdminOnlyPrivateRoute'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'
import PostPageT from './pages/PostPageT'
import ScrollToTop from './components/ScrollToTop'
import Search from './pages/Search'
import SearchT from './pages/SearchT'
import ProfilePage from './pages/ProfilePage'
import Blog from './pages/Blog'

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <Header/>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path='/blogs' element={<Blog />}></Route>
        <Route path='/templates' element={<Templates />}></Route>
        <Route element={<PrivateRoute/>}> 
          <Route path='/dashboard' element={<Dashboard />}></Route>
        </Route>
        <Route element={<AdminOnlyPrivateRoute/>}> 
          <Route path='/create-post' element={<CreatePost />}></Route>
          <Route path='/update-post/:postId' element={<UpdatePost />}></Route>
        </Route>
        
        <Route path='/sign-in' element={<SignIn />}></Route>
        <Route path='/sign-up' element={<SignUp />}></Route>
        <Route path='/post/:postSlug' element={<PostPage />}></Route>
        <Route path='/template/:postSlug' element={<PostPageT />}></Route>
        {/* <Route path='/search' element={<SearchT/>}></Route> */}
        <Route path='/search' element={<Search/>}></Route>
        <Route path='/profile/:username' element={<ProfilePage/>}></Route>
      </Routes>
      <FooterComponent/>
    </BrowserRouter>
  )
}
