var collectionItemTemplate =
     '<div class="collection-album-container column fourth">' 
   + '   <img src="assets/images/album_covers/01.png"/>'
   + '   <div class="collection-album-info caption">'
   + '       <p>'
   + '           <a class="album-name" href="/album.html"> The Colors </a>'
   + '           <br/>'
   + '           <a href="/album.html"> Pablo Picasso </a>'
   + '           <br/>'
   + '           X songs'
   + '           <br/>'
   + '       </p>'
   + '   </div>'
   + '</div>'
   ;

window.onload = function() { //This will execute function upon loading of the webpage
    
    /* First we need to point where we want to load our new HTML template. So, .getElementByClassName will get an array of all elements with class of album-covers. We select the first element of it using [0]. Note though at this point we only have one. We assign this to variable collectionContainer, so this spot now stores the pointer to where we want*/
    var collectionContainer = document.getElementsByClassName('album-covers')[0]; 
    
    /* This will overwrite the innerHTML stored in our first 'album-covers' class (as pointed to by collectionContainer). This makes sure we start with a blank canvas */
    collectionContainer.innerHTML = ""; 
    
    for(var i = 0; i < 12; i++){
        /* This loop will add 12 templates of our albums to the collections page using the += indicator. Note that we know collectionContainer is blank from the line above. Dynamic Layout is controlled in code contained in our CSS file which will affect the classes in our template, so we can ensure everything will be spaced correctly. */
        collectionContainer.innerHTML += collectionItemTemplate; 
    }
}