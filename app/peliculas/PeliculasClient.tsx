"use client";
import { useEffect, useMemo, useState } from "react";

type Item = { imdbID: string; Title: string; Year: string; Poster: string; Type: string };

export default function PeliculasClient({
  initialItems,
  apiKey,
}: {
  initialItems: Item[];
  apiKey: string;
}) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Debounce
  const debouncedQ = useMemo(() => q, [q]);
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!debouncedQ.trim()) return; // sin query: dejamos SSR inicial
      setLoading(true);
      setError(null);
      try {
        const url = new URL("https://www.omdbapi.com/");
        url.searchParams.set("apikey", apiKey);
        url.searchParams.set("s", debouncedQ.trim());
        const res = await fetch(url.toString());
        const data = await res.json();
        if (data?.Response === "False") {
          setItems([]);
          setError(data?.Error || "Sin resultados");
        } else {
          setItems(data?.Search ?? []);
        }
      } catch (e: any) {
        setError("No se pudo buscar. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [debouncedQ, apiKey]);

  // Detalle (modal)
  useEffect(() => {
    if (!openId) return;
    (async () => {
      setDetail(null);
      try {
        const url = new URL("https://www.omdbapi.com/");
        url.searchParams.set("apikey", apiKey);
        url.searchParams.set("i", openId);
        const res = await fetch(url.toString());
        const data = await res.json();
        setDetail(data);
      } catch {
        setDetail({ Error: "No se pudo cargar el detalle." });
      }
    })();
  }, [openId, apiKey]);

  return (
    <section className="space-y-5">
      <div className="flex gap-3">
        <input
          placeholder="Busca por título… (ej. marvel, suits, avengers)"
          className="input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading && <p className="muted">Buscando…</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {items.length === 0 && !loading && !q && (
        <p className="muted">No hay elementos iniciales.</p>
      )}
      {items.length === 0 && !loading && q && (
        <p className="muted">Sin resultados para “{q}”.</p>
      )}

      {/* GRID de cards estilo HBO */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
        {items.map((m) => (
          <li
            key={m.imdbID}
            className="card-hbo group"
            onClick={() => setOpenId(m.imdbID)}
            title="Ver detalle"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.Poster !== "N/A" ? m.Poster : "/placeholder.png"}
              alt={m.Title}
              className="poster group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 rounded-2xl" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="font-semibold text-white line-clamp-2 drop-shadow">
                {m.Title}
              </p>
              <p className="text-[12px] text-white/80 mt-1">
                {m.Year} • {m.Type}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* MODAL estilo HBO (glass/blur) */}
      {openId && (
        <div className="modal-hbo-backdrop" onClick={() => setOpenId(null)}>
          <div className="modal-hbo-panel" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close" onClick={() => setOpenId(null)} aria-label="Cerrar">
              ✕
            </button>

            {!detail ? (
              <p className="text-white/80">Cargando…</p>
            ) : detail?.Error ? (
              <p className="text-red-300">{detail.Error}</p>
            ) : (
              <div className="grid md:grid-cols-[38%_1fr] gap-6 items-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={detail.Poster !== "N/A" ? detail.Poster : "/placeholder.png"}
                  alt={detail.Title}
                  className="w-full h-[420px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="space-y-3">
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                    {detail.Title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-white/80">
                    {detail.Year && <span className="badge">{detail.Year}</span>}
                    {detail.Rated && <span className="badge">{detail.Rated}</span>}
                    {detail.Runtime && <span className="badge">{detail.Runtime}</span>}
                    {detail.Type && <span className="badge capitalize">{detail.Type}</span>}
                  </div>

                  {detail.Genre && (
                    <p className="text-white/90">
                      <span className="label">Género:</span> {detail.Genre}
                    </p>
                  )}
                  {detail.Director && (
                    <p className="text-white/90">
                      <span className="label">Director:</span> {detail.Director}
                    </p>
                  )}
                  {detail.Actors && (
                    <p className="text-white/90">
                      <span className="label">Actores:</span> {detail.Actors}
                    </p>
                  )}
                  {detail.imdbRating && (
                    <p className="text-white/90">
                      <span className="label">IMDb:</span> {detail.imdbRating}
                    </p>
                  )}
                  {detail.Plot && (
                    <p className="text-[15px] leading-6 text-white/90 mt-2">
                      {detail.Plot}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
