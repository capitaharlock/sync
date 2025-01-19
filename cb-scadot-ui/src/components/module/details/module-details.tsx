'use client';
import React, { useState, useEffect } from 'react';
import { Input, Select, TextArea } from '@appkit4/react-components';
import { Button } from '@appkit4/react-components/button';
import styles from '@/components/project/styles/project.module.css';
import { moduleService } from '@/services/modules';
import { useRouter } from 'next/navigation';

interface Module {
    id: number;
    project_id: number;
    name: string;
    description: string;
    repository_url: string;
    status: 'active' | 'inactive' | 'pending' | 'archived';
    visibility: 'public' | 'private';
    content_source: string;
    content_html: string;
    technology_id: number;
    language_id: number;
    framework_id: number;
    network_id: number;
    mock_set_id: number;
    date_time_created: string;
    date_time_modified: string;
}

interface ModuleDetailsProps {
    projectId: string;
    moduleId?: string;
    isNew?: boolean;
}

export default function ModuleDetails({
    projectId,
    moduleId,
    isNew,
}: ModuleDetailsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'active' as const,
        visibility: 'private' as const,
        technology_id: '',
        language_id: '',
        framework_id: '',
        network_id: '',
        repository_url: '',
        content_source: '',
        content_html: ''
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (moduleId) {
            const fetchModule = async () => {
                setIsLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    if (!token) throw new Error('No token found');

                    const module = await moduleService.getById(
                        token,
                        Number(projectId),
                        Number(moduleId)
                    );
                    setFormData({
                        name: module.name,
                        description: module.description,
                        status: module.status,
                        visibility: module.visibility,
                        technology_id: String(module.technology_id),
                        language_id: String(module.language_id),
                        framework_id: String(module.framework_id),
                        network_id: String(module.network_id),
                        mock_set_id: String(module.mock_set_id),
                        repository_url: module.repository_url,
                        content_source: module.content_source,
                        content_html: module.content_html
                    });
                } catch (err) {
                    setError('Failed to fetch module data');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchModule();
        }
    }, [moduleId, projectId]);

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

    const handleSelectChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: field === 'status' || field === 'visibility' ? value : value,
        }));

        if (validationErrors[field]) {
            setValidationErrors((prev) => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = 'Module Name is required';
        }

        if (!formData.technology_id) {
            errors.technology_id = 'Technology is required';
        }

        if (!formData.language_id) {
            errors.language_id = 'Language is required';
        }

        if (!formData.framework_id) {
            errors.framework_id = 'Framework is required';
        }

        if (!formData.network_id) {
            errors.network_id = 'Network is required';
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
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const moduleData = {
                name: formData.name,
                description: formData.description,
                status: formData.status,
                visibility: formData.visibility,
                technology_id: Number(formData.technology_id),
                language_id: Number(formData.language_id),
                framework_id: Number(formData.framework_id),
                network_id: Number(formData.network_id),
                repository_url: formData.repository_url,
                content_source: formData.content_source,
                content_html: formData.content_html
            };

            let response;
            if (moduleId) {
                response = await moduleService.update(
                    token,
                    Number(projectId),
                    Number(moduleId),
                    moduleData
                );
            } else {
                response = await moduleService.create(
                    token,
                    Number(projectId),
                    moduleData
                );
            }

            console.log('Module saved successfully:', response);
            router.push(`/projects/${projectId}/modules/${response.id}`);
        } catch (err) {
            console.error('Error saving module:', err);
            if (err instanceof Error && err.message === 'User is not authenticated. Please log in.') {
                router.push('/auth/login');
            } else {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to save module. Please try again.',
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const dummyData = {
        technology: [
            { value: '1', label: 'Microservices' },
            { value: '2', label: 'Service 2' },
        ],
        language: [
            { value: '1', label: 'Go' },
            { value: '2', label: 'NodeJS' },
        ],
        framework: [
            { value: '1', label: 'Gin' },
            { value: '2', label: 'React' },
        ],
        status: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'pending', label: 'Pending' },
            { value: 'archived', label: 'Archived' }
        ],
        network: [
            { value: '1', label: 'Ethereum' },
            { value: '2', label: 'Solana' }
        ]
    };

    return (
        <div className={styles.sectionContent}>
            <div className={styles.formFields}>
                <div className={styles.textFieldContainer}>
                    <Input
                        type='text'
                        name='name'
                        title='Module Name'
                        required={true}
                        allowClear={true}
                        onChange={handleInputChange}
                        value={formData.name}
                        id='module-name-input'
                    />
                    {validationErrors.name && (
                        <div className={styles.error}>{validationErrors.name}</div>
                    )}
                </div>

                <div>
                    <Select
                        placeholder='Status'
                        required={true}
                        data={dummyData.status}
                        onSelect={(value) => handleSelectChange('status', value)}
                        value={formData.status}
                        id='status-select'
                    />
                </div>

                <div>
                    <Select
                        placeholder='Visibility'
                        required={true}
                        data={[
                            { value: 'public', label: 'Public' },
                            { value: 'private', label: 'Private' }
                        ]}
                        onSelect={(value) => handleSelectChange('visibility', value)}
                        value={formData.visibility}
                        id='visibility-select'
                    />
                </div>

                <div>
                    <Select
                        placeholder='Technology'
                        required={true}
                        data={dummyData.technology}
                        onSelect={(value) => handleSelectChange('technology_id', value)}
                        value={formData.technology_id}
                        id='technology-select'
                    />
                    {validationErrors.technology_id && (
                        <div className={styles.error}>{validationErrors.technology_id}</div>
                    )}
                </div>

                <div>
                    <Select
                        placeholder='Language'
                        required={true}
                        data={dummyData.language}
                        onSelect={(value) => handleSelectChange('language_id', value)}
                        value={formData.language_id}
                        id='language-select'
                    />
                    {validationErrors.language_id && (
                        <div className={styles.error}>{validationErrors.language_id}</div>
                    )}
                </div>

                <div>
                    <Select
                        placeholder='Framework'
                        required={true}
                        data={dummyData.framework}
                        onSelect={(value) => handleSelectChange('framework_id', value)}
                        value={formData.framework_id}
                        id='framework-select'
                    />
                    {validationErrors.framework_id && (
                        <div className={styles.error}>{validationErrors.framework_id}</div>
                    )}
                </div>

                <div>
                    <Select
                        placeholder='Network'
                        required={true}
                        data={dummyData.network}
                        onSelect={(value) => handleSelectChange('network_id', value)}
                        value={formData.network_id}
                        id='network-select'
                    />
                    {validationErrors.network_id && (
                        <div className={styles.error}>{validationErrors.network_id}</div>
                    )}
                </div>

                <div className={styles.textAreaContainer}>
                    <TextArea
                        name='description'
                        title='Description'
                        required={true}
                        maxLength={420}
                        onChange={handleTextAreaChange}
                        value={formData.description}
                        id='description-textarea'
                    />
                    {validationErrors.description && (
                        <div className={styles.error}>{validationErrors.description}</div>
                    )}
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.buttonContainer}>
                <Button
                    kind='primary'
                    onClick={handleSave}
                    disabled={isLoading}
                >
                    {isLoading
                        ? 'Saving...'
                        : moduleId
                            ? 'Update module'
                            : 'Save module'}
                </Button>
            </div>
        </div>
    );
}