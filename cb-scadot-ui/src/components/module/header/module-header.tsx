'use client';
import { Badge, Button } from '@appkit4/react-components';
import { formatDate } from '@/utils/transformUtil';
import styles from '@/components/project/styles/project.module.css';

interface ModuleHeaderProps {
    projectName: string;
    projectId: string;
    moduleData?: {
        status: string;
        visibility: string;
        networkName: string;
        date_time_created: string;
        name?: string;
    };
}

export default function ModuleHeader({ projectName, projectId, moduleData }: ModuleHeaderProps) {
    return (
        <div className={styles.headerWrapper}>
            <div className={styles.headerContainer}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '24px',
                    width: '100%'
                }}>
                    <div style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        minWidth: '200px'
                    }}>
                        {moduleData?.name || 'New Module'}
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px'
                    }}>
                        <span className="text-sm">Status</span>
                        <Badge 
                            value={moduleData?.status || 'Draft'} 
                            type={'primary'} 
                        />
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px'
                    }}>
                        <span className="text-sm">Visibility</span>
                        <span>
                            {moduleData?.visibility === 'public' ? 'Public' : 'Private'}
                        </span>
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px'
                    }}>
                        <span className="text-sm">Network</span>
                        <span>{moduleData?.networkName || 'Ethereum'}</span>
                    </div>
                    {moduleData && (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px'
                        }}>
                            <span className="text-sm">Date Created</span>
                            <span>{formatDate(moduleData.date_time_created)}</span>
                        </div>
                    )}
                </div>
                <div className={styles.buttonsSection}>
                    <Button icon="icon-wallet-outline" onClick={() => {}}>
                        Connect Wallet
                    </Button>
                </div>
            </div>
        </div>
    );
}