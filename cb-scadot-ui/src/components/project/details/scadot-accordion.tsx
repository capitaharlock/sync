// RJJ-TODO no needed right ?
// 'use client';
import React, { useEffect, useState } from 'react';
import styles from './projects.module.css';
import { useAppSelector } from "@/lib/reduxHooks";
type AccordionProps = {
  stepNumber: number;
  title: string;
  children: React.ReactNode;
};


const ScadotAccordion: React.FC<AccordionProps> = ({ stepNumber, title, children }) => {
  const { createProjectProgress } = useAppSelector(state => state.app);
  const isCurrentStep = (createProjectProgress.currentStep) === stepNumber;
  
  const [isOpen, setIsOpen] = useState(isCurrentStep);
  
  useEffect(() => {
    setIsOpen(isCurrentStep);
  }, [isCurrentStep]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.accordionWrapper}>
      <div className={styles.workAreaHead} onClick={toggleAccordion} >
          <div className={styles.accordionHeader}>
            <div className={styles.accordionHeaderTitle}>
              <div className={styles.titleIcon}>
                <div className={styles.titleIconOutline}>
                  <span className={styles.titleIconOutlineLabel}>{stepNumber}</span>
                </div>
              </div>
              <div>
                <span>{title}</span>
              </div>
            </div>
            <div>
              <span className={isOpen ? "Appkit4-icon icon-up-chevron-outline appkit4-icon-alternate" : "Appkit4-icon icon-down-chevron-outline appkit4-icon-alternate" }></span>
            </div>
          </div>
      </div>
      
      {isOpen && (
        <div>
          {children}
        </div>
      )}
    </div>

  );
};




export default ScadotAccordion;