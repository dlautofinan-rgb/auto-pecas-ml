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
  ShoppingBag,
  X,
  Check,
  Upload,
  Car,
  Lock,
  LogOut,
  Shield,
  Briefcase,
  Calendar,
  SlidersHorizontal
} from 'lucide-react';

// --- DADOS INICIAIS DE EXEMPLO (RELATÓRIO DE PUBLICAÇÕES) ---
const DEFAULT_PRODUCTS = [
  { id: 'p1', sku: '12531', mlb: 'MLB5539291609', name: 'Coletor Admissão Hyundai Hb20 1.0 Comfort 12v 3cc 2015', dept: 'mecanica', status: 'Ativo', date: '2026-11-10', conta: 'DL Auto Peças' },
  { id: 'p2', sku: '12530', mlb: 'MLB5539290589', name: 'Reservatório Partida Fria Hyundai Hb20 1.0 Comfort 12v 2015', dept: 'mecanica', status: 'Sob Revisão', date: '2026-11-10', conta: 'DL Auto Peças' },
  { id: 'p3', sku: '12529', mlb: 'MLB5539289953', name: 'Trava Elétrica Tampa Traseira Hyundai Hb20 1.0 Comfort 12v 2015', dept: 'eletrica', status: 'Ativo', date: '2026-11-10', conta: 'DL Auto Peças' },
  { id: 'p4', sku: '12528', mlb: 'MLB7971719130', name: 'Flauta C/ Bicos Injetores Hyundai Hb20 1.0 Comfort 12v 3cc 2015', dept: 'mecanica', status: 'Ativo', date: '2026-11-09', conta: 'DL Auto Peças' },
  { id: 'p5', sku: '12527', mlb: 'MLB7971562040', name: 'Break Light Luz De Freio Nissan Versa 265903aa0a Cinza', dept: 'lataria', status: 'Sob Revisão', date: '2026-11-09', conta: 'DL Auto Peças' }
];

const DEFAULT_RETURNS = [
  { id: 'r1', date: '2026-11-10', sku: '12530', name: 'Reservatório Partida Fria Hyundai Hb20', dept: 'mecanica', qty: 1, reason: 'Erro do Comprador', status: 'Reintegrado', notes: 'Comprado modelo errado.' }
];

