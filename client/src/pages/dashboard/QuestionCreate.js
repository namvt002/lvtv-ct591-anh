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
import QuestionNewForm from "../../components/_dashboard/question/QuestionNewForm";

// ----------------------------------------------------------------------

export default function QuestionCreate() {
    const {themeStretch} = useSettings();
    const {pathname} = useLocation();
    const {id} = useParams();
    const isEdit = pathname.includes('edit');
    const [current, setCurrent] = useState({});

    useEffect(() => {
        (async () => {
            if (isEdit) {
                const _res = await getData(API_BASE_URL + `/api/baikiemtra/${id}`);
                setCurrent(_res.data);
            }
        })();
    }, [id, isEdit]);

    return (
        <Page title="Bài kiểm tra">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={!isEdit ? 'Thêm bài kiểm tra' : 'Chỉnh sửa'}
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'Câu hỏi', href: PATH_DASHBOARD.question.root},
                        {name: !isEdit ? 'Thêm câu hỏi' : id},
                    ]}
                />
                <QuestionNewForm isEdit={isEdit} current={current} id={id}/>
            </Container>
        </Page>
    );
}
