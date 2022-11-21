import * as Yup from 'yup';
import {Form, FormikProvider, useFormik} from 'formik';
// material
import {IconButton, InputAdornment, Stack, TextField} from '@material-ui/core';
import {LoadingButton} from '@material-ui/lab';
import {useState} from "react";
import {Icon} from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import {postData} from "../../../_helper/httpProvider";
import {API_BASE_URL} from "../../../config/configUrl";
import {useSnackbar} from "notistack5";
import {MIconButton} from "../../@material-extend";
import closeFill from "@iconify/icons-eva/close-fill";
import {useNavigate, useParams} from "react-router-dom";

// ----------------------------------------------------------------------

export default function ResetPasswordForm() {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [showNewPass, setShowNewPass] = useState(false);
    const [showReNewPass, setShowReNewPass] = useState(false);
    const {token} = useParams();
    const navigate = useNavigate();

    const ChangePasswordSchema = Yup.object().shape({
        newPass: Yup.string().required('Vui lòng nhập mật khẩu mới!').min(8, 'Mật khẩu ít nhất 8 ký tự!'),
        reNewPass: Yup.string().required('Vui lòng nhập lại mật khẩu mới!').oneOf([Yup.ref('newPass')], 'Mật khẩu mới không khớp'),
    });

    const formik = useFormik({
        initialValues: {
            password: '',
            newPass: '',
            reNewPass: '',
            token: token
        },
        validationSchema: ChangePasswordSchema,
        onSubmit: async (values) => {
            try {
                await postData(API_BASE_URL + '/auth/reset-password', values);
                enqueueSnackbar('Đổi mật khẩu thành công!', {
                    variant: 'success',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill}/>
                        </MIconButton>
                    ),
                });

                navigate('/auth/login');

            } catch (error) {
                enqueueSnackbar(error.response.data, {
                    variant: 'error',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill}/>
                        </MIconButton>
                    ),
                });
                console.error(error);
            }
        }
    });

    const {errors, touched, handleSubmit, getFieldProps} = formik;

    return (<FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
                <TextField
                    fullWidth
                    {...getFieldProps('newPass')}
                    label="Mật khẩu mới"
                    type={showNewPass ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    edge="end"
                                    onClick={() => setShowNewPass((prev) => !prev)}
                                >
                                    <Icon icon={showNewPass ? eyeFill : eyeOffFill}/>
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    error={Boolean(touched.newPass && errors.newPass)}
                    helperText={touched.newPass && errors.newPass}
                />
                <TextField
                    fullWidth
                    {...getFieldProps('reNewPass')}
                    label="Nhập lại mật khẩu mới"
                    type={showReNewPass ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    edge="end"
                                    onClick={() => setShowReNewPass((prev) => !prev)}
                                >
                                    <Icon icon={showReNewPass ? eyeFill : eyeOffFill}/>
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    error={Boolean(touched.reNewPass && errors.reNewPass)}
                    helperText={touched.reNewPass && errors.reNewPass}
                />

                <LoadingButton fullWidth size="large" type="submit" variant="contained">
                    Đổi mật khẩu
                </LoadingButton>
            </Stack>
        </Form>
    </FormikProvider>);
}
