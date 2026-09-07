# Portal de demostración

Darle a un desconocido una sesión del Portal de Instalador para que vea cómo funciona: entra, toca
todo, se le explica con un recorrido guiado, y lo que haya hecho no le queda a nadie.

Vive en este repo y no junto a `TURNOS-POLARIZAR.md` / `RUBROS-INSTALADOR.md` (que están en
`polarizar/`) porque el sujeto de esta función es el portal, y el portal vive acá. Si preferís los
tres planes en un solo lugar, movelo — no hay nada que dependa de la ruta.

> **Estado: propuesta.** Nada implementado.

---

## 1. Lo que está decidido

1. **El demo es solo el Portal del Instalador, no el CRM interno.** El CRM tiene los datos de todos
   tus clientes reales; un demo ahí es otro proyecto y otra conversación.
2. **La página pública del demo es de verdad y es propia de cada sesión**, con el nombre que elija
   el prospecto, pero vive en un espacio de URL aparte: `polariz.ar/demo/<lo-que-eligio>`. El flujo
   completo se puede mostrar sin que nadie pueda quemar un nombre real. Ver la sección 4.
3. **Una sesión de demo dura 30 minutos**, contra las 12 horas de una sesión real.
4. Queda como supuesto mío, no confirmado: que esto es **una función permanente y pública** y no una
   herramienta interna que se usa tres veces por mes. Es lo que manda en la decisión de la sección 3;
   si fuera lo segundo, ahí cambia la recomendación.

---

## 2. La decisión de fondo: clonar, no resetear

Pediste que "en cada sesión la configuración se restablezca". El problema de resetear al entrar es
**dos personas a la vez** — que es justo cuando se usa un demo: un vendedor mostrándolo en una
reunión mientras alguien más entró por el link del mail. El segundo login le borra el taller al
primero en medio del recorrido.

Así que: **`demo`/`demo` es la puerta, no la identidad.** Al entrar se crea un taller descartable
—copia de una plantilla— y esa sesión queda atada a *ese* clon. Dos personas, dos clones.

El reset deja de existir como problema: no se restablece nada, cada sesión nace limpia por
construcción. Lo viejo lo junta un cron.

### La puerta no necesita autenticación nueva

Esta es la parte que sale gratis, y conviene entender por qué antes de diseñar nada.

La sesión del portal (`lib/client-portal/session.ts`) es un **token firmado sin estado** que lleva
`contactId`, `name`, `company`, `accessLevel` y `credentialVersion`. El CRM no sabe nada de
sesiones: cada endpoint recibe el `contactId` y revalida contra `ClientPortalAccount`.

O sea que para meter a alguien en el portal alcanza con **emitir esa cookie apuntando al clon**. No
hace falta un usuario `demo` con contraseña `demo` en la tabla de credenciales, ni tocar el login.

```
POST /api/portal/demo   (kristall-web, ruta nueva)
   └─ pide al CRM que provisione un clon
   └─ recibe { contactId, credentialVersion }
   └─ setea la misma cookie de siempre, con maxAge de 30 min
   └─ redirige a /cliente/taller
```

El clon **sí** necesita su fila en `ClientPortalAccount`, porque `requireInstallerLevel` la exige
(cuenta habilitada, `accessLevel: INSTALLER`, `passwordHash` no nulo). Se le pone un hash de una
contraseña aleatoria de 32 bytes que nadie conoce: la cuenta existe, pasa el portero, y no se puede
entrar por el formulario de login ni adivinándola.

**Yo pondría un botón "Ver una demo"** en vez de un formulario. Un login es fricción justo cuando
querés que la persona entre, y `demo`/`demo` es lo primero que prueban los bots que barren
`/cliente/ingresar` — estarías creando clones para robots. Si igual querés poder decir "entrá con
demo y demo" en una llamada de venta, que las dos puertas lleven al mismo endpoint. No cuesta nada.

---

## 3. El problema que no está a la vista: los números del negocio

Acá está el verdadero costo de la función, y no es el que uno espera.

Para que la pantalla de **Stock** muestre algo, el clon necesita rollos. Los rollos cuelgan de
`SaleItem` → `Sale` → contacto. **O sea que cada sesión de demo crearía una venta.**

