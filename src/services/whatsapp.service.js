const htpps = require('https');

async function sendMessageWhatsap(number , txtResponse){

    const data = JSON.stringify({
        messaging_product: 'whatsapp',
        to: number,
        text: {
            body: txtResponse
        },
        type: 'text'
    });

    const options = {
        hostname: 'graph.facebook.com',
        path: '/v19.0/272960832574599/messages',
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer EAAazBitWn84BOZCQWSbCZByojXNSlqIBydPPpmGvYKHoBnj6fy25nsRVS3DDRoAZBUAr5gZAWvni4dI4j2fgbNEXF0DHjAEfzEia2gIfq30Y4ZCHvasZA89vZCniZAS8vWmIkXIxtFzmygSaHvgJEXSR6jhlHqWEa47ZCc2dNrrw5DKZAZAC2uApYrqyL20pO2tN5wK'
        },
    };

    // const req = htpps.request(options, (res) => {
    //     console.log(`statusCode: ${res.statusCode}`);

    //     res.on('data', (d) => {
    //         process.stdout.write(d);
    //     }); 
    // });

    // req.on('error', (error) => {
    //     console.error(error);
    //     return error;
    // });

    // req.write(data);
    // req.end();

    return new Promise((resolve) => {
        const req = htpps.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                console.log(`statusCode: ${res.statusCode}` , responseData);
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ status: 'success', data: responseData });
                } else {
                    resolve({ status: 'error', message: `Request failed with status code ${res.statusCode}`, data: responseData });
                }
            });
        });

        req.on('error', (error) => {
            console.error(error);
            resolve({ status: 'error', message: error.message });
        });

        req.write(data);
        req.end();
    });



};



module.exports = {  
    sendMessageWhatsap,
    // sendMessageListWhatsap
};

