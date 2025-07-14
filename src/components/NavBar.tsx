'use client';
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import React, { useContext, useEffect, useCallback, memo } from 'react';
import { Button } from './ui/button';
import { UserContext } from '../../context/UserProvider';
import NavDialog from './Dialogs/NavDialog';
import { m } from 'framer-motion';
import useLocalStorage from '../../hooks/useLocalStorage';
import axios from 'axios';
import Image from 'next/image';
import { useIsMobile, useReducedMotion } from '@/hooks/use-mobile';
import { ArrowRight, Sparkles, Zap, User } from 'lucide-react';

const NavBar = memo(() => {
  const { user, setUser, isInitializing }: any = useContext(UserContext);
  const { user: clerkUser } = useUser();
  const [guestSession, setGuestSession, isInitialized] = useLocalStorage(
    'guest-session',
    {},
  );
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  const fetchGuestSessionId = useCallback(async () => {
    if (isInitializing || !isInitialized) return;

    try {
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

      // If we have a session, verify it only if user is not already set
      if (!user) {
        const response = await axios.get(
          `/api/guest?guestSessionId=${guestSession.sessionId}&guestSessionSignature=${guestSession.signature}`,
        );

        if (response.data.error) {
          throw new Error('Something went wrong. ', response.data.error);
        }

        setUser(response.data.data);
      }
    } catch (error: any) {
      console.error(
        'Something went wrong. Fail to fetch guest session id: ',
        error,
      );
    }
  }, [
    isInitializing,
    isInitialized,
    user,
    guestSession,
    setGuestSession,
    setUser,
  ]);

  useEffect(() => {
    fetchGuestSessionId();
  }, [fetchGuestSessionId]);

  // Simplified animation variants optimized for performance
  const navbarVariants = {
    hidden: {
      opacity: 0,
      y: isMobile ? 0 : -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile || prefersReducedMotion ? 0.2 : 0.4,
        ease: 'easeOut',
      },
    },
  };

  const MotionWrapper = isMobile || prefersReducedMotion ? 'div' : m.div;
  const motionProps =
    isMobile || prefersReducedMotion
      ? {}
      : {
          variants: navbarVariants,
          initial: 'hidden',
          animate: 'visible',
        };

  return (
    <MotionWrapper {...motionProps}>
      {/* Backdrop blur effect for modern look */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 w-full max-w-7xl mx-auto">
          {/* Logo Section - Optimized for mobile */}
          <Link href={'/'} className="flex items-center gap-2 md:gap-3 group">
            <div className="relative">
              <Image
                width={32}
                height={32}
                alt="LearnPDF Logo"
                src="/images/logo.png"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full transition-transform duration-300 group-hover:scale-110"
                loading="eager"
                priority
              />
              {/* Subtle glow effect on desktop */}
              <div className="hidden md:block absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-emerald-600 font-bold text-lg md:text-xl leading-tight">
                LearnPDF
              </h1>
              <span className="hidden md:block text-[10px] text-gray-500 leading-none">
                AI-Powered Learning
              </span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <NavDialog />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-6">
            {/* Navigation Links */}
            <div className="flex items-center gap-4 lg:gap-6">
              <Link
                href={clerkUser ? '/projects' : '/sign-in'}
                className="relative text-gray-700 hover:text-emerald-600 font-medium text-sm lg:text-base transition-all duration-300 group"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Dashboard
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link
                href="/pricing"
                className="relative text-gray-700 hover:text-emerald-600 font-medium text-sm lg:text-base transition-all duration-300 group"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Pricing
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              {clerkUser ? (
                <div className="flex items-center gap-3">
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-xs text-gray-500">Welcome back</span>
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                      {clerkUser.firstName || 'User'}
                    </span>
                  </div>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          'w-8 h-8 md:w-9 md:h-9 rounded-full ring-2 ring-emerald-100 hover:ring-emerald-200 transition-all duration-300',
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/sign-in">
                    <Button
                      variant="ghost"
                      className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 font-medium px-3 py-2 rounded-lg transition-all duration-300"
                      name="sign-in"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                      name="get-started"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </MotionWrapper>
  );
});

NavBar.displayName = 'NavBar';

export default NavBar;
