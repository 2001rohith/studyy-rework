import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBRr4m3BDRGaKzWoBK0-osh-ywnwksdrmA",
    authDomain: "studyy-project.firebaseapp.com",
    projectId: "studyy-project",
    storageBucket: "studyy-project.firebasestorage.app",
    messagingSenderId: "1085169705350",
    appId: "1:1085169705350:web:f3579b3c0d378d6057cc07",
    measurementId: "G-10VEGZLJS8"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const getDeviceToken = async () => {
    try {
        const token = await getToken(messaging, { vapidKey: 'BMgWqsbziWIUfgP5z3Mvi5g9NlUzl11En-ZgQXefkOYXZoVi1KGTwLT2icRRsuqWix-gN5EpJoWK0xoI7HbaOhE' });
        console.log('Device Token:', token);
        return token;
    } catch (error) {
        console.error('Error getting device token:', error);
        return null;
    }
};
