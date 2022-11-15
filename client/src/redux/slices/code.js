import { createSlice} from '@reduxjs/toolkit';

// import Cookies from 'js-cookie';

const slice = createSlice({
    name: 'code',
    initialState: {
        code: '',
        lang: '',
        id: Date.now()
    },
    reducers: {
        runCode(state, action) {
            const {code, lang} = action.payload;
            state.code = code;
            state.lang = lang;
        },
    }
});
const {actions, reducer} = slice;
export const {runCode} = actions;

export default reducer;

