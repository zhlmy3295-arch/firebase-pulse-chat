import { useState } from 'react'
import './App.css'

export default function App() {
  // غير الرابط ده برابط الـ APK بتاعك
  const apkLink = "https://drive.google.com/uc?export=download&id=PUT_YOUR_FILE_ID_HERE";

  return (
    <div>
      
      {/* ===== جزء التحميل الجديد ===== */}
      <div style={{
        textAlign: 'center', 
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: 'white',
      }}>
        <div style={{fontSize: '50px'}}>💬</div>
        <h1 style={{fontSize: '36px', margin: '10px 0'}}>Pulse Chat</h1>
        <p style={{fontSize: '18px', marginBottom: '25px'}}>حمل التطبيق على موبايلك</p>
        
        <a href={apkLink} 
           style={{
             background: 'white', 
             padding: '15px 35px', 
             color: '#6366f1', 
             borderRadius: '12px', 
             textDecoration: 'none',
             fontSize: '18px',
             fontWeight: 'bold',
             display: 'inline-block',
             boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
           }}>
          📥 تحميل للاندرويد APK
        </a>
      </div>

      {/* ===== الكود القديم بتاع التطبيق بتاعك هيجي هنا ===== */}
      {/* سيب الكود القديم بتاعك كله زي ما هو تحت ده */}
      {/* مثال: */}
      <div className="App">
        <h2>مرحبا في Pulse Chat</h2>
        {/* حط هنا كل حاجة كانت في الملف القديم */}
      </div>

    </div>
  )
      }
