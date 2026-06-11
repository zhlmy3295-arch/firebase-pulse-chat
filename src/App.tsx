import React, { useState, useEffect } from "react";
import { User as UserIcon, Phone, LogOut, MessageSquare, UserPlus } from "lucide-react";
import { db, ref, update, onValue, get } from "./lib/firebase"; // ضيف get
import { ChatSelection } from "./components/ChatSelection";
import { ChatRoom } from "./components/ChatRoom";
import { ProfileModal } from "./components/ProfileModal";

type TargetPhones = string[];

const cleanPhoneNumber = (num: string) => num.replace(/\D/g, "");

export default function App() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [targetPhones, setTargetPhones] = useState<TargetPhones | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("chat_username");
    const savedPhone = localStorage.getItem("chat_phone");
    const savedGender = localStorage.getItem("chat_gender");
    const savedAge = localStorage.getItem("chat_age");
    if (saved && savedPhone) {
      setUsername(saved);
      setPhone(savedPhone);
      if (savedGender) setGender(savedGender);
      if (savedAge) setAge(savedAge);
      setIsJoined(true);
    }
  }, []);

  useEffect(() => {
    if (phone && isJoined) {
      const cleanPhone = cleanPhoneNumber(phone);
      const userRef = ref(db, `users/${cleanPhone}`);
      const unsub = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setProfilePic(data.profilePicture || null);
          if (data.username && data.username !== username) {
            setUsername(data.username);
            localStorage.setItem("chat_username", data.username);
          }
          if (data.gender) setGender(data.gender);
          if (data.age) setAge(data.age);
        }
      });
      return () => unsub();
    }
  }, [phone, isJoined]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const cleanPhone = cleanPhoneNumber(phone);
    
    try {
      if (isSignUpMode) {
        if (username.trim() && cleanPhone && age.trim()) {
          const userRef = ref(db, `users/${cleanPhone}`);
          const snap = await get(userRef);
          if (snap.exists()) {
            alert("الرقم ده متسجل قبل كده. سجل دخول بدل انشاء حساب");
            setIsSignUpMode(false);
            setLoading(false);
            return;
          }
          
          await update(userRef, {
            username: username.trim(),
            gender,
            age: age.trim(),
            createdAt: Date.now()
          });

          localStorage.setItem("chat_username", username.trim());
          localStorage.setItem("chat_phone", phone.trim());
          localStorage.setItem("chat_gender", gender);
          localStorage.setItem("chat_age", age.trim());
          setPhone(phone.trim());
          setIsJoined(true);
        }
      } else {
        if (username.trim() && cleanPhone) {
          const userRef = ref(db, `users/${cleanPhone}`);
          const snap = await get(userRef);
          
          if (!snap.exists()) {
            alert("الرقم ده مش متسجل. اعمل انشاء حساب الأول");
            setLoading(false);
            return;
          }
          
          const data = snap.val();
          setUsername(data.username);
          
          localStorage.setItem("chat_username", data.username);
          localStorage.setItem("chat_phone", phone.trim());
          localStorage.setItem("chat_gender", data.gender || "male");
          localStorage.setItem("chat_age", data.age || "");
          setPhone(phone.trim());
          setIsJoined(true);
        }
      }
    } catch (err) {
      console.error(err);
      alert("حصل خطأ. اتأكد من النت");
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = () => {
    localStorage.clear();
    setUsername("");
    setPhone("");
    setGender("male");
    setAge("");
    setIsJoined(false);
    setTargetPhones(null);
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-200">
        <div className="w-full max-w-md bg-slate-900 border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center shadow-inner">
              <MessageSquare className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white text-center mb-2">Pulse Chat</h1>
          <p className="text-slate-400 text-center mb-8">{isSignUpMode ? "انشاء حساب جديد" : "تسجيل الدخول"}</p>

          <form onSubmit={handleJoin} className="space-y-4" dir="rtl">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">الاسم</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-800 rounded-xl bg-slate-900/50 text-white focus:ring-2 focus:ring-indigo-500"
                  placeholder="مثال: علي"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={24}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">رقم الهاتف</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type="tel"
                  className="block w-full pl-10 pr-3 py-3 border-slate-800 rounded-xl bg-slate-900/50 text-white"
                  placeholder="+20 10..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {isSignUpMode && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">العمر</label>
                  <input type="number" className="w-full px-4 py-3 border-slate-800 rounded-xl bg-slate-900/50 text-white" value={age} onChange={(e) => setAge(e.target.value)} min="10" max="100" required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">النوع</label>
                  <select className="w-full px-4 py-3 border-slate-800 rounded-xl bg-slate-900/50 text-white" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full mt-4 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50">
              {loading ? "جاري..." : isSignUpMode ? "انشاء حساب" : "تسجيل دخول"}
            </button>
            
            <button type="button" onClick={() => setIsSignUpMode(!isSignUpMode)} className="w-full mt-2 py-2 text-sm text-slate-400 hover:text-white flex items-center justify-center gap-2">
              {!isSignUpMode && <UserPlus className="w-4 h-4" />}
              {isSignUpMode ? "العودة لتسجيل الدخول" : "ليس لديك حساب؟ انشاء حساب"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        username={username}
        phone={phone}
        gender={gender}
        age={age}
        profilePic={profilePic}
        onLeave={handleLeave}
        onSave={(newUsername, newPhone, newGender, newAge, newPic) => {
          const cleanNewPhone = cleanPhoneNumber(newPhone);
          const cleanOldPhone = cleanPhoneNumber(phone);
          
          if (cleanNewPhone !== cleanOldPhone) {
            // نقل الداتا للرقم الجديد
            const oldRef = ref(db, `users/${cleanOldPhone}`);
            const newRef = ref(db, `users/${cleanNewPhone}`);
            update(newRef, { username: newUsername, gender: newGender, age: newAge, profilePicture: newPic });
            update(oldRef, null); // حذف القديم
            setPhone(newPhone);
            localStorage.setItem("chat_phone", newPhone);
            setTargetPhones(null);
          } else {
            update(ref(db, `users/${cleanPhoneNumber(phone)}`), { username: newUsername, gender: newGender, age: newAge, profilePicture: newPic });
          }
          
          setUsername(newUsername);
          setGender(newGender);
          setAge(newAge);
          setProfilePic(newPic);
          localStorage.setItem("chat_username", newUsername);
          localStorage.setItem("chat_gender", newGender);
          localStorage.setItem("chat_age", newAge);
        }}
      />
      
      {!targetPhones || targetPhones.length === 0 ? (
        <ChatSelection
          username={username}
          phone={phone}
          profilePic={profilePic}
          onJoinChat={setTargetPhones}
          onLeave={handleLeave}
          onOpenProfile={() => setShowProfile(true)}
        />
      ) : (
        <ChatRoom
          username={username}
          phone={phone}
          profilePic={profilePic}
          targetPhones={targetPhones} // ضيفته هنا
          onBack={() => setTargetPhones(null)}
          onLeave={handleLeave}
          onOpenProfile={() => setShowProfile(true)}
        />
      )}
    </>
  );
}
