import React, { useState, useEffect } from 'react';
import { PlusCircle, Users, UserPlus, Calendar, Trash2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'alimentacao', name: 'Alimentação', color: 'bg-orange-500' },
  { id: 'transporte', name: 'Transporte', color: 'bg-blue-500' },
  { id: 'saude', name: 'Saúde', color: 'bg-red-500' },
  { id: 'lazer', name: 'Lazer', color: 'bg-purple-500' },
  { id: 'moradia', name: 'Moradia', color: 'bg-green-500' },
  { id: 'educacao', name: 'Educação', color: 'bg-indigo-500' },
  { id: 'vestuario', name: 'Vestuário', color: 'bg-pink-500' },
  { id: 'outros', name: 'Outros', color: 'bg-gray-500' },
];

// Storage helper functions
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
};

function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  
  const [showSetup, setShowSetup] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [userName, setUserName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const user = storage.get('current-user');
      const account = storage.get('current-account');
      
      if (!user || !account) {
        setShowSetup(true);
        setLoading(false);
        return;
      }
      
      setCurrentUser(user);
      setAccountId(account);
      
      const storedUsers = storage.get(`users:${account}`);
      const storedExpenses = storage.get(`expenses:${account}`);
      
      setUsers(storedUsers || [user]);
      setExpenses(storedExpenses || []);
      
      setLoading(false);
    } catch (error) {
      setShowSetup(true);
      setLoading(false);
    }
  };

  const createAccount = () => {
    if (!userName.trim()) return;
    
    const newAccountId = `acc_${Date.now()}`;
    const newUser = {
      id: `user_${Date.now()}`,
      name: userName.trim(),
      createdAt: new Date().toISOString(),
    };
    
    storage.set('current-user', newUser);
    storage.set('current-account', newAccountId);
    storage.set(`users:${newAccountId}`, [newUser]);
    storage.set(`expenses:${newAccountId}`, []);
    
    setCurrentUser(newUser);
    setAccountId(newAccountId);
    setUsers([newUser]);
    setExpenses([]);
    setShowSetup(false);
  };

  const joinAccount = () => {
    if (!inviteCode.trim() || !userName.trim()) return;
    
    try {
      const targetAccountId = storage.get(`account:${inviteCode}`);
      if (!targetAccountId) {
        alert('Código de convite inválido!');
        return;
      }
      
      const newUser = {
        id: `user_${Date.now()}`,
        name: userName.trim(),
        createdAt: new Date().toISOString(),
      };
      
      const existingUsers = storage.get(`users:${targetAccountId}`) || [];
      const updatedUsers = [...existingUsers, newUser];
      
      storage.set('current-user', newUser);
      storage.set('current-account', targetAccountId);
      storage.set(`users:${targetAccountId}`, updatedUsers);
      
      setCurrentUser(newUser);
      setAccountId(targetAccountId);
      setUsers(updatedUsers);
      
      const storedExpenses = storage.get(`expenses:${targetAccountId}`);
      setExpenses(storedExpenses || []);
      
      setShowSetup(false);
    } catch (error) {
      alert('Erro ao entrar na conta. Tente novamente.');
    }
  };

  const generateInviteCode = () => {
    const code = `INV${Date.now().toString(36).toUpperCase()}`;
    storage.set(`account:${code}`, accountId);
    return code;
  };

  const handleGenerateInvite = () => {
    const code = generateInviteCode();
    const link = `${window.location.href}?invite=${code}`;
    navigator.clipboard.writeText(link);
    alert(`Link de convite copiado!\n\n${link}\n\nCódigo: ${code}`);
    setShowInvite(false);
  };

  const addExpense = () => {
    if (!description.trim() || !amount || !selectedCategory) {
      alert('Preencha todos os campos!');
      return;
    }
    
    const newExpense = {
      id: `exp_${Date.now()}`,
      description: description.trim(),
      amount: parseFloat(amount),
      category: selectedCategory,
      userId: currentUser.id,
      userName: currentUser.name,
      date: new Date().toISOString(),
    };
    
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    
    storage.set(`expenses:${accountId}`, updatedExpenses);
    
    setDescription('');
    setAmount('');
    setSelectedCategory('');
  };

  const deleteExpense = (expenseId) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== expenseId);
    setExpenses(updatedExpenses);
    storage.set(`expenses:${accountId}`, updatedExpenses);
  };

  const getMonthlyExpenses = () => {
    return expenses.filter(exp => {
      const expDate = new Date(exp.date).toISOString().slice(0, 7);
      return expDate === selectedMonth;
    });
  };

  const getCategorySummary = () => {
    const monthlyExpenses = getMonthlyExpenses();
    const summary = {};
    
    CATEGORIES.forEach(cat => {
      summary[cat.id] = {
        ...cat,
        total: 0,
      };
    });
    
    monthlyExpenses.forEach(exp => {
      if (summary[exp.category]) {
        summary[exp.category].total += exp.amount;
      }
    });
    
    return Object.values(summary);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Controle de Despesas</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seu Nome</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu nome"
              />
            </div>
            
            <button
              onClick={createAccount}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Criar Nova Conta
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Código de Convite</label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite o código"
              />
            </div>
            
            <button
              onClick={joinAccount}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Entrar em Conta Existente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categorySummary = getCategorySummary();
  const monthlyExpenses = getMonthlyExpenses();
  const totalMonth = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Controle de Despesas</h1>
              <p className="text-gray-600 mt-1">Olá, {currentUser.name}!</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowInvite(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <UserPlus size={20} />
                Convidar
              </button>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <Users size={20} className="text-gray-600" />
                <span className="text-gray-700 font-medium">{users.length} usuário(s)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Box 1: Formulário */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PlusCircle size={24} className="text-blue-600" />
              Nova Despesa
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Supermercado"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                        selectedCategory === cat.id
                          ? `${cat.color} text-white`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={addExpense}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Adicionar Despesa
              </button>
            </div>
          </div>

          {/* Box 2: Resumo por Categoria */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Resumo por Categoria</h2>
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-gray-600" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">Total do Mês</p>
              <p className="text-3xl font-bold text-blue-600">
                R$ {totalMonth.toFixed(2).replace('.', ',')}
              </p>
            </div>
            
            <div className="space-y-3">
              {categorySummary.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                    <span className="font-medium text-gray-700">{cat.name}</span>
                  </div>
                  <span className="font-bold text-gray-800">
                    R$ {cat.total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Box 3: Últimos Lançamentos */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Últimos Lançamentos</h2>
          
          <div className="space-y-2">
            {expenses.slice(0, 20).map(exp => {
              const category = CATEGORIES.find(c => c.id === exp.category);
              const date = new Date(exp.date);
              
              return (
                <div key={exp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-2 h-2 rounded-full ${category?.color}`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{exp.description}</p>
                      <p className="text-sm text-gray-500">
                        {exp.userName} • {date.toLocaleDateString('pt-BR')} às {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${category?.color} text-white`}>
                      {category?.name}
                    </span>
                    <span className="font-bold text-gray-800 min-w-[100px] text-right">
                      R$ {exp.amount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteExpense(exp.id)}
                    className="ml-4 text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
            
            {expenses.length === 0 && (
              <p className="text-center text-gray-500 py-8">Nenhuma despesa cadastrada ainda.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal Convite */}
      {showInvite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Convidar Usuário</h3>
            <p className="text-gray-600 mb-6">
              Gere um link de convite para adicionar outra pessoa (como sua esposa) à sua conta. 
              Vocês compartilharão a mesma base de despesas.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleGenerateInvite}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Gerar Link
              </button>
              <button
                onClick={() => setShowInvite(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;