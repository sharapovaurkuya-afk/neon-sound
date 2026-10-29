import SpecializationSelect from "./SpecializationSelect";
import { useEffect, useState, type FormEvent } from "react";
import "./App.css";
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  type CurrentUser,
} from "./api/auth";

type Page = "login" | "register" | "profile";

function App() {
  const [page, setPage] = useState<Page>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [specialization, setSpecialization] = useState("vocals");
  const [bio, setBio] = useState("");
  const [fee, setFee] = useState("");

  function showError(error: unknown) {
    setMessage(error instanceof Error ? error.message : "Произошла ошибка");
    setMessageType("error");
  }

  function showSuccess(text: string) {
    setMessage(text);
    setMessageType("success");
  }

  function fillProfile(data: CurrentUser) {
    setUser(data);
    setFirstName(data.profile.first_name ?? "");
    setSpecialization(data.profile.specialization ?? "vocals");
    setBio(data.profile.bio ?? "");
    setFee(data.profile.fee ?? "");
    setPage("profile");
  }

  useEffect(() => {
    let active = true;

    getProfile()
      .then((data) => {
        if (active) fillProfile(data);
      })
      .catch(() => {
        // Пользователь ещё не авторизован.
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await register({ username, password });
      setPassword("");
      setPage("login");
      showSuccess("Аккаунт создан! Теперь войдите.");
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await login({ username, password });
      const data = await getProfile();
      fillProfile(data);
      setPassword("");
      showSuccess("Добро пожаловать в NEON SOUND!");
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    setMessage("");

    try {
      await logout();
      setUser(null);
      setPassword("");
      setPage("login");
      showSuccess("Вы вышли из аккаунта.");
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateProfile({
        first_name: firstName,
        specialization,
        bio,
        fee,
      });

      const data = await getProfile();
      fillProfile(data);
      showSuccess("Профиль сохранён!");
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <section className="auth-card">
        <div className="brand-icon">♫</div>
        <h1>NEON SOUND</h1>
        <p className="subtitle">Музыка объединяет нас</p>

        {!user && (
          <nav className="tabs">
            <button
              type="button"
              className={page === "login" ? "active" : ""}
              onClick={() => {
                setPage("login");
                setMessage("");
              }}
            >
              Вход
            </button>

            <button
              type="button"
              className={page === "register" ? "active" : ""}
              onClick={() => {
                setPage("register");
                setMessage("");
              }}
            >
              Регистрация
            </button>
          </nav>
        )}

        {message && (
          <p className={`notice ${messageType}`} role="status">
            {message}
          </p>
        )}

        {page === "login" && !user && (
          <form onSubmit={handleLogin}>
            <h2>С возвращением!</h2>
            <p className="form-description">Войди в свой музыкальный мир</p>

            <label htmlFor="username">Логин</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="Введите логин"
              required
            />

            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Введите пароль"
              required
            />

            <button className="primary" disabled={loading}>
              Войти
            </button>
          </form>
        )}

        {page === "register" && !user && (
          <form onSubmit={handleRegister}>
            <h2>Создай аккаунт</h2>
            <p className="form-description">Присоединяйся к NEON SOUND</p>

            <label htmlFor="register-username">Логин</label>
            <input
              id="register-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="Придумайте логин"
              required
            />

            <label htmlFor="register-password">Пароль</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Придумайте пароль"
              required
            />

            <button className="primary" disabled={loading}>
              Зарегистрироваться
            </button>
          </form>
        )}

        {page === "profile" && user && (
          <form onSubmit={handleProfileUpdate}>
            <h2>Мой профиль</h2>
            <p className="form-description">Логин: {user.username}</p>

            <label htmlFor="first-name">Имя</label>
            <input
              id="first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <label htmlFor="specialization">Специализация</label>
            
<SpecializationSelect
  value={specialization}
  onChange={setSpecialization}
/>


            <label htmlFor="bio">О себе</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Расскажи о себе"
            />

            <label htmlFor="fee">Стоимость услуги</label>
            <input
              id="fee"
              type="number"
              min="0"
              step="0.01"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              required
            />

            <button className="primary" disabled={loading}>
              Сохранить профиль
            </button>

            <button
              type="button"
              className="logout-icon"
              disabled={loading}
              onClick={handleLogout}
              aria-label="Выйти из аккаунта"
              title="Выйти из аккаунта"
            >
              <svg
                viewBox="0 0 24 24"
                width="25"
                height="25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
              </svg>
            </button>
          </form>
        )}

        <footer className="footer">NEON SOUND · Feel the music</footer>
      </section>

      {loading && (
        <div className="loading-overlay" role="status" aria-live="polite">
          <div className="loading-card">
            <div className="loading-spinner" />
            <h3>NEON SOUND</h3>
            <p>Пожалуйста, подождите...</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
