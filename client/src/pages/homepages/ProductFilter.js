import {
    Box,
    Button,
    Card,
    FormControlLabel,
    Grid,
    Link,
    ListItem,
    Paper,
    Radio,
    RadioGroup,
    Slider,
    styled,
    Typography
} from "@material-ui/core";
import PropTypes from 'prop-types';
import Page from "../../components/Page";
import {useEffect, useState} from "react";
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import ProductList from "../../components/product/ProductList";
import {Form, FormikProvider, useFormik} from "formik";
import {fCurrency} from "../../_helper/formatCurrentCy";
import {alpha} from "@material-ui/core/styles";
import {NavLink as RouterLink, useSearchParams} from 'react-router-dom';
import {Icon} from '@iconify/react';
import chevronRightFill from '@iconify/icons-eva/chevron-right-fill';

//-------------------------------------------------------------------------------------------
const RootStyle = styled(Page)(({theme}) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(11)
    },
    width: '100vw'
}));

ParentItem.propTypes = {
    path: PropTypes.string,
    title: PropTypes.string,
    open: PropTypes.bool,
    hasSub: PropTypes.bool
};

const ITEM_HEIGHT = 40;
const MENU_WIDTH = 200;
const MENU_PAPER_WIDTH = '88%';

function ParentItem({path, title, open, hasSub, ...other}) {
    const activeStyle = {
        color: 'primary.main',
        borderRadius: '5px',
        bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
    };

    return (
        <ListItem
            disableGutters
            to={path}
            component={RouterLink}
            sx={{
                pl: 0.5,
                pr: 1.5,
                height: ITEM_HEIGHT,
                cursor: 'pointer',
                color: 'text.primary',
                typography: 'subtitle2',
                textTransform: 'capitalize',
                justifyContent: 'space-between',
                transition: (theme) => theme.transitions.create('all'),
                '&:hover': activeStyle,
                ...(open && activeStyle)
            }}
            {...other}
        >
            {title}
            {hasSub && <Box component={Icon} icon={chevronRightFill} sx={{ml: 1, width: 20, height: 20}}/>}
        </ListItem>
    );
}

//------------------------------------------------------------------------------------------

export const FILTER_TYPE_OPTIONS = ['Mới nhất', 'Cũ nhất'];
export const FILTER_PRICE_TYPE_OPTIONS = ['Giá cao đến thấp', 'Giá thấp đến cao'];

