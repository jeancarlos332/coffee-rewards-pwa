import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface AdminProps {
  onBack: () => void;
}

interface RedemptionData {
  id: number;
  code: string;
  status: string;
  starsUsed: number;
  customer: {
    name: string;
    phone: string;
  };
}

function Admin({ onBack }: AdminProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const [scanning, setScanning] = useState(false);
  const [code, setCode] = useState("");
  const [redemption, setRedemption] = useState<RedemptionData | null>(null);
  const [error, setError] = useState("");
  const [using, setUsing] = useState(false);
  const [success, setSuccess] = useState(false);

  async function stopScanner() {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {
        // El scanner ya estaba detenido.
      }

      scannerRef.current = null;
    }

    setScanning(false);
  }

  async function validateCode(qrCode: string) {
    await stopScanner();

    setCode(qrCode);
    setError("");

    try {
      const response = await fetch(
        `https://coffee-rewards-api.onrender.com/api/admin/redemptions/${encodeURIComponent(qrCode)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "La redención no es válida");
      }

      setRedemption(data.redemption);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "No se pudo validar el QR",
      );
    }
  }

  async function startScanner() {
    setError("");
    setRedemption(null);
    setSuccess(false);
    setCode("");

    const scanner = new Html5Qrcode("admin-qr-reader");

    scannerRef.current = scanner;
    setScanning(true);

    try {
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        (decodedText) => {
          void validateCode(decodedText);
        },
        () => {
          // Ignoramos errores de lectura mientras busca el QR.
        },
      );
    } catch {
      scannerRef.current = null;
      setScanning(false);
      setError("No se pudo acceder a la cámara. Verifica los permisos.");
    }
  }

  async function useRedemption() {
    if (!code) {
      return;
    }

    setUsing(true);
    setError("");

    try {
      const response = await fetch(
        `https://coffee-rewards-api.onrender.com/api/admin/redemptions/${encodeURIComponent(code)}/use`,
        {
          method: "POST",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "No se pudo confirmar la redención");
      }

      setSuccess(true);
      setRedemption(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo confirmar la redención",
      );
    } finally {
      setUsing(false);
    }
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        void scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#fffdf8] px-5 py-6">
      <div className="mx-auto w-full max-w-md">
        <header className="rounded-3xl bg-[#3b2418] px-6 py-7 text-center shadow-lg">
          <div className="text-4xl">☕</div>

          <h1 className="mt-2 text-2xl font-bold tracking-wide text-white">
            RATIO COFFEE
          </h1>

          <p className="mt-2 text-sm text-[#f4c430]">Panel administrativo</p>
        </header>

        {!redemption && !success && (
          <section className="mt-6 rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-[#3b2418]">
              Escanear redención
            </h2>

            <p className="mt-2 text-sm text-[#78716c]">
              Escanea el código QR que muestra el cliente.
            </p>

            <div
              id="admin-qr-reader"
              className="mt-6 overflow-hidden rounded-2xl"
            />

            {!scanning && (
              <button
                onClick={startScanner}
                className="mt-6 w-full rounded-2xl bg-[#f4c430] px-5 py-4 font-bold text-[#3b2418] shadow-sm"
              >
                📷 ESCANEAR QR
              </button>
            )}

            <div className="mt-6 border-t border-[#e7d8cd] pt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#78716c]">
                Prueba manual
              </p>

              <input
                type="text"
                placeholder="Pega aquí el código del QR"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-[#e7d8cd] bg-[#fffdf8] px-4 py-3 text-sm outline-none focus:border-[#f4c430]"
              />

              <button
                onClick={() => {
                  if (code.trim()) {
                    void validateCode(code.trim());
                  }
                }}
                className="mt-3 w-full rounded-2xl bg-[#3b2418] px-5 py-3 font-bold text-white"
              >
                VALIDAR CÓDIGO
              </button>
            </div>

            {scanning && (
              <p className="mt-4 text-center text-sm font-semibold text-[#63402b]">
                Apunta la cámara al código QR...
              </p>
            )}
          </section>
        )}

        {redemption && (
          <section className="mt-6 rounded-3xl bg-white p-7 shadow-lg">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff5cc] text-3xl">
                ✓
              </div>

              <h2 className="mt-4 text-2xl font-bold text-[#3b2418]">
                REDENCIÓN VÁLIDA
              </h2>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl bg-[#fffdf8] px-4 py-4">
                <p className="text-xs font-semibold uppercase text-[#78716c]">
                  Cliente
                </p>

                <p className="mt-1 font-bold text-[#3b2418]">
                  {redemption.customer.name}
                </p>

                <p className="text-sm text-[#78716c]">
                  {redemption.customer.phone}
                </p>
              </div>

              <div className="rounded-2xl bg-[#fff5cc] px-4 py-4">
                <p className="text-xs font-semibold uppercase text-[#78716c]">
                  Premio
                </p>

                <p className="mt-1 font-bold text-[#3b2418]">
                  ☕ Bebida gratis
                </p>

                <p className="mt-1 text-sm text-[#63402b]">
                  {redemption.starsUsed} estrellas
                </p>
              </div>
            </div>

            <button
              onClick={useRedemption}
              disabled={using}
              className="mt-6 w-full rounded-2xl bg-[#f4c430] px-5 py-4 font-bold text-[#3b2418] disabled:opacity-50"
            >
              {using ? "CONFIRMANDO..." : "CONFIRMAR ENTREGA"}
            </button>
          </section>
        )}

        {success && (
          <section className="mt-6 rounded-3xl bg-white p-7 text-center shadow-lg">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff5cc] text-4xl">
              ✓
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[#3b2418]">
              ¡Entrega confirmada!
            </h2>

            <p className="mt-2 text-sm text-[#78716c]">
              La redención fue utilizada y las estrellas fueron descontadas.
            </p>

            <button
              onClick={() => {
                setSuccess(false);
                setCode("");
                setRedemption(null);
              }}
              className="mt-7 w-full rounded-2xl bg-[#f4c430] px-5 py-4 font-bold text-[#3b2418]"
            >
              ESCANEAR OTRA
            </button>
          </section>
        )}

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 px-4 py-4 text-center text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={() => {
            void stopScanner();
            onBack();
          }}
          className="mt-6 w-full py-3 text-sm font-semibold text-[#63402b]"
        >
          VOLVER
        </button>
      </div>
    </main>
  );
}

export default Admin;
