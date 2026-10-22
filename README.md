# Carta Natal Tradicional

Aplicación de astrología clásica que calcula la carta natal, aspectos, partes árabes, términos, decanatos, tránsitos, revoluciones solares y prospectiva. Funciona en local, con Swiss Ephemeris en WebAssembly; no envía los datos de nacimiento a ningún servidor.



## Ecosistema

Carta Natal Tradicional forma parte de un conjunto de proyectos dedicados a la astrología clásica y a la espiritualidad de la naturaleza:

| Proyecto | Qué es | Enlace |
|---|---|---|
| **Arquetypo** | Astrología clásica y tradición | <https://arquetypo.uno/> |
| **Red Espiritual** | Comunidad hispana de espiritualidad de la naturaleza | <https://redespiritual.net/> |
| **Wicca School** | Formación online | <https://wicca.school/> |
| **Carta Natal Tradicional** | Esta aplicación (AGPL-3.0) | [GitHub](https://github.com/NetNatur/carta-natal) |
| **Núcleo** | Laboratorio de técnicas astrológicas (acceso por invitación) | — |

## Enfoque

«Carta Natal Tradicional» no es un servicio genérico de carta natal. Trabaja con el método clásico: términos, decanatos, partes árabes, firdaria, revoluciones solares y lunares, tránsitos y prospectiva, con Swiss Ephemeris y efemérides JPL. El cálculo ocurre en el equipo del usuario.

## Licencia

Este proyecto se distribuye bajo **GNU Affero General Public License v3.0 (AGPL-3.0)**. El texto completo está en [`LICENSE`](LICENSE).

La AGPL es una licencia de código abierto con copyleft fuerte: si distribuyes la aplicación o la ofreces como servicio en red, debes permitir que quien la use obtenga el código fuente completo bajo la misma licencia.

Swiss Ephemeris se usa bajo su licencia AGPL. Si en el futuro se quiere distribuir una versión con código cerrado, habrá que adquirir la licencia comercial de Astrodienst.

## Requisitos

- **Node.js 18 o superior**.
- Un navegador moderno (Edge, Chrome, Firefox).
- Las **efemérides Swiss Ephemeris** (`.se1`) en `datos/ephe/`. No se incluyen en el repositorio por tamaño; se descargan aparte.

## Ejecución

En Windows:

```text
iniciar carta natal.bat
```

O manualmente:

```powershell
node server.js
```

y abrir <http://localhost:8765>.

El servidor solo sirve archivos locales; no hay backend ni base de datos.

## Estructura

| Ruta | Contenido |
|---|---|
| `index.html` | Interfaz principal. |
| `css/` | Estilos. |
| `js/` | Motor de cálculo, gráficos, interpretación, prospectiva y módulos. |
| `js/vendor/` | Swiss Ephemeris en WebAssembly. |
| `datos/` | Ciudades, corpus de interpretación y efemérides. |
| `test-*.mjs` | Pruebas de cálculo y de integración. |

## Efemérides

Los archivos `.se1` no están en el repositorio. Copia tu carpeta `datos/ephe/` o descarga las efemérides de Swiss Ephemeris y colócalas ahí. Sin ellas, el motor no puede calcular posiciones.

## Corpus de interpretación

Los textos de interpretación (`datos/recetario.json`, `datos/frases-*.txt`) son contenido original. Si se quiere mantener una parte reservada (por ejemplo, las interpretaciones completas frente a una versión de demostración), conviene separarlos del repositorio público y servirlos como contenido aparte.

## Pruebas

```powershell
node test-calculo.mjs
node test-terminos.mjs
node test-transitos.mjs
node test-revolucion-solar.mjs
```

## Aviso

Las interpretaciones de salud son orientativas y **no sustituyen el consejo médico**. La aplicación no diagnostica ni prescribe.

## Contribuir

Las contribuciones son bienvenidas bajo los términos de la AGPL-3.0. Abre una incidencia o un *pull request* describiendo el cambio y las pruebas que lo acompañan.
