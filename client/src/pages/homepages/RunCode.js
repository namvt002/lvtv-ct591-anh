import Page from "../../components/Page";
import {Box, Button, Card, Container, Grid} from "@material-ui/core";
import Editor from "@monaco-editor/react";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {API_BASE_URL} from "../../config/configUrl";
import {postData} from "../../_helper/httpProvider";
import arrowIosBackFill from "@iconify/icons-eva/arrow-ios-back-fill";
import {useNavigate} from "react-router-dom";
import {Icon} from '@iconify/react';

export default function RunCode() {
    const {code, lang, id} = useSelector(state => state.code);
    const [codeEditor, setCodeEditor] = useState(code);
    const [load, setLoad] = useState(1);

    // const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleEditorChange(value, event) {
        setCodeEditor(value);
    }

    const run = async () => {
        try {
            await postData(API_BASE_URL + `/api-v1/runcode`, {code: codeEditor, lang: lang, id: id});
            setLoad(e => e + 1)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        (async () => {
                try {
                    await postData(API_BASE_URL + '/api-v1/runcode', {code: code, lang: lang, id: id});
                    setLoad(e => e + 1)
                } catch (e) {
                    console.log(e)
                }
            }
        )()
    }, [code, lang, id])


    return <>
        <Page title="Run code">
            <Container>
                <Box sx={{height: '80vh'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={6}>
                            <Editor
                                width="96%"
                                defaultLanguage="html"
                                height="30rem"
                                value={code}
                                theme="vs-dark"
                                onChange={handleEditorChange}
                            />
                            <Box display='flex' justifyContent='space-between'>
                                <Button
                                    color="inherit"
                                    startIcon={<Icon icon={arrowIosBackFill}/>}
                                    onClick={() => navigate(-1)}
                                >
                                    Trở lại
                                </Button>
                                <Button variant='contained' sx={{m: 2}} onClick={() => run()}>Chạy</Button>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Card sx={{p: 2, height: '100%', width: '100%'}}>
                                <iframe
                                    key={load}
                                    style={{border: 'none', height: '100%', width: '100%'}}
                                    src={API_BASE_URL + `/api-v1/runcode?id=${id}`}/>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Page>
    </>
}