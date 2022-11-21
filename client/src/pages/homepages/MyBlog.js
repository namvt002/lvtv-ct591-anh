import {useEffect, useState} from "react";
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import {useSelector} from "react-redux";
import {Box, Grid, Typography} from "@material-ui/core";
import BlogPostCard from "./blog/BlogPostCard";
import BlogNewPostForm from "./blog/BlogNewPostForm";
import DialogConfirm from "../../components/_dashboard/DialogConfirm";

export default function MyBlog() {
    const [blog, setBlog] = useState([]);
    const [load, setLoad] = useState(0);
    const id = useSelector(state => state.user.current.id);
    const [isEdit, setIsEdit] = useState(false);
    const [post, setPost] = useState({});
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        (async () => {
            const _res = await getData(API_BASE_URL + `/api/baiviet-user/${id}`);
            setBlog(_res.data);

        })()
    }, [id, load])
    return <>
        <Box sx={{m: 4, p: 4}}>
            <Grid container spacing={3}>
                <DialogConfirm
                    showAction={false}
                    title={' '}
                    maxWidth='lg'
                    open={open}
                    handleClose={handleClose}
                    message={
                        <BlogNewPostForm setLoad={setLoad} handleClose={handleClose} isEdit={open} post={post}/>
                    }
                />

                {blog?.length > 0 && blog.map((post, index) => (
                    <BlogPostCard setIsEdit={handleClickOpen} setPost={setPost} post={post} index={index + 3}
                                  setLoad={setLoad} isEdited={true}/>
                ))}
            </Grid>
        </Box>
    </>
}