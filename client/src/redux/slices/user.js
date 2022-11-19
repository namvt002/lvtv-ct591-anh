import {createSlice} from '@reduxjs/toolkit';
// utils
import Cookies from 'js-cookie';
import {randomIntFromInterval} from "../../_helper/helper";

// ----------------------------------------------------------------------

const initialState = {
    current: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null,
    token: Cookies.get('token') || null,
    cover: `/static/avatar_${randomIntFromInterval(1, 20)}.jpg`
};

const slice = createSlice({
    name: 'user', initialState, reducers: {
        // START LOADING
        logout(state) {
            state.current = {};
            state.token = null;
            Cookies.remove('user');
            Cookies.remove('token');
            Cookies.remove('role');
            Cookies.remove('connect.sid');
        }, login(state) {
            state.current = JSON.parse(Cookies.get('user'));
            state.token = Cookies.get('token')

        },
    },
});

// Reducer
export default slice.reducer;
// Actions
export const {login, logout} = slice.actions;

// ----------------------------------------------------------------------
