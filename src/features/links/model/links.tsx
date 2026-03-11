import type { ComponentType } from 'react';
import { BookOpenText, Globe, MessagesSquare, MessageSquareMore, PlusCircle } from 'lucide-react';
import { SiDiscord, SiGithub } from 'react-icons/si';
import { APP_ROUTE_PATHS } from '@/routePaths';

type LinkIconProps = {
  size?: number;
  className?: string;
};

type LinkIconType = ComponentType<LinkIconProps>;

export interface LinkEntry {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LinkIconType;
}

export interface LinkSection {
  id: string;
  title: string;
  description: string;
  icon: LinkIconType;
  baseColor: string;
  links: readonly LinkEntry[];
}

export const LINK_SECTIONS: readonly LinkSection[] = [
  {
    id: 'official',
    title: 'AviUtl2 本体',
    description: 'AviUtl2 本体の公式サイトと関連情報のリンク',
    icon: Globe,
    baseColor: 'oklch(0.62 0.17 252)',
    links: [
      {
        id: 'official-site',
        title: '公式サイト',
        description: 'AviUtl2 公式サイト「AviUtlのお部屋」',
        href: 'https://spring-fragrance.mints.ne.jp/aviutl/',
        icon: Globe,
      },
      {
        id: 'official-changelog',
        title: '更新履歴（by Nanashi.）',
        description: 'AviUtl2 本体の更新履歴を確認できる非公式サイト',
        href: 'https://docs.aviutl2.jp/changelog',
        icon: BookOpenText,
      },
    ],
  },
  {
    id: 'community',
    title: 'コミュニティ',
    description: 'AviUtl2 ユーザーコミュニティリンク',
    icon: SiDiscord,
    baseColor: 'oklch(0.5774 0.20 273.85)',
    links: [
      {
        id: 'community-discord',
        title: 'Discord',
        description: 'AviUtl2 の情報交換や質問ができる非公式 Discord コミュニティ',
        href: 'https://discord.gg/au2-daro',
        icon: SiDiscord,
      },
    ],
  },
  {
    id: 'support',
    title: 'サポート',
    description: 'AviUtl2カタログのサポートのリンク',
    icon: MessageSquareMore,
    baseColor: 'oklch(0.7132 0.2 142.67)',
    links: [
      {
        id: 'support-feedback',
        title: 'フィードバック',
        description: '不具合報告や改善要望・問い合わせの送信するフォーム',
        href: APP_ROUTE_PATHS.feedback,
        icon: MessagesSquare,
      },
      {
        id: 'support-register',
        title: 'パッケージ登録',
        description: 'パッケージの新規掲載や登録内容の修正を行うフォーム',
        href: APP_ROUTE_PATHS.register,
        icon: PlusCircle,
      },
    ],
  },
  {
    id: 'developers',
    title: '開発者向け',
    description: 'AviUtl2カタログへパッケージを掲載する開発者向けのリンク',
    icon: BookOpenText,
    baseColor: 'oklch(0.62 0.19 312)',
    links: [
      {
        id: 'developers-register-guide',
        title: 'パッケージの掲載方法',
        description: 'パッケージを掲載するための手順を開設したガイドドキュメント',
        href: 'https://github.com/Neosku/aviutl2-catalog-data/blob/main/register-package.md',
        icon: BookOpenText,
      },
      {
        id: 'developers-update-status',
        title: '自動更新対応状況',
        description: '掲載パッケージの自動更新対応状況をまとめたドキュメント',
        href: 'https://github.com/Neosku/aviutl2-catalog-data/blob/main/%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8.md',
        icon: BookOpenText,
      },
    ],
  },
  {
    id: 'catalog',
    title: 'GitHubリポジトリ',
    description: 'AviUtl2カタログ関連のGitHubリポジトリへのリンク',
    icon: SiGithub,
    baseColor: 'oklch(0.56 0.02 260)',
    links: [
      {
        id: 'catalog-github-app',
        title: 'AviUtl2カタログ リポジトリ',
        description: 'AviUtl2カタログ本体の GitHub リポジトリ',
        href: 'https://github.com/Neosku/aviutl2-catalog',
        icon: SiGithub,
      },
      {
        id: 'catalog-github-data',
        title: 'カタログデータ レポジトリ',
        description: '掲載パッケージデータの GitHub 管理リポジトリ',
        href: 'https://github.com/Neosku/aviutl2-catalog-data',
        icon: SiGithub,
      },
    ],
  },
];
