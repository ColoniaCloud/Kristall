import Script from 'next/script'

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID

/**
 * Microsoft Clarity: grabaciones de sesión y mapas de calor del sitio público.
 *
 * Se monta en los mismos layouts que GoogleAnalytics y en NINGUNO más: el Panel
 * de Cliente, las garantías y el admin muestran datos personales (nombres,
 * patentes, mails) y Clarity graba la pantalla. Por eso tampoco va en el CRM.
 *
 * Sin `NEXT_PUBLIC_CLARITY_ID` no carga nada, igual que GA4: se puede desplegar
 * el código antes de tener el proyecto creado.
 *
 * El id viaja interpolado dentro de un script inline, así que se valida el
 * formato: una variable de entorno mal pegada no debe poder inyectar código.
 */
export default function Clarity() {
  if (!CLARITY_ID || !/^[a-z0-9]{8,16}$/i.test(CLARITY_ID)) return null
  return (
    <Script id="clarity-init" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window,document,"clarity","script","${CLARITY_ID}");
      `}
    </Script>
  )
}
