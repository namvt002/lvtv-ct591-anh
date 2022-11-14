import {combineReducers} from 'redux';
// slices
import userReducer from './slices/user';
import cartReducer from './slices/cart';
import productReducer from './slices/product';
import storeReducer from './slices/store';
import codeReducer from './slices/code';
// ----------------------------------------------------------------------

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    product: productReducer,
    store: storeReducer,
    code: codeReducer
});

export {rootReducer};
