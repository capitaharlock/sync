'use client';
import React, { useEffect, useState } from "react";
import styles from './projects.module.css';
import { Steppers, Stepper } from '@appkit4/react-components/stepper';

import { Input, Select, TextArea, Modal } from '@appkit4/react-components';
import NextStepBtn from "../buttons/next-step-btn";
import CreateNewModuleBtn from "../buttons/new-module-btn"

import ScadotAccordion from './scadot-accordion';
import { useAppDispatch, useAppSelector } from "@/lib/reduxHooks";
import { setCreateProjectProgress } from "@/lib/slices/AppSlice";
import CreateModule from '../module/create';
import TeamMemberSelectionPanel from "./project-team-member";

export default function CreateNewProject() {
 
    return (
        <div className={styles?.projectContainer}>
            <div className={styles?.contentContainer}>
                <div className={styles?.contentHeaderWrapper}>
                    <div className={styles?.rect}></div>
                </div>
                <div className={styles?.newProjectContainer}>
                    <div className={styles?.newProjectProgressContainer}>
                        <div className={styles?.title}>
                            Create a new Project
                        </div>
                        <ProgressNav />
                    </div>
                    <ProgressContent />
                </div>
            </div>
            <div className={styles?.leftCorner}>

            </div>
        </div>
    )
}
 
const ProgressNav = () => {
    
    const [activeIndex, setActiveIndex] = React.useState(0);
    const { createProjectProgress } = useAppSelector(state => state.app);
    const idx = createProjectProgress.currentStep - 1;
    useEffect(() => {
        setActiveIndex(idx);
    }, [createProjectProgress.radioIndex]);
    
    const dispatch = useAppDispatch();
    const onStepperChange = (i: number) => {
        setActiveIndex(i);
        dispatch(setCreateProjectProgress({currentStep: i+1, radioIdx: i}));
    }

    return (
        <Steppers 
            orientation='vertical' space={48} activeIndex={activeIndex} 
            onActiveIndexChange={onStepperChange}
            >
            <Stepper label='1. Add Project details' status='normal'></Stepper>
            <Stepper label='2. Add/select modules' status='normal'></Stepper>
            <Stepper label='3. Add team members' status='normal'></Stepper>
        </Steppers>
    );
}

const ProgressContent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isPublic = [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
    ];
    const [panel1Data, setPanel1Data] = React.useState<any>({
        moduleName: '',
        adoLink: '',
        isPublic: '',
        description: ''
    });
    const [resetModalData, setResetModalData] = React.useState<boolean>(false);
    const handleChange = (value: string, event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!event) {
            return;
        }
        setPanel1Data({
            ...panel1Data,
            [event.target.name]: value
        });
    }
    const handleDropdownChange = (name: string, value: string) => {
        setPanel1Data({
            ...panel1Data,
            [name]: value
        });
    };
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <ScadotAccordion stepNumber={1} title="Add Project Details">
                <div className={styles?.frame835558393}>
                    <div className={styles?.newProjectDetailsContainer}>
                        <div className={styles?.accordionContent}>
                            <div className={styles?.accordionContentMultifields}>
                                <div className={styles?.textFieldContainer}>
                                    <Input
                                        type={"text"}
                                        title={"Project Name"}
                                        className={styles?.textField}
                                        required={true}
                                        allowClear={true}
                                        onChange={handleChange}
                                        value={panel1Data.moduleName}
                                        >
                                    </Input>
                                </div>
                                <div className={styles?.textFieldContainer}>
                                    <Input
                                        type={"text"}
                                        title={"ADO link"}
                                        className={styles?.textField}
                                        required={true}
                                        allowClear={true}
                                        onChange={handleChange}
                                        value={panel1Data.language}
                                        >
                                    </Input>
                                </div>
                                <div>
                                    <Select
                                        placeholder={"Public"}
                                        required={true}
                                        data={isPublic}
                                        onSelect={e => handleDropdownChange('isPublic',e as string)}/>
                                </div>
                            </div>
                            <div className={styles?.accordionContentTextArea}>
                                <TextArea
                                    title={"Description of the project. (purpose, goals, etc)"}
                                    required={true}
                                    className={styles?.textarea}
                                    maxLength={420}
                                    value={panel1Data.description}
                                    onChange={handleChange}/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.workAreaFoot}>
                        <div className={styles.nextStepContainer}>
                            <NextStepBtn stepNumber={1} />
                        </div>
                    </div>
                </div>
            </ScadotAccordion>
            <ScadotAccordion stepNumber={2} title="Add new or select from existing modules">
                <div className={styles.frame835558393}>
                    <div className={styles.newProjectDetailsContainer}>
                        <div className={styles.accordionContent}>
                            <div className={styles.accordionContentMultifields}>
                                <CreateNewModuleBtn onClick={openModal} />
                                <Modal visible={isModalOpen} onCancel={closeModal}>
                                    <CreateModule resetForm={resetModalData} onCloseHandler={closeModal} />
                                </Modal>
                                <h2>todo: list of modules</h2>
                            </div>
                        </div>
                    </div>
                    <div className={styles.workAreaFoot}>
                        <div className={styles.nextStepContainer}>
                            <NextStepBtn stepNumber={2}/>
                        </div>
                    </div>
                </div>
            </ScadotAccordion>
            <ScadotAccordion stepNumber={3} title="Add team members (optional)">
                <div className={styles.frame835558393}>
                    <TeamMemberSelectionPanel/>
                </div>
            </ScadotAccordion>
        </div>
    )

}
