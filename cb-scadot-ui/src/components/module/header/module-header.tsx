'use client';
import { useRouter, usePathname } from 'next/navigation';
import styles from '@/components/module/styles/module.module.css';
import { Badge, Button } from '@appkit4/react-components';

interface ModuleData {
    id?: number;
    name?: string;
    status?: string;
    visibility?: string;
    networkName?: string;
    date_time_created?: string;
}

interface ModuleHeaderProps {
    projectName?: string;
    projectId: string;
    moduleData?: ModuleData;
}

export default function ModuleHeader({ projectName, projectId, moduleData }: ModuleHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    
    console.log('[ModuleHeader] Current pathname:', pathname);
    console.log('[ModuleHeader] Received moduleData:', moduleData);
    console.log('[ModuleHeader] Module ID exists:', Boolean(moduleData?.id));
    console.log('[ModuleHeader] Project Name:', projectName);

    const handleNavigation = (path: string) => {
        if (!moduleData?.id) {
            console.log('[ModuleHeader] No navigation - missing moduleId');
            return;
        }
        const url = `/projects/${projectId}/modules/${moduleData.id}${path}`;
        console.log('[ModuleHeader] Navigating to:', url);
        router.push(url);
    };

    const hasExistingModule = Boolean(moduleData?.id);
    console.log('[ModuleHeader] hasExistingModule:', hasExistingModule);

    return (
        <div className={styles.headerWrapper}>
            <div className={styles.headerContainer}>
                <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "24px",
                    width: "100%"
                }}>
                    <div style={{
                        fontSize: "16px",
                        fontWeight: 500,
                        minWidth: "200px"
                    }}>
                        {moduleData?.name || "New Module"}
                    </div>
                    <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "8px"
                    }}>
                        <span className="text-sm">Status</span>
                        <Badge 
                            value={moduleData?.status || "Draft"} 
                            type={"primary"} 
                        />
                    </div>
                    <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "8px"
                    }}>
                        <span className="text-sm">Visibility</span>
                        <span>
                            {moduleData?.visibility === "public" ? "Public" : "Private"}
                        </span>
                    </div>
                    <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "8px"
                    }}>
                        <span className="text-sm">Network</span>
                        <span>{moduleData?.networkName || "Ethereum"}</span>
                    </div>
                    {moduleData?.date_time_created && (
                        <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "8px"
                        }}>
                        </div>
                    )}
                </div>
                <div className={styles.buttonsSection}>
                    <Button 
                        kind="secondary" 
                        icon="icon-settings-outline"
                        onClick={() => handleNavigation("")}
                        disabled={!hasExistingModule}
                    >
                        Settings
                    </Button>
                    <Button 
                        kind="secondary" 
                        icon="icon-pencil-outline"
                        onClick={() => handleNavigation("/editor")}
                        disabled={!hasExistingModule}
                    >
                        Design
                    </Button>
                    <Button 
                        kind="secondary" 
                        icon="icon-document-outline"
                        onClick={() => handleNavigation("/test")}
                        disabled={!hasExistingModule}
                    >
                        Documentation
                    </Button>
                </div>
            </div>
        </div>
    );
}