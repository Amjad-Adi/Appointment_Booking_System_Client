import type { LucideIcon } from 'lucide-react';
import React from 'react';

export type SidebarItem = {
    title: string;
    url: string;
    icon: LucideIcon;
};

export type SidebarGroup = {
    label: string;
    items: SidebarItem[];
};

export type SidebarProps = {
    title: string;
    subtitle?: string;
    logo?: React.ReactNode;
    groups: SidebarGroup[];
    profile?: {
        name: string;
        email: string;
        url: string;
    };
    onLogout?: () => void;
};
