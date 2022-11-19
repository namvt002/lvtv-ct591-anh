import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getData } from '../../_helper/httpProvider';
import { API_BASE_URL } from '../../config/configUrl';
import {
  Box,
  Checkbox,
  Container,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Stack,
  Typography,
} from '@material-ui/core';
import Page from '../../components/Page';
import { values } from 'lodash';
import { FormikProvider, useFormik, Form } from 'formik';
import closeFill from '@iconify/icons-eva/close-fill';
import { MIconButton } from '../../components/@material-extend';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';

export default function Certificate() {
  const { id } = useParams();
  const [baiKiemTra, setBaiKiemTra] = useState({});
  const [_load, setLoad] = useState(0);
  const [dapAn, setDapAn] = useState([]);
  const [checked, setChecked] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      selectValues: [],
    },
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      let _values = { ...values };
      try {
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.response.data, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
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

  console.log(values);
  const handleCheckBox = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      console.log(event.target.checked);
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    console.log(updatedList);
    setChecked(updatedList);
  };
  console.log(values);
  return (
    <>
      <Page title="Chứng chỉ">
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
                  {/* <Stack direction="row" my={2} sx={{ width: '60rem' }}> */}
                  {baiKiemTra?.cauhoi?.map((dataCauHoi, idx) => (
                    <Box display="flex" p={1}>
                      <FormControl>
                        <FormLabel
                          id="demo-radio-buttons-group-label"
                          sx={{ display: 'inherit' }}
                        >
                          <Typography
                            color="ActiveBorder"
                            sx={{ color: 'red' }}
                          >
                            Câu hỏi {idx + 1}:
                          </Typography>
                          <Box
                            //   mx={1}
                            sx={{ fontWeight: 'bold', marginLeft: '10px' }}
                            dangerouslySetInnerHTML={{
                              __html: dataCauHoi.ch_noidung,
                            }}
                          />
                        </FormLabel>
                        {dataCauHoi?.ch_loaicauhoi === 'mot' && (
                          <div style={{ marginLeft: '50px' }}>
                            {dataCauHoi.ch_dapan.map((dataDapAn, index) => (
                              <div key={index}>
                                <RadioGroup
                                  name="radio-buttons-group"
                                  value={values.selectValues[index]?.ch_idda}
                                  onChange={(e) => {
                                    let newSelect = values.selectValues;
                                    newSelect[idx] = {
                                      ch_idda: e.target.value,
                                      ch_id: dataCauHoi.ch_id,
                                    };
                                    console.log(newSelect);
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
                                      control={<Radio />}
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
                                    value={dataDapAnNhieu}
                                    control={<Checkbox />}
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
                  {/* </Stack> */}
                </Form>
              </FormikProvider>
            </Box>
          </Box>
        </Container>
      </Page>
    </>
  );
}
