import { Alert, Button, TextInput, Modal } from 'flowbite-react'
import React, { useState, useRef, useEffect } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Client, Storage, ID } from "appwrite";
import {HiOutlineExclamationCircle, HiPlusCircle} from 'react-icons/hi'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutSuccess, updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function DashboardProfile() {
  const {currentUser, error, loading} = useSelector((state) => state.user)
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_API_END_POINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
  const storage = new Storage(client);

  // console.log(currentUser.profilePicture); 

  const handleImageChange = (e)=>{
    const file = e.target.files[0];
    if(file){
      setImageFile(file);
    }
    // console.log(imageFile, imageFileURL);
    // console.log(e.target.files[0]);
  }

  useEffect(()=>{
    if(imageFile){
      uplaodImage();
    }
  },[imageFile]);

  const uplaodImage = async () => {
    setImageUploadError(null);
    const promise = storage.createFile(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        ID.unique(),
        imageFile
    );
    let fileID;
    promise.then(function (r) {
        // console.log(r); // Success
        // console.log(r.$id); // file id
        fileID = r.$id;
        const result = storage.getFilePreview(import.meta.env.VITE_APPWRITE_BUCKET_ID, fileID);
        setImageFileURL(result);
        setImageFile(null);
        setFormData({...formData, profilePicture: imageFileURL});
      }, function (error) {
        console.log(error); // Failure
        setImageUploadError(error);
      });   
  }

  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(!res.ok) {
        dispatch(deleteUserFailure(data.message));  
      }
      else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));      
    }
  }

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
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(Object.keys(formData).length === 0){
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch (`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),

      });
      const data = await res.json();
      if(!res.ok) {
        dispatch(updateFailure(data.message));
        return;
      }
      else {
        dispatch(updateSuccess(data));
        return;
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Hi, {currentUser.username}</h1>
      <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
        <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
        <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>filePickerRef.current.click()}>
            <img src={imageFileURL || currentUser.profilePicture} alt='user'
            className='rounded-full w-full h-full object-cover border-8     border-[lightgray]'
            />
        </div>
        {imageUploadError && <Alert color='failure'> {imageUploadError} </Alert>}
        <TextInput
        type='text'
        id='username'
        placeholder='username'
        defaultValue={currentUser.username}
        onChange={handleChange}
        />
        <TextInput
        type='email'
        id='email'
        placeholder='email'
        defaultValue={currentUser.email}
        readOnly
        />
        {/* <TextInput
        type='password'
        id='password'
        placeholder='password'
        readOnly
        /> */}
        <Button type='submit' className='text-white bg-gradient-to-r from-gray-600 to-gray-900 ' outline disabled={loading}>
          {loading ? 'Loading' : 'Update'}
        </Button>
        {
          currentUser.isAdmin && (
            <div className='flex mx-auto item-center'>
            <Link to={'/create-post'}>
              <button
              type='button'
              
              className='w-full mt-5 bg-amber-400 text-black font-semibold hover:bg-amber-300 p-2 rounded-lg'
              >
                <div className='flex items-center gap-2'><span><HiPlusCircle className='w-4 h-4'/></span> <span>Create a post</span></div>
              </button>
            </Link>
            </div>
          )
        }
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={()=>setShowModel(true)} className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>
      {error && (
        <Alert color='failure' className='mt-5'>{error}</Alert>
      )

      }
      <Modal show={showModel} onClose={()=>setShowModel(false)}
        popup
        size='md'
      >
          <Modal.Header/>
          <Modal.Body>
            <div className='text-center flex flex-col'>
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Delete Account</h3>
                <div className='flex justify-center gap-4'>
                    <Button color='failure' onClick={handleDeleteUser}>
                      Yes
                    </Button>
                    <Button color='success' onClick={()=>setShowModel(false)}>
                      No
                    </Button>
                </div>
            </div>
          </Modal.Body>
      </Modal>
    </div>
  )
}
