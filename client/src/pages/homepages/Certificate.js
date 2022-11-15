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
import { fontWeight } from '@material-ui/system';

export default function Certificate() {
	const { id } = useParams();
	const [baiKiemTra, setBaiKiemTra] = useState({});
	const [dapAn, setDapAn] = useState([]);

	useEffect(() => {
		(async () => {
			const res = await getData(API_BASE_URL + `/api-v1/baikiemtra/${id}`);
			setBaiKiemTra(res.data);
			console.log(res.data.cauhoi);
		})();
	}, [id]);
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
							{/* <Stack direction="row" my={2} sx={{ width: '60rem' }}> */}
								{baiKiemTra?.cauhoi?.map((dataCauHoi, idx) => (
									<Box display="flex" p={1}>
										<FormControl>
											<FormLabel id="demo-radio-buttons-group-label" sx={{display: "inherit"}}>
												<Typography color="ActiveBorder" sx={{color: "red"}}>
													Câu hỏi {idx + 1}:
												</Typography>
												<Box
													//   mx={1}
                                                    sx={{ fontWeight: 'bold', marginLeft: "10px" }}
													dangerouslySetInnerHTML={{
														__html: dataCauHoi.ch_noidung,
													}}
												/>
											</FormLabel>
                                            {dataCauHoi?.ch_loaicauhoi === 'mot' &&
                                            (
                                                <div>
                                                    {dataCauHoi.ch_dapan.map((dataDapAn,index)=>(
                                                        <div key={index}>
                                                            <RadioGroup
                                                                aria-labelledby="demo-radio-buttons-group-label"
                                                                name="radio-buttons-group"
                                                            >
                                                                <FormControlLabel
                                                                    value={dataDapAn}
                                                                    control={<Radio />}
                                                                    label={dataDapAn}
                                                                />
											                </RadioGroup>
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                            }

                                            {dataCauHoi?.ch_loaicauhoi === 'nhieu' &&
                                            (
                                                <div>
                                                    {dataCauHoi.ch_dapan.map((dataDapAnNhieu,index)=>(
                                                        <div key={index}>
                                                          
                                                                <FormControlLabel
                                                                    value={dataDapAnNhieu}
                                                                    control={<Checkbox />}
                                                                    label={dataDapAnNhieu}
                                                                />
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                            }

											
										</FormControl>
									</Box>
								))}
							{/* </Stack> */}
						</Box>
					</Box>
				</Container>
			</Page>
		</>
	);
}
