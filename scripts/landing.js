var animatePoints = function () {
            
    /* This creates an array of element nodes (called a NodeList) of the .point class elemets. We can then access the individual element using index notation */
    var points = document.getElementsByClassName('point');
            
    
    /* When these are written into the CSS, they will animate between the two states using the transition coding in the CSS file. */
    var revealFirstPoint = function () {
        points[0].style.opacity = 1;
        points[0].style.transform = "scaleX(1) translateY(0)";
        points[0].style.msTransform = "scaleX(1) translateY(0)";
        points[0].style.WebkitTransform = "scaleX(1) translateY(0)";
    };
                
    var revealSecondPoint = function () {
        points[1].style.opacity = 1;
        points[1].style.transform = "scaleX(1) translateY(0)";
        points[1].style.msTransform = "scaleX(1) translateY(0)";
        points[1].style.WebkitTransform = "scaleX(1) translateY(0)";
    };
 
    var revealThirdPoint = function () {
        points[2].style.opacity = 1;
        points[2].style.transform = "scaleX(1) translateY(0)";
        points[2].style.msTransform = "scaleX(1) translateY(0)";
        points[2].style.WebkitTransform = "scaleX(1) translateY(0)";
    };
    
    /* This will call the reveal functions before our animate function ends */
    revealFirstPoint();
    revealSecondPoint();
    revealThirdPoint();
};