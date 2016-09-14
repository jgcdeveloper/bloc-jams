function forEach(myArray, myCallback){
/* Function to execute a callback. The function takes in an myArray, uses that to determine length of the for loop. Then the for loop executes. In the function loop, the myCallback function we passed in gets executed for each loop through, using the value of the current index in the array myArray[i] */
    
    for(var i=0; i < myArray.length; i++) {
        myCallback( myArray[i] );   
    }   

}
