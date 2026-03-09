import type { KeyboardEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { buildPackageDetailHref, type PackageDetailSource } from '../features/package/model/helpers';
import { cn } from '@/lib/cn';

interface PackageNameLinkProps {
  id: string;
  name: string;
  source?: PackageDetailSource;
  className?: string;
}

function stopLinkEventPropagation(event: MouseEvent<HTMLAnchorElement> | KeyboardEvent<HTMLAnchorElement>) {
  event.stopPropagation();
}

export default function PackageNameLink({ id, name, source = 'home', className }: PackageNameLinkProps) {
  return (
    <Link
      to={buildPackageDetailHref(id, '', source)}
      className={cn(
        'inline-block max-w-full align-top font-semibold text-sm text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-2 hover:underline',
        className,
      )}
      onClick={stopLinkEventPropagation}
      onKeyDown={stopLinkEventPropagation}
    >
      <span className={cn('block max-w-full truncate')}>{name}</span>
    </Link>
  );
}
