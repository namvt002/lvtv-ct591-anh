import {createSelector, createSlice} from '@reduxjs/toolkit';

import Cookies from 'js-cookie';

const slice = createSlice({
    name: 'cart',
    initialState: {
        cartItem: Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : []
    },
    reducers: {
        addToCart(state, action) {
            const newItem = action.payload;
            const index = state.cartItem.findIndex((x) => x.id_sp === newItem.id_sp);
            let a = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : [];
            if (index >= 0) {
                state.cartItem[index].so_luong += newItem.so_luong;
                a[index].so_luong += newItem.so_luong;
            } else {
                state.cartItem.push(newItem);
                a.push(newItem);
            }
            Cookies.set('cart', JSON.stringify(a));
        },
        setQuantity(state, action) {
            const {id_sp, so_luong} = action.payload;
            const index = state.cartItem.findIndex((x) => x.id_sp === id_sp);
            let a = JSON.parse(Cookies.get('cart'))
            if (index >= 0) {
                state.cartItem[index].so_luong = so_luong;
                a[index].so_luong = so_luong
            }
            Cookies.set('cart', JSON.stringify(a));
        },
        removeFromCart(state, action) {
            const idRemove = action.payload;
            let a = JSON.parse(Cookies.get('cart'));
            state.cartItem = state.cartItem.filter((x) => x.id_sp !== idRemove);
            a = a.filter((x) => x.id_sp !== idRemove);
            Cookies.set('cart', JSON.stringify(a));
        },
    }
});
const {actions, reducer} = slice;
export default reducer;
export const {setQuantity, removeFromCart, addToCart} = actions;

const cartItemSeclector = (state) => state.cart.cartItem;

export const cartItemCount = createSelector(cartItemSeclector, (cartItem) =>
    cartItem.reduce((count, item) => count + item.so_luong, 0)
);

