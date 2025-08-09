import express from 'express'

import { AddExpense, Dashboard, DashboardData, getExpense } from '../controller/expenses.js';
const ExpenseRouter = express.Router()


ExpenseRouter.post('/add',AddExpense);
ExpenseRouter.get('/get',getExpense)
ExpenseRouter.get('/ex',Dashboard)
ExpenseRouter.get('/all',DashboardData)

export {ExpenseRouter}