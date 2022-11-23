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
    productDetail: '/product-detail',
    code: '/run-code',
    course_content: '/course-content',
    certificate: '/certificate',
    blog: '/blog',
    blogNew: '/blog/new',

};

export const PATH_DASHBOARD = {
    root: ROOTS_DASHBOARD,
    user: {
        root: path(ROOTS_DASHBOARD, '/user'),
        profile: path(ROOTS_DASHBOARD, '/user/profile'),
        list: path(ROOTS_DASHBOARD, '/user/list'),
        new: path(ROOTS_DASHBOARD, '/user/new'),
    },
    course: {
        root: path(ROOTS_DASHBOARD, '/course'),
        new: path(ROOTS_DASHBOARD, '/course/new'),
    },
    store: {
        root: path(ROOTS_DASHBOARD, '/store')
    },
    lesson: {
        root: path(ROOTS_DASHBOARD, '/lesson'),
        new: path(ROOTS_DASHBOARD, '/lesson/new')
    },
    question: {
        root: path(ROOTS_DASHBOARD, '/question'),
        new: path(ROOTS_DASHBOARD, '/question/new')
    },
    blogmanager: {
        root: path(ROOTS_DASHBOARD, '/blogmanager'),
    }


};