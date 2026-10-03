import type { MeResponse } from "../services/api";

interface HomeProps {
  customer: MeResponse;
  onRedeem: () => void;
  onLogout: () => void;
}

function Home({ customer, onRedeem, onLogout }: HomeProps) {
  const progress = Math.min(
    (customer.stars / customer.freeDrinkStars) * 100,
    100,
  );

  const remainingStars = Math.max(customer.freeDrinkStars - customer.stars, 0);

  return (
    <main className="min-h-screen bg-[#fffdf8] px-5 py-6">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <header className="rounded-3xl bg-[#3b2418] px-6 py-7 text-center shadow-lg">
          <div className="text-4xl">☕</div>

          <h1 className="mt-2 text-2xl font-bold tracking-wide text-white">
            RATIO COFFEE
          </h1>

          <p className="mt-2 text-sm text-[#f4c430]">Tu café, tus estrellas</p>
        </header>

        {/* Greeting */}
        <section className="mt-6">
          <p className="text-sm text-[#78716c]">Hola,</p>

          <h2 className="text-2xl font-bold text-[#3b2418]">
            {customer.name} 👋
          </h2>
        </section>

        {/* Stars */}
        <section className="mt-6 rounded-3xl bg-white p-7 text-center shadow-lg">
          <p className="text-6xl font-bold text-[#3b2418]">{customer.stars}</p>

          <p className="mt-2 font-bold tracking-wide text-[#63402b]">
            ⭐ ESTRELLAS
          </p>

          {/* Progress */}
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#63402b]">
                Progreso
              </span>

              <span className="text-sm font-bold text-[#3b2418]">
                {customer.stars} / {customer.freeDrinkStars}
              </span>
            </div>

            <div className="h-5 overflow-hidden rounded-full bg-[#f3e8df]">
              <div
                className="h-full rounded-full bg-[#f4c430] transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-3">
              {customer.canRedeem ? (
                <p className="font-semibold text-[#3b2418]">
                  🎉 ¡Ya puedes reclamar tu bebida gratis!
                </p>
              ) : (
                <p className="text-sm text-[#78716c]">
                  Te faltan{" "}
                  <strong className="text-[#3b2418]">{remainingStars}</strong>{" "}
                  estrellas para una bebida gratis.
                </p>
              )}
            </div>
          </div>

          {/* Redeem */}
          {customer.canRedeem && (
            <button
              onClick={onRedeem}
              className="mt-7 w-full rounded-2xl bg-[#f4c430] px-5 py-4 font-bold text-[#3b2418] shadow-sm transition hover:bg-[#ffd84d] active:scale-[0.98]"
            >
              RECLAMAR BEBIDA GRATIS
            </button>
          )}
        </section>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="mt-6 w-full py-3 text-sm font-semibold text-[#63402b]"
        >
          CERRAR SESIÓN
        </button>

        <button
          onClick={() => {
            window.location.href = "/admin";
          }}
          className="mt-2 w-full py-3 text-sm font-semibold text-[#63402b]"
        >
          ADMIN
        </button>
      </div>
    </main>
  );
}

export default Home;
