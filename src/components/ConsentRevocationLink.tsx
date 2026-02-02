'use client';

/**
 * Link that re-opens Google's CMP consent message so users in EEA/UK/CH can change their choices.
 * Only useful once the European regulations message is created and published in AdSense → Privacy & messaging.
 */
export function ConsentRevocationLink({
  children = 'Privacy & cookie settings',
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== 'undefined' && (window as unknown as { googlefc?: { showRevocationMessage?: () => void } }).googlefc?.showRevocationMessage) {
          (window as unknown as { googlefc: { showRevocationMessage: () => void } }).googlefc.showRevocationMessage();
        }
      }}
      className={`text-sm text-globalist-gray-600 hover:text-bloomberg-blue hover:underline ${className}`}
    >
      {children}
    </button>
  );
}
