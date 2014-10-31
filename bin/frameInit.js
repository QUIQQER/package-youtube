
require.config({
    baseUrl : URL_DIR,
    paths   : {
        "qui"     : QUI_PATH_SRC,
        "extend"  : QUI_PATH +'/extend',
        "package" : URL_OPT_DIR
    },

    waitSeconds : 0,
    locale      : "de-de",
    catchError  : true,

    map : {
        '*': {
            'css': QUI_PATH_SRC +'lib/css.js'
        }
    }
});


require([

    'qui/QUI',
    'package/quiqqer/youtube/bin/Frame'

], function(QUI, Player)
{
    "use strict";

    QUI.addEvent('onError', function(error, file, line) {
        console.error( error +' : '+ file +' : '+ line );
    });

    // params
    var videos  = [],
        channel = '',

        search    = window.location.search.toString(),
        UrlParams = {};

    search.replace( new RegExp( "([^?=&]+)(=([^&]*))?", "g" ), function( $0, $1, $2, $3 ) {
        UrlParams[ $1 ] = $3;
    });

    if ( UrlParams.videos ) {
        videos = UrlParams.videos.split(',');
    }

    if ( UrlParams.channel ) {
        channel = UrlParams.channel;
    }

    // player
    var YouTubePlayer = new Player({
        videos  : videos,
        channel : channel
    }).inject( document.body );

    window.addEvent('resize', function() {
        YouTubePlayer.resize();
    });

});