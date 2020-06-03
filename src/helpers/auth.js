const helpers = {};

helpers.isAuthenticaded= (req, res, next) => {
    if(req.isAuthenticaded()){
        return next();
    }
    res.redirect('users/signin');
}

module.exports = helpers;