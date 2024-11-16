import { Project, Task } from './prueba.js';


const projectData1 = {
    id: 1,
    name: 'ProjectPulse',
    startDate: '2024-01-01',
    tasks: [
        { id: 1, description: 'Análisis de Requisitos de Usuario', status: 'finished', deadline: '2024-11-17' },
        { id: 2, description: 'Diseño de la Interfaz de Usuario', status: 'in progress', deadline: '2024-12-06' },
        { id: 3, description: 'Desarrollo del Backend de Autenticación', status: 'finished', deadline: '2024-11-16' },
        { id: 4, description: 'Integración del Sistema de Notificaciones', status: 'pending', deadline: '2024-11-11' }, // tarea vencida, se controla con linea 144: const timeDiff = Math.max(deadline - today, 0); 
        { id: 5, description: 'Implementación de Gestión de Tareas', status: 'in progress', deadline: '2024-11-30' },
        { id: 6, description: 'Desarrollo del Módulo de Reportes', status: 'finished', deadline: '2024-11-14' },
        { id: 7, description: 'Configuración del Servidor y Base de Datos', status: 'pending', deadline: '2024-11-17' },
        { id: 8, description: 'Pruebas Unitarias y de Integración', status: 'pending', deadline: '2024-11-09' },
        { id: 9, description: 'Despliegue en Entornos de Pruebas', status: 'finished', deadline: '2024-12-16' },
        { id: 10, description: 'Optimización del Rendimiento', status: 'pending', deadline: '2025-01-16' },
        { id: 11, description: 'Capacitación para Usuarios Finales', status: 'pending', deadline: '2024-12-06' },
        { id: 12, description: 'Integración de Herramientas de Terceros', status: 'pending', deadline: '2024-11-21' },
        { id: 13, description: 'Desarrollo de API RESTful', status: 'pending', deadline: '2024-11-28' },
        { id: 14, description: 'Implementación de Funcionalidades de Seguridad', status: 'in progress', deadline: '2024-11-30' },
        { id: 15, description: 'Desarrollo de Funcionalidades de Colaboración en Tiempo Real', status: 'pending', deadline: '2024-12-01' },
        { id: 16, description: 'Elaboración de Documentación Técnica', status: 'in progress', deadline: '2024-12-03' },
    ]
};

const projectData2 = {
    id: 2,
    name: 'InnoTrack',
    startDate: '2024-02-01',
    tasks: [
        { id: 17, description: 'Análisis de Mercado', status: 'pending', deadline: '2024-03-01' },
        { id: 18, description: 'Prototipo de Interfaz de Usuario', status: 'pending', deadline: '2024-03-15' },
        { id: 19, description: 'Configuración de la Infraestructura', status: 'in progress', deadline: '2024-02-28' },
        { id: 20, description: 'Desarrollo del Motor de Recomendaciones', status: 'pending', deadline: '2024-04-01' },
    ]
};

const projectData3 = {
    id: 3,
    name: 'EcoSystem',
    startDate: '2024-03-01',
    tasks: [
        { id: 21, description: 'Investigación de Energías Renovables', status: 'in progress', deadline: '2024-04-10' },
        { id: 22, description: 'Desarrollo de Sensores IoT', status: 'pending', deadline: '2024-05-01' },
        { id: 23, description: 'Integración de Sistemas de Monitoreo', status: 'finished', deadline: '2024-04-01' },
        { id: 24, description: 'Pruebas de Campo', status: 'pending', deadline: '2024-05-15' },
    ]
};


// Ejemplo de uso de la función cargarDetallesProyecto
async function main() {
    //Ejemplo Proyecto 2    
    const project2 = await Project.fetchProjectDetails(projectData2);    
    if (project2) {
        console.log(`\n=======================================\n` +
                    `Bienvenido al proyecto "${project2.name}"` +
                    `\n=======================================`        
                    );
                }
        project2.orderTasksByDeadline();
           
    //Ejemplo Proyecto 3
    const project3 = await Project.fetchProjectDetails(projectData3);    
    if (project3) {
        console.log(`\n=======================================\n` +
                    `Bienvenido al proyecto "${project3.name}"` +
                    `\n=======================================`        
                    );
                }
        project3.orderTasksByDeadline();


    /*
    Funcion para cargar proyecto fetchProjectDetails(project), que simula una llamada asincrona a una API apiCall(project) 
    */
    const project1 = await Project.fetchProjectDetails(projectData1);    
    if (project1) {
        console.log(`\n=======================================\n` +
                    `Bienvenido al proyecto "${project1.name}"` +
                    `\n=======================================`        
                  );
        
        // Generar resumen del proyecto.
        project1.makeSummary();
        // Ordenar tareas por fecha limite.
        project1.orderTasksByDeadline();
        /*
        Imprimir el estado de las tareas. 
        Se creo esta funcion que hace el filtro de los 3 estados para demostrar que esta filtrando utilizando la funcion projectTaskFilter(filter) {....
        */
        project1.printTasksStatus();
        // Calcular y mostrar en una tabla el total de dias que faltan para completar todas las tareas pendientes del proyecto.
        project1.printRemainingTime();
        // Calcular y mostrar en una tabla las tareas con menos de 3 dias de su fecha limite.
        project1.printCriticalTasks();
    
        // Ejercicio de actualización de tarea y notificación de eventos con status "finished
        // Actualizacion de la tarea 4 al estado finished
        project1.updateTaskStatus(4,"finished") 
        /*
        Se crea un ejemplo de actualizacion de status a "in progress" para demostrar que solo aparecen notificaciones
        cuando el status cambia a "finished" o completado, que es lo que solicita el requerimiento.
        El requerimiento no solicita validar si el status al que se quiere cambiar ya esta definido en la tarea, queda como oportunidad de mejora enviar una notificacion si se produce el caso.
        */
        setTimeout(()=>{project1.updateTaskStatus(11,"in progress")}, 10000) 
        
        // Agregar tarea manual
        setTimeout(()=>{  
        console.log(`\nEjercicio agregar tarea {17, 'Implementar MFA', 'in progress', '2024-11-25'} en proyecto "${project1.name}"`)
        const manualAddTask1 = new Task(17, 'Implementar MFA', 'in progress', '2024-11-25');
        project1.addTask(manualAddTask1);  
        console.table(project1.projectTaskFilter(task => task.status === 'in progress'));
        }, 20000) 

    };
    // Escuchar el evento 'taskUpdated' y el status cambiando a `finished`
    project1.on('taskUpdated', (taskId, newStatus) => { 
        if (newStatus === 'finished') { 
            console.log(`=========> Notificación EventEmitter: La tarea con ID ${taskId} ha cambiado su estado a '${newStatus}'.`); }    
        });  
}

main();


