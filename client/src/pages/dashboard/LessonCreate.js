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
import LessonNewForm from "../../components/_dashboard/lesson/LessonNewForm";

// ----------------------------------------------------------------------

export default function LessonCreate() {
    const {themeStretch} = useSettings();
    const {pathname} = useLocation();
    const {id} = useParams();
    const isEdit = pathname.includes('edit');
    const [current, setCurrent] = useState({});

    useEffect(() => {
        (async () => {
            if (isEdit) {
                const _res = await getData(API_BASE_URL + `/api/noidungbaihoc/${id}`);
                setCurrent(_res.data[0]);
            }
        })();
    }, [id, isEdit]);

    return (
        <Page title="KhoaHoc | Learn Code">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={!isEdit ? 'Thêm bài học' : 'Chỉnh sửa'}
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'Bài học', href: PATH_DASHBOARD.lesson.root},
                        {name: !isEdit ? 'Thêm bài học' : id},
                    ]}
                />
                <LessonNewForm isEdit={isEdit} current={current} id={id}/>
            </Container>
        </Page>
    );
}
