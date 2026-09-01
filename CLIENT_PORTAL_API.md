# API de Portal de Clientes — Documentación técnica para integración externa

Este documento describe, con el detalle suficiente para construir un sitio externo, la API que expone
información cruzada de un **Cliente** (`Contact` de tipo `CLIENT` en el CRM — en el vocabulario de
Kristall, el instalador/distribuidor que compra rollos y los revende/instala): su stock/rollos
comprados, sus instalaciones de garantía, sus reclamos, su saldo de pagos pendientes y sus
notificaciones. Está pensado para un **agente/LLM o desarrollador que va a programar el backend del
panel de Cliente en kristallfilm.com**.

**Importante — quién maneja el login:** a diferencia de otras integraciones, el **login del Cliente
vive en este CRM, no en tu backend**. La razón es que solo un admin de Kristall puede aprobar qué
Cliente tiene acceso al panel — no hay auto-registro. Tu backend le pide a este CRM que valide el
email+contraseña (ver sección 3) y, si son correctos, te devuelve el `contactId`; vos guardás ese
`contactId` en tu propia sesión para ese usuario. El CRM nunca te da ni te pide un token de sesión —
la sesión del lado del navegador la manejás enteramente vos.

Solo se exponen contactos de tipo **`CLIENT`**. Instaladores marcados como `INSTALLER` en el CRM (un
tipo de contacto distinto, hoy sin uso para este portal) y leads no tienen acceso a este portal.

---

## 0. Dos niveles de acceso (leer antes que nada)

Desde agosto 2026 el portal tiene **dos niveles**, y cada cuenta (`ClientPortalAccount`) tiene el suyo
en el campo `accessLevel`, que viene en la respuesta del login:

| Nivel | Nombre para el usuario | Qué puede ver |
|---|---|---|
| `BASIC` | **Panel Clientes** | Perfil, compras, **cuenta corriente** (sección 4.9) y notificaciones |
| `INSTALLER` | **Portal Instalador** | Todo lo anterior **más** stock de rollos, instalaciones, reclamos, generación de sub-códigos y **Mi Taller** (sección 4.10) |

- **`BASIC` es el default.** Cualquier Cliente que active su cuenta (sección 3.1) lo obtiene solo, sin
  intervención de nadie.
- **`INSTALLER` lo habilita a mano un operador** desde la ficha del contacto en el CRM. No hay forma de
  pedirlo por API.

**El CRM verifica el nivel de su lado.** Los endpoints marcados como *(nivel INSTALLER)* devuelven
`403 { "error": "Este cliente no tiene habilitado el portal de instalador" }` si la cuenta es `BASIC`,
está deshabilitada, o el contacto no tiene cuenta de portal. No alcanza con esconder los botones en tu
frontend — llamar igual devuelve 403. Vale también para los `GET`, sin excepción.

**Mi Taller (sección 4.10)** es el módulo más grande del nivel `INSTALLER`: son 11 endpoints bajo
`/workshop/` para que el instalador gestione su propio taller (sus clientes finales, los vehículos de
esos clientes, las órdenes de trabajo, la agenda y sus cobros). Es información **del instalador**, no
de Kristall: sus clientes finales no son contactos del CRM y sus cobros no entran en la cuenta
corriente de la sección 4.9.

---

## 1. Modelo de confianza (leer antes de integrar)

- Esta API se llama **exclusivamente desde tu backend**, nunca desde el navegador del cliente final.
  La clave de API (`x-api-key`) no debe llegar jamás al frontend — si se filtra, cualquiera con la key
  puede pedir datos de **cualquier Cliente** del CRM.
- El login (sección 3) es la única vez que el CRM verifica la identidad de un Cliente. Para el resto de
  los endpoints, el CRM **confía en que tu backend solo va a pedir el `contactId` que corresponde al
  Cliente que ya inició sesión** — no vuelve a re-verificar identidad en cada request. No expongas un
  endpoint en tu propio backend que permita a un usuario pedir el `contactId` de otro.
- No hay CORS habilitado en ninguno de estos endpoints (a diferencia de la API pública de garantías):
  todos requieren `x-api-key` y están pensados para llamarse servidor a servidor.

---

## 2. Autenticación

- Header: `x-api-key: capi_<48 caracteres hex>`.
- La key se genera **dentro del CRM** por un usuario `SUPERADMIN`, desde `/settings` → sección
  **"API Keys del Portal de Clientes"**. Se muestra
  **una sola vez** en el momento de creación — si se pierde, hay que revocarla y generar una nueva.
- Cada key pertenece a una integración (normalmente vas a tener una sola, para tu sitio) y se puede
  revocar sin afectar otras integraciones (ej. la de garantías, que usa un mecanismo separado).
- Una key inválida, ausente o revocada devuelve `401 { "error": "API key inválida" }` en cualquier
  endpoint.
- Rate limit: 300 requests/minuto por key. Si se excede, `429 { "error": "Demasiadas solicitudes" }`.

### `x-portal-credential-version` (sesiones)

Todos los endpoints de la sección 4 (los que van bajo `/contacts/:contactId/`) aceptan además una
cabecera opcional:

```
x-portal-credential-version: <el valor que devolvió el login>
```

Es la huella de la contraseña con la que se abrió la sesión. Si el Cliente cambió la contraseña
después, el CRM responde **401** `{ "error": "La sesión venció porque se cambió la contraseña" }` y
tu sesión deja de valer en ese mismo momento, en vez de sobrevivir hasta que expire tu cookie.

- **Mandala siempre.** Sin ella, el CRM acepta el pedido igual (por compatibilidad con las sesiones
  emitidas antes de septiembre 2026), pero un cambio de contraseña no corta nada.
