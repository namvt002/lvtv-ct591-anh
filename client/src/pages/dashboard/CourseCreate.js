import {useEffect, useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';
// material
import {Container} from '@material-ui/core';
// routes
import {PATH_DASHBOARD} from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// componentsKhoaHocNewForm
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import CourseNewForm from "../../components/_dashboard/course/CourseNewForm";

// ----------------------------------------------------------------------

export default function CourseCreate() {
    const {themeStretch} = useSettings();
    const {pathname} = useLocation();
    const {id} = useParams();
    const isEdit = pathname.includes('edit');
    const [current, setCurrent] = useState({});

    useEffect(() => {
        (async () => {
            if (isEdit) {
                const _res = await getData(API_BASE_URL + `/api/khoahoc/${id}`);
                setCurrent(_res.data[0]);
            }
        })();
    }, [id, isEdit]);

    return (
        <Page title="KhoaHoc | Learn Code">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={!isEdit ? 'Thêm khóa học' : 'Chỉnh sửa'}
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'Khóa học', href: PATH_DASHBOARD.course.root},
                        {name: !isEdit ? 'Thêm khóa học' : id},
                    ]}
                />
                <CourseNewForm isEdit={isEdit} current={current} id={id}/>
            </Container>
        </Page>
    );
}
