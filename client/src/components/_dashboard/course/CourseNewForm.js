import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {useSnackbar} from 'notistack5';
import {useCallback} from 'react';
import {Form, FormikProvider, useFormik} from 'formik';
// material
import {styled} from '@material-ui/core/styles';
import {LoadingButton} from '@material-ui/lab';
import {
    Autocomplete,
    Card,
    FormControlLabel,
    FormHelperText,
    Grid,
    Icon,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@material-ui/core';
// utils
// routes
//
import {QuillEditor} from '../../editor';
import {UploadSingleFile} from '../../upload';
import {postData, putData} from '../../../_helper/httpProvider';
import {API_BASE_URL, URL_PUBLIC_IMAGES} from '../../../config/configUrl';
import {MIconButton} from '../../@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';
import Editor from '@monaco-editor/react';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({theme}) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

CourseNewForm.propTypes = {
    isEdit: PropTypes.bool,
    currentProduct: PropTypes.object,
};

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
}];

export default function CourseNewForm({isEdit, current}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const NewSchema = Yup.object().shape({
        kh_ten: Yup.string().required('Vui lòng nhập tên khóa học'),
        kh_mota: Yup.string().required('Vui lòng nhập mô tả'),
        kh_code: Yup.string(),
        kh_hinhanh: Yup.mixed().required('Vui lòng chọn hình ảnh'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            kh_ten: current?.kh_ten || '',
            kh_mota: current?.kh_mota || '',
            kh_code: current?.kh_code || '',
            kh_hinhanh: current?.kh_hinhanh ? URL_PUBLIC_IMAGES + `/${current?.kh_hinhanh}` : null,
            kh_code_lang: current?.kh_code_lang || '',
            kh_code_run: current?.kh_code_run || false,
            active: Boolean(current?.active) || true,
        },
        validationSchema: NewSchema,
        onSubmit: async (values, {setSubmitting, resetForm, setErrors}) => {
            let _values = {...values};
            try {
                const formDt = new FormData();
                formDt.append('kh_hinhanh', values.kh_hinhanh.file)
                formDt.append('data', JSON.stringify(_values));
                if (isEdit) {
                    await putData(
                        API_BASE_URL + `/api/khoahoc/${current.kh_id}`,
                        formDt,
                        {
                            'content-type': 'multipart/form-data',
                        },
                    );
                } else {
                    await postData(API_BASE_URL + '/api/khoahoc', formDt, {
                        'content-type': 'multipart/form-data',
                    });
                    resetForm();
                }
                enqueueSnackbar(!isEdit ? 'Thêm thành công' : 'Cập nhật thành công', {
                    variant: 'success',
                });
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
        setFieldValue('kh_code', value);
    }

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                setFieldValue('kh_hinhanh', {
                    file: file,
                    preview: URL.createObjectURL(file)
                });
            }
        },
        [setFieldValue]
    );

    return (
        <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <Card sx={{p: 3}}>
                            <Stack spacing={3}>
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
                                <TextField
                                    fullWidth
                                    label="Tên khóa học"
                                    {...getFieldProps('kh_ten')}
                                    error={Boolean(touched.kh_ten && errors.kh_ten)}
                                    helperText={touched.kh_ten && errors.kh_ten}
                                />

                                <Grid container spacing={{xs: 3, sm: 2}}>
                                    <Grid xs={12} md={6}>
                                        <div>
                                            <LabelStyle sx={{marginTop: '1rem'}}>Mô tả</LabelStyle>
                                            <QuillEditor
                                                simple
                                                id="product-description"
                                                value={values.kh_mota}
                                                placeholder="Mô tả ..."
                                                onChange={(val) => setFieldValue('kh_mota', val)}
                                            />
                                            {touched.kh_mota && errors.kh_mota && (
                                                <FormHelperText error sx={{px: 2}}>
                                                    {touched.kh_mota && errors.kh_mota}
                                                </FormHelperText>
                                            )}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <LabelStyle> Code </LabelStyle>
                                        <div>
                                            <Editor
                                                width="96%"
                                                height="250px"
                                                defaultLanguage="html"
                                                value={values.kh_code}
                                                theme="vs-dark"
                                                onChange={handleEditorChange}
                                            />
                                        </div>
                                        <Stack direction='row' sx={{mt: '2rem'}} display='flex' alignItems='center'
                                               justifyContent='center'>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        {...getFieldProps('kh_code_run')}
                                                        checked={values.kh_code_run}
                                                    />
                                                }
                                                label="Thực thi"
                                                sx={{mb: 2}}
                                            />
                                            <Autocomplete
                                                freeSolo
                                                value={values.kh_code_lang}
                                                onChange={(event, newValue) => {
                                                    setFieldValue('kh_code_lang', newValue || '');
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
                                                        error={Boolean(touched.kh_code_lang && errors.kh_code_lang)}
                                                        helperText={touched.kh_code_lang && errors.kh_code_lang}
                                                    />
                                                )}
                                                getOptionLabel={(option) => option.name || ''}
                                            />
                                        </Stack>
                                    </Grid>
                                </Grid>

                                <div>
                                    <LabelStyle>Thêm hình ảnh</LabelStyle>
                                    <UploadSingleFile
                                        maxSize={3145728}
                                        accept="image/*"
                                        file={values.kh_hinhanh}
                                        onDrop={handleDrop}
                                        error={Boolean(touched.kh_hinhanh && errors.kh_hinhanh)}
                                    />
                                    {touched.kh_hinhanh && errors.kh_hinhanh && (
                                        <FormHelperText error sx={{px: 2}}>
                                            {touched.kh_hinhanh && errors.kh_hinhanh}
                                        </FormHelperText>
                                    )}
                                </div>
                            </Stack>
                        </Card>
                        <LoadingButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                        >
                            {!isEdit ? 'Thêm khóa học' : 'Lưu'}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Form>
        </FormikProvider>
    );
}