- **Tratá el 401 distinto del 403**: 401 es "esta sesión no vale más, cerrala y pedí login de nuevo";
  403 es "esta cuenta no tiene ese permiso".

---

## 3. Login del Cliente

```
POST /api/portal/v1/auth/login
```
Body: `{ "email": "juan@example.com", "password": "..." }`.

- **200** `{ "contactId": "cly...", "name": "Juan Pérez", "company": "Vidriería Sur", "accessLevel": "BASIC",
  "credentialVersion": "a1b2c3d4e5f60718" }` — credenciales correctas. Guardá `contactId`,
  `accessLevel` **y `credentialVersion`** en tu propia sesión para ese usuario; no hace falta volver a
  llamar a este endpoint hasta que la sesión expire de tu lado. Con `accessLevel` armás el menú (ver
  sección 0); el CRM igual lo revalida en cada endpoint de instalador. `credentialVersion` va de
  vuelta en la cabecera `x-portal-credential-version` (sección 2).

  `company` puede ser `null`: es una columna opcional de la ficha del CRM y los clientes particulares
  no la tienen cargada.
- **401** `{ "error": "Credenciales inválidas" }` — email no existe, contraseña incorrecta, o el acceso
  fue deshabilitado por un admin. El error es intencionalmente genérico (no distingue el motivo) para
  no facilitar enumeración de cuentas.
- **429** — se superó el límite de 5 intentos / 15 min por combinación de tu key + ese email. Frená ahí
  tu propio formulario de login (no reintentes automáticamente).

**Si el login devuelve `401` siempre, el Cliente probablemente todavía no activó su cuenta** — mandalo
al flujo de la sección 3.1.

---

## 3.1 Alta de cuenta (autoservicio, dos pasos)

Cualquier Cliente cargado en el CRM puede darse de alta solo, sin que un admin intervenga. Lo único
que necesita es que su email esté en la ficha del CRM.

### Paso 1 — pedir el mail de activación

```
POST /api/portal/v1/auth/request-activation
```
Body: `{ "email": "juan@example.com" }`.

- **200** `{ "found": true, "alreadyActive": false, "message": "..." }` — se encontró la ficha y se
  mandó el mail. Mostrá el `message` tal cual.
- **200** `{ "found": true, "alreadyActive": true, "message": "..." }` — ya tiene cuenta activa;
  mandalo a iniciar sesión o a recuperar la contraseña.
- **200** `{ "found": false, "message": "..." }` — ese email no corresponde a ningún Cliente. Solo
  cuentan los contactos de tipo `CLIENT`: un Lead con el mismo email **no** califica.
- **409** `{ "error": "Hay más de una ficha con ese email. Contactanos para resolverlo." }` — hay más
  de una ficha de Cliente con ese email; hay que resolverlo con Kristall a mano. *(Hasta septiembre
  2026 este caso devolvía `{ found, message }` en vez de `{ error }`, y era el único 4xx de la API
  que no seguía la convención.)*
- **429** — dos límites distintos: máximo **3 pedidos cada 15 min por email** (contra insistir sobre
  una misma dirección) y **40 cada 15 min en total por key** (contra barrer una lista).
- **503** — el servidor de mail no está configurado.
- **502** `{ "error": "..." }` — se encontró la cuenta pero falló el envío del mail. Mostrá el `error`
  y nada más: la respuesta del CRM puede traer campos de diagnóstico pensados para quien opera el
  sistema, no para el navegador.

> **Nota de seguridad:** a diferencia del resto de la API, este endpoint **confirma si un email
> pertenece a un cliente de Kristall**. Es deliberado: el flujo pedido muestra "encontramos tu cuenta"
> en pantalla. Lo que frena la enumeración es el tope **global por key**, no el de 3 por email: quien
> barre una lista prueba direcciones distintas y nunca toca el límite por email.

### Paso 2 — validar el link y crear la contraseña

El mail lleva a `https://<tu-sitio>/cliente/activar/<token>`. El token dura **24 h** y sirve una sola vez.

```
GET /api/portal/v1/auth/activate?token=<token>
```
- **200** `{ "valid": true, "email": "...", "name": "Juan Pérez", "company": "...", "whatsapp": "1125835244" }`
- **404** `{ "error": "El link no es válido." }` · **410** — ya usado o vencido.

`whatsapp` es el número que el CRM ya tiene cargado, o `null`. Usalo para preguntar *"¿este número
sigue siendo el tuyo?"* en vez de pedirlo en blanco. Si viene `null`, pedilo.

```
POST /api/portal/v1/auth/activate
```
Body: `{ "token": "...", "password": "min 8 caracteres", "whatsapp": "1155667788" }` (`whatsapp` opcional).

- **200** `{ "contactId": "cly...", "name": "...", "company": "...", "accessLevel": "BASIC" }` — cuenta
  creada. Podés abrir la sesión directamente con esto, sin pasar por el login.
- **400** — contraseña de menos de 8 caracteres. **404 / 410** — token inválido, usado o vencido.
- **409** — ese email ya lo usa otra cuenta del portal.

> **El WhatsApp que manda el Cliente NO pisa el de la ficha del CRM.** Se guarda aparte, en su cuenta
> del portal, y si difiere del que ya había se le avisa a un operador para que decida cuál vale. El de
> la ficha puede ser el del local y este el personal.

La cuenta siempre queda en nivel **`BASIC`**. El nivel `INSTALLER` no se puede obtener por API.

---

## 3.2 Recuperación de contraseña

```
POST /api/portal/v1/auth/request-reset
```
Body: `{ "email": "..." }`. **Siempre 200** con el mismo mensaje, exista o no la cuenta — a diferencia
del alta, acá no se confirma si el email está registrado. **429** si se superan 3 pedidos cada 15 min.

