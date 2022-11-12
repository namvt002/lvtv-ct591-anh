// ----------------------------------------------------------------------

function path(root, sublink) {
    return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
    root: ROOTS_AUTH,
    login: path(ROOTS_AUTH, '/login'),
    register: path(ROOTS_AUTH, '/register'),
    resetPassword: path(ROOTS_AUTH, '/reset-password'),
    verify: path(ROOTS_AUTH, '/verify'),
    forgotPassword: path(ROOTS_AUTH, '/forgot-password'),
};

export const PATH_PAGE = {
    page404: '/404',
    page500: '/500',
    profile: '/profile',
    product: '/product',
    shopcart: '/shopcart',
    productDetail: '/product-detail'
};

export const PATH_DASHBOARD = {
    root: ROOTS_DASHBOARD,
    user: {
        root: path(ROOTS_DASHBOARD, '/user'),
        profile: path(ROOTS_DASHBOARD, '/user/profile'),
        list: path(ROOTS_DASHBOARD, '/user/list'),
        newUser: path(ROOTS_DASHBOARD, '/user/new'),
        account: path(ROOTS_DASHBOARD, '/user/account'),
    },
    course: {
        root: path(ROOTS_DASHBOARD, '/course')
    }
    ,
    role: {
        root: path(ROOTS_DASHBOARD, '/role'),
        newRole: path(ROOTS_DASHBOARD, '/role/new'),
    },
    book: {
        root: path(ROOTS_DASHBOARD, '/book'),
        new: path(ROOTS_DASHBOARD, '/book/new'),
    },
    phieunhap: {
        root: path(ROOTS_DASHBOARD, '/phieunhap'),
        new: path(ROOTS_DASHBOARD, '/phieunhap/new'),
    },
    giamgia: {
        root: path(ROOTS_DASHBOARD, '/giamgia'),
    },
    khuyenmai: {
        root: path(ROOTS_DASHBOARD, '/khuyenmai')
    },
    nhaxuatban: {
        root: path(ROOTS_DASHBOARD, '/nhaxuatban'),
        new: path(ROOTS_DASHBOARD, '/nhaxuatban/new'),
    },
    nhacungcap: {
        root: path(ROOTS_DASHBOARD, '/nhacungcap'),
        new: path(ROOTS_DASHBOARD, '/nhacungcap/new'),
    },
    danhmuc: {
        root: path(ROOTS_DASHBOARD, '/danhmuc'),
    },
    tacgia: {
        root: path(ROOTS_DASHBOARD, '/tacgia'),
    },
    theloai: {
        root: path(ROOTS_DASHBOARD, '/theloai'),
    },
    ngonngu: {
        root: path(ROOTS_DASHBOARD, '/ngonngu'),
    },
    hoadon: {
        root: path(ROOTS_DASHBOARD, '/hoadon')
    },
    store: {
        root: path(ROOTS_DASHBOARD, '/store')
    },
    thongke: {
        root: path(ROOTS_DASHBOARD, '/thongke')
    }
};