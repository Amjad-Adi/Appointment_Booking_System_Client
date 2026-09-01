import type { ImgHTMLAttributes } from 'react';

export interface ImageModel extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
}

export function Image({ src, alt, ...props }: ImageModel) {
    return <img src={src} alt={alt} {...props} />;
}
