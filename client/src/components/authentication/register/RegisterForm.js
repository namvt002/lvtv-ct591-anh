import * as Yup from 'yup';
import {useState} from 'react';
import {Icon} from '@iconify/react';
import {useSnackbar} from 'notistack5';
import {Form, FormikProvider, useFormik} from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import {useNavigate} from 'react-router-dom';

// material
import {IconButton, InputAdornment, Stack, TextField,} from '@material-ui/core';
import {LoadingButton} from '@material-ui/lab';
// hooks
//
import {MIconButton} from '../../@material-extend';
import {postData} from '../../../_helper/httpProvider';
import {API_BASE_URL} from '../../../config/configUrl';
// ----------------------------------------------------------------------

export default function RegisterForm() {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const navigate = useNavigate();

    const RegisterSchema = Yup.object().shape({
        fullname: Yup.string()
            .min(5, 'Họ tên quá ngắn!')
            .max(50, 'Họ tên quá dài!')
            .required('Vui lòng điền họ tên'),
        email: Yup.string()
            .email('Địa chỉ email không hợp lệ!')
            .required('Vui lòng nhập địa chỉ email!'),
        password: Yup.string()
            .min(8, 'Mật khẩu ít nhất 8 ký tự!')
            .required('Vui lòng nhập mật khẩu'),
        repwd: Yup.string()
            .required('Vui lòng nhập lại mật khẩu')
            .oneOf([Yup.ref('password')], 'Mật khẩu không khớp'),
    });

    const formik = useFormik({
        initialValues: {
            fullname: '',
            email: '',
            password: '',
            repwd: '',
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            try {
                await postData(API_BASE_URL + '/user/register', values);
                enqueueSnackbar('Đăng ký thành công!', {
                    variant: 'success',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill}/>
                        </MIconButton>
                    ),
                });
                navigate(`/auth/verify?email=${values.email}`)
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

    const {errors, touched, handleSubmit, isSubmitting, getFieldProps} = formik;

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                        <TextField
                            fullWidth
                            label="Họ và tên"
                            {...getFieldProps('fullname')}
                            error={Boolean(touched.fullname && errors.fullname)}
                            helperText={touched.fullname && errors.fullname}
                        />
                    </Stack>

                    <TextField
                        fullWidth
                        autoComplete="username"
                        type="email"
                        label="Email"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                    />

                    <TextField
                        fullWidth
                        autoComplete="current-password"
                        type={showPassword ? 'text' : 'password'}
                        label="Mật khẩu"
                        {...getFieldProps('password')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        <Icon icon={showPassword ? eyeFill : eyeOffFill}/>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                    />

                    <TextField
                        fullWidth
                        autoComplete="current-password"
                        type={showRePassword ? 'text' : 'password'}
                        label="Nhập lại mật khẩu"
                        {...getFieldProps('repwd')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        onClick={() => setShowRePassword((prev) => !prev)}
                                    >
                                        <Icon icon={showPassword ? eyeFill : eyeOffFill}/>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={Boolean(touched.repwd && errors.repwd)}
                        helperText={touched.repwd && errors.repwd}
                    />

                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                    >
                        Đăng ký
                    </LoadingButton>
                </Stack>
            </Form>
        </FormikProvider>
    );
}
