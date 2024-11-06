import React from 'react';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
    },
    section: {
        flexGrow: 1,
    },
});

const Report = ({payment}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Amount: {payment.amount} BYN</Text>
                <Text>Code: {payment.code}</Text>
                <Text>Type: {payment.type == 'Оплата' ? 'Payment' : 'Charge'}</Text>
                <Text>Date: {payment.date}</Text>
            </View>
        </Page>
    </Document>
)

export default Report;
