//Creating albums via object literals using { } notation for code section
var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    //Creating an array of song titles
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
};
 
//Second Example Album created with Object Literals
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};

var createSongRow = function(songNumber,songName,songLength){
    var listTemplate =
        '<tr class="album-view-song-item">'
        //Here we use a data attribute to store the ' + songNumber + ' into a data attribute that can be retreived at a later time. Because we overwrite the innerHTML to place the play button, the data attribute will remain for retrieval later.     
      + '    <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '    <td class="song-item-title">' + songName + '</td>'
      + '    <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
    return listTemplate;
};

 var setCurrentAlbum = function(album) {
     
     // Add our selectors for 5 main elements into the function (improve readibility). Note we will only have one album per page, so we select the first node with our class selector using [0]
     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     var albumImage = document.getElementsByClassName('album-cover-art')[0];
     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
 
     //Remember that the text node is actually a child node of the parent element. In these selections we have simple elements where text is the first node. Therefore, we need to use the .firstChild to be able to use
     albumTitle.firstChild.nodeValue = album.title; //remember .notation for accessing properties of obj 
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     
     //we use setAttribute to set an attribute of what we have selected, in this case instead of changing the text, we are setting the src attribute (within the <img> tag in the HTML) to specify the URL of the image.
     albumImage.setAttribute('src', album.albumArtUrl);
 
     //We clear out the inner HTML of our song listing to make sure we start with a clean slate for our template
     albumSongList.innerHTML = '';
 
     //We call a for loop to cycle through all the songs(titles/durations) and pass them to create row template
     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     }
 };


var findParentByClassName = function(targetToFind, elementToSearch) {
    if(!elementToSearch){
        alert("That element does not exist");
        return;
        
    }else if(elementToSearch.parentElement == null) {
    //checks to see if the element called has a parent. If not alerts error message.
        
        alert("No parent found");
        return;
    
    } else {
    //if the element exists, and it has a parent, we will execute this code.
    
        var currentParent = elementToSearch.parentElement;
       
        //sets the currentParent = the parent of the current element passed into the function.
        
        while (currentParent.className != targetToFind && currentParent.className !== null) {
        //If that parentName is not equal to our target class to find, the while loop will execute, and it will keep going up the chain of parents until the element matches the target element. Also, once it gets to the top, if you return on the topmost element, you will see a null, so it also will only execute the loop as long as there is not null stored in currentParent. This is the second part of the implimentation I did not get on my initial attempt.
            
            if (currentParent === document.documentElement){ 
            //every time it loops, we do a check to see if we are at the top level of the document (the HTML element, defined by .documentElement). If we are, we assume no parent was found and return the error message to the user. If we wait until next step, we get into a situation where the loop will try and execute currentParent = currentParent.parentElement on a null value, which will generate a typeOf error.
                alert("No parent found with that class name" ); 
                return;
            }
            currentParent = currentParent.parentElement;
            //Looks up the DOM elements, each time getting the parent of the one before it until the loop stops.
        }
        return currentParent;
    }
};

var getSongItem = function(element){
    
    switch(element.className) {
        //#1 - These three are the childs of the 'song-item-number' class, if we find these, we need to go up to the parent element
        case "ion-play":
        case "ion-pause":
        case "album-song-button":
            return findParentByClassName("song-item-number", element);    
        
        //#2 - This is the parent row, we have called this album-view-song-item. If we find this, we need to select the child song-item-number. We can do this with a querySelector.
        case "album-view-song-item" :
            return element.querySelector(".song-item-number");
        
        //#3 - These are the other table data elements. If we find them, we need to find their parent, which will be the containing table (album-view-song-item). Then we need to select the actual child we want, which is "song-item-number".
        case "song-item-duration":
        case "song-item-title":
            return ( findParentByClassName("album-view-song-item", element) ).querySelector(".song-item-number");
        
        //#4 - This case is if we actually click on the correct element. Claim a prize.
        case "song-item-number":
            return element;
        
        //#5 - A default case if the songItem cannot be found.
        default:
            alert("Something went wrong... call your friendly neighbourhood coder");
            return;
    }
};

