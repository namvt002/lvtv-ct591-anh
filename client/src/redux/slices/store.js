import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";

export const getStore = createAsyncThunk('/store', async () => {
    const _res = await getData(API_BASE_URL + '/store');
    return _res.data
})


const storeSlice = createSlice({
    name: 'store',
    initialState: {
        store: {}
    },
    extraReducers: {
        [getStore.fulfilled]: (state, action) => {
            state.store = action.payload;
        }
    }
});


const {reducer} = storeSlice;
export default reducer;