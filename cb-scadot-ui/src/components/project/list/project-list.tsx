'use client';
import styles from '@/components/project/styles/project.module.css';
import CreateNewProjectBtn from '@/components/buttons/create-new-project-btn';
import React, { useEffect, useState } from 'react';
import { projectService } from '@/services/projects';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/auth/login');
            return;
        }
        loadProjects();
    }, [isLoggedIn]);

    const loadProjects = async () => {
        try {
            const response = await projectService.getAll();
            console.log('Projects loaded:', response.data);
            const formattedProjects = response.data.map(project => ({
                ...project,
                publicValue: project.visibility === 'public' ? 'Yes' : 'No',
                createdDate: new Date(project.date_time_created).toLocaleDateString()
            }));
            setProjects(formattedProjects || []);
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (projectId: number) => {
        router.push(`/projects/${projectId}`);
    };

    const handleDelete = async (projectId: number) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectService.delete(projectId);
                await loadProjects();
            } catch (error) {
                console.error('Failed to delete project:', error);
                alert('Failed to delete project');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.contentContainer}>
            <div className={styles.contentHeaderWrapper}>
                <div className={styles.rect}></div>
                <div className={styles.contentHeader}>
                    <div className={styles.title}>Projects</div>
                    <div className={styles.btn}>
                        <CreateNewProjectBtn />
                    </div>
                </div>
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.customTable}>
                    <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Description</th>
                            <th>ADO ID</th>
                            <th>Status</th>
                            <th>Public</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project: any, index: number) => (
                            <tr key={project.id}>
                                <td>{project.name}</td>
                                <td>{project.description}</td>
                                <td>{project.ado_id}</td>
                                <td>{project.status}</td>
                                <td>{project.publicValue}</td>
                                <td>{project.createdDate}</td>
                                <td>
                                    <div className={styles.actionButtons}>
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => handleEdit(project.id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={styles.actionButtonDelete}
                                            onClick={() => handleDelete(project.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Projects;
