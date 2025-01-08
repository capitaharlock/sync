import styles from './index.module.css'
interface ModuleLeftNavProps {
    onPanelChange: (panelId: string) => void;
}

const ModuleLeftNav: React.FC<ModuleLeftNavProps> = ({ onPanelChange }) => {
    return (
        <div className={styles.left}>
            {/* <div className={styles.navItemContainer}>
                <div className={styles.navItem}>
                    <span className="Appkit4-icon appkit4-icon-alternate icon-edit-outline ap-font-24 ap-container-24 cursor-pointer" onClick={() => onPanelChange('editor')}></span>
                    <span>Editor</span>
                </div>
            </div> */}
            <div className={styles.navItemContainer}>
                <div className={styles.navItem}>
                    <span className={styles.icon}></span>
                    <span className="Appkit4-icon appkit4-icon-alternate icon-play-outline ap-font-24 ap-container-24 cursor-pointer"  onClick={() => onPanelChange('execute')}></span>
                    <span>Test</span>
                </div>
            </div>
        </div>
    );
};
export default ModuleLeftNav;
