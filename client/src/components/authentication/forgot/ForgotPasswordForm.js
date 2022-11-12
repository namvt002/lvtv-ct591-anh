import * as Yup from 'yup';
import {useSnackbar} from 'notistack5';
import {Form, FormikProvider, useFormik} from 'formik';
import {Icon} from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import {Stack, TextField,} from '@material-ui/core';
import {LoadingButton} from '@material-ui/lab';
// routes
// hooks
//
import {MIconButton} from '../../@material-extend';
import {postData} from '../../../_helper/httpProvider';
import {API_BASE_URL} from '../../../config/configUrl';
import {useNavigate} from "react-router-dom";

// ----------------------------------------------------------------------

export default function ForgotPasswordForm() {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Địa chỉ email không hợp lệ')
            .required('Vui lòng nhập địa chỉ email'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
            try {
                await postData(API_BASE_URL + '/auth/forgot-password', values);
                navigate(`/auth/verify?email=${values.email}&&forgot=true`)
            } catch (error) {
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
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        fullWidth
                        autoComplete="username"
                        type="email"
                        label="Email"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                    />
                </Stack>


                <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{mt: 2}}
                >
                    Quên mật khẩu
                </LoadingButton>
            </Form>
        </FormikProvider>
    );
}
