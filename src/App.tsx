import React, { useState, useEffect, useRef } from "react";
import {
  Send, User as UserIcon, Phone, LogOut, MessageSquare, ArrowLeft,
  MessageCircle, Search, Trash2, Plus, Users, Heart, UserCircle,
  Camera, X, Globe, Bell, UserPlus,
} from "lucide-react";
import { format } from "date-fns";
import {
  db, ref, push, onValue, serverTimestamp, query,
  orderByChild, remove, set, update, get,
} from "./lib/firebase";
import { cn } from "./lib/utils";

interface ChatMessage {
  id: string;
  username: string;
  phone: string;
  targetPhone?: string;
  text: string;
  imageUrl?: string;
  timestamp: any;
  likes?: Record<string, boolean>;
  comments?: Record<
    string,
    { username: string; phone: string; text: string; timestamp: any }
  >;
}

const playTickSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.error("Audio playback error:", e);
  }
};

export default function App() {
  const [username, setUsername] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [gender, setGender] = useState<string>("male");
  const [age, setAge] = useState<string>("");
  const [isJoined, setIsJoined] = useState(false);
  const [targetPhones, setTargetPhones] = useState<string[] | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

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
      const userRef = ref(db, `users/${phone}`);
      const unsub = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.profilePicture) setProfilePic(data.profilePicture);
          if (data.username && data.username !== username) {
            setUsername(data.username);
            localStorage.setItem("chat_username", data.username);
          }
          if (data.gender && data.gender !== gender) {
            setGender(data.gender);
            localStorage.setItem("chat_gender", data.gender);
          }
          if (data.age && data.age !== age) {
            setAge(data.age);
            localStorage.setItem("chat_age", data.age);
          }
        }
      });
      return () => unsub();
    }
  }, [phone, isJoined, username, gender, age]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUpMode) {
      if (username.trim() && phone.trim() && age.trim()) {
        localStorage.setItem("chat_username", username.trim());
        localStorage.setItem("chat_phone", phone.trim());
        localStorage.setItem("chat_gender", gender);
        localStorage.setItem("chat_age", age.trim());
        setIsJoined(true);
        const userRef = ref(db, `users/${phone.trim()}`);
        await update(userRef, {
          username: username.trim(),
          gender,
          age: age.trim()
        });
      }
    } else {
      if (username.trim() && phone.trim()) {
        localStorage.setItem("chat_username", username.trim());
        localStorage.setItem("chat_phone", phone.trim());
        setIsJoined(true);
        const userRef = ref(db, `users/${phone.trim()}`);
        await update(userRef, {
          username: username.trim()
        });
      }
    }
  };

  const handleLeave = () => {
    localStorage.removeItem("chat_username");
    localStorage.removeItem("chat_phone");
    localStorage.removeItem("chat_gender");
    localStorage.removeItem("chat_age");
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
          <h1 className="text-3xl font-bold text-white text-center mb-2 tracking-tight" dir="auto">
            Pulse Chat
          </h1>
          <p className="text-slate-400 text-center mb-8" dir="auto">
            {isSignUpMode ? "انشاء حساب جديد (Create Account)" : "تسجيل الدخول (Login)"}
          </p>
          <form onSubmit={handleJoin} className="space-y-4" dir="auto">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1.5 ltr:text-left rtl:text-right">
                الاسم (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  id="username"
                  className="block w-full pl-10 pr-3 py-3 border-slate-800 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
                  placeholder="مثال: علي"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  maxLength={24}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1.5 ltr:text-left rtl:text-right">
                رقم الهاتف (Phone Number)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  className="block w-full pl-10 pr-3 py-3 border-slate-800 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all transition-all shadow-inner"
                  placeholder="مثال: +966 5..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            {isSignUpMode && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="age" className="block text-sm font-medium text-slate-300 mb-1.5 ltr:text-left rtl:text-right">
                    العمر (Age)
                  </label>
                  <input
                    type="number"
                    id="age"
                    className="block w-full px-4 py-3 border-slate-800 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
                    placeholder="مثال: 25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="1"
                    max="120"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="gender" className="block text-sm font-medium text-slate-300 mb-1.5 ltr:text-left rtl:text-right">
                    النوع (Gender)
                  </label>
                  <select
                    id="gender"
                    className="block w-full px-4 py-3 border-slate-800 rounded-xl bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner appearance-none"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="male">ذكر (Male)</option>
                    <option value="female">أنثى (Female)</option>
                  </select>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={isSignUpMode ? (!username.trim() || !phone.trim() || !age.trim()) : (!username.trim() || !phone.trim())}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/20 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isSignUpMode ? (
                <>
                  <UserPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                  <span>انشاء حساب</span>
                </>
              ) : (
                <span>تسجيل دخول</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsSignUpMode(!isSignUpMode)}
              className="w-full mt-2 py-2 text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              {!isSignUpMode && <UserPlus className="w-4 h-4" />}
              {isSignUpMode ? "العودة إلى تسجيل الدخول" : "ليس لديك حساب؟ انشاء حساب"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-slate-800 rounded-2xl p-8 text-center">
        <MessageSquare className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">مرحباً {username}</h2>
        <p className="text-slate-400 mb-6">كده الموقع اشتغل بدون ProfileModal</p>
        <button
          onClick={handleLeave}
          className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-white font-semibold"
        >
          <LogOut className="w-4 h-4 inline ltr:mr-2 rtl:ml-2" />
          تسجيل خروج
        </button>
      </div>
    </div>
  );
                            }
