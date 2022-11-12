import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {useSnackbar} from 'notistack5';
import {useCallback, useEffect, useState} from 'react';
import {Form, FormikProvider, useFormik} from 'formik';
// material
import {styled} from '@material-ui/core/styles';
import {LoadingButton} from '@material-ui/lab';
import {
    Autocomplete,
    Card,
    FormControlLabel,
    Grid,
    Icon,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@material-ui/core';
// utils
// routes
//
import {QuillEditor} from '../../editor';
import {UploadMultiFile} from '../../upload';
import {getData, postData, putData} from '../../../_helper/httpProvider';
import {API_BASE_URL, URL_PUBLIC_IMAGES} from '../../../config/configUrl';
import {MIconButton} from '../../../components/@material-extend';
import closeFill from '@iconify/icons-eva/close-fill';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({theme}) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

BookNewForm.propTypes = {
    isEdit: PropTypes.bool,
    currentProduct: PropTypes.object,
};

export default function BookNewForm({isEdit, currentProduct}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [tacgiaList, setTacgiaList] = useState([]);
    const [nxbList, setNxbList] = useState([]);
    const [tlList, setTlList] = useState([]);
    const [nnList, setNnList] = useState([]);

    useEffect(() => {
        (async () => {
            const _tacgia = await getData(API_BASE_URL + '/tacgia');
            setTacgiaList(_tacgia.data);
            const _nxb = await getData(API_BASE_URL + '/nhaxuatban');
            setNxbList(_nxb.data);
            const _tl = await getData(API_BASE_URL + '/theloai');
            setTlList(_tl.data);
            const _nn = await getData(API_BASE_URL + '/ngonngu');
            setNnList(_nn.data);
        })();
    }, []);

    const NewProductSchema = Yup.object().shape({
        sp_ten: Yup.string().required('Vui lòng nhập tên sản phẩm'),
        sp_mota: Yup.string(),
        sp_hinhanh: Yup.array(),
        sp_masp: Yup.string().required('Vui lòng nhập mã sản phẩm'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            sp_ten: currentProduct?.sp_ten || '',
            sp_mota: currentProduct?.sp_mota || '',
            sp_hinhanh:
                currentProduct?.sp_hinhanh?.map(
                    (e) => `${URL_PUBLIC_IMAGES + e.ha_hinh}`,
                ) || [],
            sp_chieudai: currentProduct?.sp_chieudai || 20,
            sp_chieurong: currentProduct?.sp_chieurong || 10,
            sp_idtl:
                {
                    tl_ten: currentProduct?.tl_ten,
                    tl_id: currentProduct?.sp_idtl,
                } || '',
            sp_idtg:
                {
                    tg_ten: currentProduct?.tg_ten,
                    tg_id: currentProduct?.sp_idtg,
                } || '',
            sp_idnxb:
                {
                    nxb_ten: currentProduct?.nxb_ten,
                    nxb_id: currentProduct?.sp_idnxb,
                } || '',
            sp_idnn:
                {
                    nn_ten: currentProduct?.nn_ten,
                    nn_id: currentProduct?.sp_idnn,
                } || '',
            active: Boolean(currentProduct?.active) || true,
            sp_masp: currentProduct?.sp_masp || '',
            sp_hinhanh_old: currentProduct?.sp_hinhanh || [],
        },
        validationSchema: NewProductSchema,
        onSubmit: async (values, {setSubmitting, resetForm, setErrors}) => {
            let _values = {...values};
            _values.sp_idnxb = values.sp_idnxb.nxb_id;
            _values.sp_idtg = values.sp_idtg.tg_id;
            _values.sp_idtl = values.sp_idtl.tl_id;
            _values.sp_idnn = values.sp_idnn.nn_id;
            try {
                const formDt = new FormData();
                if (values.sp_hinhanh.length > 0) {
                    values.sp_hinhanh.map((value) => {
                        return formDt.append('sp_hinhanh', value);
                    });
                }
                formDt.append('data', JSON.stringify(_values));
                if (isEdit) {
                    await putData(
                        API_BASE_URL + `/book/${currentProduct.sp_id}`,
                        formDt,
                        {
                            'content-type': 'multipart/form-data',
                        },
                    );
                } else {
                    await postData(API_BASE_URL + '/book/create', formDt, {
                        'content-type': 'multipart/form-data',
                    });
                    resetForm();
                }
                enqueueSnackbar(!isEdit ? 'Thêm thành công' : 'Cập nhật thành công', {
                    variant: 'success',
                });
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

    const handleDrop = useCallback(
        (acceptedFiles) => {
            setFieldValue(
                'sp_hinhanh',
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    }),
                ),
            );
        },
        [setFieldValue],
    );

    const handleRemoveAll = () => {
        setFieldValue('sp_hinhanh', []);
    };

    const handleRemove = (file) => {
        const filteredItems = values.sp_hinhanh.filter((_file) => _file !== file);
        setFieldValue('sp_hinhanh', filteredItems);
    };

    return (
        <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{p: 3}}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Tên sách"
                                    {...getFieldProps('sp_ten')}
                                    error={Boolean(touched.sp_ten && errors.sp_ten)}
                                    helperText={touched.sp_ten && errors.sp_ten}
                                />

                                <div>
                                    <LabelStyle>Mô tả</LabelStyle>
                                    <QuillEditor
                                        simple
                                        id="product-description"
                                        value={values.sp_mota}
                                        placeholder="Mô tả ..."
                                        onChange={(val) => setFieldValue('sp_mota', val)}
                                    />
                                </div>

                                <div>
                                    <LabelStyle>Thêm hình ảnh</LabelStyle>
                                    <UploadMultiFile
                                        showPreview
                                        maxSize={3145728}
                                        accept="image/*"
                                        files={values.sp_hinhanh}
                                        onDrop={handleDrop}
                                        onRemove={handleRemove}
                                        onRemoveAll={handleRemoveAll}
                                        error={Boolean(touched.sp_hinhanh && errors.sp_hinhanh)}
                                    />
                                </div>
                            </Stack>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            <Card sx={{p: 3}}>
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

                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Mã sản phẩm"
                                        {...getFieldProps('sp_masp')}
                                        error={Boolean(touched.sp_masp && errors.sp_masp)}
                                        helperText={touched.sp_masp && errors.sp_masp}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Chiều dài"
                                        {...getFieldProps('sp_chieudai')}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Chiều rộng"
                                        {...getFieldProps('sp_chieurong')}
                                    />

                                    <Autocomplete
                                        freeSolo
                                        value={values.sp_idnxb}
                                        onChange={(event, newValue) => {
                                            setFieldValue('sp_idnxb', newValue);
                                        }}
                                        options={nxbList?.map((option) => ({
                                            nxb_id: option.nxb_id,
                                            nxb_ten: option.nxb_ten,
                                        }))}
                                        renderInput={(params) => (
                                            <TextField label="Nhà xuất bản" {...params} />
                                        )}
                                        getOptionLabel={(option) => option.nxb_ten || ''}
                                    />

                                    <Autocomplete
                                        freeSolo
                                        value={values.sp_idtg}
                                        onChange={(event, newValue) => {
                                            setFieldValue('sp_idtg', newValue);
                                        }}
                                        options={tacgiaList?.map((option) => ({
                                            tg_id: option.tg_id,
                                            tg_ten: option.tg_ten,
                                        }))}
                                        renderInput={(params) => (
                                            <TextField label="Tác giả" {...params} />
                                        )}
                                        getOptionLabel={(option) => option.tg_ten || ''}
                                    />

                                    <Autocomplete
                                        freeSolo
                                        value={values.sp_idtl}
                                        onChange={(event, newValue) => {
                                            setFieldValue('sp_idtl', newValue);
                                        }}
                                        options={tlList?.map((option) => ({
                                            tl_id: option.tl_id,
                                            tl_ten: option.tl_ten,
                                        }))}
                                        renderInput={(params) => (
                                            <TextField label="Thể loại" {...params} />
                                        )}
                                        getOptionLabel={(option) => option.tl_ten || ''}
                                    />
                                    <Autocomplete
                                        freeSolo
                                        value={values.sp_idnn}
                                        onChange={(event, newValue) => {
                                            setFieldValue('sp_idnn', newValue);
                                        }}
                                        options={nnList?.map((option) => ({
                                            nn_id: option.nn_id,
                                            nn_ten: option.nn_ten,
                                        }))}
                                        renderInput={(params) => (
                                            <TextField label="Ngôn ngữ" {...params} />
                                        )}
                                        getOptionLabel={(option) => option.nn_ten || ''}
                                    />
                                </Stack>
                            </Card>
                            <LoadingButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                            >
                                {!isEdit ? 'Thêm sách' : 'Lưu'}
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Form>
        </FormikProvider>
    );
}
