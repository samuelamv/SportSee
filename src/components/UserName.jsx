// src/components/UserName.jsx
import { useEffect, useState } from "react";
import { getUserMainData } from "../services/apis.js";
import FullScreenError from "./FullScreenError";
import '../styles/UserName.scss'


const UserName = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUserMainData()
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur getUserMainData", err);
        setError(err.message || String(err));
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <FullScreenError message={error} />;
  if (!user) return <p>Utilisateur introuvable</p>;

  return (
    <h1>
      Bonjour <span className="user-firstname">{user.userInfos.firstName}</span>
    </h1>
  );
};

export default UserName;
