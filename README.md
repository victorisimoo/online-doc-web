# Doctor Online 3.0

Nuestra misión es de mejorar la vida y salud de nuestros usuarios por medio de la telemedicina, empleando la mejor tecnología con los más altos estándares de calidad, control, seguridad y ética empresarial.

Para cumplir nuestra misión, el equipo de desarrollo realiza constantemente mejoras al servicio, entre las más destacadas tenemos las siguientes:

## **Versión 3.2.0**
08/Feb/2019

**Mejoras UI/UX**

 - Rediseño de videollamadas de Doctores.
 - Mejoras en resolución de Videollamada usando QB.
 - Se agrega opción en confirmación de consulta para saber si es una prueba o es paciente real.
 
 
**Bug Fixes**
- Envio de correo para aseguradoras cuando son de prueba o no generan prescripciones las consultas.
- Se corrige redireccionamiento a pagina home de doctor-online.co cuando se pulsa el boton cerrar sesión en sitio de paciente.

## **Versión 3.1.0**
23/Jan/2019

**Custom Fields Dr. ADISA**

 - Se agregan campos customizados para Dr.ADISA
 - Se modifica template de email para Dr. Adisa

## **Versión 3.0.0**
21/Jan/2019

**Adding Corporation**

 - Se agrega corporación Dr. Adisa.
 - Se agrega coporación Doctor INS.

**Platform Stabilization**
 - Se agregaron manejo de listeners para sincronizar tiempos y mensajes entre paciente y doctor.
 - Se limita a una consulta por perfil, para evitar problemas de sincronización entre sesiones.
 - Se agrega versión 1.0 de Zoom Integration para ambiente Web y Android
 - Se rediseño el ambiente Web para pacientes y doctores.
 - Se agregaron mejoras en sitio Web Móvil.
 - Se agregan controles de sesiones de Doctores en horarios disponibles por Aseguradora.
 - Se agregan controles de trazabilidad por consulta.
 - Se agrega funcionalidad de reporte de errores / comentarios en consultas para doctores y pacientes.
 - Se agrega mensaje de plataforma no disponible en horarios fuera de servicio.
 - Se agrega funcionalidad de contactar a pacientes vía Email cuando no estén doctores disponibles.
 - Se agrega confirmación de cierre de ventana cuando paciente está en consulta.
 - Se agrega tiempo adicional a los doctores para completar apuntes en consulta médica.
 - Se aumentó el tamaño de campo recomendación.
 - En listado de citas de paciente se muestran solo las citas que fueron exitosas
 - Se muestra en historial de citas de paciente, los diagnósticos de consultas previas.
 - Cuando paciente cambia su correo electrónico, se le envía el último resumen de consulta médica sin copia a corporación.
 
**Callback**
 - Se notifican a los pacientes cuando están en cola para ser atendidos.
 - Se envía notificación  a pacientes cuando la cita ha fallado.
 
**Queue Management**
 - Se agregan prioridad de citas, para consultas de reintentos.
 - Se filtran citas por corporación y por doctor.
 - Se mejoró el calculo de tiempo de grupos de chats.
 - Se mejoró el calculo de tiempo para videollamadas.
 
**Bug Fix**
 - Se corrige problema de conexión en múltiples Chats de QB
 - Se corrige problema de paciente en cola de espera, cuando ya no estaba en cola de atención.
 - Se corrige problema de envío de fotografía en Web Movil.
 - Se corrige problema de sesión en chats cuando paciente ingresa antes que Doctor a una consulta.
 - 

===============================================================

## Version 2.5.0

 - Se agrega corporación "Seguros El Roble"

***Version 2.4.0**
1.) Callback primera fase.

***Version 2.3.0**
1.) Mejoras en videollamada WebApp
2.) Mejoras en video responsive.
3.) Mejoras en manejo de cola.

***Version 2.2.2**
1.) Corrección de videollamadas con Android App.
2.) Mejoras en issues de manejo de cola.
3.) Alertas en Sitio de Doctor con pacientes en espera.
4.) Reindexar cola de pacientes cuando paciente sale de cola de forma voluntaria.

***Version 2.2.1**
1.) Resolución de Issues de Internacionalización.
2.) Mejoras en issues de manejo de cola.

***Version 2.2.**
1.) Internacionalización de WebApp.
2.) Mejoras visuales en chat y video por internacionalización.


**Version 2.1.**
1.) Rediseño responsive de chat de paciente.
2.) Resolución de issues visuales (Doctor y Paciente WebApp)
3.) Home de doctor se hizo responsive.
4.) Las barras de desplazamiento se han hecho responsive.

**Version 2.0**
1.) Se cambio versión de QB 3.18.04.1, esta versión incluye mejora y estabilización de uso de Videollamada y Chat.  Esta versión estaba instalada desde Septiembre 2016.
2.) Se corrigieron issues por incompatibilidad en RestAPI creación de usuarios nuevos desde plataforma Doctor Online hacia QB.

**Version 1.7.0**
1.) Corrección de issues criticos en control de estado de chat y video.
2.) Corrección de información de doctor cuando paciente ingresa por primera vez a plataforma.
3.) Reintento de consulta de paciente.  En caso de error se realiza reintento de consulta para video y chat.

