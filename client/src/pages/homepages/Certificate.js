import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {getData, postData} from '../../_helper/httpProvider';
import {API_BASE_URL} from '../../config/configUrl';
import {
    Box, Button,
    Card,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Stack,
    Typography,
} from '@material-ui/core';
import Page from '../../components/Page';
import {Form, FormikProvider, useFormik} from 'formik';
import closeFill from '@iconify/icons-eva/close-fill';
import {MIconButton} from '../../components/@material-extend';
import {Icon} from '@iconify/react';
import {useSnackbar} from 'notistack5';
import {useSelector} from "react-redux";

export default function Certificate() {

    const {id} = useParams();
    const [baiKiemTra, setBaiKiemTra] = useState({});
    const [_load, setLoad] = useState(0);
    const [dapAn, setDapAn] = useState([]);
    const [checked, setChecked] = useState([]);
    const [selectedValue, setSelectedValue] = useState([]);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const userid = useSelector(state => state.user.current?.id)

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            selectValues: [],
            userid: userid,
            idbkt: baiKiemTra?.baikiemtra?.bkt_id
        },
        onSubmit: async (values, {setSubmitting, resetForm, setErrors}) => {
            let _values = {...values};
            try {
                await postData(API_BASE_URL+`/api-v1/ketquakiemtra`,values);
            } catch (error) {
                console.error(error);
                enqueueSnackbar(error.response.data, {
                    variant: 'error',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill}/>
                        </MIconButton>
                    ),
                });
            }
        },
    });

    const {
        errors,
        values,
        touched,
        handleSubmit,
        setFieldValue,
        getFieldProps,
    } = formik;

    useEffect(() => {
        (async () => {
            const res = await getData(API_BASE_URL + `/api-v1/baikiemtra/${id}`);
            setBaiKiemTra(res.data);
            setFieldValue('selectValues', [...Array(res.data.cauhoi.length)]);
        })();
    }, [id]);

    console.log(values, 'aaa');

    return (
        <>
            <Page title="Ch???ng ch???">
                <Container>
                    <Box>
                        <Stack direction="row" spacing={2}>
                            <Typography variant="h5">Kh??a h???c: </Typography>
                            <Typography variant="h5">
                                {baiKiemTra?.baikiemtra?.kh_ten}
                            </Typography>
                        </Stack>
                        <Typography variant="h5">
                            {baiKiemTra?.baikiemtra?.bkt_ten}
                        </Typography>
                        <Box>
                            <FormikProvider value={formik}>
                                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                                    <Card sx={{p: 2}}>
                                        {baiKiemTra?.cauhoi?.map((dataCauHoi, idx) => (
                                            <Box display="flex" p={1}>
                                                <FormControl>
                                                    <FormLabel
                                                        id="demo-radio-buttons-group-label"
                                                        sx={{display: 'inherit'}}
                                                    >
                                                        <Typography
                                                            color="ActiveBorder"
                                                            sx={{color: 'red'}}
                                                        >
                                                            C??u h???i {idx + 1}:
                                                        </Typography>
                                                        <Box
                                                            //   mx={1}
                                                            sx={{fontWeight: 'bold', marginLeft: '10px'}}
                                                            dangerouslySetInnerHTML={{
                                                                __html: dataCauHoi.ch_noidung,
                                                            }}
                                                        />
                                                    </FormLabel>
                                                    {dataCauHoi?.ch_loaicauhoi === 'mot' && (
                                                        <div>
                                                            {dataCauHoi.ch_dapan.map((dataDapAn, index) => (
                                                                <div key={index}>
                                                                    <RadioGroup
                                                                        name="radio-buttons-group"
                                                                        value={values.selectValues[index]?.ch_idda}
                                                                        onChange={(e) => {
                                                                            let newSelect = values.selectValues;
                                                                            newSelect[idx] = {
                                                                                ch_idda: [e.target.value],
                                                                                ch_id: dataCauHoi.ch_id,
                                                                            };
                                                                            setFieldValue('selectValues', newSelect);
                                                                        }}
                                                                    >
                                                                        <Stack
                                                                            direction="row"
                                                                            my={2}
                                                                            alignItems="center"
                                                                        >
                                                                            <FormControlLabel
                                                                                checked={
                                                                                    values.selectValues.findIndex(
                                                                                        (el) =>
                                                                                            Number(el?.ch_idda) ===
                                                                                            Number(dataCauHoi.ch_idda[index]),
                                                                                    ) !== -1
                                                                                }
                                                                                value={dataCauHoi.ch_idda[index]}
                                                                                control={<Radio/>}
                                                                                label={dataDapAn}
                                                                            />{' '}
                                                                        </Stack>
                                                                    </RadioGroup>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {dataCauHoi?.ch_loaicauhoi === 'nhieu' && (
                                                        <div>
                                                            {dataCauHoi.ch_dapan.map(
                                                                (dataDapAnNhieu, index) => (
                                                                    <div key={index}>
                                                                        <FormControlLabel
                                                                            onChange={(e) => {
                                                                                let newSelect =[... values.selectValues];
                                                                                if(values.selectValues[idx]?.ch_idda?.length > 0){
                                                                                    let idx1 = values.selectValues[idx].ch_idda.findIndex(el => Number(el) === Number(e.target.value));
                                                                                    console.log(idx1)
                                                                                    if(idx1 !== -1){
                                                                                        newSelect[idx] = {
                                                                                            ch_idda : values.selectValues[idx].ch_idda.filter(el1 => Number(el1) !== Number(e.target.value)),
                                                                                            ch_id: dataCauHoi.ch_id,
                                                                                        }

                                                                                    }else{
                                                                                        newSelect[idx] = {
                                                                                            ch_idda : [... values.selectValues[idx].ch_idda, e.target.value],
                                                                                            ch_id: dataCauHoi.ch_id,
                                                                                        }
                                                                                    }
                                                                                }else{
                                                                                    newSelect[idx] = {
                                                                                        ch_idda: !!values.selectValues?.ch_idda ? [...values.selectValues?.ch_idda, e.target.value] : [e.target.value],
                                                                                        ch_id: dataCauHoi.ch_id,
                                                                                    };
                                                                                }

                                                                                setFieldValue('selectValues', newSelect);

                                                                            }}
                                                                            value={dataCauHoi.ch_idda[index]}
                                                                            control={<Checkbox/>}
                                                                            label={dataDapAnNhieu}
                                                                        />
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                                </FormControl>
                                            </Box>
                                        ))}
                                        <Stack sx={{p:2}} direction='row' justifyContent='end'>
                                            <Button variant='contained' type={'submit'}>N???p b??i</Button>
                                        </Stack>
                                    </Card>
                                </Form>
                            </FormikProvider>
                        </Box>
                    </Box>
                </Container>
            </Page>
        </>
    );
}
