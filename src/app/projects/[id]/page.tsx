import ProjectDetails from './ProjectDetails';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const id = params.id;
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/project?id=${id}`, {
      cache: 'no-store', // optional
    });
    const project = await res.json();
  
    return {
      title: `Project ${project?.data?.title || 'Details'}`,
    };
  }

export default function ProjectDetailsPage() {
  return <ProjectDetails />;
}
