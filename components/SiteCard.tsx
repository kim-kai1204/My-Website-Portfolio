import React from 'react';
import { ExternalLink, Trash2, Globe, Calendar, Tag, Link as LinkIcon } from 'lucide-react';
import { Site } from '../types';

interface SiteCardProps {
  site: Site;
  viewMode: 'grid' | 'list';
  onDelete: (id: string) => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({ site, viewMode, onDelete }) => {
  const getFaviconUrl = (url: string) => {
    try {
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

  if (viewMode === 'list') {
    return (
      <div className="group bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-md">
        {/* List View Thumbnail */}
        <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border border-slate-100 relative">
          {hasImage ? (
            <img src={site.imageUrl} alt={site.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center">
               <img
                src={getFaviconUrl(site.url)}
                alt=""
                className="h-8 w-8 object-contain opacity-80"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
            />
            </div>
          )}
        </div>
        
        <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900 truncate text-lg">{site.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600 border border-slate-200 shrink-0">
                    {site.category}
                </span>
            </div>
            <p className="text-sm text-slate-500 truncate">{site.description}</p>
            <div className="flex items-center gap-1 mt-1">
               <LinkIcon className="h-3 w-3 text-indigo-400" />
               <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 hover:underline truncate">
                  {site.url}
               </a>
            </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors"
                title="사이트 방문"
            >
                <ExternalLink className="h-4 w-4" />
            </a>
            <button
                onClick={() => onDelete(site.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
    <div className="group bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 h-full overflow-hidden relative">
      
      {/* Cover Image Area */}
      <div className="h-40 w-full relative overflow-hidden bg-slate-100">
        {hasImage ? (
            <img 
              src={site.imageUrl} 
              alt={site.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
        ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-slate-200 flex flex-col items-center justify-center p-6">
                 <Globe className="h-10 w-10 text-indigo-200 mb-2" />
                 <img
                    src={getFaviconUrl(site.url)}
                    alt=""
                    className="h-8 w-8 object-contain shadow-sm rounded-full bg-white p-1"
                    onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                />
            </div>
        )}
        
        {/* Category Tag Overlay */}
        <div className="absolute top-3 left-3">
             <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-700 shadow-sm">
                <Tag className="h-3 w-3 text-primary" />
                {site.category}
            </span>
        </div>

        {/* Delete Button Overlay */}
         <button
            onClick={() => onDelete(site.id)}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
            title="삭제"
        >
            <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1" title={site.title}>
            {site.title}
        </h3>

        <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed flex-grow mb-4 break-keep">
            {site.description}
        </p>
        
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
             <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="h-3 w-3" />
                {formattedDate}
            </span>
            
            <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-indigo-700 transition-colors"
            >
                방문하기
                <ExternalLink className="h-3.5 w-3.5" />
            </a>
        </div>
      </div>
    </div>
  );
};