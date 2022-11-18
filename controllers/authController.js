const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const handleErrors = (err) => {
    const error = {
        email: '',
        password: ''
    }

    if (err.message === 'incorrect email') {
        error.email = "Email is incorrect"
        return error
    }
    if (err.message === 'incorrect password') {
        error.password = "Password is incorrect"
        return error
    }

    //This error occurs if email has already been used
    if (err.code === 11000) {
        error.email = "Email already exists"
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

        //Token generation
        const token = jwt.sign({ user: user._id }, 'TOKEN_SECRET', {
            expiresIn: '1d'
        })
        res.cookie('jwt', token);

        res.json({ user: user._id });
    } catch (err) {
        const processedErrorObject = handleErrors(err);
        res.json({ errors: processedErrorObject });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const token = jwt.sign({ user: user._id }, 'TOKEN_SECRET', {
                    expiresIn: '1d'
                })
                res.cookie('jwt', token);
        
                res.json({ user: user._id });
            } else {
                throw Error('incorrect password')
            }
        } else {
            throw Error('incorrect email')
        }
    } catch (err) {
        const processedErrorObject = handleErrors(err);
        res.json({ errors: processedErrorObject });
    }
}

const logoutUser = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect('/');
}

module.exports = {
    returnSignupPage,
    returnLoginPage,
    createUser,
    loginUser,
    logoutUser
}