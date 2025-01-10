'use client';
import SidebarWrapper from '@/components/SidebarWrapper'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

export default function HelpPage() {
  const [submitForm, setSubmitForm] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/contact-us', {
        name: `${submitForm.firstName} ${submitForm.lastName}`,
        email: submitForm.email,
        message: submitForm.message
      });

      if (response.data.error) {
        toast.error('An error occurred while sending the message. Please try again later.');
        setIsLoading(false);
        return;
      }

      toast.success(response.data.message);
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('An error occurred while sending the message. Please try again later.');
      setIsLoading(false);
    }
  }

  return (
    <SidebarWrapper>
      <h1 className="text-3xl text-center">Contact Us</h1>
      <h4 className="text-md text-gray-500 font-bold mt-2 text-center">
        We&apos;re here to help you out!
      </h4>

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col gap-2">
          <h4>Full Name</h4>
          <div className="flex flex-row gap-2 items-center">
            <Input 
              className="flex-[1]" 
              placeholder="Enter your first name..."
              value={submitForm.firstName}
              onChange={(e) => setSubmitForm((prevState: any) => ({ ...prevState, firstName: e.target.value }))}
            />
            <Input 
              className="flex-[1]" 
              placeholder="Enter your last name..." 
              aria-label="Last Name" 
              value={submitForm.lastName}
              onChange={(e) => setSubmitForm((prevState: any) => ({ ...prevState, lastName: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h4>Email</h4>
          <Input 
            className="flex-[1]" 
            placeholder="Enter your email here..." 
            aria-label="Email" 
            value={submitForm.email}
            onChange={(e) => setSubmitForm((prevState: any) => ({ ...prevState, email: e.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h4>Message</h4>
          <Textarea 
            className="flex-[1]" 
            placeholder="Enter your message here..." 
            aria-label="Message" 
            value={submitForm.message}
            onChange={(e) => setSubmitForm((prevState: any) => ({ ...prevState, message: e.target.value }))}
          />
        </div>

        <Button onClick={handleSendMessage} className="w-full font-bold text-lg" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Message'}
        </Button>
        </div>
    </SidebarWrapper>
  )
}
