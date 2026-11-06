import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';

export const DEFAULT_PICTURE_PATH = 'DEFAULT_PICTURE_PATH';

interface EntityImageProps {
    src?: string | null;
    alt: string;
    icon: LucideIcon;
    className?: string;
    imageClassName?: string;
    iconClassName?: string;
    strokeWidth?: number;
}

export function EntityImage({
    src,
    alt,
    icon: Icon,
    className = 'flex shrink-0 items-center justify-center overflow-hidden bg-secondary',
    imageClassName = 'size-full object-cover',
    iconClassName = 'size-1/2',
    strokeWidth = 1.8,
}: EntityImageProps) {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);

    const normalizedSrc = src?.trim();
    const showImage =
        Boolean(normalizedSrc) &&
        normalizedSrc !== DEFAULT_PICTURE_PATH &&
        failedSrc !== normalizedSrc;

    return (
        <div className={className}>
            {showImage ? (
                <img
                    src={normalizedSrc}
                    alt={alt}
                    className={imageClassName}
                    onError={() => setFailedSrc(normalizedSrc ?? null)}
                />
            ) : (
                <Icon
                    className={iconClassName}
                    strokeWidth={strokeWidth}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}
