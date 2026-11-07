<!--
Plantilla del PR de develop a main: la entrega del cierre de sprint (D-39).
No es la de una historia: esa es .github/pull_request_template.md y se usa por defecto.
Para abrir este PR con esta plantilla: https://github.com/joseviudes/aca-nomas-app/compare/main...develop?template=entrega.md
Título: `chore: entrega del sprint N`. Se mergea con "Create a merge commit", nunca con squash.
-->

## Entrega del sprint N
<!-- Una o dos frases: qué se entrega y en qué estado queda la app. -->

## Qué incluye
<!-- Una fila por historia mergeada a develop en el sprint, con el enlace a su tarjeta. -->
| Historia | Qué es | Estado |
|---|---|---|
| US-xx | | Entregada |

## Qué pasa a `main`
<!-- Lo que cambia para quien use la app o trabaje en el repo: código, CI, documentación. -->
-

## Cómo probarlo
<!-- Qué mostró la demo y cómo repetirlo: pasos, pantallas, endpoints en Swagger. -->
1.

## Antes de mergear
- [ ] La demo del sprint se hizo y el equipo está de acuerdo con lo que se entrega
- [ ] Las historias de la tabla están en "Hecho" en Trello
- [ ] La CI está en verde (no es obligatoria: se mira a mano en *Checks*)
- [ ] No hay PR de historias abiertos que deban entrar en esta entrega
- [ ] Ninguna pantalla usa datos de ejemplo: todas están conectadas a la API (D-40)
- [ ] No hay secretos ni datos reales
- [ ] Se mergea con **merge commit**, nunca con *squash* ni *rebase*

## Después de mergear
- [ ] Pasar a "Hecho" las tarjetas que falten
- [ ] Si `main` recibió algún arreglo urgente (`hotfix/`), confirmar que ya esté en `develop`
- [ ] Armar el sprint siguiente en el planning
