import React from 'react';
import styles from './project-team.module.css';
import { Combobox } from '@appkit4/react-components';

const TeamMemberSelectionPanel = () => {
    const data = [
        { label: 'Team Members', type: 'group', children: [
          { value: 'testUser1', label: 'Test User1' },
          { value: 'testUser2', label: 'Test User2' },
          { value: 'testUser3', label: 'Test User3' }
        ]
      }
    ];
    return (
        <div className={styles.teamMemberContainer}>
            <Combobox
                data={data}
                dropdownMatchWidth={true}
                showSelectAll={false}
                required={false}
                placeholder={"Combobox"}
                multiple
                valueKey={'value'}
                labelKey={"label"}
                showMultipleTags
            >
            </Combobox>
        </div>
        
    );
}

export default TeamMemberSelectionPanel;