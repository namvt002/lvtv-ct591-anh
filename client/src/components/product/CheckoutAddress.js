import {Box, Button, Card, Grid, Typography} from "@material-ui/core";
import CheckoutSummary from "./CheckoutSummary";
import {useDispatch, useSelector} from "react-redux";
import {cartItemTotal, chooseAddress, onBackStep, onNextStep} from "../../redux/slices/product";
import {Icon} from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import {useEffect, useState} from "react";
import {deleteData, getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import Label from "../Label";
import PropTypes from 'prop-types';
import CheckoutNewAddressForm from "./CheckoutNewAddressForm";
import {useSnackbar} from "notistack5";
import {useNavigate} from "react-router-dom";

// ----------------------------------------------------------------------

AddressItem.propTypes = {
    address: PropTypes.object,
    onNextStep: PropTypes.func,
    deleteAddress: PropTypes.func
};

function AddressItem({address, onNextStep, onCreateBilling, deleteAddress}) {
    const dispatch = useDispatch();
    const {dc_tenkh, dc_sdt, dc_diachi, dc_email, dc_macdinh, dc_id} = address;

    const handleCreateBilling = () => {
        onNextStep();
        dispatch(chooseAddress({address: address}))
    };


    return (
        <Card sx={{p: 3, mb: 3, position: 'relative'}}>
            <Box sx={{mb: 1, display: 'flex', alignItems: 'center'}}>
                <Typography variant="subtitle1">{dc_tenkh}</Typography>
                {!!dc_macdinh && (
                    <Label color="info" sx={{ml: 1}}>
                        Mặc định
                    </Label>
                )}
            </Box>
            <Typography variant="body2" gutterBottom>
                {dc_diachi}
            </Typography>
            <Typography variant="body2" gutterBottom>
                {dc_email}
            </Typography>
            <Typography variant="body2" sx={{color: 'text.secondary'}}>
                {dc_sdt}
            </Typography>

            <Box
                sx={{
                    mt: 3,
                    display: 'flex',
                    position: {sm: 'absolute'},
                    right: {sm: 24},
                    bottom: {sm: 24}
                }}
            >
                {!dc_macdinh && (
                    <Button variant="outlined" size="small" color="inherit" onClick={() => deleteAddress(dc_id)}>
                        Xóa
                    </Button>
                )}
                <Box sx={{mx: 0.5}}/>
                <Button variant="outlined" size="small" onClick={handleCreateBilling}>
                    Thanh toán bằng địa chỉ này
                </Button>
            </Box>
        </Card>
    );
}

//------------------------------------------------------------------------------------------------------------------------

export default function CheckoutAddress() {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState();
    const [open, setOpen] = useState(false);
    const isLogined = !!useSelector(state => state.user.current?.id);
    const totalPrice = useSelector(cartItemTotal);
    const {id} = useSelector(state => state.user.current);
    const dispatch = useDispatch();
    const [load, setLoad] = useState(0);

    if (!isLogined) navigate('/');

    useEffect(() => {
        (async () => {
            const _addresses = await getData(API_BASE_URL + `/diachi/${id}`);
            setAddresses(_addresses.data);
        })()
    }, [id, load]);

    const deleteAddress = async (dc_id) => {
        try {
            await deleteData(API_BASE_URL + '/diachi/' + dc_id);
            enqueueSnackbar(
                'Xóa địa chỉ thành công',
                {
                    variant: 'success',
                },
            );
            setLoad(e => e + 1)
        } catch (error) {
            console.error(error);
        }
    }

    const handleBackStep = () => {
        dispatch(onBackStep());
    };
    const handleNextStep = () => {
        dispatch(onNextStep());
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    {addresses?.map((address, idx) => (
                        <AddressItem
                            key={idx}
                            address={address}
                            onNextStep={handleNextStep}
                            deleteAddress={deleteAddress}
                        />
                    ))}
                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button size="small" color="inherit" onClick={handleBackStep}
                                startIcon={<Icon icon={arrowIosBackFill}/>}>
                            Trở về
                        </Button>
                        <Button size="small" startIcon={<Icon icon={plusFill}/>} onClick={handleClickOpen}>
                            Thêm địa chỉ mới
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <CheckoutSummary
                        total={totalPrice >= 500000 ? totalPrice : totalPrice + 30000}
                        enableDiscount
                        subtotal={totalPrice}
                        shipping={totalPrice >= 500000 ? 0 : 30000}
                    />
                </Grid>
            </Grid>
            <CheckoutNewAddressForm
                open={open}
                onClose={handleClose}
                onNextStep={handleNextStep}
                setLoad={setLoad}
            />
        </>
    )
}