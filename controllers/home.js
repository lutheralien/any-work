exports.getHomePage = (req, res, next) => {
    res.render('home/index')
}
exports.getServices = (req, res, next) => {
    res.render('home/all-services')
}
exports.getBlog = (req, res, next) => {
    res.render('home/blog')
}
exports.getLiveChat = (req, res, next) => {
    res.render('home/live-chat')
}
exports.getRegisterPage = (req, res, next) => {
    res.render('home/register')
}
exports.getHelp = (req, res, next) => {
    res.render('home/help')
}
