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
        className={`group bg-white border border-slate-100 hover:border-slate-200 rounded-lg p-4 flex items-center gap-4 transition-all hover:shadow-sm ${isInternalRoute ? 'cursor-pointer' : ''}`}
        onClick={isInternalRoute ? handleClick : undefined}
      >
        {/* List View Thumbnail */}
        <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-slate-50 relative">
          {hasImage ? (
            <img src={site.imageUrl} alt={site.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-slate-100 flex items-center justify-center">
               <img
                src={getFaviconUrl(site.url)}
                alt=""
                className="h-6 w-6 object-contain opacity-60"
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
                <span className="px-2 py-0.5 rounded text-xs font-medium text-slate-500 bg-slate-50 shrink-0">
                    {site.category}
                </span>
            </div>
            <p className="text-sm text-slate-400 truncate">{site.description}</p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             {!isInternalRoute ? (
               <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
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
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
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
      className={`group bg-white border border-slate-100 hover:border-slate-200 rounded-lg flex flex-col transition-all hover:shadow-md h-full overflow-hidden relative ${isInternalRoute ? 'cursor-pointer' : ''}`}
      onClick={isInternalRoute ? handleClick : undefined}
    >
      
      {/* Cover Image Area */}
      <div className="h-48 w-full relative overflow-hidden bg-slate-50">
        {hasImage ? (
            <img 
              src={site.imageUrl} 
              alt={site.title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
        ) : (
            <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center p-6">
                 <Globe className="h-8 w-8 text-slate-300 mb-2" />
                 <img
                    src={getFaviconUrl(site.url)}
                    alt=""
                    className="h-6 w-6 object-contain opacity-60"
                    onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                />
            </div>
        )}
        
        {/* Category Tag Overlay */}
        <div className="absolute top-3 left-3">
             <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-slate-600 bg-white/95 backdrop-blur-sm">
                {site.category}
            </span>
        </div>

        {/* Delete Button Overlay */}
         <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(site.id);
            }}
            className="absolute top-3 right-3 p-1.5 bg-white/95 backdrop-blur-sm text-slate-400 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-all"
            title="삭제"
        >
            <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-base text-slate-900 mb-1.5 line-clamp-1" title={site.title}>
            {site.title}
        </h3>

        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed flex-grow mb-3 break-keep">
            {site.description}
        </p>
        
        <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-auto">
             <span className="text-xs text-slate-400">
                {formattedDate}
            </span>
            
            {isInternalRoute ? (
              <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
                방문
                <ExternalLink className="h-3 w-3" />
              </div>
            ) : (
              <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={(e) => e.stopPropagation()}
              >
                  방문
                  <ExternalLink className="h-3 w-3" />
              </a>
            )}
        </div>
      </div>
    </div>
  );
};