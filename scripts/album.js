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
        '    <tr class="album-view-song-item">'
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
 
var SongListContainer = document.getElementsByClassName('album-view-song-list')[0];
// Creates a container to hold our pointer to get the first instance of 'album-view-song-list'
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
// This adds the 'ion-play' playbutton icon to our playButtonTemplate. 

window.onload = function() {
    setCurrentAlbum(albumPicasso);
    
    SongListContainer.addEventListener('mouseover', function(event){
    //add a mouseover event listener to our album-view-song-list class. Event will fire whenever mousing over any element in album-view-song-list
        //console.log(event.target)
        //the target property stores where the event occured. As you mouse over the element, element where event is dispached will be displayed
        
        if (event.target.parentElement.className === 'album-view-song-item') {
        //This restricts the event target only to the individual song rows    
            event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
            //This changes the content of the inner HTML for song-item-number to our playButtonTemplate. We use querySelector as this will only select one element at a time 
         }
   
    });
 
    for (var i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function(event) {
        //This loop will add a mouseleave listener to all elements with a album-view-song-item class 
            this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
            //This will overwrite the innerHTML with what we stored in the data attribute data-song-number, which was the original content before changing the button. We acces the first child element. 
        });
     }
}
