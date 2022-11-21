import PropTypes from 'prop-types';
import {Icon} from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// material
import {styled} from '@material-ui/core/styles';
import {Box, Checkbox, Table, TableBody, TableCell, TableContainer, TableRow, Typography} from '@material-ui/core';
import {URL_PUBLIC_IMAGES} from "../../config/configUrl";
import {MIconButton} from "../@material-extend";
import {fCurrency} from "../../_helper/formatCurrentCy";
import {useDispatch, useSelector} from "react-redux";
import {removeFromCart, setQuantity} from "../../redux/slices/cart";
import {Link, Link as RouterLink} from 'react-router-dom';
import {PATH_PAGE} from "../../routes/paths";
import {useState} from "react";
import CheckoutListHead from "./CheckoutListHead";
import CheckoutListToolbar from "./CheckoutListToolbar";
import {checkoutProduct, setQuantityProductCheckout} from "../../redux/slices/product";

// ----------------------------------------------------------------------

const IncrementerStyle = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0.5),
    padding: theme.spacing(0.5, 0.75),
    borderRadius: theme.shape.borderRadius,
    border: `solid 1px ${theme.palette.grey[500_32]}`
}));

const ThumbImgStyle = styled('img')(({theme}) => ({
    width: 64, height: 64, objectFit: 'cover', marginRight: theme.spacing(2), borderRadius: theme.shape.borderRadiusSm
}));

// ----------------------------------------------------------------------

Incrementer.propTypes = {
    available: PropTypes.number, quantity: PropTypes.number, onIncrease: PropTypes.func, onDecrease: PropTypes.func
};

const TABLE_HEAD = [{id: 'sach', label: 'Sách', alignRight: false}, {
    id: 'gia',
    label: 'Giá',
    alignRight: false
}, {id: 'sl', label: 'Số lượng', alignRight: false}, {id: 'tong_gia', label: 'Tổng giá', alignRight: false}, {id: ''},];

function Incrementer({available, quantity, onIncrease, onDecrease}) {
    return (<Box sx={{width: 96, textAlign: 'right'}}>
        <IncrementerStyle>
            <MIconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
                <Icon icon={minusFill} width={16} height={16}/>
            </MIconButton>
            {quantity}
            <MIconButton size="small" color="inherit" onClick={onIncrease} disabled={quantity >= available}>
                <Icon icon={plusFill} width={16} height={16}/>
            </MIconButton>
        </IncrementerStyle>
        <Typography variant="caption" sx={{color: 'text.secondary'}}>
            Có sẵn: {available}
        </Typography>
    </Box>);
}

ProductList.propTypes = {
    products: PropTypes.array
};

export default function ProductList({products}) {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.cartItem);
    const checkoutProducts = useSelector(state => state.product.checkout.product);
    const [selected, setSelected] = useState(checkoutProducts.length > 0 ? checkoutProducts.map(e => e.id_sp) : []);

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1),);
        }
        let arr = [];
        newSelected.map(e1 => {
            return arr.push(cart.filter((e, idx) => e.id_sp === e1)[0])
        })
        dispatch(checkoutProduct(arr))
        setSelected(newSelected);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = products.map((n) => n.sp_id);
            setSelected(newSelecteds);
            dispatch(checkoutProduct(cart))
            return;
        }
        setSelected([]);
        dispatch(checkoutProduct([]))
    };

    return (<>
        <CheckoutListToolbar
            selected={selected}
            setSelected={setSelected}
            rowCount={products.length}
        />
        <TableContainer sx={{minWidth: 720}}>
            <Table>
                <CheckoutListHead
                    headLabel={TABLE_HEAD}
                    rowCount={products.length}
                    numSelected={selected.length}
                    onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                    {products.map((product) => {
                        const {
                            sp_id, sp_ten, sp_hinhanh, sp_soluong, sp_giakhuyenmai, gia_ban, gb_soluong
                        } = product;

                        const isItemSelected = selected.indexOf(sp_id) !== -1;
                        const linkTo = `${PATH_PAGE.productDetail}/${sp_id}`;

                        return (<TableRow key={sp_id}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={isItemSelected}
                                    onChange={(event) => handleClick(event, sp_id)}
                                />
                            </TableCell>
                            <TableCell>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <ThumbImgStyle alt="product image"
                                                   src={URL_PUBLIC_IMAGES + sp_hinhanh[sp_hinhanh.length - 1].ha_hinh}/>
                                    <Box>
                                        <Link to={linkTo} color="inherit" component={RouterLink}>
                                            <Typography noWrap variant="subtitle2"
                                                        sx={{maxWidth: 240, mb: 0.5}}>
                                                {sp_ten}
                                            </Typography>
                                        </Link>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell align="left">
                                <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{
                                        color: 'text.disabled', textDecoration: 'line-through'
                                    }}
                                >
                                    {!!sp_giakhuyenmai && fCurrency(gia_ban)}
                                </Typography>
                                <Typography>
                                    {!!sp_giakhuyenmai ? fCurrency(sp_giakhuyenmai) : fCurrency(gia_ban)}
                                </Typography>
                            </TableCell>

                            <TableCell align="left">
                                <Incrementer
                                    quantity={sp_soluong}
                                    available={gb_soluong}
                                    onDecrease={() => {
                                        dispatch(setQuantity({
                                            id_sp: sp_id, so_luong: sp_soluong < 2 ? 1 : sp_soluong - 1
                                        }));
                                        dispatch(setQuantityProductCheckout({
                                            id_sp: sp_id, so_luong: sp_soluong < 2 ? 1 : sp_soluong - 1
                                        }));
                                    }}
                                    onIncrease={() => {
                                        dispatch(setQuantity({
                                            id_sp: sp_id, so_luong: sp_soluong + 1
                                        }));
                                        dispatch(setQuantityProductCheckout({
                                            id_sp: sp_id, so_luong: sp_soluong + 1
                                        }));
                                    }}
                                />
                            </TableCell>

                            <TableCell
                                align="right">{fCurrency((sp_giakhuyenmai ? sp_giakhuyenmai : gia_ban) * sp_soluong)}</TableCell>

                            <TableCell align="right">
                                <MIconButton onClick={() => dispatch(removeFromCart(sp_id))}>
                                    <Icon icon={trash2Fill} width={20} height={20}/>
                                </MIconButton>
                            </TableCell>
                        </TableRow>);
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </>);
}
