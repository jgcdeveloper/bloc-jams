var animatePoints = function () {
            
    /* This creates an array of element nodes (called a NodeList) of the .point class elemets. We can then access the individual element using index notation */
    var points = document.getElementsByClassName('point');
            
    
<<<<<<< HEAD
    /* When these are written into the CSS, they will animate between the two states using the transition coding in the CSS file. */
=======
    /* When these are written into the CSS, they will animate between the two states using the transition coding in the CSS file. No return, so we are calling this function for it's side effects only */
    
    var revealPoint = function(arr){
        for(var i = 0; i < arr.length; i++){
            points[i].style.opacity = 1;
            points[i].style.transform = "scaleX(1) translateY(0)";
            points[i].style.msTransform = "scaleX(1) translateY(0)";
            points[i].style.WebkitTransform = "scaleX(1) translateY(0)";    
        }    
    };
    
    
    /* Old code changed for Assignment 08 - Left for reference for checkpoint 08. Can be removed
    once submission has been approved.
    
    
>>>>>>> assignment-cp08-refactoring
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
    
<<<<<<< HEAD
    /* This will call the reveal functions before our animate function ends */
=======
>>>>>>> assignment-cp08-refactoring
    revealFirstPoint();
    revealSecondPoint();
    revealThirdPoint();
    
    */
    
    revealPoint(points);
};