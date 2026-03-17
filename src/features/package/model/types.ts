import type { License } from '../../../utils/catalogSchema';

export interface CarouselImage {
  src: string;
  alt: string;
}

export type PackageLicenseEntry = License & { key: string; body: string };
