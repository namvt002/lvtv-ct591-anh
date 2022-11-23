import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {useSnackbar} from 'notistack5';
import {useEffect, useState} from 'react';
import {Form, FormikProvider, useFormik} from 'formik';
// material
import {styled} from '@material-ui/core/styles';
import {LoadingButton} from '@material-ui/lab';
import {
    Autocomplete,
    Box,
    Button,
    Card,
    Divider,
    FormControlLabel,
    Grid,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@material-ui/core';
import {Icon} from '@iconify/react';
// utils
// routes
//
import {QuillEditor} from '../../editor';
import {getData, postData, putData} from '../../../_helper/httpProvider';
import {API_BASE_URL} from '../../../config/configUrl';
import {MIconButton} from '../../@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';
import Editor from '@monaco-editor/react';
import Code from "../../code/Code";
import {useDispatch} from "react-redux";
import {runCode} from "../../../redux/slices/code";
import {PATH_PAGE} from "../../../routes/paths";
import {useNavigate} from "react-router-dom";

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({theme}) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

const Language = [{
    id: 'html',
    name: 'HTML'
}, {
    id: 'css',
    name: 'CSS'
}, {
    id: 'Javascript',
    name: 'javascript'
}, {
    id: 'python',
    name: 'Python'
}]
// {
//     id: 'nodejs',
//         name: 'Nodejs'
// }

// ----------------------------------------------------------------------

LessonNewForm.propTypes = {
    isEdit: PropTypes.bool,
    currentProduct: PropTypes.object,
};

export default function LessonNewForm({isEdit, current}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [courses, setCourses] = useState([]);
    const [lesson, setLesson] = useState([]);
    const [idndbh, setIdndbh] = useState(1);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const _res = await getData(API_BASE_URL + '/api/khoahoc');
            setCourses(_res.data);

            if (isEdit) {
                let arr = [];
                arr = current?.noi_dung?.map(e => e.ndbh_id);
                if (arr?.length > 0) setIdndbh(Number(Math.max(...arr)) + 1);
                setLesson(current.noi_dung)
            }
        })()
    }, [isEdit, current]);

    const NewSchema = Yup.object().shape({
        bh_idkh: Yup.object().required('Vui lòng chọn khóa học'),
        bh_ten: Yup.string().required('Vui lòng nhập tên bài học'),
        kh_code: Yup.string(),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            bh_idkh: current?.kh_id ? {
                kh_id: current.kh_id,
                kh_ten: current.kh_ten
            } : '',
            bh_ten: current?.bh_ten || '',
            bh_mota: '',
            bh_tieude: '',
            bh_code: '',
            active: true,
            bh_active: false,
            bh_lang: '',
            bh_idndbh: ''
        },
        validationSchema: NewSchema,
        onSubmit: async (values, {setSubmitting, resetForm, setErrors}) => {
            let _values = {...values};
            try {
                if (lesson.length === 0) return enqueueSnackbar('Chưa có nội dung bài học!', {
                    variant: 'error',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill}/>
                        </MIconButton>
                    ),
                });
                let _values = {...values};
                if (isEdit) {
                    delete _values.ndbh_id;
                    _values.bai_hoc = lesson;
                    await putData(API_BASE_URL + `/api/baihoc/${current.bh_id}`, _values);
                } else {
                    _values.bai_hoc = lesson;
                    await postData(API_BASE_URL + '/api/baihoc', _values);
                }
                enqueueSnackbar(isEdit ? 'Cập nhật thành công' : 'Thêm thành công!', {
                    variant: 'success',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill}/>
                        </MIconButton>
                    ),
                })

            } catch (error) {
                console.error(error);
                enqueueSnackbar(error.response.data, {
                    variant: 'error',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill}/>
                        </MIconButton>
                    ),
                });
            }
        },
    });

    const {
        errors,
        values,
        touched,
        handleSubmit,
        setFieldValue,
        getFieldProps,
    } = formik;

    function handleEditorChange(value, event) {
        setFieldValue('bh_code', value);
    }

    const addLesson = () => {
        setLesson(pre => [...pre, {
            bh_tieude: values.bh_tieude,
            bh_code: values.bh_code,
            bh_mota: values.bh_mota,
            bh_active: values.bh_active,
            bh_lang: values.bh_lang,
            ndbh_id: idndbh
        }]);
        setIdndbh(e => e + 1);
        setFieldValue('bh_tieude', '');
        setFieldValue('bh_mota', '');
        setFieldValue('bh_code', '');
        setFieldValue('bh_active', false);
        setFieldValue('bh_lang', '');
        setFieldValue('bh_idndbh', '');
    }

    const removeLesson = (id) => {
        setLesson(lesson.filter(e => e.ndbh_id !== id));
    }

    const editLesson = (id, value) => {
        let lang = Language.filter(e => e.id = value.bh_lang)[0]
        setFieldValue('bh_tieude', value.bh_tieude);
        setFieldValue('bh_mota', value.bh_mota);
        setFieldValue('bh_code', value.bh_code);
        setFieldValue('bh_active', value.bh_active);
        setFieldValue('bh_lang', lang);
        setFieldValue('bh_idndbh', id);
    }

    const confirmEditLesson = () => {
        const index = lesson.findIndex(e => e.ndbh_id === values.bh_idndbh);
        if (index !== -1) {
            let val = [...lesson];
            val[index] = {
                bh_tieude: values.bh_tieude,
                bh_code: values.bh_code,
                bh_mota: values.bh_mota,
                bh_active: values.bh_active,
                bh_lang: values.bh_lang,
                ndbh_id: values.bh_idndbh
            }
            setLesson(val);

            setFieldValue('bh_tieude', '');
            setFieldValue('bh_mota', '');
            setFieldValue('bh_code', '');
            setFieldValue('bh_active', false);
            setFieldValue('bh_lang', '');
            setFieldValue('bh_idndbh', '');
        }
    }

    return (
        <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <Stack spacing={3}>
                            <Card sx={{p: 2}}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            {...getFieldProps('active')}
                                            checked={values.active}
                                        />
                                    }
                                    label="Trạng thái (Ẩn/hiện)"
                                    sx={{mb: 2}}
                                />

                                <Autocomplete
                                    freeSolo
                                    value={values.bh_idkh}
                                    onChange={(event, newValue) => {
                                        setFieldValue('bh_idkh', newValue || '');
                                    }}
                                    options={courses?.map((option) => ({
                                        kh_id: option.kh_id,
                                        kh_ten: option.kh_ten,
                                    }))}
                                    renderInput={(params) => (
                                        <TextField
                                            label="Khóa học"
                                            {...params}
                                            error={Boolean(touched.bh_idkh && errors.bh_idkh)}
                                            helperText={touched.bh_idkh && errors.bh_idkh}
                                        />
                                    )}
                                    getOptionLabel={(option) => option.kh_ten || ''}
                                />

                                <TextField
                                    label="Tên bài học"
                                    multiline
                                    fullWidth
                                    {...getFieldProps('bh_ten')}
                                    margin='normal'
                                    rows={2}
                                    error={Boolean(touched.bh_ten && errors.bh_ten)}
                                    helperText={touched.bh_ten && errors.bh_ten}
                                />
                            </Card>

                            <Card sx={{p: 3}}>
                                <Grid container spacing={{xs: 3, sm: 2}}>
                                    <Grid item xs={12} md={12}>
                                        <TextField
                                            label="Tiêu đề"
                                            {...getFieldProps('bh_tieude')}
                                            multiline
                                            fullWidth
                                            margin='normal'
                                            rows={2}
                                        />
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <div>
                                            <LabelStyle sx={{marginTop: '1rem'}}>Mô tả</LabelStyle>
                                            <QuillEditor
                                                simple
                                                id="product-description"
                                                value={values.bh_mota}
                                                placeholder="Mô tả ..."
                                                onChange={(val) => setFieldValue('bh_mota', val)}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <LabelStyle> Code </LabelStyle>
                                        <div>
                                            <Editor
                                                width="96%"
                                                height="250px"
                                                defaultLanguage="html"
                                                value={values.bh_code}
                                                theme="vs-dark"
                                                onChange={handleEditorChange}
                                            />
                                        </div>
                                        <Stack direction='row' sx={{mt: '2rem'}} display='flex' alignItems='center'
                                               justifyContent='center'>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        {...getFieldProps('bh_active')}
                                                        checked={values.bh_active}
                                                    />
                                                }
                                                label="Thực thi"
                                                sx={{mb: 2}}
                                            />
                                            <Autocomplete
                                                freeSolo
                                                value={values.bh_lang}
                                                onChange={(event, newValue) => {
                                                    setFieldValue('bh_lang', newValue || '');
                                                }}
                                                options={Language?.map((option) => ({
                                                    id: option.id,
                                                    name: option.name,
                                                }))}
                                                renderInput={(params) => (
                                                    <TextField
                                                        label="Ngôn ngữ"
                                                        {...params}
                                                        sx={{width: '25rem'}}
                                                        error={Boolean(touched.bh_lang && errors.bh_lang)}
                                                        helperText={touched.bh_lang && errors.bh_lang}
                                                    />
                                                )}
                                                getOptionLabel={(option) => option.name || ''}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Stack>
                                        {!values?.bh_idndbh &&
                                            <Button onClick={addLesson} variant='outlined'>Thêm nội dung bài
                                                học</Button>}
                                        {!!values?.bh_idndbh &&
                                            <Button onClick={confirmEditLesson} variant='outlined'>Lưu</Button>}
                                    </Stack>
                                </Grid>
                            </Card>
                        </Stack>
                        <LoadingButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{mt: 2}}
                        >
                            {!isEdit ? 'Thêm bài học' : 'Lưu'}
                        </LoadingButton>
                    </Grid>
                    {lesson?.length > 0 && (
                        <Grid item xs={12} md={12}>
                            <Card sx={{p: 4}}>
                                <Stack direction='row' alignItems='center' justifyItems='center`'>
                                    <Typography>Khóa học: </Typography>
                                    <Typography sx={{mx: 2}} variant='h5'>{values.bh_idkh?.kh_ten}</Typography>
                                </Stack>
                                <Typography variant='h5'>{values.bh_ten}</Typography>
                                <Divider sx={{my: 2}}/>
                                {lesson?.map((e, idx) => (
                                    <Box key={idx}>
                                        <Stack direction='row'>
                                            <Button startIcon={<Icon icon="ep:remove-filled" color="#F44336"/>}
                                                    onClick={() => {
                                                        removeLesson(e.ndbh_id)
                                                    }}>
                                                Xóa
                                            </Button>
                                            <Button color='warning'
                                                    startIcon={<Icon icon="akar-icons:edit" color="#0045FF"/>}
                                                    onClick={() => {
                                                        editLesson(e.ndbh_id, {
                                                            bh_tieude: e.bh_tieude,
                                                            bh_code: e.bh_code,
                                                            bh_mota: e.bh_mota,
                                                            bh_active: !!e.bh_active,
                                                            bh_lang: e.bh_lang
                                                        })
                                                    }}>
                                                Chỉnh sửa
                                            </Button>
                                        </Stack>
                                        <Typography variant='h6'>{e.bh_tieude}</Typography>
                                        <Box dangerouslySetInnerHTML={{__html: e.bh_mota}}/>
                                        <Box>
                                            <Code code={e.bh_code} language={isEdit ? e.bh_lang : e.bh_lang.id}/>
                                        </Box>
                                        {e.bh_active ? <Button variant='contained' onClick={() => {
                                            dispatch(runCode({
                                                code: e.bh_code,
                                                lang: isEdit ? e.bh_lang : e.bh_lang.id
                                            }));
                                            navigate(PATH_PAGE.code, {replace: true})
                                        }} sx={{width: '20rem', my: 1}}>Chạy thử</Button> : ''}
                                    </Box>
                                ))}
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Form>
        </FormikProvider>
    )
        ;
}
