// File: src/components/module/editor.tsx

import styles from './index.module.css'
import JsonCodeEditor from './editor/json-code-editor';
//import { useAppSelector } from '@/lib/reduxHooks';

const initialCode = `{
   // Add your code here
}`;

export default function ModuleEditor() {
   //const { specs } = useAppSelector(state => state.apiTesting);
   
   const handleCodeChange = (code: string) => {
       console.log("update code " + code);
   }

   return (
       <div className={styles.right}>
           <div className={styles.frame83558458}>
               <div className={styles.jsonPanel}>
                   <div className={styles.jsonHeader58417}>
                       <div>
                           Module Dropdown
                       </div>
                   </div>
                   <div className={styles.jsonPane584376}>
                       <div className={styles.code}>
                           <JsonCodeEditor 
                               onCodeChange={handleCodeChange}
                               initialValue={initialCode}
                           />
                       </div>
                       <div className={styles.statusBar}>
                           {/* status bar */}
                       </div>
                   </div>
               </div>
               <div className={styles.htmlPanel}>
                   <div className={styles.jsonHeader58417}>
                       <div>
                           Network ABC Dropdown
                       </div>
                       <div>
                           Data ABC
                       </div>
                   </div>
                   <div className={styles.jsonPane584376}>
                       <div className={styles.code}>
                           
                       </div>
                       <div className={styles.statusBar}>
                           {/* status bar */}
                       </div>
                   </div>
               </div>
           </div>
       </div>
   )
}