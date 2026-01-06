
import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';

const VisionInterface: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis('');
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const result = await GeminiService.analyzeImage(image);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      setAnalysis('이미지 분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 bg-slate-50 border-b flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">비전 연구소</h2>
          <p className="text-sm text-slate-500">이미지에서 정보와 통찰력을 추출합니다</p>
        </div>
        <div className="flex gap-2">
          <label className="bg-white border border-slate-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
            <i className="fa-solid fa-upload mr-2"></i> 이미지 선택
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
          <button
            onClick={runAnalysis}
            disabled={!image || isAnalyzing}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 transition-colors text-sm font-medium"
          >
            {isAnalyzing ? (
              <><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> 분석 중...</>
            ) : (
              <><i className="fa-solid fa-wand-magic-sparkles mr-2"></i> AI 분석 실행</>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 p-8 overflow-y-auto">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">입력 이미지</h3>
          <div className="flex-1 min-h-[300px] border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-slate-50 overflow-hidden relative group">
            {image ? (
              <img src={image} alt="Preview" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-center text-slate-400 p-8">
                <i className="fa-solid fa-image text-5xl mb-4 block opacity-20"></i>
                <p>업로드된 이미지가 없습니다</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">AI 비전 분석 결과</h3>
          <div className="flex-1 p-6 bg-slate-900 rounded-2xl shadow-inner min-h-[300px] text-slate-100 font-mono text-sm leading-relaxed overflow-y-auto">
            {isAnalyzing ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="animate-pulse">이미지를 스캔하는 중입니다...</p>
              </div>
            ) : analysis ? (
              <div className="whitespace-pre-wrap">{analysis}</div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-center px-8">
                <p>이미지를 업로드하고 'AI 분석 실행' 버튼을 클릭하면 여기에 분석 정보가 표시됩니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionInterface;
