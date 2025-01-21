'use client';
import styles from '@/components/project/styles/project.module.css';
import CreateNewModuleBtn from '@/components/buttons/create-new-module-btn';
import { Button } from '@/components/buttons/custom-button';
import React, { useEffect, useState } from 'react';
import { moduleService } from '@/services/modules';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ModuleResponse {
    data: Module[];
    meta: {
        limit: number;
        page: number;
        total: number;
    };
}

interface Module {
    id: number;
    name: string;
    description: string;
    status: string;
    visibility: string;
    technology_id: number;
    language_id: number;
    framework_id: number;
}

const ModuleList = ({ projectId }: { projectId: string }) => {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/auth/login');
            return;
        }
        loadModules();
    }, [isLoggedIn, projectId, router]);

    const loadModules = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const response: ModuleResponse = await moduleService.getAll(token, Number(projectId));
            const formattedModules = response.data.map(module => ({
                ...module,
                publicValue: module.visibility === 'public' ? 'Yes' : 'No'
            }));
            setModules(formattedModules);
        } catch (error) {
            console.error('Failed to load modules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (moduleId: number) => {
        router.push(`/projects/${projectId}/modules/${moduleId}`);
    };

    const handleDelete = async (moduleId: number) => {
        if (window.confirm('Are you sure you want to delete this module?')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token found');

                await moduleService.delete(token, Number(projectId), moduleId);
                await loadModules();
            } catch (error) {
                console.error('Failed to delete module:', error);
                alert('Failed to delete module');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.contentContainer}>
            <div className={styles.contentHeaderWrapper}>
                <div className={styles.rect}></div>
                <div className={styles.contentHeader}>
                    <div className={styles.title}>Modules</div>
                    <div className={styles.btn}>
                        <CreateNewModuleBtn projectId={projectId} />
                    </div>
                </div>
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.customTable}>
                    <thead>
                        <tr>
                            <th>Module Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Public</th>
                            <th>Technology</th>
                            <th>Language</th>
                            <th>Framework</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modules.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-4">
                                    No modules found. Create your first module!
                                </td>
                            </tr>
                        ) : (
                            modules.map((module) => (
                                <tr key={module.id}>
                                    <td>{module.name}</td>
                                    <td>{module.description}</td>
                                    <td>{module.status}</td>
                                    <td>{module.publicValue}</td>
                                    <td>{module.technology_id}</td>
                                    <td>{module.language_id}</td>
                                    <td>{module.framework_id}</td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <Button 
                                                kind="secondary"
                                                onClick={() => handleEdit(module.id)}
                                            >
                                                Edit
                                            </Button>
                                            <Button 
                                                kind="secondary"
                                                onClick={() => handleDelete(module.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ModuleList;