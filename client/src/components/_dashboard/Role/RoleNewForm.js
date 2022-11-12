import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {useSnackbar} from 'notistack5';
import {Form, FormikProvider, useFormik} from 'formik';
// material
import {LoadingButton} from '@material-ui/lab';
import {Box, Card, Grid, Stack, TextField} from '@material-ui/core';
// utils
// routes
//
import {postData, putData} from '../../../_helper/httpProvider';
import {API_BASE_URL} from '../../../config/configUrl';
import {Icon} from '@iconify/react';
import {MIconButton} from '../../../components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';

// ----------------------------------------------------------------------

RoleNewForm.propTypes = {
    isEdit: PropTypes.bool,
    currentRole: PropTypes.object,
    id: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function RoleNewForm({isEdit, currentRole, id}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const NewRoleSchema = Yup.object().shape({
        q_ten: Yup.string().required('Vui lòng nhập tên'),
        q_vaitro: Yup.string().required('Vui lòng vai trò'),
        q_mota: Yup.string(),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            q_ten: currentRole?.q_ten || '',
            q_mota: currentRole?.q_mota || '',
            q_vaitro: currentRole?.q_vaitro || '',
        },
        validationSchema: NewRoleSchema,
        onSubmit: async (values, {resetForm, setFieldValue}) => {
            try {
                if (isEdit) {
                    await putData(API_BASE_URL + `/role/${id}/edit`, values);
                } else {
                    await postData(API_BASE_URL + `/role/create`, values);
                    resetForm();
                }
                enqueueSnackbar(
                    !isEdit ? 'Thêm quyền thành công' : 'Cập nhật thành công!',
                    {
                        variant: 'success',
                    },
                );
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
    const {errors, touched, handleSubmit, getFieldProps} = formik;
    return (
        <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <Card sx={{p: 3}}>
                            <Stack spacing={3}>
                                <Stack
                                    direction={{xs: 'column', sm: 'row'}}
                                    spacing={{xs: 3, sm: 2}}
                                >
                                    <TextField
                                        fullWidth
                                        label="Tên quyền"
                                        {...getFieldProps('q_ten')}
                                        error={Boolean(touched.q_ten && errors.q_ten)}
                                        helperText={touched.q_ten && errors.q_ten}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Vai trò"
                                        {...getFieldProps('q_vaitro')}
                                        error={Boolean(touched.q_vaitro && errors.q_vaitro)}
                                        helperText={touched.q_vaitro && errors.q_vaitro}
                                    />
                                </Stack>

                                <TextField
                                    fullWidth
                                    label="Mô tả"
                                    multiline
                                    rows={4}
                                    {...getFieldProps('q_mota')}
                                    error={Boolean(touched.q_mota && errors.q_mota)}
                                    helperText={touched.q_mota && errors.q_mota}
                                />
                                <Box
                                    sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}
                                >
                                    <LoadingButton type="submit" variant="contained">
                                        {!isEdit ? 'Thêm' : 'Lưu'}
                                    </LoadingButton>
                                </Box>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </Form>
        </FormikProvider>
    );
}
