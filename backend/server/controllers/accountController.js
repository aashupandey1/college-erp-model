import AccountTransaction from "../models/AccountTransaction.js";

export const getTransactions = async (req, res) => {
  try {
    const transactions = await AccountTransaction.find().sort({ date: -1, createdAt: -1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch transactions" });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const transaction = await AccountTransaction.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create transaction" });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await AccountTransaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update transaction" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await AccountTransaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete transaction" });
  }
};
