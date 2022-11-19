import {Box, Button, Card, Grid, Skeleton, Stack, Typography} from "@material-ui/core";
import {useEffect, useState} from "react";
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import Code from "../../components/code/Code";
import {randomIntFromInterval} from "../../_helper/helper";
import {useNavigate} from 'react-router-dom'
import {useDispatch} from "react-redux";
import {runCode} from "../../redux/slices/code";
import {PATH_AUTH, PATH_PAGE} from "../../routes/paths";
import { useSelector } from "react-redux";

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

export default function CourseList() {
    const [courses, setCourses] = useState([]);
    const [isLoad, setLoad] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLogin = useSelector((state) => state?.user?.current?.role);

    useEffect(() => {
        (async () => {
            const _res = await getData(API_BASE_URL + '/api-v1/khoahoc');
            setCourses(_res.data);
            setLoad(false);
        })()
    }, [])

    return <>
        <Grid container spacing={3} sx={{paddingX: '10rem', paddingTop: '2rem'}}>
            {courses.map((course) => {
                const {kh_id, kh_makh, kh_ten, kh_mota, kh_code, kh_code_lang, num_bkt, kh_code_run} = course;
                console.log(num_bkt > 0)
                return (
                    <Grid item xs={12}>
                        <Card sx={{p: 4, minHeight: '80vh', backgroundColor: colorHome[randomIntFromInterval(0, 4)]}}>
                            <Grid container key={course.kh_id}>
                                <Grid item xs={6} md={6}>
                                    <Typography variant='h3' align='center'>{kh_ten}</Typography>
                                    <Box my={4} dangerouslySetInnerHTML={{__html: kh_mota}}/>
                                    <Stack spacing={4}>
                                        <Button variant='contained' color='info' sx={{width: '20rem'}} onClick={() => {
                                            navigate(PATH_PAGE.course_content + `/${kh_makh}`);
                                        }}>
                                            Học {kh_ten}
                                        </Button>
                                        <Button onClick={() => {
                                            isLogin ?
                                            navigate(PATH_PAGE.certificate + `/${kh_makh}`) :
                                            navigate(PATH_AUTH.login)


                                        }} variant='contained' disabled={num_bkt === 0} color='warning'
                                                sx={{width: '20rem'}}>
                                            Lấy chứng chỉ
                                        </Button>
                                    </Stack>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <Box>
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
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                )
            })}

            {isLoad && SkeletonLoad}
        </Grid>
    </>
}