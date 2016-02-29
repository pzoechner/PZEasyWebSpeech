# PZEasyWebSpeech

This JS-file makes it really easy to add speech support to your website. As a workaround for Chrome Browser, the speech is stopped after every full stop. To enhance the quality of speech, several (mostly closing) HTML-Tags are converted to full stops - feel free to add your own by modifying the "text" variable.

## Example
An example of what the library does (V1.0.0) can be found [here](http://fh.zoechner.com/branson/career/overview/).

## Usage
The included [index.html](https://github.com/pzoechner/PZEasyWebSpeech/blob/master/index.html) shows an implementation of the library.

### 1) Start/Stop Button
Add a custom class (here `toggle-speak-stop`) to the start/stop button element, defined as the first argument of the initialization.

### 2) Text to Read
To define what text should be read, add the `text-to-read` class to your paragraph or div. All HTML-Tags will be stripped from the string, so only the contained text will be read.

### 3) Initialization
Add this at the end of your HTML.
```javascript
PZEasyWebSpeech(
  "toggle-speak-stop", // the id of the start/stop element
  "text-to-read",      // the class name of which elements should be read
  "fa-volume-up",      // class added to start/stop element when starting speech
  "fa-volume-off",     // class added to start/stop element when ending speech 
  "hidden",            // class added to start/stop in case browser does not support speech and start/stop should be hidden
  "en-GB",             // language eg.: "en-GB", "en-US", "de-DE", etc
  1                    // volume, 0 to 1
);
```
