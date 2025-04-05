import React from 'react'
import toast from 'react-hot-toast'

export default function Error({error_mes}) {
    toast.error(error_mes)
    return (
        <>
            <div className=''>
                <p>{error_mes}</p>
            </div>
        </>
    )
}
