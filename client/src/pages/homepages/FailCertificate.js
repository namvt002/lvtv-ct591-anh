import { v4 as uuidv4 } from 'uuid';
import { random, sum } from 'lodash';
// material
import { styled } from '@material-ui/core/styles';
import {
    Box,
    Grid,
    Card,
    TableRow,
    Container,
    Typography,
    TableContainer
} from '@material-ui/core';
// routes

import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Logo from "../../components/Logo";
import {useSelector} from "react-redux";

// ----------------------------------------------------------------------


const RowResultStyle = styled(TableRow)(({ theme }) => ({
    '& td': {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    }
}));

// ----------------------------------------------------------------------

export default function FailCertificate({diem, baithi, userName}) {
    let ngay = new Date();
    const userid = useSelector(state => state.user.current?.fullname)
    const { themeStretch } = useSettings();
    return (
        <Page title="Ecommerce: Invoice | Minimal-UI">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Chứng chỉ khóa học"
                    links={[
                        { name: 'Trang chủ', href: '/' },
                        { name: 'Chứng chỉ' }
                    ]}
                />
                <Card sx={{ pt: 5, px: 5 }}>
                    <Grid container>
                        <Grid item xs={12} sm={6} sx={{ mb: 4, width: '300px'}}>
                            <div style={{display: "flex"}}>
                                <Logo />
                                <Typography variant="h4" sx={{ ml: 2, mt:1, color: 'text.primary'}}>
                                    LearnCode
                                </Typography>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
                            <Box sx={{ textAlign: { sm: 'right' } }}>
                                <Label color="error" sx={{ textTransform: 'uppercase', mb: 1 }}>
                                    Chưa hoàn thành chứng chỉ {baithi.baikiemtra.kh_ten}
                                </Label>
                                <Typography variant="h6"></Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={12} md={9} sx={{ py: 3 }}>
                            <Typography variant="h6" sx={{ml: 2, color: 'text.primary', textAlign: 'left'}}>
                                Vui lòng thi lại để lấy chứng chỉ điểm đậu phải lơn hơn 70 điểm
                            </Typography>
                        </Grid>
                    </Grid>


                    <Grid item xs={12} md={9} sx={{ py: 3 }}>
                        <Typography variant="h4" sx={{ color: 'text.primary'}}>{userName}</Typography>
                        <Typography variant="body2">Điểm: {diem} </Typography>
                        <Typography variant="body2">
                            Ngày : {ngay.getDate()}/{ngay.getMonth()}/{ngay.getFullYear()}
                        </Typography>
                    </Grid>

                </Card>
            </Container>
        </Page>
    );
}
