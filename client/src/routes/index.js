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
            element: (isAdmin) ? <DashboardLayout/> : <Navigate to='/'/>,
            children: [
                {
                    path: 'user',
                    children: [
                        {
                            path: '',
                            element: <UserList/>,
                        },
                        {path: 'list', element: <UserList/>},
                        {path: 'new', element: <UserCreate/>},
                        {path: ':id/edit', element: <UserCreate/>},
                    ],
                },
                {
                    path: 'course',
                    children: [
                        {
                            path: '',
                            element: <Course/>,
                        },
                        {
                            path: 'new',
                            element: <CourseCreate/>,
                        },
                        {
                            path: ':id/edit',
                            element: <CourseCreate/>,
                        },
                    ],
                }, {
                    path: 'lesson',
                    children: [{
                        path: '',
                        element: <Lesson/>,
                    },
                        {
                            path: 'new',
                            element: <LessonCreate/>
                        }, {
                            path: ':id/edit',
                            element: <LessonCreate/>
                        }]
                },
                {
                    path: 'question',
                    children: [{
                        path: '',
                        element: <Question/>,
                    },
                        {
                            path: 'new',
                            element: <QuestionCreate/>
                        }, {
                            path: ':id/edit',
                            element: <QuestionCreate/>
                        }]
                },
                {
                    path: 'store',
                    element: <Store/>
                },
                {
                    path: 'blogmanager',
                    children: [{
                        path: '',
                        element: <BlogManager />,
                    },
                        {
                            path: 'new',
                            element: <BlogNewPostForm/>
                        }, {
                            path: ':id/edit',
                            element: <BlogNewPostForm/>
                        }, {
                            path: 'detail/:id',
                            element: <BlogDetail/>
                        }]
                },
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
                element: <CourseList/>
            }, {
                path: 'change-password',
                element: <ChangePassword/>
            }, {
                path: 'profile',
                element: isLogined ? <Profile/> : <Navigate to='/'/>
            }, {
                path: 'run-code',
                element: <RunCode/>
            }, {
                path: 'blog',
                children: [{
                    path: '',
                    element: <BlogPosts/>,
                },
                    {
                        path: 'new',
                        element: <BlogNewPostForm/>
                    }, {
                        path: ':id/edit',
                        element: <BlogNewPostForm/>
                    }, {
                        path: 'detail/:id',
                        element: <BlogDetail/>
                    }]
            }, {
                path: 'course-content/:id',
                element: <CourseContent/>
            }, {
                path: 'certificate/:id',
                element: <Certificate/>
            }]
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
//--------------------------------blog------------------------------

const BlogNewPostForm = Loadable(lazy(() => import('../pages/homepages/blog/BlogNewPostForm')))
const BlogPosts = Loadable(lazy(() => import('../pages/homepages/blog/BlogPosts')))
const BlogDetail = Loadable(lazy(() => import('../pages/homepages/blog/BlogDetail')))
const BlogManager = Loadable(lazy(() => import('../pages/dashboard/BlogManager')))



const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
const Store = Loadable(lazy(() => import('../pages/dashboard/Store')));

const Course = Loadable(lazy(() => import('../pages/dashboard/Course')))
const CourseList = Loadable(lazy(() => import('../pages/homepages/CourseList')))
const CourseCreate = Loadable(lazy(() => import('../pages/dashboard/CourseCreate')))
const CourseContent = Loadable(lazy(() => import('../pages/homepages/CourseContent')));

const Lesson = Loadable(lazy(() => import('../pages/dashboard/Lesson')))
const LessonCreate = Loadable(lazy(() => import('../pages/dashboard/LessonCreate')))

const Question = Loadable(lazy(() => import('../pages/dashboard/Question')))
const QuestionCreate = Loadable(lazy(() => import('../pages/dashboard/QuestionCreate')))

const Certificate = Loadable(lazy(() => import('../pages/homepages/Certificate')))

const RunCode = Loadable(lazy(() => import('../pages/homepages/RunCode')))
