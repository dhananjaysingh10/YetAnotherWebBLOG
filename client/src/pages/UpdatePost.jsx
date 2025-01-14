import { TextInput, Select, FileInput, Button, Alert } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Client, Storage, ID, ImageGravity } from "appwrite";
import {useParams, useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux';

export default function UpdatePost() {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const {currentUser} = useSelector((state) => state.user)
  const {postId} = useParams();
  const navigate = useNavigate();


  useEffect(()=>{
      try {
        const fetchPost = async () => {
            const res = await fetch(`/api/post/getposts?postId=${postId}`);
            const data = await res.json();
            if(!res.ok){
                console.log(data.message);
                setPublishError(data.message);
                return;
            }
            if(res.ok) {
                setPublishError(null);
                // const post = data.posts[0];
                // console.log(post.image);
                // setFormData({
                //     title: post.title,
                //     category: post.category,
                //     content: post.content,
                //     image: post.image || null, // Ensure image is set, even if null
                // });
                // console.log(formData.image, '*');
                setFormData(data.posts[0]);
                setImageFileURL(data.posts[0].image);
                // console.log(formData.image, '*/*');
            }
        };
        fetchPost();
    } catch (error) {
        console.log(error);
    }
  }, [postId]);

  const client = new Client()
                .setEndpoint(import.meta.env.VITE_APPWRITE_API_END_POINT)
                .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
  const storage = new Storage(client);

  const handleImageChange = (e)=>{
    setImageFile(null);
    const file = e.target.files[0];
    if(file){
      setImageFile(file);
    }
    // console.log(imageFile, imageFileURL);
    // console.log(e.target.files[0]);
  }

  const uplaodImage = () => {
    setImageUploadError(null);
    setImageUploadSuccess(null);

    storage
        .createFile(import.meta.env.VITE_APPWRITE_BUCKET_ID, ID.unique(), imageFile)
        .then((response) => {
            return storage.getFilePreview(import.meta.env.VITE_APPWRITE_BUCKET_ID, response.$id);
        })
        .then((result) => {
            setImageFileURL(result.href);
            setFormData((prevFormData) => ({ ...prevFormData, image: result }));
            setImageFile(null);
            setImageUploadSuccess("Image uploaded!");
        })
        .catch((error) => {
            console.error("Image upload failed", error);
            setImageUploadError(error.message);
            setImageUploadSuccess(null);
        });
    };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // console.log(formData);
        // console.log(currentUser._id);
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers:{
          'content-type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(!res.ok) {
          setPublishError(data.message);
          return;
      }
      if(res.ok) {
        // {console.log('ok', data.savedPost.slug)}
        // console.log('ok')
        // console.log(data)
        setPublishError(null);
        navigate(`/post/${data.slug}`);
        return;
      }
    } catch (error) {
      setPublishError('something went wrong**');
    }
  }
// const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//         const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
//             method: 'PUT',
//             headers: {
//                 'content-type': 'application/json',
//             },
//             body: JSON.stringify(formData),
//         });

//         if (!res.ok) {
//             // If response is not ok, throw an error to be caught in catch block
//             const errorData = await res.json();
//             throw new Error(errorData.message || 'Failed to update post');
//         }

//         const data = await res.json();

//         // Navigate if everything is successful
//         navigate(`/post/${data.savedPost.slug}`);
//     } catch (error) {
//         console.error('Error updating post:', error);
//         setPublishError(error.message || 'Something went wrong**');
//     }
// };


  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>
        Update Post
      </h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput type='text' placeholder='Title..' required id='title' className='flex-1' onChange={(e) => setFormData({...formData, title: e.target.value})} value={formData.title}/>
          <Select  onChange={(e) => setFormData({...formData, category: e.target.value})} value={formData.category}>
            <option value="uncategorized">Select a category</option>
            <option value="template">Template</option>
            <option value="artical">Article</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' accept='image/*' onChange={handleImageChange}/>
          <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={uplaodImage}>Upload Image</Button>
        </div>
        {
          imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>
        }
        {/* {
          formData.image === undefined && <Alert color='failure'>undefined</Alert>
        } */}
        {
          imageUploadSuccess && <Alert color='success'>{imageUploadSuccess}</Alert>
        }
        {
          (formData.image || imageFileURL) && (
            <img src = {formData.image || imageFileURL} alt='upload' className='w-full h-72 object-cover' />
          )
        }
        <ReactQuill theme='snow' placeholder='write here...' className='h-72 mb-16' required  onChange={(value) => setFormData({...formData, content: value})} value={formData.content}/>
        <Button type='submit' className='text-white bg-gradient-to-r from-gray-600 to-gray-900 '>Update Post</Button>
        {
          publishError && <Alert color='failure' className='mt-5'>{publishError}</Alert>
        }
      </form>
    </div>
  )
}
