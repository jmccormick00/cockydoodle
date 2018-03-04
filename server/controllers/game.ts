import * as dotenv from 'dotenv';

import * as async from 'async';

import Game from '../models/game';
import User from '../models/user';
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
          }}, {})
      ),
      potTotals: async.apply(BetCtrl.getPotTotals(gameId), {}),
      userTotals: async.apply(BetCtrl.getuserTotals(gameId), {})
    }, function createUserPayout(error, result) { // This function gets called when all parallel jobs are done
      var updateOps = [];
      var payout = 0;

      result.userTotals.array.forEach(element => {
        if(winner) { // home won
          payout = result.potTotals.awayTotal * (element.homeTotal / result.potTotals.homeTotal) + element.homeTotal;
        } else { // away won
          payout = result.potTotals.homeTotal * (element.awayTotal / result.potTotals.awayTotal) + element.awayTotal;
        }
        if(payout > 0) {
          updateOps.push({
            "updateOne": {
              "filter": { "_id": element.userId },
              "update": { "$inc": { "wallet": payout } }
            }
          });
        }
        });
        if (updateOps.length > 0) {
          User.collection.bulkWrite(updateOps, {ordered: 0}, function bulkCallback(err, r) {});
        }
      });
    }

      res.status(200).json({status: 200});
    });
  }
}
