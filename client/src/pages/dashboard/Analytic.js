import Page from "../../components/Page";
import {Box, Container, Grid, Typography} from "@material-ui/core";
import {useEffect, useState} from "react";
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import AnalyticUser from "../../components/_dashboard/analystic/AnalyticUser";
import AnalyticNhap from "../../components/_dashboard/analystic/AnalyticNhap";
import AnalyticHoaDon from "../../components/_dashboard/analystic/AnalyticHoaDon";
import DoThi from "../../components/_dashboard/analystic/DoThi";

export default function Analytic() {
    const [thongke, setThongke] = useState([]);

    useEffect(()=>{
        (async ()=>{
            const _res = await getData(API_BASE_URL +`/thongke`);
            setThongke(_res.data);
        })()
    }, []);

    return <>
        <Page title="Thống kê">
            <Container>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Thống kê</Typography>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <AnalyticUser total={thongke.user} text='Người dùng đăng ký' />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <AnalyticUser total={thongke.employee} text={'Nhân viên'} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <AnalyticUser total={thongke.shipper} text={'Nhân viên giao hàng'} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <AnalyticNhap total={thongke.so_luong_nhap} text={'Số lượng sách đã nhập'} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <AnalyticNhap total={thongke.so_luong_ban} text={'Số lượng sách đã bán'} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <AnalyticHoaDon total={thongke.hoa_don_da_giao} text={'Đơn hàng đã giao thành công'} />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        {thongke?.theo_nam && <DoThi theo_nam={thongke.theo_nam}/>}
                    </Grid>
                </Grid>
            </Container>
        </Page>
        </>
}