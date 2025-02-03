import React, { useEffect, useState } from 'react';
import '../css/shared.css';
import { Badge, Button, Input, InputNumber } from '@appkit4/react-components';
import styles from "./sliding-panel.module.css";
import CodePanel from './code-container';
import { useAppDispatch, useAppSelector } from '@/lib/reduxHooks';
import { excuteApi, setExecutionStatus } from "@/lib/slices/ApiTestingSlice";
import { ApiTestingStatus, DisplayItem, Parameter, PathDetailItem } from '@/lib/type-helper';

type SlidingPanelProps = {
    isOpen: boolean;
    onClose: () => void;
    displayItem: DisplayItem | null;
    itemSpecs: PathDetailItem | null;
};

const SlidingPanel: React.FC<SlidingPanelProps> = ({ isOpen, onClose, displayItem, itemSpecs }) => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [testResults, setTestResults] = useState<unknown | null>();
    const { executionStatus} = useAppSelector(state => state.apiTesting);
    const [resetTrigger, setResetTrigger] = useState(false);
    useEffect(() => {
        dispatch(setExecutionStatus(ApiTestingStatus.NOT_STARTED));
    }, [dispatch]);
    
    useEffect(() => {
        // Reset formData and testResults when itemSpecs changes
        setFormData({});
        setTestResults(null);
        setResetTrigger(prev => !prev);
    }, [itemSpecs]);
    useEffect(() => {
        if (isOpen) {
            console.log('open: ', displayItem);
            if (!displayItem) {
                console.log('displayItem is null');
            }
            if (!itemSpecs) {
                console.log('itemSpecs is null');
            }
        }
    }, [isOpen, displayItem, itemSpecs]);

    const handleChange = (value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        if (!event) {
            return;
        }
        setFormData({
            ...formData,
            [event.target.name]: value
        });
    }
    const handleNumericChange = (value: string | number, formattedValue: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        if (!event) {
            return;
        }
        // Check if the event target name is undefined and 
        // set it manually if needed. appkit up/down arrow buttons 
        // in numeric fields do not have correct target element
        let targetName = event.target.name;
        if (!targetName) {
            // Traverse the DOM to find the input element within the same parent
            const inputElement = event.currentTarget.closest('.ap-field-wrapper')?.querySelector('input.ap-field-input');
            const attr = inputElement?.getAttribute('name');
            targetName = attr || '';
        }
        if (!targetName) {
            console.error("target name is undefined");
            return;
        }
        setFormData({
            ...formData,
            [targetName]: value.toString()
        });
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setExecutionStatus(ApiTestingStatus.EXECUTING));
        setTimeout(() => {
            dispatch(
                excuteApi({ payload: formData })
            ).then((res) => {
                // setResponse(JSON.stringify(res, null, 2));
                setTestResults(res.payload);
                dispatch(setExecutionStatus(ApiTestingStatus.DONE));
            });
        }, 3000);
    };
    
    if (!isOpen || !displayItem || !itemSpecs) {
        return null;
    }
    
    const parameters = itemSpecs.parameters;

    return (
        <div className={styles.right}>
            <div className={styles.workAreaHeader}>
                <div key={displayItem.path} className={styles.listItemContainer}>
                    <div className={styles.listItem}>
                        <span className="Appkit4-icon icon-arrow-left-outline ap-font-32 ap-container-32 cursor-pointer" onClick={onClose}></span>
                        <span className={styles.listItemSpacer}></span>
                        <div className={styles.listItemBadgeContainer}>
                            <Badge value={displayItem.methodName}  type={'primary'} />
                        </div>
                        <div className={styles.listItemPath}>{displayItem.path}</div>
                        <span className={styles.listItemSpacer}></span>
                        <div className={styles.listItemSummary} >{displayItem.summary}</div>
                    </div>
                </div>
            </div>
            <div className={styles.frame835558470}>
                <div className={styles.frame835558471}>
                    <div className={styles.frame835558412}>
                        <div className={styles.frame835558373}>
                            {parameters.map(param => (
                                <div id={param.name} key={param.name} className={styles.frame835558465}>
                                    <span>{param.description}</span>
                                    <CsInput param={param} onChange={handleChange} onNumericChange={handleNumericChange} resetTrigger={resetTrigger} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.frame835558414}>

                        <Button type="submit" name="btnSubmit" kind="primary" icon="Appkit4-icon icon-play-outline" onClick={handleSubmit}>Execute</Button>
                    </div>
                </div>
                <div className={styles.frame835558413}>

                    {executionStatus === ApiTestingStatus.NOT_STARTED && (
                        <div>
                            <div className={styles.noResults}></div>
                            <span>Execute the fields to begin testing</span>
                        </div>
                    )}
                    {executionStatus === ApiTestingStatus.EXECUTING && (
                        <div>
                            <div className={styles.loadingSpinner}></div>
                            <span>Executing...</span>
                        </div>
                    )}
                    {executionStatus === ApiTestingStatus.DONE && (
                        <CodePanel resultsJson={JSON.stringify(testResults, null, 2)} resetTrigger={resetTrigger} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SlidingPanel;


type CsInputProps = {
    param: Parameter;
    onChange?: (value: string, event?: React.ChangeEvent<HTMLInputElement>) => void;
    onNumericChange?: (value: number | string, formattedValue: string, event?: React.ChangeEvent<HTMLInputElement>) => void;
    resetTrigger: boolean;
};

const CsInput: React.FC<CsInputProps> = ({ param, onChange, onNumericChange, resetTrigger }) => {
    useEffect(() => {}, [resetTrigger]);

    if (param.schema.type === 'integer') {
        return (
            <InputNumber
                name={param.name}
                title={param.name}
                required={param.required}
                defaultValue={param.schema.default}
                onChange={onNumericChange}
            />
        );
    }
    return (
        <Input
            name={param.name}
            type={param.schema.type}
            title={param.name}
            required={param.required}
            defaultValue={param.schema.default}
            allowClear={true}
            onChange={onChange}
        />
    );
};