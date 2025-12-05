import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, LayoutGrid, List as ListIcon } from 'lucide-react';
import { Header } from './Header';
import { SiteCard } from './SiteCard';
import { AddSiteModal } from './AddSiteModal';
import { Site } from '../types';

// Default sites data matching the user's requested categories with images
const DEFAULT_SITES: Site[] = [
  {
    id: 'game-1',
    title: 'Neon Dash Arcade',
    url: '/game',
    description: 'Google AI Studio로 만든 네온 스타일 아케이드 게임입니다. 마우스로 이동하여 적을 피하고 오브를 수집하세요!',
    category: '게임',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now() + 2000,
  },
  {
    id: 'game-2',
    title: 'Reaction Blitz',
    url: '/reaction-blitz',
    description: '반응속도를 테스트하는 게임입니다. 화면이 초록색으로 변하면 최대한 빨리 클릭하세요! 5라운드 동안의 평균 반응속도를 측정합니다.',
    category: '게임',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
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

export const Dashboard: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  // Load sites from localStorage on mount
  useEffect(() => {
    // Updated key to v6 (with reaction-blitz integration)
    const savedSites = localStorage.getItem('my_sites_data_v6');
    if (savedSites) {
      try {
        const parsedSites = JSON.parse(savedSites);
        // 게임들이 없으면 추가
        const hasNeonDash = parsedSites.some((site: Site) => site.id === 'game-1');
        const hasReactionBlitz = parsedSites.some((site: Site) => site.id === 'game-2');
        
        if (!hasNeonDash || !hasReactionBlitz) {
          if (!hasNeonDash) {
            parsedSites.unshift(DEFAULT_SITES[0]);
          }
          if (!hasReactionBlitz) {
            const insertIndex = hasNeonDash ? 1 : 2;
            parsedSites.splice(insertIndex, 0, DEFAULT_SITES[1]);
          }
          setSites(parsedSites);
        } else {
          setSites(parsedSites);
        }
      } catch (e) {
        console.error("Failed to parse sites", e);
        setSites(DEFAULT_SITES);
      }
    } else {
      // 기존 v5 데이터가 있으면 마이그레이션
      const oldSites = localStorage.getItem('my_sites_data_v5');
      if (oldSites) {
        try {
          const parsedSites = JSON.parse(oldSites);
          const hasNeonDash = parsedSites.some((site: Site) => site.id === 'game-1');
          const hasReactionBlitz = parsedSites.some((site: Site) => site.id === 'game-2');
          
          if (!hasNeonDash) {
            parsedSites.unshift(DEFAULT_SITES[0]);
          }
          if (!hasReactionBlitz) {
            const insertIndex = hasNeonDash ? 1 : 2;
            parsedSites.splice(insertIndex, 0, DEFAULT_SITES[1]);
          }
          setSites(parsedSites);
        } catch (e) {
          setSites(DEFAULT_SITES);
        }
      } else {
        // 기존 v4 데이터가 있으면 마이그레이션
        const oldV4Sites = localStorage.getItem('my_sites_data_v4');
        if (oldV4Sites) {
          try {
            const parsedSites = JSON.parse(oldV4Sites);
            parsedSites.unshift(DEFAULT_SITES[0], DEFAULT_SITES[1]);
            setSites(parsedSites);
          } catch (e) {
            setSites(DEFAULT_SITES);
          }
        } else {
          setSites(DEFAULT_SITES);
        }
      }
    }
    setLoading(false);
  }, []);

  // Save sites to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('my_sites_data_v6', JSON.stringify(sites));
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
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          
          {/* Search */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="내 컬렉션 검색..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-white p-1 rounded-lg border border-slate-200 flex shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                aria-label="그리드 뷰"
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                aria-label="리스트 뷰"
              >
                <ListIcon className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 w-full md:w-auto"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">사이트 추가</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        {filteredSites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <div className="mx-auto h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">사이트를 찾을 수 없습니다</h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto break-keep">
              {searchQuery ? "검색어를 변경해보세요." : "좋아하는 웹사이트를 추가하여 나만의 컬렉션을 만들어보세요."}
            </p>
            {!searchQuery && (
               <button
               onClick={() => setIsModalOpen(true)}
               className="mt-6 inline-flex items-center gap-2 text-primary hover:text-indigo-700 font-medium"
             >
               <Plus className="h-4 w-4" />
               첫 번째 사이트 추가하기
             </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "flex flex-col gap-3"
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

      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} My Site Keeper. Built with React & Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

