import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {useSnackbar} from 'notistack5';
import {useEffect, useState} from 'react';
import {Form, FormikProvider, useFormik} from 'formik';
// material
import {styled} from '@material-ui/core/styles';
import {LoadingButton} from '@material-ui/lab';
import {
    Autocomplete,
    Box,
    Button,
    Card,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@material-ui/core';
import {Icon} from '@iconify/react';
// utils
// routes
//
import {QuillEditor} from '../../editor';
import {getData, postData, putData} from '../../../_helper/httpProvider';
import {API_BASE_URL} from '../../../config/configUrl';
import {MIconButton} from '../../@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';
// import {useDispatch} from "react-redux";
// import {useNavigate} from "react-router-dom";
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({theme}) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

const typeQuestion = [{
    id: 'mot',
    name: 'Một đáp án đúng'
}, {
    id: 'nhieu',
    name: 'Nhiều đáp án đúng'
}]

// ----------------------------------------------------------------------

QuestionNewForm.propTypes = {
    isEdit: PropTypes.bool,
    currentProduct: PropTypes.object,
};

export default function QuestionNewForm({isEdit, current}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [courses, setCourses] = useState([]);
    const [question, setQuestion] = useState([]);
    const [idndbh, setIdndbh] = useState(1);
    // const dispatch = useDispatch();
    // const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const _res = await getData(API_BASE_URL + '/api/khoahoc');
            setCourses(_res.data);
            console.log(current)
            if (isEdit) {
                let arr = [];
                arr = current?.cauhoi?.map(e => e.ch_id);
                if (arr?.length > 0) setIdndbh(Number(Math.max(...arr)) + 1);
                setQuestion(current.cauhoi)
            }
        })()
    }, [isEdit, current]);

    const NewSchema = Yup.object().shape({
        bh_idkh: Yup.object().required('Vui lòng chọn khóa học'),
        bkt_ten: Yup.string().required('Vui lòng nhập bài kiểm tra'),
        thoigian: Yup.number('Thời gian không hợp lệ!')
            .typeError('Thời gian không hợp lệ!')
            .min(1, 'Thời gian không hợp lệ!')
            .required('Vui lòng điền thời gian kiểm tra')
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            bh_idkh: current?.baikiemtra?.kh_id ? {
                kh_id: current.baikiemtra.kh_id,
                kh_ten: current.baikiemtra.kh_ten
            } : '',
            active: true,
            bh_idndbh: '',
            ch_loaicauhoi: {
                id: 'mot',
                name: 'Một đáp án đúng'
            },
            ch_dapandung: '1',
            ch_dapan: [...Array(2)],
            ch_noidung: '',
            ch_dapannhieu: [],
            thoigian: 20,
            bkt_active: true,
            bkt_ten: current?.baikiemtra?.bkt_ten || ''
        },
        validationSchema: NewSchema,
        onSubmit: async (values, {setSubmitting, resetForm, setErrors}) => {
            let _values = {...values};
            try {
                if (question.length === 0) return enqueueSnackbar('Chưa có nội dung bài kiểm tra', {
                    variant: 'error',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill}/>
                        </MIconButton>
                    ),
                });
                let _values = {...values};
                let data = {}
                data.baikiemtra = {
                    bkt_ten: _values.bkt_ten,
                    bkt_thoigian: _values.thoigian,
                    bkt_idkh: _values.bh_idkh.kh_id,
                    bkt_active: _values.bkt_active
                }

                data.cauhoi = question
                if (isEdit) {
                    delete _values.ndbh_id;
                    _values.bai_hoc = question;
                    await putData(API_BASE_URL + `/api/baikiemtra/${current.baikiemtra.bkt_id}`, data);
                } else {
                    _values.bai_hoc = question;
                    await postData(API_BASE_URL + '/api/baikiemtra', data);
                }
                enqueueSnackbar(isEdit ? 'Cập nhật thành công' : 'Thêm thành công!', {
                    variant: 'success',
                    action: (key) => (
                        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                            <Icon icon={closeFill}/>
                        </MIconButton>
                    ),
                })
                setFieldValue('ch_noidung', '');
                setFieldValue('ch_dapan', ['', '']);
                setFieldValue('ch_dapandung', '1');
                setFieldValue('ch_dapannhieu', []);

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


    const addQuestion = () => {
        if (!values.ch_noidung) return enqueueSnackbar('Vui lòng điền nội dung câu hỏi', {
            variant: 'error',
            action: (key) => (
                <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                    <Icon icon={closeFill}/>
                </MIconButton>
            ),
        });
        let checkEmpty = false;
        values.ch_dapan.map(e => {
            if (typeof e === 'undefined' || e === null) return checkEmpty = true;
        })

        if (checkEmpty) return enqueueSnackbar('Vui lòng không bỏ trống đáp án', {
            variant: 'error',
            action: (key) => (
                <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                    <Icon icon={closeFill}/>
                </MIconButton>
            ),
        });

        if (values.ch_loaicauhoi.id === 'nhieu' && values.ch_dapannhieu.length === 0) return enqueueSnackbar('Vui lòng chọn một đáp án đúng', {
            variant: 'error',
            action: (key) => (
                <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                    <Icon icon={closeFill}/>
                </MIconButton>
            ),
        });

        let arrCorrect = [];
        if (values.ch_loaicauhoi.id === 'mot') arrCorrect[0] = values.ch_dapandung;
        if (values.ch_loaicauhoi.id === 'nhieu') arrCorrect = values.ch_dapannhieu;

        setQuestion(pre => [...pre, {
            ch_noidung: values.ch_noidung,
            ch_dapan: values.ch_dapan,
            ch_dapandung: arrCorrect,
            ch_id: idndbh,
            ch_active: values.active,
            ch_loaicauhoi: values.ch_loaicauhoi
        }]);

        setIdndbh(e => e + 1);
        setFieldValue('ch_noidung', '');
        setFieldValue('ch_dapan', ['', '']);
        setFieldValue('ch_dapannhieu', []);
    }

    const removeQuesion = (id) => {
        setQuestion(question.filter(e => e.ch_id !== id));
    }

    const editQuesion = (id, value) => {
        setFieldValue('ch_noidung', value.ch_noidung);
        setFieldValue('ch_loaicauhoi', value.ch_loaicauhoi);
        if (value.ch_loaicauhoi.id === 'mot') {
            setFieldValue('ch_dapandung', value.ch_dapandung);
        } else {
            setFieldValue('ch_dapannhieu', value.ch_dapandung);
        }
        setFieldValue('ch_dapan', value.ch_dapan);
        setFieldValue('bh_idndbh', id);
    }

    const confirmQuestion = () => {
        const index = question.findIndex(e => e.ch_id === values.bh_idndbh);
        if (index !== -1) {
            let val = [...question];
            let arrCorrect = [];
            if (values.ch_loaicauhoi.id === 'mot') arrCorrect[0] = values.ch_dapandung;
            else arrCorrect = values.ch_dapannhieu;
            val[index] = {
                ch_noidung: values.ch_noidung,
                ch_dapan: values.ch_dapan,
                ch_dapandung: arrCorrect,
                ch_id: idndbh,
                ch_active: values.active,
                ch_loaicauhoi: values.ch_loaicauhoi
            }
            console.log(val)
            setQuestion(val);
            setFieldValue('ch_noidung', '');
            setFieldValue('ch_dapan', ['', '']);
            setFieldValue('ch_dapandung', '1');
            setFieldValue('ch_dapannhieu', []);
        }
    }

    const handleClick = (event, name) => {
        const selectedIndex = values.ch_dapannhieu.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(values.ch_dapannhieu, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(values.ch_dapannhieu.slice(1));
        } else if (selectedIndex === values.ch_dapannhieu.length - 1) {
            newSelected = newSelected.concat(values.ch_dapannhieu.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                values.ch_dapannhieu.slice(0, selectedIndex),
                values.ch_dapannhieu.slice(selectedIndex + 1),
            );
        }
        setFieldValue('ch_dapannhieu', newSelected)
    };
    return (
        <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <Stack spacing={3}>
                            <Card sx={{p: 2}}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            {...getFieldProps('bkt_active')}
                                            checked={values.bkt_active}
                                        />
                                    }
                                    label="Trạng thái (Ẩn/hiện)"
                                    sx={{mb: 2}}
                                />
                                <Autocomplete
                                    freeSolo
                                    value={values.bh_idkh}
                                    onChange={(event, newValue) => {
                                        setFieldValue('bh_idkh', newValue || '');
                                    }}
                                    options={courses?.map((option) => ({
                                        kh_id: option.kh_id,
                                        kh_ten: option.kh_ten,
                                    }))}
                                    renderInput={(params) => (
                                        <TextField
                                            label="Khóa học"
                                            {...params}
                                            error={Boolean(touched.bh_idkh && errors.bh_idkh)}
                                            helperText={touched.bh_idkh && errors.bh_idkh}
                                        />
                                    )}
                                    getOptionLabel={(option) => option.kh_ten || ''}
                                />
                                <TextField
                                    label='Tên bài kiểm tra'
                                    {...getFieldProps('bkt_ten')}
                                    margin='normal'
                                    fullWidth
                                    multiline
                                    rows={2}
                                    error={Boolean(touched.bkt_ten && errors.bkt_ten)}
                                    helperText={touched.bkt_ten && errors.bkt_ten}
                                />
                                <TextField
                                    label='Thời gian (phút)'
                                    {...getFieldProps('thoigian')}
                                    margin='normal'
                                    error={Boolean(touched.thoigian && errors.thoigian)}
                                    helperText={touched.thoigian && errors.thoigian}
                                />
                            </Card>

                            <Card sx={{p: 3}}>
                                <Grid container spacing={{xs: 3, sm: 2}}>
                                    <Grid item xs={12} md={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    {...getFieldProps('active')}
                                                    checked={values.active}
                                                />
                                            }
                                            label="Trạng thái (Ẩn/hiện)"
                                            sx={{mb: 2}}
                                        />
                                        <Autocomplete
                                            freeSolo
                                            value={values.ch_loaicauhoi}
                                            onChange={(event, newValue) => {
                                                setFieldValue('ch_loaicauhoi', newValue || '');
                                                setFieldValue('bh_idndbh', '');
                                                setFieldValue('ch_dapan', ['', '', '', '']);
                                            }}
                                            options={typeQuestion?.map((option) => ({
                                                id: option.id,
                                                name: option.name,
                                            }))}
                                            renderInput={(params) => (
                                                <TextField
                                                    label="Loại câu hỏi"
                                                    {...params}
                                                    sx={{width: '25rem'}}
                                                    error={Boolean(touched.ch_loaicauhoi && errors.ch_loaicauhoi)}
                                                    helperText={touched.ch_loaicauhoi && errors.ch_loaicauhoi}
                                                />
                                            )}
                                            getOptionLabel={(option) => option.name || ''}
                                        />

                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <LabelStyle sx={{marginTop: '1rem'}}>Nội dung câu hỏi</LabelStyle>
                                        <QuillEditor
                                            simple
                                            id="product-description"
                                            value={values.ch_noidung}
                                            placeholder="Nội dung ..."
                                            onChange={(val) => setFieldValue('ch_noidung', val)}
                                        />
                                        {values.ch_loaicauhoi.id === 'mot' && (
                                            <div>
                                                <FormControl>
                                                    <RadioGroup row {...getFieldProps('ch_dapandung')}>
                                                        {values.ch_dapan.map((e, idx) => (
                                                            <Box key={idx}>
                                                                <Stack direction='row' my={2} sx={{width: '60rem'}}>
                                                                    <Radio
                                                                        checked={values.ch_dapandung.indexOf((idx + 1).toString()) !== -1}
                                                                        value={(idx + 1).toString()}
                                                                    />
                                                                    <TextField fullWidth value={values.ch_dapan[idx]}
                                                                               onChange={e => {
                                                                                   let val = [...values.ch_dapan];
                                                                                   val[idx] = e.target.value;
                                                                                   setFieldValue('ch_dapan', val)
                                                                               }}/>
                                                                </Stack>
                                                            </Box>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>

                                                <MIconButton
                                                    onClick={() => setFieldValue('ch_dapan', [...values.ch_dapan, null])}>
                                                    <Icon icon="akar-icons:circle-plus"/>
                                                </MIconButton>
                                            </div>
                                        )}
                                        {values.ch_loaicauhoi.id === 'nhieu' && (
                                            <div>
                                                {values.ch_dapan.map((e, idx) => {
                                                    const isItemSelected = values.ch_dapannhieu.indexOf((idx + 1).toString()) !== -1;
                                                    return <Box key={idx}>
                                                        <Stack direction='row' my={2} sx={{width: '60rem'}}>
                                                            <Checkbox
                                                                checked={isItemSelected}
                                                                onChange={(event) => handleClick(event, (idx + 1).toString())}
                                                            />
                                                            <TextField fullWidth value={values.ch_dapan[idx]}
                                                                       onChange={e => {
                                                                           let val = [...values.ch_dapan];
                                                                           val[idx] = e.target.value;
                                                                           setFieldValue('ch_dapan', val)
                                                                       }}/>
                                                        </Stack>
                                                    </Box>
                                                })}
                                                <MIconButton
                                                    onClick={() => setFieldValue('ch_dapan', [...values.ch_dapan, null])}>
                                                    <Icon icon="akar-icons:circle-plus"/>
                                                </MIconButton>
                                            </div>
                                        )}

                                    </Grid>
                                    <Stack sx={{ml: 2, mt: 2}}>
                                        {!values?.bh_idndbh &&
                                            <Button onClick={addQuestion} variant='outlined'>Thêm câu hỏi</Button>}
                                        {!!values?.bh_idndbh &&
                                            <Button onClick={confirmQuestion} variant='outlined'>Lưu</Button>}
                                    </Stack>
                                </Grid>
                            </Card>
                        </Stack>
                        <LoadingButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{mt: 2}}
                        >
                            {!isEdit ? 'Thêm bài kiểm tra' : 'Lưu'}
                        </LoadingButton>
                    </Grid>
                    {question?.length > 0 && (
                        <Grid item xs={12} md={12}>
                            <Card sx={{p: 4}}>
                                <Stack direction='row' alignItems='center' justifyItems='center`'>
                                    <Typography>Khóa học: </Typography>
                                    <Typography sx={{mx: 2}} variant='h5'>{values.bh_idkh?.kh_ten}</Typography>
                                </Stack>
                                <Divider sx={{my: 2}}/>
                                {question?.map((e, idx) => (
                                    <Box key={idx}>
                                        <Stack direction='row'>
                                            <Button startIcon={<Icon icon="ep:remove-filled" color="#F44336"/>}
                                                    onClick={() => {
                                                        removeQuesion(e.ch_id)
                                                    }}>
                                                Xóa
                                            </Button>
                                            <Button color='warning'
                                                    startIcon={<Icon icon="akar-icons:edit" color="#0045FF"/>}
                                                    onClick={() => {
                                                        let loaich = {}
                                                        if (!!e.ch_loaicauhoi.id) {
                                                            loaich = e.ch_loaicauhoi
                                                        } else {
                                                            loaich = typeQuestion.filter(e1 => e1.id === e.ch_loaicauhoi)[0]
                                                        }
                                                        editQuesion(e.ch_id, {
                                                            ch_noidung: e.ch_noidung,
                                                            ch_dapan: e.ch_dapan,
                                                            ch_dapandung: e.ch_dapandung,
                                                            ch_loaicauhoi: loaich
                                                        });
                                                    }}>
                                                Chỉnh sửa
                                            </Button>
                                        </Stack>
                                        <Box display='flex' p={1}><Typography color='ActiveBorder'>Câu
                                            hỏi {idx + 1}: </Typography> <Box mx={1}
                                                                              dangerouslySetInnerHTML={{__html: e.ch_noidung}}/></Box>
                                        <ol type="A">

                                            {e.ch_dapan.map((e1, idx1) => (
                                                <li key={idx1} style={{
                                                    marginLeft: '5rem',
                                                    color: e.ch_dapandung.findIndex(el => el === (idx1 + 1).toString()) !== -1 && 'red'
                                                }}>{e1}</li>
                                            ))}
                                        </ol>

                                    </Box>
                                ))}
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Form>
        </FormikProvider>
    )
        ;
}
