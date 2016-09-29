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
    
        var cellNumber = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber === null) {
        //If no song is playing, clicking on the row will start playing the song (to be added) and place a pause button. It will also store the current song number into the global currentlyPlayingSong variable.
        
            $(this).html(pauseButtonTemplate);
            setSong(cellNumber);
            currentSoundFile.play();
            updatePlayerBarSong();
                    
        } else if (currentlyPlayingSongNumber == cellNumber) {
        //If the row is clicked on matches the currently playing song, the playing song will stop, the play button template will be replaced, and the currentlyPlayingSong is placed back to null. Actually, its more like a stop button, not a pausebutton.
            $(this).html(playButtonTemplate);
            
            //Check if paused
            if(currentSoundFile.isPaused()){
                currentSoundFile.togglePlay();
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            } else {
                currentSoundFile.togglePlay();
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }
                        
        } else if (currentlyPlayingSongNumber != cellNumber) {
        
        //If we click on a different row while a song is playing on another row, we try to find which song is being played. We select that node and overwrite it to its generic name. We then place the pause button on the new element.
            
            //use the [attr=value] to select a specific attribute within the selected .song-item-number class. Here we will search for an attribute data-song-number = ' + currentlyPlayingSong + '
                        
            var $currentSongElement = getSongNumberCell(currentlyPlayingSongNumber);
            $currentSongElement.html(currentlyPlayingSongNumber);
                 
            $(this).html(pauseButtonTemplate);
            setSong(cellNumber);
            
            currentSoundFile.play(); //starts playing the new song
                       
            updatePlayerBarSong();
            
        }
    };
    
    var onHover = function(event) {
    
        //get the song item number
        var songCell = $(this).find(".song-item-number");
        
        //get the current attribute of data-song number
        var cellNumber = parseInt(songCell.attr("data-song-number"));
                
        if (cellNumber !== currentlyPlayingSongNumber){
            //use .html instead of .text append to rewrite the inner HTML in song-item-number
            songCell.html(playButtonTemplate);
        }
    }
    
    var offHover = function(event) {
        
        //get the song item number
        var songCell = $(this).find(".song-item-number");
        
        //get the current attribute of data-song number
        var cellNumber = parseInt(songCell.attr("data-song-number"));
            
        if (cellNumber !== currentlyPlayingSongNumber){
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
     
    currentAlbum = album; //stores this album into the currentAlbum variable
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

var setSong = function(songNumber){
    
    //Stops the song if a song is playing
    if (currentSoundFile) {
         currentSoundFile.stop();
    }
    
    //sets the song. Checks if null was passed in and set to null in this case
    currentlyPlayingSongNumber = parseInt(songNumber);
    songNumber == null ? currentSongFromAlbum = null : currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    //create a new sound file with a buzz object
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        preload: true
    });
    
    setVolume(currentVolume);
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
     }
};

var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var updatePlayerBarSong = function(){
        
    $(".song-name").text(currentSongFromAlbum.title); //Change our song name
    $(".artist-name").text(currentAlbum.artist);
    $(".artist-song-mobile").text(currentAlbum.artist + " - " + currentSongFromAlbum);
    $('.main-controls .play-pause').html(playerBarPauseButton);
}

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var nextSong = function(){
    
    //Do nothing if no song is playing
    if(currentSongFromAlbum !== null){ 
    
        //Get the current track index.. 
        var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        
        //Increment the current index
        currentSongIndex++;
    
        //Is the incremented currentSongIndex greater then the length of songs, if so wrap currentSongIndex back to zero
        currentSongIndex >= currentAlbum.songs.length ? currentSongIndex = 0 : currentSongIndex;
            
        //Update our currentSong and currentlyPlayingSongNumber variables. Play music!
        setSong(currentSongIndex + 1);
        currentSoundFile.play();
            
        //Update the NEW currentlyPlayingSong icon to a pause button
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    
        //Set the PREVIOUS song back to a number from the icon  
        var prevSong = currentlyPlayingSongNumber == 1 ? currentAlbum.songs.length : currentSongIndex;
        getSongNumberCell(prevSong).html(prevSong);
        
        //Update player bar
        updatePlayerBarSong();
    }
};
    
var previousSong = function(){
    
    //Do nothing if no song is playing
    if(currentSongFromAlbum !== null){ 

        //Get the current track index.. 
        var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        
        //Increment the current index
        currentSongIndex--;
    
        //Roll songIndex back to song length (-1 for the index from length) if at 0, else keep the number
        currentSongIndex < 0 ? currentSongIndex = currentAlbum.songs.length - 1 : currentSongIndex;
                
        //Update our currentSong and currentlyPlayingSongNumber variables. Play Music!
        setSong(currentSongIndex + 1);
        currentSoundFile.play();
    
        //Update the NEW currentlyPlayingSong icon to a pause button
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    
        //Set the PREVIOUS song back to a number from the icon  
        var prevSong = currentlyPlayingSongNumber == 5 ? 1 : currentlyPlayingSongNumber + 1; //use songIndex as currentPlayingSongNumber is string
        getSongNumberCell(prevSong).html(prevSong); 
          
        //Update player bar
        updatePlayerBarSong();
            
    }
};

// This adds the 'ion-play' playbutton icon to our playButtonTemplate. This is part of the ionian library. 
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

//This adds the pause button template which we will use while a song is playing. Note, as per the video color scheming will be similar to the play button, so we will give this the same class name as our play button. That way the way the buttons will keep the same color scheme.
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var playerBarPlayButton = '<span class="ion-play"></span>'; //Play icon for player bar
var playerBarPauseButton = '<span class="ion-pause"></span>'; //Pause icon for player bar

var currentlyPlayingSongNumber = null;
var currentAlbum = null;
var currentSongFromAlbum = null;

var currentSoundFile = null;
var currentVolume = 80;


var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready (function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});
