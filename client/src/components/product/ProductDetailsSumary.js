import {Icon} from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import roundAddShoppingCart from '@iconify/icons-ic/round-add-shopping-cart';
import {Form, FormikProvider, useField, useFormik} from 'formik';
// material
import {styled} from '@material-ui/core/styles';
import {Box, Button, Divider, FormHelperText, Stack, Typography} from '@material-ui/core';
import {MIconButton} from "../@material-extend";
import {addToCart, setQuantity} from "../../redux/slices/cart";
import {useDispatch, useSelector} from "react-redux";
import {fCurrency} from "../../_helper/formatCurrentCy";
import closeFill from "@iconify/icons-eva/close-fill";
import {useSnackbar} from "notistack5";
import {checkoutOneProduct, checkoutProduct, onGotoStep} from "../../redux/slices/product";
import {useNavigate} from "react-router-dom";
import {PATH_AUTH, PATH_PAGE} from "../../routes/paths";
// redux

// ----------------------------------------------------------------------


const RootStyle = styled('div')(({theme}) => ({
    padding: theme.spacing(3),
    [theme.breakpoints.up(1368)]: {
        padding: theme.spacing(5, 8)
    }
}));

// ----------------------------------------------------------------------

const Incrementer = (props) => {
    const [field, , helpers] = useField(props);
    // eslint-disable-next-line react/prop-types
    const {available} = props;
    const {value} = field;
    const {setValue} = helpers;

    const incrementQuantity = () => {
        setValue(value + 1);
    };
    const decrementQuantity = () => {
        setValue(value - 1);
    };

    return (
        <Box
            sx={{
                py: 0.5,
                px: 0.75,
                border: 1,
                lineHeight: 0,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                borderColor: 'grey.50032'
            }}
        >
            <MIconButton size="small" color="inherit" disabled={value <= 1} onClick={decrementQuantity}>
                <Icon icon={minusFill} width={16} height={16}/>
            </MIconButton>
            <Typography
                variant="body2"
                component="span"
                sx={{
                    width: 40,
                    textAlign: 'center',
                    display: 'inline-block'
                }}
            >
                {value}
            </Typography>
            <MIconButton size="small" color="inherit" disabled={value >= available} onClick={incrementQuantity}>
                <Icon icon={plusFill} width={16} height={16}/>
            </MIconButton>
        </Box>
    );
};

