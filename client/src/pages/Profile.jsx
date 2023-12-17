import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'

export default function Profile() {
  const fileRef = useRef(null)
  const { currentUser } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePercent, setFilePercent] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  console.log(formData)

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


  return (
    <div>
      <div>Profile</div>
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form className='flex flex-col gap-4'>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileRef} hidden accept='image/*' />
          <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 hover:opacity-95' />
          <p className='text-sm self-center'>{fileUploadError ? (<span className='text-red-700'>Error occurred. Image should be less than 2MB</span>) : filePercent > 0 && filePercent < 100 ? (<span className='text-purple-800'>{`Uploading ${filePercent}%`}</span>) : filePercent === 100 ? (<span className='text-green-600'>Image uploaded.</span>) : ('')}</p>
          <input type="text" placeholder='Username' id='username' className='border p-3 rounded-full' />
          <input type="email" placeholder='Email' id='email' className='border p-3 rounded-full' />
          <input type="text" placeholder='Password' id='password' className='border p-3 rounded-full' />
          <button className='bg-purple-800 text-white rounded-full p-3 uppercase hover:opacity-95 disabled:opacity-80'>update</button>

        </form>
        <div className="flex justify-between mt-5">
          <span className='text-red-700 cursor-pointer'>Delete account</span>
          <span className='text-red-700 cursor-pointer'>Sign out</span>
        </div>
      </div>
    </div>
  )
}