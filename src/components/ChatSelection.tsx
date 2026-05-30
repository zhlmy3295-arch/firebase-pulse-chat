import React, { useState } from 'react';
import { MessageSquare, User, LogOut, Users } from 'lucide-react';

interface ChatSelectionProps {
  username: string;
  phone: string;
  profilePic: string | null;
  onJoinGlobalChat: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
}

export function ChatSelection({ 
  username, 
  phone, 
  profilePic,
  onJoinGlobalChat, 
  onLogout,
  onOpenProfile 
}: ChatSelectionProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-3 hover:bg-slate-800/50 p-2 rounded-xl transition-colors"
            >
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
              )}
              <div className="text-right">
                <p className="font-bold text-white">{username}</p>
                <p className="text-xs text-slate-500">{phone}</p>
              </div>
            </button>
          </div>
          
          <button
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" dir="auto">مرحباً {username}</h1>
          <p className="text-slate-400" dir="auto">اختار الغرفة اللي عايز تدخلها</p>
        </div>

        {/* Chat Rooms */}
        <div className="space-y-3">
          {/* Global Chat Room */}
          <button
            onClick={onJoinGlobalChat}
            className="w-full p-4 bg-slate-900 border-slate-800 hover:border-indigo-500/50 rounded-2xl transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-bold text-white mb-1" dir="auto">شات روم العام</h3>
                <p className="text-sm text-slate-400" dir="auto">دردش مع الكل في نفس الوقت</p>
              </div>
              <div className="text-slate-500 group-hover:text-indigo-400 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
          </button>

          {/* Coming Soon */}
          <div className="w-full p-4 bg-slate-900/50 border-slate-800 rounded-2xl opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-slate-600" />
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-bold text-slate-500 mb-1" dir="auto">شات خاص</h3>
                <p className="text-sm text-slate-600" dir="auto">قريباً...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-8" dir="auto">
          جميع المحادثات محمية ومشفرة
        </p>
      </div>
    </div>
  );
                  }
