'use client';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react';
import { Button } from './ui/button';
import { UserContext } from '../../context/UserProvider';
import NavDialog from './Dialogs/NavDialog';
import { motion } from 'framer-motion';
import useLocalStorage from '../../hooks/useLocalStorage';
import axios from 'axios';

type Props = {
  landingPage?: boolean;
};

const NavBar = ({ landingPage }: Props) => {
  const { user, setUser }: any = useContext(UserContext);
  const [guestSession, setGuestSession, isInitialized] = useLocalStorage(
    'guest-session',
    {},
  );

  useEffect(() => {
    if (isInitialized) {
      fetchGuestSessionId();
    }
  }, [isInitialized]);

  const fetchGuestSessionId = async () => {
    try {
      console.log('RUN FETCH GUEST SESSION ID');
      // Check if a guest session ID already exists in local storage
      if (!guestSession || Object.keys(guestSession).length === 0) {
        // Create new session since none exists
        const response = await axios.post(`/api/guest/session`);

        if (response.data.error) {
          throw new Error('Something went wrong. ', response.data.error);
        }

        setGuestSession({
          sessionId: response.data.guestSessionId,
          signature: response.data.guestSessionSignature,
        });
        return;
      }

      // If we have a session, verify it
      const response = await axios.get(
        `/api/guest?guestSessionId=${guestSession.sessionId}&guestSessionSignature=${guestSession.signature}`,
      );

      if (response.data.error) {
        throw new Error('Something went wrong. ', response.data.error);
      }

      if (response.data.data) {
        setUser(response.data.data);
      }
    } catch (error: any) {
      console.error(
        'Something went wrong. Fail to fetch guest session id: ',
        error,
      );
    }
  };

  const navbarVariants = {
    hidden: {
      opacity: 0,
      y: -50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div variants={navbarVariants} initial="hidden" animate="visible">
      <div className="flex items-center justify-between px-8 w-full">
        <div className="flex items-center gap-2">
          <Link href={'/'}>
            <img src="images/logo.png" className="w-10 h-10 rounded-full" />
          </Link>
          <h1 className="text-emerald-500 font-bold text-xl">LearnPDF</h1>
        </div>

        <div className="md:hidden flex">
          {/* <MenuIcon className="w-8 h-8 text-emerald-500" /> */}
          <NavDialog user={user || null} />
        </div>

        <div className="hidden md:flex items-center gap-8 mr-2">
          <Link
            href="/chats"
            className={`${landingPage ? 'text-white' : 'text-emerald-500'} font-semibold `}
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className={`${landingPage ? 'text-white' : 'text-emerald-500'} font-semibold hidden sm:block `}
          >
            Pricing
          </Link>
          {user && Object.keys(user).length > 0 ? (
            <UserButton />
          ) : (
            <Link className="text-white hidden md:block" href="/sign-in">
              <Button className="rounded-xl font-semibold text-md">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NavBar;
