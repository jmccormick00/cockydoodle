import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';


import User from '../models/user';
import BaseCtrl from './base';

export default class UserCtrl extends BaseCtrl {
  model = User;

  getLeaderboard = (req, res) => {
    User.aggregate([
      {$sort: {wallet: -1}},
      {$limit: 10},
      {$project: {_id: 0, username: 1, wallet: 1}}
    ], function (err, docs) {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  }

  insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      if (item.referralEmail !== '') {
        User.findOneAndUpdate({ email: item.referralEmail }, {
          $inc: {wallet: 20}
        }, function (err1) {});
      }
      res.status(200).json(item);
    });
  }

  login = (req, res) => {
    this.model.findOne({ email: req.body.email }, (err, user) => {
      if (!user) { return res.sendStatus(403); }
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (!isMatch) { return res.sendStatus(403); }
        const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
        res.status(200).json({ token: token });
      });
    });
  }

}
