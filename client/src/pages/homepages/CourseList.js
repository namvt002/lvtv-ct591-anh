import {Box, Button, Card, CardContent, Grid, Paper, Skeleton, Stack, TextField, Typography} from "@material-ui/core";
import {useEffect, useRef, useState} from "react";
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import Code from "../../components/code/Code";
import {randomIntFromInterval} from "../../_helper/helper";
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {runCode} from "../../redux/slices/code";
import {PATH_AUTH, PATH_PAGE} from "../../routes/paths";
import {motion} from 'framer-motion';
import {useTheme} from "@material-ui/core/styles";
import {MotionContainer, varFadeInRight} from "../../components/animate";
import {CarouselControlsArrowsIndex} from "../../components/carousel/controls";
import Slider from 'react-slick';
import BlogNewPostForm from "./blog/BlogNewPostForm";
import BlogPostCard from "./blog/BlogPostCard";

//##############################################################################################################
const SkeletonLoad = (
    <>
        {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
                <Skeleton variant="rectangular" width="100%" height="20rem" sx={{borderRadius: 2}}/>
            </Grid>
        ))}
    </>
);

CourseList.propTypes = {};

const colorHome = [
    '#d9eee1',
    '#fff4a3',
    '#D9EEE1',
    '#96d4d4',
    '#F3ECEA',
];

function CarouselItem({item, isActive}) {
    const isLogin = useSelector((state) => state?.user?.current?.role);
    const navigate = useNavigate();
    const theme = useTheme();
    const dispatch = useDispatch();
    const {kh_ten, kh_mota, kh_code, kh_makh, kh_code_run, kh_code_lang, num_bkt} = item;

    return (
        <Paper>
            <Box/>
            <CardContent>
                <MotionContainer open={isActive}>
                    <Grid item xs={12}>
                        <Card sx={{p: 4, minHeight: '80vh', backgroundColor: colorHome[randomIntFromInterval(0, 4)]}}>
                            <Grid container>
                                <Grid item xs={6} md={6}>
                                    <motion.div variants={varFadeInRight}>
                                        <Typography variant='h3' align='center'>{kh_ten}</Typography>
                                    </motion.div>
                                    <motion.div variants={varFadeInRight}>
                                        <Box my={4} dangerouslySetInnerHTML={{__html: kh_mota}}/>
                                    </motion.div>
                                    <Stack spacing={4}>
                                        <motion.div variants={varFadeInRight}>
                                            <Button variant='contained' color='info' sx={{width: '20rem'}}
                                                    onClick={() => {
                                                        navigate(PATH_PAGE.course_content + `/${kh_makh}`);
                                                    }}>
                                                Học {kh_ten}
                                            </Button>
                                        </motion.div>
                                        <motion.div variants={varFadeInRight}>
                                            <Button onClick={() => {
                                                isLogin ?
                                                    navigate(PATH_PAGE.certificate + `/${kh_makh}`) :
                                                    navigate(PATH_AUTH.login)


                                            }} variant='contained' disabled={num_bkt === 0} color='warning'
                                                    sx={{width: '20rem'}}>
                                                Lấy chứng chỉ
                                            </Button>
                                        </motion.div>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <motion.div variants={varFadeInRight}>
                                        <Box sx={{height: '100%'}}>
                                            <Code code={kh_code} language={kh_code_lang}/>
                                            {!!kh_code_run && <Button variant='contained' onClick={() => {
                                                dispatch(runCode({
                                                    code: kh_code,
                                                    lang: kh_code_lang
                                                }));
                                                navigate(PATH_PAGE.code)
                                            }} sx={{width: '20rem'}}>
                                                Chạy thử
                                            </Button>}
                                        </Box>
                                    </motion.div>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </MotionContainer>
            </CardContent>
        </Paper>
    );
}

export default function CourseList() {
    const isLogined = !!useSelector(state => state.user.current?.id);
    const theme = useTheme();
    const [courses, setCourses] = useState([]);
    const [isLoad, setLoad] = useState(true);
    const carouselRef = useRef();
    const [showForm, setShowForm] = useState(false);
    const [Blogs, setBlogs] = useState([]);
    const [load, setLoads] = useState(0);
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(theme.direction === 'rtl' ? courses.length - 1 : 0);
    const settings = {
        speed: 600,
        dots: false,
        arrows: false,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        rtl: Boolean(theme.direction === 'rtl'),
        beforeChange: (current, next) => setCurrentIndex(next)
    };

    const handlePrevious = () => {
        carouselRef.current.slickPrev();
    };

    const handleNext = () => {
        carouselRef.current.slickNext();
    };


    useEffect(() => {
        (async () => {
            const _res = await getData(API_BASE_URL + '/api-v1/khoahoc');
            setCourses(_res.data);
            setLoad(false);
        })()
    }, []);

    useEffect(() => {
        (async () => {
            const _res = await getData(API_BASE_URL + '/api-v1/baiviet');
            setBlogs(_res.data)
        })()
    }, [load])

    return <>
        <Slider ref={carouselRef} {...settings}>
            {courses?.map((item, index) => (
                <CarouselItem key={index} item={item} isActive={index === currentIndex}/>
            ))}
        </Slider>
        <CarouselControlsArrowsIndex
            index={currentIndex}
            total={courses.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
        />
        <Card sx={{m: 4, p: 4}}>
            {!showForm && <Box>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    variant='filled'
                    margin='normal'
                    label='Thêm bài viết mới ...'
                    onClick={() => {
                        if (!isLogined) return navigate('/auth/login');
                        setShowForm(true)
                    }}

                />
                <Stack direction='row' justifyContent='end'>
                    <Button variant='contained' onClick={() => {
                        if (!isLogined) return navigate('/auth/login');
                        setShowForm(true)
                    }}> Thêm</Button>
                </Stack>
            </Box>}
            {showForm && <BlogNewPostForm setLoad={setLoads} setShowForm={setShowForm}/>}

        </Card>
        <Box sx={{m: 4, p: 4}}>
            <Grid container spacing={3}>
                {Blogs?.map((post, index) => (
                    <BlogPostCard post={post} index={index}/>
                ))}
            </Grid>
        </Box>

    </>
}