El mail lleva a `https://<tu-sitio>/cliente/nueva-clave/<token>`. Ese token dura **1 hora**.

```
GET  /api/portal/v1/auth/reset?token=<token>   → 200 { "valid": true, "email": "..." }
POST /api/portal/v1/auth/reset                 → body { "token": "...", "password": "min 8" }
```

El `POST` responde **200** `{ "ok": true, "message": "..." }` y **no abre sesión** a propósito: después
de cambiarla, el Cliente inicia sesión por el camino normal. Así el link del mail, por sí solo, nunca
alcanza para quedar adentro de la cuenta.

### Flujo de vinculación (alternativa/complemento al login)

Si en algún momento necesitás resolver el `contactId` de un Cliente sin pasar por su login (por ejemplo,
para verificar internamente si un email ya tiene ficha de Cliente antes de pedirle a Kristall que le dé
acceso), existe:

```
GET /api/portal/v1/contacts/lookup?email=<email>
```

- **200** `{ "contactId": "cly...", "name": "Juan Pérez", "company": "Vidriería Sur" }` — un único match.
- **404** — ese email no corresponde a ningún Cliente cargado en el CRM.
- **409** — hay más de un Cliente con ese email; hay que resolver la ambigüedad manualmente con Kristall.

---

## 4. Referencia de la API

Base URL: `https://<dominio-del-crm>` (a confirmar con el equipo del CRM).

Todos los endpoints de esta sección requieren el header `x-api-key`.

### 4.1 `GET /api/portal/v1/contacts/:contactId` — Perfil, compras y saldo

**Response `200`:**
```json
{
  "id": "cly...",
  "firstName": "Juan",
  "lastName": "Pérez",
  "name": "Juan Pérez",
  "company": "Vidriería Sur",
  "email": "juan@example.com",
  "phone": "+5491112345678",
  "address": "Av. Siempre Viva 123",
  "city": "Colón",
  "state": "Entre Ríos",
  "purchases": [
    {
      "id": "clz...",
      "saleNumber": "#1042",
      "total": 150000,
      "paymentStatus": "PARTIAL",
      "createdAt": "2026-06-01T00:00:00.000Z",
      "items": [{ "productName": "KRYPTON 05", "quantity": 3, "unitPrice": 50000 }]
    }
  ],
  "payments": [
    { "id": "clp...", "amount": 50000, "method": "TRANSFER", "date": "2026-06-05T00:00:00.000Z", "saleNumber": "#1042" }
  ],
  "balance": 100000
}
```
`paymentStatus` es `"PAID" | "PARTIAL" | "PENDING"` por venta. `balance` es el saldo pendiente total
(suma de `total - pagos` de todas sus ventas) — es lo que se muestra como "pagos pendientes".

**Errores:** `404 { "error": "Cliente no encontrado" }` (no existe o no es tipo `CLIENT`).

### 4.2 `GET /api/portal/v1/contacts/:contactId/stock` — Rollos/garantías compradas *(nivel INSTALLER)*

Devuelve los rollos (`WarrantyRoll`) vendidos a ese cliente, con su lote, producto e instalaciones.

```json
[
  {
    "id": "clr...",
    "fullRollCode": "LOT-20260705-0001-R003",
    "status": "IN_USE",
    "lot": { "lotNumber": "LOT-20260705-0001" },
    "product": { "id": "clp...", "name": "KRYPTON 05", "sku": "KR-05", "category": "AUTOMOTIVE", "warrantyConfig": { "maxInstallations": 1 } },
    "installations": [
      { "id": "cli...", "installationCode": "LOT-...-R003-I1", "status": "ACTIVE", "activatedAt": "2026-06-10T00:00:00.000Z", "expiresAt": "2027-06-10T00:00:00.000Z" }
    ],
    "_count": { "installations": 1 }
  }
]
```
`status` de rollo: `IN_STOCK | SOLD | IN_USE | EXHAUSTED | VOIDED`. `product.warrantyConfig` es `null` si el
producto no tiene configuración — en ese caso asumir `maxInstallations: 15` (default del CRM). Para saber
cuántos sub-códigos de instalación quedan disponibles en un rollo, comparar `installations.length` (TODAS
las generadas, no solo activas) contra `maxInstallations` — **no** usar `_count.installations`, que cuenta
únicamente instalaciones `ACTIVE` (ver sección 4.8).

**`currentLocation` se retiró de esta respuesta (septiembre 2026).** Existió entre agosto y septiembre
de 2026 y devolvía la última ubicación física conocida del rollo antes de la venta. Se sacó porque es
custodia interna y podía identificar a un tercero: el FIFO que asigna rollos a una venta no filtra por
ubicación, así que a un Cliente se le puede asignar un rollo que estaba consignado en el Punto de
Reventa de **otro** instalador, y ese campo le mostraba el nombre y el `contactId` de ese taller. Si
integrabas contra él, sacalo: ya no viene. Para saber qué puede instalar el Cliente alcanza con que el
rollo aparezca en esta lista.

### 4.3 `GET /api/portal/v1/contacts/:contactId/installations` — Instalaciones de garantía *(nivel INSTALLER)*

```json
[
  {
    "id": "cli...",
    "installationCode": "LOT-...-R003-I1",
    "status": "ACTIVE",
    "assetType": "VEHICLE",
    "assetDescription": "Toyota Corolla 2022",
    "activatedAt": "2026-06-10T00:00:00.000Z",
    "expiresAt": "2027-06-10T00:00:00.000Z",
    "roll": { "fullRollCode": "LOT-20260705-0001-R003", "product": { "id": "clp...", "name": "KRYPTON 05", "sku": "KR-05" } }
  }
]
```

