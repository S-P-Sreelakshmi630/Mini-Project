const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User'); //Import User model


router.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.status(400).json({ message: info.message }); } //Send error message back
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json({ user });
        });
    })(req, res, next);
});


router.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.status(401).json({ message: info.message }); } //Send error message back
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json({ user });
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;