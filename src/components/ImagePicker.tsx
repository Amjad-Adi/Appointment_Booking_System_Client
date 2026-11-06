import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ImagePlus, Trash2, Upload } from 'lucide-react';

interface ImagePickerProps {
    file: File | null;
    onChange: (file: File | null) => void;
    currentPath?: string | null;
    label?: string;
    description?: string;
    fallback?: ReactNode;
    rounded?: 'full' | 'xl';
    disabled?: boolean;
}

function useObjectUrl(file: File | null) {
    const [url, setUrl] = useState<string | undefined>();

    useEffect(() => {
        if (!file) {
            setUrl(undefined);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return url;
}

export function ImagePicker({
    file,
    onChange,
    currentPath,
    label = 'Picture',
    description = 'PNG, JPG or WEBP. The image is uploaded to Cloudinary.',
    fallback,
    rounded = 'xl',
    disabled = false,
}: ImagePickerProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const previewUrl = useObjectUrl(file);
    const [failedSource, setFailedSource] = useState<string | null>(null);

    const hasStoredPicture = Boolean(
        currentPath && currentPath !== 'DEFAULT_PICTURE_PATH',
    );

    const source = previewUrl ?? (hasStoredPicture ? currentPath : undefined);

    return (
        <div className="flex flex-col gap-2">
            <span className="text-[11px] font-medium text-foreground">{label}</span>

            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                <div
                    className={`flex size-20 shrink-0 items-center justify-center overflow-hidden border border-border bg-secondary ${
                        rounded === 'full' ? 'rounded-full' : 'rounded-xl'
                    }`}
                >
                    {source && failedSource !== source ? (
                        <img
                            src={source}
                            alt={label}
                            className="size-full object-cover"
                            onError={() => setFailedSource(source)}
                        />
                    ) : (
                        (fallback ?? <ImagePlus className="size-7 text-muted-foreground" strokeWidth={1.6} />)
                    )}
                </div>

                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={disabled}
                        onChange={(event) => {
                            onChange(event.target.files?.[0] ?? null);
                            event.target.value = '';
                        }}
                    />

                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => inputRef.current?.click()}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-[10px] font-semibold text-secondary-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Upload className="size-3.5" strokeWidth={1.8} />
                        {source ? 'Change image' : 'Upload image'}
                    </button>

                    {file ? (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => onChange(null)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-destructive-border bg-transparent px-2.5 text-[10px] font-semibold text-destructive transition-colors hover:bg-destructive-soft disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Trash2 className="size-3.5" strokeWidth={1.8} />
                            Clear selection
                        </button>
                    ) : null}
                </div>
            </div>

            {description ? (
                <p className="text-[9px] leading-4 text-muted-foreground">{description}</p>
            ) : null}
        </div>
    );
}
