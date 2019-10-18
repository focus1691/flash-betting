const router = require('express').Router();

router.use('/betfair', require('./betfair'));

module.exports = router;