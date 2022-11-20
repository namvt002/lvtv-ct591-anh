import * as Yup from 'yup';
import {useState} from 'react';
import {useSnackbar} from 'notistack5';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {Form, FormikProvider, useFormik} from 'formik';
import {Icon} from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {IconButton, InputAdornment, Link, Stack, TextField,} from '@material-ui/core';
import {LoadingButton} from '@material-ui/lab';
// routes
import {PATH_AUTH} from '../../../routes/paths';
// hooks
//
import {MIconButton} from '../../@material-extend';
import {postData} from '../../../_helper/httpProvider';
import {API_BASE_URL} from '../../../config/configUrl';
import {useDispatch, useSelector} from "react-redux";
import {login} from "../../../redux/slices/user";

// ----------------------------------------------------------------------

export default function LoginForm({errParams}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [showPassword, setShowPassword] = useState(false);
    const user = useSelector(state => state.user.current)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Địa chỉ email không hợp lệ')
            .required('Vui lòng nhập địa chỉ email'),
        password: Yup.string().required('Vui lòng nhập mật khẩu'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
            try {
                if (errParams) errParams.set('noErr', '');
                await postData(API_BASE_URL + '/auth/login', values);
                dispatch(login());
                enqueueSnackbar('Đăng nhập thành công', {
                    variant: 'success',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill}/>
                        </MIconButton>
                    ),
                });
                if (user.role === 'ADMIN') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
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

    const {errors, touched, isSubmitting, handleSubmit, getFieldProps} = formik;

    const handleShowPassword = () => {
        setShowPassword((show) => !show);
    };

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

                    <TextField
                        fullWidth
                        autoComplete="current-password"
                        type={showPassword ? 'text' : 'password'}
                        label="Mật khẩu"
                        {...getFieldProps('password')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleShowPassword} edge="end">
                                        <Icon icon={showPassword ? eyeFill : eyeOffFill}/>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                    />
                </Stack>

                <LoadingButton
                    sx={{mt: 2}}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                >
                    Đăng nhập
                </LoadingButton>

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{my: 2}}
                >
                    <Link
                        component={RouterLink}
                        variant="subtitle2"
                        to={PATH_AUTH.forgotPassword}
                    >
                        Quên mật khẩu?
                    </Link>
                </Stack>


                <LoadingButton
                    fullWidth
                    size="large"
                    color="error"
                    type="button"
                    variant="contained"
                    loading={isSubmitting}
                    onClick={() => {
                        window.location.href = API_BASE_URL + '/auth/google';
                    }}
                >
                    Đăng nhập bằng google
                </LoadingButton>
            </Form>
        </FormikProvider>
    );
}