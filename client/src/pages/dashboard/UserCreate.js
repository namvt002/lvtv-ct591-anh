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
import UserNewForm from '../../components/_dashboard/user/UserNewForm';
import {API_BASE_URL} from '../../config/configUrl';
import {getData} from '../../_helper/httpProvider';

// ----------------------------------------------------------------------

export default function UserCreate() {
    const {themeStretch} = useSettings();
    const {pathname} = useLocation();
    const {id} = useParams();
    const isEdit = pathname.includes('edit');
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        (async () => {
            const _user = await getData(API_BASE_URL + `/user/${id}`);
            setCurrentUser(_user.data[0]);
        })();
    }, [id]);

    return (
        <Page title="Người dùng: Tạo người dùng">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={!isEdit ? 'Tạo tài khoản' : 'Chỉnh sửa'}
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'Người dùng', href: PATH_DASHBOARD.user.list},
                        {name: !isEdit ? 'Thêm tài khoản' : id},
                    ]}
                />

                <UserNewForm isEdit={isEdit} currentUser={currentUser} id={id}/>
            </Container>
        </Page>
    );
}