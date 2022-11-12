import {Icon} from '@iconify/react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {Form, FormikProvider, useFormik} from 'formik';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import {Button, Card, Grid} from '@material-ui/core';
import CheckoutProductList from './CheckoutProductList';
import {useDispatch, useSelector} from "react-redux";
import {cartItemTotal, checkout, onNextStep} from "../../redux/slices/product";
import {cartItemCount} from "../../redux/slices/cart";
import Scrollbar from "../Scrollbar";
import EmptyContent from "../EmptyContent";
import {useEffect, useState} from "react";
import {API_BASE_URL} from "../../config/configUrl";
import {postData} from "../../_helper/httpProvider";
import CheckoutSummary from "./CheckoutSummary";

// ----------------------------------------------------------------------

export default function CheckoutCart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart.cartItem);
    const checkoutProduct = useSelector(state => state.product.checkout.product);
    const totalItems = useSelector(cartItemCount);
    const isLogined = !!useSelector(state => state.user.current?.id);
    const totalPrice = useSelector(cartItemTotal);

    const isEmptyCart = cart.length === 0;
    const [products, setProducts] = useState([]);

    useEffect(() => {
        (async () => {
            if (cart.length === 0) return;
            let _products = await postData(API_BASE_URL + '/shopcart', {cart: cart});
            setProducts(_products.data);
        })()
    }, [totalItems, cart]);

    const handleNextStep = () => {
        dispatch(onNextStep());
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {products: cart},
        onSubmit: async (values, {setErrors, setSubmitting}) => {
            try {
                setSubmitting(true);
                if (!isLogined) navigate('/auth/login')
                dispatch(checkout({totalPrice: totalPrice, shipping: 30000}));
                handleNextStep();
            } catch (error) {
                console.error(error);
                setErrors(error.message);
            }
        }
    });

    const {handleSubmit} = formik;

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={9}>
                        <Card sx={{mb: 3}}>
                            {!isEmptyCart ? (
                                <Scrollbar>
                                    <CheckoutProductList
                                        products={products}
                                    />
                                </Scrollbar>
                            ) : (
                                <EmptyContent
                                    title="Giỏ hàng trống"
                                    img="/static/illustrations/illustration_empty_cart.svg"
                                />
                            )}
                        </Card>

                        <Button
                            color="inherit"
                            component={RouterLink}
                            to={'/'}
                            startIcon={<Icon icon={arrowIosBackFill}/>}
                        >
                            Tiếp tục xem sách
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <CheckoutSummary
                            total={totalPrice >= 500000 ? totalPrice : totalPrice + 30000}
                            enableDiscount
                            subtotal={totalPrice}
                            shipping={totalPrice >= 500000 ? 0 : 30000}
                        />
                        <Button fullWidth size="large" type="submit" variant="contained"
                                disabled={checkoutProduct.length === 0}>
                            Thanh toán
                        </Button>
                    </Grid>
                </Grid>
            </Form>
        </FormikProvider>
    );
}
