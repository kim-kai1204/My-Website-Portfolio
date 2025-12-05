import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Trash2, Globe, Calendar, Tag, Link as LinkIcon } from 'lucide-react';
import { Site } from '../types';

interface SiteCardProps {
  site: Site;
  viewMode: 'grid' | 'list';
  onDelete: (id: string) => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({ site, viewMode, onDelete }) => {
  const navigate = useNavigate();
  
  const getFaviconUrl = (url: string) => {
    try {
      // 상대 경로인 경우 처리
      if (url.startsWith('/') || url.startsWith('./')) {
        return '';
      }
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '';
    }
  };

  const formattedDate = new Date(site.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const hasImage = !!site.imageUrl;
  const isInternalRoute = site.url.startsWith('/');
  
  const handleClick = (e: React.MouseEvent) => {
    if (isInternalRoute) {
      e.preventDefault();
      navigate(site.url);
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        className={`group bg-white/90 backdrop-blur-sm border border-indigo-100/50 hover:border-indigo-300 rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-lg hover:shadow-indigo-100/50 hover:-translate-y-0.5 ${isInternalRoute ? 'cursor-pointer' : ''}`}
        onClick={isInternalRoute ? handleClick : undefined}
      >
        {/* List View Thumbnail */}
        <div className="flex-shrink-0 h-14 w-14 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 relative shadow-md">
          {hasImage ? (
            <img src={site.imageUrl} alt={site.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center">
               <img
                src={getFaviconUrl(site.url)}
                alt=""
                className="h-7 w-7 object-contain opacity-70"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
            />
            </div>
          )}
        </div>
        
        <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-900 truncate text-base">{site.title}</h3>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 shrink-0 border border-indigo-100">
                    {site.category}
                </span>
            </div>
            <p className="text-sm text-slate-500 truncate">{site.description}</p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             {!isInternalRoute ? (
               <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all hover:scale-110"
                  title="사이트 방문"
                  onClick={(e) => e.stopPropagation()}
              >
                  <ExternalLink className="h-4 w-4" />
              </a>
             ) : null}
            <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(site.id);
                }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                title="사이트 삭제"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div 
      className={`group bg-white/90 backdrop-blur-sm border border-indigo-100/50 hover:border-indigo-300 rounded-2xl flex flex-col transition-all hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-1 h-full overflow-hidden relative ${isInternalRoute ? 'cursor-pointer' : ''}`}
      onClick={isInternalRoute ? handleClick : undefined}
    >
      
      {/* Cover Image Area */}
      <div className="h-52 w-full relative overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
        {hasImage ? (
            <>
              <img 
                src={site.imageUrl} 
                alt={site.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
        ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex flex-col items-center justify-center p-6">
                 <Globe className="h-10 w-10 text-white/80 mb-2" />
                 <img
                    src={getFaviconUrl(site.url)}
                    alt=""
                    className="h-7 w-7 object-contain opacity-80"
                    onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                />
            </div>
        )}
        
        {/* Category Tag Overlay */}
        <div className="absolute top-4 left-4">
             <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-white/95 backdrop-blur-md shadow-lg border border-indigo-100">
                {site.category}
            </span>
        </div>

        {/* Delete Button Overlay */}
         <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(site.id);
            }}
            className="absolute top-4 right-4 p-2 bg-white/95 backdrop-blur-md text-slate-400 hover:text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
            title="삭제"
        >
            <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5 flex-grow flex flex-col bg-white">
        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1" title={site.title}>
            {site.title}
        </h3>

        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed flex-grow mb-4 break-keep">
            {site.description}
        </p>
        
        <div className="flex items-center justify-between border-t border-indigo-50 pt-4 mt-auto">
             <span className="text-xs text-slate-400 font-medium">
                {formattedDate}
            </span>
            
            {isInternalRoute ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                방문
                <ExternalLink className="h-3.5 w-3.5 text-indigo-500" />
              </div>
            ) : (
              <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent hover:from-indigo-600 hover:to-purple-600 transition-all"
                  onClick={(e) => e.stopPropagation()}
              >
                  방문
                  <ExternalLink className="h-3.5 w-3.5 text-indigo-500" />
              </a>
            )}
        </div>
      </div>
    </div>
  );
};