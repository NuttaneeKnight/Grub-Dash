const router = require("express").Router();
const controller = require('./dishes.controller');
const methodNotAllowed = require('../errors/methodNotAllowed')

// TODO: Implement the /dishes routes needed to make the tests pass

router
.route('/')
// make a get req that uses list()
.get(controller.list)
// make a post req to create a new dish with create()
.post(controller.create)
// for any other req that aren't available
.all(methodNotAllowed)

router.route('/:dishId')
//make a get req that uses read()
.get(controller.read)
//make put req that uses update() to update the dish
.put(controller.update)
//for any other method that isn't allowed
.all(methodNotAllowed)

module.exports = router;