### 4.4 `GET /api/portal/v1/contacts/:contactId/claims` — Historial de reclamos *(nivel INSTALLER)*

```json
[
  { "id": "clc...", "status": "OPEN", "description": "Se despegó una esquina", "createdAt": "2026-07-01T00:00:00.000Z", "installation": { "installationCode": "LOT-...-R003-I1", "status": "ACTIVE" } }
]
```

### 4.5 `POST /api/portal/v1/contacts/:contactId/claims` — Crear un reclamo *(nivel INSTALLER)*

A diferencia de la API pública de garantías, acá **no hace falta repetir el email/DNI de la
activación** — la pertenencia del reclamo se verifica porque la instalación tiene que pertenecer a un
rollo vendido a ese `contactId` (ya lo garantiza tu login).

**Body:**
```json
{
  "installationId": "cli...",
  "description": "Se despegó una esquina de la lámina a los 3 meses",
  "reporterName": "Juan Pérez",
  "reporterEmail": "juan@example.com",
  "reporterPhone": "+5491112345678"
}
```

| Campo | Requerido |
|---|---|
| `installationId` | **Sí** |
| `description` | **Sí** |
| `reporterName` | **Sí** |
| `reporterEmail` | **Sí** |
| `reporterPhone` | No |

**Response `201`:** `{ "id": "clc...", "status": "OPEN" }`

**Errores:**
- `404 { "error": "Instalación no encontrada" }` — no existe, o no pertenece a ese `contactId`.
- `400 { "error": "Esta garantía no está activa" }` — la instalación está `PENDING` o `VOIDED`.
- `400 { "error": "Esta garantía ya venció" }` — figura `ACTIVE` pero su `expiresAt` ya pasó. Es un
  error aparte porque **`EXPIRED` se calcula, no se persiste**: no hay proceso que escriba ese estado
  en la base, así que una garantía vencida sigue diciendo `ACTIVE` en el campo `status` que devuelven
  4.2 y 4.3. Si escondés el botón de reclamo mirando solo `status`, mostralo también según
  `expiresAt`.
- `400` con detalle de zod si falta algún campo requerido o el email es inválido.

El reclamo queda con `channel: "CLIENT_PORTAL_API"` y dispara una notificación a los administradores
del CRM (visible en `/warranty-claims`), igual que cualquier otro reclamo.

### 4.6 `GET /api/portal/v1/contacts/:contactId/notifications` — Notificaciones del Cliente

Devuelve las notificaciones no leídas más las de las últimas 24 h (igual que el panel interno de
notificaciones del CRM).

```json
[
  { "id": "cln...", "type": "NEW_PURCHASE", "title": "Nueva compra registrada", "message": "Se registró tu compra #1042 por un total de $150000.", "link": null, "read": false, "createdAt": "2026-07-09T00:00:00.000Z" },
  { "id": "clm...", "type": "WARRANTY_ACTIVATED", "title": "Garantía activada", "message": "Juan Pérez activó la garantía LOT-...-R003-I1.", "link": null, "read": true, "createdAt": "2026-07-08T00:00:00.000Z" },
  { "id": "clo...", "type": "INSTALLMENT_OVERDUE", "title": "Tenés una cuota vencida", "message": "La cuota 2 del plan de la venta #1042 venció el 05/07/2026.", "link": "/cliente/cuenta#cuota-cli123", "read": false, "createdAt": "2026-07-10T00:00:00.000Z" }
]
```

`type` puede ser:

| `type` | Cuándo |
|---|---|
| `NEW_PURCHASE` | Se creó una venta suya, con rollos ya asignados automáticamente. |
| `WARRANTY_ACTIVATED` | Un Usuario activó la garantía de uno de sus rollos. |
| `INSTALLMENT_OVERDUE` | Una cuota de su plan de pagos venció. La genera un proceso del CRM que corre cada 6 h y no repite el aviso de una misma cuota. |

Se generan automáticamente — no hay forma de crearlas manualmente vía API. **Tratá `type` como un
string abierto:** si aparece uno que tu versión no conoce, mostrá `title` y `message` igual en vez de
descartar la notificación.

`link` es una ruta **interna de tu propio sitio**, ya armada, o `null` si la notificación es solo
informativa. El CRM la escribe asumiendo las rutas del Panel de Cliente — por ejemplo
`/cliente/cuenta#cuota-<id>`, cuyo ancla existe en la vista de cuenta corriente. Antes de usarla,
verificá que empiece con `/` y no con `//`: es un valor que viene de otro sistema y no tiene por qué
poder sacar al usuario de tu dominio.

### 4.7 `PATCH /api/portal/v1/contacts/:contactId/notifications/:id/read` — Marcar como leída

**Response `200`:** `{ "ok": true }`. **Errores:** `404` si la notificación no existe o no pertenece a
ese `contactId`.

### 4.8 `POST /api/portal/v1/contacts/:contactId/rolls/:fullRollCode/installations` — Generar un sub-código *(nivel INSTALLER)*

Para el caso en que el Cliente compra un rollo grande y lo corta para instalarlo en varios vehículos de
sus propios clientes: cada corte necesita su propio código de activación (`WarrantyInstallation`)
independiente, hasta el máximo configurado en el producto (`maxInstallations`, default 15 si el
producto no tiene configuración explícita). La primera instalación (`-I1`) ya existe desde que se
vendió el rollo — este endpoint es para generar la segunda, tercera, etc.

