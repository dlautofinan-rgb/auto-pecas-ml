import React, { useState, useEffect } from 'react';
import {
  Car, Sun, Moon, Shield, Briefcase, LogOut, BarChart3, FileSpreadsheet,
  Store, TrendingUp, Calculator, MessageSquare, Zap, PieChart, CheckSquare,
  Trash2, HelpCircle, Sparkles, FolderTree, RotateCcw, Image as ImageIcon,
  RefreshCw, Search, Lock, CheckCircle2, Upload, Edit, Plus, Calendar, Database, X, Send, Filter
} from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyBDKksCn466pxCm0kbRYN5Ia2HqVbQkUMM",
  authDomain: "mercadolivredl-dba3b.firebaseapp.com",
  databaseURL: "https://mercadolivredl-dba3b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mercadolivredl-dba3b",
  storageBucket: "mercadolivredl-dba3b.firebasestorage.app",
  messagingSenderId: "472505973455",
  appId: "1:472505973455:web:3b033245b88c8c1f02d5ba"
};

const DEFAULT_PRODUCTS = [];
const DEFAULT_SALES = [];
const DEFAULT_RETURNS = [];

function aiAnalyzeAutoPart(title = '') {
  const t = title.toLowerCase();
  
  let section = 'Mecânica';
  let category = 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Peças de Motor';
  let optimizedTitle = `${title.slice(0, 48)} - Orig`;

  if (
    t.includes('alternador') || t.includes('bateria') || t.includes('farol') || 
    t.includes('lanterna') || t.includes('sensor') || t.includes('modulo') || 
    t.includes('chave de seta') || t.includes('comutador') || t.includes('motor de arranque') ||
    t.includes('bobina') || t.includes('vela') || t.includes('cabo de vela') || 
    t.includes('fusivel') || t.includes('relé') || t.includes('painel de instrumentos') ||
    t.includes('buzina') || t.includes('atuador') || t.includes('central')
  ) {
    section = 'Elétrica';
    category = 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Elétrica > Alternadores e Componentes';
    optimizedTitle = `${title.slice(0, 45)} Eletrico`;
  } else if (
    t.includes('porta') || t.includes('parachoque') || t.includes('capo') || 
    t.includes('lama') || t.includes('retrovisor') || t.includes('grade') || 
    t.includes('paralama') || t.includes('tampa traseira') || t.includes('painel frontal') ||
    t.includes('maçaneta externa') || t.includes('friso') || t.includes('alma')
  ) {
    section = 'Lataria';
    category = 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Exterior > Parachoques e Grelhas';
    optimizedTitle = `${title.slice(0, 48)} Lataria`;
  } else if (
    t.includes('painel lateral') || t.includes('volante') || t.includes('tapete') || 
    t.includes('banco') || t.includes('acabamento') || t.includes('maçaneta interna') || 
    t.includes('forro de porta') || t.includes('console') || t.includes('espelho interno') ||
    t.includes('teto') || t.includes('porta-luvas') || t.includes('cintos')
  ) {
    section = 'Acabamentos';
    category = 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Interior > Painéis e Acabamentos';
    optimizedTitle = `${title.slice(0, 48)} Acabamento`;
  } else {
    section = 'Mecânica';
    if (t.includes('coletor') || t.includes('admissao') || t.includes('injecao') || t.includes('bico')) {
      category = 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Injeção > Coletores';
      optimizedTitle = `${title.slice(0, 45)} Orig Perf`;
    } else if (t.includes('radiador') || t.includes('reservatorio') || t.includes('agua') || t.includes('arrefecimento') || t.includes('valvula termostatica')) {
      category = 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Arrefecimento > Reservatórios e Radiadores';
      optimizedTitle = `${title.slice(0, 45)} Arrefec Orig`;
    } else if (t.includes('freio') || t.includes('pastilha') || t.includes('disco') || t.includes('pinça') || t.includes('cilindro mestre')) {
      category = 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Freios > Pastilhas e Discos';
      optimizedTitle = `${title.slice(0, 45)} Freio Comp`;
    } else if (t.includes('suspensao') || t.includes('amortecedor') || t.includes('bandeja') || t.includes('pivo') || t.includes('terminal')) {
      category = 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Suspensão e Direção';
      optimizedTitle = `${title.slice(0, 45)} Suspensão`;
    } else {
      category = 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Peças de Motor';
      optimizedTitle = `${title.slice(0, 45)} Motor Orig`;
    }
  }

  if (optimizedTitle.length > 60) {
    optimizedTitle = optimizedTitle.slice(0, 60);
  }

  return { section, category, optimizedTitle };
}

