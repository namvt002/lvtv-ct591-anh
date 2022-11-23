// routes
import {PATH_DASHBOARD} from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
    <SvgIconStyle
        src={`/static/icons/navbar/${name}.svg`}
        sx={{width: '100%', height: '100%'}}
    />
);

const ICONS = {
    user: getIcon('ic_user'),
    store: getIcon('ic_store'),
    course: getIcon('ic_course'),
    lesson: getIcon('ic_lesson'),
    question: getIcon('ic_question'),
    blog: getIcon('ic_blog'),
};

const sidebarConfig = [
    // ----------------------------------------------------------------------
    {
        items: [
            {
                title: 'Thông tin trang web',
                path: PATH_DASHBOARD.store.root,
                icon: ICONS.store
            },
            {
                title: 'user',
                path: PATH_DASHBOARD.user.list,
                icon: ICONS.user,
            },
            {
                title: 'Khóa học',
                path: PATH_DASHBOARD.course.root,
                icon: ICONS.course,
            },
            {
                title: 'Bài học',
                path: PATH_DASHBOARD.lesson.root,
                icon: ICONS.lesson
            }, {
                title: 'Bài kiểm tra',
                path: PATH_DASHBOARD.question.root,
                icon: ICONS.question
            },{
                title: 'Bài viết',
                path: PATH_DASHBOARD.blogmanager.root,
                icon: ICONS.blog
            }],
    },
];

export default sidebarConfig;