No lleva body — no hace falta ningún dato del vehículo/cliente final todavía (eso se carga después,
cuando ese cliente final abre su link y activa la garantía, igual que con la instalación original).

**Response `201`:**
```json
{
  "id": "cli...",
  "installationNumber": 2,
  "installationCode": "LOT-20260705-0001-R003-I2",
  "activationToken": "clx9y8z7...",
  "status": "PENDING",
  "rollStatus": "SOLD"
}
```
Con `activationToken` armás el link para el cliente final: `https://tu-sitio.com/garantia/<token>`
— mismo mecanismo que la sección 2 de `WARRANTY_API.md`. `rollStatus` es el estado del rollo **después**
de esta operación (`SOLD | IN_USE | EXHAUSTED`) — si viene `EXHAUSTED`, esta era la última instalación
disponible; podés actualizar el estado del botón en tu UI sin necesidad de volver a pedir `/stock`.

**Errores:**
- `404 { "error": "Rollo no encontrado" }` — el `fullRollCode` no existe, o no fue vendido a ese `contactId` (mismo error genérico en ambos casos, para no facilitar enumeración).
- `400 { "error": "Este rollo ya no admite más instalaciones" }` — se alcanzó `maxInstallations`, o el rollo está `VOIDED`. El rollo pasa a `status: "EXHAUSTED"` automáticamente cuando se genera la última instalación permitida.

Cada sub-código generado dispara una notificación a los administradores del CRM (visible en
`/warranty-claims`), igual que un reclamo.

### 4.9 `GET /api/portal/v1/contacts/:contactId/account` — Cuenta corriente

El corazón del **Panel Clientes**. Disponible en nivel `BASIC`.

```json
{
  "summary": {
    "balance": 2480199,
    "totalInvoiced": 7236200,
    "totalPaid": 4756001,
    "overdueAmount": 0,
    "nextDueDate": null
  },
  "entries": [
    { "id": "clz...", "date": "2026-04-24T15:56:01.406Z", "type": "SALE",
      "description": "Compra #11", "debit": 420000, "credit": 0, "balance": 420000, "saleId": "clz..." },
    { "id": "clp...", "date": "2026-05-03T00:00:00.000Z", "type": "PAYMENT",
      "description": "Pago compra #11", "debit": 0, "credit": 420001, "balance": -1, "saleId": "clz..." }
  ],
  "plans": [
    {
      "id": "clx...", "saleId": "clz...", "saleNumber": 43,
      "installmentCount": 6, "frequency": "MONTHLY", "financedTotal": 3136200,
      "status": "ACTIVE",
      "installments": [
        { "id": "cli...", "number": 1, "dueDate": "2026-09-15T00:00:00.000Z",
          "amount": 522700, "paid": 522700, "remaining": 0, "status": "PAID" }
      ],
      "nextDue": { "id": "cli...", "number": 2, "dueDate": "...", "amount": 522700, "paid": 0, "remaining": 522700, "status": "PENDING" },
      "overdueCount": 0
    }
  ]
}
```

**`entries`** son los movimientos ordenados por fecha, con `balance` corrido hasta ese renglón
inclusive. `type` es `"SALE"` (suma deuda), `"PAYMENT"` (la resta) o `"ADJUSTMENT"` (nota de crédito,
devolución, ajuste — puede ir para cualquier lado). `saleId` viene solo si el movimiento corresponde a
una venta, para que puedas linkearlo.

**`balance` puede ser negativo**, y significa **saldo a favor del cliente** (pagó de más o tiene una
nota de crédito). Mostralo como tal, no como deuda cero.

**`plans`** son los planes de cuotas, y es un array porque un Cliente puede tener varias compras
financiadas al mismo tiempo. Solo vienen los que no están cancelados.

- `status` del plan: `"ACTIVE"` (quedan cuotas por pagar), `"COMPLETED"` (está todo pago) o
  `"CANCELLED"`. **`COMPLETED` se calcula**, no lo decide nadie a mano.
- `status` de cada cuota: `"PENDING" | "PARTIAL" | "PAID" | "OVERDUE"`. Una cuota pagada **nunca** es
  `OVERDUE`, aunque su vencimiento ya haya pasado.
- `nextDue` es la primera cuota impaga, o `null` si está todo pago.

**Un plan es opcional.** La mayoría de las compras se cobran al contado o con pagos sueltos sin
cronograma: en ese caso `plans` viene vacío y `entries` igual muestra todo. Que no haya plan no
significa que falte información.

> **Cómo se calcula el saldo:** siempre `ventas − pagos ± ajustes`, ignorando las ventas anuladas.
> **Nunca depende de las cuotas.** Si un plan estuviera mal armado, el saldo sigue siendo correcto.
> Es el mismo cálculo que ve el operador en el CRM, a propósito: si los números no coincidieran, el
> panel dejaría de servir.


---

## 4.10 Mi Taller *(nivel INSTALLER)*

Módulo para que el instalador gestione el trabajo de su propio taller: sus clientes finales, los
vehículos de esos clientes, las órdenes de trabajo, la agenda y lo que le cobra a cada uno. Todo
cuelga de `/api/portal/v1/contacts/:contactId/workshop/`.

**Nada de esto es de Kristall.** Los clientes finales del instalador no son contactos del CRM, y los
cobros que registra acá **no tocan la cuenta corriente de la sección 4.9**: son plata entre el
instalador y su cliente. Son dos libros distintos.

Los 11 endpoints exigen nivel `INSTALLER`, **incluidos los `GET`**. Un `BASIC` recibe `403` en todos.

### Reglas que valen para toda la sección