Y las ventas se suman. En el CRM hay **14 agregaciones** sobre ventas, pagos y cantidad de contactos,
repartidas en 7 archivos:

```
src/app/api/dashboard/route.ts      src/lib/account.ts
src/app/api/clients/route.ts        src/lib/assistant-core.ts
src/app/api/installers/route.ts     src/app/api/whatsapp/campaign/route.ts
src/app/api/leads/route.ts
```

El peor de todos es `assistant-core.ts`: es el asistente que lee la base y contesta en prosa. Es
exactamente el lugar donde un número inflado se dice con total seguridad y alguien lo cree.

Un demo no puede tener la capacidad de mover un número que el negocio mira. Hay dos formas de
evitarlo.

### Opción A — Clones en la base real, con `isDemo` y exclusiones

Un booleano en `Contact`, y `isDemo: false` en las 14 agregaciones, más las listas de Clientes e
Instaladores, más el asistente.

- **A favor:** una sola base, nada de infraestructura nueva.
- **En contra:** son 15 y pico de lugares que alguien tiene que acordarse para siempre. El día que
  se agregue el reporte número 15 sin el filtro, la cifra queda mal y nadie se entera — porque un
  número inflado no se ve raro, se ve bien.

### Opción B — Base de datos aparte para el demo *(recomendada)*

El mismo `schema.prisma`, un segundo `DATABASE_URL`, y las rutas del portal usan ese cliente cuando
la sesión es de demo.

- **A favor:** correcto por construcción. Cero contaminación de reportes, cero filtros que recordar,
  y el cron de limpieza no puede tocar datos reales ni con un `where` mal escrito. En el peor caso
  se vacía la base de demo entera y no pasa nada.
- **A favor, y es el argumento que apareció después:** la base aparte **también separa el espacio de
  nombres de los handles**. `WorkshopSettings.handle` es `@unique`, así que en una sola base dos
  clones no pueden llamarse igual y ninguno puede tomar un nombre que un taller real podría querer.
  En dos bases eso deja de existir: un prospecto puede elegir `tallercarlos` en la demo sin tocar el
  `tallercarlos` de producción. Es lo que hace posible mostrar el flujo completo (sección 4).
- **En contra:** una base más que mantener, y **riesgo de que los esquemas se separen** si alguien
  corre `db:push` en una sola.
- **Mitigación:** un solo script que corre `db:push` contra las dos, y un chequeo al arrancar que
  compara y avisa si difieren.

#### Tiene que ser MySQL, y en el mismo lugar

La base de demo corre **el mismo `schema.prisma`**, así que no puede ser de otro motor. El schema
declara `provider = "mysql"` y usa atributos que no existen fuera de MySQL: 8 `@db.LongText`, 57
`@db.Text`, 5 `@db.VarChar`, 44 `@db.Decimal`. Con Postgres —Neon, Supabase, lo que sea— habría que
mantener un **segundo schema divergente**, que es la deriva de la que hablábamos arriba pero
convertida en permanente y estructural.

(La idea de Neon es buena por un motivo real: su función de *branching* crea una copia instantánea de
la base y la descarta después, que es exactamente "un clon por sesión" resuelto en la infraestructura
en vez de en el código. Si el stack fuera Postgres sería el camino. No lo es.)

Lo natural entonces es **una segunda base MySQL en la misma cuenta de Hostinger**: mismo motor, mismo
servidor, sin latencia de red nueva, sin proveedor nuevo, y `db:push` a las dos desde un script.
Conviene confirmar que el plan admite otra base — no pude chequearlo desde acá porque el conector de
Hostinger pide autorización que esta sesión no puede dar.

**Una aclaración honesta:** una segunda base en el mismo servidor aísla los *datos*, no la *carga*.
Comparten CPU y memoria del MySQL. Para el volumen de un demo eso es irrelevante, pero si la idea era
sacarle trabajo al servidor de producción, esto no lo hace — y no hace falta que lo haga.

