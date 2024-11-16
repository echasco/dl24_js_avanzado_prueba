/**
 1. Gestion de Proyectos y Tareas
*/
 
// Estructura de datos para representar tareas
export class Task {
    constructor(id, description, status, deadline) {
        this.id = id;
        this.description = description;
        this.status = status; // Opciones que se pueden usar 'pending', 'in progress', 'finished'. No se pide en alcance hacer validacion, pero es una oportunidad de mejora a futuro.
        this.deadline = deadline; // Almacena fecha limite
    }
}

// Clase para gestionar los eventos
export class EventEmitter {
    constructor() {
        this.events = {};
    }
    /*
    Esta escuchando un String, para este caso "taskUpdated", que debe ser recibido dede emit(event, ...args)
    */
    on(event, listener) {
        /*
        event: Recibe el string del evento, en este caso "taskUpdated"
        listener: recibira una función que se ejecutará al recibir el evento, en este caso:
            (taskId, newStatus) => { 
            console.log(`Notificación: La tarea con ID ${taskId} ha cambiado su estado a '${newStatus}'.`); 
        */
        if (!this.events[event]) {
            //Verifica si no existe un array de listeners para el evento que esta ocurriendo this.events[event]
            //Si no existe, significa que es la primera vez que esta registrando un listener con este evento y crea el array vacio
            this.events[event] = [];
        }
        // Anade el listener al final del array
        this.events[event].push(listener);
    }
    /*
    Emite la notificacion en la linea 247: this.emit('taskUpdated', taskId, newStatus); 
    - event: recibe "taskUpdated" como String
    - ...args: Un conjunto de parametros, en este caso taskId y newStatus
    */
    emit(event, ...args) {
        /*Verifica si hay algun listener, en este caso en main.js esta escuchando el evento "taskUpdated" 
         main.js linea 120: project1.on('taskUpdated', (taskId, newStatus) => {... 
        */    
        if (this.events[event]) {            
            //Si encuentra un listener, forEach llama a cada listener con los argumentos que van en args... y pasa los argumentos.
            this.events[event].forEach(listener => listener(...args));
        }
    }
}



// Estructura de datos para representar proyectos
export class Project extends EventEmitter{
    constructor(id, name, startDate) {
        super()
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.tasks = [];
    }

    // Anadir nuevas tareas al proyecto
    addTask(task) {
        this.tasks.push(task); // Anade al final del array
    }

    // Genera un resumen del proyecto que muestra el numero de tareas en cada estado
    makeSummary() {
        const resumen = this.tasks
            .map(task => task.status) // Creamos un array solo con los estados de las tareas
            .reduce((acumulador, estado) => {  // Cuenta las veces que aparece cada estado
                if (acumulador[estado]) { 
                    acumulador[estado]++; // Si exite el estado acumula +1, si no existe lo establece en 1
                } else {
                    acumulador[estado] = 1;
                }
                return acumulador; // Retorna el acumulador al final de cada iteracion para el proximo ciclo del array
            }, {});
        // Imprime en consola una tabla con el resumen del conteo de estados    
        console.log("Resumen del proyecto:");
        console.table(resumen);
    }

    // Opcion para retornar el estado con el acumulado de veces, sin imprimir una tabla en consola
    // makeSummary() {
    //     return this.tasks.reduce((summary, task) => { // Usar reduce para crear un index con el status y en otra columna el total de tareas con el status
    //         summary[task.status] = (summary[task.status] || 0) + 1;
    //         return summary;
    //     }, {});
    // }

    
    // Ordenar tareas por fecha límite usando sort e imprime en consola una tabla con las tareas ordenadas
    orderTasksByDeadline() {
        this.tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        console.log("\nTareas ordenadas por fecha límite:")
        console.table(this.tasks)
    }


/**
 2. Análisis Avanzado de Tareas
*/

