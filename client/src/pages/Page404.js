import {motion} from 'framer-motion';
import {Link as RouterLink} from 'react-router-dom';
// material
import {styled} from '@material-ui/core/styles';
import {Box, Button, Container, Typography} from '@material-ui/core';
// components
import {MotionContainer, varBounceIn} from '../components/animate';
import Page from '../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function Page404() {
    return (
        <RootStyle title="404 Page Not Found | Minimal-UI">
            <Container>
                <MotionContainer initial="initial" open>
                    <Box sx={{maxWidth: 540, margin: 'auto', textAlign: 'center'}}>
                        <motion.div variants={varBounceIn}>
                            <Typography variant="h3" paragraph>
                                Xin lỗi! Trang yêu cầu không tồn tại
                            </Typography>
                        </motion.div>

                        <Button
                            to="/"
                            size="large"
                            variant="contained"
                            component={RouterLink}
                        >
                            Trang chủ
                        </Button>
                    </Box>
                </MotionContainer>
            </Container>
        </RootStyle>
    );
}
