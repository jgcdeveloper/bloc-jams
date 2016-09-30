var createSongRow = function(songNumber,songName,songLength){
    
    var listTemplate =
        '<tr class="album-view-song-item">'
        //Here we use a data attribute to store the ' + songNumber + ' into a data attribute that can be retreived at a later time. Because we overwrite the innerHTML to place the play button, the data attribute will remain for retrieval later.     
      + '    <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '    <td class="song-item-title">' + songName + '</td>'
      + '    <td class="song-item-duration">' + songLength /* filterTimeCode(songLength) */ + '</td>'
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
            updateSeekBarWhileSongPlays();
            updatePlayerBarSong();
                    
        } else if (currentlyPlayingSongNumber == cellNumber) {
        //If the row is clicked on matches the currently playing song, the playing song will stop, the play button template will be replaced, and the currentlyPlayingSong is placed back to null. Actually, its more like a stop button, not a pausebutton.
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
            
            updateSeekBarWhileSongPlays();
            updatePlayerBarSong();
            
        }
        
        var myVolume = currentVolume + "%",
            $volBar = $('.player-bar .volume');
        
        $volBar.find('.fill').css("width",myVolume);
        $volBar.find('.thumb').css("left",myVolume);
        
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

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile){  //If a song is playing, this code will execute
        
        //Time update is a custom buzz events that constantly fires with the time of the song.
        currentSoundFile.bind('timeupdate', function(event) {
            //getTime is the time of the currently playing sound file. getDuration is the total song length. We use these to calculate ratio
            var seekBarFillRatio = this.getTime() / this.getDuration();
            
            //set our variable to hold selector for current seek bar.
            var $seekBar = $('.seek-control .seek-bar');
            
            //update seek percentage of the currently clicked seek bar with the ratio we calculated
            updateSeekPercentage($seekBar, seekBarFillRatio);
            
            //Update current time on the seek bar. This sends the current time in seconds, function will update in minutes
            setCurrentTimeInPlayerBar(this.getTime());
        
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    
    var offsetXPercent = seekBarFillRatio * 100; //converts ratio to a percentage
    
    //Use Math.max and Math.min to make sure numbers dont exceed required value. Math.max returns the largest of zero or more numbers. Since we give 0, along with other arguments that will always be the minimum value. Math.min returns the smallest of the numbers. Since we have 100, anything more then 100 will result in 100.
    offsetXPercent = Math.max(0, offsetXPercent); 
    offsetXPercent = Math.min(100, offsetXPercent); 
 
    var percentageString = offsetXPercent + '%'; //Gives us a percentage as a string with percent on the back of it
    
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

var setupSeekBars = function() {
    
    var $seekBars = $('.player-bar .seek-bar'); //This selects our seek-bar class
 
    $seekBars.click(function(event) {
        
        var currentBar = $(this).parent().attr("class"); //This stores our parent class name, for use in conditonal control.
        
        //The pageX variable stores the x-coordinate where the click occured. We subtract the offset from the left side where the seek bar that called the function is positioned. This gives us an indicator of how far in our seek bar is.
        var offsetX = event.pageX - $(this).offset().left; 
        
        //We divide the barWidth by the offset to determine our seek bar fill ratio.
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;

        if(currentBar == 'seek-control'){
            seek(seekBarFillRatio * currentSoundFile.getDuration());       
        } else {
            setVolume(seekBarFillRatio * 100);  
        }
                        
        //we call updateSeekPercentage with $(this), which will give us a pointer to the seek bar that was clicked, and the calculated seek bar fill ratio. This will work for either seek bar, as this click event listener was placed on both seek bars
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    
    //create a mousedown event when mouse is pressed on .thumb. This event is active while the mouse is pressed down.
    $seekBars.find('.thumb').mousedown(function(event) {
        
        //In this case, $(this) will be equal to the thumb node that was clicked. However, since we want to actually select the specific seek bar that the thumb is attached to, we find it using .parent().
        var $seekBar = $(this).parent();
        var currentBar = $(this).parent().attr("class"); //This stores our parent class name, for use in conditonal control.
 
        //.bind is a jQuery method that attaches an event handler to all elements. We do this similar to an event listener, with a string (in this case 'mousemove') We bind to $(document), which allows us to move the mouse even off the seek bar. This makes things smoother, elsewise the moment we moved off the seek bar we would lose our drag. The .thumb after our mousemove is called namespacing. Because we are attaching our mousemove to the whole document, we add namespacing by way of the .thumb to ensure that the seekbar would move only if we include the .thumb string. Note, although it lookes similar to a CSS selector, it is not.
        
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left; //again calculate our offset as we drag the mouse
            var barWidth = $seekBar.width(); //again, set the whole length of the seek bar that was clicked
            var seekBarFillRatio = offsetX / barWidth; //Caclulate the seekbar ratio
 
            if(currentBar == 'seek-control'){
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio * 100); 
            }
             
            updateSeekPercentage($seekBar, seekBarFillRatio); //send the seekbar ratio back to the undateSeekPercentage function
        });

        //again, we add for the whole document, so cursor doesnt have to be directly over the seek bar when released for the new bind to work. We bind a function that actually unbinds the mousemove.thumb and mouseup.thumb functions
        $(document).bind('mouseup.thumb', function() {  
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
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
        preload: true,
        loop: false
    });
    
    setVolume(currentVolume);
    
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
     }
}

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
     }
};

var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var setCurrentTimeInPlayerBar = function(currentTime){
    var currentTimeInMinutes = filterTimeCode( currentTime );
    $(".seek-control .current-time").text(currentTimeInMinutes); //Writes over the current time of song in seek bar.
};

var setTotalTimeInPlayerBar = function(totalTime){
    var totalTimeInMinutes = filterTimeCode(totalTime);
    $(".seek-control .total-time").text(totalTimeInMinutes); //Writes over the total time of song in seek bar.
}

var filterTimeCode = function(timeInSeconds) {
    var minutes = Math.floor(timeInSeconds / 60),
        seconds = Math.floor(timeInSeconds - (minutes * 60));
    return (minutes + ":" + (seconds < 10 ? "0"+seconds : seconds )); 
};

var updatePlayerBarSong = function(){
        
    $(".song-name").text(currentSongFromAlbum.title); //Change our song name
    $(".artist-name").text(currentAlbum.artist); //Change our artist name
    $(".artist-song-mobile").text(currentAlbum.artist + " - " + currentSongFromAlbum); //Change both for mobile
    $('.main-controls .play-pause').html(playerBarPauseButton); //Adds a pause button.
    
    currentSoundFile.bind('loadedmetadata', function(event){  //I had to bind to solve issue with code executing before duration was loaded
        
        console.log("The duration is: " + this.getDuration());
        setTotalTimeInPlayerBar(this.getDuration()); 
    }); 
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
        updateSeekBarWhileSongPlays();
            
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
        updateSeekBarWhileSongPlays();
    
        //Update the NEW currentlyPlayingSong icon to a pause button
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    
        //Set the PREVIOUS song back to a number from the icon  
        var prevSong = currentlyPlayingSongNumber == 5 ? 1 : currentlyPlayingSongNumber + 1; //use songIndex as currentPlayingSongNumber is string
        getSongNumberCell(prevSong).html(prevSong); 
          
        //Update player bar
        updatePlayerBarSong();
            
    }
};

var togglePlayFromPlayerBar = function(){

    //Only execute code if a song is selected. Otherwise do nothing
    if(currentSongFromAlbum){
        
        if(currentSoundFile.isPaused()){
            currentSoundFile.togglePlay(); //Toggle playing
            $playPauseButton.html(playerBarPauseButton); //change to a play button
            getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
            
        } else {
            currentSoundFile.togglePlay(); //Toggle playing
            $playPauseButton.html(playerBarPlayButton); //change to a pause button
            getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
        }   
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
var currentVolume = 50;


var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');

$(document).ready (function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPauseButton.click(togglePlayFromPlayerBar);
    
});
