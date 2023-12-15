import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder='Username' className='border p-3 rounded-full' id='username' />
        <input type="email" placeholder='Email' className='border p-3 rounded-full' id='email' />
        <input type="password" placeholder='Password' className='border p-3 rounded-full' id='password' />
        <button className="text-white bg-purple-800 p-3 rounded-full uppercase hover:opacity-95">Sign Up</button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-purple-700'>Sign in</span>
        </Link>
      </div>
    </div>
  )
}
