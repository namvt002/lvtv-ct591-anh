import {Icon} from '@iconify/react';
import fileFill from '@iconify/icons-eva/file-fill';

// routes
import {PATH_DASHBOARD} from '../../routes/paths';

// ----------------------------------------------------------------------

const ICON_SIZE = {
    width: 22,
    height: 22,
};

const menuConfig = [
        {
            title: 'Tất cả sản phẩm',
            path: '/pages',
            icon: <Icon icon={fileFill} {...ICON_SIZE} />,
            children: [
                {
                    subheader: 'Other',
                    items: [
                        {title: 'About us', path: PATH_DASHBOARD},
                        {title: 'Contact us', path: PATH_DASHBOARD},
                        {title: 'FAQs', path: PATH_DASHBOARD},
                        {title: 'Pricing', path: PATH_DASHBOARD},
                        {title: 'Payment', path: PATH_DASHBOARD},
                        {title: 'Maintenance', path: PATH_DASHBOARD},
                        {title: 'Coming Soon', path: PATH_DASHBOARD},
                    ],
                },
                {
                    subheader: 'Authentication',
                    items: [
                        {title: 'Login', path: PATH_DASHBOARD},
                        {title: 'Register', path: PATH_DASHBOARD},
                        {title: 'Reset password', path: PATH_DASHBOARD},
                        {title: 'Verify code', path: PATH_DASHBOARD},
                    ],
                },
                {
                    subheader: 'Error',
                    items: [
                        {title: 'Page 404', path: PATH_DASHBOARD},
                        {title: 'Page 500', path: PATH_DASHBOARD},
                    ],
                },
                {
                    subheader: 'Dashboard',
                    items: [{title: 'Dashboard', path: PATH_DASHBOARD.root}],
                },
            ],
        },

    ]
;

export default menuConfig;
