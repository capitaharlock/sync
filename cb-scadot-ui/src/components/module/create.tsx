import styles from './create.module.css'
import { Button, Input, Select } from '@appkit4/react-components';
import JsonCodeEditor from './editor/json-code-editor';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/lib/reduxHooks';
import { createModule } from '@/lib/slices/ModuleSlice';

interface CreateModuleProps {
    resetForm: boolean;
    onCloseHandler: () => void;
}

const initialFormData = {
    name: '',
    technology: '',
    language: '',
    framework: '',
    isPublic: '',
    code: ''
};

const initialCode = `{
    // Add your code here
}`;

const CreateModule: React.FC<CreateModuleProps> = ({ resetForm, onCloseHandler }) => {
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (resetForm) {
            setFormData(initialFormData);
        }
    }, [resetForm]);

    const handleChange = (value: string, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDropdownChange = (name: string, value: string) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCodeChange = (code: string) => {
        setFormData(prevState => ({
            ...prevState,
            code: code
        }));
    };

    const onSaveButtonClick = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            dispatch(
                createModule({ projectId: '1', payload: formData })
            ).then((res) => {
                setIsSaving(false);
                console.log('response: ', res);
                onCloseHandler();
            });
        }, 3000);
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
        public: [
            { value: '1', label: 'Yes' },
            { value: '2', label: 'No' },
        ]
    };
    
    return (
        <div className={styles.createModuleRootContainer}>
            <div className={styles.createHeader}>
                <h1>Create a new Module</h1>
            </div>
            
            <div className={styles.createMidContainer}>
                <div className={styles.moduleDetailsContainer}>
                    <div className={styles.moduleDetailsLeft}>
                        <div className={styles.moduleDetailsLeftSummary}>
                            <h2>Module Heading</h2>
                            <p>Module summary details here ...</p>
                        </div>
                        <div className={styles.moduleDetailsLeftFieldSection}>
                            <div className={styles.moduleDetailsLeftFields}>
                                <Input
                                    name="moduleName"
                                    type="text"
                                    title="Module Name"
                                    required={true}
                                    allowClear={true}
                                    onChange={handleChange}
                                />
                                <Select
                                    id="technology"
                                    placeholder="Technology"
                                    data={dummyData.technology}
                                    value={formData.technology}
                                    onSelect={e => handleDropdownChange('technology', e as string)}
                                />
                                <Select
                                    id="language"
                                    placeholder="Language"
                                    data={dummyData.language}
                                    value={formData.language}
                                    onSelect={e => handleDropdownChange('language', e as string)}
                                />
                                <Select 
                                    id="framework"
                                    placeholder="Framework"
                                    data={dummyData.framework}
                                    value={formData.framework}
                                    onSelect={e => handleDropdownChange('framework', e as string)}
                                />
                                <Select 
                                    id="isPublic"
                                    placeholder="Public"
                                    data={dummyData.public}
                                    value={formData.isPublic}
                                    onSelect={e => handleDropdownChange('isPublic', e as string)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.moduleDetailsRight}>
                        <div className={styles.moduleCodeEditorContainer}>
                            <JsonCodeEditor 
                                onCodeChange={handleCodeChange}
                                initialValue={initialCode}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.createBottomContainer}>
                <Button kind="secondary" onClick={onCloseHandler}>Cancel</Button>
                <Button kind="primary" onClick={onSaveButtonClick}>
                    Save module
                </Button>
                {isSaving && <span className={styles.loadingSpinner}></span>}
            </div>
        </div>
    );
};

export default CreateModule;