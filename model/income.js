import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  emoji: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  outsource: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'income',
    enum: ['income'],
  }
}, {
  timestamps: true, 
});

const Income = mongoose.model('Income', incomeSchema);

export default Income;
