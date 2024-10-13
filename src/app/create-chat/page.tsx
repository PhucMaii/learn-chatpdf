import FileUpload from '@/components/FileUpload';
import NavBar from '@/components/NavBar';
import React from 'react';

const CreateChat = () => {

  return (
    <div className="p-8"> 
        <NavBar />

        <div className="flex flex-col items-center justify-center mt-32">
            <div className="flex flex-col items-center justify-center mt-8 gap-2 max-w-2xl">
                <h1 className="text-5xl font-bold text-center">Start a Chat</h1>
                <h6 className="text-xl font-semibold text-gray-400 text-center">
                    Let&apos;s enhance your reading skills and learning experience with our AI-powered PDF reader.
                </h6>
                <div className="w-full mt-4">
                    <FileUpload />
                </div>
            </div>

        </div>

    </div>
  )
}

export default CreateChat