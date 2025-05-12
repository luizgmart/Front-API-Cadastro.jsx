import { useEffect, useState, useRef } from "react";
import "./style.css";
import Trash from "../../assets/trash.svg";
import api from "../../services/api";

function Home() {
  const [users, setUsers] = useState([]);

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  // Buscar usuários ao carregar
  async function getUsers() {
    const usersFromApi = await api.get("/usuarios");
    setUsers(usersFromApi.data);
  }

  useEffect(() => {
    getUsers();
  }, []);

  // Cadastrar novo usuário
  async function handleAddUser() {
    const name = inputName.current.value;
    const age = inputAge.current.value;
    const email = inputEmail.current.value;

    if (!name || !age || !email) {
      alert("Preencha todos os campos.");
      return;
    }

    const newUser = {
      name,
      age: Number(age),
      email,
    };

    try {
      const response = await api.post("/usuarios", newUser);
      setUsers((prevUsers) => [...prevUsers, response.data]);

      // Limpar inputs
      inputName.current.value = "";
      inputAge.current.value = "";
      inputEmail.current.value = "";
    } catch (error) {
      alert("Erro ao cadastrar usuário.");
      console.error(error);
    }
  }

  // Deletar usuário
  async function handleDeleteUser(id) {
    try {
      await api.delete(`/usuarios/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      alert("Erro ao deletar usuário.");
      console.error(error);
    }
  }

  return (
    <div className="container">
      <form>
        <h1>Cadastro de Usuários</h1>
        <input placeholder="Nome" name="nome" type="text" ref={inputName} />
        <input placeholder="Idade" name="idade" type="number" ref={inputAge} />
        <input placeholder="Email" name="email" type="email" ref={inputEmail} />
        <button type="button" onClick={handleAddUser}>
          Cadastrar
        </button>
      </form>

      {users.map((user) => (
        <div key={user.id} className="card">
          <div>
            <p>
              Nome: <span>{user.name}</span>
            </p>
            <p>
              Idade: <span>{user.age}</span>
            </p>
            <p>
              Email: <span>{user.email}</span>
            </p>
          </div>
          <button onClick={() => handleDeleteUser(user.id)}>
            <img src={Trash} width="25" height="25" alt="Deletar" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;
