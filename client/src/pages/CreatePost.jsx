import { TextInput, Select, FileInput, Button, Alert } from 'flowbite-react'
import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Client, Storage, ID, ImageGravity } from "appwrite";
import { use } from 'react';
import {Navigate, useNavigate} from 'react-router-dom'

export default function CreatePost() {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
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

  // const uplaodImage = async () => {
  //     setImageUploadError(null);
  //     setImageUploadSuccess(null);
  //     // setImageFile(null)
  //     let fileID;
  //     const promise = storage.createFile(
  //       import.meta.env.VITE_APPWRITE_BUCKET_ID,
  //       ID.unique(),
  //       imageFile
  //     );
  //     promise.then(function (r) {
  //       console.log(r); // Success
  //       console.log(r.$id); // file id
  //       fileID = r.$id;
  //       console.log(imageFileURL);
  //       const result = storage.getFilePreview(import.meta.env.VITE_APPWRITE_BUCKET_ID, fileID);
  //       // console.log(result);
  //       setImageFileURL(result);
  //       console.log(imageFileURL);
  //       setImageFile(null);
  //       setImageUploadSuccess("Image uploaded!!")
  //       setFormData({...formData, image: imageFileURL});
  //     }, function (error) {
  //       console.log(error); // Failure
  //         setImageUploadSuccess(null);
  //         setImageUploadError(error.message);
  //       });   
  // }

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
      const res = await fetch('/api/post/create', {
        method: 'POST',
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
        setPublishError(null);
        navigate(`/post/${data.savedPost.slug}`);
      }
    } catch (error) {
      setPublishError('something went wrong');
    }
  }

  
    // Configuration for the toolbar
    const modules = {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["link", "image"],
        ["clean"],
      ],
    };
  
    const formats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
    ];

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>
        Create Post
      </h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput type='text' placeholder='Title..' required id='title' className='flex-1' onChange={(e) => setFormData({...formData, title: e.target.value})}/>
          <Select  onChange={(e) => setFormData({...formData, category: e.target.value})}>
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
        {
          imageUploadSuccess && <Alert color='success'>{imageUploadSuccess}</Alert>
        }
        {
          formData.image && (
            <img src = {formData.image} alt='upload' className='w-full h-72 object-cover'/>
          )
        }
        <ReactQuill theme='snow' placeholder='write here...' className='h-72 mb-16' required  modules={modules}
        formats={formats} onChange={(value) => setFormData({...formData, content: value})}/>
        <Button type='submit' className='text-white bg-gradient-to-r from-gray-600 to-gray-900 '>Publish</Button>
        {
          publishError && <Alert color='failure' className='mt-5'>{publishError}</Alert>
        }
      </form>
    </div>
  )
}
