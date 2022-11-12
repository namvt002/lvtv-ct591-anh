import {useEffect, useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';
// material
import {Container} from '@material-ui/core';
// routes
import {PATH_DASHBOARD} from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import BookNewForm from "../../components/_dashboard/book/BookNewForm";

// ----------------------------------------------------------------------

export default function UserCreate() {
    const {themeStretch} = useSettings();
    const {pathname} = useLocation();
    const {id} = useParams();
    const isEdit = pathname.includes('edit');
    const [current, setCurrent] = useState({});

    useEffect(() => {
        (async () => {
            if (isEdit) {
                const _res = await getData(API_BASE_URL + `/book/${id}`);
                setCurrent(_res.data);
            }
        })();
    }, [id, isEdit]);

    return (
        <Page title="Book | HYPE">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={!isEdit ? 'Thêm sách' : 'Chỉnh sửa'}
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'sách', href: PATH_DASHBOARD.book.root},
                        {name: !isEdit ? 'Thêm sách' : id},
                    ]}
                />
                <BookNewForm isEdit={isEdit} currentProduct={current} id={id}/>
            </Container>
        </Page>
    );
}
