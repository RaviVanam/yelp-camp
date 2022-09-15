const Campground = require('../models/campgrounds.js')
const { cloudinary } = require('../cloudinary')

module.exports.showAllCampgrounds = async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.showCreateCampground = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid data', 400)
    const newCampground = new Campground({ ...req.body.campground, author: req.user._id })
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    await newCampground.save()
    console.log(newCampground)
    req.flash('success', 'successfully created campground')
    res.redirect(`/campgrounds/${newCampground._id}`)
}


module.exports.editCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground)
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...images)
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'successfully updated campground')
    res.redirect(`/campgrounds/${id}`)
}


module.exports.showCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        }
    }).populate('author')

    if (!campground) {
        req.flash('error', `That campground doesn't exist`)
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}


module.exports.showEditCampgroud = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}


module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'successfully deleted campground')
    res.redirect('/campgrounds')
}
