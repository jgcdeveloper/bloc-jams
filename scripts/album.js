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
    
    var $row = $(listTemplate);
    
    var clickHandler = function(){
    
        var $cellNumber = $(this).attr("data-song-number")
        
        if (currentlyPlayingSong === null) {
        //If no song is playing, clicking on the row will start playing the song (to be added) and place a pause button. It will also store the current song number into the global currentlyPlayingSong variable.
        
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSong = $cellNumber;
        
        } else if (currentlyPlayingSong === $cellNumber) {
        //If the row is clicked on matches the currently playing song, the playing song will stop, the play button template will be replaced, and the currentlyPlayingSong is placed back to null. Actually, its more like a stop button, not a pausebutton.
            $(this).html(playButtonTemplate);
            currentlyPlayingSong = null;
         
        } else if (currentlyPlayingSong !== $cellNumber) {
        
        //If we click on a different row while a song is playing on another row, we try to find which song is being played. We select that node and overwrite it to its generic name. We then place the pause button on the new element.
            
            //use the [attr=value] to select a specific attribute within the selected .song-item-number class. Here we will search for an attribute data-song-number = ' + currentlyPlayingSong + '
            
            var $currentSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
            $currentSongElement.html(currentlyPlayingSong);
                 
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSong = $cellNumber;
        }
    };
    
    var onHover = function(event) {
    
        //get the song item number
        var songCell = $(this).find(".song-item-number");
        
        //get the current attribute of data-song number
        var cellNumber = songCell.attr("data-song-number");
            
        
        if (cellNumber !== currentlyPlayingSong){
            //use .html instead of .text append to rewrite the inner HTML in song-item-number
            songCell.html(playButtonTemplate);
        }
    }
    
    var offHover = function(event) {
        
        //get the song item number
        var songCell = $(this).find(".song-item-number");
        
        //get the current attribute of data-song number
        var cellNumber = songCell.attr("data-song-number");
            
        if (cellNumber !== currentlyPlayingSong){
            //Append .html again to rewrite the inner HTML back to original  
            songCell.html(cellNumber);
        }
    }
        
    //This adds a click handler to all .song-item-number nodes that are in our listTemplate.
    $row.find('.song-item-number').click(clickHandler);
    
    //This adds our hover events for the row nodes in our listTemplate.
    $row.hover(onHover,offHover);
    return $row;
};

 var setCurrentAlbum = function(album) {
     
     // Add our selectors for 5 main elements into the function (improve readibility). Note we will only have one album per page, so we select the first node with our class selector using [0]
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     //Remember that the text node is actually a child node of the parent element. In these selections we have simple elements where text is the first node. Therefore, we need to use the .firstChild to be able to use
     $albumTitle.text(album.title); //remember .notation for accessing properties of obj 
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     
     //we use setAttribute to set an attribute of what we have selected, in this case instead of changing the text, we are setting the src attribute (within the <img> tag in the HTML) to specify the URL of the image.
     $albumImage.attr('src', album.albumArtUrl);
 
     //We clear out the inner HTML of our song listing to make sure we start with a clean slate for our template
     $albumSongList.empty();
 
     //We call a for loop to cycle through all the songs(titles/durations) and pass them to create row template
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
// This adds the 'ion-play' playbutton icon to our playButtonTemplate. This is part of the ionian library. 

var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
//This adds the pause button template which we will use while a song is playing. Note, as per the video color scheming will be similar to the play button, so we will give this the same class name as our play button. That way the way the buttons will keep the same color scheme.

var currentlyPlayingSong = null;


$(document).ready (function() {
    setCurrentAlbum(albumPicasso);
});
