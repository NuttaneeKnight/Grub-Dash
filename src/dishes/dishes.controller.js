const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

//Vlidation Handler
//middleware to check if the dish has a name so we can move to 'create()' and update()
//it doesn't make sense if it doesn't have a name
function bodyHasName(req, res, next) {
  //deconstruc name from req.body
  const { data: { name } = {} } = req.body;
  //if the dish has a name, move req to the next()
  if (name) {
    res.locals.name = name;
    return next();
  } else {
    //if no name return obj with error status code and message
    next({
      status: 400,
      message: "Dish must include a name",
    });
  }
}

//middleware to check if the dish has description need it for create()&update()
function bodyHasDescription(req, res, next) {
  //deconstruct description from req.body
  const { data: { description } = {} } = req.body;
  //if there is description move to next()
  if (description) {
    res.locals.description = description;
    return next();
  } else {
    next({
      status: 400,
      message: "Dish must include a description",
    });
  }
}

//middleware to check if the dish has a price need it to move to create() and update()
function bodyHasPrice(req, res, next) {
  //deconstruct price from req.body
  const { data: { price } = {} } = req.body;
  //if there is price move to the next()
  if (price) {
    res.locals.price = price;
    return next();
  } else {
    // no price returns error message
    next({
      status: 400,
      message: "Dish must include a price",
    });
  }
}

//middleware to check if the price is more than 0 need it to move to create()
function bodyHasValidPrice(req, res, next) {
  //deconstruct price from req.body
  const { data: { price } = {} } = req.body;
  //if price is price >=0 move to next()
  if (price > -1) {
    res.locals.price = price;
    return next();
  } else {
    next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  }
}

//middleware to check if the dish price us valid for update()
function bodyHasValidPriceForUpdate(req, res, next) {
  //deconstruct price from req.body
  const { data: { price } = {} } = req.body;
  //if price is invalid or not an integer => retufn error status w/ message
  if (res.locals.price <= 0 || typeof res.locals.price !== "number") {
    next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  } else {
    //if price is not valid return error status
    return next();
  }
}

//middleware to check if the body has img for create()/update()
function bodyHasImg(req, res, next) {
  //deconstruct image_url from req.body
  const { data: { image_url } = {} } = req.body;
  //if there is img move to next()
  if (image_url) {
    res.locals.image_url = image_url;
    return next();
  } else {
    // else return error status code and message
    next({
      status: 400,
      message: "Dish must include a image_url",
    });
  }
}

//middleware to check if the dish exists or not by checking the dish.id need it for read() and update()
function dishExists(req, res, next) {
  const { dishId } = req.params;
  //create a variable for the dish that matched the dish's id
  const matchingDish = dishes.find((dish) => dish.id === dishId);
  //if the id match move to next()
  if (matchingDish) {
    res.locals.matchingDish = matchingDish;
    return next();
  } else {
    next({
      status: 404,
      message: `Dish does not exist: ${dishId}.`,
    });
  }
}

//middleware for checking the data id matches parameter's id for update()
function dishIdMatchesDataId(req, res, next) {
  const { data: { id } = {} } = req.body;
  const dishId = req.params.dishId;
  //check if id is defined ,not null, not a string, and not dishId
  if (id !== "" && id !== dishId && id !== null && id !== undefined) {
    next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  }
  return next();
}

//list() to list all dishes
function list(req, res) {
  res.json({
    data: dishes,
  });
}

//read() to read the particular dishId
function read(req, res) {
  //use dishId for req.params
  const dishId = req.params.dishId;
  //create variable for finding the dish with the matching id
  const matchingDish = dishes.find((dish) => dish.id === dishId);
  //return that dish's data
  res.json({ data: res.locals.matchingDish });
}

//create() -> post a new dish
function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  //dish{} for making an update request
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  //push the newDish into the array
  dishes.push(newDish);
  //send the status and the newDish obj
  res.status(201).json({ data: newDish });
}

// handler for update() dish's data
function update(req, res) {
  const dishId = req.params.dishId;
  //create a variable that finds the matching id for that dish that needs updating
  const matchingDish = dishes.find((dish) => dish.id === dishId);
  const { data: { name, description, price, image_url } = {} } = req.body;
  //use the variable to define the key value pair of the new dish
  matchingDish.description = description;
  matchingDish.name = name;
  matchingDish.price = price;
  matchingDish.image_url = image_url;
  //return the new dish's data
  res.json({ data: matchingDish });
}

module.exports = {
  list,
  read: [dishExists, read],
  create: [
    bodyHasName,
    bodyHasDescription,
    bodyHasPrice,
    bodyHasValidPrice,
    bodyHasImg,
    create,
  ],
  update: [
    dishExists,
    dishIdMatchesDataId,
    bodyHasName,
    bodyHasDescription,
    bodyHasPrice,
    bodyHasImg,
    bodyHasValidPriceForUpdate,
    update,
  ],
};
