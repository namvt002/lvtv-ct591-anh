import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getData, postData} from "../../_helper/httpProvider";
import {API_BASE_URL, URL_PUBLIC_IMAGES} from "../../config/configUrl";
import {
    Box,
    Button,
    Card, Divider,
    FormHelperText,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import {styled} from "@material-ui/core/styles";
import {Link as RouterLink, Link} from "react-router-dom";
import {PATH_PAGE} from "../../routes/paths";
import {Icon} from "@iconify/react";
import * as Yup from 'yup';
import {Form, FormikProvider, useFormik} from "formik";
import {useSnackbar} from "notistack5";
import DialogConfirm from "../../components/_dashboard/DialogConfirm";
import {LoadingButton, Rating, TabContext, TabList} from "@material-ui/lab";

//---------------------------------------------------------------------------------------------------------------------------------
const ThumbImgStyle = styled('img')(({theme}) => ({
    width: 64, height: 64, objectFit: 'cover', marginRight: theme.spacing(2), borderRadius: theme.shape.borderRadiusSm
}));

//---------------------------------------------------------------------------------------------------------------------------------
export default function Comment() {
    let user = useSelector(state => state.user.current);
    const {enqueueSnackbar} = useSnackbar();

    let [books, setBooks] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('chuadanhgia');
    const [load, setLoad] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        (async () => {
            const _res = await getData(API_BASE_URL + `/danhgiasanpham/${user.id}?type=${value}`);
            setBooks(_res.data)
        })()
    }, [user.id, value, load]);

    const ReviewSchema = Yup.object().shape({
        bl_danhgia: Yup.mixed().required('Vui lòng đánh giá'),
        bl_noidung: Yup.string().required('Vui lòng nhập bình luận'),
    });

    const formik = useFormik({
        initialValues: {
            bl_danhgia: null,
            bl_noidung: '',
            bl_idsp: '',
            bl_idkh: user.id
        },
        validationSchema: ReviewSchema,
        onSubmit: async (values, {resetForm}) => {
            try {
                await postData(API_BASE_URL + '/danhgiasanpham', values)
                resetForm();
                handleClose();
                setLoad(e => e + 1);
                enqueueSnackbar('Đánh giá sản phẩm thành công', {variant: 'success'});
            } catch (e) {
                console.log(e)
            }
        }
    });

    const {errors, touched, handleSubmit, setFieldValue, getFieldProps} = formik;
    return <>
        <Card>
            <Stack sx={{p: 4}}>
                <TabContext value={value}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Chưa đánh giá" value="chuadanhgia"/>
                        <Tab label="Đã đánh giá" value="danhgia"/>
                    </TabList>
                </TabContext>
            </Stack>
            <TableContainer>
                <Table >
                    <TableBody>
                        {books?.map((el, idx) => (
                            <>
                                <TableRow key={idx}>
                                    <TableCell>
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <ThumbImgStyle alt="product image"
                                                           src={URL_PUBLIC_IMAGES + el.sp_hinhanh[el.sp_hinhanh.length - 1].ha_hinh}/>
                                            <Box>
                                                <Link to={`${PATH_PAGE.productDetail}/${el.sp_id}`} color="inherit"
                                                      component={RouterLink}>
                                                    <Typography variant="subtitle2"
                                                                sx={{maxWidth: 240, mb: 0.5}}>
                                                        {el.sp_ten}
                                                    </Typography>
                                                </Link>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{el.tl_ten}</TableCell>
                                    <TableCell>{el.tg_ten}</TableCell>
                                    {value === 'chuadanhgia' && <TableCell>
                                        <Button variant='contained' endIcon={<Icon icon="ic:outline-star-rate"/>}
                                                onClick={() => {
                                                    setFieldValue('bl_idsp', el.sp_id);
                                                    handleClickOpen();
                                                }}>
                                            Đánh giá
                                        </Button>
                                    </TableCell>}
                                </TableRow>
                                {value !== 'chuadanhgia' && <TableRow>
                                    <TableCell colSpan={3}>
                                        <Stack>
                                            <Rating name="read-only" value={Number(el.bl_danhgia)} readOnly/>
                                            <Typography>{el.bl_noidung}</Typography>
                                            <Divider />
                                        </Stack>
                                    </TableCell>
                                </TableRow>}
                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
        <DialogConfirm
            open={open}
            handleClose={handleClose}
            title='Đánh giá sản phẩm'
            maxWidth="md"
            showAction={false}
            message={
                <>
                    <FormikProvider value={formik}>
                        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <Stack direction={{xs: 'column', sm: 'row'}} alignItems={{sm: 'center'}} spacing={1.5}>
                                    <Typography variant="body2">Đánh giá của bạn về sản phẩm:</Typography>
                                    <Rating
                                        {...getFieldProps('bl_danhgia')}
                                        onChange={(event) => setFieldValue('bl_danhgia', Number(event.target.value))}
                                    />
                                </Stack>
                                {errors.bl_danhgia &&
                                    <FormHelperText error>{touched.bl_danhgia && errors.bl_danhgia}</FormHelperText>}

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    maxRows={5}
                                    label="Bình luận *"
                                    {...getFieldProps('bl_noidung')}
                                    error={Boolean(touched.bl_noidung && errors.bl_noidung)}
                                    helperText={touched.bl_noidung && errors.bl_noidung}
                                />

                                <Stack direction="row" justifyContent="flex-end">
                                    <Button type="button" color="inherit" variant="outlined"
                                            onClick={() => handleClose()} sx={{mr: 1.5}}>
                                        Hủy
                                    </Button>
                                    <LoadingButton type="submit" variant="contained">
                                        Gửi đánh giá
                                    </LoadingButton>
                                </Stack>
                            </Stack>
                        </Form>
                    </FormikProvider>
                </>
            }
        />
    </>
}