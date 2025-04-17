import { db } from '@/lib/db';
import { studyGuide } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function PUTMethod(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'PUT') {
    const { projectId, updatedContent } = req.body;

    if (!projectId || !updatedContent) {
      return res
        .status(400)
        .json({ error: 'Missing projectId or updatedContent' });
    }

    try {
      const targetStudyGuide = await db
        .select()
        .from(studyGuide)
        .where(eq(studyGuide.projectId, projectId));

      if (targetStudyGuide.length !== 1) {
        return res.status(404).json({ error: 'Study guide not found' });
      }

      const updatedStudyGuide = await db
        .update(studyGuide)
        .set({ content: updatedContent })
        .where(eq(studyGuide.projectId, projectId));

      return res.status(200).json({
        data: updatedStudyGuide,
        message: 'Study guide updated successfully',
      });
    } catch (error) {
      console.error('Error updating study guide:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
