import {Link as RouterLink, useSearchParams} from 'react-router-dom';
// material
import {styled} from '@material-ui/core/styles';
import {Box, Card, Container, Link, Stack, Typography,} from '@material-ui/core';
// routes
import {PATH_AUTH} from '../../routes/paths';
// layouts
import AuthLayout from '../../layouts/AuthLayout';
// components
import Page from '../../components/Page';
import {MHidden, MIconButton} from '../../components/@material-extend';
import {LoginForm} from '../../components/authentication/login';
import {useSnackbar} from 'notistack5';
import {Icon} from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const SectionStyle = styled(Card)(({theme}) => ({
    width: '100%',
    maxWidth: 464,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({theme}) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
    const [errParams] = useSearchParams();
    let err = errParams.get('noErr');
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    if (Number(err) === 2) {
        enqueueSnackbar('Tài khoản đã bị vô hiệu hóa', {
            variant: 'error',
            action: (key) => (
                <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                    <Icon icon={closeFill}/>
                </MIconButton>
            ),
        });
    }
    return (
        <RootStyle title="Login | Minimal-UI">
            <AuthLayout>
                Bạn chưa có tài khoản? &nbsp;
                <Link
                    underline="none"
                    variant="subtitle2"
                    component={RouterLink}
                    to={PATH_AUTH.register}
                >
                    Đăng ký
                </Link>
            </AuthLayout>

            <MHidden width="mdDown">
                <SectionStyle>
                    <Typography variant="h4" sx={{px: 5, mt: 10, mb: 5}}>
                        Cửa hàng HYBE xin chào!!
                    </Typography>
                    <img src="/static/illustrations/login.png" alt="login"/>
                </SectionStyle>
            </MHidden>

            <Container maxWidth="sm">
                <ContentStyle>
                    <Stack direction="row" alignItems="center" sx={{mb: 5}}>
                        <Box sx={{flexGrow: 1}}>
                            <Typography variant="h4" gutterBottom>
                                Đăng nhập
                            </Typography>
                        </Box>

                        <Box
                            component="img"
                            src={`/static/auth/ic_jwt.png`}
                            sx={{width: 32, height: 32}}
                        />
                    </Stack>

                    <LoginForm errParams={errParams}/>

                    <MHidden width="smUp">
                        <Typography variant="body2" align="center" sx={{mt: 3}}>
                            Bạn chưa có tài khoản?&nbsp;
                            <Link
                                variant="subtitle2"
                                component={RouterLink}
                                to={PATH_AUTH.register}
                            >
                                Đăng ký
                            </Link>
                        </Typography>
                    </MHidden>
                </ContentStyle>
            </Container>
        </RootStyle>
    );
}