'use client';
import { Navigation, NavigationItem } from '@appkit4/react-components/navigation';
import React from 'react';
import { useRouter } from 'next/navigation';

import styles from './Sidebar.module.css';


const NavigationSidebar = () => {
    const router = useRouter();
    const handleClick = (item: NavigationItem) => {
        const key = item.name.toLowerCase();
        const path = navItems[key];
        if (path) {
            router.push(path);
        }
    };
    const navItems: { [key: string]: string } = {
        projects: '/projects',
        module: '/module-editor'
    }
    const navList: NavigationItem[] = [
        {
            name: 'Projects',
            prefixIcon: 'budget',
            prefixCollapsedIcon: 'budget',
        },
        {
            name: 'Module',
            prefixIcon: 'edit',
            prefixCollapsedIcon: 'edit'
        },
        {
            name: 'Item 2',
            prefixIcon: 'ask-question',
            prefixCollapsedIcon: 'ask-question',
        },
        {
            name: 'Item 3',
            prefixIcon: 'calculator',
            prefixCollapsedIcon: 'calculator',
        }
    ];

    const [collapsed, setCollapsed] = React.useState(false);
    const [selectedKey, setSelectedKey] = React.useState('0');

    const onCollapseEvent = (collapsed: boolean, event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        setCollapsed(collapsed);
    }
 
    return (
        <aside className="sidebar">
            <Navigation
                hasHeader={false}
                width={80}
                hasFooter={false}
                className={styles.leftnav}
                navList={navList}
                showTooltip={true}
                collapsed={collapsed}
                selectedKey={selectedKey}
                defaultOpenKeys={[]}
                onItemClick={(event: any, item: NavigationItem, key: string) => {
                    setSelectedKey(key);
                    handleClick(item);
                }}
                // onClickCollapseEvent={onCollapseEvent}
                >
            </Navigation>
        </aside>
    );
}
export default NavigationSidebar;

