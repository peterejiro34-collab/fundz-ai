import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, Trash2, Brain } from 'lucide-react';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');
  const [aiTip, setAiTip] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('fundz-transactions');
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('fundz-transactions', JSON.stringify(transactions));
    generateAITip();
  }, [transactions]);

  const addTransaction = () => {
    if (!amount ||!description) return;
    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      description,
      type,
      date: new Date().toLocaleDateString()
    };
    setTransactions([newTransaction,...transactions]);
    setAmount('');
    setDescription('');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id!== id));
  };

  const balance = transactions.reduce((acc, t) =>
    t.type === 'income'? acc + t.amount : acc - t.amount, 0
  );

  const totalIncome = transactions.filter(t => t.type === 'income')
   .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions.filter(t => t.type === 'expense')
   .reduce((acc, t) => acc + t.amount, 0);

  const generateAITip = () => {
    if (transactions.length === 0) {
      setAiTip("Add your first transaction and I'll give you personalized money tips!");
      return;
    }
    if (balance < 0) setAiTip("You're spending more than you earn. Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.");
    else if (totalExpense > totalIncome * 0.7) setAiTip("Your expenses are 70%+ of income. Look for subscriptions to cancel this week.");
    else setAiTip("Great balance! Consider putting 20% of income into an emergency fund.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Brain className="w-10 h-10 text-emerald-400" />
          <h1 className="text-4xl font-bold">Fundz-AI</h1>
          <span className="text-sm bg-emerald-500/20 px-2 py-1 rounded">AI Budget Advisor</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <p className="text-slate-400 text-sm">Current Balance</p>
            <p className={`text-3xl font-bold ${balance >= 0? 'text-emerald-400' : 'text-red-400'}`}>
              ₦{balance.toLocaleString()}
            </p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <p className="text-slate-400 text-sm">Income</p>
            </div>
            <p className="text-3xl font-bold text-emerald-400">₦{totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <p className="text-slate-400 text-sm">Expenses</p>
            </div>
            <p className="text-3xl font-bold text-red-400">₦{totalExpense.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl mb-8">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-400">AI Insight</p>
              <p className="text-slate-300">{aiTip}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="number"
              placeholder="Amount ₦"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <button
              onClick={addTransaction}
              className="bg-emerald-500 hover:bg-emerald-600 rounded-lg px-4 py-2 font-semibold flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-2">
            {transactions.length === 0? (
              <p className="text-slate-500 text-center py-8">No transactions yet. Add one above!</p>
            ) : (
              transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${t.type === 'income'? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                      <DollarSign className={`w-4 h-4 ${t.type === 'income'? 'text-emerald-400' : 'text-red-400'}`} />
                    </div>
                    <div>
                      <p className="font-medium">{t.description}</p>
                      <p className="text-sm text-slate-500">{t.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-bold ${t.type === 'income'? 'text-emerald-400' : 'text-red-400'}`}>
                      {t.type === 'income'? '+' : '-'}₦{t.amount.toLocaleString()}
                    </p>
                    <button onClick={() => deleteTransaction(t.id)} className="text-slate-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}