const marks = [
    {
        value: 10000,
        label: '10,000đ',
    },
    {
        value: 500000,
        label: '500,000đ',
    },
    {
        value: 1000000,
        label: '1,000,000đ',
    },
];
//------------------------------------------------------------------------------------------------------
export default function ProductFilter() {
    const [load, setLoad] = useState(true);
    const [products, setProducts] = useState([]);
    const [tacgia, setTacgia] = useState([]);
    const [danhmuc, setDanhmuc] = useState([]);
    const [pageTg, setPageTg] = useState(1);

    const [open, setOpen] = useState(false);
    const [openDm, setOpenDm] = useState(false);

    const [searchParams] = useSearchParams();
    let search = searchParams.get('search');
    console.log(search);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenDm = () => {
        setOpenDm(true);
    };

    const handleCloseDm = () => {
        setOpenDm(false);
    };

    const formik = useFormik({
        initialValues: {
            type: '',
            priceType: '',
            priceRange: '',
            idtg: '',
            idtl: '',
            iddm: '',
            all: ''
        },
        onSubmit: async (values, {setSubmitting}) => {
            try {
                setSubmitting(false);
            } catch (error) {
                console.error(error);
                setSubmitting(false);
            }
        }
    });
    const {getFieldProps, values, setFieldValue} = formik;

    useEffect(() => {
        (async () => {
            let _URL = API_BASE_URL + `/api/filterbook?search=${search}&&type=${values.type}&&priceType=${values.priceType}&&priceRange=${values.priceRange}&&idtl=${values.idtl}&&iddm=${values.iddm}&&idtg=${values.idtg}`;
            if (!!values.all) _URL = API_BASE_URL + `/api/filterbook?type=${values.type}&&priceType=${values.priceType}&&priceRange=${values.priceRange}&&idtl=${values.idtl}&&iddm=${values.iddm}&&idtg=${values.idtg}`;
            const _products = await getData(_URL);
            setProducts(_products.data);
            setLoad(false);
        })()
    }, [load, search, values.type, values.priceType, values.priceRange, values.idtl, values.iddm, values.idtg, values.all]);

    useEffect(() => {
        (async () => {
            const _tacgia = await getData(API_BASE_URL + `/api/tacgia?pageURL=${pageTg}`);
            setTacgia(_tacgia.data);
        })()
    }, [pageTg]);

    useEffect(() => {
        (async () => {
            const _danhmuc = await getData(API_BASE_URL + `/api/danhmuc`);
            setDanhmuc(_danhmuc.data);
        })()
    }, []);

    console.log(values)
    return (
        <RootStyle title="HYBE">
            <Grid container spacing={2} p={2}>
                <Grid item xs={3}>
                    <Card sx={{p: 2}}>
                        <FormikProvider value={formik}>
                            <Form autoComplete="off" noValidate>
                                <div>
                                    <RadioGroup row {...getFieldProps('all')}>
                                        <FormControlLabel value='all' control={<Radio/>} label='Tất cả sản phẩm'/>
                                    </RadioGroup>
                                </div>
                                <div>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Sắp xếp
                                    </Typography>
                                    <RadioGroup row {...getFieldProps('type')}>
                                        {FILTER_TYPE_OPTIONS.map((item) => (
                                            <FormControlLabel key={item} value={item} control={<Radio/>} label={item}/>
                                        ))}
                                    </RadioGroup>
                                </div>

                                <div>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Giá theo
                                    </Typography>
                                    <RadioGroup row {...getFieldProps('priceType')}>
                                        {FILTER_PRICE_TYPE_OPTIONS.map((item) => (
                                            <FormControlLabel key={item} value={item} control={<Radio/>} label={item}/>
                                        ))}
                                    </RadioGroup>
                                </div>

                                <div>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Giá
                                    </Typography>
                                    <Box display='flex' justifyContent='center'>
                                        <Slider
                                            sx={{width: '80%'}}
                                            {...getFieldProps('priceRange')}
                                            marks={marks}
                                            min={10000}
                                            step={5000}
                                            max={1000000}
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={(value) => fCurrency(value)}
                                        />
                                    </Box>
                                </div>

                                <ParentItem onMouseEnter={handleOpen} onMouseLeave={handleClose} path='#'
                                            title='Tác giả' open={open} hasSub/>

                                <ParentItem onMouseEnter={handleOpenDm} onMouseLeave={handleCloseDm} path='#'
                                            title='Danh Mục' open={openDm} hasSub/>

                            </Form>
                        </FormikProvider>
                    </Card>
                </Grid>
                <Grid item xs={9} p={2}>
                    {!values.all &&
                        <Typography sx={{m: 2}}>Kết quả tìm kiếm cho từ khóa: <b>"{search}"</b></Typography>}
                    <ProductList products={products} isLoad={load}/>
                </Grid>

            </Grid>
            {open && (
                <Paper
                    onMouseEnter={handleOpen}
                    onMouseLeave={handleClose}
                    sx={{
                        p: 3,
                        top: '100px',
                        left: MENU_WIDTH,
                        width: MENU_PAPER_WIDTH,
                        borderRadius: 2,
                        position: 'absolute',
                        zIndex: 999,
                        boxShadow: (theme) => theme.customShadows.z20
                    }}
                >
                    <Grid container>
                        {tacgia?.map((e) => {
                            const {tg_id, tg_ten} = e;
                            return (
                                <Grid item xs={2} key={tg_id} spacing={1.25}>
                                    <Link
                                        key={tg_id}
                                        component={Typography}
                                        onClick={() => {
                                            setFieldValue('idtg', tg_id)
                                            setFieldValue('iddm', '')
                                            setFieldValue('idtl', '')
                                        }}
                                        underline="none"
                                        sx={{
                                            cursor: 'pointer',
                                            typography: 'body2',
                                            color: 'text.primary',
                                            fontSize: 13,
                                            transition: (theme) => theme.transitions.create('all'),
                                            '&:hover': {color: 'primary.main'}
                                        }}
                                    >
                                        {tg_ten}
                                    </Link>
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Box display='flex' justifyContent='center'>
                        <Button onClick={() => setPageTg(e => e + 1)}>Xem thêm</Button>
                    </Box>
                </Paper>
            )}

            {openDm && (
                <Paper
                    onMouseEnter={handleOpenDm}
                    onMouseLeave={handleCloseDm}
                    sx={{
                        p: 3,
                        top: '100px',
                        left: MENU_WIDTH,
                        width: MENU_PAPER_WIDTH,
                        borderRadius: 2,
                        position: 'absolute',
                        zIndex: 999,
                        boxShadow: (theme) => theme.customShadows.z20

                    }}
                >
                    <Grid container>
                        {danhmuc?.map((e) => {
                            const {dm_id, dm_ten, the_loai} = e;
                            return (
                                <Grid item xs={2} key={dm_id} spacing={2}>
                                    <Link
                                        key={dm_id}
                                        component={Typography}
                                        underline="none"
                                        onClick={() => {
                                            setFieldValue('iddm', dm_id)
                                            setFieldValue('idtg', '')
                                            setFieldValue('idtl', '')
                                        }}

                                        sx={{
                                            typography: 'subtitle1',
                                            color: 'text.primary',
                                            fontSize: 13,
                                            fontWeight: 700,
                                            transition: (theme) => theme.transitions.create('all'),
                                            '&:hover': {color: 'primary.main'}
                                        }}
                                    >
                                        {dm_ten}
                                    </Link>
                                    {the_loai.map(tl => (
                                        <Link
                                            key={tl.tl_id}
                                            component={Typography}
                                            onClick={() => {
                                                setFieldValue('idtl', tl.tl_id)
                                                setFieldValue('iddm', '')
                                                setFieldValue('idtg', '')
                                            }}
                                            underline="none"
                                            sx={{
                                                typography: 'body2',
                                                color: 'text.primary',
                                                cursor: 'pointer',
                                                fontSize: 13,
                                                transition: (theme) => theme.transitions.create('all'),
                                                '&:hover': {color: 'primary.main'}
                                            }}
                                        >
                                            {tl.tl_ten}
                                        </Link>
                                    ))}
                                </Grid>
                            );
                        })}
                    </Grid>
                </Paper>
            )}
        </RootStyle>
    );
}