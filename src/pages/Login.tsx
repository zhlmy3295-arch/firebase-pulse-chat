import { useEffect, useRef, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../lib/firebase";
import { MessageSquare, UserIcon, Phone, UserPlus } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [step, setStep] = useState("form");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);
  
  const recaptchaRef = useRef<HTMLDivElement>(null);

  // كود reCAPTCHA - متظبط ومش هيعمل فريز
  useEffect(() => {
    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
    }
    
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaRef.current!, {
      size: 'invisible',
      callback: () => console.log("reCAPTCHA جاهز")
    });
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const verifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, "+2" + phone, verifier);
      setConfirmation(result);
      setStep("code");
    } catch (error: any) {
      alert("خطأ: " + error.message);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmation.confirm(code);
      setIsJoined(true);
    } catch (error: any) {
      alert("الكود غلط: " + error.message);
    }
  };

  if (isJoined) {
    return <div>مرحباً {username} - دخلت خلاص ✅</div>
  }

  if (step === "code") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form onSubmit={handleVerify} className="w-full max-w-md bg-slate-900 p-8 rounded-2xl">
          <h1 className="text-2xl font-bold text-white text-center mb-4">اكتب الكود</h1>
          <input 
            type="text" 
            value={code} 
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-800 text-white mb-4"
            placeholder="الكود اللي جالك SMS"
          />
          <button type="submit" className="w-full bg-indigo-500 text-white py-3 rounded-xl">تأكيد</button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-200">
      <div className="w-full max-w-md bg-slate-900 border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center shadow-inner">
            <MessageSquare className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white text-center mb-2">Pulse Chat</h1>
        <p className="text-slate-400 text-center mb-8">
          {isSignUpMode ? "انشاء حساب جديد" : "تسجيل الدخول"}
        </p>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">الاسم</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border-slate-800 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="مثال: علي"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">رقم الهاتف</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="tel"
                className="block w-full pl-10 pr-3 py-3 border-slate-800 rounded-xl bg-slate-900/50 text-white placeholder-slate-500"
                placeholder="01103084644"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-medium">
            {isSignUpMode ? "إنشاء حساب" : "تسجيل دخول"}
          </button>
        </form>

        {/* ده أهم سطر - هنا reCAPTCHA بيتحط */}
        <div ref={recaptchaRef}></div>
      </div>
    </div>
  );
      }
