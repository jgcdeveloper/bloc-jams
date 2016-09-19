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


var findParentByClassName = function(targetClass, element) {
    if (element) {
        var currentParent = element.parentElement;
        while (currentParent.className != targetClass && currentParent.className !== null) {
            currentParent = currentParent.parentElement;
        }
        return currentParent;
    }
};

/*
var findParentByClassName = function(targetToFind, elementToSearch) {
    var theParentIs = elementToSearch.parentElement;
    while (currentParent.className != targetToFind) {
        currentParent = currentParent.parentElement;
    }
    return theParentIs;
};
*/

var getSongItem = function(element){
    console.log(element.classname);
    
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

     if (currentlyPlayingSong === null) {
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
         
     } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
         
     } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     }
};


var SongListContainer = document.getElementsByClassName('album-view-song-list')[0];
// Creates a container to hold our pointer to get the first instance of 'album-view-song-list'

var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
// This adds the 'ion-play' playbutton icon to our playButtonTemplate. 

var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
//This adds the pause button template which we will use while a song is playing. Note, as per the video color scheming will be similar to the play button, so we will give this the same class name as our play button. That way the way the buttons will keep the same color scheme.

 var currentlyPlayingSong = null;

window.onload = function() {
    setCurrentAlbum(albumPicasso);
    
    SongListContainer.addEventListener('mouseover', function(event){
    //add a mouseover event listener to our album-view-song-list class. Event will fire whenever mousing over any element in album-view-song-list
      
        //This restricts the event target only to the individual song rows  
        if(event.target.parentElement.className === 'album-view-song-item') {
            
            var songItem = getSongItem(event.target);
            
            if(songItem.getAttribute("data-song-number") !== currentlyPlayingSong){
                songItem.innerHTML = playButtonTemplate;
            }
          
       
         }
        
    });
    
    document.getElementsByClassName("song-item-number")[1].addEventListener('click', function(event){
        console.log(event.target);    
    });
    
    for (var i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener("mouseleave", function(event) {
            
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');
            
            if (songItemNumber !== currentlyPlayingSong){
                songItem.innerHTML = songItemNumber;
             }
            
            /* Old code left for reference
            //This loop will add a mouseleave listener to all elements with a album-view-song-item class 
            this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
            //This will overwrite the innerHTML with what we stored in the data attribute data-song-number, which was the original content before changing the button. We acces the first child element.
            */
        });
        
        songRows[i].addEventListener("click", function(event){
            clickHandler(event.target);    
        });
     }
}