export default function ProductDetailsSumary(props) {
    const {product} = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {cartItem} = useSelector(state => state.cart);
    const {
        sp_id,
        sp_ten,
        sp_chieudai,
        sp_chieurong,
        sp_giakhuyenmai,
        tl_ten,
        nxb_ten,
        ncc_ten,
        tg_ten,
        nn_ten,
        gb_soluong,
        gia_ban
    } = product;
    const isLogined = !!useSelector(state => state.user.current?.id);
    const CartItemQuantity = cartItem.filter(e => e.id_sp === sp_id)[0];

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            quantity: gb_soluong < 1 ? 0 : 1
        },
        onSubmit: async (values, {setSubmitting}) => {
            try {
                setSubmitting(false);
            } catch (error) {
                setSubmitting(false);
            }
        }
    });


    const {values, touched, errors, handleSubmit} = formik;
    const isMaxQuantity = values.quantity >= gb_soluong + 1;

    const handleAddCart = () => {
        if (CartItemQuantity?.so_luong && CartItemQuantity.so_luong > gb_soluong) return enqueueSnackbar('Số lượng sản phẩm đạt tối đa!', {
            variant: 'error',
            action: (key) => (
                <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                    <Icon icon={closeFill}/>
                </MIconButton>
            ),
        });
        if (CartItemQuantity?.id_sp) dispatch(setQuantity({
            id_sp: sp_id,
            so_luong: (values.quantity + CartItemQuantity.so_luong > gb_soluong) ? gb_soluong : (values.quantity + CartItemQuantity.so_luong),
        }))

        else dispatch(addToCart({
            id_sp: sp_id,
            so_luong: values.quantity,
            sp_gia: sp_giakhuyenmai ? sp_giakhuyenmai : gia_ban
        }));
    };


    return (
        <RootStyle>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Typography variant="h5" paragraph>
                        {sp_ten}
                    </Typography>
                    <Typography variant="subtitle1">
                        <Typography
                            component="span"
                            variant="body1"
                            sx={{
                                color: 'text.disabled',
                                textDecoration: 'line-through'
                            }}
                        >
                            {!!sp_giakhuyenmai && fCurrency(gia_ban)}
                        </Typography>
                        &nbsp;
                        {!!sp_giakhuyenmai ? fCurrency(sp_giakhuyenmai) : fCurrency(gia_ban)}
                    </Typography>

                    <Divider sx={{borderStyle: 'dashed'}}/>

                    <Stack spacing={3} sx={{my: 3}}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{mt: 0.5}}>
                                Tác giả
                            </Typography>
                            <Typography variant="subtitle2" sx={{mt: 0.5}}>
                                {tg_ten}
                            </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{mt: 0.5}}>
                                Nhà xuất bản
                            </Typography>
                            <Typography variant="subtitle2" sx={{mt: 0.5}}>
                                {nxb_ten}
                            </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{mt: 0.5}}>
                                Nhà cung cấp
                            </Typography>
                            <Typography variant="subtitle2" sx={{mt: 0.5}}>
                                {ncc_ten}
                            </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{mt: 0.5}}>
                                Thể loại
                            </Typography>
                            <Typography variant="subtitle2" sx={{mt: 0.5}}>
                                {tl_ten}
                            </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{mt: 0.5}}>
                                Ngôn ngữ
                            </Typography>
                            <Typography variant="subtitle2" sx={{mt: 0.5}}>
                                {nn_ten}
                            </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{mt: 0.5}}>
                                Kích thướt
                            </Typography>
                            <Typography variant="subtitle2" sx={{mt: 0.5}}>
                                {`${sp_chieudai} x ${sp_chieurong}`}
                            </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" sx={{mt: 0.5}}>
                                Số lượng
                            </Typography>
                            <div>
                                <Incrementer name="quantity" available={gb_soluong}/>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mt: 1,
                                        display: 'block',
                                        textAlign: 'right',
                                        color: 'text.secondary'
                                    }}
                                >
                                    Có sẵn: {gb_soluong}
                                </Typography>

                                <FormHelperText error>{touched.soluong && errors.soluong}</FormHelperText>
                            </div>
                        </Stack>
                    </Stack>

                    <Divider sx={{borderStyle: 'dashed'}}/>
                    {gb_soluong !== 0 &&
                        (<Stack spacing={2} direction={{xs: 'column', sm: 'row'}} sx={{mt: 5}}>
                            <Button
                                fullWidth
                                disabled={isMaxQuantity}
                                size="large"
                                type="button"
                                color="warning"
                                variant="contained"
                                startIcon={<Icon icon={roundAddShoppingCart}/>}
                                onClick={handleAddCart}
                                sx={{whiteSpace: 'nowrap'}}
                            >
                                Thêm giỏ hàng
                            </Button>
                            <Button onClick={() => {
                                if (!isLogined) return navigate(PATH_AUTH.login);
                                dispatch(checkoutProduct([]));
                                dispatch(checkoutOneProduct({
                                    id_sp: sp_id,
                                    so_luong: values.quantity,
                                    sp_gia: sp_giakhuyenmai ? sp_giakhuyenmai : gia_ban
                                }));
                                dispatch(onGotoStep(1));
                                handleAddCart();
                                navigate(PATH_PAGE.shopcart)
                            }} fullWidth size="large" type="submit" variant="contained">
                                Mua ngay
                            </Button>
                        </Stack>)}
                    {gb_soluong === 0 &&
                        (<Box><Typography align="center" color="error">Hết hàng</Typography></Box>)}

                </Form>
            </FormikProvider>
        </RootStyle>
    );
}
