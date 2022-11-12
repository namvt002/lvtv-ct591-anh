import {useEffect, useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';
// material
import {Container} from '@material-ui/core';
// redux
// routes
import {PATH_DASHBOARD} from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {API_BASE_URL} from '../../config/configUrl';
import {getData} from '../../_helper/httpProvider';
import RoleNewForm from '../../components/_dashboard/Role/RoleNewForm';

// ----------------------------------------------------------------------

export default function RoleCreate() {
    const {themeStretch} = useSettings();
    const {pathname} = useLocation();
    const {id} = useParams();
    const isEdit = pathname.includes('edit');
    const [currentRole, setCurrentRole] = useState();

    useEffect(() => {
        (async () => {
            const _role = await getData(API_BASE_URL + `/role/${id}`);
            setCurrentRole(_role.data[0]);
        })();
    }, [id]);

    return (
        <Page title="Role | Hype">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={!isEdit ? 'Tạo quyền' : 'Chỉnh sửa'}
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'quyền', href: PATH_DASHBOARD.role.root},
                        {name: !isEdit ? 'Thêm quyền' : id},
                    ]}
                />

                <RoleNewForm isEdit={isEdit} currentRole={currentRole} id={id}/>
            </Container>
        </Page>
    );
}
