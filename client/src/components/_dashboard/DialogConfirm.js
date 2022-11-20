import {forwardRef, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// material
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Slide,
    TextField,
} from '@material-ui/core';
import {getData, putData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import {Form, FormikProvider, useFormik} from "formik";
import {useSnackbar} from "notistack5";
import {useSelector} from "react-redux";

// ----------------------------------------------------------------------

DialogConfirm.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    handleClickOpen: PropTypes.func,
    excFunc: PropTypes.func,
};


// ----------------------------------------------------------------------

const Transition = forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
));

// ----------------------------------------------------------------------

export default function DialogConfirm({
                                          open,
                                          handleClose,
                                          message,
                                          excFunc,
                                          title,
                                          maxWidth,
                                          status,
                                          idhd,
                                          setLoad,
                                          idnv,
                                          showAction = true
                                      }) {
    const [shipper, sertShipper] = useState();
    const {enqueueSnackbar} = useSnackbar();
    const isAdmin = useSelector(state => state.user.current?.role) === "ADMIN";


    useEffect(() => {
        (async () => {
            if (status === 0) {
                const _shipper = await getData(API_BASE_URL + '/users/shipper');
                sertShipper(_shipper.data);
            }
        })()
    }, [status]);
    const Schema = Yup.object().shape({
        idnv: Yup.object().required('Vui lòng chọn Shipper'),
    });
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            idnv: ''
        },
        onSubmit: async values => {
            try {
                await putData(API_BASE_URL + `/hoadon/${idhd}`, {
                    tt_trangthai: 1,
                    hd_idnv: values.idnv.id,
                    tt_idnv: idnv
                })
                if (setLoad) setLoad(e => e + 1);
                enqueueSnackbar('Xác nhận đơn hàng thành công', {
                    variant: 'success',
                });
                handleClose()
            } catch (e) {
                console.log(e)
            }
        },
        validationSchema: Schema
    });

    const huyDon = async () => {
        try {
            await putData(API_BASE_URL + `/hoadon/${idhd}`, {
                tt_trangthai: 4,
                tt_idnv: idnv
            })
            if (setLoad) setLoad(e => e + 1);
            enqueueSnackbar('Xác nhận đơn hàng thành công', {
                variant: 'success',
            });
            handleClose()
        } catch (e) {
            console.log(e)
        }
    }

    const {values, setFieldValue, errors, handleSubmit, touched} = formik;

    const handleConfirm = async () => {
        if (excFunc) await excFunc();
        handleClose();
    };

    return (
        <div>

            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                fullWidth
                maxWidth={maxWidth ? maxWidth : "sm"}
            >
                <DialogTitle id="alert-dialog-slide-title">{!!title ? title : 'Thông báo'}</DialogTitle>
                <DialogContent>{message}</DialogContent>

                {showAction && <DialogActions>
                    {status === 0 && (
                        <>
                            <FormikProvider value={formik}>
                                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                                    <Grid alignItems='center' spacing={2} sx={{width: '40rem'}} container>
                                        <Grid item md={8}>
                                            <Autocomplete
                                                fullWidth
                                                freeSolo
                                                value={values.idnv}
                                                onChange={(event, newValue) => {
                                                    setFieldValue('idnv', newValue);
                                                }}
                                                options={shipper?.map((option) => ({
                                                    id: option.id,
                                                    fullname: option.fullname,
                                                }))}
                                                renderInput={(params) => (
                                                    <TextField label="Shipper" {...params}
                                                               error={Boolean(touched.idnv && errors.idnv)}
                                                               helperText={touched.idnv && errors.idnv}/>
                                                )}
                                                getOptionLabel={(option) => option.fullname || ''}
                                            />
                                        </Grid>
                                        <Grid item md={4}>
                                            <Button type="submit" variant='contained'>Xác nhận</Button>
                                        </Grid>
                                    </Grid>

                                </Form>
                            </FormikProvider>
                            {isAdmin &&
                                <Button variant='contained' color='error' onClick={() => huyDon()}>Hủy đơn</Button>}
                        </>
                    )}


                    <Button color="inherit" onClick={handleClose}>
                        Đóng
                    </Button>
                    {excFunc && <Button
                        variant="contained"
                        onClick={() => {
                            handleConfirm();
                        }}
                    >
                        Đồng ý
                    </Button>}

                </DialogActions>}
            </Dialog>

        </div>
    );
}
