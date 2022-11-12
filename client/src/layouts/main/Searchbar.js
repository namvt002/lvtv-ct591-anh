import {Icon} from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
// material
import {styled} from '@material-ui/core/styles';
import {
    Box,
    Button,
    Card,
    Input,
    InputAdornment,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from '@material-ui/core';
import {useEffect, useState} from "react";
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL, URL_PUBLIC_IMAGES} from "../../config/configUrl";
import {PATH_PAGE} from "../../routes/paths";
import {Link as RouterLink, Link, useNavigate} from "react-router-dom";
import {fCurrency} from "../../_helper/formatCurrentCy";
// components

// ----------------------------------------------------------------------

const SearchbarStyle = styled('div')(({theme}) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
}));

const ThumbImgStyle = styled('img')(({theme}) => ({
    width: 64, height: 64, objectFit: 'cover', marginRight: theme.spacing(2), borderRadius: theme.shape.borderRadiusSm
}));

// ----------------------------------------------------------------------

export default function Searchbar() {

    const [search, setSearch] = useState('');
    const [searchColor, setSearchColor] = useState('text.primary');
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const _res = await getData(API_BASE_URL + `/api/filterbook?search=${search}`);
            setProducts(_res.data)
        })()
    }, [search])

    const startvoice = () => {
        let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

        let recognition = new SpeechRecognition();
        let speechRecognitionList = new SpeechGrammarList();

        recognition.lang = 'vi-VN';
        let grammar = '#JSGF V1.0;'

        speechRecognitionList.addFromString(grammar, 1);

        recognition.grammars = speechRecognitionList;

        recognition.interimResults = false;
        recognition.start();
        setSearchColor('red')
        recognition.onresult = async (event) => {
            let lastResult = event.results.length - 1;
            const record = event.results[lastResult][0].transcript;
            if (record !== "") {
                setSearch(record);
                setOpen(true);
                setSearchColor('text.primary')
            } else {
                console.log("Vui long thuc hien lai");
            }
        };

        recognition.onspeechend = function () {
            recognition.stop();
        };
    };

    return (
        <div>
            <SearchbarStyle>
                <Input
                    fullWidth
                    placeholder="Tìm kiếm…"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setOpen(true)
                    }}
                    startAdornment={
                        <InputAdornment position="start">
                            <Box
                                component={Icon}
                                icon={searchFill}
                                sx={{color: 'text.disabled', width: 20, height: 20}}
                            />
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            <Box
                                component={Icon}
                                icon="ic:round-settings-voice"
                                sx={{color: searchColor, width: 20, height: 20, cursor: 'pointer'}}
                                onClick={startvoice}
                            />
                        </InputAdornment>
                    }
                    sx={{mr: 1, fontWeight: 'fontWeightBold'}}
                />
                <Button variant="contained" sx={{width: '9rem'}} onClick={() => {
                    navigate(`${PATH_PAGE.product}?search=${search}`)
                }}>
                    Tìm kiếm
                </Button>
            </SearchbarStyle>

            {open && (
                <Card
                    onMouseLeave={() => setOpen(false)}
                    sx={{
                        p: 3,
                        top: '80px',
                        left: 200,
                        width: '70%',
                        position: 'absolute',
                        zIndex: 9999999999,
                        boxShadow: (theme) => theme.customShadows.z20
                    }}
                >
                    <Table>
                        <TableBody>
                            {products?.map((product) => {
                                const {
                                    sp_id, sp_ten, ctpn_gia, sp_hinhanh, sp_giakhuyenmai, tl_ten, tg_ten, sp_masp
                                } = product;
                                const linkTo = `${PATH_PAGE.productDetail}/${sp_id}`;
                                return (
                                    <TableRow>
                                        <TableCell>
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <ThumbImgStyle alt="product image"
                                                               src={URL_PUBLIC_IMAGES + sp_hinhanh[sp_hinhanh.length - 1].ha_hinh}/>
                                                <Box>
                                                    <Link to={linkTo} color="inherit" component={RouterLink}>
                                                        <Typography variant="subtitle2">
                                                            {sp_masp} - {sp_ten}
                                                        </Typography>

                                                    </Link>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Stack>
                                                <Typography variant='subtitle2'>{tl_ten} </Typography>
                                                <Typography variant='subtitle2'>{tg_ten} </Typography>
                                            </Stack>
                                        </TableCell>

                                        <TableCell align="left">
                                            <Typography
                                                component="span"
                                                variant="body1"
                                                sx={{
                                                    color: 'text.disabled', textDecoration: 'line-through'
                                                }}
                                            >
                                                {!!sp_giakhuyenmai && fCurrency(ctpn_gia)}
                                            </Typography>
                                            <Typography>
                                                {!!sp_giakhuyenmai ? fCurrency(sp_giakhuyenmai) : fCurrency(ctpn_gia)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
}
