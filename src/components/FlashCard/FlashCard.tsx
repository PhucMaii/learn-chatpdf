import React, { useState } from 'react';
import '../../../styles/FlashCard.css'


const FlashCard = () => {
    const [side, setSide] = useState<"front" | "back">("front");

    const handleFlip = () => {
        setSide(side === "front" ? "back" : "front");
      };
        
  return (
    <div onClick={handleFlip} className='flex justify-center items-center w-[500px]'>
        <div className={`flipper ${side === "back" ? "flip" : ""}`}>
        {/* Front Side */}
        <div className="front flex justify-center items-center w-[500px] min-h-[300px] h-full bg-emerald-500 shadow-xl p-6 rounded-3xl border-2 border-emerald-500">
          <h6 className="text-xl text-white font-bold">What is the statement title</h6>
        </div>

        {/* Back Side */}
        <div className="back flex justify-center items-center w-[500px] min-h-[300px] h-full bg-blue-500 shadow-xl p-6 rounded-3xl border-2 border-blue-500">
          <h6 className="text-xl text-white font-bold">CIBC BANK STATEMENT</h6>
        </div>
      </div>
    </div>
  )
}

export default FlashCard