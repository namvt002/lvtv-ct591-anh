import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
import Logo from "../../../components/Logo";
import {formatDateTime} from "../../../_helper/formatDate";

// ----------------------------------------------------------------------

Font.register({
    family: 'Roboto',
    fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }]
});

const styles = StyleSheet.create({
    col4: { width: '25%' },
    col8: { width: '75%' },
    col6: { width: '50%' },
    mb8: { marginBottom: 8 },
    mb40: { marginBottom: 40 },
    overline: {
        fontSize: 8,
        marginBottom: 8,
        fontWeight: 700,
        letterSpacing: 1.2,
        textTransform: 'uppercase'
    },
    h1: { fontSize: 36, fontWeight: 700 },
    h3: { fontSize: 16, fontWeight: 700 },
    title: {marginTop: "10px"},
    wrapKhoaHoc: {marginTop: "60px"},
    h4: { fontSize: 13, fontWeight: 700 },
    body1: { fontSize: 10 },
    subtitle2: { fontSize: 9, fontWeight: 700 },
    alignRight: { textAlign: 'right' },
    page: {
        padding: '40px 24px 0 24px',
        fontSize: 9,
        lineHeight: 1.6,
        fontFamily: 'Roboto',
        backgroundColor: '#fff',
        textTransform: 'capitalize'
    },
    footer: {
        left: 0,
        right: 0,
        bottom: 0,
        padding: 24,
        margin: 'auto',
        borderTopWidth: 1,
        borderStyle: 'solid',
        position: 'absolute',
        borderColor: '#DFE3E8'
    },
    gridContainer: { flexDirection: 'row'},
    table: { display: 'flex', width: 'auto' },
    tableHeader: {},
    tableBody: {},
    tableRow: {
        padding: '8px 0',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#DFE3E8'
    },
    noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
    tableCell_1: { width: '5%' },
    tableCell_2: { width: '50%', paddingRight: 16 },
    tableCell_3: { width: '15%' }
});

// ----------------------------------------------------------------------

export default function MyInvoicePDF({chungchi,userName}) {

    let ngay = new Date();
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={[styles.gridContainer]}>
                    <Image source="/static/brand/code-optimization.png" style={{ height: 32, marginRight: "10px" }} />
                    <Text style={[styles.h3, styles.title]}>LearnCode</Text>
                </View>

                <View style={{ alignItems: 'right', flexDirection: 'column' }}>
                    <Text style={[styles.overline, styles.mb8]}>Đã hoàn thành khóa học {chungchi.kh_ten}</Text>
                </View>

                <View style={{ alignItems: 'right', flexDirection: 'column' }}>
                    <Text style={[styles.overline, styles.subtitle2, styles.wrapKhoaHoc]}>Cấp chứng chỉ</Text>
                    <Text style={[styles.overline, styles.h1]}>Khóa học {chungchi.kh_ten}</Text>
                </View>

                <View style={[styles.gridContainer]}>
                    <View style={styles.col8}>
                        <Text style={styles.h3}>{userName}</Text>
                        <Text style={styles.subtitle2}>Điểm: {chungchi.cc_diem} </Text>
                        <Text style={styles.subtitle2}>Ngày thi: {formatDateTime(chungchi.kh_create_at)}</Text>
                    </View>
                </View>
            </Page>
        </Document>

    );
}
