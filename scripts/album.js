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

//Second Example Album created with Object Literals
var albumEssentialTchaikovsky = {
    title: 'Essential Tchaikovsky',
    artist: 'Peter Ilyich Tchaikovsky',
    label: 'Decca',
    year: '2002',
    albumArtUrl: 'assets/images/album_covers/22.png',
    songs: [
        { title: 'Tchaikovsky: Piano Concerto No.1 In B Flat Minor, Op.23, TH.55 - 1. Allegro non troppo e molto maestoso', duration: '9:04' },
        { title: 'Tchaikovsky: Romeo and Juliet, Fantasy Overture - TH.42 - Love Theme', duration: '5:01' },
        { title: 'Tchaikovsky: Symphony No. 6 In B Minor, Op. 74, TH.30 - 1. Adagio - Allegro non troppo (excerpt)', duration: '2:35'},
        { title: 'Tchaikovsky: Swan Lake, Op.20 Suite - 1. Scene - Swan Theme', duration: '7:09' },
        { title: 'Tchaikovsky: Swan Lake, Op.20 Suite - 3. Danse des petits cygnes', duration: '1:30'},
        { title: 'Tchaikovsky: Sextet in D minor, Op.70 - "Souvenir de Florence"', duration: '7:50'}
    ]
};

var createSongRow = function(songNumber,songName,songLength){
    var listTemplate = 
        '<tr class="album-view-song-item">'
      + '    <td class="song-item-number">' + songNumber + '</td>'
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
//Set global variables to control album is display. First we have a list of albums in an array. Second we have the name of the album we wish to display first. Third is the index of that variable in the array. Note that this is what the function will increment upon call to change which album displayed.

var albumList = [albumPicasso,albumMarconi,albumEssentialTchaikovsky], 
    displayFirst = albumPicasso,
    albumIndex = albumList.indexOf(displayFirst)  
;

var changeAlbum = function(){
    (albumIndex == albumList.length-1 ? albumIndex = 0 : albumIndex++ ) //resets the loop once we are at array end
    setCurrentAlbum(albumList[albumIndex]); //trigger the new album to display   
};

 window.onload = function(){
     setCurrentAlbum(albumList[albumIndex]);
     /*This is the listener I add to the album art, so that clicking on it will change the album that is displayed*/
     document.getElementsByClassName('album-cover-art')[0].addEventListener("click", changeAlbum);
 };
