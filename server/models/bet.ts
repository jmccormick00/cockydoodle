import * as mongoose from 'mongoose';

// Define a bet schema
const betSchema = new mongoose.Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    homeAmount: { type: Number, default: 0 },
    awayAmount: { type: Number, default: 0 }
});

// Create a model
const Bet = mongoose.model('Bet', betSchema);

export default Bet;
