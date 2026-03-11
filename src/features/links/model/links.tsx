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
    description: 'AviUtl2 本体に関連する公式・関連サイトです。',
    icon: Globe,
    baseColor: 'oklch(0.62 0.17 252)',
    links: [
      {
        id: 'official-site',
        title: '公式サイト',
        description: 'AviUtl2 の公式サイト AviUtlのお部屋 です。',
        href: 'https://spring-fragrance.mints.ne.jp/aviutl/',
        icon: Globe,
      },
      {
        id: 'official-changelog',
        title: '更新履歴（by Nanashi.）',
        description: 'AviUtl2 本体の更新履歴を簡単に確認できる非公式サイトです。',
        href: 'https://docs.aviutl2.jp/changelog',
        icon: BookOpenText,
      },
    ],
  },
  {
    id: 'community',
    title: 'コミュニティ',
    description: 'AviUtl2 に関する情報交換や相談ができるコミュニティです。',
    icon: SiDiscord,
    baseColor: 'oklch(0.5774 0.20 273.85)',
    links: [
      {
        id: 'community-discord',
        title: 'Discord',
        description: 'AviUtl2 関連の情報交換や質問ができる非公式 Discord コミュニティです。',
        href: 'https://discord.gg/au2-daro',
        icon: SiDiscord,
      },
    ],
  },
  {
    id: 'support',
    title: 'サポート',
    description: 'AviUtl2カタログに関するフィードバックや掲載申請を行えます。',
    icon: MessageSquareMore,
    baseColor: 'oklch(0.7132 0.2 142.67)',
    links: [
      {
        id: 'support-feedback',
        title: 'フィードバックを送る',
        description: '不具合報告や改善要望をアプリ内から送信できます。',
        href: APP_ROUTE_PATHS.feedback,
        icon: MessagesSquare,
      },
      {
        id: 'support-register',
        title: 'パッケージ登録',
        description: '新規掲載の申請や登録内容の入力をアプリ内で行えます。',
        href: APP_ROUTE_PATHS.register,
        icon: PlusCircle,
      },
    ],
  },
  {
    id: 'developers',
    title: '開発者向け',
    description: 'AviUtl2カタログにパッケージを登録するための開発者向け情報です。',
    icon: BookOpenText,
    baseColor: 'oklch(0.62 0.19 312)',
    links: [
      {
        id: 'developers-register-guide',
        title: 'パッケージの掲載方法',
        description: '掲載申請の流れや必要な情報を確認できるガイドです。',
        href: 'https://github.com/Neosku/aviutl2-catalog-data/blob/main/register-package.md',
        icon: BookOpenText,
      },
      {
        id: 'developers-update-status',
        title: '自動更新対応状況',
        description: '掲載パッケージが自動更新プログラムに対応しているかの状況を確認できます。',
        href: 'https://github.com/Neosku/aviutl2-catalog-data/blob/main/%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8.md',
        icon: BookOpenText,
      },
    ],
  },
  {
    id: 'catalog',
    title: 'AviUtl2カタログ リポジトリ',
    description: 'AviUtl2カタログのアプリ本体およびデータ管理リポジトリです。',
    icon: SiGithub,
    baseColor: 'oklch(0.56 0.02 260)',
    links: [
      {
        id: 'catalog-github-app',
        title: '本ソフトのレポジトリ',
        description: 'AviUtl2カタログ本体のソースコードを管理している GitHub リポジトリです。',
        href: 'https://github.com/Neosku/aviutl2-catalog',
        icon: SiGithub,
      },
      {
        id: 'catalog-github-data',
        title: 'データ管理レポジトリ',
        description: '掲載パッケージのデータを管理している GitHub リポジトリです。',
        href: 'https://github.com/Neosku/aviutl2-catalog-data',
        icon: SiGithub,
      },
    ],
  },
];
