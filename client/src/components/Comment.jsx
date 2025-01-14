import React, { useState, useEffect } from 'react';
import {FaThumbsUp} from 'react-icons/fa'
import moment from 'moment';
import {useSelector} from 'react-redux'
import {Textarea, Button} from 'flowbite-react'
import { set } from 'mongoose';
import { Link } from 'react-router-dom';

export default function Comment({comment, onLike, onEdit, onDelete}) {
    const [user, setUser] = useState({});
    const [userColor, setUserColor] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const { currentUser } = useSelector((state) => state.user);
    
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if(res.ok) {
                    setUser(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        }        
        getUser();
    }, [comment])

    const getUserColor = async () => {
      if (user.cf) {
        const cfResponse = await fetch(`https://codeforces.com/api/user.info?handles=${user.cf}`);
        const cfResult = await cfResponse.json();
        if (cfResult.status === 'OK') {
          const rating = cfResult.result[0].rating;
          console.log(rating);
          if (rating < 1200) { setUserColor('#808080')}
          else if (rating < 1400) { setUserColor('#008000') }
          else if (rating < 1600) { setUserColor('#03A89E') }
          else if (rating < 1900) { setUserColor('#0000ff') }
          else if (rating < 2100) { setUserColor('#a0a')    }        
          else if (rating < 2300) { setUserColor('#FF8C00') }
          else if (rating < 2400) { setUserColor('#FF8C00') }
          else if (rating < 2600) { setUserColor('#ff0000') }
          else if (rating < 2600) { setUserColor('#ff0000') }
          else if (rating < 3000) { setUserColor('#ff000' )}
          else if (rating < 4000) { setUserColor('#ff0000') }
        } else {
          console.error('Failed to fetch CF data:', cfResult.comment);
        }
      }
    }

    useEffect(() => {
      if (user && user.cf) {
          getUserColor();
      }
  }, [user]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    }

    const handleSave = async () => {
        try {
          const res = await fetch(`/api/comment/editComment/${comment._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: editedContent,
            }),
          });
          if (res.ok) {
            setIsEditing(false);
            onEdit(comment, editedContent);
          }
        } catch (error) {
          console.log(error.message);
        }
    };

  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-xs'>
        <div className='flex-shrink-0 mr-3'>
            <img src={user.profilePicture} alt='' className='w-5 h-5 rounded-full bg-gray-600'/>
        </div>
        <div className='flex-1'>
            <div className='flex items-center mb-1'>
                <span className='text-xs font-bold mr-1 truncate ' style={{ color: userColor || 'gray' }}>
                <Link to={`/profile/${user.username}`}>
                  {user ? `${user.username}` : 'Deleted user'}
                  </Link>
                </span>
                <span className='text-xs text-gray-500'>{moment(comment.createdAt).fromNow()}</span>
            </div>
            { isEditing ? (
                <>
                <Textarea
                  className='mb-2'
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <div className='flex justify-end gap-2 text-xs'>
                  <Button
                    type='button'
                    size='sm'
                    gradientDuoTone='purpleToBlue'
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    gradientDuoTone='purpleToBlue'
                    outline
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : 
            (
                <>
                <p className='text-gray-500 mb-2'>{comment.content}</p>
                <div className='flex items-center pt-2 text-xs gap-2'>
                    <button type='button' className={`text-gray-400     hover:text-blue-500 ${currentUser && comment.likes. includes(currentUser._id) && '!text-blue-500'} `}    onClick={()=>onLike(comment._id)}><FaThumbsUp  className='text-sm'/></button>
                    <p className='text-gray-500'>
                        {
                            comment.numberOfLikes > 0 && comment.   numberOfLikes + " " + (comment.numberOfLikes ===   1 ? "like" : "likes")
                        }
                    </p>
                    {
                        currentUser && (currentUser._id === comment.    userId || currentUser.isAdmin) && (
                            <button 
                            type='button' 
                            onClick={handleEdit}
                            className='text-gray-500 hover:text-blue-500'>
                                Edit
                            </button>
                        )
                    }
                    {
                        currentUser && (currentUser._id === comment.    userId || currentUser.isAdmin) && (
                            <button 
                            type='button' 
                            onClick={() => onDelete(comment._id)}
                            className='text-gray-500 hover:text-red-500'>
                                Delete
                            </button>
                        )
                    }
                </div>
                </>
            )}
            
        </div>
    </div>
  )
}
