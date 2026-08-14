import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Plus, Shield, CreditCard, ArrowLeftRight, Clock, CheckCircle, XCircle, Brain } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const CARD_BRANDS = ['Amazon', 'iTunes', 'Steam', 'Google Play', 'Walmart', 'Sephora', 'Nike'];
const CARD_RATES = { 'Amazon': 0.82, 'iTunes': 0.80, 'Steam': 0.85, 'Google Play': 0.78, 'Walmart': 0.83, 'Sephora': 0.75, 'Nike': 0.80 };

export default function App() {
  const [view, setView] = useState('dashboard'); // dashboard, sell, marketplace
  const [wallet, setWallet] = useState(0);
  const [pending, setPending] = useState(0);
  const [myCards, setMyCards] = useState([]);
  const [marketCards, setMarketCards] = useState([
    { id: 101, brand: 'Amazon', value: 100, rate: 0.82, seller: 'User***23', status: 'active' },
    { id: 102, brand: 'Steam', value: 50, rate: 0.85, seller: 'User***89', status: 'active' }
  ]);

  // Sell Form State
  const [sellBrand, setSellBrand] = useState('Amazon');
  const [sellValue, setSellValue] = useState('');
  const [sellCode, setSellCode] = useState('');
  const [aiTip, setAiTip] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('fundz-giftcards');
    if (saved) {
      const data = JSON.parse(saved);
      setWallet(data.wallet || 0);
      setMyCards(data.myCards || []);
      setPending(data.pending || 0);
    }
    generateAITip();
  }, []);

  useEffect(() => {
    localStorage.setItem('fundz-giftcards', JSON.stringify({ wallet, myCards, pending }));
    generateAITip();
  }, [wallet, myCards, pending]);

  const generateAITip = () => {
    if (myCards.some(c => c.status === 'pending')) {
      setAiTip("Your card is being verified. Never share card codes via WhatsApp or Telegram. Only trade on Fundz-AI.");
      return;
    }
    setAiTip("Pro tip: Amazon & Steam cards get the best rates in Nigeria right now. Check rates before listing.");
  };

  const calculatePayout = () => {
    const rate = CARD_RATES[sellBrand] || 0.8;
    return (parseFloat(sellValue) || 0) * rate;
  };

  const listCard = () => {
    if (!sellValue ||!sellCode || parseFloat(sellValue) < 10) {
      toast.error("Enter valid card value $10+ and code");
      return;
    }
    const newCard = {
      id: Date.now(),
      brand: sellBrand,
      value: parseFloat(sellValue),
      code: sellCode,
      rate: CARD_RATES[sellBrand],
      payout: calculatePayout(),
      status: 'pending',
      date: new Date().toLocaleDateString('en-NG')
    };
    setMyCards([newCard,...myCards]);
    setPending(pending + newCard.payout);
    setSellValue('');
    setSellCode('');
    toast.success("Card submitted! We'll verify it in 5-15 mins");
    setView('dashboard');
  };

  const buyCard = (card) => {
    if (wallet < card.value * card.rate) {
      toast.error("Insufficient wallet balance");
      return;
    }
    setWallet(wallet - card.value * card.rate);
    setMarketCards(marketCards.filter(c => c.id!== card.id));
    toast.success(`${card.brand} $${card.value} card purchased! Code revealed in 'My Cards'`);
    setMyCards([{...card, status: 'purchased', code: 'XXXX-XXXX-XXXX-1234'},...myCards]);
  };

  const withdraw = () => {
    if (wallet < 1000) {
      toast.error("Minimum withdrawal is ₦1,000");
      return;
    }
    toast.success(`₦${wallet.toLocaleString()} withdrawal requested. Bank transfer in 24hrs`);
    setWallet(0);
  };

  const StatusBadge = ({ status }) => {
    const config = {
      pending: { icon: Clock, text: 'Verifying', color: 'text-yellow-400 bg-yellow-500/20' },
      active: { icon: CheckCircle, text: 'Live', color: 'text-emerald-400 bg-emerald-500/20' },
      sold: { icon: CheckCircle, text: 'Sold', color: 'text-blue-400 bg-blue-500/20' },
      rejected: { icon: XCircle, text: 'Rejected', color: 'text-red-400 bg-red-500/20' },
      purchased: { icon: CheckCircle, text: 'Purchased', color: 'text-purple-400 bg-purple-500/20' }
    };
    const { icon: Icon, text, color } = config[status] || config.pending;
    return <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${color}`}><Icon className="w-3 h-3" />{text}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 md:p-8">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-10 h-10 text-emerald-400" />
            <h1 className="text-4xl font-bold">Fundz-AI</h1>
            <span className="text-sm bg-emerald-500/20 px-2 py-1 rounded">Gift Card Exchange</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-lg ${view === 'dashboard'? 'bg-emerald-500' : 'bg-slate-800'}`}>Dashboard</button>
            <button onClick={() => setView('marketplace')} className={`px-4 py-2 rounded-lg ${view === 'marketplace'? 'bg-emerald-500' : 'bg-slate-800'}`}>Marketplace</button>
            <button onClick={() => setView('sell')} className={`px-4 py-2 rounded-lg ${view === 'sell'? 'bg-emerald-500' : 'bg-slate-800'}`}>Sell Card</button>
          </div>
        </div>

        {view === 'dashboard' && <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <p className="text-slate-400 text-sm">Available Wallet</p>
              </div>
              <p className="text-3xl font-bold text-emerald-400">₦{wallet.toLocaleString()}</p>
              <button onClick={withdraw} className="mt-3 text-sm bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded">Withdraw</button>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <p className="text-slate-400 text-sm">Pending Payouts</p>
              </div>
              <p className="text-3xl font-bold text-yellow-400">₦{pending.toLocaleString()}</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <p className="text-slate-400 text-sm">Cards Listed</p>
              </div>
              <p className="text-3xl font-bold text-blue-400">{myCards.length}</p>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl mb-8">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-emerald-400 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-400">AI Safety Tip</p>
                <p className="text-slate-300">{aiTip}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">My Gift Cards</h2>
            <div className="space-y-2">
              {myCards.length === 0? (
                <p className="text-slate-500 text-center py-8">No cards yet. Click "Sell Card" to list one!</p>
              ) : (
                myCards.map((c) => (
                  <div key={c.id} className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-bold">{c.brand} ${c.value}</p>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="text-sm text-slate-400">Rate: {c.rate * 100}% | Payout: ₦{c.payout?.toLocaleString()}</p>
                      {c.status === 'purchased' && <p className="text-xs text-emerald-400 mt-1">Code: {c.code}</p>}
                    </div>
                    <p className="text-sm text-slate-500">{c.date}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>}

        {view === 'sell' && (
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2"><Plus className="w-6 h-6" />Sell Gift Card</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Card Brand</label>
                <select value={sellBrand} onChange={(e) => setSellBrand(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 mt-1">
                  {CARD_BRANDS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400">Card Value USD</label>
                <input type="number" placeholder="100" value={sellValue} onChange={(e) => setSellValue(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 mt-1" />
              </div>
              <div>
                <label className="text-sm text-slate-400">Card Code / PIN</label>
                <input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" value={sellCode} onChange={(e) => setSellCode(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 mt-1" />
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Current Rate:</span>
                  <span className="font-bold text-emerald-400">{CARD_RATES[sellBrand] * 100}%</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-slate-300">You'll Receive:</span>
                  <span className="font-bold text-emerald-400">₦{calculatePayout().toLocaleString()}</span>
                </div>
              <button onClick={listCard} className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-lg px-4 py-3 font-semibold flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" /> List Card Securely
              </button>
              <p className="text-xs text-slate-500 text-center">Cards are verified in 5-15 mins. Payout after buyer confirms.</p>
            </div>
          </div>
        )}

        {view === 'marketplace' && (
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2"><TrendingUp className="w-6 h-6" />Marketplace</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketCards.map((c) => (
                <div key={c.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xl font-bold">{c.brand}</p>
                      <p className="text-slate-400">${c.value} Card</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-400">Price</p>
                      <p className="text-2xl font-bold text-emerald-400">₦{(c.value * c.rate * 750).toLocaleString()}</p>
                      <p className="text-xs text-slate-500">Rate: {c.rate * 100}%</p>
                    </div>
                    <button onClick={() => buyCard(c)} className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg font-semibold">Buy Now</button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Seller: {c.seller}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}