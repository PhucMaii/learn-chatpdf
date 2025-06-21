import React from 'react'
import Pricing from './Pricing'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | LearnPDF',
};

export default function PricingPage() {
  return (
    <Pricing />
  )
}
