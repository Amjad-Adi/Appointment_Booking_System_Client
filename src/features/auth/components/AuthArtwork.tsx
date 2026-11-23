import type { ImgHTMLAttributes } from 'react';
import login480 from '../../../assets/images/icons/icon-480.webp';
import login768 from '../../../assets/images/icons/icon-768.webp';
import login1024 from '../../../assets/images/icons/icon-1024.webp';
import general400 from '../../../assets/images/register_images/register-image-general-400.webp';
import general640 from '../../../assets/images/register_images/register-image-general-640.webp';
import general896 from '../../../assets/images/register_images/register-image-general-896.webp';
import flow400 from '../../../assets/images/register_images/register-image-flow-400.webp';
import flow640 from '../../../assets/images/register_images/register-image-flow-640.webp';
import flow896 from '../../../assets/images/register_images/register-image-flow-896.webp';

const artwork = {
    login: {
        src: login1024,
        srcSet: `${login480} 480w, ${login768} 768w, ${login1024} 1024w`,
        sizes: '(min-width: 1024px) 38vw, (min-width: 640px) 45vw, 70vw',
        width: 1024,
        height: 1024,
    },
    registerGeneral: {
        src: general896,
        srcSet: `${general400} 400w, ${general640} 640w, ${general896} 896w`,
        sizes: '(min-width: 768px) 28vw, (min-width: 640px) 40vw, 72vw',
        width: 896,
        height: 1200,
    },
    registerFlow: {
        src: flow896,
        srcSet: `${flow400} 400w, ${flow640} 640w, ${flow896} 896w`,
        sizes: '(min-width: 768px) 28vw, (min-width: 640px) 40vw, 72vw',
        width: 896,
        height: 1200,
    },
};

type AuthArtworkProps = Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'srcSet' | 'sizes' | 'width' | 'height' | 'loading' | 'fetchPriority'
> & {
    kind: keyof typeof artwork;
    alt: string;
    priority?: boolean;
};

// Above-the-fold artwork is eager. Only the second registration slide is low priority.
export function AuthArtwork({ kind, priority = false, alt, ...props }: AuthArtworkProps) {
    return (
        <img
            {...props}
            {...artwork[kind]}
            alt={alt}
            loading="eager"
            decoding="async"
            fetchPriority={priority ? 'high' : 'low'}
        />
    );
}