**Recomiendo B**, y el motivo es el supuesto 4: si esto va a ser una función permanente y pública,
la pregunta no es "¿me acuerdo de poner el filtro?" sino "¿puede alguien olvidarse alguna vez?". Con
A, sí. Con B, no existe la pregunta.

Si el demo terminara siendo una herramienta interna de venta y no una función pública, A es
proporcionada y la haría sin culpa.

### El detalle a prototipar antes de comprometerse

`src/lib/workshop.ts` son ~1500 líneas que usan el singleton `prisma` importado. Que esas funciones
hablen con otra base sin reescribirlas se puede hacer de dos maneras:

- **Un proxy en `src/lib/prisma.ts`** que resuelve al cliente de demo cuando hay contexto de demo
  activo. No cambia ni una línea del resto. Es elegante y es magia, y la magia en la capa de datos
  se paga cara: si el contexto se pierde, **cae en la base real**, que es justo la dirección
  peligrosa del error.
- **Pasar el cliente explícito** desde el portero del portal. Falla cerrado y se lee sin sorpresas,
  pero toca muchas firmas.

Esto es lo único del plan que armaría como prueba de concepto de una hora antes de decidir. Mi
intuición es el proxy **pero fallando al revés**: que el contexto de demo sea obligatorio de declarar
y que la ausencia de contexto en una ruta marcada como de demo tire, en vez de degradar a producción.

---

## 4. Los efectos que salen del sistema

Independiente de A o B, hay cosas que no viven en la base y hay que cortarlas igual. Un instalador
puede, sin hacer nada raro:

| Acción del demo | Qué pasa hoy |
|---|---|
| Pasar una OT a TERMINADA | **Genera garantías y manda el mail al cliente final**, a la dirección que el prospecto haya tipeado, con la marca Kristall |
| Generar un sub-código de garantía | **Le notifica a tus administradores** (`notifyAdmins`) |
| Confirmar un pedido de turno | Manda mail y WhatsApp reales al cliente |
| Publicar su página | **Tomaría un handle para siempre** — resuelto: el clon no publica, ver abajo |

### Dónde va cada guardia

Lo bueno es que los cuatro canales ya están embudados, así que son cuatro archivos y no cuarenta
lugares:

| Canal | Archivo | Llamadas hoy |
|---|---|---|
| Mail | `src/lib/mailer.ts` → el objeto `transporter` ya envuelve a nodemailer | 16 |
| WhatsApp | `src/lib/whatsapp.ts` → `sendWhatsapp` | 1 |
| Campanita de admins | `src/lib/notifications.ts` → `notifyAdmins` | 22 |
| Handles | `src/lib/workshop-handle.ts` → `HANDLES_RESERVADOS` | — |

**La guardia va adentro del emisor, nunca en el que llama.** Con 16 y 22 llamadas, guardias
repartidas son guardias que alguien se va a olvidar; una sola en el fondo de cada canal se audita
mirando cuatro archivos.

El emisor no sabe de quién es la acción, así que el dato tiene que viajar con el request y no con los
argumentos: **`AsyncLocalStorage`** (hoy no se usa en el CRM), plantado en el portero del portal.
Propaga solo a los `void avisarPedidoAlInstalador(...)` que se disparan sin esperar, que es
justamente donde más falta hace.

Y encima, cinturón y tiradores: `enviarMailDeGarantia(installationId)` y
`avisarPedidoAlInstalador(bookingId)` **releen la fila de la base igual**, así que pueden chequear
`isDemo` del contacto dueño y negarse por su cuenta, sin depender del contexto.

### La página pública: propia, real, y en su propio espacio de URL

Pasé por dos ideas malas antes de esta, así que dejo las tres para que se entienda por qué esta es la
buena.

- **Una página por clon en el espacio real** (`polariz.ar/demo-a7f3`): muestra el flujo entero, pero
  ensucia el espacio de nombres de producción y obliga a una regla de prefijo.
- **Una sola página fija de exhibición** (`polariz.ar/taller-demo`): no ensucia nada, pero **corta el
  flujo justo donde más convence** — el prospecto no puede elegir su nombre ni ver sus propios
  servicios publicados.
- **Un espacio de URL aparte** *(la buena)*: `polariz.ar/demo/<lo-que-eligio>`.

