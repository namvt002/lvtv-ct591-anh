import {Box, Container, Stack, Table, TableCell, TableHead, TableRow, Typography} from '@material-ui/core';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import {PATH_DASHBOARD} from '../../routes/paths';
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import {fCurrency} from "../../_helper/formatCurrentCy";
import {formatDateTime} from "../../_helper/formatDate";

export default function PhieuNhapDetail() {
    const {themeStretch} = useSettings();
    const {id} = useParams();
    const [phieunhapDetail, setPhieunhapDetail] = useState([]);

    useEffect(() => {
        (async () => {
            const _res = await getData(API_BASE_URL + `/phieunhap/${id}`);
            setPhieunhapDetail((_res.data))
        })()
    }, [id])
    return (
        <Page title="PN">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={'Phiếu nhập'}
                    links={[
                        {name: 'Quản lý', href: PATH_DASHBOARD.root},
                        {name: 'Phiếu nhập', href: PATH_DASHBOARD.phieunhap.root},
                        {name: id},
                    ]}
                />
                {phieunhapDetail.length > 0 && (
                    <Box padding={4}>
                        <Typography variant="h4" align="center">
                            Phiếu nhập
                        </Typography>
                        <Stack
                            spacing={{xs: 3, sm: 2}}
                            m={2}
                        >
                            <Typography>
                                Nhân viên: <b>{phieunhapDetail[0].fullname}</b>
                            </Typography>
                            <Typography>
                                Nhà cung cấp: <b>{phieunhapDetail[0].ncc_ten}</b>
                            </Typography><Typography>
                            Tổng tiền: <b>{fCurrency(phieunhapDetail[0]?.pn_tongtien)}</b>
                        </Typography>
                            <Typography>
                                Ngày nhập: <b>{formatDateTime(phieunhapDetail[0]?.pn_ngaylapphieu)}</b>
                            </Typography>

                        </Stack>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã sản phẩm</TableCell>
                                    <TableCell>Tên sản phẩm</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell>Giá</TableCell>
                                </TableRow>
                            </TableHead>
                            {phieunhapDetail.map((book, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{book.sp_masp}</TableCell>
                                    <TableCell>{book.sp_ten}</TableCell>
                                    <TableCell>{book.ctpn_soluong}</TableCell>
                                    <TableCell>{fCurrency(book.ctpn_gia)}</TableCell>
                                </TableRow>
                            ))}
                        </Table>
                    </Box>
                )}
            </Container>
        </Page>
    );
}
