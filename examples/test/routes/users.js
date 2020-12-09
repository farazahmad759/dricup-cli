
  var controller = require('../controllers/users');
  var express = require('express');
  var router = express.Router();

  router.post('/', controller.createOne);
  router.get('/:id', controller.getOne);
  router.put('/:id', controller.updateOne);
  router.delete('/:id', controller.deleteOne);
  router.get('/', controller.getAll);
  
  module.exports = router;
    
