import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Table, TableBody, Modal } from 'flowbite-react';
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {FaCheck, FaTimes} from 'react-icons/fa'

export default function DashboardUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [reloadPage, setReloadPage] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length === data.totalUsers) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
        fetchUsers();
    }
  }, [currentUser._id, reloadPage])
  // }, [currentUser._id, sortOrder, searchTerm, ])
  // console.log(userPosts);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteUser = async () => {
        setShowModal(false);
        setReloadPage(true);
        try {
          const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
            method: 'DELETE',
          });
          const data = res.json();
          if(!res.ok) {
            console.log(data.message);
          } else {
            setReloadPage(false);
            setUsers((prev) => 
              prev.filter((user) => user._id !== userIdToDelete)
            );
            setUserIdToDelete('');
          }
        } catch (error) {
          console.log(error.message);
        }
  };
// const handleDeleteUser = async () => {}

  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3">
      {currentUser.isAdmin && users.length > 0 ?
        (
          <div>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date Created</Table.HeadCell>
                <Table.HeadCell>User Image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {users.map((user) => (
                <Table.Body className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800 border-b'>
                    {/* <Table.Cell>{new Date(post.updatedAt).toLocaleTimeString()}</Table.Cell> */}
                    <Table.Cell>
                      <div className='flex flex-col gap-2'>
                        <span className="text-lg font-semibold">{new Date(user.createdAt).toLocaleDateString()} </span>
                        <span className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell><img src={user.profilePicture} alt={user.username} className='h-10 w-10 object-cover bg-gray-500 rounded-full' /></Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.isAdmin ? <FaCheck className='text-green-500'/> : <FaTimes className='text-red-500'/>}</Table.Cell>
                    <Table.Cell>
                      <span className='text-red-500 hover:underline cursor-pointer' onClick={()=>{
                          setShowModal(true);
                          setUserIdToDelete(user._id);
                      }}>
                        Delete
                      </span>
                    </Table.Cell>
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
          <p>No users available</p>
        )}
        <Modal show={showModal} onClose={()=>setShowModal(false)}
          popup
          size='md'
        >
            <Modal.Header/>
            <Modal.Body>
              <div className='text-center flex flex-col'>
                  <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                  <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Delete User</h3>
                  <div className='flex justify-center gap-4'>
                      <Button color='failure' onClick={handleDeleteUser}>
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
