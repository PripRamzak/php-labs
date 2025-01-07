import CryptoJS from 'crypto-js';

const secretKey = 'itiwp-big-boss'; 

export const encryptData = (data) => {
    const stringData = JSON.stringify(data);
    const encryptedData = CryptoJS.AES.encrypt(stringData, secretKey).toString(); 
    return encryptedData;
};

export const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
};