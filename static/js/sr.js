$(function () {

    var PALABRA_CLAVE = 'girona';


    showInfo('info_start');

    var create_email = false;
    var final_transcript = '';
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;

    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
    } else {
        var recognition = new webkitSpeechRecognition();
        recognition.start();

        recognition.continuous = false;
        recognition.interimResults = false;

        final_transcript = '';
        recognition.lang = select_dialect.value;
        ignore_onend = false;
        final_span.innerHTML = '';
        interim_span.innerHTML = '';
        start_img.src = '/static/img/mic-slash.gif';
        showInfo('info_allow');
        showButtons('none');
        //start_timestamp = event.timeStamp;

        recognition.onspeechstart = function () {
            console.log('Speech has been detected');
        };

        recognition.onspeechend = function () {
            console.log('Speech has stopped being detected');
        };

        recognition.onstart = function () {
            console.log('start');
            recognizing = true;
            showInfo('info_speak_now');
            start_img.src = '/static/img/mic-animate.gif';
        };

        recognition.onerror = function (event) {
            console.log('ERROR', event);

            if (event.error == 'no-speech') {
                start_img.src = '/static/img/mic.gif';
                showInfo('info_no_speech');
                recognition.start();
            }
            if (event.error == 'audio-capture') {
                start_img.src = '/static/img/mic.gif';
                showInfo('info_no_microphone');
                ignore_onend = true;
            }
            if (event.error == 'not-allowed') {
                if (event.timeStamp - start_timestamp < 100) {
                    showInfo('info_blocked');
                } else {
                    showInfo('info_denied');
                }
                ignore_onend = true;
            }
        };

        recognition.onend = function () {
            console.log('onend');
            recognition.start();

            if (ignore_onend) {
                console.log('ignorado');
                return;
            }
            start_img.src = '/static/img/mic.gif';
            if (!final_transcript) {
                showInfo('info_start');
                //return;
            }
            showInfo('');
            // if (window.getSelection) {
            //     window.getSelection().removeAllRanges();
            //     var range = document.createRange();
            //     range.selectNode(document.getElementById('final_span'));
            //     window.getSelection().addRange(range);
            // }

            // Start again
        };

        recognition.onresult = function (event) {
            console.log('onresult');

            var resultados = event.results;



            var interim_transcript = '';
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            final_transcript = capitalize(final_transcript);
            final_span.innerHTML = linebreak(final_transcript);
            interim_span.innerHTML = linebreak(interim_transcript);
            if (final_transcript || interim_transcript) {
                showButtons('inline-block');
            }

            console.log(recognition);
            //recognition.start();
        };
    }

    function upgrade() {
        start_button.style.visibility = 'hidden';
        showInfo('info_upgrade');
    }

    var two_line = /\n\n/g;
    var one_line = /\n/g;

    function linebreak(s) {
        return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }

    var first_char = /\S/;

    function capitalize(s) {
        return s.replace(first_char, function (m) {
            return m.toUpperCase();
        });
    }

    // /**
    //  * Eventos Boton
    //  * @param event
    //  */
    // $('#start_button')
    //     .mousedown(function () {
    //         final_transcript = '';
    //         recognition.lang = select_dialect.value;
    //         recognition.start();
    //         ignore_onend = false;
    //         final_span.innerHTML = '';
    //         interim_span.innerHTML = '';
    //         start_img.src = '/static/img/mic-slash.gif';
    //         showInfo('info_allow');
    //         showButtons('none');
    //         start_timestamp = event.timeStamp;
    //     })
    //     .mouseup(function () {
    //         recognition.stop();
    //     });

    function showInfo(s) {
        if (s) {
            for (var child = info.firstChild; child; child = child.nextSibling) {
                if (child.style) {
                    child.style.display = child.id == s ? 'inline' : 'none';
                }
            }
            info.style.visibility = 'visible';
        } else {
            info.style.visibility = 'hidden';
        }
    }

    var current_style;

    function showButtons(style) {
        if (style == current_style) {
            return;
        }
        current_style = style;
    }


});