
import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const AnalysisInterface: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim() || isProcessing) return;
    setIsProcessing(true);
    try {
      const analysis = await GeminiService.analyzeText(text);
      setResult(analysis);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const sentimentData = result ? [
    { name: '긍정 지수', value: result.score },
    { name: '나머지', value: 1 - result.score }
  ] : [];

  const COLORS = ['#3b82f6', '#e2e8f0'];

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 bg-slate-50 border-b">
        <h2 className="text-xl font-bold text-slate-800">콘텐츠 지능화</h2>
        <p className="text-sm text-slate-500">고급 감성 분석 및 주제 추출 도구</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 overflow-y-auto">
        {/* Input Side */}
        <div className="lg:w-1/3 flex flex-col space-y-4">
          <label className="text-sm font-semibold text-slate-600 uppercase">분석 문서 입력</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="분석할 텍스트나 기사 내용을 여기에 붙여넣으세요..."
            className="flex-1 p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[300px] text-sm"
          />
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-xl transition-all disabled:from-slate-300 disabled:to-slate-300"
          >
            {isProcessing ? (
              <><i className="fa-solid fa-gear fa-spin mr-2"></i> 문맥 분석 중...</>
            ) : (
              '문서 처리하기'
            )}
          </button>
        </div>

        {/* Results Side */}
        <div className="lg:w-2/3 flex flex-col space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-quote-left"></i> AI 요약 결과
                </h3>
                <p className="text-blue-800 text-sm leading-relaxed">{result.summary}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sentiment Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <h4 className="font-semibold text-slate-700 mb-4 text-sm uppercase">감성 분석 점수</h4>
                  <div className="flex-1 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-2">
                    <span className={`text-2xl font-bold ${
                      result.sentiment.toLowerCase().includes('positive') || result.sentiment.includes('긍정') ? 'text-green-500' : 
                      result.sentiment.toLowerCase().includes('negative') || result.sentiment.includes('부정') ? 'text-red-500' : 
                      'text-slate-500'
                    }`}>
                      {result.sentiment}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">전체적인 톤</p>
                  </div>
                </div>

                {/* Topics List */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-semibold text-slate-700 mb-4 text-sm uppercase">주요 주제 및 키워드</h4>
                  <div className="space-y-3">
                    {result.topics.map((topic, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span>{topic.name}</span>
                          <span className="text-slate-400">연관성 {(topic.relevance * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full rounded-full" 
                            style={{ width: `${topic.relevance * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 p-12 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-6">
                <i className="fa-solid fa-chart-line text-3xl text-blue-200"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-700">통찰력을 얻을 준비가 되셨나요?</h3>
              <p className="text-slate-500 max-w-sm mx-auto mt-2">
                텍스트나 보고서를 왼쪽 창에 입력하고 '문서 처리하기' 버튼을 눌러 AI 기반의 지표와 요약을 확인해 보세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisInterface;
