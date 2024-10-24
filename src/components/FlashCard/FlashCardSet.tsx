import { ChevronRightIcon } from 'lucide-react'
import React from 'react'

type Props = {
    flashCardSet: any
}


const FlashCardSet = ({flashCardSet}: Props) => {
  return (
    <div className="flex flex-col p-4 border-dashed border-2 rounded-3xl border-emerald-500">
      <div className="flex justify-between items-center">
        <h6 className="text-xl font-bold text-white bg-emerald-500">{flashCardSet?.title}</h6>
        <ChevronRightIcon className="w-8 h-8 text-emerald-500" />
      </div>

    </div>
  )
}

export default FlashCardSet