/**
 * Los textos del recorrido guiado, por pantalla.
 *
 * ─── Por qué el recorrido es por pantalla y no uno solo ────────────────────
 *
 * La tentación es un recorrido único de doce pasos que arranca en el panel y
 * termina en una garantía emitida. Pero eso cruza cinco páginas, y un recorrido
 * que navega necesita guardar en qué paso iba, reanudar del otro lado, y
 * acertarle a que el elemento ya esté dibujado. Es una máquina de estados que se
 * rompe con el primer cambio de layout, y cuando se rompe se rompe delante de un
 * prospecto.
 *
 * Así que cada pantalla tiene su propio recorrido corto, que arranca la primera
 * vez que se llega. No hay estado compartido, ningún paso puede quedar
 * huérfano, y si alguien entra directo a una pantalla igual entiende qué está
 * mirando.
 *
 * ─── Reglas de los textos ──────────────────────────────────────────────────
 *
 * No describir lo que ya se ve. «Acá está la lista de clientes» no le aporta
 * nada a alguien que está mirando una lista de clientes. Cada globito tiene que
 * decir **para qué sirve** o **qué error evita** — eso es lo que no se deduce
 * mirando.
 *
 * ─── Anclas ────────────────────────────────────────────────────────────────
 *
 * Cada paso apunta a un `data-tour="..."` puesto en el componente real. Un paso
 * cuya ancla no existe **se saltea en silencio** en vez de romper el recorrido:
 * alguien va a refactorizar una pantalla y no va a pensar en esto, y es mejor
 * perder un globito que perder al prospecto.
 */

export interface PasoRecorrido {
  /** El `data-tour` del elemento a resaltar. Sin esto, el paso va centrado. */
  ancla?: string;
  titulo: string;
  texto: string;
}

export type PantallaConRecorrido = 'taller' | 'configuracion' | 'turnos' | 'stock';

export const RECORRIDOS: Record<PantallaConRecorrido, PasoRecorrido[]> = {
  taller: [
    {
      titulo: 'Este es tu taller',
      texto:
        'Estás viendo el panel de un instalador Kristall con datos de ejemplo. Podés tocar todo: nada de lo que hagas acá le llega a nadie, y se borra solo.',
    },
    {
      ancla: 'resumen-mes',
      titulo: 'Lo que facturaste y lo que falta cobrar',
      texto:
        'Se calcula solo, a partir de las órdenes que vas terminando. No hay que cargar ningún número aparte.',
    },
    {
      ancla: 'nav-turnos',
      titulo: 'Acá te entran los pedidos',
      texto:
        'Tus clientes piden turno desde tu página pública y caen en esta bandeja. Vos confirmás o rechazás: la agenda no se llena sola.',
    },
    {
      ancla: 'nav-configuracion',
      titulo: 'Empezá por acá',
      texto:
        'Tu página pública, tus servicios y tus horarios se configuran en esta pantalla. Es lo primero que conviene mirar.',
    },
  ],

  configuracion: [
    {
      ancla: 'rubros',
      titulo: '¿Sobre qué trabajás?',
      texto:
        'Define qué le pedimos a tu cliente cuando te escribe: a quien tiene un auto, la patente; a quien tiene una casa, la dirección. Si hacés las dos cosas, tu página muestra las dos listas.',
    },
    {
      ancla: 'modalidades',
      titulo: 'Y cómo trabajás',
      texto:
        'Lo que no marques aparece en tu página como no disponible. Decir «esto no lo hago» también informa: le evita a tu cliente escribirte para algo que no ofrecés.',
    },
    {
      ancla: 'handle',
      titulo: 'Tu dirección propia',
      texto:
        'Elegí un nombre y tu página queda publicada en esa dirección. Es la que repartís en tarjetas y redes, así que conviene pensarla: cambiarla rompe los links viejos.',
    },
    {
      ancla: 'servicios',
      titulo: 'Lo que ofrecés',
      texto:
        'Cada servicio lleva cuánto te lleva hacerlo, y con eso calculamos qué horarios ofrecerle a tu cliente. Es el campo que más se olvida y sin él el turno degrada a «mandame un mensaje».',
    },
  ],

  turnos: [
    {
      titulo: 'Los pedidos que te entraron',
      texto:
        'Un pedido todavía no es una orden: entró desde tu página y no ocupa lugar en tu agenda hasta que vos digas que sí.',
    },
    {
      ancla: 'confirmar-turno',
      titulo: 'Al confirmar, se vuelve orden de trabajo',
      texto:
        'Se crea el cliente, el vehículo y la orden agendada, todo junto. Y podés correr el horario antes de confirmar: el cliente pide «el jueves a las 9» y vos lo acomodás a las 10 sin llamar a nadie.',
    },
  ],

  stock: [
    {
      titulo: 'Tus rollos, y cuánto queda de cada uno',
      texto:
        'Los metros se descuentan solos a medida que terminás órdenes. No hay que llevar la cuenta aparte.',
    },
    {
      ancla: 'generar-instalacion',
      titulo: 'De un rollo salen varias garantías',
      texto:
        'Cada vez que cortás para un vehículo, generás un código. El cliente lo activa desde su celular y la garantía queda a su nombre — y si no lo activa, vos ya tenés registro del trabajo.',
    },
  ],
};
