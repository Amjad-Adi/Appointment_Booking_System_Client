import React, { type JSX } from 'react';
import { cn } from '../utlis/cn.ts';

interface Props {
    className?: string;
}

export function Skeleton({ className }: Props): JSX.Element {
    return <div className={cn(className, 'animate-pulse bg-gray-300')} />;
}
