import * as Yup from 'yup';
import {Form, FormikProvider, useFormik} from 'formik';
// material
import {Card, IconButton, InputAdornment, Stack, TextField} from '@material-ui/core';
import {LoadingButton} from '@material-ui/lab';
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {Icon} from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import {getData, postData} from "../../../_helper/httpProvider";
import {API_BASE_URL} from "../../../config/configUrl";
import {useSnackbar} from "notistack5";
import {MIconButton} from "../../@material-extend";
import closeFill from "@iconify/icons-eva/close-fill";
import {styled} from "@material-ui/core/styles";

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({theme}) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
}));
export default function ChangePasswordForm() {

    const email = useSelector(state => state.user.current.email);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showReNewPass, setShowReNewPass] = useState(false);
    const [user, setUser] = useState([]);
    const [load, setLoad] = useState(0);

    useEffect(() => {
        (async () => {
            const _user = await getData(API_BASE_URL + `/user/${email}/email`);
            setUser(_user.data);
        })()
    }, [email, load])

    const ChangePasswordSchema = Yup.object().shape({
        isLoginGoogle: Yup.boolean(),
        password: Yup.string().when('isLoginGoogle', {
            is: true,
            then: Yup.string().required('Vui lòng nhập mật khẩu cũ!')
        }),
        newPass: Yup.string().required('Vui lòng nhập mật khẩu mới!').min(8, 'Mật khẩu ít nhất 8 ký tự!'),
        reNewPass: Yup.string().required('Vui lòng nhập lại mật khẩu mới!').oneOf([Yup.ref('newPass')], 'Mật khẩu mới không khớp'),
    });

    const formik = useFormik({
        initialValues: {
            email: email,
            password: '',
            newPass: '',
            reNewPass: '',
            isLoginGoogle: !!user.credential
        },
        validationSchema: ChangePasswordSchema,
        onSubmit: async (values, {setErrors, setSubmitting, resetForm}) => {
            try {
                await postData(API_BASE_URL + '/auth/change-password', values);
                setLoad(e => e + 1);
                resetForm();
                enqueueSnackbar('Đổi mật khẩu thành công!', {
                    variant: 'success',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill}/>
                        </MIconButton>
                    ),
                });
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
            <ContentStyle>
                <Card sx={{p: 3}}>
                    <Stack spacing={3}>
                        {user?.credential && (
                            <TextField
                                fullWidth
                                {...getFieldProps('password')}
                                label="Mật khẩu cũ"
                                type={showPassword ? 'text' : 'password'}
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
                        )}
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
                </Card>
            </ContentStyle>
        </Form>
    </FormikProvider>)
        ;
}
