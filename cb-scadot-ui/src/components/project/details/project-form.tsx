'use client';
import React, { useState, useEffect } from 'react';
import { Input, Select, TextArea } from '@appkit4/react-components';
import { Button } from '@appkit4/react-components/button';
import styles from '@/components/project/styles/project.module.css';
import { projectService } from '@/services/projects';
import { useRouter } from 'next/navigation';
import ProjectHeader from './project-header';
import ProjectTeamMembers from './project-team-members';

interface ProjectData {
    name: string;
    description: string;
    status: 'active';
    visibility: 'public' | 'private';
    ado_id: string;
}

type SelectValue = string | number | (string | number)[];

export default function ProjectForm({
    projectId,
    isNew,
}: {
    projectId?: string;
    isNew?: boolean;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState<'details' | 'team-members'>('details');
    const [formData, setFormData] = useState({
        name: '',
        ado_id: '',
        isPublic: '',
        description: '',
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const isProjectCreated = !!projectId;

    useEffect(() => {
        if (projectId) {
            const fetchProject = async () => {
                setIsLoading(true);
                try {
                    const project = await projectService.getById(
                        Number(projectId),
                    );
                    setFormData({
                        name: project.name,
                        ado_id: project.ado_id || '',
                        isPublic:
                            project.visibility === 'public' ? 'Yes' : 'No',
                        description: project.description,
                    });
                } catch (err) {
                    setError('Failed to fetch project data');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProject();
        }
    }, [projectId]);

    const handleSectionChange = (section: 'details' | 'team-members') => {
        setActiveSection(section);
    };

    const handleInputChange = (
        value: string,
        event?: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const field = event?.target?.name;
        if (!field) return;

        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (validationErrors[field]) {
            setValidationErrors((prev) => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    const handleTextAreaChange = (
        value: string,
        event?: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        const field = event?.target?.name;
        if (!field) return;

        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (validationErrors[field]) {
            setValidationErrors((prev) => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    const handleSelectChange = (value: SelectValue) => {
        setFormData((prev) => ({
            ...prev,
            isPublic: String(value),
        }));

        if (validationErrors.isPublic) {
            setValidationErrors((prev) => ({
                ...prev,
                isPublic: '',
            }));
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = 'Project Name is required';
        }

        if (!formData.isPublic) {
            errors.isPublic = 'Please select if the project is public or not';
        }

        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        } else if (formData.description.length > 420) {
            errors.description = 'Description must be less than 420 characters';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }
    
        setIsLoading(true);
        setError('');
    
        try {
            const projectData: ProjectData = {
                name: formData.name,
                description: formData.description,
                status: 'active',
                visibility: formData.isPublic === 'Yes' ? 'public' : 'private',
                ado_id: formData.ado_id,
            };
    
            let response;
            if (projectId) {
                response = await projectService.update(
                    Number(projectId),
                    projectData,
                );
            } else {
                response = await projectService.create(projectData);
            }
    
            console.log('Project saved successfully:', response);
            router.push(`/projects/${response.id}`);
        } catch (err) {
            console.error('Error saving project:', err);
            if (err instanceof Error && err.message === 'User is not authenticated. Please log in.') {
                router.push('/auth/login');
            } else {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to save project. Please try again.',
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderProjectDetails = () => (
        <div className={styles.sectionContent}>
            <div className={styles.formFields}>
                <div className={styles.textFieldContainer}>
                    <Input
                        type='text'
                        name='name'
                        title='Project Name'
                        required={true}
                        allowClear={true}
                        onChange={(value: string, event: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChange(value, event)
                        }
                        value={formData.name}
                        id='project-name-input'
                    />
                    {validationErrors.name && (
                        <div className={styles.error}>
                            {validationErrors.name}
                        </div>
                    )}
                </div>

                <div className={styles.textFieldContainer}>
                    <Input
                        type='text'
                        name='ado_id'
                        title='ADO ID'
                        allowClear={true}
                        onChange={(value: string, event: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChange(value, event)
                        }
                        value={formData.ado_id}
                        id='ado-id-input'
                    />
                </div>

                <div>
                    <Select
                        placeholder='Public'
                        required={true}
                        data={[
                            { label: 'Yes', value: 'Yes' },
                            { label: 'No', value: 'No' },
                        ]}
                        onSelect={handleSelectChange}
                        value={formData.isPublic}
                        id='public-select-input'
                    />
                    {validationErrors.isPublic && (
                        <div className={styles.error}>
                            {validationErrors.isPublic}
                        </div>
                    )}
                </div>

                <div className={styles.textAreaContainer}>
                    <TextArea
                        name='description'
                        title='Description of the project. (purpose, goals, etc)'
                        required={true}
                        maxLength={420}
                        onChange={(value: string, event: React.ChangeEvent<HTMLTextAreaElement>) =>
                            handleTextAreaChange(value, event)
                        }
                        value={formData.description}
                        id='description-textarea-input'
                    />
                    {validationErrors.description && (
                        <div className={styles.error}>
                            {validationErrors.description}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.mainContainer}>
            <ProjectHeader isNew={isNew} projectId={projectId} />
            <div className={styles.twoColumnLayout}>
                <div className={styles.leftColumn}>
                    <h1 className={styles.mainTitle}>Project settings</h1>
                    <nav className={styles.menu}>
                        <div 
                            className={`${styles.menuItem} ${activeSection === 'details' ? styles.active : ''}`}
                            onClick={() => handleSectionChange('details')}
                        >
                            Project details
                        </div>
                        <div
                            className={`${styles.menuItem} ${!isProjectCreated ? styles.disabled : ''} ${activeSection === 'team-members' ? styles.active : ''}`}
                            onClick={isProjectCreated ? () => handleSectionChange('team-members') : undefined}
                        >
                            Team members
                        </div>
                    </nav>
                </div>
                <div className={styles.rightColumn}>
                    {activeSection === 'details' ? renderProjectDetails() : <ProjectTeamMembers />}

                    {error && <div className={styles.error}>{error}</div>}

                    {activeSection === 'details' && (
                        <div className={styles.buttonContainer}>
                            <Button
                                kind='primary'
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? 'Saving...'
                                    : projectId 
                                        ? 'Update project'
                                        : 'Save and continue'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}