import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart3,
  TrendingUp,
  PackageCheck,
  RotateCcw,
  Search,
  Sparkles,
  Image as ImageIcon,
  FolderTree,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  Download,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Filter,
  FileSpreadsheet,
  Moon,
  Sun,
  Layers,
  ChevronRight,
  ShieldCheck,
  Copy,
  Wand2,
  Sliders,
  RefreshCw,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  X,
  Check,
  Upload,
  Info,
  Car,
  Tag,
  ExternalLink,
  Cpu,
  Save,
  SlidersHorizontal,
  Eye,
  Lock,
  User,
  LogOut,
  Shield,
  Briefcase
} from 'lucide-react';

// --- DADOS INICIAIS DE EXEMPLO ---
const DEFAULT_PRODUCTS = [
  { id: 'p1', sku: 'KIT-CORREIA-01', name: 'Kit Correia Dentada + Tensionador 1.6 16v', dept: 'mecanica', sales: 25400.00, qty: 110, price: 230.90, date: '2026-11-01' },
  { id: 'p2', sku: 'BOMBA-AGUA-02', name: 'Bomba d\'Água Motor EA111', dept: 'mecanica', sales: 19800.00, qty: 74, price: 267.50, date: '2026-11-04' },
  { id: 'p3', sku: 'ALT-90A-12V', name: 'Alternador 90A 12V Réplica', dept: 'eletrica', sales: 18500.00, qty: 52, price: 355.70, date: '2026-10-28' },
  { id: 'p4', sku: 'BOB-IGN-1.0', name: 'Bobina de Ignição Flex 4 Pinos', dept: 'eletrica', sales: 10400.00, qty: 60, price: 173.30, date: '2026-11-06' },
  { id: 'p5', sku: 'CAPO-DIANT-PR', name: 'Capô Dianteiro Primer Hatch', dept: 'lataria', sales: 13200.00, qty: 22, price: 600.00, date: '2026-10-15' },
  { id: 'p6', sku: 'PARALAMA-DIR', name: 'Paralama Dianteiro Lado Direito', dept: 'lataria', sales: 6200.00, qty: 23, price: 269.50, date: '2026-11-02' },
  { id: 'p7', sku: 'TAPETE-BORR-01', name: 'Jogo de Tapetes Borracha Personalizado', dept: 'acabamentos', sales: 9400.00, qty: 150, price: 62.60, date: '2026-11-07' },
  { id: 'p8', sku: 'MANOPLA-CAMB-02', name: 'Manopla de Câmbio Esportiva Cromada', dept: 'acabamentos', sales: 5400.00, qty: 80, price: 67.50, date: '2026-11-08' }
];

const DEFAULT_RETURNS = [
  { id: 'r1', date: '2026-11-02', sku: 'BOMBA-AGUA-02', name: 'Bomba d\'Água Motor EA111', dept: 'mecanica', qty: 1, amount: 267.50, reason: 'Erro do Comprador', status: 'Reintegrado', notes: 'Comprado modelo errado.' },
  { id: 'r2', date: '2026-11-05', sku: 'PAST-FREIO-01', name: 'Jogo Pastilha Freio Dianteiro', dept: 'mecanica', qty: 2, amount: 189.00, reason: 'Defeito', status: 'Descartado', notes: 'Trinca na pastilha.' },
  { id: 'r3', date: '2026-11-08', sku: 'MANOPLA-CAMB-02', name: 'Manopla Câmbio Esportiva', dept: 'acabamentos', qty: 1, amount: 67.50, reason: 'Atraso na Entrega', status: 'Pendente', notes: 'Atraso na transportadora.' }
];

