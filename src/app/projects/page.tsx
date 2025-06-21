import Projects from './Projects';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | LearnPDF ',
};

export default function ProjectsPage() {
  return <Projects />;
}
