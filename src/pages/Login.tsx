import { useState } from "react";

export default function Login() {
  const [name, setName] = useState("");
  const [logged, setLogged] = useState(!!localStorage.getItem("pulse_user"));

  const login = () => {
    if(name.trim().length > 2) {
      localStorage.setItem("pulse_user", name);
      setLogged(true);
    } else {
      alert("اكتب اسم 3 حروف على الأقل");
    }
  }

  const logout = () => {
    localStorage.removeItem("pulse_user");
    window.location.reload();
  }

  if(logged) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl text-white mb-6">أهلاً {localStorage.getItem("pulse_user")} 👋</h1>
          <p className="text-slate-400 mb-8">كده انت دخلت الشات خلاص</p>
          <button 
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl text-lg"
          >
            تسجيل خروج
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 p-8 rounded-2xl">
        <h1 className="text-3xl text-white text-center mb-6">Pulse Chat</h1>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="اكتب أي اسم"
          className="w-full p-4 bg-slate-800 text-white rounded-xl mb-4 outline-none"
        />
        <button 
          onClick={login}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg"
        >
          ادخل الشات
        </button>
      </div>
    </div>
  );
}
