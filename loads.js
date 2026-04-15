// loads.js

// Hacer disponible el array en window para script.js
window.guests = [
  { id: "1", name: "Anabella & Leandro", passes: 2 },
  { id: "2", name: "Macarena & Rogelio",   passes: 2 },
  // … resto de invitados
];

document.addEventListener("DOMContentLoaded", () => {
  const params  = new URLSearchParams(window.location.search);
  const guestId = params.get("id");
  const guest   = window.guests.find(g => g.id === guestId);

  if (guest) {
    const invitText = guest.passes > 1
      ? `¡${guest.name}, están invitados!`
      : `¡${guest.name}, estás invitado!`;

    document.getElementById("nombreInvitado").textContent   = invitText;
    document.getElementById("cantidadPases").textContent   =
      `${guest.passes} ${guest.passes === 1 ? "pase" : "pases"}`;

    // Abrir invitación automáticamente
    if (typeof abrirInvitacion === "function") abrirInvitacion();
  } else {
    // Si no existe el invitado, ocultar la invitación completa
    const invitacion = document.getElementById("invitacion");
    if (invitacion) invitacion.style.display = "none";
  }
});


  