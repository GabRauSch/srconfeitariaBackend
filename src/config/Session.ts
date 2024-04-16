import session from 'express-session';

export const sessionConfig = session({
    name: "customName,NoAttackerCanGetThatI'mUsingExpress!",
    resave: true,
    saveUninitialized: false,
    secret: 'secretKEY',
})