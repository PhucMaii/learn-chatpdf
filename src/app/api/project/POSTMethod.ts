import { db } from '@/lib/db';
import { project } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default async function POSTMethod(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        {
          error: 'Project name is required',
        },
        {
          status: 400,
        },
      );
    }

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        },
      );
    }

    const projectData = {
      name,
      userId,
    };

    const newProject = await db.insert(project).values(projectData).returning();

    console.log('newProject', newProject);

    if (!newProject) {
      return NextResponse.json(
        {
          error: 'Something went wrong in creating project',
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        message: 'Project created successfully',
        project: newProject[0],
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.log('Error in creating project', error);
    return new Response(
      JSON.stringify({
        error: 'Something went wrong in creating project',
      }),
      {
        status: 500,
      },
    );
  }
}