El prospecto elige `tallercarlos` como lo haría de verdad, aprieta publicar, y el recorrido lo manda
a `polariz.ar/demo/tallercarlos` — una página real, con sus servicios, sus horarios y sus tarjetas de
modalidad. El flujo completo, sin ninguna nota que pedir disculpas.

Y no colisiona con nada, por dos razones que se suman:

1. **`demo` ya está reservado** en `HANDLES_RESERVADOS` (línea 44, junto a `test`, `dev`, `staging`).
   Ningún taller real puede tomar `polariz.ar/demo`, así que ese segmento está libre para siempre. No
   hay que agregar ni una palabra a la lista: la decisión de reservar de más, tomada en su momento,
   ya pagó.
2. **Con la base separada de la sección 3, los handles viven en espacios distintos.** Que alguien tome
   `tallercarlos` en la demo no toca el `tallercarlos` de producción, porque son dos tablas en dos
   bases. La unicidad sigue valiendo dentro de cada una, que es lo que importa.

En Next las rutas estáticas ganan sobre las dinámicas, así que `app/demo/[handle]/` convive con
`app/[handle]/` sin ambigüedad: `/demo/carlos` entra por la primera y `/carlos` por la segunda.

**Lo que hay que construir:** una ruta en polarizar que sea la misma landing leyendo de la base de
demo, y un endpoint público del CRM que resuelva un handle contra esa base. Es la landing que ya
existe con otro origen de datos — no una página nueva.

**Y un detalle de honestidad:** la página de demo debería llevar una banda arriba que diga que es una
demostración. No por lo legal, sino porque va a terminar compartida por WhatsApp y alguien va a
pedirle turno a un taller que no existe.

---

## 5. La plantilla: que no parezca abandonada

Un portal vacío demuestra mal. La plantilla tiene que traer, como mínimo:

- 3 o 4 clientes finales con sus vehículos
- 5 órdenes de trabajo repartidas entre PRESUPUESTADA, AGENDADA, EN_PROCESO, TERMINADA y ENTREGADA
- Stock con dos rollos, uno a medio consumir
- 2 pedidos de turno sin responder, para que la bandeja tenga algo que hacer
- Un par de garantías activas y una por activar
- Servicios de los dos rubros, para que se vea lo que acabamos de construir

**Las fechas se generan relativas a hoy, nunca fijas.** Un demo donde todo dice "vencido hace ocho
meses" y la última orden es de enero se ve abandonado, y esa impresión se le pega al producto.
Órdenes de esta semana, garantías que vencen el año que viene, turnos para el jueves.

Es el trabajo más aburrido del plan y el que más se nota.

---

## 6. El recorrido guiado

La parte fácil, y conviene no inflarla.

**La librería: `driver.js`.** Unos 5 KB, sin dependencias, MIT, y hace exactamente ese estilo de
oscurecer la pantalla, resaltar un elemento y poner el globito al lado. Alternativas: Shepherd.js
(más grande) y React Joyride (más pesado y menos mantenido). Cero costo de servidor: es todo del
lado del cliente y los pasos son un archivo de TypeScript.

Lo que sí cuesta son dos cosas:

**Los anclajes.** Cada paso necesita un selector estable, o sea un `data-tour="..."` en los
componentes reales. Es un diff aburrido repartido en muchos archivos, y es lo que se pudre: alguien
refactoriza una pantalla y el paso queda apuntando a la nada. Dos reglas para que envejezca bien:

- un paso sin ancla **se saltea en silencio**, no rompe el recorrido;
- un chequeo que solo corre en desarrollo lista los pasos huérfanos, para que se note al refactorizar
  y no en la cara de un prospecto.

**Los textos.** Escribir quince globitos buenos es trabajo de redacción, no de programación, y es lo
que decide si el recorrido ayuda o molesta. Reglas: uno por pantalla, nunca describir lo que ya se ve
("acá está la lista de clientes" no aporta), siempre decir para qué sirve o qué error evita.

El portal tiene **18 pantallas protegidas**. El recorrido no las cubre todas: cubre el camino que
convence, que yo armaría así —

