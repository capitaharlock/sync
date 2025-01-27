'use client';
import React, { useState, useEffect } from 'react';
import { Input, Select } from '@appkit4/react-components';
import { Button } from '@appkit4/react-components/button';
import styles from '@/components/project/styles/project.module.css';
import { repositoryService, Repository } from '@/services/repositories';

interface ModuleRepositoryProps {
    projectId: string;
    moduleId: string;
}

export default function ModuleRepository({
    projectId,
    moduleId,
}: ModuleRepositoryProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [repositoryId, setRepositoryId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        provider: '',
        url: '',
        access_token: '',
        updated_at: ''
    });

    useEffect(() => {
        fetchRepository();
    }, [projectId, moduleId]);

    const fetchRepository = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const repository = await repositoryService.getByModuleId(
                token,
                Number(projectId),
                Number(moduleId)
            );

            if (repository) {
                setRepositoryId(repository.id);
                setFormData({
                    provider: repository.provider || '',
                    url: repository.url || '',
                    access_token: repository.access_token || '',
                    updated_at: repository.updated_at
                });
            }
        } catch (err) {
            if (err instanceof Error && err.message !== 'Failed to fetch repository') {
                setError('Failed to fetch repository data');
                console.error('Error fetching repository:', err);
            }
        }
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
    };

    const handleSelectChange = (value: unknown) => {
        setFormData(prev => ({
            ...prev,
            provider: String(value)
        }));
    };

    const handleSave = async () => {
        if (!formData.provider || !formData.url || !formData.access_token) {
            setError('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');

            const data = {
                provider: formData.provider,
                url: formData.url,
                access_token: formData.access_token
            };

            await repositoryService.createOrUpdate(
                token,
                Number(projectId),
                Number(moduleId),
                data
            );

            await fetchRepository();
        } catch (err) {
            console.error('Error saving repository:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to save repository. Please try again.',
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.sectionContent}>
            <div className={styles.formFields}>
                <div>
                    <Select
                        placeholder='Provider'
                        required={true}
                        data={[
                            { value: 'github', label: 'GitHub' },
                            { value: 'gitlab', label: 'GitLab' },
                            { value: 'bitbucket', label: 'Bitbucket' }
                        ]}
                        onSelect={handleSelectChange}
                        value={formData.provider}
                        id='provider-select'
                    />
                </div>
    
                <div className={styles.textFieldContainer}>
                    <Input
                        type='text'
                        name='url'
                        title='Repository URL'
                        required={true}
                        allowClear={true}
                        onChange={handleInputChange}
                        value={formData.url}
                        id='repository-url-input'
                        autoComplete="off"
                    />
                </div>
    
                <div className={styles.textFieldContainer}>
                    <Input
                        type='text'
                        name='access_token'
                        title='Fine-Grained Personal Access Token'
                        required={true}
                        allowClear={true}
                        onChange={handleInputChange}
                        value={formData.access_token}
                        id='access-token-input'
                        autoComplete="off"
                    />
                </div>
    
                {formData.updated_at && (
                    <div className={styles.textFieldContainer}>
                        <div className={styles.readOnlyField}>
                            <span className={styles.fieldLabel}>Updated at</span>
                            <span className={styles.fieldValue}>
                                {new Date(formData.updated_at).toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}
    
                {error && <div className={styles.error}>{error}</div>}
    
                <div className={styles.buttonContainer}>
                    <Button
                        kind='primary'
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? 'Saving...'
                            : repositoryId
                                ? 'Update repository'
                                : 'Save repository'}
                    </Button>
                </div>

                <div className={`${styles.infoBox} mt-6 p-4 border border-gray-600 rounded-lg bg-gray-800`}>
                    <div className={`flex items-center gap-2 mb-3`}>
                        <span role="img" aria-label="info" className="text-xl">ℹ️</span>
                        <strong>Steps to Generate a PAT</strong>
                    </div>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li>Go to your GitHub account settings.</li>
                        <li>Navigate to <strong>Developer settings &gt; Personal access tokens &gt; Tokens (classic)</strong>.</li>
                        <li>Click <strong>Generate new token</strong>.</li>
                        <li>
                            Select the appropriate scopes (permissions) for your use case. For example:
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><code className="bg-gray-700 px-2 py-0.5 rounded text-sm font-mono">repo</code> for full control of private repositories.</li>
                                <li><code className="bg-gray-700 px-2 py-0.5 rounded text-sm font-mono">public_repo</code> for access to public repositories.</li>
                                <li><code className="bg-gray-700 px-2 py-0.5 rounded text-sm font-mono">workflow</code> for managing GitHub Actions.</li>
                            </ul>
                        </li>
                        <li>Click <strong>Generate token</strong>.</li>
                        <li>Copy the token and save it securely (you won&#39;t be able to see it again).</li>
                    </ol>
                </div>    
            </div>
        </div>
    );
}