    /**
    Crea una función de orden superior filtrarTareasProyecto que tome una
    función de filtrado como argumento y la aplique a la lista de tareas de un
    proyecto
    */
    projectTaskFilter(filter) {
        // Espera una función de filtrado, se hara un llamado desde la funcion printTaskStatus()
        return this.tasks.filter(filter); 
    }
    // Llama a projectTaskFilter(filter) y le pasa como parametro una funcion de filtrado.
    // Se agregan funciones para los 3 estados y se imprime una tabla en consola.
    printTasksStatus() {
        console.log("\nTareas filtradas por status: in progress")
        console.table(this.projectTaskFilter(task => task.status === 'in progress'))

        console.log("\nTareas filtradas por status: pending")
        console.table(this.projectTaskFilter(task => task.status === 'pending'))

        console.log("\nTareas filtradas por status: finished")
        console.table(this.projectTaskFilter(task => task.status === 'finished'))

    }
    /**
     Implementa una función calcularTiempoRestante que utilice el método
    reduce para calcular el número total de días que faltan para completar todas
    las tareas pendientes de un proyecto
    */

    // Obtener las tareas pendientes con su tiempo restante
    calculateRemainingTime() {
        const today = new Date(); // Día actual
        console.log(`\n\nHoy es: ${today}`) 
        return this.tasks
            .filter(task => !(task.status === 'finished')) //Se consideraron tareas in progress y pending
            .map(task => {
                const deadline = new Date(task.deadline); // Obtener fecha limite
                const timeDiff = Math.max(deadline - today, 0); // Resta la fecha limite - fecha actual, y evita valores negativos si la fecha ya pasó 
                const remainingTime = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convertir la diferencia de milisegundos a días
                return {
                    id: task.id,
                    description: task.description,
                    status: task.status,
                    deadline: task.deadline,
                    remainingTime: remainingTime
                };
            });
    }

    // Imprimir tareas pendientes con su tiempo restante
    printRemainingTime() {       
        const pendingTasks = this.calculateRemainingTime(); // Recibe un objeto con las tareas pendientes y el tiempo que queda antes del deadline.
        const totalRemainingDays = pendingTasks.reduce((total, task) => total + task.remainingTime, 0); // Almacena el total de días pendientes de las tareas
        const table = pendingTasks.map((task, index) => ({
            index: index + 1, // Hace que comience el indice de las tareas en 1, para que no comiencen en 0 por ser array
            ...task
        }));
        console.log(`\nDías restantes para completar las tareas pendientes del proyecto "${this.name}": `, totalRemainingDays);
        console.table(table);
    }

    /*
    Desarrolla una función obtenerTareasCriticas que identifique y retorne las
    tareas que están a menos de 3 días de su fecha límite y aún no están
    completadas
    */
    getCriticalTasks() {
        const today = new Date(); // Día actual
        const criticalTasks = this.tasks.filter(task => { // Seleccionas la tareas que estan cumpliendo el criterio {}
            const deadline = new Date(task.deadline);
            const timeDiff = deadline - today; // Guarda la diferencia en la fecha limite y la fecha actual
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convertir milisegundos a días
            return task.status !== 'finished' && daysDiff <= 3; // Retorna las tareas con el status pending o in progress, y que tenga 3 o menos días del deadline.
        });
        return criticalTasks;
    }

    printCriticalTasks() {
        // Llama a la funcion getCriticalTasks() para imprimir en consola una tabla con el resultado
        console.log("\nTareas con menos de 3 días de su fecha limite: ");
        console.table(this.getCriticalTasks())
    }

/**
Sincronización y Actualizaciones en Tiempo Real
*/

