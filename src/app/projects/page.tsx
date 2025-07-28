import Projects from './Projects';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | LearnPDF ',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  }
};

export default function ProjectsPage() {
  return <Projects />;
}
