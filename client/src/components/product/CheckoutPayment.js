import {Box, Button, Card, FormControlLabel, Grid, Radio, RadioGroup, styled, Typography} from "@material-ui/core";
import CheckoutAddressInfor from "./CheckoutAddressInfor";
import {cartItemTotal, checkoutProduct, onBackStep, onGotoStep} from "../../redux/slices/product";
import {useDispatch, useSelector} from "react-redux";
import CheckoutSummary from "./CheckoutSummary";
import {Icon} from "@iconify/react";
import arrowIosBackFill from "@iconify/icons-eva/arrow-ios-back-fill";
import {Form, FormikProvider, useFormik} from "formik";
import checkmarkCircle2Fill from "@iconify/icons-eva/checkmark-circle-2-fill";
import {LoadingButton} from "@material-ui/lab";
import {postData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import {PayPalButton} from "react-paypal-button-v2";
import {useSnackbar} from "notistack5";
import {removeFromCart} from "../../redux/slices/cart";
import {useNavigate} from "react-router-dom";
import {PATH_PAGE} from "../../routes/paths";
import {useEffect, useState} from "react";


//-----------------------------------------------------------------------------------------------
const options = {
    clientId: "AYRkZtJ2wMXh54-3LxsP2kWZS7dY-QhCO7PYZSNrias-s2ZFMvzUgvwS2DeZGxGvz9AeUP-wQtVn0hqG",
    currency: "USD"
}

//-----------------------------------------------------------------------------------------------
const OptionStyle = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2.5),
    justifyContent: 'space-between',
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create('all'),
    border: `solid 1px ${theme.palette.grey[500_32]}`
}));
//---------------------------------------------------------------------------
const DELIVERY_OPTIONS = [
    {
        value: 0,
        title: 'Thanh toán khi nhận hàng (phí vận chuyển 30,000đ)',
    }, {
        value: 1,
        title: 'Thanh toán bằng tài khoản Paypal'
    }
];
//---------------------------------------------------------------------------

export default function CheckoutPayment() {
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let {address} = useSelector(state => state.product.checkout);
    const totalPrice = useSelector(cartItemTotal);

    const _prodt = useSelector(state => state.product.checkout.product);
    const [product, setProduct] = useState([]);

    useEffect(() => {
        (async () => {
            if (_prodt.length === 0) return;
            const _products = await postData(API_BASE_URL + '/shopcart', {cart: _prodt});
            setProduct(_products.data);
            _prodt.map((e, idx) => _products.data[idx].sp_soluong = e.so_luong > _products.data[idx].ctpn_soluong ? _products.data[idx].ctpn_soluong : e.so_luong)

        })()
    }, [_prodt]);

    const handleBackStep = () => {
        dispatch(onBackStep());
    };

    const handleGotoStep = (step) => {
        dispatch(onGotoStep(step));
    };

    const onError = err => {
        enqueueSnackbar('Có lỗi xảy ra', {variant: 'error', autoHideDuration: 2000});

        // The main Paypal's script cannot be loaded or somethings block the loading of that script!
        console.log("Error!", err);
        // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
        // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
    };

    const onSuccess = async (payment) => {

        try {
            let _values = {};
            _values.hd_tenkh = address.dc_tenkh;
            _values.hd_idkh = address.dc_idkh;
            _values.hd_sdt = address.dc_sdt;
            _values.hd_email = address.dc_email;
            _values.hd_tongtien = totalPrice;
            _values.hd_tienvc = totalPrice >= 500000 ? 0 : 30000;
            _values.hd_hinhthucthanhtoan = 'online';
            _values.hd_diachi = address.dc_diachi;
            _values.product = product;
            await postData(API_BASE_URL + '/hoadon', _values);
            product.map(e => {
                return dispatch(removeFromCart(e.sp_id));
            });
            console.log(product)
            dispatch(checkoutProduct([]));
            enqueueSnackbar('Thanh toán thành công', {variant: 'success', autoHideDuration: 2000});
            navigate(PATH_PAGE.profile)
        } catch (err) {
            enqueueSnackbar('Lỗi tạo hóa đơn', {variant: 'error', autoHideDuration: 2000});
        }

    }

    const formik = useFormik({
        initialValues: {
            delivery: 0,
            shipping: 3000,
            payment: ''
        },
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            try {
                let _values = {};
                _values.hd_tenkh = address.dc_tenkh;
                _values.hd_idkh = address.dc_idkh;
                _values.hd_sdt = address.dc_sdt;
                _values.hd_email = address.dc_email;
                _values.hd_tongtien = totalPrice;
                _values.hd_tienvc = totalPrice >= 500000 ? 0 : 30000;
                _values.hd_diachi = address.dc_diachi;
                _values.product = product;
                console.log(_values)
                await postData(API_BASE_URL + '/hoadon', _values);
                enqueueSnackbar('Thanh toán thành công', {variant: 'success', autoHideDuration: 2000});
                product.map(e => {
                    return dispatch(removeFromCart(e.sp_id));
                });
                dispatch(checkoutProduct([]));

                navigate(PATH_PAGE.profile)
            } catch (error) {
                console.error(error);
                setSubmitting(false);
                setErrors(error.message);
            }
        }
    });
    const {isSubmitting, handleSubmit, values, setFieldValue} = formik;
    return (
        <>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>

                            <RadioGroup
                                name="delivery"
                                value={Number(values.delivery)}
                                onChange={(event) => {
                                    const {value} = event.target;
                                    setFieldValue('delivery', Number(value));
                                }}
                            >
                                <Grid container spacing={2}>

                                    {DELIVERY_OPTIONS.map((delivery) => {
                                        const {value, title} = delivery;
                                        return (
                                            <Grid key={value} item xs={12} md={6}>
                                                <OptionStyle
                                                    sx={{
                                                        ...(values.delivery === value && {
                                                            boxShadow: (theme) => theme.customShadows.z8
                                                        })
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        value={value}
                                                        control={<Radio
                                                            checkedIcon={<Icon icon={checkmarkCircle2Fill}/>}/>}
                                                        label={
                                                            <Box sx={{ml: 1}}>
                                                                <Typography variant="subtitle2">{title}</Typography>
                                                            </Box>
                                                        }
                                                        sx={{py: 3, flexGrow: 1, mr: 0}}
                                                    />
                                                </OptionStyle>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </RadioGroup>

                            {values.delivery === 1 && <Card sx={{my: 4}}>
                                <PayPalButton
                                    amount={parseFloat(totalPrice / 24000).toFixed(2)}
                                    options={options}
                                    onSuccess={onSuccess}
                                    onError={onError}
                                    style={{color: 'blue'}}
                                />
                            </Card>}

                            <Button
                                type="button"
                                size="small"
                                color="inherit"
                                onClick={handleBackStep}
                                startIcon={<Icon icon={arrowIosBackFill}/>}
                                sx={{mt: 3}}
                            >
                                Trở về
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <CheckoutAddressInfor onBackStep={handleBackStep}/>
                            <CheckoutSummary
                                total={totalPrice >= 500000 ? totalPrice : totalPrice + 30000}
                                enableDiscount
                                subtotal={totalPrice}
                                shipping={totalPrice >= 500000 ? 0 : 30000}
                                onEdit={() => handleGotoStep(0)}
                                enableEdit={true}
                            />
                            <LoadingButton fullWidth size="large" type="submit" variant="contained"
                                           loading={isSubmitting} disabled={values.delivery === 1}>
                                Thanh toán
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Form>
            </FormikProvider>
        </>
    )
}