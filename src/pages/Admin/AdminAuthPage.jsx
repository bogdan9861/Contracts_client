import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { enums } from "../../constants";
import { getCurrent, login } from "../../api/endpoints/auth";
import styles from "./Admin.module.css";

const AdminAuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(enums.TOKEN);
    if (token) {
      getCurrent()
        .then((res) => {
          if (res.data?.role === "ADMIN") {
            navigate("/admin");
          }
        })
        .catch(() => {
          localStorage.removeItem(enums.TOKEN);
        });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.data.role === "ADMIN") {
        localStorage.setItem(enums.TOKEN, res.data.token);
        navigate("/admin");
      } else {
        setError("У вас недостаточно прав для доступа к админ панели");
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        setError("Неверный email или пароль");
      } else {
        setError(err.response?.data?.message || "Ошибка при входе в систему");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-box"]}>
        <div className={styles["login-header"]}>
          <h2>Вход</h2>
          <p>Войдите в админ панель</p>
        </div>

        <form onSubmit={handleSubmit} className={styles["login-form"]}>
          <div className={styles["form-group"]}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="off"
              disabled={loading}
            />
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="password">Пароль</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <div className={styles["error-message"]}>{error}</div>}

          <button
            type="submit"
            className={styles["login-btn"]}
            disabled={loading}
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuthPage;
