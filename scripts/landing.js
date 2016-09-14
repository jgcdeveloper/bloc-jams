var pointsArray = document.getElementsByClassName("point");
/* This will return a node list of all nodes that have the class name "point". While it is stored and accessed like an array (index notation), a node list does not have access to Array prototype functionality */

var animatePoints = function (points) {
/* We are defining animatePoints as a function which will initiate the animation we want for our points elements. */          
       
    var revealPoint = function(pointIndex){
    /* When these are written into the CSS, they will animate between the two states using the transition coding in the CSS file. No return, so we are calling this function for it's side effects only */
        points[pointIndex].style.opacity = 1;
        points[pointIndex].style.transform = "scaleX(1) translateY(0)";
        points[pointIndex].style.msTransform = "scaleX(1) translateY(0)";
        points[pointIndex].style.WebkitTransform = "scaleX(1) translateY(0)";
    };

    for(var i = 0; i < points.length; i++){
    /* This will set a loop to reveal the three points automatically by calling them upon execution of function */
        revealPoint(i);    
    }
    
};


window.onload = function() {
/* A window object represents the window containing the DOM document. It points to the document that is currently open in the window. In a tabbed browser, each tab is its own window and so is the overall window view. Some elements may reference the whole window and not the window tab, something to keep in mind */

/* window.onload is classed under global event handler, and we use it to trigger a function when the window's load event fires. In other words, the function will trigger when the contents of the window have fully loaded */  
    
    if (window.innerHeight > 950) {
    /* window.innerHeight will return the height of the browser viewport at the time it is called. It is read-only and has no default value. In this example we are checking if the size is greater then 950px, and if so the statement will return TRUE, and allow the if code to execute */
        
        animatePoints(pointsArray);/*This calls our animate object (if height = 950px) */
    }
    
    var sellingPoints = document.getElementsByClassName("selling-points")[0];
    /*This sets sellingPoints to the first node of the class "selling-points" */
    
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    /* .getBoundingClientRect() is an element method which returns the size of an element and its position in the viewport window. The returned object has the perameters left, top, right, bottom, x, y, width, height. Note that it is read only. Othen then width and height, everything is referenced to the top left of the viewport. Because of this, scrolling the window will result in changes to thse values. */
    
    /* In this example, we use .getBoundingClientRect().top to find the top value of our element. We then subtract the current height of the viewport. This will give us a value for how far the user must scroll before triggering the element. We add an offset of 200px so that we ensure at least part (200px) of the actual selling-point element is above the bottom of the viewport before the animation triggers */
    
    window.addEventListener("scroll", function(){
    /* target.addEventListener method registers a specific listener on the event target it is called on. In this case, we are adding it to the window target. Three arguments, including type, listener(with options), and useCapture. In this example we are only using two. Type, in this case "scroll", is a string indicating which type of event to listen for. Listener is the function that is listening, and then will execute, when the event occurs.
    */
         /* document.body will give is access to the <body> element box of our current document. documentElement gives us the root element of the document (usually HTML). In this case it should start from the same place. Then, the .scrollTop will give the position of the scrollbar for those elements. We compare those to the length calculated above as the distance the user needs to scroll for the animation trigger, and if those .scrollTops pass that then the animation is triggered. */
         if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
             animatePoints(pointsArray);   
         }
        
    });
}
