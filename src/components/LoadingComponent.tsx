import { Loader2 } from 'lucide-react'
import React from 'react'

type Props = {}

const LoadingComponent = (props: Props) => {
  return (
    <div className="flex justify-center flex-col items-center h-full w-full">
        <Loader2 className="w-12 h-12 text-slate-400 animate-spin" />
    </div>
  )
}

export default LoadingComponent