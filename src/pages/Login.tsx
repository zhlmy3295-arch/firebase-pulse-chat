import { useEffect } from "react";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "../lib/firebase";
import { MessageSquare, UserIcon, Phone, UserPlus } from "lucide-react";

// ضيف الـ imports دي لو مش موجودة عندك
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  // كود reCAPTCHA - الجديد
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => console.log("reCAPTCHA جاهز")
      });
    }
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    // حط هنا كود signInWithPhoneNumber بتاعك
    console.log("إرسال الكود");
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
          <h1
            className="text-3xl font-bold text-white text-center mb-2 tracking-tight"
            dir="auto"
          >
            Pulse Chat
          </h1>
          <p className="text-slate-400 text-center mb-8" dir="auto">
            {isSignUpMode ? "انشاء حساب جديد (Create Account)" : "تسجيل الدخول (Login)"}
          </p>

          <form onSubmit={handleJoin} className="space-y-4" dir="auto">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-300 mb-1.5 ltr:text-left rtl:text-right"
              >
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
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-300 mb-1.5 ltr:text-left rtl:text-right"
              >
                رقم الهاتف (Phone Number)
              </label>
             
