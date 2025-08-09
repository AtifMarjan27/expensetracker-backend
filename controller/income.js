import Income from "../model/income.js";



export async function AddIncome(req, res) {
  try {
    const { emoji, date, amount, outsource } = req.body;

    if (!emoji || !date || !amount || !outsource) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newIncome = new Income({
      emoji,
      date,
      amount,
      outsource,
    });

    await newIncome.save();

    res.status(201).json({ message: "Income added successfully" });
  } catch (error) {
    console.error('Error adding income:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


export async function getIncome(req, res) {
  try {
    const incomes = await Income.aggregate([
      {
        $project: {
          _id: 1,
          emoji: 1,
          date: 1,
          amount: 1,
          category: "$outsource", 
          type: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
        },
      },
    ]);

    if (!incomes || incomes.length === 0) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json(incomes);
  } catch (error) {
    console.error("Error getting income:", error);
    res.status(500).json({ message: "Server error" });
  }
}
