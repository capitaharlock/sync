import { Button } from '@appkit4/react-components/button';
import { useRouter } from 'next/navigation';

const CreateNewProjectBtn = () => {
    const router = useRouter();
    const handleClick = () => {
        router.push('/projects/new');
    };
    return (
        <Button kind="primary" icon="icon-plus-outline" onClick={handleClick}>
            Create new project
        </Button>
    );
}

export default CreateNewProjectBtn;
