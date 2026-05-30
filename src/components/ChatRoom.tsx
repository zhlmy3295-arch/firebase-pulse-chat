import React, { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, Image as ImageIcon, X, UserCircle } from "lucide-react";
import { format } from "date-fns";
import { db, ref, push, onValue, serverTimestamp, query, orderByChild } from "../lib/firebase";
import { cn } from "../lib/utils";

interface ChatMessage {
  id: string;
  username: string;
  phone: string;
  text: string;
  imageUrl?: string;
  timestamp: any;
}

export function ChatRoom({ username, phone, profilePic, onBack, onLeave, onOpenProfile }: any) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(ref(db, "messages"), orderByChild("timestamp"));
    const unsub = onValue(q, (snapshot) => {
      const data = snapshot.val();
      setMessages(data? Object.entries(data).map(([id, val]: any) => ({ id,...val })) : []);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() &&!imagePreview) return;
    await push(ref(db, "messages"), {
      username, phone, text: newMessage.trim(), imageUrl: imagePreview, timestamp: serverTimestamp()
    });
    setNewMessage("");
    setImagePreview(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size < 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex-col" dir="auto">
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <button onClick={onBack} className="p-2"><ArrowLeft className="w-5 h-5" /></button>
        <h2 className="font-bold text-white">الشات العام</h2>
        <button onClick={onOpenProfile} className="p-2">
          {profilePic? <img src={profilePic} className="w-8 h-8 rounded-full" /> : <UserCircle className="w-6 h-6" />}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.phone === phone? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[70%] p-3 rounded-2xl", msg.phone === phone? "bg-indigo-600 text-white" : "bg-slate-800")}>
              <p className="text-xs opacity-70 mb-1">{msg.username}</p>
              {msg.imageUrl && <img src={msg.imageUrl} className="rounded-lg mb-2 max-w-full" />}
              <p>{msg.text}</p>
              <p className="text-xs opacity-50 mt-1">{format(new Date(msg.timestamp), "HH:mm")}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {imagePreview && (
        <div className="p-2 bg-slate-900 border-t border-slate-800 relative">
          <img src={imagePreview} className="h-20 rounded" />
          <button onClick={() => setImagePreview(null)} className="absolute top-0 right-0 bg-red-500 rounded-full p-1"><X className="w-4 h-4" /></button>
        </div>
      )}

      <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-slate-800 rounded-xl">
          <ImageIcon className="w-5 h-5" />
        </button>
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="اكتب رسالة..." className="flex-1 px-4 py-3 bg-slate-800 rounded-xl text-white focus:outline-none" />
        <button type="submit" className="p-3 bg-indigo-600 rounded-xl"><Send className="w-5 h-5" /></button>
      </form>
    </div>
  );
        }
