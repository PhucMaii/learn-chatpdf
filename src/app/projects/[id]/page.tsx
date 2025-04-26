import ProjectDetails from './ProjectDetails';
import { Metadata } from 'next';

export async function generateStaticParams() {
  try {
    const allProjects = [];
    let offset = 0;
    const limit = 100;
    let moreData = true;

    while (moreData) {
      const res = await fetch(
        `https://learnpdf.ca/api/public/projects?limit=${limit}&offset=${offset}`,
      );

      if (!res.ok) break;

      const data = await res.json();

      allProjects.push(...data.projects);

      if (data.projects.length < limit) {
        moreData = false; // No more data
      } else {
        offset += limit;
      }
    }

    return allProjects.map((project: any) => ({
      id: project.id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return []; // Prevent build crash
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = params.id;
  try {
    const res = await fetch(`https://learnpdf.ca/api/public/project?id=${id}`);

    if (!res.ok) {
      console.error('Failed to fetch project metadata', res.status);
      return {
        title: `Project Details`,
      };
    }

    const project = await res.json();

    return {
      title: `Project ${project?.project?.title || 'Details'}`,
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      title: `Project Details`,
    };
  }
}
export default function ProjectDetailsPage() {
  return <ProjectDetails />;
}
