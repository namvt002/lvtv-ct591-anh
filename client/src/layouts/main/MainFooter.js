import {Link as ScrollLink} from 'react-scroll';
import {Link as RouterLink} from 'react-router-dom';
// material
import {styled} from '@material-ui/core/styles';
import {Container, Divider, Grid, Link, Stack, Typography} from '@material-ui/core';
// routes
//
import Logo from '../../components/Logo';

// ----------------------------------------------------------------------


const LINKS = [
    {
        headline: 'Khóa học',
        children: [
            {name: 'Khóa học HTML', href: '#'},
            {name: 'Khóa học CSS', href: '#'},
            {name: 'Khóa học JavaScript', href: '#'},
            {name: 'Khóa học Python', href: '#'},
        ]
    },
    {
        headline: 'Hỗ trợ',
        children: [
            {name: 'Quên mật khẩu', href: '#'},
            {name: 'Đổi mật khẩu', href: '#'},
        ]
    },
    {
        headline: 'Tài khoản của tôi',
        children: [
            {name: 'Đăng nhập/Tạo mới tài khoản', href: '#'},
            {name: 'Chi tiết tài khoản', href: '#'},
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
                            Đường 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ <br/> LearnCode nơi cung cấp tri thức trẻ cho mọi
                            người!
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
