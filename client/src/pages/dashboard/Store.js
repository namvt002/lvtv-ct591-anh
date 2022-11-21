import Page from "../../components/Page";
import {Button, Card, Container, Grid, Stack, TextField, Typography} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import * as Yup from 'yup';
import {Form, FormikProvider, useFormik} from "formik";
import {MIconButton} from "../../components/@material-extend";
import {Icon} from "@iconify/react";
import closeFill from "@iconify/icons-eva/close-fill";
import {useSnackbar} from "notistack5";
import {putData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import {getStore} from "../../redux/slices/store";

//----------------------------------------------------------------------------------
export default function Store() {
    const store = useSelector(state => state.store.store);
    const dispatch = useDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [isEdit, setEdit] = useState(false);
    const isAdmin = useSelector(state => state.user.current.role) === "ADMIN";

    const Schema = Yup.object().shape({
        ch_ten: Yup.string().required('Vui lòng nhập tên cửa hàng'),
        ch_email: Yup.string().required('Vui lòng nhập email'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            ch_ten: store.ch_ten,
            ch_email: store.ch_email,
        },
        validationSchema: Schema,
        onSubmit: async values => {
            try {
                await putData(API_BASE_URL + `/store/${store.id}`, values);
                dispatch(getStore());
                setEdit(false);
                enqueueSnackbar('Cập nhật thành công!', {
                    variant: 'success',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill}/>
                        </MIconButton>
                    ),
                });
            } catch (error) {
                console.log(error)
            }
        }
    });

    const {handleSubmit, getFieldProps, touched, errors} = formik;

    return <>
        <Page title="Cửa hàng">
            <Container>
                <Typography variant='h3'>Thông tin trang web</Typography>
                <FormikProvider value={formik}>
                    <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Card sx={{padding: 4}}>

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                            Tên trang web:
                                        </Typography>
                                        <Typography variant="subtitle2">{store.ch_ten}</Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                            Email:
                                        </Typography>
                                        <Typography variant="subtitle2">{store.ch_email}</Typography>
                                    </Stack>
                                    {isAdmin && <Stack direction="row" justifyContent="end" sx={{m: '2rem 0'}}>
                                        {!isEdit && <Button variant='contained' onClick={() => setEdit(true)}>
                                            Chỉnh sửa
                                        </Button>}
                                    </Stack>}
                                </Card>
                            </Grid>

                            <Grid item xs={6}>
                                {isEdit && <Card sx={{p: 4, mt: 2}}>

                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        label="Tên trang web"
                                        {...getFieldProps('ch_ten')}
                                        error={Boolean(touched.ch_ten && errors.ch_ten)}
                                        helperText={touched.ch_ten && errors.ch_ten}
                                        margin='normal'
                                    />

                                    <TextField
                                        fullWidth
                                        variant='filled'
                                        label="Email"
                                        {...getFieldProps('ch_email')}
                                        error={Boolean(touched.ch_email && errors.ch_email)}
                                        helperText={touched.ch_email && errors.ch_email}
                                        margin='normal'
                                    />
                                    <Stack direction='row' justifyContent='end'>
                                        <Button onClick={() => setEdit(false)}>Đóng</Button>
                                        <Button variant='contained' type='submit'>Lưu</Button>
                                    </Stack>
                                </Card>}
                            </Grid>
                        </Grid>
                    </Form>
                </FormikProvider>
            </Container>
        </Page>

    </>
}