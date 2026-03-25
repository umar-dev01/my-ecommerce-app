import { createContext, useState, useContext } from "react";
export const UserContext = createContext();
export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: "Umar",
    isLoggedIn: true,
    role: "developer",
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
function UserProfile() {
  const { user } = useContext(UserContext);
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-bold text-purple-800  ">User profile</h2>
      <p className="text-gray-700">
        Name : <span className="font-bold">{user.name}</span>
      </p>
      <p className="text-gray-700">
        Role : <span className="font-bold">{user.role}</span>
      </p>
      <p className="text-gray-700">
        Status:{" "}
        <span
          className={`font-bold ${user.isLoggedIn ? "text-green-600" : "text-red-600"}`}
        >
          {user.isLoggedIn ? "Online ✅" : "Offline ❌"}
        </span>
      </p>
    </div>
  );
}
function UserGreeting() {
  const { user, setUser } = useContext(UserContext);
  function handleLogout() {
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
  }
  function handleLogin() {
    setUser((prev) => ({ ...prev, isLoggedIn: true }));
  }
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className=" text-xl font-bold text-pink-600">Hello,{user.name}!</h2>
      <p className="text-gray-600"> you are a {user.role}</p>
      {user.isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Login
        </button>
      )}
    </div>
  );
}

export default function UseContextExample() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3x1 font-bold text-center text-purple-800 mb-8">
          useContext Example
        </h1>
        <UserProfile />
        <UserGreeting />
      </div>
    </UserProvider>
  );
}
