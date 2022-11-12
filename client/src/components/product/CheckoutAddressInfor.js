import {Button, Card, CardContent, CardHeader, Typography} from "@material-ui/core";
import {useSelector} from "react-redux";
import {Icon} from "@iconify/react";
import editFill from "@iconify/icons-eva/edit-fill";

export default function CheckoutAddressInfor({onBackStep}) {
    const {address} = useSelector(state => state.product.checkout);
    const {dc_tenkh, dc_sdt, dc_diachi, dc_email} = address;

    return (
        <Card sx={{mb: 3}}>
            <CardHeader
                title="Địa chỉ thanh toán"
                action={
                    <Button size="small" type="button" startIcon={<Icon icon={editFill}/>} onClick={onBackStep}>
                        Chỉnh sửa
                    </Button>
                }
            />
            <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                    {dc_tenkh}&nbsp;
                </Typography>
                <Typography variant="body2" gutterBottom>
                    {dc_diachi}
                </Typography>
                <Typography variant="body2" gutterBottom>
                    {dc_email}
                </Typography>
                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                    {dc_sdt}
                </Typography>
            </CardContent>
        </Card>
    )
}