import * as express from 'express';

import GameCtrl from './controllers/game';
import BetCtrl from './controllers/bet';
import UserCtrl from './controllers/user';

export default function setRoutes(app, passport) {

  const router = express.Router();

  const gameCtrl = new GameCtrl();
  const betCtrl = new BetCtrl();
  const userCtrl = new UserCtrl();

  // Bets
  router.post('/bet', passport.authenticate('jwt', { session: false}), betCtrl.insert);
  router.get('/bet/positions/:id', passport.authenticate('jwt', { session: false}), betCtrl.positions);

  // Games
  // router.route('/game/count').get(gameCtrl.count);
  // router.route('/game/:id').get(gameCtrl.get);
  // router.route('/game/:id').put(gameCtrl.update);
  // router.route('/game/:id').delete(gameCtrl.delete);
  router.get('/game', passport.authenticate('jwt', { session: false}), gameCtrl.getAll);
  router.post('/game', passport.authenticate('jwt', { session: false}), gameCtrl.insert);
  router.put('/game/close/:id', passport.authenticate('jwt', { session: false}), gameCtrl.close);

  // Users
  router.post('/login', userCtrl.login);
  router.get('/users/count', userCtrl.count);
  // router.post('/user', userCtrl.insert);
  router.get('/user/:id', passport.authenticate('jwt', { session: false}), userCtrl.get);

  // Leaderboard
  router.get('/leaderboard', passport.authenticate('jwt', { session: false}), userCtrl.getLeaderboard);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);
}
