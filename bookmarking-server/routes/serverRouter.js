const express = require('express');
const router = express.Router();
const { login, userAuthentication, signup } = require('../controllers/auth-controller')
const {
    getRoot,
    createNewTab,
    createNewCategory,
    createNewMark,
    updateMark,
    deleteMark
} = require('../controllers/server-controller')

router.post('/login', login);
router.get('/', userAuthentication, getRoot);
router.post('/signup', signup);
router.post('/createNewTab', createNewTab);
router.post('/createNewCategory', createNewCategory);
router.post('/createNewMark', createNewMark);
router.post('/updateMark', updateMark);
router.post('/deleteMark', deleteMark);


module.exports = router;