import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState('')
    const onchange = (e) => {
        setMessage(e.target.value)
    }
    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`)
                const data = await res.json()
                setLandlord(data)
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchLandlord()
    }, [listing.userRef])

    return (
        <>{landlord && (
            <div>
                <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                <textarea name="message" id="message" rows="2" value={message} onChange={onchange} placeholder='Your message' className='p-3 rounded-lg border w-full'></textarea>
                <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}>
                    Send Mail
                </Link>
            </div>
        )}</>
    )
}
