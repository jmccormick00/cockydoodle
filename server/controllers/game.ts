import * as dotenv from 'dotenv';
import * as async from 'async';
import * as mongoose from 'mongoose';

import Game from '../models/game';
import User from '../models/user';
import Bet from '../models/bet';
import BetCtrl from '../controllers/bet';
import BaseCtrl from './base';

export default class GameCtrl extends BaseCtrl {
  model = Game;

    // Return only the games who start within the last 12 hours and beyond, sort by date
    getAll = (req, res) => {
      const dateToShow = new Date();
      // if (dateToShow.getHours() < 12) { // show previous day's games only if its before noon
      dateToShow.setDate(dateToShow.getDate() - 1);
      dateToShow.setHours(8, 0, 0); // the games are stored in UTC, so convert by 4 hours for noon
      console.log(dateToShow);
      this.model.find({time: {$gte: dateToShow}}, null, {sort: 'time'}, (err, docs) => {
        if (err) { return console.error(err); }
        res.status(200).json(docs);
      });
    }

  // Close out the game and pay the winners
  close = (req, res) => {
    const gameId = mongoose.Types.ObjectId(req.params.id);
    const homeScore = Number(req.body.homeScore);
    const awayScore = Number(req.body.awayScore);
    const winner = homeScore > awayScore; // 1 for home, 0 for away
    async.parallel({ // Run every function in this object in parallel
      update: function(callback) {
        // Update the game model, set the status to 0 and update the scores
        Game.findOneAndUpdate({ _id: gameId }, {
          $set: {
            status: 0,
            homeScore: homeScore,
            awayScore: awayScore
          }
        }, callback);
      },
      potTotals: function(callback) {
        // Calculate the pot totals [{ awayTotal: #, homeTotal: #}]
        Bet.aggregate([
          { $match: { // Find the bets with the gamId
              gameId: gameId
          }},
          { $group: { // Sum up the homeAmount/awayAmount by gameId
              _id: '$gameId',
              homeTotal: { $sum: '$homeAmount' },
              awayTotal: { $sum: '$awayAmount' }
          }},
          { $project: { // format the output, remove the gameId
              _id: 0,
              awayTotal: 1,
              homeTotal: 1
          }}
        ], function (err, result) {
          callback(err, result[0]);
        });
      },
      userTotals: function(callback) {
        // Calculate the user bet totals [{ userId: #, homeTotal: #, awayTotal: #}]
        Bet.aggregate([
          { $match: { // Find the game
              gameId: gameId
          }},
          { $group: { // Group by the user and total their bets
              _id: '$userId',
              homeTotal: { $sum: '$homeAmount' },
              awayTotal: { $sum: '$awayAmount' }
          }},
          { $project: { // Format the output
              _id: 0,
              userId: '$_id',
              awayTotal: 1,
              homeTotal: 1
          }}
        ], function (err, result) {
          callback(err, result);
        });
      }
    }, function createUserPayout(err, result) { // This function gets called when all parallel jobs are done
      if (err) {
        console.warn(err);
        res.sendStatus(400);
      }
      const updateOps = [];
      let payout = 0;
      let win = 0;
      let lose = 0;
      const potTotals = result.potTotals;
      let betLean = false; // this will determine which way the user bet, put more on home or away. 1 home, 0 away
      result.userTotals.forEach(element => {
        payout = 0;
        if (potTotals.awayTotal === 0) {  // prevent any division by zero
          potTotals.awayTotal = 0.000001;
        }
        if (potTotals.homeTotal === 0) { // Prevent any divions by zero
          potTotals.homeTotal = 0.000001;
        }
        betLean = element.homeTotal > element.awayTotal; // 1 home, 0 away
        if (winner) { // home won
          payout = potTotals.awayTotal * (element.homeTotal / potTotals.homeTotal) + element.homeTotal;
        } else { // away won
          payout = potTotals.homeTotal * (element.awayTotal / potTotals.awayTotal) + element.awayTotal;
        }
        payout = Math.round(payout);
        if ((winner && betLean) || (!winner && !betLean)) {
          win = 1;
          lose = 0;
        } else {
          win = 0;
          lose = 1;
        }
        // console.log("userId: " + element.userId + "  payout: " + payout);
        updateOps.push({
          'updateOne': {
            'filter': { '_id': element.userId },
            'update': { '$inc': { 'wallet': payout, 'winCount': win, 'lossCount': lose } }
          }
        });
      });
      if (updateOps.length > 0) {
        // console.log(updateOps);
        User.collection.bulkWrite(updateOps, { ordered: 0 }, function bulkCallback(error, r) { console.log(err); });
      }
      res.status(200).json({gameTotals: result, userUpdates: updateOps});
    });
  }

}
