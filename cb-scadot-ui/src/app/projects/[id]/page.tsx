'use client';
import ProjectForm from '@/components/project/details/project-form';
import { useParams } from 'next/navigation';

export default function ProjectPage() {
    const { id } = useParams();
    return <ProjectForm projectId={id as string} />;
}
