import { Button } from '@appkit4/react-components/button';

interface CreateNewModuleBtnProps {
    onClick: () => void;
}

const CreateNewModuleBtn: React.FC<CreateNewModuleBtnProps> = ({ onClick }) => {
    return (
        <Button onClick={onClick} kind="secondary" icon="icon-plus-outline">
            Create new module
        </Button>
    )
}

export default CreateNewModuleBtn;