const DEFAULT_CATEGORIES = [
  { id: 'MLB26330', name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Motor > Correias', path: 'Mecânica > Motor' },
  { id: 'MLB193498', name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Ignição > Bobinas', path: 'Elétrica > Ignição' },
  { id: 'MLB412351', name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Lataria > Capôs', path: 'Lataria > Lataria Exterior' },
  { id: 'MLB181157', name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Habitáculo > Tapetes', path: 'Acabamentos > Interior' }
];

// --- COMPONENTE DE NAVEGAÇÃO REUTILIZÁVEL (NavItem corrigido) ---
function NavItem({ id, label, icon: Icon, active, setActive, badge }) {
  const isActive = active === id;
  return (
    <button
      onClick={() => setActive(id)}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
        <span>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
          isActive ? 'bg-white text-blue-600' : 'bg-slate-800 text-slate-300'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);

  // Estado de Autenticação
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ml_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Estados com persistência local
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ml_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [returnsList, setReturnsList] = useState(() => {
    const saved = localStorage.getItem('ml_returns');
    return saved ? JSON.parse(saved) : DEFAULT_RETURNS;
  });

  useEffect(() => {
    localStorage.setItem('ml_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ml_returns', JSON.stringify(returnsList));
  }, [returnsList]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ml_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ml_user');
    }
  }, [currentUser]);

  // Modais de Edição/Criação
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [editingReturn, setEditingReturn] = useState(null);

  // Filtros Globais / Dashboard
  const [periodFilter, setPeriodFilter] = useState('30');
  const [comparePeriod, setComparePeriod] = useState(false);

  // Logout
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // --- HANDLERS PRODUTOS ---
  const handleSaveProduct = (productData) => {
    if (productData.id) {
      setProducts(products.map(p => p.id === productData.id ? productData : p));
    } else {
      const newProd = { ...productData, id: 'p_' + Date.now(), sales: Number(productData.sales) || 0, price: Number(productData.price) || 0, qty: Number(productData.qty) || 0 };
      setProducts([newProd, ...products]);
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (currentUser?.role !== 'admin') {
      alert('Apenas administradores podem excluir peças.');
      return;
    }
    if (window.confirm('Tem certeza que deseja excluir esta peça?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // --- HANDLERS DEVOLUÇÕES ---
  const handleSaveReturn = (returnData) => {
    if (returnData.id) {
      setReturnsList(returnsList.map(r => r.id === returnData.id ? returnData : r));
    } else {
      const newReturn = { ...returnData, id: 'r_' + Date.now(), qty: Number(returnData.qty) || 1, amount: Number(returnData.amount) || 0 };
      setReturnsList([newReturn, ...returnsList]);
    }
    setIsReturnModalOpen(false);
    setEditingReturn(null);
  };

  const handleDeleteReturn = (id) => {
    if (currentUser?.role !== 'admin') {
      alert('Apenas administradores podem excluir devoluções.');
      return;
    }
    if (window.confirm('Excluir este registro de devolução?')) {
      setReturnsList(returnsList.filter(r => r.id !== id));
    }
  };

  // Exportar Devoluções em CSV
  const exportReturnsCSV = () => {
    const headers = ['ID', 'Data', 'SKU', 'Peça', 'Departamento', 'Qtd', 'Valor (R$)', 'Motivo', 'Status', 'Observações'];
    const rows = returnsList.map(r => [
      r.id, r.date, r.sku, `"${r.name}"`, r.dept, r.qty, r.amount, `"${r.reason}"`, r.status, `"${r.notes || ''}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `devolucoes_auto_pecas_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Restaurar Dados Originais
  const resetToDefaultData = () => {
    if (window.confirm('Deseja restaurar os dados de exemplo originais? Suas alterações salvas localmente serão substituídas.')) {
      setProducts(DEFAULT_PRODUCTS);
      setReturnsList(DEFAULT_RETURNS);
      localStorage.removeItem('ml_products');
      localStorage.removeItem('ml_returns');
    }
  };

  // SE NÃO ESTIVER LOGADO -> EXIBIR TELA DE LOGIN
  if (!currentUser) {
    return <LoginScreen onLogin={(user) => setCurrentUser(user)} darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} font-sans flex flex-col md:flex-row transition-colors duration-200`}>
      
      {/* BARRA LATERAL / NAVEGAÇÃO */}
      <aside className={`w-full md:w-64 border-b md:border-b-0 md:border-r ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex-shrink-0 flex flex-col justify-between`}>
        <div>
          {/* LOGO E USUÁRIO LOGADO */}
          <div className="p-5 border-b border-slate-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-400 p-2 rounded-xl text-slate-950 font-black shadow-lg shadow-amber-500/20">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-bold text-lg leading-tight tracking-tight text-amber-400">AutoPeças <span className="text-blue-400">ML</span></h1>
                  <p className="text-xs text-slate-400">Gestão e Otimização</p>
                </div>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white md:hidden"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* BADGE DE USUÁRIO */}
            <div className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 text-xs">
              <div className="flex items-center gap-2">
                {currentUser.role === 'admin' ? (
                  <Shield className="w-4 h-4 text-amber-400" />
                ) : (
                  <Briefcase className="w-4 h-4 text-blue-400" />
                )}
                <div>
                  <div className="font-semibold text-slate-200">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{currentUser.role === 'admin' ? 'Administrador' : 'Vendedor'}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                title="Sair do sistema"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* MENU NAVEGAÇÃO COM O NAVITEM CORRIGIDO */}
          <nav className="p-3 space-y-1">
            <NavItem id="dashboard" label="Dashboard & Departamentos" icon={BarChart3} active={activeTab} setActive={setActiveTab} />
            <NavItem id="returns" label="Controle Devoluções" icon={RotateCcw} active={activeTab} setActive={setActiveTab} badge={returnsList.length} />
            <NavItem id="pricing" label="Pesquisa de Preços" icon={Search} active={activeTab} setActive={setActiveTab} />
            <NavItem id="assistant" label="Assistente Títulos/IA" icon={Sparkles} active={activeTab} setActive={setActiveTab} />
            <NavItem id="photo" label="Editor Fundo Branco" icon={ImageIcon} active={activeTab} setActive={setActiveTab} />
            <NavItem id="categories" label="Auxiliar Categorias" icon={FolderTree} active={activeTab} setActive={setActiveTab} />
          </nav>
        </div>

        {/* RODAPÉ DA SIDEBAR */}
        <div className="p-4 border-t border-slate-800/50 hidden md:block">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              <span>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>

            <button 
              onClick={resetToDefaultData}
              title="Restaurar dados de exemplo"
              className="p-1.5 text-slate-500 hover:text-amber-400 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {activeTab === 'dashboard' && (
          <DashboardTab 
            products={products} 
            returnsList={returnsList} 
            periodFilter={periodFilter} 
            setPeriodFilter={setPeriodFilter} 
            comparePeriod={comparePeriod}
            setComparePeriod={setComparePeriod}
            currentUser={currentUser}
            onAddProduct={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            onEditProduct={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }}
            onDeleteProduct={handleDeleteProduct}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'returns' && (
          <ReturnsTab 
            returnsList={returnsList} 
            currentUser={currentUser}
            onAddReturn={() => { setEditingReturn(null); setIsReturnModalOpen(true); }}
            onEditReturn={(r) => { setEditingReturn(r); setIsReturnModalOpen(true); }}
            onDeleteReturn={handleDeleteReturn}
            onExportCSV={exportReturnsCSV}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'pricing' && <PricingTab products={products} darkMode={darkMode} />}

        {activeTab === 'assistant' && <AssistantTab darkMode={darkMode} />}

        {activeTab === 'photo' && <PhotoEditorTab darkMode={darkMode} />}

        {activeTab === 'categories' && <CategoriesTab categories={DEFAULT_CATEGORIES} darkMode={darkMode} />}
      </main>

      {/* MODAIS */}
      {isProductModalOpen && (
        <ProductModal 
          product={editingProduct} 
          onSave={handleSaveProduct} 
          onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
          darkMode={darkMode}
        />
      )}

      {isReturnModalOpen && (
        <ReturnModal 
          returnData={editingReturn} 
          products={products}
          onSave={handleSaveReturn} 
          onClose={() => { setIsReturnModalOpen(false); setEditingReturn(null); }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

// ==========================================
// TELA DE LOGIN & AUTENTICAÇÃO
// ==========================================
function LoginScreen({ onLogin, darkMode, setDarkMode }) {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedRole === 'admin') {
      if (password === '258012') {
        onLogin({ role: 'admin', name: 'Administrador ML' });
      } else {
        setErrorMsg('Senha incorreta para Administrador (Senha: 258012)');
      }
    } else {
      if (password === '123456') {
        onLogin({ role: 'vendedor', name: 'Vendedor ML' });
      } else {
        setErrorMsg('Senha incorreta para Vendedor (Senha: 123456)');
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'} flex flex-col items-center justify-center p-4`}>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-amber-400 p-3 rounded-2xl text-slate-950 shadow-xl shadow-amber-500/20 mb-2">
            <Car className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">AutoPeças <span className="text-blue-500">ML Suite</span></h1>
          <p className="text-sm text-slate-400">Sistema de Gestão e Otimização para Mercado Livre</p>
        </div>

        <div className={`p-6 md:p-8 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-2xl space-y-6`}>
          <div className="grid grid-cols-2 gap-2 bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50">
            <button
              type="button"
              onClick={() => { setSelectedRole('admin'); setPassword(''); setErrorMsg(''); }}
              className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                selectedRole === 'admin' 
                  ? 'bg-amber-400 text-slate-950 shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Administrador</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('vendedor'); setPassword(''); setErrorMsg(''); }}
              className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                selectedRole === 'vendedor' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Vendedor</span>
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Senha de Acesso ({selectedRole === 'admin' ? 'Senha: 258012' : 'Senha: 123456'})
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-sm transition-transform active:scale-95 shadow-lg ${
                selectedRole === 'admin'
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
              }`}
            >
              Entrar no Sistema ({selectedRole === 'admin' ? 'Acesso Total' : 'Acesso Vendas'})
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 space-y-1 text-center">
            <p><strong>Credenciais:</strong></p>
            <p>• Admin: <span className="font-mono text-amber-400">258012</span> | Vendedor: <span className="font-mono text-blue-400">123456</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CARD KPI REUTILIZÁVEL ---
function KpiCard({ title, value, subtext, icon: Icon, trend, trendGood = true, color, darkMode }) {
  return (
    <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-3 relative overflow-hidden`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className="p-2.5 rounded-xl bg-slate-800/80 text-amber-400">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-black tracking-tight font-mono">{value}</div>
        <div className="flex items-center justify-between mt-1 text-xs">
          <span className="text-slate-500">{subtext}</span>
          {trend && (
            <span className={`font-semibold ${trendGood ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO 1: DASHBOARD & DESEMPENHO
// ==========================================
function DashboardTab({ products, returnsList, periodFilter, setPeriodFilter, comparePeriod, setComparePeriod, currentUser, onAddProduct, onEditProduct, onDeleteProduct, darkMode }) {
  const totalSalesVolume = products.reduce((acc, p) => acc + Number(p.sales), 0);
  const totalQtySold = products.reduce((acc, p) => acc + Number(p.qty), 0);
  const ticketMedio = totalQtySold > 0 ? (totalSalesVolume / totalQtySold) : 0;
  
  const totalReturnVal = returnsList.reduce((acc, r) => acc + Number(r.amount), 0);
  const returnRate = totalSalesVolume > 0 ? ((totalReturnVal / totalSalesVolume) * 100).toFixed(1) : 0;

  const depts = {
    mecanica: { name: 'Mecânica', color: 'bg-blue-500', total: 0, items: 0 },
    eletrica: { name: 'Elétrica', color: 'bg-amber-500', total: 0, items: 0 },
    lataria: { name: 'Lataria', color: 'bg-red-500', total: 0, items: 0 },
    acabamentos: { name: 'Acabamentos', color: 'bg-emerald-500', total: 0, items: 0 }
  };

  products.forEach(p => {
    if (depts[p.dept]) {
      depts[p.dept].total += Number(p.sales);
      depts[p.dept].items += Number(p.qty);
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Desempenho de Vendas & Departamentos</h2>
          <p className="text-sm text-slate-400">Gerencie e edite os produtos, faturamento, ticket médio e devoluções em tempo real.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {['7', '30', '90', 'all'].map((period) => (
              <button
                key={period}
                onClick={() => setPeriodFilter(period)}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  periodFilter === period ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {period === 'all' ? 'Tudo' : `${period}d`}
              </button>
            ))}
          </div>

          <button
            onClick={() => setComparePeriod(!comparePeriod)}
            className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border font-medium transition-colors ${
              comparePeriod ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Comparar</span>
          </button>

          <button
            onClick={onAddProduct}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-amber-400/20 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Peça</span>
          </button>
        </div>
      </div>

      {comparePeriod && (
        <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-blue-300">Modo de Comparação Ativo</span>
              <p className="text-xs text-slate-400">Comparando período atual ({periodFilter} dias) com os {periodFilter} dias anteriores.</p>
            </div>
          </div>
          <div className="flex gap-4 font-mono text-xs">
            <span className="text-emerald-400 font-bold">+14.2% em faturamento</span>
            <span className="text-slate-400">|</span>
            <span className="text-red-400">-2.1% em devoluções</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Faturamento Total" value={`R$ ${totalSalesVolume.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} subtext="Base de vendas" icon={DollarSign} trend="+12%" darkMode={darkMode} />
        <KpiCard title="Ticket Médio" value={`R$ ${ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} subtext={`Por peça (${totalQtySold} un.)`} icon={ShoppingBag} trend="+5.4%" darkMode={darkMode} />
        <KpiCard title="Taxa de Devolução" value={`${returnRate}%`} subtext={`R$ ${totalReturnVal.toFixed(2)}`} icon={RotateCcw} trend="-0.8%" trendGood={true} darkMode={darkMode} />
        <KpiCard title="Peças Cadastradas" value={products.length} subtext="No inventário ativo" icon={PackageCheck} trend="+3 peças" darkMode={darkMode} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-1 p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
          <h3 className="font-bold text-lg flex items-center justify-between">
            <span>Vendas por Departamento</span>
            <Layers className="w-4 h-4 text-slate-500" />
          </h3>

          <div className="space-y-4">
            {Object.entries(depts).map(([key, dept]) => {
              const pct = totalSalesVolume > 0 ? ((dept.total / totalSalesVolume) * 100).toFixed(1) : 0;
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{dept.name}</span>
                    <span className="font-mono text-slate-400">R$ {dept.total.toLocaleString('pt-BR')} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full ${dept.color} transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`lg:col-span-2 p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Ranking & Edição de Peças</h3>
            <span className="text-xs text-slate-400 font-mono">{products.length} itens</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase font-semibold">
                  <th className="pb-3">SKU / Peça</th>
                  <th className="pb-3">Departamento</th>
                  <th className="pb-3 text-right">Preço Un.</th>
                  <th className="pb-3 text-right">Vendas Totais</th>
                  <th className="pb-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {products.map((p) => (
                  <tr key={p.id} className="group hover:bg-slate-800/30 transition-colors">
                    <td className="py-3">
                      <div className="font-semibold text-slate-200">{p.name}</div>
                      <div className="text-xs font-mono text-slate-500">{p.sku}</div>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                        p.dept === 'mecanica' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        p.dept === 'eletrica' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        p.dept === 'lataria' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {p.dept}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-slate-300">R$ {Number(p.price).toFixed(2)}</td>
                    <td className="py-3 text-right font-mono font-bold text-amber-400">R$ {Number(p.sales).toLocaleString('pt-BR')}</td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100">
                        <button onClick={() => onEditProduct(p)} className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="Editar">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {currentUser?.role === 'admin' && (
                          <button onClick={() => onDeleteProduct(p.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Excluir">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO 2: CONTROLE DE DEVOLUÇÕES
// ==========================================
function ReturnsTab({ returnsList, currentUser, onAddReturn, onEditReturn, onDeleteReturn, onExportCSV, darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const filteredReturns = returnsList.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'all' || r.dept === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Controle de Devoluções (Logística Reversa)</h2>
          <p className="text-sm text-slate-400">Registre e acompanhe os motivos de devolução.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onExportCSV} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-sm font-medium border border-slate-700 transition-colors">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>

          <button onClick={onAddReturn} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-amber-400/20">
            <Plus className="w-4 h-4" />
            <span>Nova Devolução</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Pesquisar devoluções..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300'} focus:outline-none focus:border-blue-500`}
          />
        </div>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className={`px-3 py-2 rounded-xl text-sm border ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-300'}`}
        >
          <option value="all">Todos os Departamentos</option>
          <option value="mecanica">Mecânica</option>
          <option value="eletrica">Elétrica</option>
          <option value="lataria">Lataria</option>
          <option value="acabamentos">Acabamentos</option>
        </select>
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Data</th>
                <th className="p-4">Peça / SKU</th>
                <th className="p-4">Qtd</th>
                <th className="p-4">Valor Total</th>
                <th className="p-4">Motivo</th>
                <th className="p-4">Status Estoque</th>
                <th className="p-4">Observações</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">Nenhum registro encontrado.</td>
                </tr>
              ) : (
                filteredReturns.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-400">{item.date}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-200">{item.name}</div>
                      <div className="text-xs font-mono text-slate-500">{item.sku}</div>
                    </td>
                    <td className="p-4 font-mono">{item.qty}</td>
                    <td className="p-4 font-mono font-bold text-amber-400">R$ {Number(item.amount).toFixed(2)}</td>
                    <td className="p-4">
                      <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">{item.reason}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        item.status === 'Reintegrado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        item.status === 'Descartado' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-400 max-w-xs truncate">{item.notes || '-'}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onEditReturn(item)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {currentUser?.role === 'admin' && (
                          <button onClick={() => onDeleteReturn(item.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO 3: PESQUISA DE PREÇOS (Placeholder funcional)
// ==========================================
function PricingTab({ products, darkMode }) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Pesquisa de Preços & Concorrência</h2>
        <p className="text-sm text-slate-400">Monitore os preços de mercado para manter seus anúncios competitivos.</p>
      </div>
      <div className={`p-8 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} text-center space-y-4`}>
        <Search className="w-12 h-12 mx-auto text-blue-500 stroke-1" />
        <h3 className="text-lg font-bold">Módulo Ativo de Precificação</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">Seus itens cadastrados estão prontos para cruzamento de dados com o catálogo do Mercado Livre.</p>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO 4: ASSISTENTE DE TÍTULOS E IA (Placeholder funcional)
// ==========================================
function AssistantTab({ darkMode }) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Assistente de Títulos & Descrições IA</h2>
        <p className="text-sm text-slate-400">Gere títulos otimizados focados em conversão e SEO para autopeças.</p>
      </div>
      <div className={`p-8 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} text-center space-y-4`}>
        <Sparkles className="w-12 h-12 mx-auto text-amber-400 stroke-1" />
        <h3 className="text-lg font-bold">IA Pronta para Otimização</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">Insira o código OEM ou nome da peça para gerar títulos matadores de alta busca.</p>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO 5: EDITOR DE FOTOS (Fundo Branco Canvas)
// ==========================================
function PhotoEditorTab({ darkMode }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImageSrc(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.85;
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };
    img.src = imageSrc;
  }, [imageSrc, brightness, contrast]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `peca_ml_fundo_branco.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Editor de Fotos (Fundo Branco Canvas)</h2>
        <p className="text-sm text-slate-400">Adeque suas fotos aos padrões do Mercado Livre.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-5`}>
          <h3 className="font-bold text-slate-200">Controles da Imagem</h3>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Enviar Foto da Peça</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white cursor-pointer" />
          </div>

          <div className="space-y-4 pt-3 border-t border-slate-800">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Brilho</span>
                <span className="font-mono text-slate-300">{brightness}%</span>
              </div>
              <input type="range" min="50" max="150" value={brightness} onChange={(e) => setBrightness(e.target.value)} className="w-full accent-blue-500" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Contraste</span>
                <span className="font-mono text-slate-300">{contrast}%</span>
              </div>
              <input type="range" min="50" max="150" value={contrast} onChange={(e) => setContrast(e.target.value)} className="w-full accent-blue-500" />
            </div>
          </div>

          <button onClick={handleDownload} disabled={!imageSrc} className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 font-bold text-slate-950 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg">
            <Download className="w-4 h-4" />
            <span>Baixar Imagem Otimizada</span>
          </button>
        </div>

        <div className={`lg:col-span-2 p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex flex-col items-center justify-center space-y-4`}>
          <span className="text-xs font-semibold text-slate-400">Pré-visualização (Fundo #FFFFFF)</span>
          <div className="border-2 border-dashed border-slate-700 rounded-2xl p-2 bg-slate-950 max-w-md w-full aspect-square flex items-center justify-center overflow-hidden">
            {imageSrc ? (
              <canvas ref={canvasRef} className="w-full h-full object-contain rounded-xl shadow-md" />
            ) : (
              <div className="text-center p-6 space-y-2 text-slate-500">
                <ImageIcon className="w-12 h-12 mx-auto stroke-1" />
                <p className="text-xs">Selecione uma foto no painel lateral.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO 6: AUXILIAR DE CATEGORIAS
// ==========================================
function CategoriesTab({ categories, darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Auxiliar de Categorias Mercado Livre</h2>
        <p className="text-sm text-slate-400">Consulte códigos oficiais de categorias.</p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
        <input
          type="text"
          placeholder="Digite o nome da peça..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300'} focus:outline-none focus:border-blue-500`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2`}>
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-semibold">{cat.id}</span>
              <button onClick={() => navigator.clipboard.writeText(cat.id)} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </button>
            </div>
            <h4 className="font-semibold text-sm text-slate-200">{cat.path}</h4>
            <p className="text-xs text-slate-400">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// MODAL: ADICIONAR / EDITAR PRODUTO
// ==========================================
function ProductModal({ product, onSave, onClose, darkMode }) {
  const [formData, setFormData] = useState(
    product || { sku: '', name: '', dept: 'mecanica', sales: 0, qty: 1, price: 0, date: new Date().toISOString().slice(0,10) }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-md p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-slate-900'} space-y-4 shadow-2xl`}>
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-lg">{product ? 'Editar Peça' : 'Cadastrar Nova Peça'}</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-medium">Nome da Peça</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium">SKU</label>
              <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
            </div>
            <div>
              <label className="text-slate-400 font-medium">Departamento</label>
              <select value={formData.dept} onChange={(e) => setFormData({ ...formData, dept: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white">
                <option value="mecanica">Mecânica</option>
                <option value="eletrica">Elétrica</option>
                <option value="lataria">Lataria</option>
                <option value="acabamentos">Acabamentos</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 font-medium">Preço (R$)</label>
              <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
            </div>
            <div>
              <label className="text-slate-400 font-medium">Estoque</label>
              <input type="number" value={formData.qty} onChange={(e) => setFormData({ ...formData, qty: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
            </div>
            <div>
              <label className="text-slate-400 font-medium">Vendas R$</label>
              <input type="number" step="0.01" value={formData.sales} onChange={(e) => setFormData({ ...formData, sales: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>
          </div>

          <div className="pt-3 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">Cancelar</button>
            <button type="submit" className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 font-bold text-slate-950 rounded-xl">Salvar Peça</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// MODAL: ADICIONAR / EDITAR DEVOLUÇÃO
// ==========================================
function ReturnModal({ returnData, products, onSave, onClose, darkMode }) {
  const [formData, setFormData] = useState(
    returnData || {
      date: new Date().toISOString().slice(0,10),
      sku: '',
      name: '',
      dept: 'mecanica',
      qty: 1,
      amount: 0,
      reason: 'Erro do Comprador',
      status: 'Pendente',
      notes: ''
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleSelectProduct = (sku) => {
    const found = products.find(p => p.sku === sku);
    if (found) {
      setFormData({
        ...formData,
        sku: found.sku,
        name: found.name,
        dept: found.dept,
        amount: found.price * formData.qty
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-md p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-slate-900'} space-y-4 shadow-2xl`}>
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-lg">{returnData ? 'Editar Devolução' : 'Registrar Devolução'}</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-medium">Selecionar Peça Cadastrada</label>
            <select onChange={(e) => handleSelectProduct(e.target.value)} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white">
              <option value="">-- Selecione uma peça --</option>
              {products.map(p => (
                <option key={p.id} value={p.sku}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-medium">Nome da Peça</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium">Data</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
            </div>
            <div>
              <label className="text-slate-400 font-medium">Valor Total (R$)</label>
              <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium">Motivo</label>
              <select value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white">
                <option value="Erro do Comprador">Erro do Comprador</option>
                <option value="Defeito">Defeito de Fabricação</option>
                <option value="Atraso na Entrega">Atraso na Entrega</option>
                <option value="Incompatibilidade">Incompatibilidade</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 font-medium">Status Estoque</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white">
                <option value="Reintegrado">Reintegrado ao Estoque</option>
                <option value="Descartado">Descartado</option>
                <option value="Pendente">Pendente de Análise</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-medium">Observações</label>
            <textarea rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
          </div>

          <div className="pt-3 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">Cancelar</button>
            <button type="submit" className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 font-bold text-slate-950 rounded-xl">Salvar Registro</button>
          </div>
        </form>
      </div>
    </div>
  );
}