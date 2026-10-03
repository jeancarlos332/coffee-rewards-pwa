import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createRedemption } from "../services/api";
import { getToken } from "../services/auth";

interface RedemptionProps {
  onBack: () => void;
}

function Redemption({ onBack }: RedemptionProps) {
  const [code, setCode] = useState("");
  const [starsUsed, setStarsUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRedemption() {
    const token = getToken();

    if (!token) {
      setError("Tu sesión ha expirado");
      setLoading(false);
      return;
    }

    try {
      const response = await createRedemption(token);

      setCode(response.code);
      setStarsUsed(response.starsUsed);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo crear la redención",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRedemption();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdf8] px-6">
        <div className="text-center">
          <div className="text-5xl">☕</div>

          <p className="mt-4 font-semibold text-[#3b2418]">
            Preparando tu redención...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#fffdf8] px-5 py-6">
        <div className="mx-auto flex min-h-[90vh] w-full max-w-md flex-col justify-center">
          <div className="rounded-3xl bg-white p-7 text-center shadow-xl">
            <div className="text-5xl">☕</div>

            <h1 className="mt-5 text-2xl font-bold text-[#3b2418]">
              No se pudo crear la redención
            </h1>

            <p className="mt-3 text-sm text-red-600">{error}</p>

            <button
              onClick={onBack}
              className="mt-7 w-full rounded-2xl bg-[#f4c430] px-5 py-4 font-bold text-[#3b2418]"
            >
              VOLVER
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf8] px-5 py-6">
      <div className="mx-auto w-full max-w-md">
        <header className="rounded-3xl bg-[#3b2418] px-6 py-7 text-center shadow-lg">
          <div className="text-4xl">☕</div>

          <h1 className="mt-2 text-2xl font-bold tracking-wide text-white">
            RATIO COFFEE
          </h1>

          <p className="mt-2 text-sm text-[#f4c430]">Bebida gratis</p>
        </header>

        <section className="mt-6 rounded-3xl bg-white p-7 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff5cc] text-3xl">
            🎉
          </div>

          <h2 className="mt-5 text-2xl font-bold text-[#3b2418]">
            ¡Redención creada!
          </h2>

          <p className="mt-2 text-sm text-[#78716c]">
            Muestra este código al personal de RATIO COFFEE.
          </p>

          <div className="mt-7 flex justify-center rounded-3xl border border-[#e7d8cd] bg-white p-5">
            <QRCodeSVG value={code} size={220} level="M" />
          </div>

          <div className="mt-5 rounded-2xl bg-[#fffdf8] px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#78716c]">
              Código de redención
            </p>

            <p className="mt-2 break-all font-mono text-sm font-bold text-[#3b2418]">
              {code}
            </p>
          </div>

          <div className="mt-5 rounded-2xl bg-[#fff5cc] px-4 py-4">
            <p className="font-bold text-[#3b2418]">
              ⏳ Pendiente de validación
            </p>

            <p className="mt-1 text-sm text-[#63402b]">
              Se descontarán {starsUsed} estrellas cuando el personal confirme
              la entrega.
            </p>
          </div>
        </section>

        <button
          onClick={onBack}
          className="mt-6 w-full py-3 text-sm font-semibold text-[#63402b]"
        >
          VOLVER
        </button>
      </div>
    </main>
  );
}

export default Redemption;