var clickHandler = function(targetElement) {

    var songItem = getSongItem(targetElement);
    //As this is called from a click handler, the event target will be passed in. This will then find the current song-item-number for whatever element was clicked and store it in the songItem variable.
    
    if (currentlyPlayingSong === null) {
    //If no song is playing, clicking on the row will start playing the song (to be added) and place a pause button. It will also store the current song number into the global currentlyPlayingSong variable.
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
         
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
    //If the row is clicked on matches the currently playing song, the playing song will stop, the play button template will be replaced, and the currentlyPlayingSong is placed back to null. Actually, its more like a stop button, not a pausebutton.
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
         
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
    //If we click on a different row while a song is playing on another row, we create a new variable to store the currently playing song element location. We then overwrite that element with the generic number, basically reverting it to normal. Then we call the pauseButtonTemplate on the new row. Finally, we push to the currentlyPlayingSong variable with the new song number that we are playing.
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
};


var SongListContainer = document.getElementsByClassName('album-view-song-list')[0];
// Creates a container to hold our pointer to get the first instance of our table => 'album-view-song-list'

var songRows = document.getElementsByClassName('album-view-song-item');
// Creates a list of all the song rows. Note we created our <tr> with the class 'album-view-song-item'

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
// This adds the 'ion-play' playbutton icon to our playButtonTemplate. This is part of the ionian library. 

var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
//This adds the pause button template which we will use while a song is playing. Note, as per the video color scheming will be similar to the play button, so we will give this the same class name as our play button. That way the way the buttons will keep the same color scheme.

var currentlyPlayingSong = null;

window.onload = function() {
    setCurrentAlbum(albumPicasso);
    
    SongListContainer.addEventListener("mouseover", function(event){
    //add a mouseover event listener to our album-view-song-list class. Event will fire whenever mousing over any element in album-view-song-list
        
        if(event.target.parentElement.className === "album-view-song-item") {
        //This line does a check. It lookts to see if the currently selected event.target has a parent element of "album-view-song-item" (the class of our table row). Therefore, the code inside the if block will only execute for elements with that parent. So this effect will only occur for the table row element and its children.
            
            var songItem = getSongItem(event.target);
            //Takes the target element from the Event Listener, and calls getSongItem. This will point towards the song-item-number element of the current row when mousing over ANY element on that row.
            
            if(songItem.getAttribute("data-song-number") !== currentlyPlayingSong){
            //This will get the attribute of the currently selected song-item-number and compare to what is stored in the currentlyPlayingSong variable. If the contents do not match, we will return TRUE and the IF code will execute to change the innerHTML of the songItem to be the play button. If it is the currently playing song, there should be a pause button in this spot, and we do not want to overwrite that, so the if code will not execute. 
                songItem.innerHTML = playButtonTemplate;
            }
        }
    });
    
    for (var i = 0; i < songRows.length; i++) {
    //This will create a loop equal to the number of song rows we have    
        songRows[i].addEventListener("mouseleave", function(event) {
        //This will create an Event Listener for all current song rows. When the mouseleave event fires, the function is called.
            var songItem = getSongItem(event.target),
                songItemNumber = songItem.getAttribute("data-song-number");
            //sontgtem will store the specific song-item-number for the event that has been fired, and sontItemNumber will then store the data attribute from that specific song-iten-number for comparison.
            
            if (songItemNumber !== currentlyPlayingSong){
            //we compare what is in our songItemNumber with what is currently playing. If they match, then the IF code will not execute, and the innerHTML of our current songItem will not be overwritten. Therefore, if we have a pause button, leaving the area will not delete it by replacing it with the stored data-song-number value    
                songItem.innerHTML = songItemNumber;
             }
            
        });
        
        songRows[i].addEventListener("click", function(event){
        //This simple line of code actually handles our click event. Upon clicking, we will call a function that will do one of several things.
            clickHandler(event.target);    
        });
     }
}
