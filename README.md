NovelScriptJS
=============

# Summary

Ever wanted a framework to write quick and easy visual novels?  Well now's your chance!

This framework is about as light weight as I could make it, and is still unstable.  However, please feel free to file bug reports if your NovelCanvas does not function the way you expect it to.

# Getting Started

Alright! Let's get started.

    <script type="text/javascript" src="NovelScript(.min).js"></script>

This is what you will need to add to your HTML page to include NovelScript in your app.  Don't forget the html5 doctype:

    <!DOCTYPE html>

Next, after the script is loaded, it's time to create a new NovelCanvas object.

    <div id="target"></div>
    <script type="text/javascript">
        var nc = NovelScript.NovelCanvas(options);
    </script>

## Options

These are all your options.  Note that the library does type checking and will overwrite your options if the type is incorrect.

    var options = {
        target: "target",//Required: This is the element id of the target
        fontSize: 20, //Not required, default is 20.
        font: "Palatino Linotype", //Optional: This is the font name default: "Palatino Linotype"
        history: [/*this is an array of slides*/], //Default is []
        noResize: false, //Not required, defualt is false.  This property prevents the resizing of actor images.
        width: 800, //Not necessarily required. 800 is default.
        height: 600, //Not necessarily required. 600 is default.
        slides: [/*this is an array of slides*/], //default is []  You can set this later before the novelscript starts
        variables: {}, //Not required, this is an object with all the variables you want to save inside your novelscript
        images: {} 
        //Required.  This property accepts a string, an array, or an object.  If the type is a string, it grabs all the images 
        //out of the element id specified by the string and injects them into the novelcanvas in an invisible span.  
        //Note: this removes the images from the dom.
        //If it's an object, it enumerates the properties and injects a new image into the dom inside an invisible span 
        //with the element's id as the property name.
        //The only acceptable array parameter is an array of strings.  Each string is treated like a URL and it 
        //injects an array of images into the dom inside an invisible span
 
        onload: function(NovelScriptObject){
        },// Not required, it's called after the images are loaded.
        actors: [], //Optional: this is an array of strings specified by the id's of the images provided in the 
        // image hash/image id's/image index of the images property
        // This property is used for rendering the images onto the novelcanvas
        background: "#EEEEEE", //Optional: This is the background property for the novelcanvas, it represents 
        // either a color hash, or an image id.  Every background will be stretched to the size of the novelcanvas 
        // for convenience purposes
        text: "", //Optional: This is a string of text to be displayed on the screen by the novelcanvas
        preventDefaultDraw: false //Optional: Default: false, this property when set to true will prevent 
        //the defaultDraw() function from running, providing you with complete control over the drawing of the 
        //context inside the NovelCanvas
    };

## API

Can't do this now.
