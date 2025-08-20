// src/components/UserName.jsx
import { useEffect, useState } from "react";
import { getUserId } from "../services/user.js";

const UserName = () => {
  const userId = Number(getUserId());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/user-main-data.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((u) => u.id === userId);
        setUser(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur fetch", err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>Chargement...</p>;
  if (!user) return <p>Utilisateur introuvable</p>;

  return <h1>Bonjour {user.userInfos.firstName} !</h1>;
};

export default UserName;

