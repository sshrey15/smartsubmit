import React from 'react'
import Image from 'next/image'

const Animation = () => {
  return (
    <>
       <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Image src="/shub_gif.gif" alt="Centered Animation GIF" width={300} height={300} />
    </div>

    </>
  )
}

export default Animation