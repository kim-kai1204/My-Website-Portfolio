import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, LayoutGrid, List as ListIcon } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SiteCard } from './SiteCard';
import { AddSiteModal } from './AddSiteModal';
import { Site } from '../types';

const STORAGE_KEY = 'my_sites_data_v7';

// Default sites data matching the user's requested categories with images
const DEFAULT_SITES: Site[] = [
  {
    id: 'game-3',
    title: 'Cloverfit Hack Simulation',
    url: '/cloverfit',
    description: 'AI Studio로 만든 해킹 시뮬레이션. 파일을 열어 단계를 진행해보세요.',
    category: '게임',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now() + 3000,
  },
  {
    id: 'game-1',
    title: 'Neon Dash Arcade',
    url: '/game',
    description: '네온 스타일 아케이드 게임. 마우스로 이동하여 적을 피하고 오브를 수집하세요.',
    category: '게임',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now() + 2000,
  },
  {
    id: 'game-2',
    title: 'Reaction Blitz',
    url: '/reaction-blitz',
    description: '반응속도 테스트 게임. 화면이 초록색으로 변하면 최대한 빨리 클릭하세요.',
    category: '게임',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now() + 1000,
  },
  {
    id: '1',
    title: '픽셀 퀘스트 아레나',
    url: 'https://www.pixelquest-demo-game.com',
    description: '브라우저에서 바로 즐기는 레트로 스타일 MMORPG. 드래곤을 사냥하고 길드에 가입하세요.',
    category: '게임',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now(),
  },
  {
    id: '2',
    title: '캔버스 프로 온라인',
    url: 'https://www.canvaspro-online-demo.com',
    description: '웹 기반 디지털 드로잉 도구로 창의력을 발휘하고 커뮤니티 아트 챌린지에 참여해보세요.',
    category: '그림 그리기',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now() - 1000,
  },
  {
    id: '3',
    title: '18번 홀 골프',
    url: 'https://www.the18thhole-demo.com',
    description: '매일 업데이트되는 골프 뉴스, 스윙 분석 팁, 그리고 가상 코스 투어를 제공합니다.',
    category: '골프',
    imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now() - 2000,
  },
  {
    id: '4',
    title: '젠(Zen) 낮잠 스테이션',
    url: 'https://www.zennapstation-demo.com',
    description: '효과적인 파워 낮잠을 위한 엄선된 백색 소음과 명상 가이드를 들어보세요.',
    category: '낮잠',
    imageUrl: 'https://images.unsplash.com/photo-1511295742362-92c96b1cf484?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now() - 3000,
  },
  {
    id: '5',
    title: '데스크 셋업 위클리',
    url: 'https://www.desksetups-inspo.com',
    description: '미니멀한 작업 공간 영감, 가젯 리뷰, 홈 오피스 정리 가이드를 확인하세요.',
    category: '데스크테리어',
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now() - 4000,
  },
];

const ensureGameEntries = (sites: Site[]) => {
  const existingIds = new Set(sites.map((s) => s.id));
  const missing = DEFAULT_SITES.filter((s) => s.id.startsWith('game-') && !existingIds.has(s.id));
  if (missing.length === 0) return sites;
  return [...missing, ...sites];
};

export const Dashboard: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  // Load sites from localStorage on mount
  useEffect(() => {
    const savedSites = localStorage.getItem(STORAGE_KEY);
    if (savedSites) {
      try {
        const parsedSites = JSON.parse(savedSites);
        setSites(ensureGameEntries(parsedSites));
      } catch (e) {
        console.error('Failed to parse sites', e);
        setSites(DEFAULT_SITES);
      }
    } else {
      // migrate from older keys
      const oldKeys = ['my_sites_data_v6', 'my_sites_data_v5', 'my_sites_data_v4'];
      let migrated: Site[] | null = null;
      for (const key of oldKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            migrated = ensureGameEntries(JSON.parse(data));
            break;
          } catch (e) {
            console.error('Migration parse error', e);
          }
        }
      }
      setSites(migrated ?? DEFAULT_SITES);
    }
    setLoading(false);
  }, []);

  // Save sites to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
    }
  }, [sites, loading]);

  const handleAddSite = (newSite: Site) => {
    setSites((prev) => [newSite, ...prev]);
    setIsModalOpen(false);
  };

  const handleDeleteSite = (id: string) => {
    if (window.confirm('정말로 이 사이트를 삭제하시겠습니까?')) {
      setSites((prev) => prev.filter((site) => site.id !== id));
    }
  };

  const filteredSites = useMemo(() => {
    return sites.filter((site) =>
      site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sites, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-12 max-w-7xl">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          
          {/* Search */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-indigo-400" />
            </div>
            <input
              type="text"
              placeholder="검색..."
              className="block w-full pl-11 pr-4 py-3 border-0 rounded-xl leading-5 bg-white/80 backdrop-blur-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:bg-white shadow-md shadow-indigo-100/50 sm:text-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-white/80 backdrop-blur-sm p-1 rounded-xl flex shadow-md shadow-indigo-100/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-indigo-600'}`}
                aria-label="그리드 뷰"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-indigo-600'}`}
                aria-label="리스트 뷰"
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl transition-all active:scale-95 w-full md:w-auto font-semibold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
            >
              <Plus className="h-4 w-4" />
              <span>추가</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        {filteredSites.length === 0 ? (
          <div className="text-center py-24">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100/50">
              <Search className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">사이트를 찾을 수 없습니다</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto break-keep">
              {searchQuery ? '검색어를 변경해보세요.' : '좋아하는 웹사이트를 추가하여 나만의 컬렉션을 만들어보세요.'}
            </p>
            {!searchQuery && (
               <button
               onClick={() => setIsModalOpen(true)}
               className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all"
             >
               <Plus className="h-4 w-4" />
               첫 번째 사이트 추가하기
             </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' 
              : 'flex flex-col gap-3'
          }>
            {filteredSites.map((site) => (
              <SiteCard 
                key={site.id} 
                site={site} 
                viewMode={viewMode}
                onDelete={handleDeleteSite} 
              />
            ))}
          </div>
        )}
      </main>
      
      <AddSiteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSite}
      />

      <Footer />
    </div>
  );
};
