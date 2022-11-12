import {Link as RouterLink} from 'react-router-dom';
import {styled} from '@material-ui/core/styles';
// material
import {Box, Button, Container, Typography} from '@material-ui/core';
// components
import Page from '../components/Page';
import {motion} from 'framer-motion';
import {MotionContainer, varBounceIn} from '../components/animate';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function Page500() {
    return (
        <RootStyle title="500 Internal Server Error | Minimal-UI">
            <Container>
                <MotionContainer initial="initial" open>
                    <Box sx={{maxWidth: 480, margin: 'auto', textAlign: 'center'}}>
                        <motion.div variants={varBounceIn}>
                            <Typography variant="h3" paragraph>
                                500 Internal Server Error
                            </Typography>
                            <Typography sx={{color: 'text.secondary'}}>
                                Trang không phản hồi vui lòng quay lại sau!.
                            </Typography>

                            <Button
                                to="/"
                                size="large"
                                variant="contained"
                                component={RouterLink}
                            >
                                Trang chủ
                            </Button>
                        </motion.div>
                    </Box>
                </MotionContainer>
            </Container>
        </RootStyle>
    );
}
