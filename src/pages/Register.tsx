import { useState } from "react"
import { register } from "../services/api"
import { saveToken } from "../services/auth"

interface RegisterProps {
  onRegister: () => void
  onLogin: () => void
}

function Register({ onRegister, onLogin }: RegisterProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    setError("")

    if (pin !== confirmPin) {
      setError("Los PIN no coinciden")
      return
    }

    setLoading(true)

    try {
      const response = await register(name, phone, pin)

      saveToken(response.accessToken)

      onRegister()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo crear la cuenta",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fffdf8] px-6 py-10">
      <div className="mx-auto flex min-h-[90vh] w-full max-w-md flex-col justify-center">
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="bg-[#3b2418] px-6 py-8 text-center">
            <div className="text-4xl">☕</div>

            <h1 className="mt-3 text-2xl font-bold tracking-wide text-white">
              RATIO COFFEE
            </h1>

            <p className="mt-1 text-sm text-[#f4c430]">
              Tu café, tus estrellas
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 px-6 py-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#3b2418]">
                Crear cuenta
              </h2>

              <p className="mt-1 text-sm text-[#78716c]">
                Regístrate con tu número de teléfono
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#3b2418]">
                Nombre
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-2xl border border-[#e7d8cd] bg-[#fffdf8] px-4 py-3 outline-none focus:border-[#f4c430]"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#3b2418]">
                Número de teléfono
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="3001234567"
                className="w-full rounded-2xl border border-[#e7d8cd] bg-[#fffdf8] px-4 py-3 outline-none focus:border-[#f4c430]"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#3b2418]">
                Crea un PIN
              </label>

              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                placeholder="••••"
                className="w-full rounded-2xl border border-[#e7d8cd] bg-[#fffdf8] px-4 py-3 outline-none focus:border-[#f4c430]"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#3b2418]">
                Confirma tu PIN
              </label>

              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={confirmPin}
                onChange={(event) =>
                  setConfirmPin(event.target.value)
                }
                placeholder="••••"
                className="w-full rounded-2xl border border-[#e7d8cd] bg-[#fffdf8] px-4 py-3 outline-none focus:border-[#f4c430]"
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#f4c430] px-5 py-4 font-bold text-[#3b2418] shadow-sm transition hover:bg-[#ffd84d] disabled:opacity-50"
            >
              {loading ? "CREANDO CUENTA..." : "CREAR CUENTA"}
            </button>

            <button
              type="button"
              onClick={onLogin}
              className="w-full py-2 text-sm font-semibold text-[#63402b]"
            >
              Ya tengo una cuenta
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Register