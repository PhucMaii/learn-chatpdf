import React from 'react'
import SectionContainer from '../SectionContainer'
import Quiz from '../Quiz/Quiz'

export default function Quizzes() {
  return (
    <SectionContainer>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 items-center">
          <h1 className="text-2xl font-semibold justify-center">
            Psychology Quizzes
          </h1>
          <h4 className="text-sm font-medium text-gray-600">
            Question 10 of 12
          </h4>
        </div>

        <div className="flex gap-4">
          {/* Quiz Content Section */}
          <div className="flex-1">
            <div className="flex flex-col gap-4">
              <Quiz />
              <Quiz />
              <Quiz />
              <Quiz />
            </div>
          </div>

          {/* Question Numbers Grid - Sticky Sidebar */}
          <div className="flex-shrink-0">
            <div className="sticky top-4 border border-gray-200 rounded-lg p-4 h-fit">
              <div className="grid grid-cols-3 gap-1">
                <div className="bg-gray-100 rounded-md p-2 text-center text-sm font-medium">1</div>
                <div className="bg-gray-100 rounded-md p-2 text-center text-sm font-medium">2</div>
                <div className="bg-gray-100 rounded-md p-2 text-center text-sm font-medium">3</div>
                <div className="bg-gray-100 rounded-md p-2 text-center text-sm font-medium">4</div>
                <div className="bg-gray-100 rounded-md p-2 text-center text-sm font-medium">5</div>
                <div className="bg-gray-100 rounded-md p-2 text-center text-sm font-medium">6</div>
                <div className="bg-gray-100 rounded-md p-2 text-center text-sm font-medium">7</div>
                <div className="bg-gray-100 rounded-md p-2 text-center text-sm font-medium">8</div>
                <div className="bg-gray-100 rounded-md p-2 text-center text-sm font-medium">9</div>
                <div className="bg-gray-100 rounded-md p-2 text-center text-sm font-medium">10</div>
                <div className="bg-gray-100 rounded-md p-2 text-center text-sm font-medium">11</div>
                <div className="bg-gray-100 rounded-md p-2 text-center text-sm font-medium">12</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
