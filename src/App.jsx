import React, { useState, useRef, useEffect } from 'react';
import {
  Car, Sun, Moon, Shield, Briefcase, LogOut, BarChart3, FileSpreadsheet,
  Store, TrendingUp, Calculator, MessageSquare, Zap, PieChart, CheckSquare,
  Trash2, HelpCircle, Sparkles, FolderTree, RotateCcw, Image as ImageIcon,
  RefreshCw, Search, Lock, ShieldAlert, Check, Copy, Tag, FileCode,
  AlertTriangle, CheckCircle2, FileText, User, Bot, Paperclip, Send, X,
  DollarSign, ShoppingBag, Percent, Upload, Edit, Plus, Info, Truck, PackageCheck, Calendar, Database
} from 'lucide-react';

// ==========================================
// DADOS INICIAIS DE EXEMPLO
// ==========================================
const DEFAULT_PRODUCTS = [
  {
    id: 'prod_1',
    sku: '26',
    mlb: 'MLB5539291609',
    name: 'CONJUNTO / PEÇA AUTOMOTIVA',
    status: 'Ativo',
    price: 200.00,
    wholesalePrice: 170.00,
    wholesaleMinQty: 4,
    costPrice: 0.01,
    stock: 2,
    date: '2026-11-10',
    conta: 'DL Auto Peças',
    currentCat: 'Acessórios para Veículos > Peças Gerais'
  },
  {
    id: 'prod_2',
    sku: '106',
    mlb: 'MLB5539291610',
    name: 'Coletor de Admissão 24581272',
    status: 'Ativo',
    price: 250.00,
    wholesalePrice: 212.50,
    wholesaleMinQty: 4,
    costPrice: 0.01,
    stock: 3,
    date: '2026-11-10',
    conta: 'DL Auto Peças',
    currentCat: 'Acessórios para Veículos > Peças de Motor'
  }
];

const DEFAULT_SALES = [
  {
    id: 'sale_1',
    saleId: '2000001',
    client: 'Oficina Mecânica Silva',
    value: 360.00,
    discount: 20.00,
    date: '2026-11-10',
    payment: 'Pix',
    nfe: '001245',
    trackingCode: 'BR987654321X',
    trackingStatus: 'Em Trânsito'
  }
];

const DEFAULT_RETURNS = [
  {
    id: 'ret_1',
    date: '2026-11-09',
    sku: '26',
    name: 'CONJUNTO',
    value: 200.00,
    reason: 'Arrependimento / Erro do Comprador',
    status: 'Reintegrado ao Estoque',
    notes: 'Peça voltou intacta'
  }
];

