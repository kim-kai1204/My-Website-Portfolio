import React, { useState } from 'react';
import { X, Wand2, Loader2, Check } from 'lucide-react';
import { Site } from '../types';
import { generateSiteMetadata } from '../services/geminiService';

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (site: Site) => void;
}

export const AddSiteModal: React.FC<AddSiteModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('일반');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAutoFill = async () => {
    if (!url) {
      setError('먼저 URL을 입력해주세요.');
      return;
    }
    setError('');
    setIsGenerating(true);

    try {
      const metadata = await generateSiteMetadata(url);
      
      if (metadata.title) setTitle(metadata.title);
      if (metadata.description) setDescription(metadata.description);
      if (metadata.category) setCategory(metadata.category);
      
    } catch (err) {
      setError('정보를 가져오지 못했습니다. 직접 입력해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !url) {
      setError('제목과 URL은 필수입니다.');
      return;
    }

    // Basic URL validation
    let finalUrl = url;
    if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
    }

    const newSite: Site = {
      id: crypto.randomUUID(),
      title,
      url: finalUrl,
      description: description || '설명이 없습니다.',
      category: category || '일반',
      createdAt: Date.now(),
    };

    onAdd(newSite);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setDescription('');
    setCategory('일반');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">새 사이트 추가</h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}

          {/* URL Input Group with Magic Button */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">웹사이트 URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="예: www.example.com"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 placeholder-slate-400"
              />
              <button
                type="button"
                onClick={handleAutoFill}
                disabled={isGenerating || !url}
                className="bg-indigo-50 text-primary hover:bg-indigo-100 disabled:bg-slate-50 disabled:text-slate-300 px-4 rounded-xl font-medium transition-colors flex items-center justify-center min-w-[3rem]"
                title="AI로 정보 자동 입력"
              >
                {isGenerating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Wand2 className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 pl-1">팁: URL을 입력하고 마법봉을 누르면 정보가 자동 입력됩니다.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="사이트 이름"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">카테고리</label>
                <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="예: 업무, 쇼핑"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900"
                />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="이 사이트에 대한 간단한 메모"
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 resize-none"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};