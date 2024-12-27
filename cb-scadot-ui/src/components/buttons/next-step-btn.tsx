import { Button } from '@appkit4/react-components/button';
import { useAppDispatch, useAppSelector } from "@/lib/reduxHooks";
import { setCreateProjectProgress } from "@/lib/slices/AppSlice";
type ButtonProps = {
    stepNumber: number
};

const NextStepBtn: React.FC<ButtonProps> = ({ stepNumber }) => {
    const dispatch = useAppDispatch();
    const { createProjectProgress } = useAppSelector(state => state.app);
    const onButtonClick = () => {
        if (!createProjectProgress.currentStep) {
            createProjectProgress.currentStep = 1;
        }
        var nextStep = stepNumber + 1;
        const radioIndx = nextStep > 1 ? nextStep-1 : 0;
        console.log("current: ", createProjectProgress.currentStep, " nextStep: ", nextStep, " radio: ", radioIndx);
        dispatch(setCreateProjectProgress({currentStep: nextStep, radioIndex : radioIndx}));
    }
    return (
        <Button kind="primary" onClick={onButtonClick} >Go to next step</Button>
    )
}

export default NextStepBtn;