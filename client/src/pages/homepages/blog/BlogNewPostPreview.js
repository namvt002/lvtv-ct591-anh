import {isString} from 'lodash';
import PropTypes from 'prop-types';
// material
import {LoadingButton} from '@material-ui/lab';
import {alpha, styled} from '@material-ui/core/styles';
import {Box, Button, Container, DialogActions, Typography} from '@material-ui/core';
import {DialogAnimate} from 'src/components/animate';
import Markdown from 'src/components/Markdown';
import Scrollbar from 'src/components/Scrollbar';
import EmptyContent from 'src/components/EmptyContent';
//
// import Markdown from '../../Markdown';
// import Scrollbar from '../../Scrollbar';
// import EmptyContent from '../../EmptyContent';

// ----------------------------------------------------------------------

const HeroStyle = styled('div')(({theme}) => ({
    paddingTop: '56%',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    '&:before': {
        top: 0,
        content: "''",
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: alpha(theme.palette.grey[900], 0.72)
    }
}));

// ----------------------------------------------------------------------

PreviewHero.propTypes = {
    bv_tieude: PropTypes.string,
    bv_anh: PropTypes.string
};

function PreviewHero({bv_tieude, bv_anh}) {
    return (
        <HeroStyle sx={{backgroundImage: `url(${bv_anh})`}}>
            <Container
                sx={{
                    top: 0,
                    left: 0,
                    right: 0,
                    margin: 'auto',
                    position: 'absolute',
                    pt: {xs: 3, lg: 10},
                    color: 'common.white'
                }}
            >
                <Typography variant="h2" component="h1">
                    {bv_tieude}
                </Typography>
            </Container>
        </HeroStyle>
    );
}

BlogNewPostPreview.propTypes = {
    formik: PropTypes.object.isRequired,
    openPreview: PropTypes.bool,
    onClosePreview: PropTypes.func
};

export default function BlogNewPostPreview({formik, openPreview, onClosePreview}) {
    const {values, handleSubmit, isSubmitting, isValid} = formik;
    const {bv_tieude, bv_mota, bv_noidung} = values;
    const bv_anh = isString(values.bv_anh) ? values.bv_anh : values.bv_anh?.preview;
    const hasContent = bv_tieude || bv_mota || bv_noidung || bv_anh;
    const hasHero = !!bv_anh;

    return (
        <DialogAnimate fullScreen open={openPreview} onClose={onClosePreview}>
            <DialogActions sx={{py: 2, px: 3}}>
                <Typography variant="subtitle1" sx={{flexGrow: 1}}>
                    Xem trước bài viết
                </Typography>
                <Button onClick={onClosePreview}>Hủy</Button>
                <LoadingButton
                    type="submit"
                    variant="contained"
                    disabled={!isValid}
                    loading={isSubmitting}
                    onClick={handleSubmit}
                >
                    Đăng
                </LoadingButton>
            </DialogActions>

            {hasContent ? (
                <Scrollbar>
                    {hasHero && <PreviewHero bv_tieude={bv_tieude} bv_anh={bv_anh}/>}
                    {!hasHero && <Typography align='center' variant="h2" component="h1">
                        {bv_tieude}
                    </Typography>}
                    <Container>
                        <Box sx={{mt: 5, mb: 10}}>
                            <Typography variant="h6" sx={{mb: 5}}>
                                {bv_mota}
                            </Typography>
                            <Markdown children={bv_noidung}/>
                        </Box>
                    </Container>
                </Scrollbar>
            ) : (
                <EmptyContent title="Không có nội dụng"/>
            )}
        </DialogAnimate>
    );
}
