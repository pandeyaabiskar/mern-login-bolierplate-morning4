const User = require('../models/User');

const handleErrors = (err) => {
    const error = {
        email: '',
        password: ''
    }

    if (err._message === 'User validation failed') {
        if (err.errors.email) {
            error.email = err.errors.email.properties.message
        }
        if (err.errors.password) {
            error.password = err.errors.password.properties.message
        }
    }


    return error

}

const returnSignupPage = (req, res) => {
    res.render('signup');
}

const returnLoginPage = (req, res) => {
    res.render('login');
}

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.json({user: user._id})
    } catch (err) {
        const processedErrorObject = handleErrors(err);
        res.json({errors: processedErrorObject})
    }
}

const loginUser = (req, res) => {
    //Code
}

const logoutUser = (req, res) => {
    
}

module.exports = {
    returnSignupPage,
    returnLoginPage,
    createUser,
    loginUser,
    logoutUser
}