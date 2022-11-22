import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getData} from "../../_helper/httpProvider";
import {API_BASE_URL} from "../../config/configUrl";
import MyCertificatePDF from "./MyCertificatePDF";


export default function MyCertficate() {
    const userid = useSelector(state => state.user.current?.fullname)
    const id = useSelector(state => state.user.current?.id)
    const [chungchi, setChungChi] = useState([]);
    useEffect(() => {
        (async () => {
            const res = await getData(API_BASE_URL + `/api-v1/chungchi?iduser=${id}`);
            setChungChi(res.data)
        })()
    },[]);
    return (
      <>
          {
              chungchi.map((_cc, idx)=>{
                  return <>
                      <MyCertificatePDF chungchi={_cc}  userName={userid} />
                  </>
              })
          }

      </>
    );
}