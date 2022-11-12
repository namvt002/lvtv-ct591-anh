import {useEffect, useState} from 'react';
// material
import {Box, Button, Container, styled} from '@material-ui/core';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import {API_BASE_URL} from "../../config/configUrl";
import ProductList from "../../components/product/ProductList";
import {getData} from "../../_helper/httpProvider";

// ----------------------------------------------------------------------
const RootStyle = styled(Page)(({theme}) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(11)
    }
}));
// ----------------------------------------------------------------------

export default function ShopProduct() {
    const {themeStretch} = useSettings();
    const [load, setLoad] = useState(true);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    useEffect(() => {
        (async () => {
            const _products = await getData(API_BASE_URL + `/api/books?pageURL=${page}`);
            setProducts(_products.data);
            setLoad(false);
        })()
    }, [load, page]);


    return (
        <RootStyle title="HYBE">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <ProductList products={products} isLoad={load}/>
                <Box mt={4} display='flex' justifyContent='center'>
                    <Button variant='contained' onClick={() => setPage(e => e + 1)}>Xem thêm</Button>
                </Box>
            </Container>
        </RootStyle>
    );
}
