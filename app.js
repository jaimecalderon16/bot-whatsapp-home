const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('./portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MySQLAdapter = require('@bot-whatsapp/database/mysql')

/**
 * Declaramos las conexiones de MySQL
 */
const MYSQL_DB_HOST = process.env.DB_HOST
const MYSQL_DB_USER = process.env.DB_USER
const MYSQL_DB_PASSWORD = process.env.DB_PASSWORD
const MYSQL_DB_NAME = process.env.DB_NAME
const MYSQL_DB_PORT = '3306'


const flowSecundario = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '¡De nada! Estoy aquí para ayudarte en lo que necesites. Si tienes alguna otra pregunta, no dudes en preguntar. 😊',
    ])

const flowMasajes = addKeyword(['masajes', 'masages','masaje','masage']).addAnswer(
    [
        'Ofrecemos una amplia variedad de masajes para que elijas el que mejor se adapte a tus necesidades. Algunos de ellos son:', 
        'Masaje relajante 😌',
        'Masaje terapéutico 💆‍♂️',
        'Masaje deportivo 🏋️‍♀️',
        'Masaje Post Natal 🤰',
    ],
    null,
    null,
    [flowSecundario]
)

const flowReservar = addKeyword(['reservar', 'reserva', 'agendar']).addAnswer(
    [
        'Para hacer una reserva, puedes comunicarte directamente con nosotros al número de teléfono 3027643007 o en un momento un acesor te atendera.', 
        '¡Estaremos encantados de atenderte y reservar tu cita! 📅',
    ],
    null,
    null,
    [flowSecundario]
)

const flowHorarios = addKeyword(['horarios', 'horarios de atencion', 'orarios']).addAnswer(
    [
        '¡Claro! Aquí tienes nuestro horario de atención:',
        ' Nuestro horario de atención es de lunes a viernes de *9:00 a.m. a 6:00 p.m.* ⏰',
    ],
    null,
    null,
    [flowSecundario]
)


const flowPaginaWeb = addKeyword(['pagina', 'web', 'pagina  Web']).addAnswer(
    ['¡Claro! Puedes visitar nuestro sitio web en homemasaje.com para obtener más información, consultar nuestros servicios y precios, y realizar reservas de manera rápida y sencilla. ¡Te esperamos en línea! 🌐'],
    null,
    null,
    [flowSecundario]
)

const flowContacto = addKeyword(['contacto', 'contactos']).addAnswer(
    ['Puedes contactarnos al número de teléfono 3027643007 o visitar nuestro sitio web homemasaje.com para más información. 📞'],
    null,
    null,
    [flowSecundario]
)

const flowPrincipal = addKeyword(['hola', 'ole', 'buenas'])
    .addAnswer('¡Hola! Soy un robot 🤖. Aquí tienes la información que puedo ofrecerte: ✨')
    .addAnswer(
        [
            '🏠 Masajes a domicilio',
            '📅 Reservar',
            '⏰ Horarios',
            '🌐 Página web',
            '📞 como contactarnos',
        ],
        null,
        null,
        [flowMasajes, flowReservar, flowHorarios, flowPaginaWeb, flowContacto]
    )

const main = async () => {
    const adapterDB = new MySQLAdapter({
        host: MYSQL_DB_HOST,
        user: MYSQL_DB_USER,
        database: MYSQL_DB_NAME,
        password: MYSQL_DB_PASSWORD,
        port: MYSQL_DB_PORT,
    })
    const adapterFlow = createFlow([flowPrincipal,flowSecundario])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()
