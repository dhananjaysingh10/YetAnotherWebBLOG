import { Button } from 'flowbite-react'
import React from 'react'
import {useDispatch} from 'react-redux'
import {signInSuccess} from '../redux/user/userSlice';
import { AiFillGoogleCircle  } from 'react-icons/ai'
import { useNavigate} from 'react-router-dom';
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
import {app} from '../firebase.js'


export default function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt: 'select_account'});
        try {
            const resultFromGoogle = await signInWithPopup(auth, provider);
            // console.log(resultFromGoogle);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: resultFromGoogle.user.displayName,
                    email: resultFromGoogle.user.email,
                    googlePhotoUrl: resultFromGoogle.user.photoURL,
                }),
            })
            const data  = await res.json();
            if(res.ok){
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    }
  return (
//     <>
    <Button type='button' outline onClick={handleGoogleClick}>
    {/* // <Button type='button' outline > */}
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with google
    </Button>
    // </>
    
  )
}
