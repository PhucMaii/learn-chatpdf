import React from 'react'
import FlashCard from './FlashCard'


const FlashCardsTab = () => {
  return (
    <div className="w-full h-full">
        <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
            <h3 className="text-xl font-bold">Flash Cards</h3>
        </div>

        {/* flash card list */}
        <div className="flex justify-center items-center w-full h-full mt-8">
          <FlashCard />
        </div>
        
    </div>
  )
}

export default FlashCardsTab