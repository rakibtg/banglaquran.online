var chapter = 1;
var current_page = 1;
var total_pages = 1;
var banglaChapters;

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://staging.quran.com:3000/api/v3/chapters",
  "method": "GET",
  "headers": {},
  "data": "{}"
}

$.getJSON( "../data/chapters.json", function( data ) {
  banglaChapters = data.chapters;

  $.ajax(settings).done(function (response) {
    var ch = 0;
    for(let chapter of response.chapters) {
      $('#chapter-list').append(
      '<div id="'+chapter.chapter_number+'" class="chapter media text-muted pt-3">'+
        '<img data-src="holder.js/48x48?text='+chapter.chapter_number+'" alt="" class="mr-2 rounded">'+
        '<p class="media-body pb-3 mb-0 lh-125 border-bottom border-gray">'+
            '<span class="d-block text-gray-dark">'+chapter.name_arabic+'</span>'+
            '<span>'+banglaChapters[ch]+'</span>'+
        '</p>'+
      '</div>'    
      );
      ch++;
    }
  
    var myImage = $('img').get();
    Holder.run({
      images: myImage
    });  
  });  

});  


function getVerse(ch, pg){
  $('.item').fadeTo( "slow", 0.33 );
  chapter = ch;
  current_page = pg;
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://staging.quran.com:3000/api/v3/chapters/"+chapter+"/verses?recitation=1&text_type=words&translations=24&page="+current_page,
    "method": "GET",
    "headers": {},
    "data": "{}"
  }
  
  $.ajax(settings).done(function (response) {
    current_page = response.meta.current_page;
    total_pages = response.meta.total_pages;
    
    $('#chapter-list').html('');
    for(let verse of response.verses) {
      $('#chapter-list').append(
        '<div id="'+verse.verse_number+'" class="verse media text-muted pt-3">'+
          '<img data-src="holder.js/48x48?text='+verse.chapter_id+':'+verse.verse_number+'" alt="Ch:Ver" class="mr-2 rounded">'+
          '<p class="media-body pb-3 mb-0 lh-125 border-bottom border-gray">'+
              '<span class="d-block text-gray-dark">'+verse.text_indopak+'&nbsp;<span class="recite oi oi-media-play" title="icon name" aria-hidden="true" onclick="togglePlay(document.getElementById(\'verse-'+verse.verse_number+'\'), this)"></span></span>'+
              '<audio id="verse-'+verse.verse_number+'" src="'+verse.audio.url+'"></audio>'+              
              '<span class="d-block text-gray-dark">'+verse.translations[0].text+'</span>'+
          '</p>'+
        '</div>'    
        );
    }    

    $('.item').fadeTo( "slow", 1 );

    var myImage = $('img').get();
    Holder.run({
      images: myImage
    });     

    if(response.meta.total_pages > 1) {
      $('#pagination').html('');
      $('#pagination').html($('#paginate').html());
      $('ul.pagination li:first').after('<li class="page-item disabled"><a class="page-link" href="#">'+response.meta.current_page+'/'+response.meta.total_pages+'</a></li>');
    }     

  });     
}

$(document).on( "click", "div.chapter", function() {
  $('.content-title').text($(this).children('p').children('span:first').text() + ' ('+ $(this).children('p').children('span:last').text() + ')');
  $('#chapter-list').html('');

  var chapter = $(this).attr('id');
  getVerse(chapter, 1);
});

$(document).on( "click", "a.next-verse", function() {
  getVerse(chapter, (current_page+1 > total_pages)? current_page : current_page+1);
});

$(document).on( "click", "a.previous-verse", function() {
  getVerse(chapter, (current_page-1 < 0)? 1 : current_page-1);
});

function togglePlay(element, param) {
  param.classList.remove("oi-media-play");
  param.classList.add("oi-volume-high");

  element.onended = function() {
    param.classList.add("oi-media-play");
    param.classList.remove("oi-volume-high");
  }  

  // return element.paused ? element.play() : element.pause();
  return element.play();
};