'use client';
import {
  Header as AppkitHeader,
  HeaderOptionItem,
} from '@appkit4/react-components/header';
import { Avatar } from '@appkit4/react-components/avatar';

const HEADER_TITLE = 'SCADOT';

const Header = () => {
  let avatarLabel = 'ME';

  return (
    
      <AppkitHeader
        type="transparent"
        // className="pl-[var(--page-padding)] pr-[var(--header-right-padding)]"
        titleTemplate={() => (
          <div>
            <span className="pr-3">{HEADER_TITLE}</span>
          </div>
        )}
        optionsTemplate={() => {
          return(null);
          // return (
          //   <>
          //     <HeaderOptionItem
          //       iconName="notification-outline"
          //       label=""></HeaderOptionItem>
          //     <HeaderOptionItem
          //       iconName="help-question-outline"
          //       label=""></HeaderOptionItem>
          //     <HeaderOptionItem
          //     iconName="log-out-outline"
          //     label=""
          //     onClick={() => console.log('Logout')}></HeaderOptionItem>
          //   </>
          // );
        }}
        userTemplate={() => (
          <Avatar
            label={avatarLabel}
            role="button"
            disabled={false}
          ></Avatar>
        )}
      ></AppkitHeader>

  );
};

export default Header;