- **Un id en la URL no autoriza nada.** Cada recurso se busca filtrando además por el `contactId` de
  la sesión. Pedir la OT de otro taller devuelve **`404`, no `403`**: confirmar que algo existe pero
  no es tuyo ya es filtrar información. Lo mismo para clientes finales, vehículos y rollos.
- **`404` significa "no existe o no es tuyo"**, sin distinguir. No intentes deducir cuál de las dos.
- Las referencias cruzadas se validan: no se puede armar una OT con el cliente final de otro taller,
  ni con el vehículo de otro cliente, ni consumir un rollo que no te vendieron.
- Los campos de texto opcionales se mandan como `null`, no como `""`.

### 4.10.1 `GET /workshop/clients` — Clientes finales

Query opcional: `?search=` (busca en nombre, teléfono y email).

```json
[
  {
    "id": "clw...", "name": "Juan del Barrio", "email": "juan@example.com",
    "phone": "099111222", "dni": null, "address": null, "notes": null,
    "createdAt": "2026-09-01T12:00:00.000Z", "updatedAt": "2026-09-01T12:00:00.000Z",
    "_count": { "assets": 2, "workOrders": 5 }
  }
]
```

Máximo 200, ordenados por nombre.

### 4.10.2 `POST /workshop/clients` — Alta de cliente final

**Body:** `{ "name": "Juan del Barrio", "email": null, "phone": "099111222", "dni": null, "address": null, "notes": null }`.
Solo `name` es obligatorio. **Response `201`** con la ficha.

`email` es opcional pero conviene pedirlo: es a donde va a ir el mail de garantía cuando la OT pase a
`TERMINADA`.

### 4.10.3 `GET · PATCH · DELETE /workshop/clients/:clientId` — Ficha del cliente final

El `GET` suma `assets` (todos sus vehículos, **cada uno con su propio
`_count.workOrders`**) y el `_count` del cliente. El conteo por vehículo importa: la ficha del
cliente es donde el instalador mira "¿a este auto ya le hicimos algo?".

El `PATCH` acepta cualquier subconjunto de los campos del alta; mandar `{}` da `400`.

El `DELETE` responde **`409`** si el cliente tiene órdenes de trabajo: el historial del taller no se
tira por un click. Hay que borrar las OT primero, a mano y a conciencia.

### 4.10.4 `GET · POST /workshop/clients/:clientId/assets` — Vehículos del cliente

```json
[
  {
    "id": "cla...", "workshopClientId": "clw...", "type": "VEHICLE",
    "identifier": "AB 123 CD", "brand": "Toyota", "model": "Corolla", "year": 2022,
    "color": null, "notes": null, "createdAt": "2026-09-01T12:00:00.000Z",
    "_count": { "workOrders": 3 }
  }
]
```

`type` es el mismo enum que la cadena de garantías: `VEHICLE | WINDOW | BUILDING | OTHER` (default
`VEHICLE`). Todos los demás campos son opcionales — `identifier` es la patente, el número de unidad o
como el instalador llame a esa superficie, y **no es único**: dos clientes pueden traer la misma
chapa mal tipeada y bloquear eso rompería el alta rápida sin ganar nada.

**No hay `PATCH` ni `DELETE` de vehículos todavía.** Quedó fuera del contrato de esta fase; es una
adición mecánica cuando la pantalla lo necesite.

### 4.10.5 `GET /workshop/orders` — Listado de órdenes

Query opcional: `?status=`, `?from=`, `?to=`, `?clientId=`.

`status` tiene que ser uno de `PRESUPUESTADA | AGENDADA | EN_PROCESO | TERMINADA | ENTREGADA |
CANCELADA`; cualquier otro valor da `400`. `from`/`to` son fechas ISO y filtran por **turno**
(`scheduledAt`), no por fecha de creación — es lo que el instalador tiene en la cabeza cuando
pregunta "qué tengo esta semana". Las OT sin turno quedan afuera de un rango, a propósito.

```json
[
  {
    "id": "clo...", "orderNumber": 47, "status": "AGENDADA",
    "scheduledAt": "2026-09-03T14:00:00.000Z", "startedAt": null, "finishedAt": null,
    "deliveredAt": null, "cancelledAt": null,
    "priceQuoted": "30000", "priceFinal": null, "currency": "ARS",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "workshopClient": { "id": "clw...", "name": "Juan del Barrio", "phone": "099111222" },
    "asset": { "id": "cla...", "type": "VEHICLE", "identifier": "AB 123 CD", "brand": "Toyota", "model": "Corolla" }
  }
]
```

Máximo 300. **`orderNumber` es secuencial por instalador**, no global: el tipo quiere decir "la OT
47", no "la 12844". Dos talleres distintos tienen cada uno su OT 1.

### 4.10.6 `POST /workshop/orders` — Alta de OT

**Body:**
```json
{
  "workshopClientId": "clw...",
  "assetId": "cla...",
  "scheduledAt": "2026-09-03T14:00:00.000Z",
  "priceQuoted": 30000,
  "currency": "ARS",
  "notes": null,
  "items": [
    { "description": "Parabrisas", "productId": "clp...", "rollId": "clr...", "squareMetersUsed": 1.2, "price": 15000 }
  ]
}
```

Solo `workshopClientId` es obligatorio. Detalles que importan:

- **Si mandás `scheduledAt`, la OT nace `AGENDADA`; si no, `PRESUPUESTADA`.** Cargar un turno y
  dejarla en "presupuestada" sería un estado que no significa nada.
- `assetId` es opcional (un presupuesto por teléfono se carga sin patente), pero **pasar a
  `TERMINADA` lo va a exigir**, porque la garantía necesita saber sobre qué se trabajó.
