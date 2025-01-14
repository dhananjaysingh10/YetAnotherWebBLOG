import React from 'react'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {

  const [formData, setFormData] = useState({});

  // const [errorMessage, setErrorMessage] = useState(null);

  // const [loading, setLoading] = useState(false);

  const {loading, error: errorMessage} = useSelector(state => state.user);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleChange =(e)=>{
    // console.log(e.target.value);
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  }

  const handleSubmit = async (e)=> {
    e.preventDefault();
    if(!formData.email || !formData.password) {
      return dispatch(signInFailure('All fields are required'));
    }
    try {
      // setLoading(true);
      // setErrorMessage(null);
      dispatch(signInStart());
      const res = await fetch('api/auth/signin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),

      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(signInFailure("Email or Password incorrect"));
        // setLoading(false);
        // return setErrorMessage("Email or Password incorrect");
        // return setErrorMessage(data.message); to complex to diaplay
      }
      // setLoading(false);
      if(res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      // setErrorMessage("Someting went wrong");
      // setLoading(false);
      dispatch(signInFailure("Someting went wrong"));
    }
  }
  // console.log(formData);
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-96 mx-auto flex-col md:flex-row md:items-center'>
         {/* left side */}
          {/* <div className=''>
          <Link to="/" className="self-center whitespace-nowrap text-lg sm:text-2xl font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-l from-[#fb7185] via-   [#a21caf] to-[#6366f1] rounded-lg text-white">CP </span>
            Blog
          </Link>
          </div> */}
          {/* right side */}
          <div className='flex-1'>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

              <div>
                <Label value='Email'/>
                <TextInput
                  type='email'
                  placeholder='name@company.com'
                  id='email'
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value='Password'/>
                <TextInput
                  type='password'
                  placeholder='password'
                  id='password'
                  onChange={handleChange}
                />
              </div>
              <Button className='text-white bg-gradient-to-r from-gray-600 to-gray-900' type='submit' disabled={loading}>
                {
                loading ? (
                  <>
                  <Spinner size = 'sm'/>
                  <span className='pl-3'>Loading...</span>
                  </>
                ) : "Sign In"
                }
              </Button>
              <OAuth/>
            </form>
            <div className='flex gap-2 text-sm mt-5'>
              <span>Dont have an account?</span>
              <Link to='/sign-up' className='text-blue-600'>Sign Up</Link>
            </div>
            {
              errorMessage && (
                <Alert className='mt-5' color='failure'>
                  {errorMessage}
                </Alert>               
              )
            }
          </div>
      </div>
    </div>
  )
}
