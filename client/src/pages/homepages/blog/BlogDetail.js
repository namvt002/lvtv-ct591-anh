import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {API_BASE_URL} from "../../../config/configUrl";
import {getData} from "../../../_helper/httpProvider";
import {Box, Container, Grid, Typography} from "@material-ui/core";
import Markdown from "../../../components/Markdown";
import BlogPostCard from "./BlogPostCard";

export default function BlogDetail() {
    const [blog, setBlog] = useState({});
    const [Blogs, setBlogs] = useState([]);
    const {id} = useParams();


    useEffect(() => {
        (async () => {
            const _res = await getData(API_BASE_URL + `/api/baiviet/${id}`);
            setBlog(_res.data[0]);
        })()
    }, [id])
    useEffect(() => {
        (async () => {
            const _res = await getData(API_BASE_URL + '/api-v1/baiviet');
            setBlogs(_res.data)
        })()
    }, [])
    return <>
        <Typography align='center' variant="h2" component="h1">
            {blog?.bv_tieude}
        </Typography>}
        <Container>
            <Box sx={{mt: 5, mb: 10}}>
                <Typography variant="h6" sx={{mb: 5}}>
                    {blog?.bv_mota}
                </Typography>
                <Markdown children={blog?.bv_noidung}/>
            </Box>
        </Container>
        <Box sx={{m: 4, p: 4}}>
            <Grid container spacing={3}>
                {Blogs?.map((post, index) => (
                    <BlogPostCard post={post} index={index+3}/>
                ))}
            </Grid>
        </Box>
    </>
}