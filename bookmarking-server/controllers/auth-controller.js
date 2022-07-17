const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userModul = require('../moduls/userModul');
const tabModul = require('../moduls/tabModul');
const categoryModul = require('../moduls/categoryModul');
const markModul = require('../moduls/markModul');


const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        let userIsEx = await userModul.findOne({ email: email }).select('+password')
        if (!userIsEx) {
            return res.json({ message: 'INVALID_CREDENTIALS' });
        }
        let isMatch = false;
        isMatch = await bcrypt.compare(password, userIsEx.password);
        if (!isMatch) {
            return res.json({ message: 'LOGGING_IN_FAILED' });
        } else {
            let token = userIsEx.generateAuthToken();
            let tabs = []
            tabs = await tabModul.find({ userId: userIsEx._id.toString() })
            let categories = []
            let marks = []
            if (tabs) {
                let tabIds = tabs.map(t => {
                    return t._id.toString()
                })

                categories = await categoryModul.find({ tabId: { $in: tabIds } })
                if (categories && categories.length > 0) {
                    let cateIds = categories.map(c => {
                        return c._id.toString()
                    })

                    marks = await markModul.find({ categoryId: { $in: cateIds } })
                }
                // res.cookie('x-auth-token', token ,{ maxAge: 900000, httpOnly: true })
                return res.status(200).json({
                    tabs: tabs,
                    categories: categories,
                    marks: marks,
                    token: token,
                    useId: userIsEx._id.toString()

                })

            } else {
                return res.status(200).json({
                    tabs: [],
                    categories: [],
                    marks: [],
                    token: token,

                })
            }
        }

    } catch (error) {
        console.log(error)
        return res.json({ message: 'SERVICE_UNAVAILABLE' });
    }
}

const userAuthentication = async (req, res, next) => {
    try {
        // get token from header
        const token = req.header("authToken");
        // authentication fails when user dont have a token.
        if (!token) {
            return res.status(401).json({ message: 'NO_TOKEN_PROVIDED' });
        }
        // authentication success, verify customerid and return it
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModul.findOne({ _id: userId })
        req.user = user;
        req.authenticated = true;
        if (user) {
            // contune to login or getroot router .
            next();
        } else {
            return res.status(404).json({ message: 'INVALID_TOKEN', status: false });
        }
    }
    catch (error) {
        return res.status(403).json({ message: 'INVALID_TOKEN', status: false });
    }
}


const signup = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const isExUser = await userModul.find({ email })
        if (isExUser.length > 0) {
            res.json({ message: 'User Is Existing' })
        } else {
            let hashPassword;
            hashPassword = await bcrypt.hashSync(password, 12);

            const newUser = new userModul({
                email,
                password: hashPassword
            })
            const createdUser = await newUser.save()
            if (createdUser) {
                let token = createdUser.generateAuthToken();
                let tabs = []
                let categories = []
                let marks = []
                const defaultTab = new tabModul({
                    title: 'Default',
                    description: 'Default tab, Google, facebook, gamel, twitter',
                    color: '#FFD700',
                    userId: createdUser._id.toString()
                })
                const createdTab = await defaultTab.save();
                if (createdTab) {
                    tabs.push(createdTab)
                    const socialMediaCategory = new categoryModul({
                        title: 'Social Media',
                        description: 'Facebook and twitter',
                        color: '#FF6347',
                        tabId: createdTab._id.toString()
                    })
                    const googleCategory = new categoryModul({
                        title: 'Google',
                        description: 'google and gmail',
                        color: '#FFB6C1',
                        tabId: createdTab._id.toString()
                    })

                    const createdSocialMediaCategory = await socialMediaCategory.save();
                    const createdGoogleCategory = await googleCategory.save();
                    if (createdGoogleCategory) {
                        categories.push(createdGoogleCategory)
                        const googleMark = new markModul({
                            title: 'Google',
                            description: 'Google website',
                            url: 'https://google.com',
                            color: '#E9967A',
                            categoryId: createdGoogleCategory._id.toString()
                        })
                        const gmailMark = new markModul({
                            title: 'Gmail',
                            description: 'gmail app website',
                            url: 'https://gmail.com',
                            color: '#FFA07A',
                            categoryId: createdGoogleCategory._id.toString()
                        })
                        const createdGoogleMark = await googleMark.save();
                        const createdGmaileMark = await gmailMark.save();
                        if (createdGoogleMark) {
                            marks.push(createdGoogleMark)
                        }
                        if (createdGmaileMark) {
                            marks.push(createdGmaileMark)
                        }
                    }
                    if (createdSocialMediaCategory) {
                        categories.push(createdSocialMediaCategory)
                        const facebookeMark = new markModul({
                            title: 'Facebook',
                            description: 'Facebook app website',
                            url: 'https://facebook.com',
                            color: '#C71585',
                            categoryId: createdSocialMediaCategory._id.toString()
                        })
                        const twitterMark = new markModul({
                            title: 'Twitter',
                            description: 'Google app website',
                            url: 'https://twitter.com/',
                            color: '#DB7093',
                            categoryId: createdSocialMediaCategory._id.toString()
                        })
                        const createdFacebookMark = await facebookeMark.save();
                        const createdTwitterMark = await twitterMark.save();
                        if (createdFacebookMark) {
                            marks.push(createdFacebookMark)
                        }
                        if (createdTwitterMark) {
                            marks.push(createdTwitterMark)
                        }
                    }
                }

                return res.status(200).json({
                    token: token,
                    tabs: tabs,
                    categories: categories,
                    marks: marks,
                    userId : createdUser._id.toString()
                })
            }else{
                return res.json({ message: "Network error" });
            }
        }
    } catch (error) {
        console.log(error)
        return res.json({ message: "Network error" });
    }
}

exports.login = login
exports.signup = signup
exports.userAuthentication = userAuthentication