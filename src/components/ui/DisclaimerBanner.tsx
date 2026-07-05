import { cn } from '@/lib/utils';

interface DisclaimerBannerProps {
  className?: string;
  compact?: boolean;
}

export default function DisclaimerBanner({ className, compact }: DisclaimerBannerProps) {
  return (
    <div
      className={cn(
        'flex gap-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800',
        compact ? 'p-3' : 'p-4',
        className,
      )}
      role="note"
      aria-label="Disclaimer legal"
    >
      <span className="text-amber-500 shrink-0 mt-0.5 text-base">⚠</span>
      <p className={cn('text-amber-800', compact ? 'text-xs' : 'text-sm')}>
        <strong>Disclaimer:</strong> Hasil analisis ini dihasilkan secara otomatis dan bersifat sebagai alat bantu awal{' '}
        <em>(preliminary screening)</em>. Analisis ini <strong>bukan</strong> merupakan nasihat hukum dan tidak
        menggantikan konsultasi dengan advokat/konsultan hukum berlisensi. Pengguna disarankan untuk melakukan
        verifikasi lebih lanjut sebelum mengambil keputusan hukum apa pun.
      </p>
    </div>
  );
}
