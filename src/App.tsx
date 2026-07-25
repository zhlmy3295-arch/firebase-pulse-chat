import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  User as UserIcon,
  Phone,
  LogOut,
  MessageSquare,
  ArrowLeft,
  MessageCircle,
  Trash2,
  Plus,
  Users,
  Heart,
  UserCircle,
  Camera,
  X,
  Globe,
  Bell,
  UserPlus,
  Settings,
} from "lucide-react";
import { format } from "date-fns";
import {
  db,
  ref,
  push,
  onValue,
  serverTimestamp,
  query,
  orderByChild,
  remove,
  set,
  update,
  get,
} from "./lib/firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; // تسجيل الدخول
import { cn } from "./lib/utils";
import { GlobalChat } from "./components/GlobalChat";

interface ChatMessage {
  id: string;
  username: string;
  phone: string;
  targetPhone?: string;
  text: string;
  imageUrl?: string;
  timestamp: any;
  likes?: Record<string, boolean>;
  comments?: Record<string, { username: string; phone: string; text: string; timestamp: any }>;
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
  const [password, setPassword] = useState<string>(""); // جديد
  const [gender, setGender] = useState<string>("male");
  const [age, setAge] = useState<string>("");
  const [isJoined, setIsJoined] = useState(false);
  const [targetPhones, setTargetPhones] = useState<string[] | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const auth = getAuth();
  const getFakeEmail = (phone: string) => phone.trim() + "@app.com"

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
          if (data.username && data.username!== username) {
            setUsername(data.username);
            localStorage.setItem("chat_username", data.username);
          }
          if (data.gender && data.gender!== gender) {
            setGender(data.gender);
            localStorage.setItem("chat_gender", data.gender);
          }
          if (data.age && data.age!== age) {
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
    const email = getFakeEmail(phone.trim());

    if (isSignUpMode) {
      if (username.trim() && phone.trim() && age.trim() && password.trim()) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          localStorage.setItem("chat_username", username.trim());
          localStorage.setItem("chat_phone", phone.trim());
          localStorage.setItem("chat_gender", gender);
          localStorage.setItem("chat_age", age.trim());
          setIsJoined(true);
          const userRef = ref(db, `users/${phone.trim()}`);
          await update(userRef, { username: username.trim(), gender, age: age.trim() });
        } catch (e: any) {
          alert("خطأ في التسجيل: " + e.message)
        }
      }
    } else {
      if (username.trim() && phone.trim() && password.trim()) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          localStorage.setItem("chat_username", username.trim());
          localStorage.setItem("chat_phone", phone.trim());
          setIsJoined(true);
          const userRef = ref(db, `users/${phone.trim()}`);
          await update(userRef, { username: username.trim() });
        } catch (e: any) {
          alert("خطأ في تسجيل الدخول: تأكد من الرقم وكلمة السر")
        }
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
    setPassword("");
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
          <h1 className="text-3xl font-bold text-white text-center mb-2 tracking-tight" dir="auto">Pulse Chat</h1>
          <p className="text-slate-400 text-center mb-8" dir="auto">{isSignUpMode? "انشاء حساب جديد" : "تسجيل الدخول"}</p>

          <form onSubmit={handleJoin} className="space-y-4" dir="auto">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">الاسم</label>
              <input type="text" className="block w-full px-4 py-3 border border-slate-800 rounded-xl bg-slate-900/50 text-white" placeholder="مثال: علي" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">رقم الهاتف</label>
              <input type="tel" className="block w-full px-4 py-3 border border-slate-800 rounded-xl bg-slate-900/50 text-white" placeholder="+2010..." value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">كلمة السر</label>
              <input type="password" className="block w-full px-4 py-3 border-slate-800 rounded-xl bg-slate-900/50 text-white" placeholder="6 حروف على الاقل" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            {isSignUpMode && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">العمر</label>
                  <input type="number" className="block w-full px-4 py-3 border-slate-800 rounded-xl bg-slate-900/50 text-white" value={age} onChange={(e) => setAge(e.target.value)} required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">النوع</label>
                  <select className="block w-full px-4 py-3 border border-slate-800 rounded-xl bg-slate-900/50 text-white" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
              </div>
            )}
            <button type="submit" disabled={isSignUpMode? (!username.trim() ||!phone.trim() ||!age.trim() ||!password.trim()) : (!username.trim() ||!phone.trim() ||!password.trim())} className="w-full mt-4 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50">
              {isSignUpMode? "انشاء حساب" : "تسجيل دخول"}
            </button>
            <button type="button" onClick={() => setIsSignUpMode(!isSignUpMode)} className="w-full mt-2 py-2 text-sm text-slate-400 hover:text-white">
              {isSignUpMode? "العودة إلى تسجيل الدخول" : "ليس لديك حساب؟ انشاء حساب"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} username={username} phone={phone} gender={gender} age={age} profilePic={profilePic} onLeave={handleLeave} onSave={(newUsername, newPhone, newGender, newAge, newPic) => { if (newPhone!== phone) { setPhone(newPhone); localStorage.setItem("chat_phone", newPhone); setTargetPhones(null); } if (newUsername!== username) { setUsername(newUsername); localStorage.setItem("chat_username", newUsername); } if (newGender!== gender) { setGender(newGender); localStorage.setItem("chat_gender", newGender); } if (newAge!== age) { setAge(newAge); localStorage.setItem("chat_age", newAge); } setProfilePic(newPic); }} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      {!targetPhones || targetPhones.length === 0? (
        <ChatSelection username={username} phone={phone} profilePic={profilePic} onJoinChat={setTargetPhones} onLeave={handleLeave} onOpenProfile={() => setShowProfile(true)} onOpenSettings={() => setShowSettings(true)} />
      ) : targetPhones[0] === "GLOBAL_CHAT"? (
        <GlobalChat username={username} phone={phone} profilePic={profilePic} onBack={() => setTargetPhones(null)} onLeave={handleLeave} onOpenProfile={() => setShowProfile(true)} onOpenSettings={() => setShowSettings(true)} />
      ) : (
        <ChatRoom username={username} phone={phone} targetPhones={targetPhones} profilePic={profilePic} onBack={() => setTargetPhones(null)} onLeave={handleLeave} onOpenProfile={() => setShowProfile(true)} onOpenSettings={() => setShowSettings(true)} />
      )}
    </>
  );
}

