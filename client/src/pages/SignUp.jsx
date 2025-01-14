import React from 'react'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import OAuth from '../components/OAuth';

export default function SignUp() {

  const [formData, setFormData] = useState({});

  const [errorMessage, setErrorMessage] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange =(e)=>{
    // console.log(e.target.value);
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  }

  const handleSubmit = async (e)=> {
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('All fields are required.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('api/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),

      });
      const data = await res.json();
      if(data.success === false) {
        setLoading(false);
        return setErrorMessage("username or email already exist");
        // return setErrorMessage(data.message); to complex to diaplay
      }
      setLoading(false);
      if(res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage("Someting went wrong");
      setLoading(false);
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
                <Label value='Username'/>
                <TextInput
                  type='text'
                  placeholder='username'
                  id='username'
                  onChange={handleChange}
                />
              </div>

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
                ) : "Sign Up"
                }
              </Button>
              <OAuth/>
            </form>
            <div className='flex gap-2 text-sm mt-5'>
              <span>Have an account?</span>
              <Link to='/sign-in' className='text-blue-600'>Sign In</Link>
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
