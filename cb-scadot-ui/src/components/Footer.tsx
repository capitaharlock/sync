import { Footer } from '@appkit4/react-components/footer';

const PwCFooter = () => {
  const getCurrentYear = () => new Date().getFullYear();
  
  const footerContent =
    '© ' + getCurrentYear() + ' PwC US. All rights reserved. PwC US refers to the US group of member firms and may sometimes refer to the PwC network. Each member firm is a separate legal entity.';
  const footerType = 'text';

  return (
        <Footer content={footerContent} type={footerType}></Footer>
  );
};

export default PwCFooter;