- En `items`, `squareMetersUsed` son metros **cuadrados**. `rollId` tiene que ser un rollo que te
  vendieron; si además mandás `productId`, tiene que ser el mismo producto del rollo, o da `400`.
- Máximo 50 líneas.

**Response `201`** con la ficha completa (formato de 4.10.7).

### 4.10.7 `GET · PATCH /workshop/orders/:orderId` — Ficha de la OT

El `GET` devuelve lo del listado más `notes`, la ficha completa del cliente y del vehículo, y:

```json
{
  "items": [
    { "id": "cli...", "description": "Parabrisas", "squareMetersUsed": "1.2", "price": "15000",
      "product": { "id": "clp...", "name": "KRYPTON 05", "sku": "KR-05" },
      "roll": { "id": "clr...", "fullRollCode": "LOT-20260705-0001-R003" } }
  ],
  "payments": [
    { "id": "clp...", "amount": "20000", "currency": "ARS", "method": "efectivo",
      "reference": null, "notes": null, "paidAt": "2026-09-03T18:00:00.000Z" }
  ],
  "warrantyInstallation": { "id": "cli...", "installationCode": "LOT-...-R003-I1", "status": "ACTIVE", "expiresAt": "2027-09-03T00:00:00.000Z" }
}
```

`warrantyInstallation` es `null` mientras la OT no haya generado garantía. **No incluye el
`activationToken`**: para mandarle el link al cliente final está el flujo de garantías, que tiene su
propio control.

El `PATCH` acepta cualquier subconjunto de los campos del alta más `priceFinal`. Dos cosas:

- **`status` no se puede mandar por acá — da `400`.** El estado se cambia con 4.10.8, porque entrar
  en `TERMINADA` dispara efectos que tienen que ser transaccionales; un PATCH que pisa la columna los
  saltearía.
- Si mandás `items`, **reemplazan a todas las líneas anteriores**, no se hace merge por id. Es lo que
  espera una pantalla donde el instalador agrega y saca renglones antes de guardar.

Una OT `ENTREGADA` o `CANCELADA` ya no se edita: `409`.

### 4.10.8 `POST /workshop/orders/:orderId/transition` — Cambiar de estado

**Body:** `{ "to": "TERMINADA", "priceFinal": 28000 }`. `priceFinal` es opcional y sirve para cerrar
el precio en el mismo movimiento.

```
PRESUPUESTADA ⇄ AGENDADA ⇄ EN_PROCESO ──► TERMINADA ──► ENTREGADA
      └──────────────┴────────────┴────────► CANCELADA
```

**La regla en una línea: antes de `TERMINADA` se puede ir y venir libremente; después, es de una sola
dirección.**

- Ir y venir entre `PRESUPUESTADA`, `AGENDADA` y `EN_PROCESO` está permitido, y también saltear hacia
  adelante (el que entra sin turno va directo a `EN_PROCESO`). Ninguno de esos estados tiene efectos,
  así que deshacer un botón mal apretado no rompe nada — y eso pasa todo el tiempo en un teléfono al
  lado de un auto.
- **De `TERMINADA` no se vuelve.** Ahí se descuenta material y se genera la garantía. Deshacer eso no
  es "volver al estado anterior", es una reversión (devolver m², anular una instalación que quizás el
  cliente final ya activó) y necesita su propia operación pensada.
- **Una OT `TERMINADA` tampoco se cancela**: cancelar es "esto no pasó", y una vez terminada, pasó.
- `ENTREGADA` y `CANCELADA` son terminales.

Errores: `409` si la transición no está permitida o si la OT ya está en ese estado; `400` si querés
terminar una OT sin vehículo cargado (`"Cargá el vehículo antes de terminar la orden"`).

**Los timestamps se sellan la primera vez que se entra a cada estado y no se pisan después**:
`startedAt`, `finishedAt`, `deliveredAt`, `cancelledAt` son el registro de cuándo pasó cada cosa, no
un espejo del estado actual. Si alguien vuelve atrás y avanza de nuevo, `startedAt` sigue marcando
cuándo se empezó de verdad.

> **Estado de la integración con garantías.** Hoy la transición valida el cambio y sella la fecha,
> pero **todavía no descuenta material ni genera la `WarrantyInstallation` ni manda el mail**: eso es
> la Fase 4 del plan. Cuando esté, el `TERMINADA` va a hacer las tres cosas en una transacción, y el
> mail se manda **después** del commit — si falla el envío se reintenta, no revierte la OT.

### 4.10.9 `POST /workshop/orders/:orderId/payments` — Registrar un cobro

**Body:** `{ "amount": 20000, "currency": "ARS", "method": "efectivo", "reference": null, "notes": null, "paidAt": "..." }`.
Solo `amount` es obligatorio y tiene que ser positivo; `currency` hereda la de la OT y `paidAt` el
momento actual.

**Response `201`:** `{ "id": "clp...", "amount": "20000", "currency": "ARS", "method": "efectivo", "paidAt": "..." }`.

`409` si la OT está cancelada.

**Recordá: esto no entra en la cuenta corriente de la sección 4.9.** Es lo que el cliente final le
pagó al instalador, no lo que el instalador le debe a Kristall.

### 4.10.10 `GET /workshop/agenda?from=&to=` — Calendario

`from` y `to` son **obligatorios**, en ISO, y el rango no puede superar **120 días** (`400` en los
tres casos: si falta alguno, si `to` es anterior a `from`, o si el rango es más largo).

```json
[
  {
    "id": "clo...", "orderNumber": 47, "status": "AGENDADA",
    "scheduledAt": "2026-09-03T14:00:00.000Z",
    "workshopClient": { "id": "clw...", "name": "Juan del Barrio", "phone": "099111222" },
    "asset": { "type": "VEHICLE", "identifier": "AB 123 CD", "brand": "Toyota", "model": "Corolla" }
  }
]
```

