const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const PCR = require('puppeteer-chromium-resolver');
const qrImage = require('qr-image');
const fs = require('fs');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
let qrActual = null;

// Servidor web auxiliar para mostrar el QR en una pestaña limpia
app.get('/', (req, res) => {
    if (!qrActual) {
        return res.send('<h1>El bot ya está conectado o el QR no se ha generado aún. Revisa la consola de Render.</h1>');
    }
    const code = qrImage.image(qrActual, { type: 'png' });
    res.setHeader('Content-Type', 'image/png');
    code.pipe(res);
});

app.listen(PORT, () => {
    console.log(`Servidor web auxiliar corriendo en el puerto ${PORT}`);
});

async function iniciarBot() {
    const stats = await PCR({});

    console.log('Iniciando entorno de Pastelería Elizabeth en la Nube con Enlace QR...');

    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            executablePath: stats.executablePath,
            headless: 'new',
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process'
            ]
        }
    });

    client.on('qr', (qr) => {
        qrActual = qr;
        console.log('--- NUEVO CÓDIGO QR GENERADO ---');
        console.log('👉 ABRE ESTE ENLACE EN TU NAVEGADOR PARA ESCANEAR EL QR PERFECTO:');
        console.log(`https://onrender.com`);
        console.log('--------------------------------');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        qrActual = null;
        console.log('¡El bot de Pastelería Elizabeth está en línea y corriendo 24/7 en la nube!');
    });

    client.on('message', async (msg) => {
        const mensajeUsuario = msg.body.toLowerCase().trim();

        // 1. Saludo Inicial y Menú Principal
        if (mensajeUsuario === 'hola' || mensajeUsuario === 'buenas' || mensajeUsuario === 'menu' || mensajeUsuario === 'inicio') {
            await client.sendMessage(msg.from, 
                `✨ *¡Hola! Soy Eli de la Pastelería Elizabeth.* 👩‍🍳🍰\n\n` +
                `¡Qué alegría saludarte! ¿En qué te puedo ayudar hoy? Con gusto te atenderé.\n\n` +
                `📸 *¡Síguenos en Instagram para ver nuestras delicias!* 👇\n` +
                `https://instagram.com\n\n` +
                `Por favor, responde escribiendo el *número* o *palabra clave* de la opción que necesitas:\n\n` +
                `1️⃣ Ver catálogo de Variedades 📋\n` +
                `2️⃣ Requisitos de Pedidos y Datos de Transferencia 💵\n` +
                `3️⃣ Ver nuestros Horarios de atención 🕒\n` +
                `4️⃣ Hablar directamente con un vendedor 🙋‍♂️\n\n` +
                `⚠️ *Nota:* Todos los pedidos y la disponibilidad de productos están sujetos a confirmación de nuestra parte.`
            );
        }

        // 2. Submenú de Catálogo de Variedades
        else if (mensajeUsuario === '1') {
            await client.sendMessage(msg.from,
                `📋 *Catálogo de Variedades* ✨\n\n` +
                `Escribe la palabra clave de la categoría que deseas revisar:\n\n` +
                `📦 *empanadas* -> Para ver nuestro listado de empanadas 🥟\n` +
                `📦 *kuchens* -> Para ver la variedad de Kuchens, Pies y Tartaletas 🥧\n` +
                `📦 *tortas* -> Para ver las tortas tradicionales 🎂\n` +
                `📦 *heladas* -> Para ver la línea de tortas y porciones heladas 🍦\n\n` +
                `📸 Mira fotos de nuestros productos aquí: https://instagram.com\n\n` +
                `✨ Escribe *Menu* para regresar al inicio.`
            );
        }
        // 2a. Listado de Empanadas
        else if (mensajeUsuario === 'empanadas') {
            await client.sendMessage(msg.from,
                `🥟 *Nuestras Empanadas Disponibles:* 😋\n\n` +
                `• Empanada de Carne Picada (horno)\n` +
                `• Empanada Napolitana (horno)\n` +
                `• Empanada Pollo Choclo (horno)\n` +
                `• Empanada Pollo con Verduras (horno)\n` +
                `• Empanada de Digüeñe (horno)\n` +
                `• Empanada frita de Pino\n` +
                `• Empanada frita de Queso\n\n` +
                `✨ Escribe *Menu* para volver al inicio o *1* para ver otra categoría.`
            );
        }

        // 2b. Listado de Kuchens
        else if (mensajeUsuario === 'kuchens') {
            await client.sendMessage(msg.from,
                `🥧 *Nuestros Kuchens, Pies y Tartaletas:* 🥮\n\n` +
                `• Kuchen sin azúcar\n` +
                `• Kuchen plátano\n` +
                `• Kuchen manzana\n` +
                `• Kuchen kéfir\n` +
                `• Kuchen cereza\n` +
                `• Kuchen arándano\n` +
                `• Kuchen mora\n` +
                `• Kuchen durazno\n` +
                `• Kuchen frutilla-manzana\n` +
                `• Kuchen maqui-manzana\n` +
                `• Kuchen frambuesa\n` +
                `• Kuchen frutos del bosque\n` +
                `• Kuchen grosella\n` +
                `• Kuchen ruibarbo-manzana\n` +
                `• Kuchen zarzaparrilla-durazno\n` +
                `• Kuchen guinda-durazno\n` +
                `• Kuchen coco\n` +
                `• Kuchen castaña\n` +
                `• Kuchen piñón\n` +
                `• Kuchen avellana\n` +
                `• Kuchen murta-manzana\n` +
                `• Kuchen nuez\n` +
                `• Pie de nuez\n` +
                `• Pie de limón\n` +
                `• Pie de limón-frambuesa\n` +
                `• Tartaleta de frutas\n` +
                `• Cheesecake variedades\n\n` +
                `✨ Escribe *Menu* para volver al inicio o *1* para ver otra categoría.`
            );
        }

        // 2c. Listado de Tortas Tradicionales
        else if (mensajeUsuario === 'tortas') {
            await client.sendMessage(msg.from,
                `🎂 *Nuestras Tortas Tradicionales:* 🎉\n\n` +
                `• Torta de mostacilla\n` +
                `• Torta de piña\n` +
                `• Torta de durazno\n` +
                `• Torta de selva negra\n` +
                `• Torta de tres leches\n` +
                `• Torta de lúcuma-manjar\n` +
                `• Torta de KitKat\n` +
                `• Torta de alfajor\n` +
                `• Torta de zanahoria-nuez\n` +
                `• Torta de moka\n` +
                `• Torta de trufa-chocolate\n` +
                `• Torta de mil hojas\n` +
                `• Torta de Baileys\n\n` +
                `✨ Escribe *Menu* para volver al inicio o *1* para ver otra categoría.`
            );
        }

        // 2d. Listado de Tortas Heladas
        else if (mensajeUsuario === 'heladas') {
            await client.sendMessage(msg.from,
                `🍦 *Nuestras Tortas Heladas y Porciones:* ❄️\n\n` +
                `• Porción de torta merengue frambuesa\n` +
                `• Volcán merengue frambuesa pequeño\n` +
                `• Volcán merengue frambuesa mediano\n` +
                `• Torta merengue frambuesa chica\n` +
                `• Torta merengue frambuesa grande\n` +
                `• Torta mixta\n\n` +
                `✨ Escribe *Menu* para volver al inicio o *1* para ver otra categoría.`
            );
        }

        // 3. Requisitos de Pedido y Datos de Transferencia
        else if (mensajeUsuario === '2') {
            await client.sendMessage(msg.from, 
                `📅 *Información de Pedidos y Abonos* 💵\n\n` +
                `• *Anticipación:* Mínimo *48 horas* antes de la entrega.\n` +
                `• *Reserva:* Se debe abonar al menos el *20% del valor total*.\n` +
                `• *Detalles:* Puedes agregar dedicatorias o consultar por sabores especiales.\n\n` +
                `💳 *Datos de Transferencia:* \n` +
                `- *Banco:* BancoEstado\n` +
                `- *Cuenta:* Cuenta RUT\n` +
                `- *Número de Cuenta:* 8.876.435-8\n` +
                `- *Nombre:* María Aravena\n` +
                `- *Correo:* alfajimena@gmail.com\n\n` +
                `⚠️ *Recuerda:* Envíanos el comprobante en este chat. Todos los pedidos están sujetos a confirmación por nuestra parte.\n\n` +
                `✨ Escribe *Menu* para volver al inicio.`
            );
        }

        // 4. Horarios de Atención
        else if (mensajeUsuario === '3') {
            await client.sendMessage(msg.from, 
                `🕒 *Nuestros Horarios de Atención* ☕🍞\n\n` +
                `Te esperamos en nuestro local o respondemos tus consultas de:\n\n` +
                `🗓️ *Lunes a Domingo:* de 08:00 a 21:30 hrs. (Horario continuado)\n\n` +
                `✨ Escribe *Menu* para regresar.`
            );
        }

        // 5. Contacto con Vendedor + Notificación Automática
        else if (mensajeUsuario === '4') {
            await client.sendMessage(msg.from, 
                `🙋‍♂️ *Conexión con Vendedor*\n\n` +
                `¡Perfecto! He notificado a nuestro equipo sobre tu consulta.\n\n` +
                `Uno de nuestros vendedores se contactará contigo en breve en este mismo chat para confirmar disponibilidad y tomar tu pedido. ¡Muchas gracias por tu paciencia! 👨‍🍳✨`
            );

            // Reemplaza las X por el número donde la pastelería recibirá las alertas de los clientes
            const telefonoPanaderia = '569XXXXXXXX@c.us'; 
            
            try {
                const contactoCliente = await msg.getContact();
                const nombreCliente = contactoCliente.pushname || 'Cliente sin nombre';
                const numeroCliente = msg.from.replace('@c.us', '');

                await client.sendMessage(telefonoPanaderia, 
                    `🚨 *¡ALERTA DE ATENCIÓN!* 🚨\n\n` +
                    `Un cliente ha solicitado hablar con un vendedor en la Pastelería.\n\n` +
                    `👤 *Nombre:* ${nombreCliente}\n` +
                    `📱 *Número:* +${numeroCliente}\n\n` +
                    `👉 Por favor, ingresa al chat para tomar su pedido y verificar disponibilidad.`
                );
            } catch (error) {
                console.error('No se pudo enviar la alerta de notificación:', error);
            }
        }
    });

    client.initialize();
}

iniciarBot().catch(err => console.error('Error al arrancar el bot:', err));
