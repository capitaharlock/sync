'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProjectList from '@/components/project/list/project-list';
import { useAuth } from '@/context/AuthContext';

export default function ProjectsPage() {
    const router = useRouter();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/auth/login');
        }
    }, [isLoggedIn, router]);

    return (
        <main className='main-container'>
            <ProjectList />
        </main>
    );
}
