import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import {
    Box,
    Checkbox,
    Container,
    FormControl,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from "@material-ui/core";
import Page from "../../components/Page";

export default function Certificate() {
    const {id} = useParams();
    const [baiKiemTra, setBaiKiemTra] = useState({});

    useEffect(() => {
        (async () => {
            const res = await getData(API_BASE_URL + `/api-v1/baikiemtra/${id}`);
            setBaiKiemTra(res.data);
        })()
    }, [id])
    return <>
        <Page title='Chứng chỉ'>
            <Container>
                <Box>
                    <Stack direction='row' spacing={2}>
                        <Typography variant='h5'>Khóa học: </Typography>
                        <Typography variant='h5'>{baiKiemTra?.baikiemtra?.kh_ten}</Typography>
                    </Stack>
                    <Typography variant='h5'>{baiKiemTra?.baikiemtra?.bkt_ten}</Typography>
                    baiKiemTra.cauhoi.map((data, index)=>(
                        <Box key={index}>
                            <Stack direction='row' my={2} sx={{width: '60rem'}}>
                                {/*{baiKiemTra.ch_loaicauhoi === 'mot' && (*/}
                                {/*    <FormControl>*/}
                                {/*        <RadioGroup >*/}
                                {/*            {data.ch_dapan.map((e, idx) => (*/}
                                {/*                <Box key={idx}>*/}
                                {/*                    <Stack direction='row' my={2} sx={{width: '60rem'}}>*/}
                                {/*                        <Radio*/}
                                {/*                            checked={values.ch_dapandung.indexOf((idx + 1).toString()) !== -1}*/}
                                {/*                            value={(idx + 1).toString()}*/}
                                {/*                        />*/}
                                {/*                        <TextField fullWidth value={values.ch_dapan[idx]}*/}
                                {/*                                   onChange={e => {*/}
                                {/*                                       let val = [...values.ch_dapan];*/}
                                {/*                                       val[idx] = e.target.value;*/}
                                {/*                                       setFieldValue('ch_dapan', val)*/}
                                {/*                                   }}/>*/}
                                {/*                    </Stack>*/}
                                {/*                </Box>*/}
                                {/*            ))}*/}
                                {/*        </RadioGroup>*/}
                                {/*    </FormControl>*/}
                                {/*)}*/}


                            </Stack>
                        </Box>
                    ))
                </Box>
            </Container>
        </Page>

    </>
}