const socketClient = io();

const user = document.getElementById("user");
const formulario = document.getElementById("formulario");
const inputMessage = document.getElementById("message");
const divChat = document.getElementById("chat");

let usuario;

Swal.fire({
  title: "BIENVENIDO",
  text: "Ingresa tu correo electronico",
  input: "text",
  inputValidator: (value) => {
    if (!value) {
      return "Necesitas ingresar tu correo";
    }
  },
}).then((correoDelUsuario) => {
  usuario = correoDelUsuario.value;
  user.innerText = `Hola ${usuario}`;
  socketClient.emit("usuarioNuevo", usuario);
});

formulario.onsubmit = (e) => {
  e.preventDefault();
  const infoMensaje = {
    correoDelUsuario: usuario,
    message: inputMessage.value,
  };
  socketClient.emit("mensaje", infoMensaje);
  inputMessage.value = "";
};

socketClient.on("chat", (message) => {
  const chat = message
    .map((objMessage) => {
      return `<p>${objMessage.correoDelUsuario}: ${objMessage.message}</p>`;
    })
    .join(" ");
  divChat.innerHTML = chat;
});

socketClient.on("broadcast", (usuario) => {
  Toastify({
    text: `${usuario} se ha conectado`,
    duration: 5000,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
});
