import {createSelector, createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'product', initialState: {
        checkout: {
            activeStep: 0, totalPrice: 0, shipping: 0, address: {}, product: []
        }
    }, reducers: {
        onNextStep(state) {
            state.checkout.activeStep += 1;
        },
        onBackStep(state) {
            state.checkout.activeStep -= 1;
        },
        onGotoStep(state, action) {
            state.checkout.activeStep = action.payload;
        },
        checkout(state, action) {
            const {totalPrice, shipping} = action.payload;
            state.checkout.totalPrice = totalPrice;
            state.checkout.shipping = shipping;
        },
        chooseAddress(state, action) {
            const {address} = action.payload;
            state.checkout.address = address;
        },
        checkoutProduct(state, action) {
            state.checkout.product = action.payload
        },
        checkoutOneProduct(state, action) {
            state.checkout.product.push(action.payload);
        },
        setQuantityProductCheckout(state, action) {
            const {id_sp, so_luong} = action.payload;
            const index = state.checkout.product.findIndex((x) => x.id_sp === id_sp);
            if (index >= 0) {
                state.checkout.product[index].so_luong = so_luong;
            }
        },
    }
});
const cartItemSeclector = (state) => state.product.checkout.product;

export const cartItemTotal = createSelector(cartItemSeclector, (cartItem) =>
    cartItem.reduce((total, item) => total + item.sp_gia * item.so_luong, 0)
);
const {actions, reducer} = slice;
export const {
    onNextStep,
    onBackStep,
    checkout,
    chooseAddress,
    onGotoStep,
    checkoutProduct,
    checkoutOneProduct,
    setQuantityProductCheckout
} = actions
export default reducer;