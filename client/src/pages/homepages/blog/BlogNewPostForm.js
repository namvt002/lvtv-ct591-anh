import * as Yup from 'yup';
import {useSnackbar} from 'notistack5';
import {useCallback, useState} from 'react';
import {Form, FormikProvider, useFormik} from 'formik';
// material
import {LoadingButton} from '@material-ui/lab';
import {styled} from '@material-ui/core/styles';
import {Button, Card, Container, FormHelperText, Stack, TextField, Typography} from '@material-ui/core';
// utils
// import fakeRequest from '../../../utils/fakeRequest';
//
//
import BlogNewPostPreview from './BlogNewPostPreview';
import {QuillEditor} from 'src/components/editor';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import {postData, putData} from 'src/_helper/httpProvider';
import {API_BASE_URL} from 'src/config/configUrl';
import {useSelector} from 'react-redux';

// ----------------------------------------------------------------------

const TAGS_OPTION = [
    'Toy Story 3',
    'Logan',
    'Full Metal Jacket',
    'Dangal',
    'The Sting',
    '2001: A Space Odyssey',
    "Singin' in the Rain",
    'Toy Story',
    'Bicycle Thieves',
    'The Kid',
    'Inglourious Basterds',
    'Snatch',
    '3 Idiots'
];

const LabelStyle = styled(Typography)(({theme}) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

export default function BlogNewPostForm({setShowForm, setLoad, post, isEdit, handleClose}) {
    console.log(post)
    const {enqueueSnackbar} = useSnackbar();
    const [open, setOpen] = useState(false);
    const userId = useSelector(state => state.user.current?.id);

    const handleOpenPreview = () => {
        setOpen(true);
    };

    const handleClosePreview = () => {
        setOpen(false);
    };

    const NewBlogSchema = Yup.object().shape({
        bv_tieude: Yup.string().required('Tiêu đề không được bỏ trống'),
        bv_noidung: Yup.string().min(1).required('Nội dung không được bỏ trống'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            bv_tieude: post?.bv_tieude ||  '',
            bv_noidung: !!post?.bv_noidung ? post.bv_noidung : '',
        },
        validationSchema: NewBlogSchema,
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            try {

              if(isEdit){
                await putData(API_BASE_URL + `/api/baiviet/${post.bv_id}`, values)
              }else{
                  const formDt = new FormData();
                  if (!!values.bv_anh?.file) formDt.append('bv_anh', values.bv_anh.file);
                  formDt.append('bv_iduser', userId);
                  formDt.append('data', JSON.stringify(values));
                  await postData(API_BASE_URL + '/api/baiviet', formDt, {
                      'content-type': 'multipart/form-data',
                  });
                  resetForm();
              }
                if (setLoad) setLoad(e => e + 1);
                handleClosePreview();
                if(handleClose) handleClose();
                setSubmitting(false);
                enqueueSnackbar(isEdit ? 'Chỉnh sửa bài viết thành công' : 'Thêm bài viết thành công', {variant: 'success'});
            } catch (error) {
                console.error(error);
                setSubmitting(false);
            }
        }
    });

    const {errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps} = formik;
    console.log(values)
    const handleDrop = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                setFieldValue('bv_anh', {
                    file,
                    preview: URL.createObjectURL(file)
                });
            }
        },
        [setFieldValue]
    );

    return (
        <>
            <Container>
                <HeaderBreadcrumbs
                    heading="Thêm bài viết"
                    links={[
                        {name: 'Trang chủ', href: '/'},
                        {name: isEdit ? 'Sửa bài viết' : 'Thêm bài viết'}
                    ]}
                />

                <FormikProvider value={formik}>
                    <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <Card sx={{p: 3}}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Tiêu đề bài viết"
                                    {...getFieldProps('bv_tieude')}
                                    error={Boolean(touched.bv_tieude && errors.bv_tieude)}
                                    helperText={touched.bv_tieude && errors.bv_tieude}
                                />

                                <div>
                                    <LabelStyle>Nội dung</LabelStyle>
                                    <QuillEditor
                                        id="post-bv_noidung"
                                        value={values.bv_noidung}
                                        onChange={(val) => setFieldValue('bv_noidung', val)}
                                        error={Boolean(touched.bv_noidung && errors.bv_noidung)}
                                    />
                                    {touched.bv_noidung && errors.bv_noidung && (
                                        <FormHelperText error sx={{px: 2, textTransform: 'capitalize'}}>
                                            {touched.bv_noidung && errors.bv_noidung}
                                        </FormHelperText>
                                    )}
                                </div>

                            </Stack>
                        </Card>


                        <Stack direction="row" justifyContent="flex-end" sx={{mt: 3}}>

                            {!isEdit && <Button
                                type="button"
                                color="inherit"
                                variant="outlined"
                                size="large"
                                onClick={handleOpenPreview}
                                sx={{mr: 1.5}}
                            >
                                Xem trước
                            </Button>}
                            <Button variant="outlined" sx={{mx: 2}} onClick={() => {
                                if (setShowForm) setShowForm(false)
                            }}>Đóng</Button>
                            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                                {isEdit ? 'Lưu' : 'Thêm bài viết'}
                            </LoadingButton>
                        </Stack>
                    </Form>
                </FormikProvider>

                <BlogNewPostPreview formik={formik} openPreview={open} onClosePreview={handleClosePreview}/>
            </Container>
        </>
    )
        ;
}
