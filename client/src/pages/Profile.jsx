import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserStart, signoutUserSuccess, signoutFailure } from '../redux/user/userSlice.js'

export default function Profile() {
  const fileRef = useRef(null)
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePercent, setFilePercent] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch()
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([])
  const [showListingError, setshowListingError] = useState(false)
  // console.log(formData)

  // console.log(file)
  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const filename = new Date().getTime() + file.name
    const storageRef = ref(storage, filename)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      // console.log('Uploaded ' + progress + '%')
      setFilePercent(Math.round(progress))
    },
      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) =>
            setFormData({ ...formData, avatar: downloadURL }),
          );
      }
    );
  }

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  const handleSignout = async () => {
    try {
      dispatch(signoutUserStart())
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      if (data.success === false) {
        dispatch(signoutFailure(data.message))
        return;
      }
      dispatch(signoutUserSuccess(data))
    } catch (error) {
      dispatch(signoutFailure)
    }
  }
  const handleShowListings = async () => {
    try {
      setshowListingError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json();
      if (data.success === false) {
        setshowListingError(true)
        return
      }
      setUserListings(data)
    } catch (error) {
      setshowListingError(true)
    }
  }
  return (
    <div>
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileRef} hidden accept='image/*' />
          <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 hover:opacity-95' referrerPolicy="no-referrer" />
          <p className='text-sm self-center'>{fileUploadError ? (<span className='text-red-700'>Error occurred. Image should be less than 2MB</span>) : filePercent > 0 && filePercent < 100 ? (<span className='text-purple-800'>{`Uploading ${filePercent}%`}</span>) : filePercent === 100 ? (<span className='text-green-600'>Image uploaded.</span>) : ('')}</p>
          <input type="text" onChange={handleChange} defaultValue={currentUser.username} placeholder='Username' id='username' className='border p-3 rounded-full' />
          <input type="email" onChange={handleChange} defaultValue={currentUser.email} placeholder='Email' id='email' className='border p-3 rounded-full' />
          <input type="password" placeholder='Password' id='password' className='border p-3 rounded-full' />
          <button disabled={loading} className='bg-purple-800 text-white rounded-full p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'update'}</button>
          <Link className='bg-rose-700 text-white p-3 rounded-full uppercase text-center hover:opacity-05' to={'/create-listing'}>create listing</Link>
        </form>
        <div className="flex justify-between mt-5">
          <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
          <span onClick={handleSignout} className='text-red-700 cursor-pointer'>Sign out</span>
        </div>
        <p className='text-red-700 mt-5'>{error ? error : ''}</p>
        <p className='text-green-700 mt-5'>
          {updateSuccess ? 'User is updated successfully!' : ''}
        </p>
        <button onClick={handleShowListings} className='text-green-700 w-full'>Show listings</button>
        <p className='text-red-700 mt-5'>{showListingError ?
          'Error in showing listings' : ''}</p>
        {userListings && userListings.length > 0 &&
          <div className='flex flex-col gap-4'>
            <h1 className='font-semibold mt-7 text-2xl text-center'>Your listings</h1>
            {userListings.map((listing) => (
              <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
                <Link to={`/listing/${listing._id}`}>
                  <img src={listing.imageUrls[0]} className='h-16 w-16 object-contain' alt="Listing image" />
                </Link>
                <Link to={`/listing/${listing._id}`} className='text-purple-800 font-semibold flex-1 hover:underline truncate'>
                  <p>{listing.name}</p>
                </Link>
                <div className='flex flex-col items-center'>
                  <button className='text-red-700 uppercase'>Delete</button>
                  <button className='text-green-700 uppercase'>Edit</button>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  )
}