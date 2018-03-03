const LANG = 'ca-ES';
const CLAVE_PATT = /.*alfonso.*/i;
const TIMING_DELAY = 5000;

$(function () {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Navegador Incompatible! Usa Chrome');
    } else {
        var recognition = new webkitSpeechRecognition();
        var hasKey = false;
        var cachedString = '';

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = LANG;

        recognition.start();

        recognition.onstart = function () {
            //console.log('onstart');
        };

        recognition.onspeechstart = function () {
            //console.log('Speech has been detected');
            //isEvaluable = true;
        };

        /**
         * Tras hablar, envia la cache si se encontro una clave
         */
        recognition.onspeechend = function () {
            console.log('Speech has stopped being detected');
            if (hasKey) {
                hasKey = false;
                sendOrder(cachedString);
            }
        };

        recognition.onresult = function (event) {
            //console.log('onresult');
            var transcript = event.results[0][0].transcript;
            evaluateMessage(transcript);
        };

        recognition.onerror = function (event) {
            console.log('----------------ERROR---------------------');
            console.log(event);
        };

        recognition.onend = function () {
            //console.log('onend');

            recognition.start();
        }
    }

    /**
     * Si se encontro la llave, se guarda el texto en el cache
     * @param message
     */
    function evaluateMessage(message) {
        console.log('Evaluating: ', message);

        if (!hasKey) {
            var patt = new RegExp(CLAVE_PATT);
            hasKey = patt.test(message.toLowerCase());

            if (hasKey) {
                console.log('---¡KEY!---');
                cachedString = message;

                // Avoid onspeechend delay
                // Enviar el mensaje en un rato si no se habla
                setTimeout(
                    function () {
                        console.log('timeout');
                        hasKey = false;
                        sendOrder(cachedString);
                    }, TIMING_DELAY);
            }
        } else {
            cachedString += message; // Cache transcript
        }
    }

    //var synthesis = speechSynthesis;

    /**
     * Enviar la orden AJAX a la API
     * @param text
     */
    function sendOrder(text) {
        console.log('Send order');

        var text = text.toLowerCase().split('alfonso').pop();
        var url = 'http://192.192.193.155:5000/voice/' + text;
        $.ajax({
            url: url,
            type: 'GET',
            headers: {"X-My-Custom-Header": "*"},
            crossDomain: true,
            success: function (response) {
                console.log(response);
                if (response != null && response.message != null) {
                    speach(response.message);
                } else {
                    speach('No he entès ' + text);
                }
            },
            error: function () {
                speach('No he entès ' + text);
            }
        });
    }

    function speach(text) {
        var utterance = null;
        utterance = new SpeechSynthesisUtterance();
        utterance.lang = 'es-ES';
        utterance.text = text;
        speechSynthesis.speak(utterance);
    }
});