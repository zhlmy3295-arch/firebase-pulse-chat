import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, UserCircle, Trash2, LogOut } from "lucide-react";
import { db, ref, update } from "../lib/firebase";

function ProfileModal({
  isOpen,
  onClose,
  username,
  phone,
  gender,
  age,
  profilePic,
  onSave,
  onLeave,
}: any) {
  const [editName, setEditName] = useState(username);
  const [editPhone, setEditPhone] = useState(phone);
  const [editGender, setEditGender] = useState(gender || "male");
  const [editAge, setEditAge] = useState(age || "");
  const [editPic, setEditPic] = useState<string | null>(profilePic);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setEditName(username);
      setEditPhone(phone);
      setEditGender(gender || "male");
      setEditAge(age || "");
      setEditPic(profilePic);
    }
  }, [isOpen, username, phone, gender, age, profilePic]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() ||!editPhone.trim() ||!editAge.trim()) return;

    const userRef = ref(db, `users/${editPhone.trim()}`);
    await update(userRef, {
      username: editName.trim(),
      gender: editGender,
      age: editAge.trim(),
      profilePicture: editPic,
    });

    onSave(editName.trim(), editPhone.trim(), editGender, editAge.trim(), editPic);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" dir="auto">
        <div className="flex items-center justify-between p-4 border-b-slate-800">
          <h2 className="text-xl font-bold text-white">الملف الشخصي</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-indigo-500 overflow-hidden flex items-center justify-center">
                {editPic? (
                  <img src={editPic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-16 h-16 text-slate-500" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </div>
            {editPic && (
              <button type="button" onClick={() => setEditPic(null)} className="text-xs text-red-400">
                <Trash2 className="w-3 h-3 inline" /> حذف الصورة
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">الاسم</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} maxLength={24} className="w-full px-4 py-3 border-slate-700 rounded-xl bg-slate-800 text-white" required />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">رقم الهاتف</label>
              <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full px-4 py-3 border-slate-700 rounded-xl bg-slate-800 text-white" required />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-slate-300 mb-1.5">العمر</label>
                <input type="number" value={editAge} onChange={(e) => setEditAge(e.target.value)} min="1" max="120" className="w-full px-4 py-3 border-slate-700 rounded-xl bg-slate-800 text-white" required />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-slate-300 mb-1.5">النوع</label>
                <select value={editGender} onChange={(e) => setEditGender(e.target.value)} className="w-full px-4 py-3 border-slate-700 rounded-xl bg-slate-800 text-white">
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500">حفظ</button>
            <button type="button" onClick={() => { onClose(); if (onLeave) onLeave(); }} className="py-3 px-4 rounded-xl text-red-500 bg-red-500/10">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { ProfileModal };