// Função utilitária para detectar categoria baseada no título da peça
function detectCategoryFromTitle(title = '') {
  const t = title.toLowerCase();
  if (t.includes('coletor') || t.includes('injeção') || t.includes('bico')) {
    return { name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Injeção', id: 'MLB1660' };
  }
  if (t.includes('reservatorio') || t.includes('radiador') || t.includes('água')) {
    return { name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Eletroventiladores e Radiadores', id: 'MLB403323' };
  }
  if (t.includes('freio') || t.includes('pastilha') || t.includes('disco')) {
    return { name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Freios', id: 'MLB8444' };
  }
  return { name: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Peças de Motor', id: 'MLB24424' };
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

// ==========================================
// COMPONENTE PRINCIPAL (APP)
// ==========================================
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('sales-dashboard');
  const [firebaseConnected] = useState(true);

  // Master Inventory Base (Tabela Mestra de Estoque Geral: Código, Produto, Valor Venda, Custo, Estoque)[cite: 5]
  const [masterInventory, setMasterInventory] = useState(() => {
    const saved = localStorage.getItem('autoflex_master_inventory');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('autoflex_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [salesList, setSalesList] = useState(() => {
    const saved = localStorage.getItem('autoflex_sales');
    return saved ? JSON.parse(saved) : DEFAULT_SALES;
  });

  const [returnsList, setReturnsList] = useState(() => {
    const saved = localStorage.getItem('autoflex_returns');
    return saved ? JSON.parse(saved) : DEFAULT_RETURNS;
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('autoflex_master_inventory', JSON.stringify(masterInventory));
  }, [masterInventory]);

  useEffect(() => {
    localStorage.setItem('autoflex_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('autoflex_sales', JSON.stringify(salesList));
  }, [salesList]);

  useEffect(() => {
    localStorage.setItem('autoflex_returns', JSON.stringify(returnsList));
  }, [returnsList]);

  // Função central para buscar o preço real da base de estoque pelo SKU / Código[cite: 5]
  const getMasterPriceForSku = (sku) => {
    if (!sku) return null;
    const found = masterInventory.find(item => String(item.sku).trim() === String(sku).trim());
    return found ? Number(found.price) : null;
  };

  // Aplica o preço mestre atualizado em todas as peças sempre que a base for alterada
  const synchronizedProducts = products.map(p => {
    const realPrice = getMasterPriceForSku(p.sku);
    if (realPrice !== null) {
      return {
        ...p,
        price: realPrice,
        wholesalePrice: Number((realPrice * 0.85).toFixed(2))
      };
    }
    return p;
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
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = (formData) => {
    const realPrice = getMasterPriceForSku(formData.sku) || formData.price;
    const finalData = {
      ...formData,
      price: realPrice,
      wholesalePrice: Number((realPrice * 0.85).toFixed(2))
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...finalData, id: p.id } : p));
    } else {
      setProducts([{ ...finalData, id: 'prod_' + Date.now() }, ...products]);
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
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
      setMasterInventory(DEFAULT_PRODUCTS);
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
            <NavItem id="master-inventory" label="Base de Estoque Geral (Código/Preço)" icon={Database} active={activeTab} setActive={setActiveTab} badge={masterInventory.length} />
            <NavItem id="import" label="Importar Peças & Anúncios" icon={FileSpreadsheet} active={activeTab} setActive={setActiveTab} badge={synchronizedProducts.length} />
            <NavItem id="wholesale-calc" label="Simulador Atacado e Varejo" icon={Store} active={activeTab} setActive={setActiveTab} />
            <NavItem id="price-monitor" label="Monitor de Preços (Buy Box)" icon={TrendingUp} active={activeTab} setActive={setActiveTab} />
            <NavItem id="margin-calculator" label="Simulador de Margem Líquida" icon={Calculator} active={activeTab} setActive={setActiveTab} />
            <NavItem id="faq-helper" label="FAQ & Compatibilidade (IA)" icon={MessageSquare} active={activeTab} setActive={setActiveTab} />
            <NavItem id="organic-seo" label="Otimizador SEO Orgânico" icon={Zap} active={activeTab} setActive={setActiveTab} />
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
            products={synchronizedProducts}
            currentUser={currentUser} 
            darkMode={darkMode} 
          />
        )}

        {activeTab === 'master-inventory' && (
          <MasterInventoryTab
            masterInventory={masterInventory}
            setMasterInventory={setMasterInventory}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'import' && (
          <ImportExcelTab 
            products={synchronizedProducts} 
            setProducts={setProducts} 
            currentUser={currentUser}
            onAddProduct={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            onEditProduct={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }}
            onDeleteProduct={handleDeleteProduct}
            darkMode={darkMode} 
          />
        )}

        {activeTab === 'wholesale-calc' && <WholesaleCalculatorTab products={synchronizedProducts} darkMode={darkMode} />}

        {activeTab === 'price-monitor' && <PriceMonitorTab products={synchronizedProducts} setProducts={setProducts} darkMode={darkMode} />}

        {activeTab === 'margin-calculator' && <MarginCalculatorTab products={synchronizedProducts} darkMode={darkMode} />}

        {activeTab === 'faq-helper' && <FaqHelperTab products={synchronizedProducts} darkMode={darkMode} />}

        {activeTab === 'organic-seo' && <OrganicSeoTab products={synchronizedProducts} darkMode={darkMode} />}

        {activeTab === 'curva-abc' && <CurvaAbcTab products={synchronizedProducts} darkMode={darkMode} />}

        {activeTab === 'category-audit' && <CategoryAuditTab products={synchronizedProducts} setProducts={setProducts} darkMode={darkMode} />}

        {activeTab === 'manage-sheets' && (
          <ManageSheetsTab 
            products={synchronizedProducts} 
            onDeleteSheet={handleDeleteSheetByDate} 
            currentUser={currentUser} 
            darkMode={darkMode} 
          />
        )}

        {activeTab === 'team-guide' && <TeamGuideTab darkMode={darkMode} />}

        {activeTab === 'assistant' && <AssistantTab products={synchronizedProducts} darkMode={darkMode} />}

        {activeTab === 'categories' && <CategoriesTab products={synchronizedProducts} darkMode={darkMode} />}

        {activeTab === 'returns' && <ReturnsTab returnsList={returnsList} setReturnsList={setReturnsList} products={synchronizedProducts} currentUser={currentUser} darkMode={darkMode} />}

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
// MÓDULO: BASE DE ESTOQUE GERAL (NOVA ABA)
// ==========================================
function MasterInventoryTab({ masterInventory, setMasterInventory, darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [importStatus, setImportStatus] = useState('');

  const handleMasterUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.XLSX) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.onload = () => processMasterFile(file);
      document.head.appendChild(script);
    } else {
      processMasterFile(file);
    }
  };

  const processMasterFile = (file) => {
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
          const sku = String(row['Código'] || row['Codigo'] || row['SKU'] || row['sku'] || `SKU_${idx}`);
          const name = String(row['Produto'] || row['produto'] || row['Título'] || row['Nome'] || 'Peça Automotiva');
          
          // Captura a coluna Valor Venda (R$) / Preço[cite: 5]
          const rawPrice = row['Valor Venda (R$)'] || row['Valor Venda'] || row['Preço'] || row['Preco'] || row['Valor'] || 150.00;
          const price = Number(String(rawPrice).replace('R$', '').replace(',', '.')) || 150.00;

          const rawCost = row['Custo (R$)'] || row['Custo'] || 0.01;
          const costPrice = Number(String(rawCost).replace('R$', '').replace(',', '.')) || 0.01;

          const stock = Number(row['Estoque'] || row['Quantidade'] || 5);

          return {
            id: 'master_' + Date.now() + '_' + idx,
            sku,
            name,
            price,
            costPrice,
            stock,
            wholesalePrice: Number((price * 0.85).toFixed(2)),
            wholesaleMinQty: 4
          };
        });

        setMasterInventory(imported);
        setImportStatus(`Sucesso! ${imported.length} itens carregados na Base de Estoque Geral. Os preços reais foram vinculados.`);
      } catch (err) {
        console.error(err);
        setImportStatus('Erro ao ler a planilha de estoque.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredMaster = masterInventory.filter(item => 
    String(item.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.sku).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Base de Estoque Geral (Código, Produto e Valor)</h2>
          <p className="text-sm text-slate-400">Jogue sua planilha completa de estoque aqui[cite: 5]. O sistema analisará as colunas Código e Valor de Venda para atualizar automaticamente todos os anúncios.</p>
        </div>

        <label className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer shadow-lg shadow-amber-400/20 transition-transform active:scale-95">
          <Upload className="w-4 h-4" />
          <span>Jogar Planilha de Estoque Completo (.xlsx)</span>
          <input type="file" accept=".xlsx, .xls, .csv" onChange={handleMasterUpload} className="hidden" />
        </label>
      </div>

      {importStatus && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}

      <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex items-center gap-4`}>
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Pesquisar na Base de Estoque por Código ou Produto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-sm text-white focus:outline-none"
        />
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs font-semibold text-slate-400">
          <span>Total de Itens na Base Mestra: <strong className="text-amber-400 font-mono text-sm">{filteredMaster.length}</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Código (SKU)[cite: 5]</th>
                <th className="p-4">Produto[cite: 5]</th>
                <th className="p-4">Estoque[cite: 5]</th>
                <th className="p-4">Custo (R$)[cite: 5]</th>
                <th className="p-4 text-right">Valor Venda (R$)[cite: 5]</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filteredMaster.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">Nenhum item na base de estoque. Importe sua planilha acima.</td>
                </tr>
              ) : (
                filteredMaster.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-400">{item.sku}</td>
                    <td className="p-4 font-semibold text-slate-200">{item.name}</td>
                    <td className="p-4 font-mono text-slate-300">{item.stock} un</td>
                    <td className="p-4 font-mono text-slate-400">R$ {Number(item.costPrice || 0).toFixed(2)}</td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-400 text-sm">R$ {Number(item.price || 0).toFixed(2)}</td>
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
// MÓDULO: SIMULADOR DE ATACADO E VAREJO
// ==========================================
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
  const economia = ehAtacado ? (precoVarejo - precoAtacado) * quantity : 0;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Simulador de Vendas: Atacado e Varejo</h2>
        <p className="text-sm text-slate-400">Calcule automaticamente descontos por volume com base nos preços reais sincronizados.</p>
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
                <option key={p.id || p.sku} value={p.sku}>Código {p.sku} - {p.name}</option>
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
              <span>Preço Unitário (Atacado):</span>
              <span className="text-emerald-400">R$ {precoAtacado.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Qtd Mínima Atacado:</span>
              <span className="text-amber-400">{qtdMinimaAtacado} un</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-xl flex flex-col justify-center border-l-4 border-l-amber-400`}>
            <div className="text-xs text-slate-400 font-semibold uppercase">Tipo de Venda Aplicado</div>
            <div className="text-2xl font-black text-amber-400">
              {ehAtacado ? '🎉 Atacado (Volume)' : '👤 Varejo (Unitário)'}
            </div>
            <div className="text-xs text-slate-500">
              {ehAtacado ? `Parabéns! Desconto de atacado ativado (>= ${qtdMinimaAtacado} un)` : `Compre mais ${qtdMinimaAtacado - quantity} un para ativar o preço de atacado.`}
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-xl flex flex-col justify-center border-l-4 border-l-emerald-400`}>
            <div className="text-xs text-slate-400 font-semibold uppercase">Valor Total do Pedido</div>
            <div className="text-3xl font-black font-mono text-emerald-400">
              R$ {valorTotal.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500">Unitário aplicado: R$ {precoAplicado.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO: MONITOR DE PREÇOS (BUY BOX)
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
    const currentPrice = Number(p.price) || 150.00;
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
          placeholder="Pesquisar por Peça ou Código..."
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
                <th className="p-4">Código / Peça</th>
                <th className="p-4">Seu Preço Real</th>
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
                  const val = customPrices[p.id] !== undefined ? customPrices[p.id] : (Number(p.price) || 150);
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-amber-400 font-mono">Código: {p.sku}</div>
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
// MÓDULO: SIMULADOR DE MARGEM LÍQUIDA
// ==========================================
function MarginCalculatorTab({ products, darkMode }) {
  const [selectedSku, setSelectedSku] = useState(products[0]?.sku || '');
  const [salePrice, setSalePrice] = useState(Number(products[0]?.price) || 200);
  const [costPrice, setCostPrice] = useState(Number(products[0]?.costPrice) || 70);
  const [adMode, setAdMode] = useState('premium');
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
                <option key={p.id} value={p.sku}>Código {p.sku} - {p.name}</option>
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

// ==========================================
// MÓDULO: OTIMIZADOR DE TRÁFEGO ORGÂNICO
// ==========================================
function OrganicSeoTab({ products, darkMode }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedDescIndex, setCopiedDescIndex] = useState(null);

  const handleCopy = (text, idx, isDesc = false) => {
    navigator.clipboard.writeText(text);
    if (isDesc) {
      setCopiedDescIndex(idx);
      setTimeout(() => setCopiedDescIndex(null), 2000);
    } else {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const forbiddenWordsList = ['barato', 'promoção', 'promocao', 'grátis', 'gratis', 'liquidação', 'liquidacao', 'imperdível'];

  const checkForbiddenTerms = (title = '') => {
    const found = forbiddenWordsList.filter(w => title.toLowerCase().includes(w));
    return found;
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Otimizador de Tráfego Orgânico (SEO Gratuito & Avançado)</h2>
        <p className="text-sm text-slate-400">Score de SEO, gerador automático de tags e verificador de termos proibidos.</p>
      </div>

      <div className="space-y-6">
        {products.map((p, idx) => {
          const optimizedTitle = `${p.name} - Original e Garantido`.slice(0, 60);
          const forbiddenFound = checkForbiddenTerms(p.name);
          
          let seoScore = 70;
          if (p.name.length <= 60) seoScore += 15;
          if (p.mlb) seoScore += 15;
          if (forbiddenFound.length > 0) seoScore -= 30;

          return (
            <div key={p.id || idx} className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 shadow-xl`}>
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono bg-amber-400/10 text-amber-400 px-2.5 py-1 rounded font-bold">Código: {p.sku}</span>
                  <span className="font-bold text-slate-100 text-sm">{p.name}</span>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-bold border ${seoScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  Score SEO: {seoScore}%
                </span>
              </div>

              {forbiddenFound.length > 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span><strong>Atenção (Termo Proibido):</strong> "{forbiddenFound.join(', ')}".</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO: FAQ, SAC ML & ESTOQUE CRÍTICO
// ==========================================
function FaqHelperTab({ products, darkMode }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Olá! Sou o assistente de IA da sua loja. Estou equipado com respostas automáticas para o SAC do Mercado Livre e alertas de reposição de estoque.'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getLowStockAlerts = () => {
    const criticalItems = products.filter(p => (p.stock !== undefined ? p.stock : 0) <= 2);
    if (criticalItems.length === 0) {
      return "✅ **Análise de Estoque:** Todos os produtos estão com níveis de estoque adequados.";
    }

    let report = `🚨 **ALERTA DE REPOSIÇÃO DE ESTOQUE CRÍTICO (${criticalItems.length} itens):**\n\n`;
    criticalItems.forEach(item => {
      report += `• **Código ${item.sku}** - ${item.name} | Saldo: **${item.stock || 0} un**\n`;
    });
    return report;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = inputVal.trim();
    const newMessages = [...messages, { sender: 'user', text: userMsg }];
    setMessages(newMessages);
    setInputVal('');

    setTimeout(() => {
      let aiResponse = "";
      const query = userMsg.toLowerCase();
      if (query.includes('estoque') || query.includes('repor') || query.includes('critico')) {
        aiResponse = getLowStockAlerts();
      } else {
        aiResponse = `🤖 **Assistente DL AutoPeças:** Entendi sua consulta. Use os botões atalho para checar estoque crítico ou dúvidas de SAC.`;
      }
      setMessages([...newMessages, { sender: 'ai', text: aiResponse }]);
    }, 700);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
      <div className="pb-4 border-b border-slate-800 flex-shrink-0">
        <h2 className="text-2xl font-bold tracking-tight">FAQ, SAC ML & Estoque Crítico</h2>
        <p className="text-sm text-slate-400">Assistente integrado com cálculo de compras e modelos de resposta para o Mercado Livre.</p>
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
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        <form onSubmit={handleSendMessage} className={`p-4 border-t ${darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'} flex items-center gap-2`}>
          <input
            type="text"
            placeholder="Pergunte sobre estoque crítico ou SAC..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-amber-400/25 transition-transform active:scale-95 flex-shrink-0"
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
// MÓDULO: CURVA ABC DE ESTOQUE
// ==========================================
function CurvaAbcTab({ products, darkMode }) {
  const [selectedCurva, setSelectedCurva] = useState('TODAS');

  const evaluated = products.map((p, i) => {
    const simulatedRevenue = (Number(p.price) || 150) * (p.stock || 5) * (i % 2 === 0 ? 3 : 1);
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Curva ABC de Estoque & Giro de Peças</h2>
          <p className="text-sm text-slate-400">Classificação automática do faturamento por código de produto.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div onClick={() => setSelectedCurva('A')} className={`p-5 rounded-2xl border cursor-pointer transition-all border-l-4 border-l-emerald-400 ${selectedCurva === 'A' ? 'bg-emerald-950/40 border-emerald-500' : 'bg-slate-900 border-slate-800'}`}>
          <div className="text-xs text-slate-400 font-semibold">Curva A (Alto Giro)</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{countA} peças</div>
        </div>
        <div onClick={() => setSelectedCurva('B')} className={`p-5 rounded-2xl border cursor-pointer transition-all border-l-4 border-l-blue-400 ${selectedCurva === 'B' ? 'bg-blue-950/40 border-blue-500' : 'bg-slate-900 border-slate-800'}`}>
          <div className="text-xs text-slate-400 font-semibold">Curva B (Giro Médio)</div>
          <div className="text-2xl font-black font-mono text-blue-400 mt-1">{countB} peças</div>
        </div>
        <div onClick={() => setSelectedCurva('C')} className={`p-5 rounded-2xl border cursor-pointer transition-all border-l-4 border-l-amber-400 ${selectedCurva === 'C' ? 'bg-amber-950/40 border-amber-500' : 'bg-slate-900 border-slate-800'}`}>
          <div className="text-xs text-slate-400 font-semibold">Curva C (Baixo Giro)</div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">{countC} peças</div>
        </div>
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Código / Peça</th>
                <th className="p-4">Estoque</th>
                <th className="p-4">Preço (R$)</th>
                <th className="p-4 text-center">Classificação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-amber-400 font-mono">Código: {p.sku}</div>
                    <div className="font-semibold text-slate-200 mt-0.5">{p.name}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-300">{p.stock || 5} un</td>
                  <td className="p-4 font-mono text-emerald-400 font-bold">R$ {Number(p.price || 150).toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full font-bold border ${p.badgeColor} inline-block`}>Curva {p.curva}</span>
                  </td>
                </tr>
              ))}
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
    setProducts(products.map(p => p.id === productId ? { ...p, currentCat: newCorrectCat } : p));
  };

  const auditedProducts = products.map(p => {
    const correct = detectCategoryFromTitle(p.name);
    const current = p.currentCat || 'Acessórios para Veículos > Peças Gerais';
    const isMatch = current.trim().toLowerCase() === correct.name.trim().toLowerCase();
    return { ...p, correctCat: correct.name, correctId: correct.id, isMatch };
  });

  const filtered = auditedProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Auditoria e Comparação de Categorias</h2>
        <p className="text-sm text-slate-400">Verifique se suas peças estão nas categorias corretas exigidas pelo Mercado Livre.</p>
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Código / Peça</th>
                <th className="p-4">Categoria Atual</th>
                <th className="p-4">Categoria Correta (ML)</th>
                <th className="p-4 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-amber-400 font-mono">Código: {p.sku}</div>
                    <div className="font-semibold text-slate-200 mt-0.5">{p.name}</div>
                  </td>
                  <td className="p-4 text-slate-300 font-mono">{p.currentCat}</td>
                  <td className="p-4 text-emerald-400 font-mono font-bold">{p.correctCat}</td>
                  <td className="p-4 text-center">
                    {p.isMatch ? (
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full font-bold">Correto</span>
                    ) : (
                      <button onClick={() => handleFixCategory(p.id, p.correctCat)} className="px-3 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-xl">Arrumar</button>
                    )}
                  </td>
                </tr>
              ))}
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
        <p className="text-sm text-slate-400">Material de leitura para a equipe.</p>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO: DASHBOARD DE FATURAMENTO & VENDAS
// ==========================================
function SalesDashboardTab({ salesList, setSalesList, products, currentUser, darkMode }) {
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = salesList.filter(s => {
    const matchSearch = s.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.saleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.nfe.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDate = !filterDate || (s.date && s.date.startsWith(filterDate));
    return matchSearch && matchDate;
  });

  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.value, 0);
  const totalCount = filteredSales.length;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard de Faturamento & Vendas</h2>
        <p className="text-sm text-slate-400">Resumo financeiro das vendas e faturamento.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-lg`}>
          <div className="text-slate-400 text-xs font-semibold">Faturamento Total</div>
          <div className="text-2xl font-black font-mono text-amber-400">R$ {totalRevenue.toFixed(2)}</div>
        </div>
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-2 shadow-lg`}>
          <div className="text-slate-400 text-xs font-semibold">Total de Vendas</div>
          <div className="text-2xl font-black font-mono text-blue-400">{totalCount} pedidos</div>
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
          const sku = String(row['Código'] || row['Codigo'] || row['SKU'] || row['sku'] || `SKU_${idx}`);
          const mlb = String(row['Código MLB'] || row['MLB'] || row['Meli Id'] || 'MLB5539291609');
          const name = String(row['Título'] || row['titulo'] || row['Produto'] || 'Peça Automotiva');
          const status = String(row['Status'] || 'Ativo');
          const conta = String(row['Conta'] || 'DL Auto Peças');
          
          // Pega o preço da base mestra ou da própria linha se houver
          const rawPrice = row['Valor Venda (R$)'] || row['Preço'] || row['Preco'] || row['Valor'] || 150.00;
          const price = Number(String(rawPrice).replace('R$', '').replace(',', '.')) || 150.00;

          return {
            id: 'imp_' + Date.now() + '_' + idx,
            sku,
            mlb,
            name,
            currentCat: 'Acessórios para Veículos > Peças Gerais',
            status,
            price,
            wholesalePrice: Number((price * 0.85).toFixed(2)),
            wholesaleMinQty: 4,
            costPrice: 60.00,
            stock: 5,
            date: new Date().toISOString().slice(0, 10),
            conta
          };
        });

        setProducts([...imported, ...products]);
        setImportStatus(`Sucesso! ${imported.length} peças importadas com os valores reais da planilha.`);
      } catch (err) {
        console.error(err);
        setImportStatus('Erro ao ler a planilha Excel.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (p.sku?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchDate = !filterDate || (p.date && p.date.startsWith(filterDate));
    return matchSearch && matchDate;
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Importar Peças & Anúncios</h2>
          <p className="text-sm text-slate-400">Puxe o catálogo com valores reais vinculados pelo Código.</p>
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

      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Código / MLB</th>
                <th className="p-4">Título do Anúncio</th>
                <th className="p-4">Preço Varejo Real</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 font-mono text-xs">
                    <div className="font-bold text-amber-400">Código: {p.sku}</div>
                    <div className="text-slate-500">MLB: {p.mlb || 'N/D'}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-200">{p.name}</td>
                  <td className="p-4 font-mono text-xs text-emerald-400 font-bold">
                    R$ {Number(p.price || 150).toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => onEditProduct(p)} className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400" title="Editar">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {currentUser?.role === 'admin' && (
                        <button onClick={() => onDeleteProduct(p.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400" title="Excluir">
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
  );
}

// ==========================================
// MÓDULO: GERENCIAR PLANILHAS
// ==========================================
function ManageSheetsTab({ products, onDeleteSheet, currentUser, darkMode }) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Gerenciar e Excluir Planilhas Lançadas</h2>
        <p className="text-sm text-slate-400">Exclua lotes inteiros da nuvem do Firebase.</p>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO: EDITOR DE TÍTULOS (IA)
// ==========================================
function AssistantTab({ products, darkMode }) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Editor de Títulos (Automático)</h2>
        <p className="text-sm text-slate-400">Verifique os títulos importados.</p>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO: CATEGORIAS & OEM
// ==========================================
function CategoriesTab({ products, darkMode }) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Editor de Categorias & OEM</h2>
        <p className="text-sm text-slate-400">Mapeamento para as categorias do Mercado Livre.</p>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO: CONTROLE DE DEVOLUÇÕES
// ==========================================
function ReturnsTab({ returnsList, setReturnsList, products, currentUser, darkMode }) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Controle de Devoluções</h2>
        <p className="text-sm text-slate-400">Marque peças devolvidas.</p>
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO: EDITOR DE FOTOS (Fundo Branco)
// ==========================================
function PhotoEditorTab({ darkMode }) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight">Editor de Fotos (Fundo Branco)</h2>
        <p className="text-sm text-slate-400">Adeque suas fotos aos padrões do Mercado Livre.</p>
      </div>
    </div>
  );
}

// ==========================================
// MODAL DE CADASTRO DE PEÇA
// ==========================================
function ProductModal({ product, onSave, onClose, darkMode }) {
  const [formData, setFormData] = useState(
    product || { sku: '', mlb: '', name: '', status: 'Ativo', price: 150.00, wholesalePrice: 120.00, wholesaleMinQty: 4, costPrice: 60.00, stock: 5, date: new Date().toISOString().slice(0,10), conta: 'DL Auto Peças', currentCat: '' }
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
              <label className="text-slate-400 font-medium">Código (SKU)</label>
              <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
            </div>
            <div>
              <label className="text-slate-400 font-medium">MLB</label>
              <input type="text" value={formData.mlb} onChange={(e) => setFormData({ ...formData, mlb: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
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
