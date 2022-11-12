// material
import {styled} from '@material-ui/core/styles';
import {Box, Container, Stack, Typography,} from '@material-ui/core';
// components
import Page from '../../components/Page';
import ChangePasswordForm from "../../components/authentication/change-password/ChangePasswordForm";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const ContentStyle = styled('div')(({theme}) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
}));

// ----------------------------------------------------------------------

export default function ChangePassword() {
    return (
        <RootStyle title="Quên mật khẩu">
            <Container maxWidth="sm">
                <ContentStyle>
                    <Stack direction="row" alignItems="center" sx={{mb: 5}}>
                        <Box sx={{flexGrow: 1}}>
                            <Typography variant="h4" gutterBottom>
                                Đổi mật khẩu
                            </Typography>
                        </Box>

                        <Box
                            component="img"
                            src={`/static/auth/ic_jwt.png`}
                            sx={{width: 32, height: 32}}
                        />
                    </Stack>
                    <ChangePasswordForm/>
                </ContentStyle>
            </Container>

        </RootStyle>
    );
}
