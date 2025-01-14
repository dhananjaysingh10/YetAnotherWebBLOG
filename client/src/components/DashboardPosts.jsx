import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Table, TableBody, Modal } from 'flowbite-react';
import { Link } from 'react-router-dom';
import {HiOutlineExclamationCircle} from 'react-icons/hi'

export default function DashboardPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const [reloadPost, setReloadPost] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length === data.totalPosts) {
            setShowMore(false);
          }
        }
        // console.log(data);
        // console.log(data.posts);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id, reloadPost])
  // }, [currentUser._id, sortOrder, searchTerm, ])
  // console.log(userPosts);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeletePost = async () => {
        setShowModal(false);
        setReloadPost(true);
        try {
          const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
            method: 'DELETE',
            
          });
          const data = res.json();
          if(!res.ok) {
            console.log(data.message);
          } else {
            setReloadPost(false);
            // setUserPosts((prev) => 
            //   prev.filter((post) => post._id !== postIdToDelete)
            // );
            setPostIdToDelete('');
          }
        } catch (error) {
          console.log(error.message);
        }
  };

  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3">
      {currentUser.isAdmin && userPosts.length > 0 ?
        (
          <div>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Post Image</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell><span>Edit</span></Table.HeadCell>
              </Table.Head>
              {userPosts.map((post) => (
                <Table.Body className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800 border-b'>
                    {/* <Table.Cell>{new Date(post.updatedAt).toLocaleTimeString()}</Table.Cell> */}
                    <Table.Cell>
                      <div className='flex flex-col gap-2'>
                        <span className="text-lg font-semibold">{new Date(post.updatedAt).toLocaleDateString()} </span>
                        <span className="text-sm text-gray-500">{new Date(post.updatedAt).toLocaleTimeString()}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell><Link to={`/post/${post.slug}`}><img src={post.image} alt={post.title} className='h-10 w-20 object-cover bg-gray-500' /></Link></Table.Cell>
                    <Table.Cell><Link to={`/post/${post.slug}`} className='text-gray-800 font-medium dark:text-gray-300'>{post.title}</Link></Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      <span className='text-red-500 hover:underline cursor-pointer' onClick={()=>{
                          setShowModal(true);
                          setPostIdToDelete(post._id);
                      }}>
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell><Link to={`/update-post/${post._id}`} className='text-teal-500 hover:underline'><span>Edit</span></Link></Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
            {
              showMore && (
                <button className='w-full text-gray-400 self-center text-sm py-7' onClick={handleShowMore}>Show More</button>
              )
            }
          </div>
        )
        :
        (
          <p>No posts available</p>
        )}
        <Modal show={showModal} onClose={()=>setShowModal(false)}
          popup
          size='md'
        >
            <Modal.Header/>
            <Modal.Body>
              <div className='text-center flex flex-col'>
                  <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                  <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Delete Post</h3>
                  <div className='flex justify-center gap-4'>
                      <Button color='failure' onClick={handleDeletePost}>
                        Yes
                      </Button>
                      <Button color='success' onClick={()=>setShowModal(false)}>
                        No
                      </Button>
                  </div>
              </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}
