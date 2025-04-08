import React from 'react'

export default function BorderSection({children, className}: any) {
  return (
    <div className={`border-1 border-gray-300 rounded-lg p-4 ${className}`}>
        {children}
    </div>
  )
}
