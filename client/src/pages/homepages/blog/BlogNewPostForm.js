import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useCallback, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@material-ui/lab';
import { styled } from '@material-ui/core/styles';
import {
  Card,
  Grid,
  Chip,
  Stack,
  Button,
  Switch,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
  FormControlLabel,
  Container
} from '@material-ui/core';
// utils
// import fakeRequest from '../../../utils/fakeRequest';
//
//
import BlogNewPostPreview from './BlogNewPostPreview';
import { QuillEditor } from 'src/components/editor';
import { UploadSingleFile } from 'src/components/upload';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';

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

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

export default function BlogNewPostForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const NewBlogSchema = Yup.object().shape({
    bv_tieude: Yup.string().required('Tiêu đề không được bỏ trống'),
    bv_mota: Yup.string().required('Mô tả không được bỏ trống'),
    bv_noidung: Yup.string().min(1).required('Nội dung không được bỏ trống'),
    bv_anh: Yup.mixed().required('Vui lòng chọn ảnh')
  });

  const formik = useFormik({
    initialValues: {
      bv_tieude: '',
      bv_mota: '',
      bv_noidung: '',
      bv_anh: null,
      bv_active: false,

    },
    validationSchema: NewBlogSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {

        const formDt = new FormData();
        formDt.append('bv_hinh', values.bv_hinh.file);
        formDt.append('bv_iduser', values.bv_hinh.file);
        formDt.append('data', JSON.stringify(values));
        // await fakeRequest(500);
        resetForm();
        handleClosePreview();
        setSubmitting(false);
        enqueueSnackbar('Post success', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
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
              { name: 'Trang chủ', href: '/' },
              { name: 'Bài viết', href: '/blog' },
              { name: 'Thêm bài viết' }
            ]}
          />

          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Tiêu đề bài viết"
                        {...getFieldProps('bv_tieude')}
                        error={Boolean(touched.bv_tieude && errors.bv_tieude)}
                        helperText={touched.bv_tieude && errors.bv_tieude}
                      />

                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={5}
                        label="Mô tả bài viết"
                        {...getFieldProps('bv_mota')}
                        error={Boolean(touched.bv_mota && errors.bv_mota)}
                        helperText={touched.bv_mota && errors.bv_mota}
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
                          <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                            {touched.bv_noidung && errors.bv_noidung}
                          </FormHelperText>
                        )}
                      </div>

                      <div>
                        <LabelStyle>Ảnh</LabelStyle>
                        <UploadSingleFile
                          maxSize={3145728}
                          accept="image/*"
                          file={values.bv_anh}
                          onDrop={handleDrop}
                          error={Boolean(touched.bv_anh && errors.bv_anh)}
                        />
                        {touched.bv_anh && errors.bv_anh && (
                          <FormHelperText error sx={{ px: 2 }}>
                            {touched.bv_anh && errors.bv_anh}
                          </FormHelperText>
                        )}
                      </div>
                    </Stack>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <div>
                        <FormControlLabel
                          control={<Switch {...getFieldProps('bv_active')} checked={values.bv_active} />}
                          label="Ân/Hiên bài viết"
                          labelPlacement="start"
                          sx={{ mb: 1, mx: 0, width: '100%', justifyContent: 'space-between' }}
                        />
                      </div>

                    </Stack>
                  </Card>

                  <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button
                      fullWidth
                      type="button"
                      color="inherit"
                      variant="outlined"
                      size="large"
                      onClick={handleOpenPreview}
                      sx={{ mr: 1.5 }}
                    >
                      Xem trước
                    </Button>
                    <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                      Thêm bài viết
                    </LoadingButton>
                  </Stack>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>

          <BlogNewPostPreview formik={formik} openPreview={open} onClosePreview={handleClosePreview} />
      </Container>
    </>
  );
}
