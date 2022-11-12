import {lazy, Suspense} from 'react';
import {Navigate, useLocation, useRoutes} from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';
import {useSelector} from "react-redux";

// ----------------------------------------------------------------------
const Loadable = (Component) => (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {pathname} = useLocation();
    const isDashboard = pathname.includes('/dashboard');

    return (
        <Suspense
            fallback={
                <LoadingScreen
                    sx={{
                        ...(!isDashboard && {
                            top: 0,
                            left: 0,
                            width: 1,
                            zIndex: 9999,
                            position: 'fixed',
                        }),
                    }}
                />
            }
        >
            <Component {...props} />
        </Suspense>
    );
};

export default function Router() {
    const isLogined = !!useSelector(state => state.user.current?.id);
    const isAdmin = useSelector(state => state.user.current?.role) === "ADMIN";
    const isEmployee = useSelector(state => state.user.current?.role) === "EMPLOYEE";

    return useRoutes([
        {
            path: 'auth',
            children: [
                {
                    path: 'login',
                    element: <Login/>,
                },
                {
                    path: 'register',
                    element: <Register/>,
                },
                {path: 'verify', element: <VerifyCode/>},
                {path: 'forgot-password', element: <ForgotPassword/>},
                {path: 'reset-password/:token', element: <ResetPassword/>}
            ],
        },

        // Dashboard Routes
        {
            path: 'dashboard',
            element: (isAdmin || isEmployee) ? <DashboardLayout/> : <Navigate to='/'/>,
            children: [
                {
                    path: '/',
                    element: <Analytic/>
                },
                {
                    path: 'user',
                    children: [
                        {
                            path: '/',
                            element: <UserList/>,
                        },
                        {path: 'list', element: <UserList/>},
                        {path: 'new', element: <UserCreate/>},
                        {path: '/:id/edit', element: <UserCreate/>},
                    ],
                },
                {
                    path: 'course',
                    children: [
                        {
                            path: '/',
                            element: <Course/>,
                        },
                        {
                            path: '/new',
                            element: <BookCreate/>,
                        },
                        {
                            path: '/:id/edit',
                            element: <BookCreate/>,
                        },
                    ],
                },
                {
                    path: 'role',
                    children: [
                        {
                            path: '/',
                            element: <RoleList/>,
                        },
                        {
                            path: '/new',
                            element: <RoleCreate/>,
                        },
                        {
                            path: '/:id/edit',
                            element: <RoleCreate/>,
                        },
                    ],
                },
                
                {
                    path: '/store',
                    element: <Store/>
                }
            ],
        },

        // Main Routes
        {
            path: '*',
            element: <LogoOnlyLayout/>,
            children: [
                {path: '500', element: <Page500/>},
                {path: '404', element: <NotFound/>},
                {path: '*', element: <Navigate to="/404" replace/>},
            ],
        },
        {
            path: '/',
            element: <MainLayout/>,
            children: [{
                path: '/',
                element: <ProductList/>
            }, {
                path: 'change-password',
                element: <ChangePassword/>
            }, {
                path: 'profile',
                element: isLogined ? <Profile/> : <Navigate to='/'/>
            }, {
                path: 'product',
                element: <ProductFilter/>
            }, {
                path: 'shopcart',
                element: <ShopCart/>
            }, {
                path: 'product-detail/:id',
                element: <ProductDetail/>
            }
            ]
        },
        {path: '*', element: <Navigate to="/404" replace/>},
    ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(
    lazy(() => import('../pages/authentication/Register')),
);
const ForgotPassword = Loadable(lazy(() => import('../pages/authentication/ForgotPassword')));

const VerifyCode = Loadable(
    lazy(() => import('../pages/authentication/VerifyCode')),
);

const ChangePassword = Loadable(lazy(() => import('../pages/authentication/ChangePassword')));

const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
//--------------------------------user------------------------------
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));

const UserCreate = Loadable(
    lazy(() => import('../pages/dashboard/UserCreate')),
);

const Profile = Loadable(lazy(() => import('../pages/homepages/Profile')))

//-------------------------role-------------------------------------
const RoleList = Loadable(lazy(() => import('../pages/dashboard/RoleList')));
const RoleCreate = Loadable(
    lazy(() => import('../pages/dashboard/RoleCreate')),
);



const ProductList = Loadable(lazy(() => import('../pages/homepages/ShopProduct')));
const ProductFilter = Loadable(lazy(() => import('../pages/homepages/ProductFilter')));
const ProductDetail = Loadable(lazy(() => import('../pages/homepages/ProductDetail')));
const ShopCart = Loadable(lazy(() => import('../pages/homepages/ShopCart')));
const BookCreate = Loadable(
    lazy(() => import('../pages/dashboard/BookCreate')),
);


const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
const Store = Loadable(lazy(() => import('../pages/dashboard/Store')));
const Analytic = Loadable(lazy(() => import('../pages/dashboard/Analytic')));
const Course = Loadable(lazy(()=>import('../pages/dashboard/Course')))