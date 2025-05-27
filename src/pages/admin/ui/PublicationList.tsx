import {
    Datagrid,
    List,
    TextField,
    DateField,
    useNotify,
    useRefresh,
    useRecordContext,
} from 'react-admin';
import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axiosClient from '../../../shared/api/client';

const ApproveButton = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleApprove = async () => {
        try {
            await axiosClient.post(`/admin/publications/${record?.id}/approve`);
            notify('Approved');
            refresh();
        } catch (error) {
            notify('Error approving publication', { type: 'error' });
        }
    };

    return (
        <Button size="small" color="success" onClick={handleApprove}>
            <CheckIcon fontSize="small" /> Одобрить
        </Button>
    );
};

const RejectButton = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleReject = async () => {
        try {
            await axiosClient.post(`/admin/publications/${record?.id}/reject`);
            notify('Rejected');
            refresh();
        } catch (error) {
            notify('Error rejecting publication', { type: 'error' });
        }
    };

    return (
        <Button size="small" color="error" onClick={handleReject}>
            <CloseIcon fontSize="small" /> Отклонить
        </Button>
    );
};

export const PublicationList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" label="ID" />
            <TextField source="title" label="Название" />
            <TextField source="text" label="Текст" />
            <TextField source="moderation_state" label="Состояние модерации" />
            <DateField source="created_at" label="Дата создания" />
            <ApproveButton />
            <RejectButton />
        </Datagrid>
    </List>
);
