# Patterns detectados en EasyBroker/Pincali

Hallazgos de exploración real del producto (mayo 2026).

---

## 1. Onboarding frío: un solo email de bienvenida

Al registrarse en EasyBroker, el usuario recibe **un único email de bienvenida** genérico. No hay secuencia de activación, no hay triggers por comportamiento (subió su primer listing, recibió su primer lead, lleva 3 días sin entrar). El onboarding no guía al usuario hacia el momento "ajá" — publicar un listing de calidad y recibir un lead real.

**Implicación:** Los usuarios que no descubren valor solos en los primeros días, nunca convierten a paid.

## 2. Paywall prematuro sin demostrar valor

El paywall aparece antes de que el usuario haya experimentado el beneficio core: recibir un lead. Se pide upgrade sin haber entregado prueba de que el sistema funciona. Es como pedir matrimonio en la primera cita.

**Implicación:** El funnel free→paid depende de que el usuario *imagine* el valor en vez de *experimentarlo*. Esto limita la conversión a quienes ya tienen contexto previo del mercado inmobiliario digital.

## 3. Pincali invisible en búsqueda orgánica

Para keywords de alta intención como "departamentos condesa renta", Pincali **no aparece en resultados orgánicos** — aparece en paid (Google Ads). Esto significa que cada lead que genera Pincali tiene un costo de adquisición asociado, en vez de ser un canal orgánico que escala sin costo marginal.

**Implicación:** Sin SEO, Pincali no puede ser el flywheel de leads gratuitos que justifique upgrades de tier orgánicamente. La calidad del inventario (contenido indexable, descripciones únicas, datos estructurados) es requisito para posicionar.

## 4. Moderación humana con SLA de 48h

EasyBroker tiene un equipo humano que modera anuncios uno por uno cuando incumplen políticas. SLA: respuesta en menos de 48 horas hábiles. Los motivos automatizables son: precio incorrecto, descripción con datos incorrectos, ubicación incorrecta, no es inmueble real, duplicado, no clasificado como remate.

**Implicación:** Listing Quality Sync NO es "una idea bonita de growth" — es un **reemplazo automatizado** de un proceso operativo manual que ya tienen funcionando hoy. El valor es reducir ese SLA de 48h a tiempo real y escalar la moderación sin agregar headcount.

## 5. API pública con staging accesible

EasyBroker publica su API con un ambiente de staging que incluye API key pública en su documentación (`l7u502p8v46ba3ppgvj5y2aad50lb9`). Base URL: `https://api.stagingeb.com`. Rate limit: 20 req/seg. El staging tiene 1,437 propiedades de prueba con datos reales.

**Implicación:** Podemos construir un demo funcional contra datos reales, no sintéticos. El prototipo se conecta directamente al producto existente, lo cual lo hace inmediatamente demostrable al equipo técnico de EasyBroker.

## 6. 7 políticas oficiales de publicación

EasyBroker documenta 7 políticas que su equipo de moderación valida manualmente:
1. No duplicados
2. Inmuebles disponibles
3. No fraudulentos/engañosos
4. Imágenes que promueven el inmueble
5. Precio y ubicación reales
6. Características coincidentes
7. Remates bancarios clasificados

De estas, **5 son automatizables** con el scorer (1, 2, 4, 5, 6). Las 2 restantes (fraude, remates) requieren validación humana.

**Implicación:** El scorer se alinea directamente a la operación existente. No estamos inventando criterios — estamos automatizando los criterios que ya usan.

---

## Conexión con Listing Quality Sync

Estos tres patterns convergen en una misma palanca: **la calidad del listing determina todo el funnel downstream**. Un listing bien hecho activa leads (pattern 2), genera contenido indexable (pattern 3), y da razones concretas para guiar al usuario en onboarding (pattern 1).

Los hallazgos 4-6 refuerzan que esta palanca ya existe como operación manual dentro de EasyBroker. El proyecto no propone algo nuevo — propone hacer más rápido y escalable algo que ya hacen.
