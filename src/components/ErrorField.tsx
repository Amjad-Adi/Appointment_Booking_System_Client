interface ErrorFieldProps {
    errorMessage?: string;
}

export function ErrorField({ errorMessage }: ErrorFieldProps) {
    return (
        <div className="min-h-[18px] w-full max-w-full min-w-0 pt-1 sm:min-h-[20px]">
            {errorMessage && (
                <p className="text-error max-w-full ps-2 text-left text-[10px] leading-tight break-words sm:text-[12px]">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}
