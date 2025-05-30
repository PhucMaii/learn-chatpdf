import { trialProjects } from '@/lib/constant';
import { db } from '@/lib/db';
import { project } from '@/lib/db/schema';
import { handleAuthGuard } from '@/utils/auth';
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

    const authGuard: any = await handleAuthGuard();

    if (!authGuard.ok) {
      return NextResponse.json(
        {
          error: 'Unauthorize',
        },
        { status: 401 },
      );
    }

    if (authGuard?.user?.status !== 'Pro' && authGuard?.user?.projects?.length >= trialProjects) {
      return NextResponse.json(
        { error: 'Upgrade to Pro plan to create projects' },
        { status: 400 },
      );
    }

    const projectData = {
      name,
      userId: authGuard.id,
    };

    const newProject = await db.insert(project).values(projectData).returning();

    // console.log('newProject', newProject);

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