function ChatSelection({ username, phone, profilePic, onJoinChat, onLeave, onOpenProfile, onOpenSettings }: any) {
  const [targetInputs, setTargetInputs] = useState<string[]>(() => { try { const stored = localStorage.getItem(`saved_numbers_${phone}`); if (stored) { return JSON.parse(stored); } return []; } catch { return []; } });
  const [currentInput, setCurrentInput] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  useEffect(() => { localStorage.setItem(`saved_numbers_${phone}`, JSON.stringify(targetInputs)); }, [targetInputs, phone]);
  const handleAddNumber = async (e: React.FormEvent) => { 
  e.preventDefault(); 
  setSearchError(null); 
  const trimmed = currentInput.trim(); 
  if (trimmed && !targetInputs.includes(trimmed)) { 
    try { 
      const userRef = ref(db, `users/${trimmed}`); 
      const snapshot = await get(userRef); 
      if (snapshot.exists()) { 
        setTargetInputs([...targetInputs, trimmed]); 
        setCurrentInput(""); 
      } else { 
        setSearchError("هذا الرقم غير مسجل في التطبيق."); 
      } 
    } catch (err) { // <-- كان ناقص القفلة دي
      console.error("Error fetching user:", err); 
      setSearchError("حدث خطأ أثناء البحث عن الرقم."); 
    } 
  } else if (targetInputs.includes(trimmed)) { 
    setSearchError("هذا الرقم مضاف بالفعل."); 
  } 
};
  const handleRemoveNumber = (num: string) => { setTargetInputs(targetInputs.filter((n) => n!== num)); };
  const handleSubmit = () => { if (targetInputs.length > 0) { onJoinChat(targetInputs); } };
  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      <header className="h-16 flex-shrink-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center px-6 justify-between z-10">
        <div className="flex items-center gap-3"><div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center"><MessageSquare className="w-4 h-4 text-white" /></div><h1 className="text-lg font-bold text-white">Pulse Posts</h1></div>
        <div className="flex items-center gap-4">
          <button onClick={onOpenProfile} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 rounded-lg">{profilePic? <img src={profilePic} alt="Profile" className="w-6 h-6 rounded-full object-cover" /> : <UserCircle className="w-6 h-6 text-slate-400" />}<span className="text-sm">{username}</span></button>
          <button onClick={onOpenSettings} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg"><Settings className="w-5 h-5" /></button>
          <button onClick={onLeave} className="flex items-center gap-2 p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg"><span>تسجيل خروج</span><LogOut className="w-5 h-5" /></button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
          {showSearch? (
            <div className="space-y-4" dir="auto">
              <div className="flex items-center gap-3 mb-6"><button type="button" onClick={() => setShowSearch(false)} className="p-2 -ml-2 text-slate-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button><h2 className="text-xl font-bold text-white">البحث عن حسابات</h2></div>
              <form onSubmit={handleAddNumber}><label className="block text-sm font-medium text-slate-300 mb-1.5">رقم صاحب المنشور</label>
                <div className="flex gap-2">
                  <input type="tel" className="block w-full px-4 py-3 border-slate-800 rounded-xl bg-slate-900/50 text-white" placeholder="+2010..." value={currentInput} onChange={(e) => { setCurrentInput(e.target.value); setSearchError(null); }} />
                  <button type="submit" disabled={!currentInput.trim()} className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50"><Plus className="w-5 h-5" /></button>
                </div>
                {searchError && <p className="mt-2 text-sm text-red-400">{searchError}</p>}
              </form>
              {targetInputs.length > 0 && (<div className="mt-4 space-y-2 max-h-40 overflow-y-auto">{targetInputs.map((num, idx) => (<div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl"><span>{num}</span><button onClick={() => handleRemoveNumber(num)} className="text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></div>))}</div>)}
              <button onClick={handleSubmit} disabled={targetInputs.length === 0} className="w-full mt-4 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50">عرض المنشورات</button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">منشورات وبوستات</h2>
              <p className="text-slate-400 text-center mb-8">اختر ما تريد القيام به</p>
              <div className="grid grid-cols-1 gap-4">
                <button onClick={() => onJoinChat(["GLOBAL_CHAT"])} className="p-4 bg-slate-800/50 hover:bg-slate-800 border-slate-700/50 rounded-xl">شات روم</button>
                <button onClick={() => onJoinChat(["ALL_POSTS"])} className="p-4 bg-slate-800/50 hover:bg-slate-800 border-slate-700/50 rounded-xl">آخر الأخبار</button>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => onJoinChat([phone])} className="p-4 bg-slate-800/50 hover:bg-slate-800 border-slate-700/50 rounded-xl">منشوراتي</button>
                  <button onClick={() => setShowSearch(true)} className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl">حسابات الآخرين</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ChatRoom({ username, phone, targetPhones, profilePic, onBack, onLeave, onOpenProfile, onOpenSettings }: any) {
  const [posts, setPosts] = useState<ChatMessage[]>([]);
  const [newPost, setNewPost] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const postsEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const seenPostIdsRef = useRef<Set<string>>(new Set());
  const seenCommentIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isMyPosts = targetPhones.length === 1 && targetPhones[0] === phone;
  const isFeed = targetPhones.length === 1 && targetPhones[0] === "ALL_POSTS";
  useEffect(() => {
    const postsRef = query(ref(db, "posts"), orderByChild("timestamp"));
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedPosts: ChatMessage[] = Object.keys(data).map((key) => {
          const post = data[key];
          let resolvedImageUrl = post.imageUrl;
          if (post.imageChunks) { resolvedImageUrl = Array.isArray(post.imageChunks)? post.imageChunks.join("") : Object.keys(post.imageChunks).sort((a, b) => Number(a) - Number(b)).map((k) => post.imageChunks[k]).join(""); }
          return { id: key,...post, imageUrl: resolvedImageUrl };
        });
        loadedPosts.sort((a, b) => b.timestamp - a.timestamp);
        let currentFeedPhones: string[] = []; if (isFeed) { try { const stored = localStorage.getItem(`saved_numbers_${phone}`); if (stored) currentFeedPhones = JSON.parse(stored); } catch {} }
        const filteredPosts = isFeed? loadedPosts.filter((post) => post.phone === phone || post.targetPhone === phone || currentFeedPhones.includes(post.phone || post.targetPhone || "")) : loadedPosts.filter((post) => targetPhones.includes(post.targetPhone || ""));
        setPosts(filteredPosts);
      } else { setPosts([]); }
      setError(null);
    }, (err: any) => { console.error("Firebase Read Error:", err); setError("لا تملك صلاحية للوصول. يرجى تحديث Security Rules"); });
    return () => unsubscribe();
  }, [targetPhones]);
  useEffect(() => { postsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [posts]);
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newPost.trim() &&!postImage) return; const messageText = newPost.trim(); const imageToSend = postImage; setNewPost(""); setPostImage(null);
    try {
      const postsRef = ref(db, "posts"); const newPostRef = push(postsRef);
      const postData: any = { username, phone, targetPhone: phone, text: messageText, timestamp: serverTimestamp() };
      if (imageToSend) { postData.imageUrl = imageToSend; }
      await set(newPostRef, postData); setError(null);
    } catch (err: any) { console.error("Firebase Write Error:", err); setNewPost(messageText); setPostImage(imageToSend); setError("فشل في الإرسال. تأكد من Security Rules."); }
  };
  const handlePostImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setPostImage(reader.result as string); }; reader.readAsDataURL(file); } };
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const handleDeletePost = async (postId: string) => { await remove(ref(db, `posts/${postId}`)); setDeleteConfirmId(null); };
  const handleLike = async (postId: string, currentLikes: Record<string, boolean> = {}) => { const postLikeRef = ref(db, `posts/${postId}/likes/${phone}`); if (currentLikes[phone]) { await remove(postLikeRef); } else { await set(postLikeRef, true); } };
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const handleAddComment = async (e: React.FormEvent, postId: string) => { e.preventDefault(); if (!commentText.trim()) return; const commentsRef = ref(db, `posts/${postId}/comments`); await push(commentsRef, { username, phone, text: commentText.trim(), timestamp: serverTimestamp() }); setCommentText(""); };
  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      <header className="h-16 flex-shrink-0 bg-slate-950/80 border-b border-slate-800 flex items-center px-6 justify-between z-10">
        <div className="flex items-center gap-3"><button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button><h1 className="text-lg font-bold text-white">{isFeed? "آخر الأخبار" : isMyPosts? "منشوراتي" : "منشورات الحسابات"}</h1></div>
        <div className="flex items-center gap-4">
          <button onClick={onOpenProfile} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg">{profilePic? <img src={profilePic} alt="Profile" className="w-6 h-6 rounded-full object-cover" /> : <UserCircle className="w-6 h-6 text-slate-400" />}<span className="text-sm">{username}</span></button>
          <button onClick={onOpenSettings} className="p-2 text-slate-500 hover:text-white"><Settings className="w-5 h-5" /></button>
          <button onClick={onLeave} className="flex items-center gap-2 p-2 text-slate-500 hover:text-red-400"><LogOut className="w-5 h-5" /></button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">{error}</div>}
        {posts.length === 0 &&!error? (<div className="h-full flex-col items-center justify-center text-slate-500"><MessageSquare className="w-12 h-12 opacity-20" /><p>{isMyPosts? "لا توجد منشورات" : "لا توجد منشورات"}</p></div>) : (
          posts.map((msg) => {
            const isMe = msg.username === username && msg.phone === phone;
            const timeString = msg.timestamp? format(new Date(msg.timestamp), "h:mm a") : "Sending...";
            return (
              <div key={msg.id} className="bg-slate-900 border-slate-800 rounded-2xl p-5 shadow-lg max-w-2xl mx-auto w-full mb-4" dir="auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-white", isMe? "bg-indigo-600" : "bg-purple-600")}>{msg.username.substring(0, 2).toUpperCase()}</div><div><div className="font-semibold text-slate-200">{msg.username}</div><div className="text-[11px] text-slate-500">{timeString}</div></div></div>
                  {isMe && <button onClick={() => setDeleteConfirmId(msg.id)} className="p-2 text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>}
                </div>
                <div className="flex flex-col gap-3 text-slate-200 mt-3">{msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}{msg.imageUrl && <img src={msg.imageUrl} alt="Post" className="w-full max-h-[500px] object-contain rounded-xl" />}</div>
                <div className="w-full h-px bg-slate-800/60 my-3"></div>
                <div className="flex items-center gap-6 text-slate-400">
                  <button onClick={() => handleLike(msg.id, msg.likes)} className={cn("flex items-center gap-2", msg.likes?.[phone]? "text-pink-500" : "")}><Heart className={cn("w-5 h-5", msg.likes?.[phone]? "fill-current" : "")} /><span>{Object.keys(msg.likes || {}).length || "إعجاب"}</span></button>
                  <button onClick={() => setActiveCommentPostId(activeCommentPostId === msg.id? null : msg.id)} className="flex items-center gap-2"><MessageCircle className="w-5 h-5" /><span>{Object.keys(msg.comments || {}).length || "تعليق"}</span></button>
                </div>
                {activeCommentPostId === msg.id && (
                  <div className="mt-4 bg-slate-950/50 rounded-xl border-slate-800/50 p-4">
                    <div className="space-y-3 max-h-60 overflow-y-auto">{Object.entries(msg.comments || {}).map(([cId, comment]: [string, any]) => (<div key={cId} className="flex gap-3"><div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">{comment.username.substring(0, 2).toUpperCase()}</div><div className="bg-slate-800/60 rounded-xl px-3 py-2 text-sm"><div className="font-semibold text-slate-200 text-xs">{comment.username}</div><div className="text-slate-300">{comment.text}</div></div></div>))}</div>
                    <form onSubmit={(e) => handleAddComment(e, msg.id)} className="flex gap-2 mt-3"><input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="اكتب تعليقاً..." className="flex-1 bg-slate-900 border-slate-700 rounded-full px-4 py-2 text-sm" /><button type="submit" disabled={!commentText.trim()} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white w-9 h-9 rounded-full flex items-center justify-center"><Send className="w-4 h-4" /></button></form>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={postsEndRef} />
      </main>
      {isMyPosts && (
        <footer className="flex-shrink-0 bg-slate-950 border-t border-slate-800 p-6">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4 bg-slate-900/50 border border-slate-800 rounded-2xl p-2">
            {postImage && <img src={postImage} alt="preview" className="h-20 rounded-lg" />}
            <input type="text" className="flex-1 bg-transparent border-none text-slate-200 placeholder-slate-600 py-3 px-4 focus:outline-none" placeholder="اضف منشور..." value={newPost} onChange={(e) => setNewPost(e.target.value)} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-indigo-400"><Camera className="w-5 h-5" /></button>
            <input type="file" ref={fileInputRef} onChange={handlePostImageUpload} accept="image/*" className="hidden" />
            <button type="submit" disabled={!newPost.trim() &&!postImage} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl font-semibold disabled:opacity-50">نشر</button>
          </form>
        </footer>
      )}
    </div>
  );
}

function SettingsModal({ isOpen, onClose }: any) { if (!isOpen) return null; return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div className="bg-slate-900 border-slate-800 rounded-2xl w-full max-w-md"><div className="flex items-center justify-between p-4 border-b border-slate-800"><h2 className="text-xl font-bold text-white">الإعدادات</h2><button onClick={onClose}><X className="w-5 h-5" /></button></div><div className="p-6">الاعدادات هنا</div></div></div>); }
function ProfileModal({ isOpen, onClose, username, phone, gender, age, profilePic, onSave, onLeave }: any) {
  const [editName, setEditName] = useState(username); const [editPhone, setEditPhone] = useState(phone); const [editGender, setEditGender] = useState(gender || "male"); const [editAge, setEditAge] = useState(age || ""); const [editPic, setEditPic] = useState<string | null>(profilePic); const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (isOpen) { setEditName(username); setEditPhone(phone); setEditGender(gender || "male"); setEditAge(age || ""); setEditPic(profilePic); } }, [isOpen, username, phone, gender, age, profilePic]);
  if (!isOpen) return null;
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); const userRef = ref(db, `users/${editPhone.trim()}`); await update(userRef, { username: editName.trim(), gender: editGender, age: editAge.trim(), profilePicture: editPic }); onSave(editName.trim(), editPhone.trim(), editGender, editAge.trim(), editPic); onClose(); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-slate-900 border-slate-800 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-slate-800"><h2 className="text-xl font-bold text-white">الملف الشخصي</h2><button onClick={onClose}><X className="w-5 h-5" /></button></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-3 border-slate-700 rounded-xl bg-slate-800 text-white" required />
          <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full px-4 py-3 border-slate-700 rounded-xl bg-slate-800 text-white" required />
          <div className="flex gap-4"><input type="number" value={editAge} onChange={(e) => setEditAge(e.target.value)} className="w-full px-4 py-3 border-slate-700 rounded-xl bg-slate-800 text-white" required /><select value={editGender} onChange={(e) => setEditGender(e.target.value)} className="w-full px-4 py-3 border-slate-700 rounded-xl bg-slate-800 text-white"><option value="male">ذكر</option><option value="female">أنثى</option></select></div>
          <button type="submit" className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500">حفظ التغييرات</button>
        </form>
      </div>
    </div>
  );
  }
