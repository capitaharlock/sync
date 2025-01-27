// File: src/components/module/execute.tsx

import { useEffect, useState } from 'react';
import styles from './index.module.css'
import { Badge } from '@appkit4/react-components/badge';
import SlidingPanel from '../sliding-panel/sliding-panel';
import { useAppDispatch, useAppSelector } from '@/lib/reduxHooks';
import { fetchApiSpecs, setExecutionStatus } from '@/lib/slices/ApiTestingSlice';
import { ApiTestingStatus, DisplayDetails, DisplayItem, PathDetailItem, ScOpenApiSpec } from '@/lib/type-helper';

export default function ModuleExecutePanel() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const { specs } = useAppSelector(state => state.apiTesting);
    const dispatch = useAppDispatch();
    const [selectedItem, setSelectedItem] = useState<DisplayItem | null>(null);
    const [selectedItemSpecs, setSelectedItemSpecs] = useState<PathDetailItem | null>(null);

    useEffect(() => {
        dispatch(fetchApiSpecs());
    }, [dispatch]);

    const handleItemClick = (item: DisplayItem) => {
        setSelectedItem(item);
        setIsPanelOpen(true);
        setSelectedItemSpecs(specs.paths[item.path]);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setSelectedItem(null);
        dispatch(setExecutionStatus(ApiTestingStatus.NOT_STARTED));
    };
    
    const displayItems = parseOpenApiSpec(specs);
    
    return (
        <div className={styles.right}>
            <ItemListing 
                isOpen={isPanelOpen} 
                displayItems={displayItems} 
                onClick={handleItemClick} 
            />
            <SlidingPanel 
                isOpen={isPanelOpen} 
                onClose={handleClosePanel} 
                displayItem={selectedItem} 
                itemSpecs={selectedItemSpecs} 
            />
        </div>
    )
}

type ListingProps = {
    isOpen: boolean;
    displayItems: DisplayDetails;
    onClick: (item: DisplayItem) => void;
};

const ItemListing: React.FC<ListingProps> = ({isOpen, displayItems, onClick}) => {
    if (isOpen) {
        return null;
    }

    return (
        <div className={styles.frame835558412}>
            <div className={styles.frame835558428}>
                <div className={styles.listFrame835558459}>
                    {displayItems.items.map(item => (
                        <div key={item.path} className={styles.listItemContainer}>
                            <div className={styles.listItem} onClick={() => onClick(item)}>
                                <div className={styles.listItemBadgeContainer}>
                                    <Badge value={item.methodName} type={'primary'} />
                                </div>
                                <div className={styles.listItemPath}>{item.path}</div>
                                <span className={styles.listItemSpacer}></span>
                                <div className={styles.listItemSummary}>{item.summary}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

function parseOpenApiSpec(spec: ScOpenApiSpec): DisplayDetails {
    const details: DisplayDetails = {
        info: spec.info,
        items: []
    }
    
    for (const path in spec.paths) {
        const pathItem = spec.paths[path];
        if (pathItem.get) {
            details.items.push({
                methodName: "GET",
                path: path,
                summary: pathItem.get.summary
            });
        }
        if (pathItem.post) {
            details.items.push({
                methodName: "POST",
                path: path,
                summary: pathItem.post.summary
            });
        }
    }
    
    return details;
}