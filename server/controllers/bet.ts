import * as dotenv from 'dotenv';
import * as async from 'async';

import Bet from '../models/bet';
import User from '../models/user';
import Game from '../models/game';
import BaseCtrl from './base';

export default class BetCtrl extends BaseCtrl {
    model = Bet;
    // Insert
    insert = (req, res) => {
        const obj = new this.model(req.body);
        const amount = (obj.homeAmount > obj.awayAmount) ? obj.homeAmount : obj.awayAmount;
        async.series([
            function save() {
                obj.save(function(err) {});
            },
            User.findOneAndUpdate({userId: obj.userId }, {$inc: {wallet: -amount}}, {}),
            // Game.findOneAndUpdate({gameId: obj.gameId}), TODO FIX
        ], function (err) {
            if (err) {return console.error(err); }
            res.status(200);
        });
    }

    // Get the total number of unique users who have placed a bet on gameId
    // callback(err, result)
    // Returns
    //  {count: #}
    getUserCount (gameId, callback) {
        return this.model.aggregate([
            { $match: {
                gameId: gameId
            }},
            { $group: { // Group by userId
                _id: '$userId',
            }},
            { $group: { // count the number of unique users
                _id: null,
                count: {$sum: 1}
            }},
            { $project : { // get rid of the _id
                _id: 0,
                count: 1
            }}
        ], callback);
    }

    // Calculates the total for each pot for a specific game
    // callback(err, result)
    // Returns:
    //  { awayTotal: #, homeTotal: #}
    getPotTotals (gameId, callback) {
        return this.model.aggregate([
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
        ], callback);
    }

    // Gets the homeTotal and awayTotal for each user who has placed a bet
    // callback(err, result)
    // Returns:
    //  [{ userId: #, homeTotal: #, awayTotal: #}]
    getUserTotals (gameId, callback) {
        return this.model.aggregate([
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
        ], callback);
    }
}
