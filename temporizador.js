const btnInicio = document.getElementById("inicio");
const btnPause = document.getElementById("pause");
const btnReset = document.getElementById("reset");

let animarBody = document.querySelector("body");

let salidaRondas = document.getElementById("restantes");
let salidaTiempo = document.getElementById("tiempo");
let salidaTurno = document.getElementById("actividad");
let cajaSalida = document.getElementById("output");
let cajaEntrada = document.getElementById("input")

let entradaRondas = document.getElementById("rondas");
let entradaTiempoEjercicio = document.getElementById("ejercicio");
let entradaTiempoDescanso = document.getElementById("descanso");

// Variables por defecto 
let rondas = 0;
let tiempoEjercicio = 0;
let tiempoDescanso = 0;
let pausado = false;

// listeners de botones
btnInicio.addEventListener("click", inicio);
// btnPause.addEventListener("click", pause);
btnReset.addEventListener("click", reset);


// Carga de LocalStorage
if (typeof (Storage) !== "undefined") {
    // LocalStorage disponible
    cargarLocalStorage();
    actualizarInput();
} else {
    console.log('LocalStorage no soportado en este navegador');
}


// todo: sacar ronda, rondas, actividad, t, de la función timer para poder usarlas globalmente también en play/pause/reset



async function inicio() {
    obtenerParametros();
    guardarLocalStorage(rondas, tiempoEjercicio, tiempoDescanso);
    if (pausado) reiniciaVista();
    pausado = false;

    cambiaBotones();

    cambiaVista();

    const cuentaAtras = 3;

    cajaSalida.classList.toggle("text-bg-info");
    await timer(cuentaAtras, undefined, 0, rondas);
    cajaSalida.classList.toggle("text-bg-info");


    for (let ronda = 1; ronda <= rondas; ronda++) {

        let esEjercicio = true;
        cajaSalida.classList.toggle("text-bg-warning");
        await timer(tiempoEjercicio, esEjercicio, ronda, rondas);
        cajaSalida.classList.toggle("text-bg-warning");

        esEjercicio = false;
        cajaSalida.classList.toggle("text-bg-secondary");
        await timer(tiempoDescanso, esEjercicio, ronda, rondas);
        cajaSalida.classList.toggle("text-bg-secondary");

    }

    console.log('Fin');
    setTimeout(() => {
        cambiaVista();
        cambiaBotones();
    }, 500);

}

// function pause() {
//     console.log('pause');
//     cambiaInicioPausa();
//     reiniciaVista()
//     pausado = true;
// }

function reset() {
    // console.log('reset');
    pausado = true;
    cargarLocalStorage();
    actualizarInput();
    cambiaBotones();
    reiniciaVista();
}


async function timer(tiempo, turno, ronda, rondas) {

    // ronda === rondas ? ultimaRonda = true : ultimaRonda = false;
    const tiempoRestante = await new Promise((res) => {
        let t = tiempo;
        let actividad;

        if (ronda === 0) {
            actividad = 'Prepárate';
        } else {
            if (turno) {
                actividad = 'Ejercicio'
            } else {
                actividad = 'Descanso'
            }
        }

        let intervalo = setInterval(() => {
            if (pausado) {
                clearInterval(intervalo)
            } else {
                if (t <= 2 && t > 0) {
                    sonido('corto');
                }
                if (t <= 0) {
                    animar();
                    sonido('largo');

                    clearInterval(intervalo);
                    setTimeout(() => {
                        res();
                    }, 500);
                }
            }

            actualizar(ronda, rondas, actividad, t)
            t--
        }, 1000);
    })
}

// Actualiza la salida en pantalla
function actualizar(ronda, rondas, actividad, tiempo) {
    salidaTiempo.innerText = tiempo;
    salidaTurno.innerText = actividad;
    salidaRondas.innerText = `${ronda}/${rondas}`;
}

// cargar de LS al inicio
function cargarLocalStorage() {
    console.log('cargando LS');

    rondas = +localStorage.getItem('rondas');
    tiempoEjercicio = +localStorage.getItem('tiempoEjercicio');
    tiempoDescanso = +localStorage.getItem('tiempoDescanso');

    if (!rondas || !tiempoEjercicio || !tiempoDescanso) {
        console.log('valores por defecto');
        valoresPorDefecto();
    }
}

// guardar en LS para cargar al inicio
function guardarLocalStorage() {
    console.log('Guardando LS');
    localStorage.setItem('rondas', rondas);
    localStorage.setItem('tiempoEjercicio', tiempoEjercicio);
    localStorage.setItem('tiempoDescanso', tiempoDescanso);
}

// coloca en el formulario los valores dados
function actualizarInput() {
    entradaRondas.value = rondas;
    entradaTiempoEjercicio.value = tiempoEjercicio;
    entradaTiempoDescanso.value = tiempoDescanso;
}

// esta función obtendrá los parámetros del input y los pasará a donde corresponda (como un objeto??)
function obtenerParametros() {
    rondas = entradaRondas.value;
    tiempoEjercicio = entradaTiempoEjercicio.value;
    tiempoDescanso = entradaTiempoDescanso.value;
}

// Cambiar la vista del input/output y botones
function reiniciaVista() {
    // console.log('reiniciavista');

    cajaEntrada.classList.remove('d-none');
    cajaSalida.classList.remove('d-none', "text-bg-info", 'text-bg-secondary', "text-bg-warning");
    cajaSalida.classList.add('d-none');
}

function cambiaVista() {
    cajaEntrada.classList.toggle("d-none");
    cajaSalida.classList.toggle("d-none");
}
function cambiaBotones() {
    cambiaInicioPausa()
    btnReset.classList.toggle('disabled');
}

// todo: pendiente de ajustar
function cambiaInicioPausa() {
    // quitar esta linea y activar las dos siguientes más adelante
    btnInicio.classList.toggle('disabled');
    // btnInicio.classList.toggle('d-none');
    // btnPause.classList.toggle('d-none');
}

// Alerta de animación, pantalla y sonido
function animar() {
    animarBody.classList.add('color-change-5x');
    cajaSalida.classList.add('shake-vertical', 'shake-constant');
    setTimeout(() => {
        animarBody.classList.remove('color-change-5x');
        cajaSalida.classList.remove('shake-vertical', 'shake-constant');

    }, 2000);
    // Opciones animación
    /* <div class="shake"></div>
     <div class="shake-hard"></div>
     <div class="shake-slow"></div> mola
     <div class="shake-little"></div> no
     <div class="shake-horizontal"></div> mola
     <div class="shake-vertical"></div> mola
     <div class="shake-rotate"></div> demasiado
     <div class="shake-opacity"></div> si pero no
     <div class="shake-crazy"></div> demasiado
     <div class="shake-chunk"></div> divertido */
}
function sonido(duración) {
    const bipCorto = new Audio('./bip2.mp3');
    const bipLargo = new Audio('./bip3.mp3')

    switch (duración) {
        case 'corto':
            bipCorto.play();
            break;

        case 'largo':
            bipLargo.play();
            break;

        default:
            break;
    }

}

// Valores por defecto
function valoresPorDefecto() {
    rondas = 3;
    tiempoEjercicio = 5;
    tiempoDescanso = 5;
    pausado = false;
}
