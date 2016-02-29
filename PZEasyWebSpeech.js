/**
 * PZEasyWebSpeech.js
 * 
 * This JS-file makes it really easy to add speech support to your website.
 * As a workaround for Chrome Browser, the speech is stopped after every full
 * stop. To enhance the quality of speech, several (mostly closing) HTML-Tags
 * are converted to full stops - feel free to add your own by modifying the
 * "text" variable.
 *
 * An example of what the library does can be found here:
 * @homepage http://fh.zoechner.com/branson/career/overview/
 * 
 * @author  Phil Zoechner (@pzoechner) <pzoechner@gmail.com>
 * @author @homepage http://www.zoechner.com
 *
 * @version 1.0.1
 *
 * Further information about speech synthesis can be found here:
 * https://github.com/AurelioDeRosa/HTML5-API-demos/blob/master/demos/speech-synthesis-api-demo.html
 */

function PZEasyWebSpeech(param_speak_button_id, param_class_to_read, 
                         param_class_speaking, param_class_not_speaking, 
                         param_class_hidden,
                         param_lang, param_volume)
{
    /** This is the id of your button/element which starts/stops speaking */
    var speak_button_id = param_speak_button_id;

    /**
     * The class added to paragraphs/elements from where text should be
     * extracted and read.
     * Everything with this class on your page will be read!
     */
    var class_to_read = param_class_to_read;

    /**
     * Class added as speech is activated. When this class is added, the
     * corresponding class "class_not_speaking" will be removed.
     *
     * Class: http://fortawesome.github.io/Font-Awesome/icon/volume-up/
     */
    var class_speaking = param_class_speaking;

    /**
     * Class added as speech is deactivated. The this class is added, the 
     * corresponding class "class_speaking" will be removed.
     *
     * Class: http://fortawesome.github.io/Font-Awesome/icon/volume-off/
     */
    var class_not_speaking = param_class_not_speaking;

    /** The class used to hide an element in your project or framework */
    var class_hidden = param_class_hidden;



    /** Test browser support */
    if ('speechSynthesis' in window) {
        $('#' + speak_button_id).click(function() {
            if (window.speechSynthesis.speaking === false) {
                /**
                 * Chrome would stop speaking after 200-300 characters
                 * This fix splits the text into chunks of sentences
                 * http://stackoverflow.com/a/26238763
                 */
                // begin - code modified by author
                var sayit = function () {
                    var msg = new SpeechSynthesisUtterance();
                    msg.voiceURI = 'native';
                    msg.volume = param_volume; // 0 to 1
                    msg.rate = 1; // 0.1 to 10
                    msg.pitch = 1; //0 to 2
                    msg.lang = param_lang; // select language

                    msg.onstart = function (event) {
                        // format start/stop on start
                        volumeUp();
                    };

                    msg.onend = function(event) {
                        // format start/stop on end
                        volumeOff();
                    };

                    msg.onerror = function(event) {
                        console.log('Error: ' + event);
                    };

                    return msg;
                };

                // if there is an error, this clears it out.
                speechSynthesis.cancel();
                // end

                var text = "";
                /**
                 * gather paragraphs to read.
                 * sometimes getElementsByClassName does not get classes from
                 * top to bottom, but mixes classes up.
                 */
                var collection = 
                    document.getElementsByClassName(class_to_read);

                // http://stackoverflow.com/a/3871602
                Array.prototype.forEach.call(collection, function(el) {
                    /** append all class contents to text */
                    text = text + el.innerHTML;

                    /**
                     * important for enumerations, otherwise voice will lisp
                     */
                    text = text + '.';
                });

                // debug input text here to compare to output
                // console.log(text);

                /**
                 * replace ! or ? with '.'
                 * speaker doesn't know expressions anyway, at least pause
                 */
                text = text.replace(/[\!?$]/g, '.');

                /** remove new lines */
                text = text.replace(/\n/g, '');
                /** remove multiple whitespaces */
                text = text.replace(/\.\s+/g, '. ');

                /** replace empty sentences and prevent lisping */
                text = text.replace(/\.+/g, '.');

                /** remove last full stop, otherwise it will lisp */
                if(text.substring(text.length - 1) == '.')
                    text = text.substring(0, text.length - 1);

                /** sounds nicer for enumerations */
                text = text.replace(/<\/li>/g, '.');

                /** extra waiting time after paragraphs */
                //text = text.replace(/<\/p>/g, '.');

                /** make pause after headings */
                text = text.replace(/<\/h[1-6]>/g, '.');

                /** ignore visual & (amp;) */
                text = text.replace(/amp;/g, '');

                /** ignore references in reading */
                text = text.replace(/<sup>(.*?)<\/sup>/g, '');

                /** pause on enumerations */
                text = text.replace(/&/g, '.&.');

                /** remove leading and trailing whitespaces */
                text = text.trim();

                /**
                 * remove all HTML tags from string so they won't be said
                 * http://stackoverflow.com/a/5002161
                 */
                text = text.replace(/<\/?[^>]+(>|$)/g, '');

                /** console output */
                console.log("PZEasyWebSpeech READING: " + text);

                // begin
                var sentences = text.split(".");

                for (var i=0; i< sentences.length; i++) {
                    var toSay = sayit();
                    toSay.text = sentences[i];
                    speechSynthesis.speak(toSay);
                }
                // end
            } else {
                /** stop talking */
                window.speechSynthesis.cancel();
            }
        });
    /** browser does not support speech */
    } else {
        /** hide and disable all elements with speak_button_id */
        volumeHideAndDisable();
    };


    /**
     * When a page is loaded, no one should be talking!
     * FIXME: Does not always work - browser issue!?
     */
    window.onload = function() { 
        window.speechSynthesis.cancel();
        return;
    }

    /**
     * volumeUp
     * called when speech is activated
     */
    function volumeUp() {
        // console.log("volumeUp called");
        document.getElementById(speak_button_id).classList
            .remove(class_not_speaking);
        document.getElementById(speak_button_id).classList.add(class_speaking);
    }

    /**
     * volumeOff
     * called when speech is stopped
     */
    function volumeOff() {
        // console.log("volumeOff called");
        document.getElementById(speak_button_id)
                .classList.remove(class_speaking);
        document.getElementById(speak_button_id)
                .classList.add(class_not_speaking);
    }

    /**
     * volumeHideAndDisable
     * called when speech is not supported by browser
     */
    function volumeHideAndDisable() {
        document.getElementById(speak_button_id).classList.add(class_hidden);
        document.getElementById(speak_button_id)
            .setAttribute('disabled', 'disabled');
    }
}
