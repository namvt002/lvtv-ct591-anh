import {Link as RouterLink} from 'react-router-dom';
// material
import {styled} from '@material-ui/core/styles';
import {Box, Card, Container, Link, Typography,} from '@material-ui/core';
// hooks
// routes
import {PATH_AUTH} from '../../routes/paths';
// layouts
import AuthLayout from '../../layouts/AuthLayout';
// components
import Page from '../../components/Page';
import {MHidden} from '../../components/@material-extend';
import {RegisterForm} from '../../components/authentication/register';

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

export default function Register() {

    return (
        <RootStyle title="Register | Minimal-UI">
            <AuthLayout>
                Bạn đã có tài khoản? &nbsp;
                <Link
                    underline="none"
                    variant="subtitle2"
                    component={RouterLink}
                    to={PATH_AUTH.login}
                >
                    Đăng nhập
                </Link>
            </AuthLayout>

            <MHidden width="mdDown">
                <SectionStyle>
                    <Typography variant="h4" sx={{px: 5, mt: 10, mb: 5}}>
                        Chào mừng bạn đến với LearnCode!
                    </Typography>
                    <img
                        alt="register"
                        src="/static/illustrations/register.png"
                    />
                </SectionStyle>
            </MHidden>

            <Container>
                <ContentStyle>
                    <Box sx={{mb: 5, display: 'flex', alignItems: 'center'}}>
                        <Box sx={{flexGrow: 1}}>
                            <Typography variant="h4" gutterBottom>
                                Đăng ký
                            </Typography>
                        </Box>
                        <Box
                            component="img"
                            src={`/static/auth/ic_jwt.png`}
                            sx={{width: 32, height: 32}}
                        />
                    </Box>

                    <RegisterForm/>

                    <MHidden width="smUp">
                        <Typography variant="subtitle2" sx={{mt: 3, textAlign: 'center'}}>
                            Bạn đã có tài khoản?&nbsp;
                            <Link to={PATH_AUTH.login} component={RouterLink}>
                                Đăng nhập
                            </Link>
                        </Typography>
                    </MHidden>
                </ContentStyle>
            </Container>
        </RootStyle>
    );
}
