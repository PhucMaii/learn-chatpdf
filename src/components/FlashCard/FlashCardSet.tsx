import { ChevronsRight } from 'lucide-react'
import React from 'react'

type Props = {
  flashCardSetWithChat: any
}


const FlashCardSet = ({flashCardSetWithChat}: Props) => {
  return (
    <div className="w-full flex flex-col p-4 border-dashed border-2 rounded-3xl border-emerald-500">
      <div className="flex items-center">
        <h6 className="text-md flex-[8] font-bold text-emerald-500">{flashCardSetWithChat.flashCardSet?.title}</h6>
        <ChevronsRight className="flex-[1] w-8 h-8 text-emerald-500" />
      </div>

      <div className="p-2 bg-gray-200 rounded-xl w-fit mt-2">
        <h6 className="text-sm text-gray-600 font-bold">20 questions</h6>
      </div>

      <div className="mt-4">
        <h6 className="text-sm text-gray-600 font-bold">Created with {flashCardSetWithChat.chat.pdfName}</h6>
      </div>

    </div>
  )
}

export default FlashCardSet