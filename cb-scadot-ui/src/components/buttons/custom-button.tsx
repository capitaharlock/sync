'use client';
import { Button as AppKitButton } from '@appkit4/react-components/button';

interface ButtonProps {
 type?: 'button' | 'submit';
 kind?: 'primary' | 'secondary';
 icon?: string;
 disabled?: boolean;
 onClick?: () => void;
 children: React.ReactNode;
 className?: string;
}

export const Button: React.FC<ButtonProps> = ({
 type = 'button',
 kind = 'primary',
 icon,
 disabled,
 onClick,
 children,
 className
}) => {
 return (
   <AppKitButton
     type={type}
     kind={kind}
     icon={icon}
     disabled={disabled}
     onClick={onClick}
     className={className}
   >
     {children}
   </AppKitButton>
 );
};