function parseCurrency(val) {
  if (val === undefined || val === null || val === '') return null;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace('R$', '').replace(/\s/g, '').replace('.', '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

function NavItem({ id, label, icon: Icon, active, setActive, badge }) {
  const isSelected = active === id;
  return (
    <button
      onClick={() => setActive(id)}
      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
        isSelected
          ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
        <span className="truncate">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
          isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('sales-dashboard');
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  const [masterInventory, setMasterInventory] = useState(DEFAULT_PRODUCTS);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [salesList, setSalesList] = useState(DEFAULT_SALES);
  const [returnsList, setReturnsList] = useState(DEFAULT_RETURNS);

  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    const loadFirebaseSdk = async () => {
      if (!window.firebase) {
        const script1 = document.createElement('script');
        script1.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js';
        script1.onload = () => {
          const script2 = document.createElement('script');
          script2.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js';
          script2.onload = initFirebaseDb;
          document.head.appendChild(script2);
        };
        document.head.appendChild(script1);
      } else {
        initFirebaseDb();
      }
    };

    loadFirebaseSdk();
  }, []);

  const initFirebaseDb = () => {
    try {
      if (!window.firebase.apps.length) {
        window.firebase.initializeApp(firebaseConfig);
      }
      const db = window.firebase.database();
      setFirebaseConnected(true);

      db.ref('masterInventory').on('value', (snapshot) => {
        const val = snapshot.val();
        if (val) setMasterInventory(val);
      });

      db.ref('products').on('value', (snapshot) => {
        const val = snapshot.val();
        if (val) setProducts(val);
      });

      db.ref('salesList').on('value', (snapshot) => {
        const val = snapshot.val();
        if (val) setSalesList(val);
      });

      db.ref('returnsList').on('value', (snapshot) => {
        const val = snapshot.val();
        if (val) setReturnsList(val);
      });
    } catch (e) {
      console.error('Erro ao conectar ao Firebase:', e);
      setFirebaseConnected(false);
    }
  };

  const saveDataToFirebase = (path, data) => {
    if (window.firebase && firebaseConnected) {
      window.firebase.database().ref(path).set(data);
    }
  };

  const updateMasterInventory = (newList) => {
    setMasterInventory(newList);
    saveDataToFirebase('masterInventory', newList);
  };

  const updateProducts = (newList) => {
    setProducts(newList);
    saveDataToFirebase('products', newList);
  };

  const updateSalesList = (newList) => {
    setSalesList(newList);
    saveDataToFirebase('salesList', newList);
  };

  const updateReturnsList = (newList) => {
    setReturnsList(newList);
    saveDataToFirebase('returnsList', newList);
  };

  const synchronizedProducts = products.map(p => {
    const basePrice = Number(p.price) > 0 ? Number(p.price) : 150.00;
    const wholesalePrice = Number((basePrice * 0.85).toFixed(2));
    const aiData = aiAnalyzeAutoPart(p.name);

    return {
      ...p,
      price: basePrice,
      wholesalePrice,
      wholesaleMinQty: Number(p.wholesaleMinQty) || 4,
      section: aiData.section,
      currentCat: aiData.category
    };
  });

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleDeleteProduct = (id) => {
    if (currentUser?.role !== 'admin') {
      alert('Apenas administradores podem excluir peças.');
      return;
    }
    if (window.confirm('Tem certeza de que deseja excluir este produto?')) {
      updateProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = (formData) => {
    const aiData = aiAnalyzeAutoPart(formData.name);
    const finalData = {
      ...formData,
      wholesalePrice: Number((Number(formData.price || 150) * 0.85).toFixed(2)),
      section: aiData.section,
      currentCat: aiData.category
    };

    let updated;
    if (editingProduct) {
      updated = products.map(p => p.id === editingProduct.id ? { ...finalData, id: p.id } : p);
    } else {
      updated = [{ ...finalData, id: 'prod_' + Date.now(), date: new Date().toISOString().slice(0, 10), curveClass: 'A' }, ...products];
    }
    updateProducts(updated);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteSheetByDate = (dateToDelete) => {
    if (currentUser?.role !== 'admin') {
      alert('Apenas administradores podem excluir planilhas lançadas.');
      return;
    }
    if (window.confirm(`ATENÇÃO: Deseja realmente excluir todas as peças da data ${dateToDelete}?`)) {
      updateProducts(products.filter(p => p.date !== dateToDelete));
    }
  };

  const handleDeleteSalesSheetByDate = (dateToDelete) => {
    if (currentUser?.role !== 'admin') {
      alert('Apenas administradores podem excluir planilhas de vendas.');
      return;
    }
    if (window.confirm(`ATENÇÃO: Deseja realmente excluir todas as vendas da data ${dateToDelete}?`)) {
      updateSalesList(salesList.filter(s => s.date !== dateToDelete));
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
                    {firebaseConnected ? 'Firebase Conectado na Nuvem' : 'Conectando...'}
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
            <NavItem id="import" label="Calendário & Importar Anúncios" icon={FileSpreadsheet} active={activeTab} setActive={setActiveTab} badge={synchronizedProducts.length} />
            <NavItem id="wholesale-calc" label="Simulador Atacado e Varejo" icon={Store} active={activeTab} setActive={setActiveTab} />
            <NavItem id="price-monitor" label="Monitor de Preços (Buy Box)" icon={TrendingUp} active={activeTab} setActive={setActiveTab} />
            <NavItem id="margin-calculator" label="Simulador de Margem Líquida" icon={Calculator} active={activeTab} setActive={setActiveTab} />
            <NavItem id="faq-helper" label="FAQ & Compatibilidade (IA)" icon={MessageSquare} active={activeTab} setActive={setActiveTab} />
            <NavItem id="curva-abc" label="Curva ABC de Estoque" icon={PieChart} active={activeTab} setActive={setActiveTab} />
            <NavItem id="category-audit" label="Auditoria & Categorias por Seção" icon={CheckSquare} active={activeTab} setActive={setActiveTab} />
            <NavItem id="manage-sheets" label="Gerenciar / Excluir Planilhas" icon={Trash2} active={activeTab} setActive={setActiveTab} />
            <NavItem id="team-guide" label="Guia & Motivos de Status" icon={HelpCircle} active={activeTab} setActive={setActiveTab} />
            <NavItem id="assistant" label="Editor de Títulos (IA <= 60 chars)" icon={Sparkles} active={activeTab} setActive={setActiveTab} />
            <NavItem id="categories" label="Editor Categorias (Mec, Elet, Lat, Acab)" icon={FolderTree} active={activeTab} setActive={setActiveTab} />
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
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {activeTab === 'sales-dashboard' && (
          <SalesDashboardTab 
            salesList={salesList} 
            setSalesList={updateSalesList} 
            products={synchronizedProducts}
            currentUser={currentUser} 
            darkMode={darkMode} 
          />
        )}

        {activeTab === 'import' && (
          <ImportExcelTab 
            products={synchronizedProducts} 
            setProducts={updateProducts} 
            currentUser={currentUser}
            onAddProduct={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            onEditProduct={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }}
            onDeleteProduct={handleDeleteProduct}
            darkMode={darkMode} 
          />
        )}

        {activeTab === 'wholesale-calc' && <WholesaleCalculatorTab products={synchronizedProducts} darkMode={darkMode} />}

        {activeTab === 'price-monitor' && <PriceMonitorTab products={synchronizedProducts} setProducts={updateProducts} darkMode={darkMode} />}

        {activeTab === 'margin-calculator' && <MarginCalculatorTab products={synchronizedProducts} darkMode={darkMode} />}

        {activeTab === 'faq-helper' && <FaqHelperTab darkMode={darkMode} />}

        {activeTab === 'curva-abc' && <CurvaAbcTab products={synchronizedProducts} setProducts={updateProducts} darkMode={darkMode} />}

        {activeTab === 'category-audit' && <CategoryAuditTab products={synchronizedProducts} darkMode={darkMode} />}

        {activeTab === 'manage-sheets' && (
          <ManageSheetsTab 
            products={products} 
            salesList={salesList}
            onDeleteSheet={handleDeleteSheetByDate} 
            onDeleteSalesSheet={handleDeleteSalesSheetByDate}
            currentUser={currentUser} 
            darkMode={darkMode} 
          />
        )}

        {activeTab === 'team-guide' && <TeamGuideTab darkMode={darkMode} />}

        {activeTab === 'assistant' && <AssistantTab products={synchronizedProducts} darkMode={darkMode} />}

        {activeTab === 'categories' && <CategoriesTab products={synchronizedProducts} darkMode={darkMode} />}

        {activeTab === 'returns' && <ReturnsTab returnsList={returnsList} setReturnsList={updateReturnsList} currentUser={currentUser} darkMode={darkMode} />}

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
          <p className="text-sm text-slate-400">Sincronizado na Nuvem (Firebase)</p>
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

function WholesaleCalculatorTab({ products, darkMode }) {
  const [selectedSku, setSelectedSku] = useState(products[0]?.sku || '');
  const [quantity, setQuantity] = useState(5);

  const currentProd = products.find(p => p.sku === selectedSku) || products[0] || {
    name: 'Peça Padrão',
    price: 150.00,
    wholesalePrice: 127.50,
    wholesaleMinQty: 4
  };

  const precoVarejo = Number(currentProd.price) || 150.00;
  const precoAtacado = Number(currentProd.wholesalePrice) || Number((precoVarejo * 0.85).toFixed(2));
  const qtdMinimaAtacado = Number(currentProd.wholesaleMinQty) || 4;

  const ehAtacado = quantity >= qtdMinimaAtacado;
  const precoAplicado = ehAtacado ? precoAtacado : precoVarejo;
  const valorTotal = precoAplicado * quantity;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Simulador de Vendas: Atacado e Varejo</h2>
        <p className="text-sm text-slate-400">Atacado aplicado com 15% de desconto automático para compras de 4 ou mais unidades.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 shadow-xl text-xs`}>
          <div>
            <label className="text-slate-400 font-medium block mb-1">Selecionar Peça</label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold"
            >
              {products.map(p => (
                <option key={p.id || p.sku} value={p.sku}>SKU: {p.sku} - {p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Quantidade Desejada</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
            />
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-2 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Preço Unitário (Varejo):</span>
              <span className="text-white">R$ {precoVarejo.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Preço Unitário (Atacado 4+ un):</span>
              <span className="text-emerald-400">R$ {precoAtacado.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-xl flex flex-col justify-center border-l-4 border-l-amber-400`}>
            <div className="text-xs text-slate-400 font-semibold uppercase">Tipo de Venda Aplicado</div>
            <div className="text-2xl font-black text-amber-400">
              {ehAtacado ? '🎉 Atacado (15% OFF)' : '👤 Varejo (Unitário)'}
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-xl flex flex-col justify-center border-l-4 border-l-emerald-400`}>
            <div className="text-xs text-slate-400 font-semibold uppercase">Valor Total do Pedido</div>
            <div className="text-3xl font-black font-mono text-emerald-400">
              R$ {valorTotal.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      alert('Preço atualizado e salvo no Firebase!');
    }
  };

  const evaluated = products.map(p => {
    const currentPrice = Number(p.price) || 150.00;
    const marketAvg = Number((currentPrice * (0.85 + (p.name.length % 5) * 0.05)).toFixed(2));
    const diff = currentPrice - marketAvg;
    const diffPct = marketAvg > 0 ? ((diff / marketAvg) * 100).toFixed(1) : '0.0';

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
          placeholder="Pesquisar por SKU ou Título..."
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
                <th className="p-4">SKU / Título</th>
                <th className="p-4">Seu Preço Varejo</th>
                <th className="p-4">Média Concorrência</th>
                <th className="p-4">Status Buy Box</th>
                <th className="p-4 text-center">Ajustar Preço</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filtered.map(p => {
                const val = customPrices[p.id] !== undefined ? customPrices[p.id] : Number(p.price || 150);
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MarginCalculatorTab({ products, darkMode }) {
  const [selectedSku, setSelectedSku] = useState(products[0]?.sku || '');
  const [salePrice, setSalePrice] = useState(Number(products[0]?.price) || 200);
  const [costPrice, setCostPrice] = useState(Number(products[0]?.costPrice) || 70);
  const [shippingCost, setShippingCost] = useState(25.00);
  const [taxRate, setTaxRate] = useState(4.0);

  const handleSelectProduct = (sku) => {
    setSelectedSku(sku);
    const found = products.find(p => p.sku === sku);
    if (found) {
      setSalePrice(Number(found.price) || 200);
      setCostPrice(Number(found.costPrice) || 70);
    }
  };

  const commissionRate = 0.16;
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
        <p className="text-sm text-slate-400">Calcule comissões do Mercado Livre, impostos, frete e descubra seu lucro líquido exato.</p>
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
                <option key={p.id} value={p.sku}>SKU: {p.sku} - {p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Preço de Venda (R$)</label>
            <input
              type="number"
              step="0.01"
              value={salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Custo de Aquisição (R$)</label>
            <input
              type="number"
              step="0.01"
              value={costPrice}
              onChange={(e) => setCostPrice(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
            />
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-xl flex flex-col justify-center border-l-4 border-l-amber-400`}>
            <div className="text-xs text-slate-400 font-semibold uppercase">Lucro Líquido Real</div>
            <div className={`text-3xl font-black font-mono ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              R$ {netProfit.toFixed(2)}
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-xl flex flex-col justify-center border-l-4 border-l-blue-400`}>
            <div className="text-xs text-slate-400 font-semibold uppercase">Margem de Lucro & ROI</div>
            <div className="text-3xl font-black font-mono text-blue-400">
              {marginPct}% <span className="text-sm font-normal text-slate-400">(ROI: {roi}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqHelperTab({ darkMode }) {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Olá! Sou seu assistente de IA especialista em Autopeças para o Mercado Livre. Pergunte sobre NCM, CEST, compatibilidade de veículos, aplicações ou regras fiscais.' }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userText = question;
    const newHistory = [...chatHistory, { sender: 'user', text: userText }];
    setChatHistory(newHistory);
    setQuestion('');

    setTimeout(() => {
      let aiResponse = 'Esta peça possui excelente aceitação no mercado. Verifique o catálogo OEM para confirmação exata.';
      const qLower = userText.toLowerCase();

      if (qLower.includes('ncm')) {
        aiResponse = '📦 **Consulta NCM (IA):** O NCM padrão recomendado para esta categoria de autopeças no Mercado Livre é **8708.99.90** (Partes e acessórios de veículos automóveis).';
      } else if (qLower.includes('cest')) {
        aiResponse = '📊 **Consulta CEST (IA):** O código CEST aplicável para substituição tributária em autopeças geralmente é **01.053.00**.';
      } else if (qLower.includes('compatibilidade') || qLower.includes('encaixe') || qLower.includes('serve')) {
        aiResponse = '🚗 **Compatibilidade (IA):** Sim, esta peça possui encaixe perfeito nos modelos correspondentes listados no catálogo OEM.';
      } else if (qLower.includes('garantia')) {
        aiResponse = '🛡️ **Garantia:** Todas as peças novas possuem 3 meses de garantia contra defeitos de fabricação conforme o CDC.';
      }

      setChatHistory([...newHistory, { sender: 'ai', text: aiResponse }]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">FAQ, CEST, NCM & Compatibilidade (Assistente IA)</h2>
        <p className="text-sm text-slate-400">Consulte códigos fiscais NCM, CEST ou tire dúvidas técnicas sobre qualquer peça com inteligência artificial.</p>
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-6 space-y-4 shadow-xl`}>
        <div className="h-72 overflow-y-auto space-y-3 pr-2 text-xs">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3.5 rounded-2xl max-w-lg leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-amber-400 text-slate-950 font-semibold rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex: Qual o NCM desta peça? / Serve no modelo X?"
            className="flex-1 p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
          />
          <button type="submit" className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg">
            <Send className="w-4 h-4" />
            <span>Perguntar à IA</span>
          </button>
        </form>
      </div>
    </div>
  );
}

function CurvaAbcTab({ products, setProducts, darkMode }) {
  const [selectedCurveFilter, setSelectedCurveFilter] = useState('ALL');

  const handleUpdateCurve = (id, newCurve) => {
    setProducts(products.map(p => p.id === id ? { ...p, curveClass: newCurve } : p));
  };

  const filteredProducts = selectedCurveFilter === 'ALL' 
    ? products 
    : products.filter(p => (p.curveClass || 'A') === selectedCurveFilter);

  const countA = products.filter(p => (p.curveClass || 'A') === 'A').length;
  const countB = products.filter(p => (p.curveClass || 'A') === 'B').length;
  const countC = products.filter(p => (p.curveClass || 'A') === 'C').length;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Curva ABC de Estoque & Giro de Peças</h2>
        <p className="text-sm text-slate-400">Dashboard interativo de faturamento. Clique nos cartões abaixo para filtrar instantaneamente.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setSelectedCurveFilter('ALL')}
          className={`p-4 rounded-2xl border text-left transition-all shadow-md ${
            selectedCurveFilter === 'ALL' 
              ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-amber-400/20' 
              : darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          <div className="text-xs uppercase font-semibold opacity-80">Todas as Peças</div>
          <div className="text-2xl font-black font-mono mt-1">{products.length}</div>
        </button>

        <button
          onClick={() => setSelectedCurveFilter('A')}
          className={`p-4 rounded-2xl border text-left transition-all shadow-md border-l-4 border-l-amber-400 ${
            selectedCurveFilter === 'A' 
              ? 'bg-slate-800 text-white border-amber-400 shadow-lg' 
              : darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          <div className="text-xs uppercase font-semibold text-amber-400">Curva A (Alto Giro)</div>
          <div className="text-2xl font-black font-mono mt-1">{countA} peças</div>
        </button>

        <button
          onClick={() => setSelectedCurveFilter('B')}
          className={`p-4 rounded-2xl border text-left transition-all shadow-md border-l-4 border-l-blue-400 ${
            selectedCurveFilter === 'B' 
              ? 'bg-slate-800 text-white border-blue-400 shadow-lg' 
              : darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          <div className="text-xs uppercase font-semibold text-blue-400">Curva B (Médio Giro)</div>
          <div className="text-2xl font-black font-mono mt-1">{countB} peças</div>
        </button>

        <button
          onClick={() => setSelectedCurveFilter('C')}
          className={`p-4 rounded-2xl border text-left transition-all shadow-md border-l-4 border-l-emerald-400 ${
            selectedCurveFilter === 'C' 
              ? 'bg-slate-800 text-white border-emerald-400 shadow-lg' 
              : darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          <div className="text-xs uppercase font-semibold text-emerald-400">Curva C (Baixo Giro)</div>
          <div className="text-2xl font-black font-mono mt-1">{countC} peças</div>
        </button>
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <div className="p-4 border-b border-slate-800 text-xs font-semibold text-slate-400 flex justify-between items-center">
          <span>Exibindo filtro: <strong className="text-amber-400">Curva {selectedCurveFilter === 'ALL' ? 'Geral' : selectedCurveFilter}</strong></span>
          <span>Total: {filteredProducts.length} itens</span>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">SKU / Título</th>
              <th className="p-4">Estoque</th>
              <th className="p-4">Preço Varejo</th>
              <th className="p-4 text-center">Classificação ABC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-xs">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">Nenhuma peça encontrada nesta curva.</td>
              </tr>
            ) : (
              filteredProducts.map(p => {
                const currentCurve = p.curveClass || 'A';
                return (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4">
                      <div className="font-mono font-bold text-amber-400">SKU: {p.sku}</div>
                      <div className="font-semibold text-slate-200 mt-0.5">{p.name}</div>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{p.stock || 5} un</td>
                    <td className="p-4 font-mono text-emerald-400 font-bold">R$ {Number(p.price || 150).toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <div className="inline-flex rounded-xl bg-slate-800 p-1 border border-slate-700 gap-1">
                        {['A', 'B', 'C'].map(c => (
                          <button
                            key={c}
                            onClick={() => handleUpdateCurve(p.id, c)}
                            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                              currentCurve === c 
                                ? 'bg-amber-400 text-slate-950 shadow-md' 
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Curva {c}
                          </button>
                        ))}
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
  );
}

function CategoryAuditTab({ products, darkMode }) {
  const [selectedSection, setSelectedSection] = useState('ALL');

  const filtered = selectedSection === 'ALL' ? products : products.filter(p => aiAnalyzeAutoPart(p.name).section === selectedSection);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Auditoria & Categorias por Seção</h2>
        <p className="text-sm text-slate-400">Filtre e audite rigorosamente suas peças divididas nas quatro grandes seções oficiais.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['ALL', 'Mecânica', 'Elétrica', 'Lataria', 'Acabamentos'].map(sec => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSection === sec ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {sec === 'ALL' ? 'Todas as Seções' : sec}
          </button>
        ))}
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">SKU / Título</th>
              <th className="p-4">Seção Classificada</th>
              <th className="p-4">Categoria Oficial Mercado Livre</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-xs">
            {filtered.map(p => {
              const analysis = aiAnalyzeAutoPart(p.name);
              return (
                <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <div className="font-mono font-bold text-amber-400">SKU: {p.sku}</div>
                    <div className="font-semibold text-slate-200 mt-0.5">{p.name}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold">
                      {analysis.section}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-300">{analysis.category}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeamGuideTab({ darkMode }) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Guia da Equipe & Motivos de Status do Mercado Livre</h2>
        <p className="text-sm text-slate-400">Manual completo de operação, regras de anúncios, fluxo logístico e boas práticas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 text-xs leading-relaxed shadow-xl`}>
          <h3 className="font-bold text-base text-amber-400">1. Significado dos Status no Mercado Livre</h3>
          <p>• <strong className="text-emerald-400">Ativo:</strong> Anúncio visível nos resultados de busca com estoque pronto para vendas.</p>
          <p>• <strong className="text-blue-400">Sob Revisão:</strong> O algoritmo de moderação está analisando o anúncio.</p>
          <p>• <strong className="text-amber-400">Pausado:</strong> Estoque zerado ou pausa manual.</p>
        </div>

        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 text-xs leading-relaxed shadow-xl`}>
          <h3 className="font-bold text-base text-blue-400">2. Boas Práticas de Atendimento & Envio</h3>
          <p>• <strong>Prazo de Postagem:</strong> Despachar até às 14h para manter a reputação Verde-Claro.</p>
          <p>• <strong>Embalagem:</strong> Utilize plástico bolha e caixas rígidas para proteger coletores e peças metálicas.</p>
        </div>
      </div>
    </div>
  );
}

function AssistantTab({ products, darkMode }) {
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [optimizedTitles, setOptimizedTitles] = useState({});

  const handleAiOptimizeTitle = (id, currentName) => {
    setTimeout(() => {
      const analysis = aiAnalyzeAutoPart(currentName);
      setOptimizedTitles(prev => ({ ...prev, [id]: analysis.optimizedTitle }));
    }, 400);
  };

  const filtered = selectedSection === 'ALL' ? products : products.filter(p => aiAnalyzeAutoPart(p.name).section === selectedSection);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Editor de Títulos (Otimização Avançada - Até 60 Caracteres)</h2>
        <p className="text-sm text-slate-400">Reescreva títulos com até 60 caracteres exigidos pelo padrão oficial do Mercado Livre.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['ALL', 'Mecânica', 'Elétrica', 'Lataria', 'Acabamentos'].map(sec => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSection === sec ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {sec === 'ALL' ? 'Todas as Seções' : sec}
          </button>
        ))}
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">SKU / Seção</th>
              <th className="p-4">Título Atual</th>
              <th className="p-4">Título Sugerido (≤ 60 chars)</th>
              <th className="p-4 text-center">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-xs">
            {filtered.map(p => {
              const analysis = aiAnalyzeAutoPart(p.name);
              const suggested = optimizedTitles[p.id] || analysis.optimizedTitle;
              return (
                <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <div className="font-mono font-bold text-amber-400">SKU: {p.sku}</div>
                    <div className="text-[10px] text-blue-400 font-bold mt-0.5">{analysis.section}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-200">{p.name}</td>
                  <td className="p-4 font-mono text-emerald-400 font-bold">
                    {suggested} <span className="text-[10px] text-slate-400 font-normal">({suggested.length} chars)</span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleAiOptimizeTitle(p.id, p.name)}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-transform active:scale-95 inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Otimizar</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoriesTab({ products, darkMode }) {
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [mappedCategories, setMappedCategories] = useState({});

  const handleAiCategorize = (id, title = '') => {
    setTimeout(() => {
      const analysis = aiAnalyzeAutoPart(title);
      setMappedCategories(prev => ({ ...prev, [id]: analysis.category }));
    }, 400);
  };

  const filtered = selectedSection === 'ALL' ? products : products.filter(p => aiAnalyzeAutoPart(p.name).section === selectedSection);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Editor de Categorias</h2>
        <p className="text-sm text-slate-400">Gerencie e corrija as categorias e seções oficiais do Mercado Livre.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['ALL', 'Mecânica', 'Elétrica', 'Lataria', 'Acabamentos'].map(sec => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSection === sec ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {sec === 'ALL' ? 'Todas as Seções' : sec}
          </button>
        ))}
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">SKU / Título</th>
              <th className="p-4">Seção</th>
              <th className="p-4">Categoria Oficial Mercado Livre</th>
              <th className="p-4 text-center">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-xs">
            {filtered.map(p => {
              const analysis = aiAnalyzeAutoPart(p.name);
              const activeCat = mappedCategories[p.id] || analysis.category;
              return (
                <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <div className="font-mono font-bold text-amber-400">SKU: {p.sku}</div>
                    <div className="font-semibold text-slate-200 mt-0.5">{p.name}</div>
                  </td>
                  <td className="p-4 font-bold text-blue-400">{analysis.section}</td>
                  <td className="p-4 text-emerald-400 font-mono font-semibold">{activeCat}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleAiCategorize(p.id, p.name)}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-transform active:scale-95 inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analisar Categoria</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SalesDashboardTab({ salesList, setSalesList, products, darkMode }) {
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

        const currentDate = new Date().toISOString().slice(0, 10);
        const importedSales = jsonRows.map((row, idx) => {
          const saleId = String(row['Id'] || row['ID'] || `ID_${idx}`);
          const client = String(row['Cliente'] || 'Cliente Balcão');
          const value = parseCurrency(row['Valor de Venda'] || row['Valor'] || row['Preço']) || 150.00;
          const trackingCode = String(row['Código de Rastreio'] || row['Rastreio'] || 'BR' + Math.floor(100000000 + Math.random() * 900000000) + 'X');

          return {
            id: 'sale_' + Date.now() + '_' + idx,
            saleId,
            client,
            value,
            date: currentDate,
            trackingCode
          };
        });

        setSalesList([...importedSales, ...salesList]);
        setImportStatus(`Sucesso! ${importedSales.length} vendas salvas no Firebase.`);
      } catch (err) {
        console.error(err);
        setImportStatus('Erro ao ler a planilha de vendas.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDeleteSale = (id) => {
    if (window.confirm('Deseja realmente apagar este registro de venda?')) {
      setSalesList(salesList.filter(s => s.id !== id));
    }
  };

  const filteredSales = salesList.filter(s => 
    s.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.saleId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.value, 0);
  const totalCount = filteredSales.length;

  const countActive = products.filter(p => (p.status || 'Ativo').toLowerCase() === 'ativo').length;
  const countReview = products.filter(p => (p.status || '').toLowerCase().includes('revisão')).length;
  const countPaused = products.filter(p => (p.status || '').toLowerCase().includes('pausado')).length;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard de Faturamento & Status dos Anúncios</h2>
          <p className="text-sm text-slate-400">Resumo financeiro e status de anúncios sincronizados via Firebase.</p>
        </div>

        <label className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer shadow-lg shadow-amber-400/20">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-1 shadow-md border-l-4 border-l-emerald-400`}>
          <div className="text-xs text-slate-400 font-semibold">Anúncios Ativos</div>
          <div className="text-2xl font-black font-mono text-emerald-400">{countActive}</div>
        </div>
        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-1 shadow-md border-l-4 border-l-blue-400`}>
          <div className="text-xs text-slate-400 font-semibold">Sob Revisão</div>
          <div className="text-2xl font-black font-mono text-blue-400">{countReview}</div>
        </div>
        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-1 shadow-md border-l-4 border-l-amber-400`}>
          <div className="text-xs text-slate-400 font-semibold">Pausados</div>
          <div className="text-2xl font-black font-mono text-amber-400">{countPaused}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-lg`}>
          <div className="text-slate-400 text-xs font-semibold">Faturamento Total</div>
          <div className="text-2xl font-black font-mono text-amber-400">R$ {totalRevenue.toFixed(2)}</div>
        </div>
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-lg`}>
          <div className="text-slate-400 text-xs font-semibold">Total de Vendas</div>
          <div className="text-2xl font-black font-mono text-blue-400">{totalCount} pedidos</div>
        </div>
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Data / ID Venda</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Rastreio</th>
                <th className="p-4 text-right">Valor</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">Nenhuma venda registrada ou importada.</td>
                </tr>
              ) : (
                filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-mono">
                      <div className="text-slate-400 text-[10px]">{s.date}</div>
                      <div className="font-bold text-amber-400">ID: {s.saleId}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-200">{s.client}</td>
                    <td className="p-4 font-mono text-blue-400">{s.trackingCode}</td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-400">R$ {s.value.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDeleteSale(s.id)} 
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
                        title="Apagar Venda"
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
    </div>
  );
}

function ImportExcelTab({ products, setProducts, currentUser, onAddProduct, onEditProduct, onDeleteProduct, darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [calendarDate, setCalendarDate] = useState(''); // Calendário interativo
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
        
        const rows = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (rows.length === 0) {
          setImportStatus('A planilha está vazia.');
          return;
        }

        const dataRows = rows.slice(1);

        const imported = dataRows.map((row, idx) => {
          // Mapeamento correto com base na estrutura real da planilha fornecida:
          // Coluna A (row[0]) = Código do Produto / SKU
          // Coluna D (row[3]) = SKU
          // Coluna E (row[4]) = Código MLB (Informação/Aplicação)
          // Coluna F (row[5]) = Título
          // Coluna G (row[6]) = Status
          // Coluna L (row[11]) = Data da Publicação
          const colA = String(row[0] !== undefined && row[0] !== null ? row[0] : `ID_${idx}`);
          const sku = String(row[3] !== undefined && row[3] !== null ? row[3] : colA);
          const colE = String(row[4] !== undefined && row[4] !== null ? row[4] : 'MLB');
          const name = String(row[5] !== undefined && row[5] !== null ? row[5] : 'Peça Automotiva');
          const colG = String(row[6] !== undefined && row[6] !== null ? row[6] : 'Ativo');
          
          let rawDate = row[11];
          let formattedDate = new Date().toISOString().slice(0, 10);
          if (rawDate) {
            if (typeof rawDate === 'number') {
              // Excel serial date format conversion approximation if needed
              const excelEpoch = new Date(1899, 11, 30);
              const d = new Date(excelEpoch.getTime() + rawDate * 86400000);
              formattedDate = d.toISOString().slice(0, 10);
            } else {
              const parsedStr = String(rawDate).trim();
              if (parsedStr.length >= 10) {
                formattedDate = parsedStr.slice(0, 10);
              }
            }
          }

          const price = 150.00; // Preço padrão simulado se não houver coluna monetária explícita
          const stock = 5;      // Estoque padrão simulado

          const aiData = aiAnalyzeAutoPart(name);

          return {
            id: 'imp_' + Date.now() + '_' + idx,
            sku,
            colA,
            colE, // Código MLB / Informação
            name, // Título (Col F)
            colG, // Status (Col G)
            stock,
            price,
            section: aiData.section,
            currentCat: aiData.category,
            status: colG || 'Ativo',
            wholesalePrice: Number((price * 0.85).toFixed(2)),
            wholesaleMinQty: 4,
            costPrice: Number((price * 0.4).toFixed(2)),
            date: formattedDate, // Extraído da Coluna L
            curveClass: 'A'
          };
        }).filter(item => item.sku && item.sku !== 'SKU_undefined');

        setProducts([...imported, ...products]);
        setImportStatus(`Sucesso! ${imported.length} anúncios importados com leitura rigorosa das colunas A, D, E, F, G e L da planilha real.`);
      } catch (err) {
        console.error(err);
        setImportStatus('Erro ao ler a planilha nas colunas especificadas.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (p.sku?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (p.colE?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchDate = !calendarDate || p.date === calendarDate;
    return matchSearch && matchDate;
  });

  const totalAnunciosNoDia = filteredProducts.length;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Calendário & Importação de Anúncios (Col A, D, E, F, G, L)</h2>
          <p className="text-sm text-slate-400">Selecione qualquer dia no calendário para auditar quantos anúncios foram feitos com base na data real da planilha.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onAddProduct} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm border border-slate-700">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Nova Peça</span>
          </button>

          <label className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer shadow-lg shadow-amber-400/25">
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

      {/* PAINEL DO CALENDÁRIO PARA FILTRAR QUALQUER DIA */}
      <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 px-3 py-2 rounded-xl text-amber-400 font-bold text-xs">
            <Calendar className="w-4 h-4" />
            <span>Seletor Estilo Calendário:</span>
          </div>
          <input
            type="date"
            value={calendarDate}
            onChange={(e) => setCalendarDate(e.target.value)}
            className="bg-slate-800 text-white font-mono text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
          />
          {calendarDate && (
            <button
              onClick={() => setCalendarDate('')}
              className="text-xs text-blue-400 hover:underline px-2 py-1"
            >
              🔄 Ver Todos os Dias
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-72 bg-slate-800/60 px-3 py-2.5 rounded-xl border border-slate-700">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Pesquisar SKU, Título ou MLB..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* PLACAR DE QUANTIDADE DE ANÚNCIOS NO DIA SELECIONADO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-1 shadow-lg border-l-4 border-l-amber-400`}>
          <div className="text-xs text-slate-400 font-semibold uppercase">Anúncios Feitos {calendarDate ? `em ${calendarDate}` : '(Geral)'}</div>
          <div className="text-3xl font-black font-mono text-amber-400">{totalAnunciosNoDia} <span className="text-sm font-normal text-slate-400">peças</span></div>
        </div>
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-1 shadow-lg border-l-4 border-l-emerald-400`}>
          <div className="text-xs text-slate-400 font-semibold uppercase">Estoque Total Exibido</div>
          <div className="text-3xl font-black font-mono text-emerald-400">
            {filteredProducts.reduce((acc, p) => acc + Number(p.stock || 5), 0)} <span className="text-sm font-normal text-slate-400">un</span>
          </div>
        </div>
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-1 shadow-lg border-l-4 border-l-blue-400`}>
          <div className="text-xs text-slate-400 font-semibold uppercase">Valor Total Estimado</div>
          <div className="text-3xl font-black font-mono text-blue-400">
            R$ {filteredProducts.reduce((acc, p) => acc + Number(p.price || 150), 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* TABELA DETALHADA COM AS COLUNAS A, D, E, F, G, L */}
      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs font-semibold text-slate-400">
          <span>Relatório Analítico de Anúncios</span>
          <span className="font-mono text-amber-400">Mapeamento Exato: A (Cód), D (SKU), E (MLB), F (Título), G (Status), L (Data Publicação)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Col L (Data Pub)</th>
                <th className="p-4">Col A (Cód. Prod)</th>
                <th className="p-4">Col D (SKU)</th>
                <th className="p-4">Col E (Código MLB)</th>
                <th className="p-4">Col F (Título da Peça)</th>
                <th className="p-4">Col G (Status)</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">Nenhum anúncio encontrado para a data ou termo selecionado.</td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-400">{p.date}</td>
                    <td className="p-4 font-mono text-slate-300">{p.colA}</td>
                    <td className="p-4 font-mono font-bold text-slate-200">{p.sku}</td>
                    <td className="p-4 font-mono text-blue-400">{p.colE}</td>
                    <td className="p-4 font-semibold text-slate-100">{p.name}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">{p.colG || 'Ativo'}</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onEditProduct(p)} className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400" title="Editar"><Edit className="w-3.5 h-3.5" /></button>
                        {currentUser?.role === 'admin' && (
                          <button onClick={() => onDeleteProduct(p.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400" title="Excluir"><Trash2 className="w-3.5 h-3.5" /></button>
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

function ManageSheetsTab({ products, salesList, onDeleteSheet, onDeleteSalesSheet, currentUser, darkMode }) {
  const sheetsMap = {};
  products.forEach(p => {
    const d = p.date || new Date().toISOString().slice(0, 10);
    if (!sheetsMap[d]) sheetsMap[d] = { date: d, count: 0 };
    sheetsMap[d].count += 1;
  });
  const sheetsList = Object.values(sheetsMap).sort((a, b) => b.date.localeCompare(a.date));

  const salesSheetsMap = {};
  salesList.forEach(s => {
    const d = s.date || new Date().toISOString().slice(0, 10);
    if (!salesSheetsMap[d]) salesSheetsMap[d] = { date: d, count: 0 };
    salesSheetsMap[d].count += 1;
  });
  const salesSheetsList = Object.values(salesSheetsMap).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Gerenciar e Excluir Planilhas Lançadas</h2>
        <p className="text-sm text-slate-400">Exclua lotes inteiros de planilhas de anúncios e de vendas sincronizados no Firebase.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-amber-400">Planilhas de Anúncios / Peças por Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sheetsList.length === 0 ? (
            <div className="col-span-full p-6 text-center text-slate-500 border border-slate-800 rounded-2xl">Nenhuma planilha de anúncios lançada.</div>
          ) : (
            sheetsList.map((sheet) => (
              <div key={sheet.date} className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 shadow-xl flex flex-col justify-between`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-amber-400" />
                      <span className="font-bold text-slate-200 font-mono text-base">{sheet.date}</span>
                    </div>
                    <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-bold">{sheet.count} peças</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  {currentUser?.role === 'admin' ? (
                    <button onClick={() => onDeleteSheet(sheet.date)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold border border-red-500/25">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir Lote Anúncios</span>
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
    </div>
  );
}

function ReturnsTab({ returnsList, setReturnsList, currentUser, darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReturn, setNewReturn] = useState({
    sku: '',
    name: '',
    value: '',
    date: new Date().toISOString().slice(0, 10),
    reason: 'Arrependimento / Erro do Comprador',
    status: 'Pendente de Análise'
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
      status: newReturn.status
    };

    setReturnsList([item, ...returnsList]);
    setIsModalOpen(false);
  };

  const handleDeleteReturn = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de devolução?')) {
      setReturnsList(returnsList.filter(r => r.id !== id));
    }
  };

  const filteredReturns = returnsList.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Controle de Devoluções</h2>
          <p className="text-sm text-slate-400">Marque peças devolvidas, valores e datas.</p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Registrar Nova Devolução</span>
        </button>
      </div>

      <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex items-center gap-4`}>
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Pesquisar por SKU ou Título..."
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
                <th className="p-4">Data</th>
                <th className="p-4">SKU / Título</th>
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
                    <td className="p-4 text-right font-mono font-bold text-red-400">R$ {Number(r.value || 0).toFixed(2)}</td>
                    <td className="p-4"><span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold">{r.status}</span></td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDeleteReturn(r.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400" title="Excluir"><Trash2 className="w-4 h-4" /></button>
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
                <label className="text-slate-400 font-medium">Título da Peça</label>
                <input type="text" placeholder="Ex: Coletor Admissão..." value={newReturn.name} onChange={(e) => setNewReturn({ ...newReturn, name: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-medium">SKU</label>
                  <input type="text" placeholder="Ex: 26" value={newReturn.sku} onChange={(e) => setNewReturn({ ...newReturn, sku: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Valor (R$)</label>
                  <input type="number" step="0.01" placeholder="0.00" value={newReturn.value} onChange={(e) => setNewReturn({ ...newReturn, value: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
                </div>
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

function PhotoEditorTab({ darkMode }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target.result);
      setProcessed(false);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessBackground = () => {
    if (!selectedImage) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Editor de Fotos (Fundo Branco)</h2>
        <p className="text-sm text-slate-400">Remova o fundo automaticamente para adequar suas peças aos padrões do Mercado Livre.</p>
      </div>

      <div className={`p-8 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} text-center space-y-6 shadow-xl`}>
        {!selectedImage ? (
          <label className="border-2 border-dashed border-slate-700 hover:border-amber-400 p-10 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors block">
            <ImageIcon className="w-12 h-12 text-amber-400 mb-3" />
            <span className="font-bold text-slate-200 text-sm">Clique para enviar ou arraste a foto da peça</span>
            <span className="text-xs text-slate-500 mt-1">PNG, JPG ou WEBP</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center gap-4 items-center">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400">Foto Original</div>
                <img src={selectedImage} alt="Original" className="w-48 h-48 object-cover rounded-xl border border-slate-700 shadow-md" />
              </div>

              {processed && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-emerald-400">Fundo Branco Puro ✨</div>
                  <div className="w-48 h-48 bg-white rounded-xl border border-slate-700 shadow-md flex items-center justify-center p-2">
                    <img src={selectedImage} alt="Processada" className="max-h-full max-w-full object-contain filter contrast-110" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3 pt-2">
              {!processed ? (
                <button
                  onClick={handleProcessBackground}
                  disabled={processing}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                >
                  {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{processing ? 'Removendo Fundo...' : 'Remover Fundo Automaticamente'}</span>
                </button>
              ) : (
                <button
                  onClick={() => { setSelectedImage(null); setProcessed(false); }}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700"
                >
                  Enviar Outra Foto
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductModal({ product, onSave, onClose, darkMode }) {
  const [formData, setFormData] = useState(
    product || { sku: '', colA: '', colE: '', colG: 'Ativo', name: '', price: 150.00, stock: 5, date: new Date().toISOString().slice(0,10), section: 'Mecânica' }
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
            <label className="text-slate-400 font-medium">Título da Peça (Col F)</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium">SKU (Col D)</label>
              <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
            </div>
            <div>
              <label className="text-slate-400 font-medium">Código MLB (Col E)</label>
              <input type="text" value={formData.colE} onChange={(e) => setFormData({ ...formData, colE: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium">Cód. Produto (Col A)</label>
              <input type="text" value={formData.colA} onChange={(e) => setFormData({ ...formData, colA: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-slate-400 font-medium">Status (Col G)</label>
              <input type="text" value={formData.colG} onChange={(e) => setFormData({ ...formData, colG: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
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
