import * as dotenv from 'dotenv';
import * as async from 'async';
import * as mongoose from 'mongoose';

import Bet from '../models/bet';
import User from '../models/user';
import Game from '../models/game';
import BaseCtrl from './base';

export default class BetCtrl extends BaseCtrl {
    model = Bet;

    positions = (req, res) => {
        const userId = mongoose.Types.ObjectId(req.params.id);
        Bet.aggregate([
            { $match: { // Find the bets made by the user
                userId: userId
            }},
            { $group: { // Group by the gameId
                _id: '$gameId',
                homeTotal: { $sum: '$homeAmount' },
                awayTotal: { $sum: '$awayAmount' }
            }},
            { $lookup: { // join the games collection on the _id
                from: 'games',
                localField: '_id',
                foreignField: '_id',
                as: 'game'
            }},
            { $replaceRoot: { // merge the game data into the root object
                newRoot: { $mergeObjects: [ { $arrayElemAt: [ '$game', 0 ] }, '$$ROOT' ] } }
            },
            { $project: { // format the final output
                game: 0,
                _id: 0,
                popularity: 0,
                homePot: 0,
                awayPot: 0,
                time: 0,
                location: 0,
                __v: 0
            }}
        ], function positionsCB (err, docs) {
            if (err) { return console.error(err); }
            docs.forEach(element => {
                const winner = element.homeScore > element.awayScore;
                const betLean = element.homeTotal > element.awayTotal;
                if (!element.status) { // The game is closed out
                    if ((winner && betLean) || (!winner && !betLean)) {
                        element.win = 1;
                    } else {
                        element.win = 0;
                    }
                } else {
                    element.win = 0;
                }
            });
            res.status(200).json(docs);
          });
    }

    // Insert
    insert = (req, res) => {
        const obj = new this.model(req.body);
        if (obj.homeAmount !== 0 && obj.awayAmount !== 0)  {
            res.sendStatus(400);
        }
        obj.homeAmount = Math.abs(obj.homeAmount);
        obj.awayAmount = Math.abs(obj.awayAmount);
        const amount = (obj.homeAmount > obj.awayAmount) ? obj.homeAmount : obj.awayAmount;
        User.findById(obj.userId, function checkUsersWallet (error, user) {
            if (error) { console.log(error); }
            if (user.wallet < amount) { // make sure the user has enough to make the bet
                res.status(400).json({error: 'Not enough in the wallet.'});
                return;
            }
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
                        function userCallback (err, userU) {
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
