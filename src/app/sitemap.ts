import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const projects = await fetch(`https://learnpdf.ca/api/public/projects`);

    if (!projects.ok) {
        return [];
    }

    const projectsData = await projects.json();

    const projectEntries = projectsData.projects.map((project: any) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.id}`,
        lastModified: new Date(project.createdAt),
        // changeFrequency: 'daily',
        // priority: 0.8,
    }));

    return [
        {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
        },
        ...projectEntries,
    ];
}