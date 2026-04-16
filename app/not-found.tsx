import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4">
      <h1 className="font-[family-name:var(--font-display)] text-6xl text-[#8b1a1a] tracking-widest">
        ERASED
      </h1>
      <p className="font-[family-name:var(--font-body)] text-xl text-[#e8e0d0] opacity-70">
        This villain was erased from history.
      </p>
      <Link
        href="/"
        className="font-[family-name:var(--font-display)] text-xs text-[#c9a84c] tracking-widest uppercase hover:opacity-70 transition-opacity"
      >
        Create a New Villain →
      </Link>
    </div>
  );
}