const DEPT_CATEGORIES = {
  mecanica: { id: 'MLB26330', path: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Motor' },
  eletrica: { id: 'MLB193498', path: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Ignição' },
  lataria: { id: 'MLB412351', path: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Lataria' },
  acabamentos: { id: 'MLB181157', path: 'Acessórios para Veículos > Peças de Carros e Caminhonetes > Habitáculo' }
};

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
  const [activeTab, setActiveTab] = useState('import');
  const [darkMode, setDarkMode] = useState(true);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ml_user');
    return saved ? JSON.parse(saved) : null;
  });

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

  const resetToDefaultData = () => {
    if (window.confirm('Deseja restaurar os dados padrão?')) {
      setProducts(DEFAULT_PRODUCTS);
      setReturnsList(DEFAULT_RETURNS);
      localStorage.removeItem('ml_products');
      localStorage.removeItem('ml_returns');
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
                  <p className="text-xs text-slate-400">Gestão de Anúncios</p>
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
            <NavItem id="import" label="Importar Planilha & Datas" icon={FileSpreadsheet} active={activeTab} setActive={setActiveTab} badge={products.length} />
            <NavItem id="assistant" label="Editor de Títulos (IA)" icon={Sparkles} active={activeTab} setActive={setActiveTab} badge={products.filter(p => p.name.length > 55).length} />
            <NavItem id="categories" label="Editor de Categorias & OEM" icon={FolderTree} active={activeTab} setActive={setActiveTab} />
            <NavItem id="returns" label="Controle Devoluções" icon={RotateCcw} active={activeTab} setActive={setActiveTab} />
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
          <p className="text-sm text-slate-400">Controle de Anúncios e Otimização Diária</p>
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
// MÓDULO 1: IMPORTADOR EXCEL & FILTRAGEM POR DATA
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
            dept: name.toLowerCase().includes('bomba') || name.toLowerCase().includes('coletor') || name.toLowerCase().includes('motor') ? 'mecanica' : 'eletrica',
            status,
            date: formattedDate,
            conta
          };
        });

        setProducts([...imported, ...products]);
        setImportStatus(`Sucesso! ${imported.length} peças importadas da planilha "${file.name}" e já enviadas para os editores de Títulos e Categorias.`);
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
          <h2 className="text-2xl font-bold tracking-tight">Importação de Planilha Diária (.xlsx)</h2>
          <p className="text-sm text-slate-400">Puxe todas as peças do seu relatório do Mercado Livre, filtre por data e envie direto para os editores.</p>
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

      {/* FILTROS */}
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

      {/* TABELA DE ANÚNCIOS CADASTRADOS */}
      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-xl`}>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs font-semibold text-slate-400">
          <span>Total de Anúncios Exibidos: <strong className="text-amber-400 font-mono text-sm">{filteredProducts.length}</strong></span>
          {filterDate && (
            <button onClick={() => setFilterDate('')} className="text-blue-400 hover:underline">
              Limpar Filtro da Data ({filterDate})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">SKU / MLB</th>
                <th className="p-4">Título do Anúncio</th>
                <th className="p-4">Conta</th>
                <th className="p-4">Status</th>
                <th className="p-4">Data Publicação</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">Nenhum anúncio encontrado para esta data ou filtro.</td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-mono text-xs">
                      <div className="font-bold text-amber-400">SKU: {p.sku}</div>
                      <div className="text-slate-500">MLB: {p.mlb || 'N/D'}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-200">{p.name}</td>
                    <td className="p-4 text-xs text-slate-400">{p.conta || 'DL Auto Peças'}</td>
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
// MÓDULO 2: EDITOR DE TÍTULOS (IA) AUTOMÁTICO
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
        <h2 className="text-2xl font-bold tracking-tight">Editor de Títulos (Automático das Peças)</h2>
        <p className="text-sm text-slate-400">Todas as peças importadas da planilha já aparecem aqui para você verificar se há títulos longos ou que precisam de melhoria.</p>
      </div>

      <div className="space-y-4">
        {products.map((p, idx) => {
          const isLong = p.name.length > 60;
          const optimized = isLong ? p.name.slice(0, 57) + '...' : p.name;

          return (
            <div key={p.id || idx} className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-3 shadow-lg`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-amber-400/10 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-400/20 font-bold">
                    SKU: {p.sku}
                  </span>
                  <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg border border-blue-500/20 font-bold">
                    MLB: {p.mlb || 'N/D'}
                  </span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${isLong ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                  {isLong ? `Título Longo (${p.name.length} carac.) - Precisa Melhorar` : `Ideal (${p.name.length}/60 carac.)`}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block">Título Atual na Planilha:</span>
                  <p className="text-slate-200 font-medium">{p.name}</p>
                </div>

                <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/30 space-y-1 flex flex-col justify-between">
                  <div>
                    <span className="text-blue-400 font-semibold block">Sugestão Otimizada (Max 60 carac.):</span>
                    <p className="text-slate-100 font-bold">{optimized}</p>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleCopy(optimized, idx)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === idx ? 'Copiado!' : 'Copiar Sugestão'}</span>
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
// MÓDULO 3: EDITOR DE CATEGORIAS & OEM AUTOMÁTICO
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
        <h2 className="text-2xl font-bold tracking-tight">Editor de Categorias & OEM (Automático)</h2>
        <p className="text-sm text-slate-400">Todas as peças da planilha já foram mapeadas para as categorias do Mercado Livre para conferência.</p>
      </div>

      <div className="space-y-6">
        {products.map((p, idx) => {
          const catInfo = DEPT_CATEGORIES[p.dept] || { id: 'MLB26330', path: 'Acessórios para Veículos > Peças de Carros e Caminhonetes' };

          const description = 
`==================================================
  ${p.name.toUpperCase()} - SKU: ${p.sku} | MLB: ${p.mlb || 'N/D'}
==================================================

Peça de alta durabilidade e precisão técnica, importada diretamente do relatório de publicações.

FICHA TÉCNICA:
- Código SKU / OEM: ${p.sku}
- Código MLB: ${p.mlb || 'N/D'}
- Categoria Mercado Livre: ${catInfo.path} (${catInfo.id})
- Status no ML: ${p.status || 'Ativo'}
- Data de Publicação: ${p.date || '2026-11-10'}
- Condição: Produto Novo com Garantia
- Envio: Pronta Entrega para todo o Brasil

ATENÇÃO E COMPATIBILIDADE:
Antes de efetuar a compra, confirme a numeração registrada na sua peça original.`;

          return (
            <div key={p.id || idx} className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 shadow-xl`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex gap-2 mb-1">
                    <span className="text-xs font-mono bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded font-bold">SKU: {p.sku}</span>
                    <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold">MLB: {p.mlb || 'N/D'}</span>
                  </div>
                  <h3 className="font-bold text-slate-100">{p.name}</h3>
                  <p className="text-xs text-slate-400">{catInfo.path}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-3 py-1 rounded-xl border border-blue-500/20 font-bold">
                    ID: {catInfo.id}
                  </span>
                  <button
                    onClick={() => copyToClipboard(catInfo.id, `cat_${idx}`)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1"
                  >
                    {copiedItem === `cat_${idx}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedItem === `cat_${idx}` ? 'Copiado!' : 'Copiar ID'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase">Descrição Pronta para Anúncio</span>
                  <button
                    onClick={() => copyToClipboard(description, `desc_${idx}`)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    {copiedItem === `desc_${idx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedItem === `desc_${idx}` ? 'Copiado!' : 'Copiar Descrição'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap">
                  {description}
                </pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// MÓDULO 4: CONTROLE DE DEVOLUÇÕES
// ==========================================
function ReturnsTab({ returnsList, setReturnsList, products, currentUser, darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReturns = returnsList.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Controle Devoluções</h2>
          <p className="text-sm text-slate-400">Registre e monitore devoluções de peças.</p>
        </div>
      </div>
      <div className={`rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden`}>
        <div className="p-4 border-b border-slate-800">
          <input
            type="text"
            placeholder="Pesquisar devoluções..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/40 text-xs text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Data</th>
                <th className="p-4">Peça / SKU</th>
                <th className="p-4">Motivo</th>
                <th className="p-4">Status Estoque</th>
                <th className="p-4">Observações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {filteredReturns.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/20">
                  <td className="p-4 font-mono text-slate-400">{r.date}</td>
                  <td className="p-4 font-semibold text-slate-200">{r.name} <span className="text-amber-400 font-mono">(SKU: {r.sku})</span></td>
                  <td className="p-4">{r.reason}</td>
                  <td className="p-4"><span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{r.status}</span></td>
                  <td className="p-4 text-slate-400">{r.notes || '-'}</td>
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
// MÓDULO 5: EDITOR DE FOTOS (Fundo Branco)
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
        <h2 className="text-2xl font-bold tracking-tight">Editor de Fotos (Fundo Branco Canvas)</h2>
        <p className="text-sm text-slate-400">Adeque suas fotos aos padrões do Mercado Livre.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-5 text-xs`}>
          <h3 className="font-bold text-slate-200 text-sm">Controles</h3>
          <div>
            <label className="block text-slate-400 mb-1">Enviar Foto</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-slate-400" />
          </div>
          <button onClick={handleDownload} disabled={!imageSrc} className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 font-bold text-slate-950 rounded-xl">
            Baixar Imagem
          </button>
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
// MODAL DE CADASTRO/EDIÇÃO DE PEÇA
// ==========================================
function ProductModal({ product, onSave, onClose, darkMode }) {
  const [formData, setFormData] = useState(
    product || { sku: '', mlb: '', name: '', dept: 'mecanica', status: 'Ativo', date: new Date().toISOString().slice(0,10), conta: 'DL Auto Peças' }
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
            <label className="text-slate-400 font-medium">Título da Peça</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium">SKU</label>
              <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
            </div>
            <div>
              <label className="text-slate-400 font-medium">Código MLB</label>
              <input type="text" value={formData.mlb} onChange={(e) => setFormData({ ...formData, mlb: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium">Departamento</label>
              <select value={formData.dept} onChange={(e) => setFormData({ ...formData, dept: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white">
                <option value="mecanica">Mecânica</option>
                <option value="eletrica">Elétrica</option>
                <option value="lataria">Lataria</option>
                <option value="acabamentos">Acabamentos</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 font-medium">Data Publicação</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full mt-1 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white" required />
            </div>
          </div>

          <div className="pt-3 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">Cancelar</button>
            <button type="submit" className="flex-1 py-2 bg-amber-400 font-bold text-slate-950 rounded-xl">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
