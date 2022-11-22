import Page from "../../components/Page";
import useSettings from "../../hooks/useSettings";
import {Box, Card, Container, styled, Tab, Tabs} from "@material-ui/core";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import {useSelector} from "react-redux";
import {PATH_PAGE} from "../../routes/paths";
import {ProfileCover} from "../../components/user/profile";
import {Icon} from "@iconify/react";
import {useState} from "react";

import UserNewForm from "../../components/_dashboard/user/UserNewForm";
import ChangePasswordForm from "../../components/authentication/change-password/ChangePasswordForm";
import MyBlog from "./MyBlog";
import MyCertficate from "./MyCertficate";
//----------------------------------------------------------------------------------------------
const RootStyle = styled(Page)(({theme}) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(11)
    }
}));

const TabsWrapperStyle = styled('div')(({theme}) => ({
    zIndex: 9,
    bottom: 0,
    width: '100%',
    display: 'flex',
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up('sm')]: {
        justifyContent: 'center'
    },
    [theme.breakpoints.up('md')]: {
        justifyContent: 'flex-end',
        paddingRight: theme.spacing(3)
    }
}));
//----------------------------------------------------------------------------------------------
export default function Profile() {
    const {themeStretch} = useSettings();
    const user = useSelector(state => state.user.current);
    const isShipper = user.role === 'SHIPPER';
    const [currentTab, setCurrentTab] = useState(isShipper ? 'Đơn hàng vận chuyển' : 'Đơn hàng');

    const handleChangeTab = (event, newValue) => {
        setCurrentTab(newValue);
    };

    let PROFILE_TABS = [{
        value: 'Thông tin tài khoản',
        icon: <Icon icon="bxs:user-rectangle" width={20} height={20}/>,
        component: <UserNewForm currentUser={user} isEdit={true} id={user?.id} isProfile={true}/>
    }, {
        value: 'Đổi mật khẩu',
        icon: <Icon icon="ic:sharp-change-circle" width={20} height={20}/>,
        component: <ChangePasswordForm/>
    }, {
        value: 'Bài viết',
        icon: <Icon icon="fa6-solid:blog" width={20} height={20}/>,
        component: <MyBlog />
    }, {
        value: 'Chứng chỉ của tôi',
        icon: <Icon icon="fluent:certificate-20-regular" width={20} height={20}/>,
        component: <MyCertficate/>
    }
    ];


    return (
        <RootStyle title='Profile'>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Trang cá nhân"
                    links={[
                        {name: 'Người dùng', href: PATH_PAGE.profile},
                        {name: user.fullname}
                    ]}
                />

                <Card
                    sx={{
                        mb: 3,
                        height: 280,
                        position: 'relative'
                    }}
                >
                    <ProfileCover/>
                    <TabsWrapperStyle>
                        <Tabs
                            value={currentTab}
                            scrollButtons="auto"
                            variant="scrollable"
                            allowScrollButtonsMobile
                            onChange={handleChangeTab}
                        >
                            {PROFILE_TABS.map((tab) => (
                                <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon}
                                     label={tab.value}/>
                            ))}
                        </Tabs>
                    </TabsWrapperStyle>
                </Card>
                {PROFILE_TABS.map((tab) => {
                    const isMatched = tab.value === currentTab;
                    return isMatched && <Box key={tab.value}>{tab.component}</Box>;
                })}
            </Container>
        </RootStyle>
    )
}