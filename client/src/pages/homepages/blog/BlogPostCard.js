import PropTypes from 'prop-types';
import {Link as RouterLink, useLocation} from 'react-router-dom';
// material
import {alpha, styled} from '@material-ui/core/styles';
import {Avatar, Card, CardContent, FormControlLabel, Grid, Stack, Switch, Typography} from '@material-ui/core';
// routes
// utils
import SvgIconStyle from 'src/components/SvgIconStyle';
import {formatDateTime} from "../../../_helper/formatDate";
import {randomIntFromInterval} from "../../../_helper/helper";
import {MIconButton} from "../../../components/@material-extend";
import {Icon} from "@iconify/react";
import DialogConfirm from "../../../components/_dashboard/DialogConfirm";
import {useState} from "react";
import {deleteData, putData} from "../../../_helper/httpProvider";
import {API_BASE_URL} from "../../../config/configUrl";
import closeFill from "@iconify/icons-eva/close-fill";
import {useSnackbar} from "notistack5";
import BlogNewPostForm from "./BlogNewPostForm";
import {useSelector} from "react-redux";

//

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
    position: 'relative',
    paddingTop: 'calc(100% * 3 / 4)'
});

const TitleStyle = styled(RouterLink)(({theme}) => ({
    ...theme.typography.subtitle2,
    height: 44,
    color: 'inherit',
    overflow: 'hidden',
    WebkitLineClamp: 2,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline'
    }
}));

const AvatarStyle = styled(Avatar)(({theme}) => ({
    zIndex: 9,
    width: 32,
    height: 32,
    position: 'absolute',
    left: theme.spacing(3),
    bottom: theme.spacing(-2)
}));

const InfoStyle = styled('div')(({theme}) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
    color: theme.palette.text.disabled
}));

const CoverImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute'
});

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
    post: PropTypes.object.isRequired,
    index: PropTypes.number
};
const LabelStyle = styled(Typography)(({theme}) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1)
}));

export default function BlogPostCard({post, index, isEdited, setLoad, setIsEdit, setPost}) {
    const {pathname} = useLocation();
    const isDashboard = pathname.includes('/dashboard');
    const isAdmin = useSelector(state => state.user.current?.role) === "ADMIN";
    const {bv_tieude, bv_noidung, fullname, bv_ngaytao, bv_id} = post;
    const linkTo = `/blog/detail/${bv_id}`;
    const latestPostLarge = index === 0;
    const latestPost = index === 1 || index === 2;
    const [open, setOpen] = useState(false);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [hidden, setHidden] = useState(true);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const HiddenBlog = async () => {
        try {
            await putData(API_BASE_URL + '/api/baiviet-active', {
                id: bv_id,
                bv_active: !post.bv_active
            });
            setHidden(e => !e);
            if (setLoad) setLoad((e) => e + 1);
            enqueueSnackbar('Cập nhật thành công', {
                variant: 'success',
                action: (key) => (
                    <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                        <Icon icon={closeFill}/>
                    </MIconButton>
                ),
            });
        } catch (error) {
            console.log(error);
        }
    };


    const deletePost = async () => {
        try {
            await deleteData(API_BASE_URL + `/api/baiviet/${bv_id}`);
            if (setLoad) setLoad(e => e + 1);
            enqueueSnackbar('Xóa bài viết thành công', {
                variant: 'success',
                action: (key) => (
                    <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                        <Icon icon={closeFill}/>
                    </MIconButton>
                ),
            });
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
            <Card sx={{position: 'relative'}}>
                <CardMediaStyle
                    sx={{
                        ...((latestPostLarge || latestPost) && {
                            pt: 'calc(100% * 4 / 3)',
                            '&:after': {
                                top: 0,
                                content: "''",
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
                            }
                        }),
                        ...(latestPostLarge && {
                            pt: {
                                xs: 'calc(100% * 4 / 3)',
                                sm: 'calc(100% * 3 / 4.66)'
                            }
                        })
                    }}
                >
                    <SvgIconStyle
                        color="paper"
                        src="/static/icons/shape-avatar.svg"
                        sx={{
                            width: 80,
                            height: 36,
                            zIndex: 9,
                            bottom: -15,
                            position: 'absolute',
                            ...((latestPostLarge || latestPost) && {display: 'none'})
                        }}
                    />
                    <AvatarStyle
                        alt={fullname}
                        src={`/static/avatar_${randomIntFromInterval(1, 20)}.jpg`}
                        sx={{
                            ...((latestPostLarge || latestPost) && {
                                zIndex: 9,
                                top: 24,
                                left: 24,
                                width: 40,
                                height: 40
                            })
                        }}
                    />
                    <CoverImgStyle src={`/static/blog_${randomIntFromInterval(1, 4)}.jpeg`}
                    />
                </CardMediaStyle>

                <CardContent
                    sx={{
                        pt: 4,
                        ...((latestPostLarge || latestPost) && {
                            bottom: 0,
                            width: '100%',
                            position: 'absolute'
                        })
                    }}
                >
                    <Typography gutterBottom variant="caption" sx={{color: 'text.disabled', display: 'block'}}>
                        {formatDateTime(bv_ngaytao)}
                    </Typography>

                    <TitleStyle
                        to={linkTo}
                        sx={{
                            ...(latestPostLarge && {typography: 'h5', height: 60}),
                            ...((latestPostLarge || latestPost) && {
                                color: 'common.white'
                            })
                        }}
                    >
                        {bv_tieude}
                    </TitleStyle>
                    {isEdited && (
                        <Stack direction='row' justifyContent='end'>
                            {(!isDashboard) && <>
                                <MIconButton  onClick = {()=>{
                                    if(setPost) setPost(post);
                                    if(setIsEdit) setIsEdit(true);
                                }}>
                                    <Icon icon={'bx:edit'} color={'rgb(0,166,178)'}/>
                                </MIconButton>
                                <MIconButton onClick={() => handleClickOpen()}>
                                    <Icon icon={'ic:round-delete'} color={'red'}/>
                                </MIconButton></>
                            }

                            {(isAdmin  && isDashboard)  &&
                                <FormControlLabel
                                    control={
                                        <Switch
                                            onClick={()=>HiddenBlog()}
                                            checked={post.bv_active}
                                        />
                                    }
                                    label="Ẩn/Hiện"
                                />
                            }
                        </Stack>
                    )}
                </CardContent>
            </Card>
            <DialogConfirm
                open={open}
                handleClose={handleClose}
                message={
                    <Typography color="error" variant="h4" align="center">
                        Bạn chắc chắn muốn xoá bài viết ?
                    </Typography>
                }
                excFunc={deletePost}
            />

        </Grid>
    );
}
