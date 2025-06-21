import { cn } from '@/lib/utils'
import React from 'react'

export default function SectionContainer({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex flex-col w-full mx-auto md:w-xl lg:w-2xl xl:w-4xl", className)}>
      {children}
    </div>
  )
}