    // Cargar detalles del proyecto de una API simulada
    //Use static para que el metodo perteneciese a la clase misma, no se necesita crear una instancia de la clase para llamar a un método estático.
    static async fetchProjectDetails(project) { 
        try { 
            // Va a ejecutar el siguiente codigo que esta entre {}, y si ocurre un error es capturador por catch {}
            console.log(`\nIniciando la carga del proyecto "${project.name}"...`)
            
            // Hace la llamada a la funcion apiCall. Await espera a que la promesa devuelta por apiCall se resuelve.
            const projectDetails = await apiCall(project); 

            // Cuando la promesa es recibida, se crea una instancia de Project utilizando los detalles obtenidos. El objeto trae el detalle del Proyecto y las tareas.
            const newProject = new Project(projectDetails.id, projectDetails.name, projectDetails.startDate); 
            
            // forEach va a ir iterando sobre cda tarea en projectDetails.tasks
            projectDetails.tasks.forEach(taskDetails => {    
                
                // Ira creando nuevas instancias de Task y pasando los detalles de cada tarea
                const task = new Task(taskDetails.id, taskDetails.description, taskDetails.status, taskDetails.deadline); 
                newProject.addTask(task); // Va agregando las tareas a newProject
            });
            return newProject; // Devuelve la nueva instancia que se creo de Project y viene con los detalles obtenidos desde la API
        } catch (error) {
            console.error("Error al cargar los detalles del proyecto:", error); // Si hay un error se captura con catch
        }
    }

    // Actualizar el estado de una tarea
    async updateTaskStatus(taskId, newStatus) {
        console.log(`\n===============================================================================================\n` +
                    `\nProceso de actualización de la tarea con ID ${taskId} iniciado...\n`
                   );
        try { // Va a ejecutar el siguiente codigo que esta entre {}, y si ocurre un error es capturador por catch {}           
            /*
            Espera a que se resuelva la promesa de updateTaskStatusOnServer, 
            que es una llamada simulada a un servidor para actualizar el estado de la tarea.
            */
            const response = await updateTaskStatusOnServer(taskId, newStatus);
            // Busca la tarea en el array tasks que tiene el id igual a taskId
            const task = this.tasks.find(task => task.id === taskId);
            
            // Si la tarea existe, se actualiza su estatus con task.status = response.newStatus;
            if (task) {
                console.log(`1) El estado actual de la tarea con ID ${task.id} es "${task.status}".`)
                console.log(`2) Cambiando estado a "${newStatus}"......`);
                task.status = response.newStatus;
                console.log(`3) El estado de la tarea con ID ${taskId} ha sido actualizado a "${newStatus}".`);
                setTimeout(()=>{   
                    // Espera 3 segundos para imprimir el resumen de las tareas que tienen el actual estado,
                    // y emite un evento con la etiqueta "taskUpdated" que sera escuchado por el listener on(event, listener) de la clase EventEmitter
                    console.log(`4) Resumen de tareas con estado "${newStatus}":`);
                    console.table(this.projectTaskFilter(task => task.status === newStatus));
                    console.log("\n5) Proceso de actualización de la tarea finalizado.'\n");       
                    this.emit('taskUpdated', taskId, newStatus); // Emitir notificación de cambio de estado.        
                },3000)
            } else { // Si no se encuentra el ID de la tarea que se quiere modificar imprime un mensaje
                console.error(`No se encontró ninguna tarea con ID ${taskId}.`);
            }
        } catch (error) {
            console.error(error.message);
        }
    }
}


// Simulamos una API que devuelve una promesa que se resuelve con los detalles del proyecto
function apiCall(project) {
    return new Promise((resolve) => {  
        setTimeout(() => {
            // Aqui se guarda el detalle del objeto proyecto y sus tareas
            const projectDetails = project; 
            // Resolve devuelve el valor de la promesa
            resolve(projectDetails);
            //console.log("=========================================>>>>>>>>>>>>>>>> ", projectDetails )
        }, 1000); // Simulamos un retraso de 1 segundo
    });
}

// Simula una llamada a servidor desde la funcion updateTaskStatus()
async function updateTaskStatusOnServer(taskId, newStatus) {
    try {
        // Simula una llamada a un servidor para actualizar el estado de la tarea, esto devolvera una promesa con el nuevo status de la tarea.
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ newStatus }); // Este es el estado que va a devolver
            }, 1000); // Simulamos un retraso de 1 segundo
        });
    } catch (error) {
        throw new Error("Error al actualizar el estado de la tarea en el servidor");
    }
}