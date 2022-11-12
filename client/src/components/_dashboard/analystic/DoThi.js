import {merge} from 'lodash';
// import {useState} from 'react';
import ReactApexChart from 'react-apexcharts';
// material
import {Card, CardHeader} from '@material-ui/core';
import {BaseOptionChart} from "../../charts";
import {fCurrency} from "../../../_helper/formatCurrentCy";
//

// ----------------------------------------------------------------------


export default function DoThi({theo_nam}) {
    // const [seriesData, setSeriesData] = useState('Year');

    // const handleChangeSeriesData = (event) => {
    //     setSeriesData(event.target.value);
    // };

    const chartOptions = merge(BaseOptionChart(), {
        xaxis: {
            categories: ['Một', 'Hai', 'Ba', 'Bốn', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười một', 'Mười hai']
        },
        tooltip: {
            y: {
                formatter: (val) => fCurrency(val)
            }
        }
    });

    return (
        <Card>
            <CardHeader
                title="Thống kê theo năm"
                // action={
                //     <TextField
                //         select
                //         fullWidth
                //         value={seriesData}
                //         SelectProps={{ native: true }}
                //         onChange={handleChangeSeriesData}
                //         sx={{
                //             '& fieldset': { border: '0 !important' },
                //             '& select': { pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2' },
                //             '& .MuiOutlinedInput-root': { borderRadius: 0.75, bgcolor: 'background.neutral' },
                //             '& .MuiNativeSelect-icon': { top: 4, right: 0, width: 20, height: 20 }
                //         }}
                //     >
                //         {CHART_DATA.map((option) => (
                //             <option key={option.year} value={option.year}>
                //                 {option.year}
                //             </option>
                //         ))}
                //     </TextField>
                // }
            />
            <ReactApexChart type="line" series={theo_nam} options={chartOptions} height={364}/>

        </Card>
    );
}
