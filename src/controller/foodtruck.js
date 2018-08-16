import mongoose from 'mongoose';
import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';

export default({ config, db }) => {
    let api = Router();


    // CRUD - Create Read Update Delete

    // '/v1/foodtruck/add' - Create
    api.post('/add', (req, res ) => {
      let newFoodTruck = new FoodTruck();
      newFoodTruck.name = req.body.name;
      newFoodTruck.foodtype = req.body.foodtype;
      newFoodTruck.avgcost = req.body.avgcost;
      newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;

      newFoodTruck.save(err => {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'FoodTruck created successfully.' });
      });
    });

    // '/v1/foodtruck' - Read
    api.get('/', (req, res) => {
      FoodTruck.find({}, (err, foodtrucks) => {
        if (err) {
          res.send(err);
        }
        res.json(foodtrucks);
      });
    });

    // '/v1/foodtruck/id' - Read 1
    api.get('/:id', (req, res) => {
      FoodTruck.findById(req.params.id, (err, foodtruck) => {
        if (err) {
          res.send(err);
        }
        res.json(foodtruck);
      });
    });

    // '/v1/foodtruck/:id' - Update Name
    api.put('/:id', (req, res) => {
      FoodTruck.findById(req.params.id, (err, foodtruck) => {
        if (err) {
          res.send(err);
        }
        foodtruck.name = req.body.name;
        foodtruck.save(err => {
          if (err) {
            res.send(err);
          }
          res.json({ message: "FoodTruck name updated." });
        });
      });
    });

    // '/v1/foodtruck/geo/:id' - Update Coordinates
    api.put('/geo/:id', (req, res) => {
      FoodTruck.findById(req.params.id, (err, foodtruck) => {
        if (err) {
          res.send(err);
        }
        foodtruck.geometry.coordinates = req.body.geometry.coordinates;
        foodtruck.save(err => {
          if (err) {
            res.send(err);
          }
          res.json({ message: "Coordinates updated." });
        });
      });
    });

    // '/v1/foodtruck/:id' - Delete
    api.delete('/:id', (req, res) => {
      FoodTruck.remove({
          _id: req.params.id
      }, (err, foodtruck) => {
        if (err) {
          res.send(err);
        }
      });
      Review.remove({
          foodtruck: req.params.id
      }, (err, review) => {
        if (err) {
          res.send(err);
        }
        res.json({ message: "FoodTruck and reviews successfully removed." });
      });
    });

    // Add review for a specific foodtruck id
    // '/v1/foodtruck/reviews/add/:id'
    api.post('/reviews/add/:id', (req, res) => {
      FoodTruck.findById(req.params.id, (err, foodtruck) => {
        if (err) {
          res.send(err);
        }
        let newReview = new Review();
        newReview.title = req.body.title;
        newReview.text = req.body.text;
        newReview.foodtruck = foodtruck._id;
        newReview.save((err, review) => {
          if (err) {
            res.send(err);
          }
          foodtruck.reviews.push(newReview);
          foodtruck.save(err => {
            if (err) {
              res.send(err);
            }
            res.json({ message: "Food truck review saved." });
          });
        });
      });
    });

    // Get reviews
    // '/v1/reviews'
    api.get('/reviews/read', (req, res) => {
      Reviews.find({}, (err, reviews) => {
        if (err) {
          res.send(err);
        }
        res.json(reviews);
      });
    });

    // get reviews for a specific food truck id
    // '/v1/foodtruck/reviews/:id'
    api.get('/reviews/:id', (req, res) => {
      Review.find({foodtruck: req.params.id}, (err, reviews) => {
        if (err) {
          res.send(err);
        }
        res.json(reviews);
      })
    })


    return api;
}
