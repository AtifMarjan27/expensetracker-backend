import express from 'express'
import { AddIncome, getIncome } from '../controller/income.js'
const IncomeRouter = express.Router()


IncomeRouter.post('/add',AddIncome);
IncomeRouter.get('/get',getIncome)


export {IncomeRouter}