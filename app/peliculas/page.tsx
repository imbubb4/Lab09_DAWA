import PeliculasClient from "./PeliculasClient";

type Item = { imdbID: string; Title: string; Year: string; Poster: string; Type: string };

async function fetchInitial(): Promise<Item[]> {
  const key = process.env.OMDB_KEY!;
  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", key);
  url.searchParams.set("s", "marvel"); // listado inicial "popular"
  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = await res.json();
  return data?.Search ?? [];
}

// evita cacheos agresivos (Vercel)
export const dynamic = "force-dynamic";

export default async function Page() {
  const initialItems = await fetchInitial();
  const apiKey = process.env.OMDB_KEY!; // se pasa al CSR

  return (
    <main className="mx-auto max-w-7xl px-6 pb-10">
  <header className="pt-6 pb-4 md:pt-10 md:pb-6">
    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
      Galería de Películas y Series
    </h1>
    <p className="mt-2 text-white/70">
      SSR (lista inicial) + CSR (búsqueda en tiempo real y detalle).
    </p>
  </header>

  <PeliculasClient initialItems={initialItems} apiKey={apiKey} />
</main>

  );
}
