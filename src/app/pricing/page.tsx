import React from 'react'
import Pricing from './Pricing'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | LearnPDF',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  }
};

export default function PricingPage() {
  return (
    <Pricing />
  )
}
