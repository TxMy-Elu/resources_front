import Link from "next/link";

export default function Home() {
    return (
        <main
            role="main"
            aria-labelledby="maintenance-title"
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-black p-6">
            <div
                className="relative w-full max-w-3xl rounded-2xl bg-white/5 border border-white/10 p-8 md:p-12 text-slate-100 shadow-2xl backdrop-blur-md overflow-hidden">
                <div className="pointer-events-none absolute -left-20 -top-20 opacity-80">
                    <svg
                        className="w-40 h-40 animate-spin"
                        style={{animationDuration: "9s"}}
                        viewBox="0 0 64 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <defs>
                            <linearGradient id="g" x1="0" x2="1">
                                <stop offset="0" stopColor="#ff8a00"/>
                                <stop offset="1" stopColor="#e52e71"/>
                            </linearGradient>
                        </defs>
                        <circle cx="32" cy="32" r="20" stroke="url(#g)" strokeWidth="3" opacity="0.12"/>
                        <g transform="translate(0,0)" stroke="url(#g)" strokeWidth="2" strokeLinecap="round"
                           strokeLinejoin="round">
                            <path
                                d="M32 24v-6M32 46v6M24 32h-6M46 32h6M25.5 25.5l-4.2-4.2M42.7 42.7l4.2 4.2M25.5 38.5l-4.2 4.2M42.7 21.3l4.2-4.2"/>
                            <circle cx="32" cy="32" r="7"/>
                        </g>
                    </svg>
                </div>

                <h1 id="maintenance-title" className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    Maintenance en cours
                </h1>

                <p className="mt-3 text-slate-200 max-w-prose">
                    On peaufine le site pour une meilleure expérience. Merci de votre patience.
                </p>

                <div className="mt-4">
                    <Link href="/" className="text-sm text-slate-200/90 underline decoration-white/5">
                        Retour à l&rsquo;accueil
                    </Link>
                </div>

                <div className="mt-8 text-xs text-slate-400">
                    <span>Nous serons de retour bientôt.</span>
                </div>
            </div>
        </main>
    );
}