**Las canceladas no aparecen**: un turno cancelado libera la franja, que es el punto de cancelarlo.

### 4.10.11 `GET /workshop/stock` — Stock con m² restantes

Los mismos rollos de la sección 4.2, más cuánto queda adentro de cada uno:

```json
[
  {
    "id": "clr...", "fullRollCode": "LOT-20260705-0001-R003", "status": "SOLD",
    "lot": { "lotNumber": "LOT-20260705-0001" },
    "product": { "id": "clp...", "name": "KRYPTON 05", "sku": "KR-05", "category": "AUTOMOTIVE",
                 "width": "1.52", "length": "30", "warrantyConfig": { "maxInstallations": 15 } },
    "installations": [ { "id": "cli...", "installationCode": "LOT-...-R003-I1", "status": "PENDING", "activatedAt": null, "expiresAt": null } ],
    "_count": { "installations": 0 },
    "totalM2": 45.6, "usedM2": 12.5, "remainingM2": 33.1
  }
]
```

- **El sobrante se deriva, no se guarda**: `width × length − Σ(squareMetersUsed)` de las líneas que
  declararon ese rollo. No hay dos números que puedan discrepar.
- **Las OT canceladas no cuentan**: una OT cancelada no gastó material, y cancelarla devuelve los m²
  al rollo.
- **`totalM2` y `remainingM2` pueden ser `null`**, cuando el producto no tiene `width` y `length`
  cargados. Es `null` y no `0` a propósito: "no sé cuánto queda" y "no queda nada" son cosas
  distintas, y mostrar `0` haría creer que el rollo está vacío. `usedM2` siempre es un número.

Es un endpoint aparte y no una extensión de 4.2 a propósito: aquel contrato ya está publicado y
consumido, y agregarle campos de un módulo que recién arranca lo ataría a este.

### 4.10.12 `GET /workshop/summary` — Números del dashboard

`?from=` y `?to=` acotan el período que se mide; sin ellos se toma **el mes corriente**.

```json
{
  "hoy": { "turnos": 3, "enProceso": 1 },
  "ordenes": { "PRESUPUESTADA": 4, "AGENDADA": 3, "EN_PROCESO": 1, "TERMINADA": 2, "ENTREGADA": 37, "CANCELADA": 2 },
  "periodo": {
    "desde": "2026-09-01T00:00:00.000Z", "hasta": "2026-09-30T23:59:59.999Z",
    "terminadas": 12, "facturado": 340000, "cobrado": 280000, "porCobrar": 60000,
    "metrosCuadrados": 48.5
  }
}
```

`hoy` y `ordenes` son siempre del momento, no del período.

**`facturado`, `cobrado` y `porCobrar` son sobre el mismo conjunto de órdenes**: las que se
terminaron dentro del período. `cobrado` no es "cuánta plata entró este mes" sino "cuánto se cobró
contra los trabajos que terminaste este mes" —incluidas las señas tomadas antes de terminarlos— y
`porCobrar` es la resta: de lo que hiciste este mes, cuánto falta cobrar.

> Esto se corrigió en septiembre 2026, y vale la pena saber por qué. Antes `cobrado` sumaba **todos**
> los cobros con fecha en el período, vinieran de la orden que vinieran. Con eso, una seña sobre un
> trabajo que todavía no terminó entraba en `cobrado` sin que su orden entrara en `facturado`, y
> `porCobrar` daba **negativo**. Un "por cobrar" negativo no significa nada para nadie. Para que la
> resta tenga sentido, los dos números tienen que ser sobre el mismo conjunto.

`porCobrar` no es la deuda histórica del taller: para eso habría que sumar desde el principio.

Es un solo endpoint en vez de que el panel pida seis cosas: es la primera pantalla que abre el
instalador a la mañana, muchas veces con mala señal.

---

## 5. Errores comunes a todos los endpoints

| Código | Cuándo |
|---|---|
| `401` | Falta `x-api-key`, es inválida, o fue revocada. |
| `403` | La cuenta del portal está deshabilitada (`enabled: false`), el contacto no tiene cuenta, o la cuenta es `BASIC` y el endpoint pide nivel `INSTALLER` (ver sección 0). |
| `404` | El `contactId` no existe, o existe pero no es de tipo `CLIENT`. |
| `429` | Se superó el límite de 300 requests/minuto para tu key (o el límite de intentos de login, alta o recuperación). |
| `500` | Error interno del CRM — reintentar más tarde. |

**Sobre el `403` por cuenta deshabilitada** (septiembre 2026) — `enabled: false` es el kill switch del
admin y corta **todo** el portal, no solo el nivel de instalador: desde este cambio, también los
endpoints de nivel `BASIC` (perfil, cuenta corriente y notificaciones) responden `403`. Antes solo lo
verificaban los endpoints de instalador, así que bajar el switch no cerraba la sesión básica hasta que
venciera del lado de kristall-web. Si tu backend cachea la sesión, tratá este `403` como
"cerrar sesión y volver a pedir login", no como un error transitorio.

---

## 6. Nota: esto no es lo mismo que la activación de garantía del Usuario

Este documento es sobre el **Cliente** (instalador/distribuidor, panel logueado). La página donde el
**Usuario** (dueño del vehículo) activa la garantía individual de su rollo — sin cuenta, con un link/token
que se le entrega en el momento de la venta — es un flujo completamente distinto, documentado en
`WARRANTY_API.md`. Ese mismo documento también cubre la cuenta simple opcional del Usuario
(`installationCode` + contraseña) para que no tenga que guardar el token largo.
