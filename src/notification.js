const nodemailer = require('nodemailer');

// Configurar el transporte de correo
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: 'soporte@serbit.com.mx',
        pass: 'S0p0rt3S3rb1t.'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Función para enviar notificación por correo electrónico
async function  enviarNotificacionEmail(fecha, error) {
    
    const mailOptions = {
        from: 'soporte@serbit.com.mx',
        to: 'ing.vicentehdz@gmail.com, krooht@gmail.com, jose.delariva@serbit.com.mx, tiringus.alvarez@outlook.com',
        subject: `Error en el serivcio espejo de Polanco `,
        text: `Ocurrió un error al ejecutar el proceso del espejo en Polanco del dia ${fecha}; porfavor revisa la BD, error: ${error}`
    };

    await transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error al enviar el correo electrónico:', err);
        } else {
            console.log('Correo electrónico enviado:', info.response);
        }
    });

}

module.exports = {enviarNotificacionEmail};