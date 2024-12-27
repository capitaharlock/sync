'use client';
import styles from './projects.module.css';
import CreateNewProjectBtn from '../buttons/create-new-project-btn';
import { Table, Column } from '@appkit4/react-components/table';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/reduxHooks';
import { fetchProjects } from '@/lib/slices/ProjectSlice';

const tdata: Array<any> = [
    {
        id: '1',
        projectName: 'Solana ABC',
        description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
        adoLink: '#',
        status: 'draft',
        isPublic: 'No',
        dateCreated: '2024-11-27',
    },
    {
        id: '2',
        projectName: 'Stellar XYZ',
        description: 'Amet consectetur lorem ipsum dolor sit amet consectetur adipiscing elit',
        adoLink: '#',
        status: 'draft',
        isPublic: 'No',
        dateCreated: '2024-11-27',
    }
];
const Projects = () => {
    const { projects } = useAppSelector(state => state.project);
    const clonedProjects = projects.map(project => ({ ...project }));

    const dispatch = useAppDispatch();
    useEffect(() => {
        const fetchData = async () => {
            dispatch(fetchProjects());
        };
        fetchData();
    }, [dispatch]);

    if (!projects) {
        return <div>Loading...</div>
    }

    return (
        <div className={styles.contentContainer}>
            <div className={styles.contentHeaderWrapper}>
                <div className={styles.rect}></div>
                <div className={styles.contentHeader}>
                    <div className={styles.title}>
                        Projects
                    </div>
                    <div className={styles.btn}>
                        <CreateNewProjectBtn />
                    </div>
                </div>
            </div>
            <div className={styles.tableWrapper}>
                <div className='ap-table-demo'>
                    <Table originalData={clonedProjects} hasTitle striped>
                        <Column field="name">Project Name</Column>
                        <Column field="description">Description</Column>
                        <Column field="ado_id">ADO Link</Column>
                        <Column field="status">Status</Column>
                        <Column field="isPublic">Public</Column>
                        <Column field="dateCreated">Date Created</Column>
                        <Column field="action">
                            <span>Actions</span>
                        </Column>
                    </Table>
                </div>
            </div>
        </div>


    )
}

export default Projects;
