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
    user        : getIcon('ic_user'),
    store       : getIcon('ic_store'),
    course      : getIcon('ic_course')
};

const sidebarConfig = [
    // ----------------------------------------------------------------------
    {
        items: [
            {
                title   : 'Thông tin trang web',
                path    : PATH_DASHBOARD.store.root,
                icon    : ICONS.store
            },
            {
                title   : 'user',
                path    : PATH_DASHBOARD.user.list,
                icon    : ICONS.user,
            },
            {
                title   : 'Khóa học',
                path    : PATH_DASHBOARD.course.root,
                icon    : ICONS.course,
            },
        ],
    },
];

export default sidebarConfig;
