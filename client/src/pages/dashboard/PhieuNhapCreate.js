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
import PhieuNhapNewForm from '../../components/_dashboard/phieunhap/PhieuNhapNewForm';
import {useSelector} from 'react-redux';

// ----------------------------------------------------------------------

export default function PhieuNhapCreate() {
    const {themeStretch} = useSettings();
    const {pathname} = useLocation();
    const {id} = useParams();
    const isEdit = pathname.includes('edit');
    const [current, setCurrent] = useState({});
    const [user, setUser] = useState({});

    const {email} = useSelector((state) => state.user.current);

    useEffect(() => {
        (async () => {
            if (isEdit) {
                const _res = await getData(API_BASE_URL + `/phieunhap/${id}`);
                setCurrent(_res.data);
            }
            const _user = await getData(API_BASE_URL + `/user/${email}/email`);
            setUser(_user.data);
        })();
    }, [id, isEdit, email]);
    return (
        <Page title="PN | HYPE">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={!isEdit ? 'Phiếu nhập mới' : 'Chỉnh sửa'}
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'sách', href: PATH_DASHBOARD.phieunhap.root},
                        {name: !isEdit ? 'nhập hàng' : id},
                    ]}
                />

                <PhieuNhapNewForm
                    isEdit={isEdit}
                    current={current}
                    id={id}
                    user={user}
                />
            </Container>
        </Page>
    );
}
