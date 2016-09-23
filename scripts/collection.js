var buildCollectionItemTemplate = function() {
    
    var template =
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
    //future proofing template by wrapping it in a $(), w 
    return $(template);
    
$(window).load(function() { //This will execute function upon loading of the webpage
    
    var $collectionContainer = $('.album-covers');
    
    $collectionContainer.empty(); 
    
    for(var i = 0; i < 12; i++){
        /* This loop will add 12 templates of our albums to the collections page using the += indicator. Note that we know collectionContainer is blank from the line above. Dynamic Layout is controlled in code contained in our CSS file which will affect the classes in our template, so we can ensure everything will be spaced correctly. */
        var $newThumbnail = buildCollectionItemTemplate();
        $collectionContainer.append($newThumbnail);
    }
});