import {Link as ScrollLink} from 'react-scroll';
import {Link as RouterLink} from 'react-router-dom';
// material
import {styled} from '@material-ui/core/styles';
import {Container, Divider, Grid, Link, Stack, Typography} from '@material-ui/core';
// routes
import {PATH_PAGE} from '../../routes/paths';
//
import Logo from '../../components/Logo';

// ----------------------------------------------------------------------


const LINKS = [
    {
        headline: 'Dịch vụ',
        children: [
            {name: 'Điều khoản dịch vụ', href: PATH_PAGE.product},
            {name: 'Chính sách bảo mật thông tin cá nhân', href: PATH_PAGE.product},
            {name: 'Chính sách bảo mật thông tin thanh toán', href: PATH_PAGE.product},
            {name: 'Giới thiệu HYPE', href: PATH_PAGE.product}
        ]
    },
    {
        headline: 'Hỗ trợ',
        children: [
            {name: 'Chính sách đổi - trả - hoàn tiền', href: '#'},
            {name: 'Chính sách bảo hành- bồi hoàn', href: '#'},
            {name: 'Chính sách vận chuyển', href: '#'},
            {name: 'Chính sách bán sỉ', href: '#'},
            {name: 'Phương thức thanh toán', href: '#'},

        ]
    },
    {
        headline: 'Tài khoản của tôi',
        children: [
            {name: 'Đăng nhập/Tạo mới tài khoản', href: '#'},
            {name: 'Chi tiết tài khoản', href: '#'},
            {name: 'Lịch sử mua hàng', href: '#'}
        ]
    }
];

const RootStyle = styled('div')(({theme}) => ({
    position: 'relative',
    backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------

export default function MainFooter() {
    return (
        <RootStyle>
            <Divider/>
            <Container maxWidth="lg" sx={{pt: 10}}>
                <Grid
                    container
                    justifyContent={{xs: 'center', md: 'space-between'}}
                    sx={{textAlign: {xs: 'center', md: 'left'}}}
                >
                    <Grid item xs={12} sx={{mb: 3}}>
                        <ScrollLink to="move_top" spy smooth>
                            <Logo sx={{mx: {xs: 'auto', md: 'inherit'}}}/>
                        </ScrollLink>
                    </Grid>
                    <Grid item xs={8} md={3}>
                        <Typography variant="body2" sx={{pr: {md: 5}}}>
                            Đường 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ <br/> Nhà sách HYBE nhận đặt hàng trực tuyến và
                            giao hàng tận
                            nơi trong Cần Thơ.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Stack spacing={5} direction={{xs: 'column', md: 'row'}} justifyContent="space-between">
                            {LINKS.map((list) => {
                                const {headline, children} = list;
                                return (
                                    <Stack key={headline} spacing={2}>
                                        <Typography component="p" variant="overline">
                                            {headline}
                                        </Typography>
                                        {children.map((link) => (
                                            <Link
                                                to={link.href}
                                                key={link.name}
                                                color="inherit"
                                                variant="body2"
                                                component={RouterLink}
                                                sx={{display: 'block'}}
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </Stack>
                                );
                            })}
                        </Stack>
                    </Grid>
                </Grid>

                <Typography
                    component="p"
                    variant="body2"
                    sx={{
                        mt: 10,
                        pb: 5,
                        fontSize: 13,
                        textAlign: {xs: 'center', md: 'left'}
                    }}
                >
                    © 2022. LearnCode
                </Typography>
            </Container>
        </RootStyle>
    );
}
