
import React from 'react';

const PublishGuide: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="bg-emerald-600 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2">Método Fácil: PWABuilder</h2>
          <p className="text-emerald-100 text-sm leading-relaxed opacity-90">
            Convierte esta web en una App de Android (.aab) en 3 pasos sin tocar una sola línea de código.
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M17.523 15.341l-1.5-1.5a.75.75 0 10-1.06 1.06l1.5 1.5a.75.75 0 001.06-1.06zM13.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" clipRule="evenodd"/></svg>
        </div>
      </div>

      <div className="space-y-4">
        {/* PASO 1 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black">1</div>
            <div>
              <h3 className="font-bold text-slate-800">Sube tu App a la Web</h3>
              <p className="text-[11px] text-slate-400 font-medium">NECESITAS UN LINK PÚBLICO</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Primero, tu app debe estar en internet. Usa servicios gratuitos como <b>Netlify</b>, <b>Vercel</b> o <b>GitHub Pages</b>. Solo arrastra tu carpeta "dist" y obtendrás un link (ej: <i>mi-app.netlify.app</i>).
          </p>
        </div>

        {/* PASO 2 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black">2</div>
            <div>
              <h3 className="font-bold text-slate-800">Entra en PWABuilder</h3>
              <p className="text-[11px] text-indigo-400 font-medium">GENERACIÓN AUTOMÁTICA</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Ve a <a href="https://www.pwabuilder.com" target="_blank" className="text-indigo-600 font-bold underline">pwabuilder.com</a>, pega el link de tu app y dale a <b>"Start"</b>.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-[11px] text-slate-500">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                Pulsa en <b>"Package for Stores"</b>
            </li>
            <li className="flex items-center gap-2 text-[11px] text-slate-500">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                Selecciona <b>"Android"</b> y luego <b>"Generate"</b>
            </li>
          </ul>
        </div>

        {/* PASO 3 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-black">3</div>
            <div>
              <h3 className="font-bold text-slate-800">Descarga y Sube</h3>
              <p className="text-[11px] text-amber-500 font-medium">GOOGLE PLAY CONSOLE</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            PWABuilder te dará un archivo llamado <b>.aab</b> (Android App Bundle). Ese es el archivo que debes subir a tu cuenta de desarrollador de Google Play. ¡Y listo!
          </p>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-[2.5rem] text-center">
        <h4 className="text-white font-bold text-sm mb-2">¿Por qué este método?</h4>
        <p className="text-slate-400 text-[10px] leading-relaxed italic">
          "PWABuilder utiliza la tecnología Trusted Web Activity (TWA) de Google, lo que garantiza que tu app sea rápida, segura y ocupe muy poco espacio en el teléfono de tus usuarios."
        </p>
      </div>
    </div>
  );
};

export default PublishGuide;
