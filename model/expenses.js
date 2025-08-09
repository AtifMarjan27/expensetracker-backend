import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'expense',
    enum: ['expense'],
  }
}, {
  timestamps: true, 
});

const Expenses = mongoose.model('Expenses', ExpenseSchema);

export default Expenses;
