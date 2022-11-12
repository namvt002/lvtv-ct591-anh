import {
    Box,
    Button,
    Card,
    Grid,
    IconButton,
    Link,
    OutlinedInput,
    Stack,
    Step,
    StepButton,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import {styled} from "@material-ui/core/styles";
import {useEffect, useState} from "react";
import {API_BASE_URL, URL_PUBLIC_IMAGES} from "../../config/configUrl";
import {useSelector} from "react-redux";
import {getData, putData} from "../../_helper/httpProvider";
import {formatDateTime} from "../../_helper/formatDate";
import {fCurrency} from "../../_helper/formatCurrentCy";
import DialogConfirm from "../../components/_dashboard/DialogConfirm";
import {useSnackbar} from "notistack5";
import {Icon} from '@iconify/react';
import Scrollbar from "../../components/Scrollbar";
import {Link as RouterLink} from "react-router-dom";
import {PATH_PAGE} from "../../routes/paths";
//-----------------------------------------------------------------------------
const SearchStyle = styled(OutlinedInput)(({theme}) => ({
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {boxShadow: theme.customShadows.z8},
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${theme.palette.grey[500_32]} !important`,
    },
}));

const ThumbImgStyle = styled('img')(({theme}) => ({
    width: 64,
    height: 64,
    objectFit: 'cover',
    marginRight: theme.spacing(2),
    borderRadius: theme.shape.borderRadiusSm
}));
//-----------------------------------------------------------------------------

const steps = ["Chờ xác nhận", "Đã xác nhận", "Đã lấy hàng", "Đã giao", "Đã hủy"];

export default function Order() {
    const id = useSelector(state => state.user.current?.id)
    const {enqueueSnackbar} = useSnackbar();

    const [idhd, setIdhd] = useState(null);
    const [hoadon, setHoadon] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [load, setLoad] = useState(0);
    const [detail, setDetail] = useState({});
    const [search, setSearch] = useState('');
    const [activeStep, setActiveStep] = useState(0);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpenDetail = () => {
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    useEffect(() => {
        (async () => {
            const _hoadon = await getData(API_BASE_URL + `/hoadon/${id}?trangthai=${activeStep}&&search=${search}`);
            setHoadon(_hoadon.data);
        })()
    }, [id, load, activeStep, search]);

    const changeOrder = async () => {
        try {
            console.log(idhd)
            if (!idhd) return;
            await putData(API_BASE_URL + `/hoadon/${idhd}`, {tt_trangthai: 4});
            setLoad(e => e + 1)
            enqueueSnackbar(
                'Hủy đơn hàng thành công!',
                {
                    variant: 'success',
                },
            );
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <Card sx={{my: 2}}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <SearchStyle
                            sx={{m: 2}}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm kiếm đơn hàng..."
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction='row' justifyContent='center'>
                            <Stepper nonLinear activeStep={activeStep} sx={{m: 2}}>
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepButton color="inherit" onClick={handleStep(index)}>
                                            {label}
                                        </StepButton>
                                    </Step>
                                ))}
                            </Stepper>
                        </Stack>
                    </Grid>
                </Grid>

            </Card>
            <Card sx={{p: 2}}>
                <TableContainer sx={{minWidth: 720}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID Đơn</TableCell>
                                <TableCell align="left">Họ tên</TableCell>
                                <TableCell align="left">Tổng đơn</TableCell>
                                <TableCell align="left">Tiền vận chuyển</TableCell>
                                <TableCell align="left">HTTT</TableCell>
                                <TableCell align="left">Ngày tạo</TableCell>
                                <TableCell align="left">Trạng thái</TableCell>
                                <TableCell/>
                                <TableCell/>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {hoadon?.map((e, idx) => {
                                let {
                                    hd_id,
                                    hd_tenkh,
                                    hd_tongtien,
                                    hd_tienvc,
                                    hd_hinhthucthanhtoan,
                                    hd_ngaytao,
                                    trangthai
                                } = e;
                                const hd_trangthai = trangthai[trangthai.length - 1].tt_trangthai;
                                let hd_ngaytt = trangthai[trangthai.length - 1].tt_ngaycapnhat
                                return (
                                    <TableRow>
                                        <TableCell>#{hd_id}</TableCell>
                                        <TableCell>{hd_tenkh}</TableCell>
                                        <TableCell
                                            sx={{width: '8rem'}}>{!!hd_tienvc ? fCurrency(hd_tongtien + hd_tienvc) : fCurrency(hd_tongtien)}</TableCell>
                                        <TableCell>{!!hd_tienvc ? fCurrency(hd_tienvc) : '0đ'}</TableCell>
                                        <TableCell>{hd_hinhthucthanhtoan}</TableCell>
                                        <TableCell>{formatDateTime(hd_ngaytao)}</TableCell>
                                        <TableCell>
                                            {hd_trangthai === 0 &&
                                                <Typography color='lightseagreen'>Chờ xác nhận</Typography>}
                                            {hd_trangthai === 1 &&
                                                <>
                                                    <Typography color='lightgreen'>Đã xác nhận</Typography>
                                                    <Typography
                                                        variant='subtitle2'> {formatDateTime(hd_ngaytt)}</Typography>
                                                </>}
                                            {hd_trangthai === 2 &&
                                                <Typography color='blueviolet'>Đã lấy hàng</Typography>}
                                            {hd_trangthai === 3 &&
                                                <>
                                                    <Typography color='hotpink'>Đã giao hàng </Typography>
                                                    <Typography
                                                        variant='subtitle2'> {formatDateTime(hd_ngaytt)}</Typography>
                                                </>}
                                            {hd_trangthai === 4 && <Typography color='error'>Đã hủy</Typography>}
                                        </TableCell>
                                        <TableCell>
                                            {(hd_trangthai === 0 && hd_hinhthucthanhtoan === 'offline') &&
                                                <Button onClick={() => {
                                                    setIdhd(hd_id);
                                                    handleClickOpen()
                                                }}>
                                                    Hủy
                                                </Button>}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => {
                                                setDetail(e);
                                                console.log(e)
                                                handleClickOpenDetail();
                                            }}>
                                                <Icon icon="el:eye-open"/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
            <DialogConfirm
                open={open}
                handleClose={handleClose}
                message={
                    <>
                        <Typography color="error" variant="h4" align="center">
                            Bạn chắc chắn muốn hủy đơn hàng?
                        </Typography>
                        <TextField
                            label="Lý do hủy"
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </>
                }
                linkTo
                excFunc={changeOrder}
            />

            <DialogConfirm
                open={openDetail}
                handleClose={handleCloseDetail}
                title='Chi tiết hóa đơn'
                maxWidth="md"
                message={
                    <>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle2" sx enableEdit={{color: 'text.secondary'}}>
                                Họ và tên
                            </Typography>
                            <Typography variant="body2">{detail.hd_tenkh}</Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle2" sx enableEdit={{color: 'text.secondary'}}>
                                Số điện thoại
                            </Typography>
                            <Typography variant="body2">{detail.hd_sdt}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle2" sx enableEdit={{color: 'text.secondary'}}>
                                Email
                            </Typography>
                            <Typography variant="body2">{detail.hd_email}</Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle2" sx enableEdit={{color: 'text.secondary'}}>
                                Địa chỉ
                            </Typography>
                            <Typography variant="body2">{detail.hd_diachi}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle2" sx enableEdit={{color: 'text.secondary'}}>
                                Tiền vận chuyển
                            </Typography>
                            <Typography variant="body2">{fCurrency(detail.hd_tienvc)}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle2" sx enableEdit={{color: 'text.secondary'}}>
                                Tổng đơn
                            </Typography>
                            <Typography variant="body2">{fCurrency(detail.hd_tongtien+detail.hd_tienvc)}</Typography>
                        </Stack>
                        <Scrollbar>
                            <TableContainer sx={{minWidth: 720, mt: 2}}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align='center'>Sách</TableCell>
                                            <TableCell align="left">Giá</TableCell>
                                            <TableCell align="center">Số lượng</TableCell>
                                            <TableCell align="center">Tổng giá</TableCell>
                                            <TableCell align="right"/>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {detail.cthd?.map((e, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                        <ThumbImgStyle alt="product image"
                                                                       src={URL_PUBLIC_IMAGES + e.ha_hinh}/>
                                                        <Box>
                                                            <Link to={`${PATH_PAGE.productDetail}/${e.cthd_idsp}`}
                                                                  color="inherit" component={RouterLink}>
                                                                <Typography noWrap variant="subtitle2"
                                                                            sx={{maxWidth: 240, mb: 0.5}}>
                                                                    {e.sp_ten}
                                                                </Typography>
                                                            </Link>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        component="span"
                                                        variant="body1"
                                                        sx={{
                                                            color: 'text.disabled',
                                                            textDecoration: 'line-through'
                                                        }}
                                                    >
                                                        {!!e.cthd_giakm && fCurrency(e.cthd_giaban)}
                                                    </Typography>
                                                    <Typography>
                                                        {!!e.cthd_giakm ? fCurrency(e.cthd_giakm) : fCurrency(e.cthd_giaban)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align='center'>{e.cthd_soluong}</TableCell>
                                                <TableCell align='center'>
                                                    {fCurrency((e.cthd_giakm ? e.cthd_giakm : e.cthd_giaban) * e.cthd_soluong)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Scrollbar>
                    </>
                }
            />
        </>
    )
}