**Versión 1.6.0**
1.) Hacer 100% responsive el chat y probarlo en la versión movil.  Tener un nuevo diseño, para que lo podamos mostrar como opcion, incluye rediseñar los elementos de la página.
3.) Customizar mensaje de periodo de atención, si está fuera del periodo, poner Warning en Login (3) y customizar mensaje de espera por corporación (4).
	El periodo de atención para MAPFRE es de 08:00(1) AM | 08:00(2) pm. - la plataforma no esta en horario de atención.
	Tomar en cuenta el intervalo de la diferencia horaria.
4.) Si un doctor no está atendiendo en un periodo determinado, mostrar mensaje customizado por corporación 
	-Esto es en horario de atención.
	-Mostrar un mensaje por corporación: "Nuestro doctor se encuentra atendido una emergencia.  Por favor intenta en 15 minutos. (5)"
5.) Libreria para manejo de temas de ayuda en pagina de login y paginas dentro del WebSite para paciente.
6.) Se agrega la corporación Dr.Tigo

**Versión 1.5.1**
1.) Se agrega FavIcon y TabName a página de login según corporación.
2.) Se aplican bordes a botones de chat y video de cambio de correo. Tambien se aplican
		este esquema para la sección de información de doctor, ver perfil completo de doctor.
3.) Boton de enviar de chat con el estilo de corporación.
4.) Se cambio el background del chat según el color de corporación.
5.) En el popup de cambio de correo, agregar a la caja de texto, botones, color de corporación.
6.) El boton finalizar chat, aplicar un borde más pronunciado, estaba muy cuadrado.
7.) Los popus de finalizar chat y video, se aplica color de corporación.
8.) En videollamada, el nombre del Doctor, agregarle prefijo Dr. o Dra. según el caso.

**Versión 1.5.0**
1.) Se customizó el FavIcon por corporación.
2.) Se customizó el TabName (WebSite name), se coloca el Application Name (Plattform Name)
3.) En la videollamada para Doctor  y Paciente, aparecen tres botones de acciones (Habilitar / Inhabilitar Micrófono, Habilitar e Inhabilitar Cámara y Record).  Se quitó el boton de Record.
4.) Se mejoró el diseño de Videollamada y Chat, se agrega nuevamente el header de corporación sin acciones para que no se salga del servicio de atención.
5.) En la Videollamada para Doctor y Paciente, se quito la SubPantalla de participantes, y se agrando un poco el área principal de videollamada.  
	Adicionalmente, en la parte de abajo del cuadro de vídeo se colocó el nombre del paciente en resaltado y corporación, ya que se tuvo un poco de espacio adicional.
6.) Se habilito un feature para doctores, para saber si el doctor está atendiendo citas, actualmente no se sabe si un doctor o varios doctores están conectados.  Para esto se hizo un
	endpoint con filtro por rango de fecha para saber la actividad del doctor.
7.) Se agrego Background por corporación para personalizar el WebSite de paciente.
8.) En la página de Perfil completo de Doctor, se agrego el logo de corporación en vez de logo de Doctor Online.

**Versión 1.4.0**
Release Date: 2018-07-26 10:00 GT
1. Replicar el comportamiento de cambio de tecla Tab al chat (ahorita solo funciona en Videollamada)
2. El issue de cancelar buscar citas en sitio de Doctor, la acción de cancelar no hace nada y se queda buscando Chats, la idea es hacer un redirect nuevamente al buscar citas para que busque Videollamada o Chat indistintamente.  (Este issue se había corregido, pero se debe probar tanto en Chat y Videollamada)
3. Mejoras en PDF (Esta mejora ya está en QA, pero estaba programada para esta semana)
4. Revisar el manejo de estados, ya que actualmente solo se manejan 4 estados en una llamada completa.  Además se deben aprovechar todos los eventos de Quickblox para registrar los estados de una llamada o chat.  Se debe presentar este análisis también por escrito, dado que se van a replicar en las aplicaciones iOS y Android.
5. Promocionar las aplicaciones iOS y Android en los sitios de aseguradora.  Deben ser parametrizables por corporación para hacer el respectivo Redirect según el móvil que estén usando.
6. En la pagina de Login, hay una validación que verifica si está ingresando desde Internet Explorer. Necesitamos parametrizar el mensaje de Applicacation Name por cada plataforma.
7. Agregar una validación en Login, si es browser móvil, se muestra el mensaje considerando que la experiencia es mejor en la aplicación, y que haga referencia a las descargas de las aplicaciones nativas para mejorar la experiencia de uso.
8. Replicar la advertencia de recurso de cámara y micrófono en Website de paciente, para los casos que no este disponible la cámara y micrófono disponibles.
9. Realizar el enmascaramiento de URL para no mostrar toda la ruta en el navegador, especialmente cuando se establecen citas de pacientes.

**Versión 1.3.0**
Release Date: 2018-07-23 11:30 GT
 1. Mejora en guardar datos del doctor, además de agregar controles de cambio de tab.
 2. Mejora en maquetado de plantillas y envio de pdf.
 3. Mejora de espacio de búsqueda de citas de paciente.
