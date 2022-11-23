import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {
    Box,
    Button,
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
import {useSnackbar} from 'notistack5';
import {useSelector} from "react-redux";
import Invoice from "./Invoice";
import FailCertificate from "./FailCertificate";

import {MIconButton} from "../../components/@material-extend";
import {getData, postData} from '../../_helper/httpProvider';
import {API_BASE_URL} from '../../../src/config/configUrl';
import closeFill from '@iconify/icons-eva/close-fill';
import {Icon} from '@iconify/react';


export default function Certificate() {

    const {id} = useParams();
    const [baiKiemTra, setBaiKiemTra] = useState({});
    const [_load, setLoad] = useState(0);
    const [dapAn, setDapAn] = useState([]);
    const [checked, setChecked] = useState([]);
    const [ketQua, setKetQua] = useState(null);
    const [selectedValue, setSelectedValue] = useState([]);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const userid = useSelector(state => state.user.current?.id)
    const userName = useSelector(state => state.user.current?.fullname)
    const [flag, setFlag] = useState(false);
    const [arrayErr, setArrayErr] = useState([]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            selectValues: [],
            userid: userid,
            idbkt: baiKiemTra?.baikiemtra?.bkt_id,
        },
        onSubmit: async (values, {setSubmitting, resetForm, setErrors, setFieldValue}) => {
            let _values = {...values};
            console.log(_values)
            let _arrErr = []
            setFlag(false);
            let _flag = false;
            values.selectValues.map((_data, idx) => {
                if (!_data) {
                    setFlag(true);
                    _flag = true;
                    _arrErr[idx] = `Câu hỏi ${idx + 1} trống!!!!`;
                    setArrayErr(_arrErr);
                }
            });

            if (_flag) return;

            try {
                let _rs = await postData(API_BASE_URL + `/api-v1/ketquakiemtra`, _values);
                setLoad((e) => e + 1);
                setKetQua(_rs.data);
                enqueueSnackbar('Bạn đã thi xong', {
                    variant: 'success',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill}/>
                        </MIconButton>
                    ),
                })
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
    console.log(values)

    useEffect(() => {
        (async () => {
            const res = await getData(API_BASE_URL + `/api-v1/baikiemtra/${id}`);
            const _user = await getData(API_BASE_URL + `/api-v1/kiemtra-chungchi?iduser=${userid}&&kh_makh=${id}`);
            console.log(_user.data[0])
            if (_user.data.length) {
                setKetQua({
                    message: 'pass',
                    points: _user.data[0].cc_diem,
                });
                setBaiKiemTra({
                    baikiemtra: {
                        kh_ten: _user.data[0].kh_ten
                    }
                })

            }
            setBaiKiemTra(res.data);
            setArrayErr([...Array(res.data.cauhoi.length)]);
            setFieldValue('selectValues', [...Array(res.data.cauhoi.length)]);
        })();
    }, [id, _load]);


    return (
        <>
            {!ketQua ? <Page title="Chứng chỉ">
                    <Container>
                        <Box>
                            <Stack direction="row" spacing={2}>
                                <Typography variant="h5">Khóa học: </Typography>
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
                                                                sx={{color: 'blue'}}
                                                            >
                                                                Câu hỏi {idx + 1}:
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
                                                                {dataCauHoi.ch_dapan.map((dataDapAn, index) => {
                                                                    return <div key={index}>
                                                                        <RadioGroup
                                                                            name="radio-buttons-group"
                                                                            value={values.selectValues[index]?.ch_idda}
                                                                            onChange={(e) => {
                                                                                let newSelect = [...values.selectValues];
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

                                                                })}
                                                            </div>
                                                        )}
                                                        {(dataCauHoi?.ch_loaicauhoi === 'mot' && arrayErr[idx] !== undefined)
                                                            &&
                                                            <Typography variant="inherit"
                                                                        sx={{color: "red"}}>{arrayErr[idx]}</Typography>
                                                        }

                                                        {dataCauHoi?.ch_loaicauhoi === 'nhieu' && (
                                                            <div>
                                                                {dataCauHoi.ch_dapan.map(
                                                                    (dataDapAnNhieu, index) => (
                                                                        <div key={index}>
                                                                            <FormControlLabel
                                                                                onChange={(e) => {
                                                                                    let newSelect = [...values.selectValues];
                                                                                    if (values.selectValues[idx]?.ch_idda?.length > 0) {
                                                                                        let idx1 = values.selectValues[idx].ch_idda.findIndex(el => Number(el) === Number(e.target.value));
                                                                                        if (idx1 !== -1) {
                                                                                            newSelect[idx] = {
                                                                                                ch_idda: values.selectValues[idx].ch_idda.filter(el1 => Number(el1) !== Number(e.target.value)),
                                                                                                ch_id: dataCauHoi.ch_id,
                                                                                            }
                                                                                        } else {
                                                                                            newSelect[idx] = {
                                                                                                ch_idda: [...values.selectValues[idx].ch_idda, e.target.value],
                                                                                                ch_id: dataCauHoi.ch_id,
                                                                                            }
                                                                                        }
                                                                                    } else {
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
                                                        {(dataCauHoi?.ch_loaicauhoi === 'nhieu' && arrayErr[idx] !== undefined)
                                                            &&
                                                            <Typography variant="inherit"
                                                                        sx={{color: "red"}}>{arrayErr[idx]}</Typography>
                                                        }
                                                    </FormControl>
                                                </Box>
                                            ))}
                                            <Stack sx={{p: 2}} direction='row' justifyContent='end'>
                                                <Button variant='contained' type={'submit'}>Nộp bài</Button>
                                            </Stack>
                                        </Card>
                                    </Form>
                                </FormikProvider>
                            </Box>
                        </Box>
                    </Container>
                </Page>
                :
                (ketQua?.message === 'pass' && !!baiKiemTra?.baikiemtra) &&
                <Page>
                    <Invoice diem={ketQua ? ketQua?.points : 0} baithi={baiKiemTra ? baiKiemTra : ''}
                             userName={userName}/>
                </Page>}
            {(ketQua?.message !== 'pass' && !!baiKiemTra?.baikiemtra) &&
                <FailCertificate diem={ketQua ? ketQua?.points : 0} baithi={baiKiemTra ? baiKiemTra : ''}
                                 userName={userName}/>

            }
        </>
    );
}
