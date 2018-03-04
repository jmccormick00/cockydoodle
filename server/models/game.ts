import * as mongoose from 'mongoose';

// Define a game schema
const gameSchema = new mongoose.Schema({
    homeTeam: String,
    awayTeam: String,
    time: Date,
    location: String,
    popularity: { type: Number, default: 0 },
    awayScore: { type: Number, default: 0 },
    homeScore: { type: Number, default: 0 },
    status: { type: Boolean, default: 1 }, // open or closed
});

// Create a model
const Game = mongoose.model('Games', gameSchema);

export default Game;
