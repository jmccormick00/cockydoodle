import * as dotenv from 'dotenv';
import * as async from 'async';

import Game from '../models/game';
import User from '../models/user';
import Bet from '../models/bet';
import BetCtrl from '../controllers/bet';
import BaseCtrl from './base';

export default class GameCtrl extends BaseCtrl {
  model = Game;

  // Close out the game and pay the winners
  close = (req, res) => {
    const gameId = req.params.id;
    const homeScore = req.body.homeScore;
    const awayScore = req.body.awayScore;
    const winner = homeScore > awayScore; // 1 for home, 0 for away
    async.parallel({ // Run every function in this object in parallel
      update: async.apply(
        // Update the game model, set the status to 0 and update the scores
        this.model.update({ _id: gameId }, {
          $set: {
            status: 0,
            homeScore: homeScore,
            awayScore: awayScore
          }
        }, {})
      ),
      potTotals: async.apply( // Calculate the pot totals { awayTotal: #, homeTotal: #}
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
      ], {})),
      userTotals: async.apply( // Calculate the user bet totals [{ userId: #, homeTotal: #, awayTotal: #}]
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
      ], {}))
    }, function createUserPayout(error, result) { // This function gets called when all parallel jobs are done
      const updateOps = [];
      let payout = 0;
      let betLean = false; // this will determine which way the user bet, put more on home or away. 1 home, 0 away
      result.userTotals.array.forEach(element => {
        payout = 0;
        betLean = element.homeTotal > element.awayTotal;
        if (winner && betLean) { // home won
          payout = result.potTotals.awayTotal * (element.homeTotal / result.potTotals.homeTotal) + element.homeTotal;
        }
        if (!winner && !betLean) { // away won
          payout = result.potTotals.homeTotal * (element.awayTotal / result.potTotals.awayTotal) + element.awayTotal;
        }
        if (payout > 0) {
          updateOps.push({
            'updateOne': {
              'filter': { '_id': element.userId },
              'update': { '$inc': { 'wallet': payout, 'winCount': 1 } }
            }
          });
        } else {
          updateOps.push({
            'updateOne': {
              'filter': { '_id': element.userId },
              'update': { '$inc': { 'lossCount': 1 } }
            }
          });
        }
      });
      if (updateOps.length > 0) {
        User.collection.bulkWrite(updateOps, { ordered: 0 }, function bulkCallback(err, r) { });
      }
    });
    res.status(200).json({ status: 200});
  }

}
