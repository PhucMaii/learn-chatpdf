import React from 'react'
import { TriangleAlertIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
    text: string;
}

const SubscriptionBanner = ({text}: Props) => {

  return (
    <div className="w-full h-10 ">
        <div
            className={`flex items-center gap-1 rounded-lg bg-yellow-200 text-yellow-800 py-1 px-4 w-full`}
        >
      <TriangleAlertIcon className="text-yellow-800" />
      <h6
        className={`text-sm text-yellow-800 font-bold items-center w-fit`}
      >
        {text}! but don&apos;t worry! <Link className="underline text-blue-500" href="/pricing">Upgrade now</Link> to continue adding more chats and exploring more advanced features.
      </h6>
    </div>
    </div>
  )
}

export default SubscriptionBanner