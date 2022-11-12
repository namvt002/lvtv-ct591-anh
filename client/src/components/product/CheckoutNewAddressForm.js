import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {Form, FormikProvider, useFormik} from 'formik';
// material
import {
    Button,
    Checkbox,
    DialogActions,
    DialogTitle,
    Divider,
    FormControlLabel,
    Stack,
    TextField
} from '@material-ui/core';
import {LoadingButton} from '@material-ui/lab';
import {DialogAnimate} from "../animate";
import {useSelector} from "react-redux";
import {postData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import {useSnackbar} from "notistack5";

// ----------------------------------------------------------------------

CheckoutNewAddressForm.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onNextStep: PropTypes.func,
};

export default function CheckoutNewAddressForm({open, onClose, onNextStep, setLoad}) {
    const {id} = useSelector(state => state.user.current);
    const {enqueueSnackbar} = useSnackbar();

    const NewAddressSchema = Yup.object().shape({
        dc_tenkh: Yup.string().required('Vui lòng nhập họ tên'),
        dc_sdt: Yup.string()
            .matches(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ')
            .typeError('Số điện thoại không hợp lệ')
            .required('Vui lòng nhập số điện thoại'),
        dc_diachi: Yup.string().required('Vui lòng nhập địa chỉ'),
        dc_email: Yup.string().required('Vui lòng nhập email').email('Email không hợp lệ')
    });

    const formik = useFormik({
        initialValues: {
            dc_macdinh: true,
            dc_tenkh: '',
            dc_email: '',
            dc_sdt: '',
            dc_diachi: '',
            dc_idkh: id
        },
        validationSchema: NewAddressSchema,
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            try {
                //onNextStep();
                await postData(API_BASE_URL + '/diachi', values);
                enqueueSnackbar(
                    'Thêm địa chỉ thành công',
                    {
                        variant: 'success',
                    },
                );

                resetForm();
                if (setLoad) setLoad(e => e + 1);
                setSubmitting(true);
                onClose();
            } catch (error) {
                console.error(error);
                setSubmitting(false);
            }
        }
    });

    const {errors, values, touched, isSubmitting, handleSubmit, getFieldProps} = formik;
    return (
        <DialogAnimate maxWidth="sm" open={open} onClose={onClose}>
            <DialogTitle>Thêm địa chỉ mới</DialogTitle>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={{xs: 2, sm: 3}} sx={{p: 3}}>

                        <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                            <TextField
                                fullWidth
                                label="Họ tên"
                                {...getFieldProps('dc_tenkh')}
                                error={Boolean(touched.dc_tenkh && errors.dc_tenkh)}
                                helperText={touched.dc_tenkh && errors.dc_tenkh}
                            />
                            <TextField
                                fullWidth
                                label="Số điện thoại"
                                {...getFieldProps('dc_sdt')}
                                error={Boolean(touched.dc_sdt && errors.dc_sdt)}
                                helperText={touched.dc_sdt && errors.dc_sdt}
                            />
                        </Stack>
                        <TextField
                            fullWidth
                            label="Email"
                            {...getFieldProps('dc_email')}
                            error={Boolean(touched.dc_email && errors.dc_email)}
                            helperText={touched.dc_email && errors.dc_email}
                        />
                        <TextField
                            fullWidth
                            label="Địa chỉ"
                            {...getFieldProps('dc_diachi')}
                            error={Boolean(touched.dc_diachi && errors.dc_diachi)}
                            helperText={touched.dc_diachi && errors.dc_diachi}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={values.dc_macdinh} {...getFieldProps('dc_macdinh')} />}
                            label="Đặt làm địa chỉ mặc định."
                            sx={{mt: 3}}
                        />
                    </Stack>

                    <Divider/>

                    <DialogActions>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Thêm
                        </LoadingButton>
                        <Button type="button" color="inherit" variant="outlined" onClick={onClose}>
                            Hủy
                        </Button>
                    </DialogActions>
                </Form>
            </FormikProvider>
        </DialogAnimate>
    );
}