1. Mi Taller (el panel) → 2. Configuración: sobre qué trabajás y cómo → 3. Servicios → 4. Elegir su
nombre y publicar, y abrir su página → 5. Bandeja de turnos → 6. Confirmar un turno y ver cómo se
vuelve orden → 7. Stock y m² restantes → 8. Terminar una OT y ver la garantía que sale.

El paso 4 es el momento más convincente del recorrido y ahora se puede mostrar entero: la persona
elige un nombre, publica, y abre una página que es suya. Vale gastar un globito extra ahí.

**Hacelo también para los instaladores nuevos de verdad.** Es el mismo componente con un flag "ya lo
vio" por cuenta, y el onboarding es donde se abandona un panel. El demo es la excusa para construir
algo que sirve para los clientes reales.

---

## 7. Limpieza

- La sesión vence a los 30 minutos por el `maxAge` de la cookie: eso ya funciona solo.
- El clon queda. Un cron diario borra los clones con más de 24 h, en el orden de dependencias que ya
  usa el borrado de contactos.
- Con la opción B el cron es trivial y no puede hacer daño: la única base que toca es la de demo.
- Un tope de clones vivos (digamos 50) por si alguien automatiza la puerta. Pasado el tope, el
  endpoint responde "el demo está ocupado, probá en un rato" en vez de seguir creando.

---

## 8. Fases

| Fase | Qué | Dónde |
|---|---|---|
| 0 | Prueba de concepto del cliente de base separado (sección 3, "el detalle a prototipar") | crm-polarizados |
| 1 | Segunda base + `db:push` a las dos + chequeo de deriva | crm-polarizados |
| 2 | Las cuatro guardias de efectos externos + el contexto que las alimenta | crm-polarizados |
| 3 | Endpoint público que resuelve un handle contra la base de demo, y la ruta `/demo/[handle]` en polariz.ar | crm-polarizados + polarizar |
| 4 | Endpoint de provisión + plantilla con fechas relativas | crm-polarizados |
| 5 | La puerta: botón "Ver una demo", cookie de 30 min, cartel permanente de "estás en una demo" | kristall-web |
| 6 | El recorrido: driver.js, anclas, pasos y textos | kristall-web |
| 7 | Cron de limpieza y tope de clones | crm-polarizados |
| 8 | Verificación contra base real y documentación | los dos |

Las fases 0 a 4 son el grueso. La 6 es la más visible y la más barata.

---

## 9. Lo que descartaría

**Un demo con datos falsos.** `CRM_MOCK=1` ya existe en kristall-web y devuelve fixtures, así que es
tentador: cero escrituras, cero riesgo, cero limpieza. Pero un demo donde agregás un servicio,
refrescás y no está, se lee como un producto roto — y el prospecto no concluye "esto es una demo",
concluye "esto no anda". Además obliga a mantener una implementación paralela de cada escritura.

El clon descartable da persistencia real sin ninguno de esos costos.

**Resetear en vez de clonar.** Ver la sección 2: se rompe con dos visitantes simultáneos, que es el
caso de uso principal.

---

## 10. Lo que hay que mirar cuando esté

- **Que un demo no pueda mandar un solo mail.** Es la prueba que yo pondría primero y la que
  repetiría en cada cambio: una OT de demo pasada a TERMINADA no puede producir correo, ni WhatsApp,
  ni campanita.
- **Que los números del CRM no se muevan.** Sacar el total de ventas antes y después de veinte
  sesiones de demo, y que dé igual.
- **Que dos sesiones simultáneas no se vean.** Dos clones, dos configuraciones distintas al mismo
  tiempo.
- **Que un handle de demo no toque el de producción.** Tomar en la demo un handle que ya existe en
  producción, publicar, y verificar que la página real sigue intacta y que `polariz.ar/<ese-handle>`
  sigue mostrando al taller de verdad.
- **Que un clon no pueda escribir en la base real.** La prueba de la sección 3: contar filas en
  producción antes y después de una sesión de demo completa, y que dé exactamente igual.
- **Que el clon se muera.** Correr el cron y verificar que no queda nada — y que no se llevó puesto
  nada real, ni el taller de exhibición.
