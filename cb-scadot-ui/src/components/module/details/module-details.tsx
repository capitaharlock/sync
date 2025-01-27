'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@appkit4/react-components/button';
import styles from '@/components/project/styles/project.module.css';
import { moduleService } from '@/services/modules';
import { useRouter } from 'next/navigation';

const Input = dynamic(() => import('@appkit4/react-components').then(mod => mod.Input), { ssr: false });
const Select = dynamic(() => import('@appkit4/react-components').then(mod => mod.Select), { ssr: false });
const TextArea = dynamic(() => import('@appkit4/react-components').then(mod => mod.TextArea), { ssr: false });

interface ModuleDetailsProps {
    projectId: string;
    moduleId: string;
    isNew?: boolean;
}

interface ModuleFormData {
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'pending' | 'archived';
    visibility: 'public' | 'private';
    technology_id: string;
    language_id: string;
    framework_id: string;
    network_id: string;
}

const dummyData = {
    technology: [
        { value: '1', label: 'APIs' },
        { value: '2', label: 'Blockchain' },
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

export default function ModuleDetails({
    projectId,
    moduleId,
    isNew
}: ModuleDetailsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<ModuleFormData>({
        name: '',
        description: '',
        status: 'active',
        visibility: 'private',
        technology_id: '',
        language_id: '',
        framework_id: '',
        network_id: '',
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (moduleId && !isNew) {
            const fetchModule = async () => {
                setIsLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    if (!token) throw new Error('No token found');
    
                    const moduleData = await moduleService.getById(
                        token,
                        Number(projectId),
                        Number(moduleId)
                    );
                    setFormData({
                        name: moduleData.name,
                        description: moduleData.description,
                        status: moduleData.status,
                        visibility: moduleData.visibility,
                        technology_id: String(moduleData.technology_id),
                        language_id: String(moduleData.language_id),
                        framework_id: String(moduleData.framework_id),
                        network_id: String(moduleData.network_id)
                    });
                } catch {
                    setError('Failed to fetch module data');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchModule();
        }
    }, [moduleId, projectId, isNew]);

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

    const handleSelectChange = (field: string, value: unknown) => {
        const selectedValue = Array.isArray(value) ? value[0] : value;
        
        setFormData((prev) => ({
            ...prev,
            [field]: String(selectedValue), 
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
            };
    
            const response = moduleId && !isNew
                ? await moduleService.update(token, Number(projectId), Number(moduleId), moduleData)
                : await moduleService.create(token, Number(projectId), moduleData);
    
            router.push(`/projects/${projectId}/modules/${response.id}`);
        } catch (err) {
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
                    />
                </div>

                <div>
                    <Select
                        placeholder='Technology'
                        required={true}
                        data={dummyData.technology}
                        onSelect={(value) => handleSelectChange('technology_id', value)}
                        value={formData.technology_id}
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
                        : moduleId && !isNew
                            ? 'Update module'
                            : 'Save module'}
                </Button>
            </div>
        </div>
    );
}