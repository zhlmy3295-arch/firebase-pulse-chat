import { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"

export default function Login() {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const auth = getAuth()

  // الخدعة: نحول الرقم لايميل
  const getFakeEmail = (phone: string) => phone.trim() + "@app.com"

  const register = async () => {
    const email = getFakeEmail(phone)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      alert("تم التسجيل")
    } catch (e: any) {
      alert("خطأ: " + e.message)
    }
  }

  const login = async () => {
    const email = getFakeEmail(phone)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      alert("دخلت")
    } catch (e: any) {
      alert("خطأ")
    }
  }

  return (
    <div style={{padding: 20, display: 'flex', flexDirection: 'column', gap: 10}}>
      <h2>تسجيل الدخول</h2>
      <input 
        placeholder="+2010..." 
        value={phone} 
        onChange={e => setPhone(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="كلمة السر" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
      />
      <button onClick={login}>دخول</button>
      <button onClick={register}>انشاء حساب</button>
    </div>
  )
  }
