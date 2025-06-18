import React from 'react'

export default function SectionContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full mx-auto md:w-xl lg:w-2xl xl:w-4xl">
      {children}
    </div>
  )
}