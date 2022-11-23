import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Box, Card, Divider, Grid, ListItemText, MenuItem, MenuList} from "@material-ui/core";
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import LessonContent from "./LessonContent";

export default function CourseContent() {
    const {id} = useParams();
    const [lessons, setLessons] = useState();
    const [idbh, setIdbh] = useState(1);

    useEffect(() => {
        (async () => {
            const res = await getData(API_BASE_URL + `/api-v1/khoahoc/${id}`);
            setLessons(res.data);
            if (res.data.length > 0) setIdbh(res.data[0].bh_id)
        })()
    }, [id]);

    return <>
        <Grid container spacing={2}>
            <Grid item xs={4} md={4}>
                <Card sx={{p: 2}}>
                    <MenuList>
                        {lessons?.map((e, idx) => (
                            <Box key={idx}>
                                <MenuItem onClick={() => setIdbh(e.bh_id)}>
                                    < ListItemText sx={{
                                        backgroundColor: e.bh_id === idbh && '#F47F26',
                                        color: e.bh_id === idbh && '#fff',
                                        borderRadius: e.bh_id === idbh && '5px',
                                        padding: 1
                                    }}>{e.bh_ten}</ListItemText>
                                </MenuItem>
                                <Divider/>
                            </Box>
                        ))}
                    </MenuList>
                </Card>

            </Grid>

            <Grid item xs={8} md={8}>
                <Card sx={{p: 3}}>
                    <LessonContent idbh={idbh}/>
                </Card>
            </Grid>

        </Grid>
    </>
}