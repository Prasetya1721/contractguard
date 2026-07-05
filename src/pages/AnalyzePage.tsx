import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Type, Loader2, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { analyzeContract, analyzeText } from '@/lib/analyzer';
import FileUploader from '@/components/ui/FileUploader';
import ProgressBar from '@/components/ui/ProgressBar';
import DisclaimerBanner from '@/components/ui/DisclaimerBanner';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

type InputMode = 'file' | 'text';

export default function AnalyzePage() {
  const navigate = useNavigate();
  const { addToHistory, setCurrentAnalysis, user, setUser } = useAppStore();

  const [inputMode, setInputMode] = useState<InputMode>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  const handleFileAccepted = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const handleAnalyze = async () => {
    if (inputMode === 'file' && !selectedFile) {
      toast.error('Pilih file terlebih dahulu.');
      return;
    }
    if (inputMode === 'text' && pastedText.trim().length < 100) {
      toast.error('Teks kontrak terlalu pendek (minimal 100 karakter).');
      return;
    }
    if (user && user.plan === 'free' && user.analysisCount >= user.analysisLimit) {
      toast.error('Batas analisis bulanan habis. Upgrade ke Pro untuk analisis tak terbatas.');
      return;
    }

    setIsAnalyzing(true);
    setProgressPercent(0);

    try {
      const onProgress = (step: string, percent: number) => {
        setProgressStep(step);
        setProgressPercent(percent);
      };

      let result;
      if (inputMode === 'file' && selectedFile) {
        result = await analyzeContract(selectedFile, onProgress);
      } else {
        result = await analyzeText(pastedText.trim(), 'teks-kontrak.txt', onProgress);
      }

      setCurrentAnalysis(result);
      addToHistory(result);

      // Increment usage counter
      if (user) {
        setUser({ ...user, analysisCount: user.analysisCount + 1 });
      }

      toast.success('Analisis selesai!');
      navigate(`/app/result/${result.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analisis gagal. Coba lagi.';
      toast.error(message);
      setIsAnalyzing(false);
      setProgressPercent(0);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analisis Kontrak</h1>
        <p className="text-gray-500 mt-1">Upload atau tempel teks kontrak untuk mulai analisis risiko.</p>
      </div>

      <DisclaimerBanner compact />

      {/* Mode selector */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {([
          { mode: 'file' as InputMode, icon: FileText, label: 'Upload File' },
          { mode: 'text' as InputMode, icon: Type, label: 'Tempel Teks' },
        ] as const).map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setInputMode(mode)}
            disabled={isAnalyzing}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              inputMode === mode
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="card p-6">
        {inputMode === 'file' ? (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">Upload Dokumen Kontrak</h2>
            <FileUploader onFileAccepted={handleFileAccepted} disabled={isAnalyzing} />
            {selectedFile && (
              <p className="text-xs text-green-600 font-medium">
                ✓ File siap dianalisis: {selectedFile.name}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Tempel Teks Kontrak</h2>
              <span className="text-xs text-gray-400">{pastedText.length} karakter</span>
            </div>
            <textarea
              className="input min-h-[280px] resize-y font-mono text-xs leading-relaxed"
              placeholder="Tempel isi teks kontrak di sini... Minimal 100 karakter untuk dianalisis."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>
        )}
      </div>

      {/* Progress */}
      {isAnalyzing && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
            <p className="font-medium text-gray-900">Menganalisis dokumen...</p>
          </div>
          <ProgressBar step={progressStep} percent={progressPercent} />
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleAnalyze}
        disabled={
          isAnalyzing ||
          (inputMode === 'file' && !selectedFile) ||
          (inputMode === 'text' && pastedText.trim().length < 100)
        }
        className="btn-primary w-full py-3 text-base"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Menganalisis...
          </>
        ) : (
          <>
            Mulai Analisis Risiko
            <ChevronRight className="w-5 h-5" />
          </>
        )}
      </button>

      <p className="text-xs text-center text-gray-400">
        Dokumen diproses secara lokal di browser Anda dan tidak dikirim ke server pihak ketiga.
      </p>
    </div>
  );
}
