import { Button } from '@appkit4/react-components/button';
import { useRouter } from 'next/navigation';

const CreateNewModuleBtn = ({ projectId }: { projectId: string }) => {
    const router = useRouter();
    const handleClick = () => {
        router.push(`/projects/${projectId}/modules/new`);
    };
    return (
        <Button kind="primary" icon="icon-plus-outline" onClick={handleClick}>
            Create new module
        </Button>
    );
}

export default CreateNewModuleBtn;
