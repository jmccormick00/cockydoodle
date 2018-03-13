import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as helmet from 'helmet';
import * as passport from 'passport';
import * as passportjwt from 'passport-jwt';

import User from './models/user';
import setRoutes from './routes';

const app = express();
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 3000));

// Use the helmet middleware
app.use(helmet());

// Set static folder
app.use('/', express.static(path.join(__dirname, '../public')));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup passport
const opts = {
  jwtFromRequest: passportjwt.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.SECRET_TOKEN
};
passport.use(new passportjwt.Strategy(opts, function(jwtPayload, done) {
  User.findById(jwtPayload.user._id, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
}));
app.use(passport.initialize());

// Set up mongodb
let mongodbURI;
if (process.env.NODE_ENV === 'test') {
  mongodbURI = process.env.MONGODB_TEST_URI;
} else {
  mongodbURI = process.env.MONGODB_URI;
  app.use(morgan('dev'));
}
mongoose.Promise = global.Promise;
const mongodb = mongoose.connect(mongodbURI);

mongodb
  .then((db) => {
    console.log('Connected to MongoDB');

    setRoutes(app, passport);

    app.get('/*', function(req, res) {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    if (!module.parent) {
      app.listen(app.get('port'), () => {
        console.log('Angular Full Stack listening on port ' + app.get('port'));
      });
    }

  })
  .catch((err) => {
    console.error(err);
});

export { app };
