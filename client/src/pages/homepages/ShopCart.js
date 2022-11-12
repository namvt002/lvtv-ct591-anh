// ----------------------------------------------------------------------
import PropTypes from 'prop-types';
import {Box, Container, Grid, Step, StepConnector, StepLabel, Stepper, styled} from "@material-ui/core";
import Page from "../../components/Page";
import useSettings from "../../hooks/useSettings";
import {useSelector} from "react-redux";
import {Icon} from '@iconify/react';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
import {withStyles} from "@material-ui/styles";
import CheckoutCart from "../../components/product/CheckoutCart";
import CheckoutAddress from "../../components/product/CheckoutAddress";
import CheckoutPayment from "../../components/product/CheckoutPayment";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(11)
    }
}));

const QontoConnector = withStyles((theme) => ({
    alternativeLabel: {
        top: 10,
        left: 'calc(-50% + 20px)',
        right: 'calc(50% + 20px)'
    },
    active: {
        '& $line': {borderColor: theme.palette.primary.main}
    },
    completed: {
        '& $line': {borderColor: theme.palette.primary.main}
    },
    line: {
        borderTopWidth: 2,
        borderColor: theme.palette.divider
    }
}))(StepConnector);
// ----------------------------------------------------------------------

const STEPS = ['Giỏ hàng', 'Địa chỉ giao hàng', 'Thanh toán'];

//-----------------------------------------------------------------------
QontoStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool
};

function QontoStepIcon({active, completed}) {
    return (
        <Box
            sx={{
                zIndex: 9,
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: active ? 'primary.main' : 'divider',
                bgcolor: 'background.default'
            }}
        >
            {completed ? (
                <Box component={Icon} icon={checkmarkFill}
                     sx={{zIndex: 1, width: 20, height: 20, color: 'primary.main'}}/>
            ) : (
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'currentColor'
                    }}
                />
            )}
        </Box>
    );
}

//-----------------------------------------------------------------------

export default function ShopCart() {
    const {themeStretch} = useSettings();
    const {checkout} = useSelector((state) => state.product);
    const {activeStep} = checkout;
    const isComplete = activeStep === STEPS.length;

    return (
        <RootStyle title="Ecommerce: Shop | Minimal-UI">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <Grid container justifyContent={isComplete ? 'center' : 'flex-start'}>
                    <Grid item xs={12} md={8} sx={{mb: 5}}>
                        <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector/>}>
                            {STEPS.map((label) => (
                                <Step key={label}>
                                    <StepLabel
                                        StepIconComponent={QontoStepIcon}
                                        sx={{
                                            '& .MuiStepLabel-label': {
                                                typography: 'subtitle2',
                                                color: 'text.disabled'
                                            }
                                        }}
                                    >
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Grid>
                </Grid>
                {!isComplete && (
                    <>
                        {activeStep === 0 && <CheckoutCart/>}
                        {activeStep === 1 && <CheckoutAddress/>}
                        {activeStep === 2 && <CheckoutPayment/>}
                    </>
                )}
            </Container>
        </RootStyle>
    )
}