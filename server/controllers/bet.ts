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
        async.waterfall([
            function saveObject(cbAsync) { // Save the bet
                obj.save(function saveCB(err, item) {
                    cbAsync(err, item);
                });
            },
            function updateUser(item, cbAsync) {
                User.findOneAndUpdate(
                    { _id: obj.userId },
                    { $inc: { wallet: -amount }},
                    function userCallback (err, user) {
                    cbAsync(err);
                });
            },
            function updateGame(cbAsync) { // Update the popularity and pots
                async.waterfall([
                    function gameUserCount(cbAsync1) {
                        Bet.aggregate([
                            { $match: { // Find the game
                                gameId: obj.gameId
                            }},
                            { $group: { // Group by the user
                                _id: '$userId',
                            }},
                            { $group: { // Count the groups to get the distinct count
                                _id: 1,
                                count: { $sum: 1 }
                            }},
                            {$project: { // format the output, remove the gameId
                                _id: 0,
                                count: 1
                            }}
                        ], function (err, userGameCount) {
                            cbAsync1(err, userGameCount[0].count);
                        });
                    },
                    function totalUserCount(userGameCount, cbAsync1) {
                        User.count(function (err, userTotCount) { // get the total user count
                            const popularity = userGameCount / userTotCount;
                            cbAsync1(err, popularity);
                        });
                    },
                    function update(pop, cbAsync1) {
                        Game.findOneAndUpdate(
                            { _id: obj.gameId},
                            { $inc: {awayPot: obj.awayAmount, homePot: obj.homeAmount}, $set: {popularity: pop}},
                            function (err, item) {
                                cbAsync1(err);
                            }
                        );
                    }
                ], function innerWaterFallCallback(err, results) {
                    cbAsync(err);
                });
            }
        ], function (err, result) {
            if (err) { console.error(err); }
            res.sendStatus(200);
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
