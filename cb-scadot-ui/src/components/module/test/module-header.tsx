import { Badge, Button } from '@appkit4/react-components'
import styles from './index.module.css'
import { useAppDispatch, useAppSelector } from '@/lib/reduxHooks';
import { fetchProjects } from "@/lib/slices/ProjectSlice";
import { useEffect, useState } from 'react';
import { Project } from '@/lib/type-helper';
import { connectWallet, Network, WalletConnection } from '../../../utils/walletConnection';
import { Breadcrumb, BreadcrumbItem } from '@appkit4/react-components/breadcrumb';
import { formatDate, transformVisibility } from '@/utils/transformUtil';



export default function ModuleHeader() {
    const [walletConnection, setWalletConnection] = useState<WalletConnection | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const { projects } = useAppSelector(state => state.project);
    let projectItem: Project = projects[0];
    useEffect(() => {
        const fetchData = async () => {
            dispatch(fetchProjects());
            projectItem = projects[0];
        };
        fetchData();
    }, [dispatch]);

    const getNetwork = (networkName: string): Network => {
        if (networkName.toLowerCase() === 'ethereum') {
            return Network.Ethereum;
        } else if (networkName.toLowerCase() === 'stellar') {
            return Network.Stellar;
        }
        throw new Error('Unsupported network');
    }
    const handleConnectWallet = async (networkName: string) => {
        const network = getNetwork(networkName);
        try {
            const connection = await connectWallet(network);
            await connection.connect();
            const account = await connection.getAccount();
            setWalletConnection(connection);
            setAccount(account);
            console.log(`Connected to ${network} wallet: ${account}`);
        } catch (error) {
            console.error(`Failed to connect to ${network} wallet:`, error);
        }
    };
    const handleDisconnectWallet = async () => {
        if (walletConnection) {
            await walletConnection.disconnect();
            setWalletConnection(null);
            setAccount(null);
            console.log('Disconnected wallet');
        }
    };

    if (!projectItem) {
        return null;
    }

    return (
        <div className={styles.contentHeaderWrapper}>
            <div className={styles.breadcrumContainer}>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <a href="#" tabIndex={0}>Projects</a>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <a href="#" tabIndex={1}>{projectItem.name}</a>
                        </BreadcrumbItem>
                    </Breadcrumb>
                <div>{projectItem.networkName}</div>
            </div>
            <div className={styles.headerContainer835558451}>
                <div className={styles.headerDetailsContainer}>
                    <div className={styles.headerItem}>
                        <span>Status</span>
                        <Badge value={projectItem.status} type={'primary'} />
                    </div>
                    <div className={styles.headerItem}>
                        <span>Public</span>
                        <div className={styles.headerItemIcon}>
                            {transformVisibility(projectItem.visibility)}
                        </div>
                    </div>
                    <div className={styles.headerItem}>
                        <span>ADO Link</span>
                        <div className={styles.headerItemIcon}>
                            <Badge size={'lg'} type={'info-outlined'} value={projectItem.ado_id} />
                        </div>
                    </div>
                    <div className={styles.headerItem}>
                        <span>Date Created</span>
                        <span>{formatDate(projectItem.date_time_created)}</span>
                    </div>
                </div>
                <div className={styles.spacer50}></div>
                <div className={styles.walletContainer}>
                    {account ? (
                        <>
                            <Button icon="icon-wallet-outline" onClick={handleDisconnectWallet}>Disconnect Wallet</Button>
                        </>
                    ) : (
                        // onClick={() => handleConnectWallet(projectItem.networkName)}
                        <Button icon="icon-wallet-outline" onClick={() => handleConnectWallet("ethereum")}>
                            Connect {projectItem.networkName} Wallet
                        </Button>
                    )}
                </div>
                <div>
                    Project Settings
                </div>
            </div>



        </div>
    )
}

