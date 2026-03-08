import { Info } from 'lucide-react';
import { layout, surface } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

export default function RegisterNoticeSection() {
  return (
    <section>
      <div
        className={cn(
          surface.infoBox,
          layout.inlineStartGap3,
          'rounded-xl border border-blue-100 bg-blue-50/50 text-blue-800 dark:border-blue-900/30 dark:bg-blue-900/10 dark:text-blue-300',
        )}
      >
        <Info size={20} className="mt-0.5 flex-shrink-0 text-blue-500" />
        <div>
          このフォームに入力するプラグイン情報はすべて公開されます。
          <br />
          パッケージ登録は作者本人でなくてもどなたでも行えます。
        </div>
      </div>
    </section>
  );
}
