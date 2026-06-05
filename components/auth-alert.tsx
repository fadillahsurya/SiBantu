export function AuthAlert({ error, message }: { error?: string; message?: string }) {
  if (!error && !message) return null;

  return (
    <div className={error ? "rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700" : "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"}>
      {error ?? message}
    </div>
  );
}
