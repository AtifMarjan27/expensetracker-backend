import Expenses from "../model/expenses.js";
import Income from '../model/income.js'


export async function AddExpense(req, res) {
  try {
    const { emoji, date, amount, category } = req.body;

    if (!emoji || !date || !amount || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newExpenses = new Expenses({
      emoji,
      date,
      amount,
      category,
    });

    await newExpenses.save();

    res.status(201).json({ message: "Income added successfully" });
  } catch (error) {
    console.error('Error adding income:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


export async function getExpense(req,res) {

  try{

      const expenses = await Expenses.find().sort({data:-1})
      if(!expenses){
       return res.status(404).json({meesage:"income not found"})
      }

      return res.status(200).json(expenses)

  }
  catch(error){
       console.error('Error adding income:', error);
    res.status(500).json({ message: 'Server error' });
  }
  
} 

export async function Dashboard(req, res) {
  try {
    const expense = await Expenses.aggregate([
      {
        $facet: {
          totalExpense: [
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$amount" }
              }
            },
            {
              $project: {
                _id: 0,
                totalExpense: "$totalAmount"
              }
            }
          ],
          Last30DaysExpenses:[
            {
          $match: {
            type: "expense",
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
         
        },
         {$sort:{createdAt:-1}},
         {$limit:10}
          ],
           RecentExpenses: [
            {
              $sort: { createdAt: -1 }
            },
            {
              $limit: 10
            },
            {
              $project: {
                _id: 1,
                emoji:1,
                amount: 1,
                category: 1,
                date: 1,
                type: 1
              }
            }
          ],
        RecentExpenseTransiction:[
         {$sort:{createdAt:-1}},
        {$limit:5},
        {$project:{
          _id:1,
          date:1,
          amount:1,
          category:1,
          emoji:1,
          type:1,
        }}
      ]

        }
      }
    ]);

    const income = await Income.aggregate([
     {$facet:{
      totalIncome:[
        {$group:{
          _id:null,
          totalAmount:{$sum:"$amount"}
        }
      },
      {$project:{
        _id:0,
        TotalIncome:"$totalAmount"
      }}
      ],
      RecentIncome:[
        {$sort:{createdAt:-1}},
        {$limit:10},
        {$project:{
          _id:1,
          emoji:1,
          date:1,
          outsource:1,
          type:1,
          amount:1
        }}

      ],
      Last60daysIncome:[
        {$match:{
          type: "income",
          date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }},
        {$sort:{createdAt:-1}},
        {$limit:4}

      ],
      RecentIncomeTransiction:[
         {$sort:{createdAt:-1}},
        {$limit:5},
        {$project:{
          _id:1,
          date:1,
          amount:1,
          category:"$outsource",
          emoji:1,
          type:1,
        }}
      ]
     }}
    ])

const totalIncome = income[0]?.totalIncome[0]?.TotalIncome || 0;
const totalExpense = expense[0]?.totalExpense[0]?.totalExpense || 0;

const totalBalance = totalIncome - totalExpense;

   const dashboardData = {
  totals: {
    totalIncome,
    totalExpense,
    totalBalance,
  },
  recentTransactions: [
    ...expense[0]?.RecentExpenseTransiction || [],
    ...income[0]?.RecentIncomeTransiction || [],
  ].sort((a, b) => new Date(b.date) - new Date(a.date)),
  recentIncome: income[0]?.RecentIncome || [],
  recentExpenses: expense[0]?.RecentExpenses || [],
  last30DaysExpenses: expense[0]?.Last30DaysExpenses || [],
  last60DaysIncome: income[0]?.Last60daysIncome || [],
};


    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
}


export async function DashboardData(req, res) {
  try {
    const income = await Income.find();
    const expense = await Expenses.find();

    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expense.reduce((sum, item) => sum + item.amount, 0);
    const totalBalance = totalIncome - totalExpense;

    const result = {
      totalIncome,
      totalExpense,
      totalBalance,
    };

const RecentTransiction = [...income, ...expense]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 5);

  const last30Days = new Date();
last30Days.setDate(last30Days.getDate() - 30);
  const Last30DayExpense = expense.filter((data)=>{ 
    const itemDate = new Date(data.date)
   return itemDate>=last30Days
  })
  const recent30DaysExpenses = Last30DayExpense
  .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first
  .slice(0, 5); 

    const DashboardData = [
   {
    totals: result,
    recentTransactions: RecentTransiction,
    recent30DaysExpenses: recent30DaysExpenses
  }
    ]
    res.json(DashboardData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error });
  }
}
