
const tabModul = require('../moduls/tabModul');
const categoryModul = require('../moduls/categoryModul');
const markModul = require('../moduls/markModul');
const mongoose = require('mongoose');
const getRoot = async (req, res, next) => {
    const user = req.user
    try {
        let tabs = []
        tabs = await tabModul.find({ userId: user._id.toString() })
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
            return res.status(200).json({
                tabs: tabs,
                categories: categories,
                marks: marks,
                userId: user._id.toString()
            })

        } else {
            return res.status(200).json({
                tabs: [],
                categories: [],
                marks: [],
                userId: user._id.toString()
            })
        }
    } catch (error) {
        console.log(error)
    }
    res.json({ message: 'getRoot Done!!!!' })
}


const createNewTab = async (req, res, next) => {
    const { title, description, color, userId } = req.body;
    try {
        const newTab = new tabModul({
            title,
            description,
            color,
            userId
        })
        const createdTab = await newTab.save()
        res.status(200).json(createdTab)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'SERVICE_UNAVAILABLE' })
    }
}

const createNewCategory = async (req, res, next) => {
    const { title, description, color, tabId } = req.body;
    try {
        const newCategory = new categoryModul({
            title,
            description,
            color,
            tabId
        })
        const createdCategory = await newCategory.save()
        res.status(200).json(createdCategory)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'SERVICE_UNAVAILABLE' })
    }
}

const createNewMark = async (req, res, next) => {
    const { title, description, url, color, categoryId } = req.body;
    try {
        const newMark = new markModul({
            title,
            description,
            color,
            url,
            categoryId
        })
        const createdMark = await newMark.save()
        res.status(200).json(createdMark)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'SERVICE_UNAVAILABLE' })
    }
}

const updateMark = async (req, res, next) => {
    const { _id, title, description, url, color } = req.body;
    try {
        const currentMark = await markModul.findById(mongoose.Types.ObjectId(_id))
        if (currentMark) {
            currentMark.title = title
            currentMark.description = description
            currentMark.url = url
            currentMark.color = color

            await markModul.findOneAndUpdate({ _id: _id },
                {
                    title: currentMark.title,
                    description: currentMark.description,
                    url: currentMark.url,
                    color: currentMark.color
                })
        }
        res.status(200).json(currentMark)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'SERVICE_UNAVAILABLE' })
    }
}

const deleteMark = async (req, res, next) => {
    const { _id } = req.body;
    try {
        await markModul.deleteOne({_id : mongoose.Types.ObjectId(_id)})
        res.status(200).json({id : _id})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'SERVICE_UNAVAILABLE' })
    }
}


exports.getRoot = getRoot
exports.createNewTab = createNewTab
exports.createNewCategory = createNewCategory
exports.createNewMark = createNewMark
exports.updateMark = updateMark
exports.deleteMark = deleteMark