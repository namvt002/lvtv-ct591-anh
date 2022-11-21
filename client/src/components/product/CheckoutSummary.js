import PropTypes from 'prop-types';
// material
import {Box, Button, Card, CardContent, CardHeader, Divider, Stack, Typography} from '@material-ui/core';
import {fCurrency} from "../../_helper/formatCurrentCy";
import editFill from "@iconify/icons-eva/edit-fill";
import {Icon} from "@iconify/react";
// utils

// ----------------------------------------------------------------------

CheckoutSummary.propTypes = {
    total: PropTypes.number,
    discount: PropTypes.number,
    subtotal: PropTypes.number,
    shipping: PropTypes.number,
    onEdit: PropTypes.func,
    enableEdit: PropTypes.bool,
    onApplyDiscount: PropTypes.func,
    enableDiscount: PropTypes.bool
};

export default function CheckoutSummary({
                                            total,
                                            onEdit,
                                            subtotal,
                                            shipping = null,
                                            onApplyDiscount,
                                            enableDiscount = false,
                                            enableEdit = false
                                        }) {
    return (
        <Card sx={{mb: 3}}>
            <CardHeader
                title="Thông tin thanh toán"
                action={
                    enableEdit && (
                        <Button size="small" type="button" onClick={onEdit} startIcon={<Icon icon={editFill}/>}>
                            Chỉnh sửa
                        </Button>
                    )
                }
            />

            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                            Tổng tiền sản phẩm
                        </Typography>
                        <Typography variant="subtitle2">{fCurrency(subtotal)}</Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx enableEdit={{color: 'text.secondary'}}>
                            Phí vận chuyển
                        </Typography>
                        <Typography variant="subtitle2">{fCurrency(shipping)}</Typography>
                    </Stack>

                    <Divider/>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="subtitle1">Tổng cộng</Typography>
                        <Box sx={{textAlign: 'right'}}>
                            <Typography variant="subtitle1" sx={{color: 'error.main'}}>
                                {fCurrency(total)}
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
