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
| `INSTALLER` | **Portal Instalador** | Todo lo anterior **más** stock de rollos, instalaciones, reclamos y generación de sub-códigos |

- **`BASIC` es el default.** Cualquier Cliente que active su cuenta (sección 3.1) lo obtiene solo, sin
  intervención de nadie.
- **`INSTALLER` lo habilita a mano un operador** desde la ficha del contacto en el CRM. No hay forma de
  pedirlo por API.

**El CRM verifica el nivel de su lado.** Los endpoints marcados como *(nivel INSTALLER)* devuelven
`403 { "error": "Este cliente no tiene habilitado el portal de instalador" }` si la cuenta es `BASIC`,
está deshabilitada, o el contacto no tiene cuenta de portal. No alcanza con esconder los botones en tu
frontend — llamar igual devuelve 403.

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

---

## 3. Login del Cliente

```
POST /api/portal/v1/auth/login
```
Body: `{ "email": "juan@example.com", "password": "..." }`.

- **200** `{ "contactId": "cly...", "name": "Juan Pérez", "company": "Vidriería Sur", "accessLevel": "BASIC" }`
  — credenciales correctas. Guardá `contactId` **y `accessLevel`** en tu propia sesión para ese usuario;
  no hace falta volver a llamar a este endpoint hasta que la sesión expire de tu lado. Con `accessLevel`
  armás el menú (ver sección 0); el CRM igual lo revalida en cada endpoint de instalador.
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
- **409** — hay más de una ficha de Cliente con ese email; hay que resolverlo con Kristall a mano.
- **429** — máximo 3 pedidos cada 15 min por email.
- **503** — el servidor de mail no está configurado.

> **Nota de seguridad:** a diferencia del resto de la API, este endpoint **confirma si un email
> pertenece a un cliente de Kristall**. Es deliberado: el flujo pedido muestra "encontramos tu cuenta"
> en pantalla. El límite de 3 intentos cada 15 minutos es lo que impide barrer una lista de emails.

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
- `400 { "error": "Esta garantía no está activa" }` — la instalación está `PENDING`, `EXPIRED` o `VOIDED`.
- `400` con detalle de zod si falta algún campo requerido o el email es inválido.

El reclamo queda con `channel: "CLIENT_PORTAL_API"` y dispara una notificación a los administradores
del CRM (visible en `/warranty-claims`), igual que cualquier otro reclamo.

### 4.6 `GET /api/portal/v1/contacts/:contactId/notifications` — Notificaciones del Cliente

Devuelve las notificaciones no leídas más las de las últimas 24 h (igual que el panel interno de
notificaciones del CRM).

```json
[
  { "id": "cln...", "type": "NEW_PURCHASE", "title": "Nueva compra registrada", "message": "Se registró tu compra #1042 por un total de $150000.", "read": false, "createdAt": "2026-07-09T00:00:00.000Z" },
  { "id": "clm...", "type": "WARRANTY_ACTIVATED", "title": "Garantía activada", "message": "Juan Pérez activó la garantía LOT-...-R003-I1.", "read": true, "createdAt": "2026-07-08T00:00:00.000Z" }
]
```

`type` es `"NEW_PURCHASE"` (se creó una venta suya, con rollos ya asignados automáticamente) o
`"WARRANTY_ACTIVATED"` (un Usuario activó la garantía de uno de sus rollos). Se generan
automáticamente — no hay forma de crearlas manualmente vía API.

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
