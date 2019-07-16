const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const multer = require('multer');
// const ejs = require('ejs');
// const path = require('path');

// router.get("/pics", express.static(path.join(__dirname, "./public/uploads")));

// //storage engine
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, __dirname, "./public/uploads");
//   },
//   filename: function(res, file, cb) {
//     cb(
//       null,
//       file.fieldname + '-' + Date.now() + path.extname(file.originalname)
//     );
//   }
// });

// const upload = multer({ storage: storage});


const Recipes = require('../models/recipe-model');


//get pics
// router.get("/recipeImg-1563093257359.jpg", (req, res) => {
//   res.sendFile(path.join(__dirname, "./public/uploads/recipeImg-1563093257359.jpg"));
// });
// upload.single('recipeImg'),

//Add Recipe
router.post('/', function(req, res) {
  // console.log(req.file);
  // const recipe = new Recipes();
  // recipe._id = new mongoose.Types.ObjectId();
  // recipe.name = req.body.name;
  // recipe.ingredients = req.body.ingredients;
  // recipe.instructions = req.body.instructions;
  // recipe.picture = req.body.picture;
  // recipe.description = req.body.description;
  // // recipe.recipeImg =  req.file.path
  // recipe.mealtype = req.body.mealtype;
  // recipe.breakfast = req.body.breakfast;
  // recipe.lunch = req.body.lunch;
  // recipe.dinner = req.body.dinner;
  // recipe.dessert = req.body.dessert;
  // recipe.snack = req.body.snack;
  // recipe.chef = req.body.chef;
console.log(req.body)

  // recipe.save(function(err) {
  //   if (err) {
  //     console.log(err);
  //     res.status(500).json(err);
  //   } else {
  //     res.status(200).json(recipe);
  //   }
  // });
});

//ES6 syntax, just incase mongo gets wierd.
// router.get('/', (req, res, next) => {
//   Recipes.find({}, function(err, recipes) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.status(200).json(recipes)
//     }
//   });
// });

//GET recipes
router.get('/', (req, res, next) => {
  Recipes.find()
    .populate('chef', 'name location')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        recipes: docs.map(doc => {
          return {
            name: doc.name,
            _id: doc._id,
            ingredients: doc.ingredients,
            instructions: doc.instructions,
            picture: doc.picture,
            // recipeImg: doc.recipeImg,
            description: doc.description,
            mealtype: doc.mealtype,
            meal_types: {
              breakfast: doc.breakfast,
              lunch: doc.lunch,
              dinner: doc.dinner,
              dessert: doc.dessert,
              snack: doc.snack
            },
            chef: doc.chef,
            // request: {
            //   type: 'GET',
            //   url: `https://chefportfoliopt4.herokuapp.com/recipes/${doc._id}`,
             
            // }
          };
        })
      };
      if (docs.length >= 0) {
        res.status(200).json(response);
      } else {
        res.status(200).json({ message: "We can't find that recipe" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//Get Specific Recipe
router.get('/:dishId', (req, res, next) => {
  const id = req.params.dishId;
  Recipes.findById(id)
    .select(
      'name ingredients instructions picture description mealtype breakfast lunch dinner dessert snack _id recipeImg chef'
    )
    .populate('chef', 'name location')
    .exec()
    .then(doc => {
      console.log('from database', doc);
      if (doc) {
        res.status(200).json({
          recipe: doc,
          request: {
            type: 'GET',
            description: 'GET one Chef by _id',
            url: 'https://chefportfoliopt4.herokuapp.com/recipes/' + doc._id
          }
        });
      } else {
        res.status(404).json({ message: 'no valid entry found for this id' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//UPDATE chef
router.put('/:dishId', function(req, res) {
  let dish = {};
  dish.name = req.body.name;
  dish.ingredients = req.body.ingredients;
  dish.description = req.body.description;
  dish.picture = req.body.picture;
  dish.instructions = req.body.instructions;
  dish.mealtype = req.body.mealtype;
  dish.chef = req.body.chef;

  let query = { _id: req.params.dishId };

  Recipes.updateOne(query, dish, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.status(201).json({ dish });
    }
  });
});

//UPDATE Chef using Patch
// router.patch("/:dishId", (req, res, next) => {
//   id = req.params.dishId;
//   const updateOps = {};
//   for (const ops of req.body) {
//     updateOps[ops.propName] = ops.value;
//   }
//   Recipes.update(
//     { _id: id },
//     {
//       $set: updateOps
//     }
//   )
//     .exec()
//     .then(res => {
//       console.log(result);
//       result.status(200).json({
//         message: "Recipe updated, Chef."
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

//Delete Recipe
router.delete('/:dishId', function(req, res) {
  let query = { _id: req.params.dishId };

  Recipes.remove(query, function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send('Recipe has been removed.');
    }
  });
});

module.exports = router;
