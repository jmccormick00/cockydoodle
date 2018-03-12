import * as express from 'express';

import GameCtrl from './controllers/game';
import BetCtrl from './controllers/bet';
import UserCtrl from './controllers/user';
import Cat from './models/game';
import User from './models/user';

export default function setRoutes(app) {

  const router = express.Router();

  const gameCtrl = new GameCtrl();
  const betCtrl = new BetCtrl();
  const userCtrl = new UserCtrl();

  // Bets
  router.route('/bet').post(betCtrl.insert);
  router.route('/bet/positions/:id').get(betCtrl.positions);

  // Games
  router.route('/game').get(gameCtrl.getAll);
  router.route('/game/count').get(gameCtrl.count);
  router.route('/game').post(gameCtrl.insert);
  router.route('/game/:id').get(gameCtrl.get);
  router.route('/game/:id').put(gameCtrl.update);
  router.route('/game/:id').delete(gameCtrl.delete);
  router.route('/game/close/:id').put(gameCtrl.close);

  // Users
  router.route('/login').post(userCtrl.login);
  // router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  //router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);
  router.route('/leaderboard').get(userCtrl.getLeaderboard);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
