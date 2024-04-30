const express = require("express");
const servicesController = require("../controllers/servicesController");

const jwtAuth = require("../middlewares/jwtAuth");
const adminMiddleware = require("../middlewares/adminMiddleware");



const router = express.Router();

router.route("/addservice").post(servicesController.AddServicesController);

// get services
router.route("/allservices").get(servicesController.GetServicesController);

// querying services
router.route("/search").get(servicesController.SearchServicesController);

// getting a service with id
router.route("/service/:id").get(servicesController.OneServiceController);

// updating services
router.route("/edit/:id").put(servicesController.UpdateServicesController);

// deleting services
router.route("/delete/:id").delete(servicesController.DeleteServicesController);


    
    


module.exports = router;