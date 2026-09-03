import React, { useState } from 'react';

const App2 = () => {
  const [showDownload, setShowDownload] = useState(false);

  // رابط التحميل المباشر بتاعك
  const apkLink = "https://drive.google.com/uc?export=download&id=1i1rBWbByhcCHj0bKVk3O65HCIdbELHEX";

  const handleDownload = () => {
    window.open(apkLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        
        {/* الهيدر */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">تحميل التطبيق</h1>
          <p className="text-gray-600">احصل على اخر اصدار من التطبيق</p>
        </div>

        {/* الكارت */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center">
            
            {/* ايقونة */}
            <div className="w-24 h-24 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold mb-2">تطبيق الاندرويد</h2>
            <p className="text-gray-500 text-center mb-6">حجم الملف: ~25MB</p>

            {/* زرار التحميل */}
            <button 
              onClick={handleDownload}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition duration-200 shadow-md hover:shadow-lg"
            >
              تحميل APK
            </button>

            <p className="text-xs text-gray-400 mt-4 text-center">
              * لازم تفعل "التثبيت من مصادر غير معروفة" من الاعدادات
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App2;
