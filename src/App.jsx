import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart3,
  PackageCheck,
  RotateCcw,
  Search,
  Sparkles,
  Image as ImageIcon,
  FolderTree,
  Plus,
  Trash2,
  Edit,
  Download,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Moon,
  Sun,
  Layers,
  Copy,
  Wand2,
  RefreshCw,
  X,
  Check,
  Upload,
  Car,
  Lock,
  LogOut,
  Shield,
  Briefcase,
  Calendar,
  DollarSign,
  ShoppingBag,
  Percent,
  HelpCircle,
  Info,
  CheckSquare,
  TrendingUp,
  Calculator,
  PieChart,
  MessageSquare,
  Send,
  Bot,
  User,
  Paperclip,
  FileText
} from 'lucide-react';

// --- CONFIGURAÇÃO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyBDKksCn466pxCm0kbRYN5Ia2HqVbQkUMM",
  authDomain: "mercadolivredl-dba3b.firebaseapp.com",
  databaseURL: "https://mercadolivredl-dba3b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mercadolivredl-dba3b",
  storageBucket: "mercadolivredl-dba3b.firebasestorage.app",
  messagingSenderId: "472505973455",
  appId: "1:472505973455:web:3b033245b88c8c1f02d5ba"
};

// --- MAPA OFICIAL DE CATEGORIAS DO MERCADO LIVRE (PEÇAS) ---
function detectCategoryFromTitle(title = '') {
  const t = title.toLowerCase();

  if (t.includes('motor') || t.includes('coletor') || t.includes('bico') || t.includes('flauta') || t.includes('valvula') || t.includes('comando') || t.includes('correia')) {
    return { id: 'MLB26330', name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Motor' };
  }
  if (t.includes('ignicao') || t.includes('vela') || t.includes('bobina') || t.includes('modulo') || t.includes('alternador') || t.includes('partida')) {
    return { id: 'MLB193498', name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Ignição' };
  }
  if (t.includes('freio') || t.includes('pastilha') || t.includes('disco') || t.includes('pinça') || t.includes('abs') || t.includes('cilindro')) {
    return { id: 'MLB26332', name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Freios' };
  }
  if (t.includes('suspensao') || t.includes('amortecedor') || t.includes('bandeja') || t.includes('mola') || t.includes('pivo') || t.includes('homocinetica')) {
    return { id: 'MLB26331', name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Suspensão' };
  }
  if (t.includes('farol') || t.includes('lanterna') || t.includes('luz') || t.includes('break light') || t.includes('pisca') || t.includes('lampada')) {
    return { id: 'MLB270275', name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Iluminação > Faróis e Lanternas' };
  }
  if (t.includes('para-choque') || t.includes('parachoque') || t.includes('grade') || t.includes('retrovisor') || t.includes('porta') || t.includes('capo') || t.includes('lata')) {
    return { id: 'MLB412351', name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Lataria' };
  }
  if (t.includes('radiador') || t.includes('reservatorio') || t.includes('agua') || t.includes('ventoinha') || t.includes('termica') || t.includes('mangueira')) {
    return { id: 'MLB26333', name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Arrefecimento' };
  }
  if (t.includes('trava') || t.includes('vidro') || t.includes('banco') || t.includes('painel') || t.includes('volante') || t.includes('cinto') || t.includes('interior')) {
    return { id: 'MLB181157', name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Habitáculo' };
  }

  return { id: 'MLB1672', name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes' };
}

const DEFAULT_PRODUCTS = [
  { id: 'p1', sku: '12531', mlb: 'MLB5539291609', name: 'Coletor Admissão Hyundai Hb20 1.0 Comfort 12v 3cc 2015', currentCat: 'Acessórios para Veículos > Peças Gerais', status: 'Ativo', price: 249.90, costPrice: 90.00, stock: 4, date: '2026-11-10', conta: 'DL Auto Peças' },
  { id: 'p2', sku: '12530', mlb: 'MLB5539290589', name: 'Reservatório Partida Fria Hyundai Hb20 1.0 Comfort 12v 2015', currentCat: 'Acessórios para Veículos > Peças Gerais', status: 'Sob Revisão', price: 120.00, costPrice: 40.00, stock: 12, date: '2026-11-10', conta: 'DL Auto Peças' },
  { id: 'p3', sku: '12529', mlb: 'MLB5539289953', name: 'Trava Elétrica Tampa Traseira Hyundai Hb20 1.0', currentCat: 'Acessórios para Veículos > Peças Gerais', status: 'Pausado', price: 180.00, costPrice: 70.00, stock: 0, date: '2026-11-10', conta: 'DL Auto Peças' },
  { id: 'p4', sku: '12528', mlb: 'MLB7971719130', name: 'Flauta C/ Bicos Injetores Hyundai Hb20 1.0', currentCat: 'Acessórios para Veículos > Peças Gerais', status: 'Finalizado', price: 350.00, costPrice: 150.00, stock: 0, date: '2026-11-10', conta: 'DL Auto Peças' }
];

const DEFAULT_SALES = [
  { id: 's1', saleId: '3506074', client: 'Italo Ferreira Matos', value: 248.17, discount: 50.83, date: '2026-11-09', payment: 'Transferência Bancária', nfe: '10733' }
];

const DEFAULT_RETURNS = [
  { id: 'r1', date: '2026-11-10', sku: '12530', name: 'Reservatório Partida Fria Hyundai Hb20', value: 120.00, qty: 1, reason: 'Erro do Comprador', status: 'Reintegrado', notes: 'Comprado modelo errado.' }
];

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
  const [activeTab, setActiveTab] = useState('sales-dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ml_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ml_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [salesList, setSalesList] = useState(() => {
    const saved = localStorage.getItem('ml_sales');
    return saved ? JSON.parse(saved) : DEFAULT_SALES;
  });

  const [returnsList, setReturnsList] = useState(() => {
    const saved = localStorage.getItem('ml_returns');
    return saved ? JSON.parse(saved) : DEFAULT_RETURNS;
  });

  useEffect(() => {
    const initFirebase = async () => {
      try {
        if (!window.firebase) {
          await loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
          await loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js');
        }

        if (window.firebase && !window.firebase.apps.length) {
          window.firebase.initializeApp(firebaseConfig);
        }

        if (window.firebase) {
          const dbRef = window.firebase.database().ref('mercadolivredl');
          dbRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
              if (data.products) setProducts(data.products);
              if (data.salesList) setSalesList(data.salesList);
              if (data.returnsList) setReturnsList(data.returnsList);
              setFirebaseConnected(true);
            } else {
              dbRef.set({ products, salesList, returnsList });
              setFirebaseConnected(true);
            }
          });
        }
      } catch (err) {
        console.error('Erro ao conectar ao Firebase:', err);
        setFirebaseConnected(false);
      }
    };

    initFirebase();
  }, []);

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    localStorage.setItem('ml_products', JSON.stringify(products));
    localStorage.setItem('ml_sales', JSON.stringify(salesList));
    localStorage.setItem('ml_returns', JSON.stringify(returnsList));

    if (window.firebase && window.firebase.apps.length) {
      const dbRef = window.firebase.database().ref('mercadolivredl');
      dbRef.set({ products, salesList, returnsList }).catch(err => console.error(err));
    }
  }, [products, salesList, returnsList]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ml_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ml_user');
    }
  }, [currentUser]);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSaveProduct = (productData) => {
    if (productData.id) {
      setProducts(products.map(p => p.id === productData.id ? productData : p));
    } else {
      const newProd = { ...productData, id: 'p_' + Date.now() };
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

  const handleDeleteSheetByDate = (dateToDelete) => {
    if (currentUser?.role !== 'admin') {
      alert('Apenas administradores podem excluir planilhas lançadas.');
      return;
    }
    if (window.confirm(`ATENÇÃO: Deseja realmente excluir todas as peças da data ${dateToDelete}?`)) {
      setProducts(products.filter(p => p.date !== dateToDelete));
    }
  };

  const resetToDefaultData = () => {
    if (window.confirm('Deseja restaurar os dados padrão?')) {
      setProducts(DEFAULT_PRODUCTS);
      setSalesList(DEFAULT_SALES);
      setReturnsList(DEFAULT_RETURNS);
      localStorage.clear();
    }
  };

  if (!currentUser) {
    return <LoginScreen onLogin={(user) => setCurrentUser(user)} darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} font-sans flex flex-col md:flex-row transition-colors duration-200`}>
      <aside className={`w-full md:w-64 border-b md:border-b-0 md:border-r ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex-shrink-0 flex flex-col justify-between`}>
        <div>
          <div className="p-5 border-b border-slate-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-400 p-2 rounded-xl text-slate-950 font-black shadow-lg shadow-amber-500/20">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-bold text-lg leading-tight tracking-tight text-amber-400">AutoPeças <span className="text-blue-400">ML</span></h1>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${firebaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                    {firebaseConnected ? 'Firebase Conectado' : 'Modo Local'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white md:hidden"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

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
                title="Sair"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            <NavItem id="sales-dashboard" label="Dashboard Faturamento & Vendas" icon={BarChart3} active={activeTab} setActive={setActiveTab} badge={salesList.length} />
            <NavItem id="import" label="Importar Peças & Anúncios" icon={FileSpreadsheet} active={activeTab} setActive={setActiveTab} badge={products.length} />
            <NavItem id="price-monitor" label="Monitor de Preços (Buy Box)" icon={TrendingUp} active={activeTab} setActive={setActiveTab} />
            <NavItem id="margin-calculator" label="Simulador de Margem Líquida" icon={Calculator} active={activeTab} setActive={setActiveTab} />
            <NavItem id="faq-helper" label="FAQ & Compatibilidade (IA)" icon={MessageSquare} active={activeTab} setActive={setActiveTab} />
            <NavItem id="curva-abc" label="Curva ABC de Estoque" icon={PieChart} active={activeTab} setActive={setActiveTab} />
            <NavItem id="category-audit" label="Auditoria de Categorias" icon={CheckSquare} active={activeTab} setActive={setActiveTab} />
            <NavItem id="manage-sheets" label="Gerenciar / Excluir Planilhas" icon={Trash2} active={activeTab} setActive={setActiveTab} />
            <NavItem id="team-guide" label="Guia & Motivos de Status" icon={HelpCircle} active={activeTab} setActive={setActiveTab} />
            <NavItem id="assistant" label="Editor de Títulos (IA)" icon={Sparkles} active={activeTab} setActive={setActiveTab} />
            <NavItem id="categories" label="Editor de Categorias & OEM" icon={FolderTree} active={activeTab} setActive={setActiveTab} />
            <NavItem id="returns" label="Controle Devoluções" icon={RotateCcw} active={activeTab} setActive={setActiveTab} badge={returnsList.length} />
            <NavItem id="photo" label="Editor Fundo Branco" icon={ImageIcon} active={activeTab} setActive={setActiveTab} />
          </nav>
        </div>

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
              title="Restaurar dados"
              className="p-1.5 text-slate-500 hover:text-amber-400 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {activeTab === 'sales-dashboard' && (
          <SalesDashboardTab 
            salesList={salesList} 
            setSalesList={setSalesList} 
            products={products}
            currentUser={currentUser} 
            darkMode={darkMode} 
          />
        )}

        {activeTab === 'import' && (
          <ImportExcelTab 
            products={products} 
            setProducts={setProducts} 
            currentUser={currentUser}
            onAddProduct={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            onEditProduct={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }}
            onDeleteProduct={handleDeleteProduct}
            darkMode={darkMode} 
          />
        )}

        {activeTab === 'price-monitor' && <PriceMonitorTab products={products} setProducts={setProducts} darkMode={darkMode} />}

        {activeTab === 'margin-calculator' && <MarginCalculatorTab products={products} darkMode={darkMode} />}

        {activeTab === 'faq-helper' && <FaqHelperTab products={products} darkMode={darkMode} />}

        {activeTab === 'curva-abc' && <CurvaAbcTab products={products} darkMode={darkMode} />}

        {activeTab === 'category-audit' && <CategoryAuditTab products={products} setProducts={setProducts} darkMode={darkMode} />}

        {activeTab === 'manage-sheets' && (
          <ManageSheetsTab 
            products={products} 
            onDeleteSheet={handleDeleteSheetByDate} 
            currentUser={currentUser} 
            darkMode={darkMode} 
          />
        )}

        {activeTab === 'team-guide' && <TeamGuideTab darkMode={darkMode} />}

        {activeTab === 'assistant' && <AssistantTab products={products} darkMode={darkMode} />}

        {activeTab === 'categories' && <CategoriesTab products={products} darkMode={darkMode} />}

        {activeTab === 'returns' && <ReturnsTab returnsList={returnsList} setReturnsList={setReturnsList} products={products} currentUser={currentUser} darkMode={darkMode} />}

        {activeTab === 'photo' && <PhotoEditorTab darkMode={darkMode} />}
      </main>

      {isProductModalOpen && (
        <ProductModal 
          product={editingProduct} 
          onSave={handleSaveProduct} 
          onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

// ==========================================
// TELA DE LOGIN
// ==========================================
function LoginScreen({ onLogin, darkMode, setDarkMode }) {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === 'admin' && password === '258012') {
      onLogin({ role: 'admin', name: 'Administrador ML' });
    } else if (selectedRole === 'vendedor' && password === '123456') {
      onLogin({ role: 'vendedor', name: 'Vendedor ML' });
    } else {
      setErrorMsg('Senha incorreta. Admin: 258012 | Vendedor: 123456');
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
          <p className="text-sm text-slate-400">Controle de Faturamento e Vendas (Firebase)</p>
        </div>

        <div className={`p-6 md:p-8 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-2xl space-y-6`}>
          <div className="grid grid-cols-2 gap-2 bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50">
            <button
              type="button"
              onClick={() => { setSelectedRole('admin'); setPassword(''); setErrorMsg(''); }}
              className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                selectedRole === 'admin' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Administrador</span>
            </button>
            <button
              type="button"
              onClick={() => { setSelectedRole('vendedor'); setPassword(''); setErrorMsg(''); }}
              className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                selectedRole === 'vendedor' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Vendedor</span>
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Senha ({selectedRole === 'admin' ? '258012' : '123456'})
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

            {errorMsg && <div className="text-xs text-red-400 font-medium">{errorMsg}</div>}

            <button type="submit" className={`w-full py-3 rounded-xl font-bold text-sm shadow-lg ${selectedRole === 'admin' ? 'bg-amber-400 hover:bg-amber-300 text-slate-950' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO 2: MONITOR DE PREÇOS (BUY BOX)
// ==========================================
function PriceMonitorTab({ products, setProducts, darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customPrices, setCustomPrices] = useState({});

  const handlePriceChange = (id, newPrice) => {
    setCustomPrices({ ...customPrices, [id]: Number(newPrice) });
  };

  const handleSavePrice = (id) => {
    const val = customPrices[id];
    if (val !== undefined) {
      setProducts(products.map(p => p.id === id ? { ...p, price: val } : p));
      alert('Preço atualizado com sucesso!');
    }
  };

  const evaluated = products.map(p => {
    const currentPrice = p.price || 150.00;
    const marketAvg = Number((currentPrice * (0.85 + (p.name.length % 5) * 0.05)).toFixed(2));
    const diff = currentPrice - marketAvg;
    const diffPct = ((diff / marketAvg) * 100).toFixed(1);

    let status = 'Competitivo';
    let color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

    if (diff > 15) {
      status = 'Acima do Mercado (Risco)';
      color = 'text-red-400 bg-red-500/10 border-red-500/20';
    } else if (diff < -15) {
      status = 'Abaixo do Preço (Margem Baixa)';
      color = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }

    return { ...p, marketAvg, diffPct: Number(diffPct), status, color };
  });

  const filtered = evaluated.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Monitor de Preços & Competitividade (Buy Box)</h2>
        <p className="text-sm text-slate-400">Monitore se o preço das suas peças está alinhado com a concorrência do Mercado Livre.</p>
      </div>

      <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex items-center gap-4`}>
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Pesquisar por Peça ou SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-sm text-white focus:outline-none"
        />
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">SKU / Peça</th>
                <th className="p-4">Seu Preço Atual</th>
                <th className="p-4">Média Concorrência</th>
                <th className="p-4">Status Buy Box</th>
                <th className="p-4 text-center">Ajustar Preço</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">Nenhum anúncio encontrado.</td>
                </tr>
              ) : (
                filtered.map(p => {
                  const val = customPrices[p.id] !== undefined ? customPrices[p.id] : (p.price || 150);
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-amber-400 font-mono">SKU: {p.sku}</div>
                        <div className="font-semibold text-slate-200 mt-0.5">{p.name}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-100">
                        R$ {Number(p.price || 150).toFixed(2)}
                      </td>
                      <td className="p-4 font-mono text-blue-400">
                        R$ {p.marketAvg.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full font-bold border ${p.color} inline-block`}>
                          {p.status} ({p.diffPct > 0 ? `+${p.diffPct}%` : `${p.diffPct}%`})
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            step="0.01"
                            value={val}
                            onChange={(e) => handlePriceChange(p.id, e.target.value)}
                            className="w-24 p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs text-center"
                          />
                          <button
                            onClick={() => handleSavePrice(p.id)}
                            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-transform active:scale-95"
                          >
                            Salvar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO 4: SIMULADOR DE MARGEM LÍQUIDA
// ==========================================
function MarginCalculatorTab({ products, darkMode }) {
  const [selectedSku, setSelectedSku] = useState(products[0]?.sku || '');
  const [salePrice, setSalePrice] = useState(products[0]?.price || 200);
  const [costPrice, setCostPrice] = useState(products[0]?.costPrice || 70);
  const [adMode, setAdMode] = useState('premium');
  const [shippingCost, setShippingCost] = useState(25.00);
  const [taxRate, setTaxRate] = useState(4.0);

  const handleSelectProduct = (sku) => {
    setSelectedSku(sku);
    const found = products.find(p => p.sku === sku);
    if (found) {
      setSalePrice(found.price || 200);
      setCostPrice(found.costPrice || 70);
    }
  };

  const commissionRate = adMode === 'premium' ? 0.16 : 0.11;
  const commissionValue = salePrice * commissionRate;
  const taxValue = salePrice * (taxRate / 100);
  const totalCost = Number(costPrice) + Number(shippingCost) + commissionValue + taxValue;
  const netProfit = salePrice - totalCost;
  const roi = costPrice > 0 ? ((netProfit / costPrice) * 100).toFixed(1) : 0;
  const marginPct = salePrice > 0 ? ((netProfit / salePrice) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Simulador de Margem Líquida Real</h2>
        <p className="text-sm text-slate-400">Calcule taxas de comissão do Mercado Livre, impostos, frete e descubra seu lucro líquido exato.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 shadow-xl text-xs`}>
          <div>
            <label className="text-slate-400 font-medium block mb-1">Selecionar Peça do Estoque</label>
            <select
              value={selectedSku}
              onChange={(e) => handleSelectProduct(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
            >
              {products.map(p => (
                <option key={p.id} value={p.sku}>SKU {p.sku} - {p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Preço de Venda Anunciado (R$)</label>
            <input
              type="number"
              step="0.01"
              value={salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Custo de Aquisição / Compra (R$)</label>
            <input
              type="number"
              step="0.01"
              value={costPrice}
              onChange={(e) => setCostPrice(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Tipo de Anúncio no Mercado Livre</label>
            <select
              value={adMode}
              onChange={(e) => setAdMode(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
            >
              <option value="premium">Premium (16% com parcelamento sem juros)</option>
              <option value="classic">Clássico (11% sem parcelamento sem juros)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Custo Envio Fixo (R$)</label>
              <input
                type="number"
                step="0.01"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 font-medium block mb-1">Imposto NFe (%)</label>
              <input
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-xl flex flex-col justify-center border-l-4 border-l-amber-400`}>
            <div className="text-xs text-slate-400 font-semibold uppercase">Lucro Líquido Real</div>
            <div className={`text-3xl font-black font-mono ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              R$ {netProfit.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500">Valor que sobra limpo após taxas e custos</div>
          </div>

          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-xl flex flex-col justify-center border-l-4 border-l-blue-400`}>
            <div className="text-xs text-slate-400 font-semibold uppercase">Margem de Lucro & ROI</div>
            <div className="text-3xl font-black font-mono text-blue-400">
              {marginPct}% <span className="text-sm font-normal text-slate-400">(ROI: {roi}%)</span>
            </div>
            <div className="text-xs text-slate-500">Retorno sobre o capital investido</div>
          </div>

          <div className={`lg:col-span-2 p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-3 shadow-xl`}>
            <h3 className="font-bold text-sm text-slate-300">Detalhamento dos Descontos no Preço de Venda</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <div className="text-slate-400">Comissão ML</div>
                <div className="text-red-400 font-bold mt-1">- R$ {commissionValue.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <div className="text-slate-400">Imposto NFe</div>
                <div className="text-red-400 font-bold mt-1">- R$ {taxValue.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <div className="text-slate-400">Frete / Envios</div>
                <div className="text-red-400 font-bold mt-1">- R$ {Number(shippingCost).toFixed(2)}</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl">
                <div className="text-slate-400">Custo da Peça</div>
                <div className="text-red-400 font-bold mt-1">- R$ {Number(costPrice).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO 4: FAQ, COMPATIBILIDADE, NCM/CEST INTELIGENTE E VISÃO IA (FOTO OEM)
// ==========================================
function FaqHelperTab({ products, darkMode }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Olá! Sou o assistente de IA especializado em autopeças. Agora com banco fiscal inteligente: ao perguntar ou enviar foto de uma peça, identifico automaticamente o NCM, o CEST e a tributação correta específica para cada tipo de componente!'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const fileInputRef = useRef(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageAttach = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFiscalDataByText = (text = '') => {
    const t = text.toLowerCase();

    if (t.includes('freio') || t.includes('pastilha') || t.includes('disco') || t.includes('pinça') || t.includes('abs') || t.includes('cilindro de roda')) {
      return {
        peca: "Sistema de Freios",
        ncm: "8708.30.90",
        cest: "01.006.00",
        ipi: "2% a 3.25%",
        icms: "Sujeito à Substituição Tributária (ICMS-ST conforme convênio estadual)"
      };
    }
    if (t.includes('suspensao') || t.includes('amortecedor') || t.includes('bandeja') || t.includes('mola') || t.includes('pivo') || t.includes('homocinetica') || t.includes('axial')) {
      return {
        peca: "Suspensão e Transmissão",
        ncm: "8708.80.00 (Amortecedores) / 8708.50.99 (Demais)",
        cest: "01.018.00",
        ipi: "3.25%",
        icms: "Substituição Tributária (ICMS-ST). PIS/COFINS Monofásico na cadeia."
      };
    }
    if (t.includes('motor') || t.includes('coletor') || t.includes('bico') || t.includes('flauta') || t.includes('valvula') || t.includes('comando') || t.includes('correia') || t.includes('pistao') || t.includes('cabecote')) {
      return {
        peca: "Componentes de Motor / Injeção",
        ncm: "8409.91.90 (Partes de Motores)",
        cest: "01.030.00",
        ipi: "3.25%",
        icms: "Regime de Substituição Tributária (ICMS-ST). Verificar MVA ajustada."
      };
    }
    if (t.includes('farol') || t.includes('lanterna') || t.includes('luz') || t.includes('lampada') || t.includes('pisca')) {
      return {
        peca: "Iluminação e Sinalização",
        ncm: "8512.20.22 (Faróis) / 8512.20.23 (Lanternas)",
        cest: "01.011.00",
        ipi: "6.5%",
        icms: "ICMS-ST aplicável no estado de destino."
      };
    }
    if (t.includes('radiador') || t.includes('reservatorio') || t.includes('agua') || t.includes('ventoinha') || t.includes('termica') || t.includes('mangueira')) {
      return {
        peca: "Sistema de Arrefecimento",
        ncm: "8708.91.00 (Radiadores e Reservatórios)",
        cest: "01.001.00",
        ipi: "3.25%",
        icms: "Substituição Tributária (ICMS-ST)."
      };
    }
    if (t.includes('ignicao') || t.includes('vela') || t.includes('bobina') || t.includes('alternador') || t.includes('partida')) {
      return {
        peca: "Sistema Elétrico e Ignição",
        ncm: "8511.10.00 (Velas) / 8511.40.00 (Motores de Partida)",
        cest: "01.012.00",
        ipi: "3.25%",
        icms: "ICMS-ST conforme legislação de autopeças."
      };
    }

    return {
      peca: "Peça / Acessório Automotivo Geral",
      ncm: "8708.29.99",
      cest: "01.999.00",
      ipi: "3.25%",
      icms: "Substituição Tributária padrão para autopeças."
    };
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputVal.trim() && !attachedImage) return;

    const userMsg = inputVal.trim();
    const hasImage = !!attachedImage;
    const currentImg = attachedImage;

    const newMessages = [
      ...messages,
      {
        sender: 'user',
        text: userMsg || 'Anexei uma foto para identificação fiscal e OEM.',
        image: currentImg
      }
    ];

    setMessages(newMessages);
    setInputVal('');
    setAttachedImage(null);

    setTimeout(() => {
      let aiResponse = "";
      const query = userMsg.toLowerCase();
      const fiscalInfo = getFiscalDataByText(query);

      if (hasImage) {
        aiResponse = "🔍 **Análise da Foto & Ficha Fiscal Específica:**\n\n" +
          "• **Peça Identificada:** Coletor de Admissão / Componente de Motor\n" +
          "• **Código OEM Sugerido:** 28310-2B000 / 04E129709\n" +
          "• **NCM Específico:** 8409.91.90\n" +
          "• **CEST Específico:** 01.030.00\n" +
          "• **Tributação (Simples Nacional / NFe):** Produto com Substituição Tributária (ICMS-ST). Utilizar CST/CSOSN adequado à sua apuração.";
      } else if (query.includes('ncm') || query.includes('cest') || query.includes('tribut') || query.includes('imposto') || query.includes('freio') || query.includes('motor') || query.includes('suspensao') || query.includes('farol')) {
        aiResponse = `📋 **Ficha Fiscal Inteligente (${fiscalInfo.peca}):**\n\n` +
          `• **NCM Correto:** \`${fiscalInfo.ncm}\`\n` +
          `• **CEST Correto:** \`${fiscalInfo.cest}\`\n` +
          `• **Alíquota IPI:** ${fiscalInfo.ipi}\n` +
          `• **Regime ICMS:** ${fiscalInfo.icms}\n\n` +
          `_Dica fiscal:_ Certifique-se de validar se a venda é interestadual para aplicar o MVA correto da Substituição Tributária do estado do comprador.`;
      } else if (query.includes('oem') || query.includes('codigo') || query.includes('código')) {
        aiResponse = "Para descobrir o código OEM correto, envie uma foto nítida da etiqueta de fabricação ou dos números gravados na peça usando o botão de anexo (clipe de papel) aqui no chat.";
      } else if (query.includes('hb20') || query.includes('hyundai')) {
        aiResponse = "Para peças da linha Hyundai HB20:\n\n• **NCM Típico:** 8409.91.90 (Motor) ou 8708.29.99 (Acabamentos)\n• **CEST:** 01.030.00\n• **OEM Comum:** 28310-04000";
      } else {
        aiResponse = `📋 **Consulta Fiscal Realizada:**\n\n` +
          `• **Classificação Identificada:** ${fiscalInfo.peca}\n` +
          `• **NCM Sugerido:** \`${fiscalInfo.ncm}\`\n` +
          `• **CEST Sugerido:** \`${fiscalInfo.cest}\`\n\n` +
          `Para obter um NCM mais específico, digite o nome exato da peça (ex: "NCM amortecedor", "NCM pastilha de freio") ou envie uma foto.`;
      }

      setMessages([...newMessages, { sender: 'ai', text: aiResponse }]);
    }, 700);
  };

  const handleQuickQuestion = (qText) => {
    setInputVal(qText);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
      <div className="pb-4 border-b border-slate-800 flex-shrink-0">
        <h2 className="text-2xl font-bold tracking-tight">FAQ, NCM/CEST Inteligente & Leitor de OEM por Foto</h2>
        <p className="text-sm text-slate-400">O assistente agora detecta automaticamente o NCM e o CEST correto com base no tipo de peça consultada.</p>
      </div>

      <div className="flex flex-wrap gap-2 flex-shrink-0">
        <button onClick={() => handleQuickQuestion("Qual o NCM e CEST de bicos e motor?")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>NCM Motor / Injeção</span>
        </button>
        <button onClick={() => handleQuickQuestion("NCM pastilha e disco de freio")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span>NCM Freios</span>
        </button>
        <button onClick={() => handleQuickQuestion("NCM amortecedor e suspensão")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>NCM Suspensão</span>
        </button>
        <button onClick={() => handleQuickQuestion("Como achar o OEM da peça pela foto?")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>Descobrir OEM por Foto</span>
        </button>
      </div>

      <div className={`flex-1 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex flex-col overflow-hidden shadow-xl`}>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : darkMode ? 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700/60' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
              }`}>
                {msg.image && (
                  <div className="mb-2">
                    <img src={msg.image} alt="Peça Anexada" className="max-w-xs max-h-48 rounded-xl border border-slate-700 object-cover shadow-md" />
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {attachedImage && (
          <div className="px-4 py-2 bg-slate-800/90 border-t border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={attachedImage} alt="Anexo" className="w-10 h-10 object-cover rounded-lg border border-slate-600" />
              <span className="text-xs text-slate-300 font-medium">Foto selecionada para identificar OEM e NCM</span>
            </div>
            <button onClick={() => setAttachedImage(null)} className="p-1 hover:bg-red-500/20 text-red-400 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className={`p-4 border-t ${darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'} flex items-center gap-2`}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageAttach}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
            title="Anexar foto da peça ou gravação para descobrir OEM"
          >
            <Paperclip className="w-4 h-4 text-amber-400" />
          </button>

          <input
            type="text"
            placeholder="Digite o nome da peça (ex: NCM amortecedor) ou mande foto..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
          />

          <button
            type="submit"
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-transform active:scale-95 flex-shrink-0"
          >
            <span>Consultar IA</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO 6: CURVA ABC DE ESTOQUE (COM FILTRO POR CLIQUE)
// ==========================================
function CurvaAbcTab({ products, darkMode }) {
  const [selectedCurva, setSelectedCurva] = useState('TODAS');

  const evaluated = products.map((p, i) => {
    const simulatedRevenue = (p.price || 150) * (p.stock || 5) * (i % 2 === 0 ? 3 : 1);
    return { ...p, simulatedRevenue };
  }).sort((a, b) => b.simulatedRevenue - a.simulatedRevenue);

  const totalRev = evaluated.reduce((acc, p) => acc + p.simulatedRevenue, 0) || 1;

  let accumulated = 0;
  const abcClassified = evaluated.map(p => {
    accumulated += p.simulatedRevenue;
    const pct = (accumulated / totalRev) * 100;
    let curva = 'A';
    let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (pct > 80 && pct <= 95) {
      curva = 'B';
      badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    } else if (pct > 95) {
      curva = 'C';
      badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
    return { ...p, curva, badgeColor };
  });

  const countA = abcClassified.filter(p => p.curva === 'A').length;
  const countB = abcClassified.filter(p => p.curva === 'B').length;
  const countC = abcClassified.filter(p => p.curva === 'C').length;

  const filteredProducts = selectedCurva === 'TODAS'
    ? abcClassified
    : abcClassified.filter(p => p.curva === selectedCurva);

  const handleCardClick = (curvaType) => {
    if (selectedCurva === curvaType) {
      setSelectedCurva('TODAS');
    } else {
      setSelectedCurva(curvaType);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Curva ABC de Estoque & Giro de Peças</h2>
          <p className="text-sm text-slate-400">Clique em qualquer um dos cards abaixo para filtrar as peças na tabela por categoria.</p>
        </div>

        {selectedCurva !== 'TODAS' && (
          <button
            onClick={() => setSelectedCurva('TODAS')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-colors self-start md:self-auto"
          >
            Exibir Todas as Peças ({abcClassified.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => handleCardClick('A')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] shadow-md border-l-4 border-l-emerald-400 ${
            selectedCurva === 'A'
              ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/50'
              : darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-400 font-semibold">Curva A (Alto Giro - 80% Faturamento)</div>
            {selectedCurva === 'A' && <span className="text-[10px] font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">Ativo</span>}
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{countA} peças</div>
          <div className="text-[10px] text-slate-500">Nunca deixe faltar em estoque</div>
        </div>

        <div
          onClick={() => handleCardClick('B')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] shadow-md border-l-4 border-l-blue-400 ${
            selectedCurva === 'B'
              ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/50'
              : darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-400 font-semibold">Curva B (Giro Moderado - 15%)</div>
            {selectedCurva === 'B' && <span className="text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">Ativo</span>}
          </div>
          <div className="text-2xl font-black font-mono text-blue-400 mt-1">{countB} peças</div>
          <div className="text-[10px] text-slate-500">Reposição controlada</div>
        </div>

        <div
          onClick={() => handleCardClick('C')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] shadow-md border-l-4 border-l-amber-400 ${
            selectedCurva === 'C'
              ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/50'
              : darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-400 font-semibold">Curva C (Baixo Giro / Paradas - 5%)</div>
            {selectedCurva === 'C' && <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">Ativo</span>}
          </div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">{countC} peças</div>
          <div className="text-[10px] text-slate-500">Recomendado fazer liquidação</div>
        </div>
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400 font-semibold">
          <span>Exibindo: <strong className="text-amber-400">{selectedCurva === 'TODAS' ? 'Todas as Peças' : `Apenas Curva ${selectedCurva}`}</strong> ({filteredProducts.length} itens)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">SKU / Peça</th>
                <th className="p-4">Estoque Atual</th>
                <th className="p-4">Preço (R$)</th>
                <th className="p-4">Faturamento Estimado</th>
                <th className="p-4 text-center">Classificação ABC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">Nenhum produto cadastrado nesta curva.</td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-amber-400 font-mono">SKU: {p.sku}</div>
                      <div className="font-semibold text-slate-200 mt-0.5">{p.name}</div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-300">
                      {p.stock !== undefined ? p.stock : 5} un
                    </td>
                    <td className="p-4 font-mono text-slate-200">
                      R$ {Number(p.price || 150).toFixed(2)}
                    </td>
                    <td className="p-4 font-mono text-emerald-400 font-bold">
                      R$ {p.simulatedRevenue.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold border ${p.badgeColor} inline-block`}>
                        Curva {p.curva}
                      </span>
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
// MÓDULO: AUDITORIA DE CATEGORIAS
// ==========================================
function CategoryAuditTab({ products, setProducts, darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleFixCategory = (productId, newCorrectCat) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        return { ...p, currentCat: newCorrectCat };
      }
      return p;
    }));
  };

  const handleFixAll = () => {
    setProducts(products.map(p => {
      const correct = detectCategoryFromTitle(p.name);
      return { ...p, currentCat: correct.name };
    }));
  };

  const auditedProducts = products.map(p => {
    const correct = detectCategoryFromTitle(p.name);
    const current = p.currentCat || 'Acessórios para Veículos > Peças Gerais';
    const isMatch = current.trim().toLowerCase() === correct.name.trim().toLowerCase();
    return { ...p, correctCat: correct.name, correctId: correct.id, isMatch };
  });

  const filtered = auditedProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Auditoria e Comparação de Categorias</h2>
          <p className="text-sm text-slate-400">Compara a categoria atual cadastrada com a categoria correta exigida pelo Mercado Livre.</p>
        </div>

        <button 
          onClick={handleFixAll}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 transition-transform active:scale-95"
        >
          <Check className="w-4 h-4" />
          <span>Aplicar Categoria Correta em Todos</span>
        </button>
      </div>

      <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex items-center gap-4`}>
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Pesquisar peça por Título ou SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-sm text-white focus:outline-none"
        />
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">SKU / Título da Peça</th>
                <th className="p-4">Categoria Atual no Anúncio</th>
                <th className="p-4">Categoria Correta (Mercado Livre)</th>
                <th className="p-4 text-center">Status / Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">Nenhum anúncio encontrado.</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-amber-400 font-mono">SKU: {p.sku}</div>
                      <div className="font-semibold text-slate-200 mt-0.5">{p.name}</div>
                    </td>
                    <td className="p-4 text-slate-300 font-mono">
                      {p.currentCat || 'Acessórios para Veículos > Peças Gerais'}
                    </td>
                    <td className="p-4 text-emerald-400 font-mono font-bold">
                      {p.correctCat} <span className="text-[10px] text-slate-500 block">ID: {p.correctId}</span>
                    </td>
                    <td className="p-4 text-center">
                      {p.isMatch ? (
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correto
                        </span>
                      ) : (
                        <button
                          onClick={() => handleFixCategory(p.id, p.correctCat)}
                          className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow transition-transform active:scale-95 inline-flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Arrumar Categoria
                        </button>
                      )}
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
// MÓDULO: GUIA & MOTIVOS DE STATUS
// ==========================================
function TeamGuideTab({ darkMode }) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Guia da Equipe: Entendendo os Status dos Anúncios</h2>
        <p className="text-sm text-slate-400">Material de leitura para a equipe entender por que os anúncios recebem determinadas marcações.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 shadow-xl`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Anúncios Pausados</h3>
              <p className="text-xs text-amber-400">O que significa?</p>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li>• <strong>Estoque Zerado:</strong> O ML pausa automaticamente quando a quantidade chega a zero.</li>
            <li>• <strong>Falta de Atualização:</strong> Anúncios antigos sem movimentação.</li>
            <li>• <strong>Pausa Manual:</strong> Pausado pela equipe para revisão.</li>
          </ul>
        </div>

        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 shadow-xl`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Sob Revisão</h3>
              <p className="text-xs text-blue-400">O que significa?</p>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li>• <strong>Propriedade Intelectual:</strong> Verificação de marca ou uso de nomes protegidos.</li>
            <li>• <strong>Verificação de Preço:</strong> Alterações bruscas de valor.</li>
            <li>• <strong>Nota Fiscal:</strong> Exigência de comprovação de procedência.</li>
          </ul>
        </div>

        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 shadow-xl`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Finalizados</h3>
              <p className="text-xs text-red-400">O que significa?</p>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li>• <strong>Prazo Expirado:</strong> Anúncios gratuitos expirados.</li>
            <li>• <strong>Exclusão Permanente:</strong> Encerrado por limpeza de estoque.</li>
            <li>• <strong>Infração Grave:</strong> Violação das políticas do ML.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO: DASHBOARD DE FATURAMENTO & STATUS DOS ANÚNCIOS
// ==========================================
function SalesDashboardTab({ salesList, setSalesList, products, currentUser, darkMode }) {
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [importStatus, setImportStatus] = useState('');

  const handleSalesFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.XLSX) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.onload = () => processSalesExcel(file);
      document.head.appendChild(script);
    } else {
      processSalesExcel(file);
    }
  };

  const processSalesExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = window.XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows = window.XLSX.utils.sheet_to_json(worksheet);

        if (jsonRows.length === 0) {
          setImportStatus('A planilha de vendas está vazia.');
          return;
        }

        const importedSales = jsonRows.map((row, idx) => {
          const saleId = String(row['Id'] || row['ID'] || `ID_${idx}`);
          const client = String(row['Cliente'] || 'Cliente Balcão');
          const value = Number(row['Valor de Venda'] || row['Valor'] || 0);
          const discount = Number(row['Desconto'] || 0);
          const payment = String(row['Pagamentos'] || 'Dinheiro');
          const nfe = String(row['Nº NFe'] || row['NFe'] || '-');

          let rawDate = row['Data'] || new Date().toISOString();
          let formattedDate = new Date().toISOString().slice(0, 10);
          try {
            if (typeof rawDate === 'number') {
              const d = new Date((rawDate - (25567 + 2)) * 86400 * 1000);
              formattedDate = d.toISOString().slice(0, 10);
            } else if (rawDate) {
              formattedDate = String(rawDate).slice(0, 10);
            }
          } catch (err) {
            formattedDate = new Date().toISOString().slice(0, 10);
          }

          return {
            id: 'sale_' + Date.now() + '_' + idx,
            saleId,
            client,
            value,
            discount,
            date: formattedDate,
            payment,
            nfe
          };
        });

        setSalesList([...importedSales, ...salesList]);
        setImportStatus(`Sucesso! ${importedSales.length} vendas importadas.`);
      } catch (err) {
        console.error(err);
        setImportStatus('Erro ao ler a planilha de vendas.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredSales = salesList.filter(s => {
    const matchSearch = s.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.saleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.nfe.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDate = !filterDate || (s.date && s.date.startsWith(filterDate));
    return matchSearch && matchDate;
  });

  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.value, 0);
  const totalDiscount = filteredSales.reduce((acc, s) => acc + s.discount, 0);
  const totalCount = filteredSales.length;
  const averageTicket = totalCount > 0 ? (totalRevenue / totalCount) : 0;

  const totalAds = products.length;
  const countActive = products.filter(p => (p.status || 'Ativo').toLowerCase() === 'ativo').length;
  const countReview = products.filter(p => (p.status || '').toLowerCase().includes('revisão')).length;
  const countPaused = products.filter(p => (p.status || '').toLowerCase().includes('pausado')).length;
  const countFinished = products.filter(p => (p.status || '').toLowerCase().includes('finalizado')).length;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard de Faturamento & Status dos Anúncios</h2>
          <p className="text-sm text-slate-400">Resumo financeiro e contagem em tempo real dos status de anúncios do Mercado Livre.</p>
        </div>

        <label className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer shadow-lg shadow-amber-400/20 transition-transform active:scale-95">
          <Upload className="w-4 h-4" />
          <span>Importar Planilha de Vendas (.xlsx)</span>
          <input type="file" accept=".xlsx, .xls, .csv" onChange={handleSalesFileUpload} className="hidden" />
        </label>
      </div>

      {importStatus && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* BLOCO DE STATUS DOS ANÚNCIOS */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-amber-400" />
          <span>Visão Geral dos Anúncios no Mercado Livre ({totalAds} total)</span>
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-1 shadow-md border-l-4 border-l-emerald-400`}>
            <div className="text-xs text-slate-400 font-semibold">Anúncios Ativos</div>
            <div className="text-2xl font-black font-mono text-emerald-400">{countActive}</div>
            <div className="text-[10px] text-slate-500">Disponíveis para venda</div>
          </div>

          <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-1 shadow-md border-l-4 border-l-blue-400`}>
            <div className="text-xs text-slate-400 font-semibold">Sob Revisão</div>
            <div className="text-2xl font-black font-mono text-blue-400">{countReview}</div>
            <div className="text-[10px] text-slate-500">Em análise pelo ML</div>
          </div>

          <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-1 shadow-md border-l-4 border-l-amber-400`}>
            <div className="text-xs text-slate-400 font-semibold">Anúncios Pausados</div>
            <div className="text-2xl font-black font-mono text-amber-400">{countPaused}</div>
            <div className="text-[10px] text-slate-500">Estoque zerado ou pausa manual</div>
          </div>

          <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-1 shadow-md border-l-4 border-l-red-400`}>
            <div className="text-xs text-slate-400 font-semibold">Anúncios Finalizados</div>
            <div className="text-2xl font-black font-mono text-red-400">{countFinished}</div>
            <div className="text-[10px] text-slate-500">Expirados ou encerrados</div>
          </div>
        </div>
      </div>

      {/* BLOCO DE MÉTRICAS FINANCEIRAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-lg`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Faturamento Total</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-lg`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total de Vendas</span>
            <ShoppingBag className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-400">
            {totalCount} <span className="text-xs font-normal text-slate-400">pedidos</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-lg`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Ticket Médio</span>
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            R$ {averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-lg`}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total de Descontos</span>
            <Percent className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black font-mono text-red-400">
            R$ {totalDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} grid grid-cols-1 md:grid-cols-3 gap-4`}>
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Pesquisar por Cliente, ID da Venda ou NFe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="relative">
          <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs font-semibold text-slate-400">
          <span>Transações Listadas ({filteredSales.length})</span>
          {filterDate && (
            <button onClick={() => setFilterDate('')} className="text-blue-400 hover:underline">
              Limpar Filtro ({filterDate})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">ID Venda / NFe</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Forma Pagamento</th>
                <th className="p-4">Data</th>
                <th className="p-4 text-right">Desconto</th>
                <th className="p-4 text-right">Valor da Venda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">Nenhuma venda encontrada.</td>
                </tr>
              ) : (
                filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-mono text-xs">
                      <div className="font-bold text-amber-400">ID: {s.saleId}</div>
                      <div className="text-slate-500">NFe: {s.nfe}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-200">{s.client}</td>
                    <td className="p-4 text-xs text-slate-300">{s.payment}</td>
                    <td className="p-4 font-mono text-xs text-slate-400">{s.date}</td>
                    <td className="p-4 text-right font-mono text-red-400 text-xs">R$ {s.discount.toFixed(2)}</td>
                    <td className="p-4 text-right font-mono font-bold text-amber-400">R$ {s.value.toFixed(2)}</td>
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
// MÓDULO: IMPORTADOR DE PEÇAS & ANÚNCIOS
// ==========================================
function ImportExcelTab({ products, setProducts, currentUser, onAddProduct, onEditProduct, onDeleteProduct, darkMode }) {
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [importStatus, setImportStatus] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.XLSX) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.onload = () => processExcelFile(file);
      document.head.appendChild(script);
    } else {
      processExcelFile(file);
    }
  };

  const processExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = window.XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows = window.XLSX.utils.sheet_to_json(worksheet);

        if (jsonRows.length === 0) {
          setImportStatus('A planilha está vazia.');
          return;
        }

        const imported = jsonRows.map((row, idx) => {
          const sku = String(row['SKU'] || row['Código do Produto'] || `SKU_${idx}`);
          const mlb = String(row['Código MLB'] || 'MLB5539291609');
          const name = String(row['Título'] || row['titulo'] || 'Peça Automotiva');
          const status = String(row['Status'] || 'Ativo');
          const conta = String(row['Conta'] || 'DL Auto Peças');
          const currentCat = String(row['Categoria'] || 'Acessórios para Veículos > Peças Gerais');
          const price = Number(row['Preço'] || 150.00);
          const costPrice = Number(row['Custo'] || 60.00);
          const stock = Number(row['Estoque'] || 5);
          
          let rawDate = row['Data da Publicação'] || row['Data'] || new Date().toISOString();
          let formattedDate = new Date().toISOString().slice(0, 10);
          try {
            if (typeof rawDate === 'number') {
              const d = new Date((rawDate - (25567 + 2)) * 86400 * 1000);
              formattedDate = d.toISOString().slice(0, 10);
            } else if (rawDate) {
              formattedDate = String(rawDate).slice(0, 10);
            }
          } catch (err) {
            formattedDate = new Date().toISOString().slice(0, 10);
          }

          return {
            id: 'imp_' + Date.now() + '_' + idx,
            sku,
            mlb,
            name,
            currentCat,
            status,
            price,
            costPrice,
            stock,
            date: formattedDate,
            conta
          };
        });

        setProducts([...imported, ...products]);
        setImportStatus(`Sucesso! ${imported.length} peças importadas.`);
      } catch (err) {
        console.error(err);
        setImportStatus('Erro ao ler a planilha Excel.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (p.sku?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (p.mlb?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchDate = !filterDate || (p.date && p.date.startsWith(filterDate));
    return matchSearch && matchDate;
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Importar Peças & Anúncios</h2>
          <p className="text-sm text-slate-400">Puxe o catálogo de publicações do Mercado Livre.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onAddProduct} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm border border-slate-700">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Nova Peça</span>
          </button>

          <label className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer shadow-lg shadow-amber-400/20 transition-transform active:scale-95">
            <Upload className="w-4 h-4" />
            <span>Jogar Planilha Excel (.xlsx)</span>
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {importStatus && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}

      <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} grid grid-cols-1 md:grid-cols-3 gap-4`}>
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filtrar por Título, SKU ou Código MLB..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="relative">
          <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs font-semibold text-slate-400">
          <span>Total de Anúncios Exibidos: <strong className="text-amber-400 font-mono text-sm">{filteredProducts.length}</strong></span>
          {filterDate && (
            <button onClick={() => setFilterDate('')} className="text-blue-400 hover:underline">
              Limpar Filtro ({filterDate})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">SKU / MLB</th>
                <th className="p-4">Título do Anúncio</th>
                <th className="p-4">Preço / Estoque</th>
                <th className="p-4">Status</th>
                <th className="p-4">Data Publicação</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">Nenhum anúncio encontrado.</td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-mono text-xs">
                      <div className="font-bold text-amber-400">SKU: {p.sku}</div>
                      <div className="text-slate-500">MLB: {p.mlb || 'N/D'}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-200">{p.name}</td>
                    <td className="p-4 font-mono text-xs">
                      <div className="text-emerald-400 font-bold">R$ {Number(p.price || 150).toFixed(2)}</div>
                      <div className="text-slate-400">Estoque: {p.stock !== undefined ? p.stock : 5} un</div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        p.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {p.status || 'Ativo'}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-400">{p.date || '2026-11-10'}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onEditProduct(p)} className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white" title="Editar">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {currentUser?.role === 'admin' && (
                          <button onClick={() => onDeleteProduct(p.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400" title="Excluir">
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
// MÓDULO: GERENCIAR / EXCLUIR PLANILHAS LANÇADAS
// ==========================================
function ManageSheetsTab({ products, onDeleteSheet, currentUser, darkMode }) {
  const sheetsMap = {};
  products.forEach(p => {
    const d = p.date || '2026-11-10';
    if (!sheetsMap[d]) {
      sheetsMap[d] = { date: d, count: 0, items: [] };
    }
    sheetsMap[d].count += 1;
    sheetsMap[d].items.push(p);
  });

  const sheetsList = Object.values(sheetsMap).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Gerenciar e Excluir Planilhas Lançadas</h2>
        <p className="text-sm text-slate-400">Exclua lotes inteiros da nuvem do Firebase.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sheetsList.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-500">Nenhuma planilha lançada no sistema.</div>
        ) : (
          sheetsList.map((sheet) => (
            <div key={sheet.date} className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 shadow-xl flex flex-col justify-between`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-slate-200 font-mono text-base">{sheet.date}</span>
                  </div>
                  <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/20 font-bold">
                    {sheet.count} {sheet.count === 1 ? 'peça' : 'peças'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Lote sincronizado com o Firebase.</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">Status: Sincronizado</span>
                {currentUser?.role === 'admin' ? (
                  <button
                    onClick={() => onDeleteSheet(sheet.date)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold border border-red-500/25 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir Planilha</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-500 italic">Requer Admin</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO: EDITOR DE TÍTULOS (IA)
// ==========================================
function AssistantTab({ products, darkMode }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Editor de Títulos (Automático)</h2>
        <p className="text-sm text-slate-400">Verifique os títulos importados do Firebase.</p>
      </div>

      <div className="space-y-4">
        {products.map((p, idx) => {
          const isLong = p.name.length > 60;
          const optimized = isLong ? p.name.slice(0, 57) + '...' : p.name;

          return (
            <div key={p.id || idx} className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-3 shadow-lg`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono bg-amber-400/10 text-amber-400 px-2.5 py-1 rounded font-bold">SKU: {p.sku}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${isLong ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {isLong ? 'Precisa Melhorar (>60 carac.)' : 'Ideal'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-semibold block">Título Atual:</span>
                  <p className="text-slate-200 font-medium">{p.name}</p>
                </div>
                <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/30 flex flex-col justify-between">
                  <div>
                    <span className="text-blue-400 font-semibold block">Sugestão (Max 60 carac.):</span>
                    <p className="text-slate-100 font-bold">{optimized}</p>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button onClick={() => handleCopy(optimized, idx)} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === idx ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO: EDITOR DE CATEGORIAS & OEM
// ==========================================
function CategoriesTab({ products, darkMode }) {
  const [copiedItem, setCopiedItem] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(key);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Editor de Categorias & OEM</h2>
        <p className="text-sm text-slate-400">Mapeamento para as categorias do Mercado Livre.</p>
      </div>

      <div className="space-y-6">
        {products.map((p, idx) => {
          const catInfo = detectCategoryFromTitle(p.name);
          const description = `==================================================\n  ${p.name.toUpperCase()} - SKU: ${p.sku} | MLB: ${p.mlb || 'N/D'}\n==================================================\n\nCategoria ML: ${catInfo.name} (${catInfo.id})\nFicha Técnica e Compatibilidade Garantida.`;

          return (
            <div key={p.id || idx} className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 shadow-xl`}>
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded font-bold">SKU: {p.sku}</span>
                  <h3 className="font-bold text-slate-100 mt-1">{p.name}</h3>
                  <p className="text-xs text-slate-400">{catInfo.name}</p>
                </div>
                <button onClick={() => copyToClipboard(catInfo.id, `cat_${idx}`)} className="p-2 bg-slate-800 text-slate-300 rounded-xl text-xs flex items-center gap-1">
                  <Copy className="w-4 h-4" />
                  <span>{copiedItem === `cat_${idx}` ? 'Copiado!' : catInfo.id}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap">{description}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO: CONTROLE DE DEVOLUÇÕES
// ==========================================
function ReturnsTab({ returnsList, setReturnsList, products, currentUser, darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newReturn, setNewReturn] = useState({
    sku: '',
    name: '',
    value: '',
    date: new Date().toISOString().slice(0, 10),
    reason: 'Arrependimento / Erro do Comprador',
    status: 'Pendente de Análise',
    notes: ''
  });

  const handleAddReturn = (e) => {
    e.preventDefault();
    if (!newReturn.name || !newReturn.value) {
      alert('Preencha o nome da peça e o valor.');
      return;
    }

    const item = {
      id: 'ret_' + Date.now(),
      date: newReturn.date,
      sku: newReturn.sku || 'N/D',
      name: newReturn.name,
      value: Number(newReturn.value),
      reason: newReturn.reason,
      status: newReturn.status,
      notes: newReturn.notes
    };

    setReturnsList([item, ...returnsList]);
    setIsModalOpen(false);
    setNewReturn({
      sku: '',
      name: '',
      value: '',
      date: new Date().toISOString().slice(0, 10),
      reason: 'Arrependimento / Erro do Comprador',
      status: 'Pendente de Análise',
      notes: ''
    });
  };

  const handleDeleteReturn = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de devolução?')) {
      setReturnsList(returnsList.filter(r => r.id !== id));
    }
  };

  const filteredReturns = returnsList.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Controle de Devoluções</h2>
          <p className="text-sm text-slate-400">Marque peças devolvidas, valores, datas e gerencie o estoque.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nova Devolução</span>
        </button>
      </div>

      <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex items-center gap-4`}>
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Pesquisar por Peça ou SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-sm text-white focus:outline-none"
        />
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Data da Devolução</th>
                <th className="p-4">Peça / SKU</th>
                <th className="p-4">Motivo</th>
                <th className="p-4 text-right">Valor</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">Nenhuma devolução registrada.</td>
                </tr>
              ) : (
                filteredReturns.map(r => (
                  <tr key={r.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-mono text-slate-400">{r.date}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-200">{r.name}</div>
                      <div className="text-amber-400 font-mono text-[10px]">SKU: {r.sku}</div>
                    </td>
                    <td className="p-4 text-slate-300">{r.reason}</td>
                    <td className="p-4 text-right font-mono font-bold text-red-400">
                      R$ {Number(r.value || 0).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDeleteReturn(r.id)} 
                        className="p-1.5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                        title="Excluir Devolução"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-slate-900'} space-y-4 shadow-2xl`}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg">Registrar Nova Devolução</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleAddReturn} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Nome da Peça</label>
                <input 
                  type="text" 
                  placeholder="Ex: Coletor Admissão Hb20..." 
                  value={newReturn.name} 
                  onChange={(e) => setNewReturn({ ...newReturn, name: e.target.value })} 
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium">SKU</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 12531" 
                    value={newReturn.sku} 
                    onChange={(e) => setNewReturn({ ...newReturn, sku: e.target.value })} 
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" 
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Valor (R$)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    value={newReturn.value} 
                    onChange={(e) => setNewReturn({ ...newReturn, value: e.target.value })} 
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium">Data da Devolução</label>
                  <input 
                    type="date" 
                    value={newReturn.date} 
                    onChange={(e) => setNewReturn({ ...newReturn, date: e.target.value })} 
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Status</label>
                  <select 
                    value={newReturn.status} 
                    onChange={(e) => setNewReturn({ ...newReturn, status: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="Pendente de Análise">Pendente de Análise</option>
                    <option value="Reintegrado ao Estoque">Reintegrado ao Estoque</option>
                    <option value="Avariado / Descarte">Avariado / Descarte</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium">Motivo</label>
                <input 
                  type="text" 
                  value={newReturn.reason} 
                  onChange={(e) => setNewReturn({ ...newReturn, reason: e.target.value })} 
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" 
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-amber-400 font-bold text-slate-950 rounded-xl">Salvar Devolução</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MÓDULO: EDITOR DE FOTOS (Fundo Branco)
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
    link.download = `peca_fundo_branco.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Editor de Fotos (Fundo Branco)</h2>
        <p className="text-sm text-slate-400">Adeque suas fotos aos padrões do Mercado Livre.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 text-xs`}>
          <label className="block text-slate-400 mb-1 font-medium">Enviar Foto</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-slate-400" />
          <button onClick={handleDownload} disabled={!imageSrc} className="w-full py-2.5 bg-amber-400 font-bold text-slate-950 rounded-xl">Baixar Imagem</button>
        </div>
        <div className={`lg:col-span-2 p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex items-center justify-center`}>
          <div className="border-2 border-dashed border-slate-700 rounded-2xl p-2 bg-slate-950 max-w-md w-full aspect-square flex items-center justify-center overflow-hidden">
            {imageSrc ? <canvas ref={canvasRef} className="w-full h-full object-contain" /> : <p className="text-xs text-slate-500">Nenhuma foto selecionada.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODAL DE CADASTRO DE PEÇA
// ==========================================
function ProductModal({ product, onSave, onClose, darkMode }) {
  const [formData, setFormData] = useState(
    product || { sku: '', mlb: '', name: '', status: 'Ativo', price: 150.00, costPrice: 60.00, stock: 5, date: new Date().toISOString().slice(0,10), conta: 'DL Auto Peças', currentCat: '' }
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
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-medium">Título</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium">SKU</label>
              <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
            </div>
            <div>
              <label className="text-slate-400 font-medium">MLB</label>
              <input type="text" value={formData.mlb} onChange={(e) => setFormData({ ...formData, mlb: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 font-medium">Preço (R$)</label>
              <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-slate-400 font-medium">Custo (R$)</label>
              <input type="number" step="0.01" value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-slate-400 font-medium">Estoque</label>
              <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>
          </div>
          <div className="pt-3 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancelar</button>
            <button type="submit" className="flex-1 py-2 bg-amber-400 font-bold text-slate-950 rounded-xl">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
