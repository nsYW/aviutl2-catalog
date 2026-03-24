import { memo } from 'react';
import { Calendar, TriangleAlert, User } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import type { PackageCardItem } from '../types';
import { cn } from '@/lib/cn';
import { text } from '@/components/ui/_styles';

interface PackageCardMetaSectionProps {
  item: PackageCardItem;
  lastUpdated: string;
  tags: string[];
}

function PackageCardMetaSection({ item, lastUpdated, tags }: PackageCardMetaSectionProps) {
  return (
    <>
      <div className="mb-1">
        <h3
          className={cn(
            'font-bold text-xl text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate pr-2 tracking-tight',
            item.deprecation
              ? 'text-yellow-600 dark:text-yellow-400 group-hover:text-yellow-700 dark:group-hover:text-yellow-300'
              : '',
          )}
          title={item.name}
        >
          {item.deprecation && <TriangleAlert className="inline text-yellow-600 dark:text-yellow-400 mr-1" />}
          {item.name}
        </h3>

        <div className={cn(text.mutedSm, 'flex items-center gap-3 mt-0.5 mb-1 font-medium')}>
          <div className="flex items-center gap-1 min-w-0">
            <User size={14} className="text-slate-400" />
            <span className="truncate">{item.author || '?'}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Calendar size={14} className="text-slate-400" />
            <span>{lastUpdated}</span>
          </div>
        </div>
      </div>

      <p className="text-[15px] text-slate-500 dark:text-slate-400/90 line-clamp-3 leading-normal mb-auto">
        {item.summary || item.description || ''}
      </p>

      <div className="flex flex-wrap gap-1 mt-1.5 mb-1">
        {tags.slice(0, 3).map((tag, index) => (
          <Badge
            key={`${tag}-${index}`}
            variant="neutral"
            shape="rounded"
            size="xxs"
            className="px-1.5 py-0.5 text-[10px] font-medium"
          >
            {tag}
          </Badge>
        ))}
        {tags.length > 3 ? (
          <Badge
            variant="neutral"
            shape="rounded"
            size="xxs"
            className="px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500"
          >
            +{tags.length - 3}
          </Badge>
        ) : null}
      </div>
    </>
  );
}

export default memo(PackageCardMetaSection);
