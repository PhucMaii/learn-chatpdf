import React from 'react';

export default function Quiz() {
  return (
    <div className="flex flex-col gap-4 border border-gray-200 rounded-lg p-4">
      <h4 className="text-lg font-medium">1. What is the capital of France?</h4>
      <div className="flex flex-col justify-start gap-2">
        <button className="bg-gray-100 font-medium rounded-md px-3 py-2 text-left">
          Paris
        </button>
        <button className="bg-gray-100 font-medium rounded-md px-3 py-2 text-left">
          London
        </button>
        <button className="bg-gray-100 font-medium rounded-md px-3 py-2 text-left">
          Berlin
        </button>
        <button className="bg-gray-100 font-medium rounded-md px-3 py-2 text-left">
          Madrid
        </button>
      </div>
    </div>
  );
}
