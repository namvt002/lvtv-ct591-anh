import {Icon} from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
// material
import {styled} from '@material-ui/core/styles';
import {
    Box,
    Button,
    Card,
    Input,
    InputAdornment, Link,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from '@material-ui/core';
import {useEffect, useState} from "react";
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL, URL_PUBLIC_IMAGES} from "../../config/configUrl";
import {PATH_PAGE} from "../../routes/paths";
import {Link as RouterLink, useNavigate} from "react-router-dom";
// components

// ----------------------------------------------------------------------

const SearchbarStyle = styled('div')(({theme}) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
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
            const _res = await getData(API_BASE_URL + `/api/khoahoc?search=${search}`);
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
                <Button variant="contained" sx={{width: '9rem'}}
                    // onClick={() => {
                    //     navigate(`${PATH_PAGE.product}?search=${search}`)
                    // }}
                >
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
                                    kh_makh, kh_ten, kh_hinhanh
                                } = product;
                                const linkTo = `${PATH_PAGE.course_content}/${kh_makh}`;
                                return (
                                    <TableRow>
                                        <TableCell>
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <ThumbImgStyle alt="product image"
                                                               src={URL_PUBLIC_IMAGES + kh_hinhanh}/>
                                                <Box>
                                                    <Link to={linkTo} color="inherit" component={RouterLink}>
                                                            {kh_makh} - {kh_ten}

                                                    </Link>
                                                </Box>
                                            </Box>
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
