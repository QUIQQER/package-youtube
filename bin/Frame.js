
/**
 * QUI YouTube Player
 *
 * @module package/quiqqer/youtube/bin/Frame
 * @author www.pcsg.de (Henning Leutz)
 *
 * https://developers.google.com/youtube/js_api_reference
 *
 * @require qui/QUI
 * @require qui/controls/Control
 * @require qui/controls/loader/Loader
 * @require qui/controls/utils/Background
 * @require package/quiqqer/youtube/bin/libs/Request.JSONP
 * @require css!package/quiqqer/youtube/bin/Frame.css
 *
 * @namespace YT.Player
 * @namespace YT.Player.loadVideoById
 * @namespace YT.Player.getPlayerState
 * @namespace YT.Player.playVideo
 * @namespace YT.Player.pauseVideo
 * @namespace YT.Player.nextVideo
 * @namespace YT.Player.previousVideo
 * @namespace YT.Player.cuePlaylist
 *
 * @namespace YT.PlayerState.PLAYING
 * @namespace YT.PlayerState.PAUSED
 * @namespace YT.PlayerState.ENDED
 * @namespace YT.PlayerState.CUED
 */

/* global YT */

define('package/quiqqer/youtube/bin/Frame', [

    'qui/QUI',
    'qui/controls/Control',
    'qui/controls/loader/Loader',
    'qui/controls/utils/Background',
    'package/quiqqer/youtube/bin/libs/Request.JSONP',

    'css!package/quiqqer/youtube/bin/Frame.css'

], function(QUI, QUIControl, QUILoader, QUIBackground, RequestJSONP)
{
    "use strict";


    var ytReady = false;

    // api ready
    window.onYouTubeIframeAPIReady = function()
    {
        ytReady = true;

        var players = QUI.Controls.getByType( 'package/quiqqer/youtube/bin/Frame' );

        for ( var i = 0, len = players.length; i < len; i++ ) {
            players[ i ].load();
        }
    };

    window.onPlayerReady = function() {
        // event.target.playVideo();
    };

    window.onPlayerStateChange = function() {

    };

    window.stopVideo = function() {

    };

    return new Class({

        Extends : QUIControl,
        Type    : 'package/quiqqer/youtube/bin/Frame',

        Binds : [
            '$onInject',
            '$onReady',
            '$onStateChange'
        ],

        options : {
            key      : '',
            clientId : false,
            videos   : [],
            autoplay : false,

            channel           : false,
            channelVideoLimit : 10
        },

        initialize : function(options)
        {
            this.parent( options );

            this.Loader     = new QUILoader();
            this.Background = new QUIBackground({
                styles : {
                    zIndex : 9
                }
            });

            this.$PlaylistId = false;

            this.$Player = null;
            this.$Frame  = null;

            this.$ControlContainer = null;
            this.$PlayerContainer  = null;

            this.$ListContainer = null;
            this.$ListVideos    = null;
            this.$ListTitle     = null;

            this.$videoData = {};
            this.$justRun   = false;

            this.addEvents({
                onInject : this.$onInject
            });
        },

        /**
         * Return the DOMNode
         *
         * @return {HTMLElement}
         */
        create : function()
        {
            var self = this;

            this.$Elm = new Element('div', {
                'class' : 'ytp',
                html    : '<div class="ytp-player-title"></div>' +
                          '<div class="ytp-player-container"></div>' +
                          '<div class="ytp-player-controls">' +
                              '<div class="ytp-player-controls-list">' +
                                  '<div class="fa fa-list"></div>' +
                              '</div>' +
                              '<div class="ytp-player-controls-prev">' +
                                  '<div class="fa fa-step-backward"></div>' +
                              '</div>' +
                              '<div class="ytp-player-controls-play">' +
                                  '<div class="fa fa-play"></div>' +
                              '</div>' +
                              '<div class="ytp-player-controls-next">' +
                                  '<div class="fa fa-step-forward"></div>' +
                              '</div>' +
                          '</div>' +
                          '<div class="ytp-player-list">' +
                              '<div class="ytp-player-list-title">' +
                                  '<h1><span class="fa fa-youtube"></span>Videos</h1>' +
                                  '<span class="close"><span class="fa fa-times"></span></span>' +
                              '</div>' +
                              '<div class="ytp-player-list-videos"></div>'+
                          '</div>'
            });

            this.$Title            = this.$Elm.getElement( '.ytp-player-title' );
            this.$ControlContainer = this.$Elm.getElement( '.ytp-player-controls' );
            this.$PlayerContainer  = this.$Elm.getElement( '.ytp-player-container' );

            this.$ListContainer = this.$Elm.getElement( '.ytp-player-list' );
            this.$ListVideos    = this.$ListContainer.getElement( '.ytp-player-list-videos' );
            this.$ListTitle     = this.$ListContainer.getElement( '.ytp-player-list-title' );

            this.$BunttonPrev = this.$Elm.getElement( '.ytp-player-controls-prev' );
            this.$BunttonNext = this.$Elm.getElement( '.ytp-player-controls-next' );
            this.$BunttonPlay = this.$Elm.getElement( '.ytp-player-controls-play' );

            this.$BunttonPlay.addEvents({
                click : function() {
                    self.toggle();
                }
            });

            this.$BunttonPrev.addEvents({
                click : function() {
                    self.prev();
                }
            });

            this.$BunttonNext.addEvents({
                click : function() {
                    self.next();
                }
            });

            this.$ListTitle.getElement( '.close' ).addEvents({
                click : function() {
                    self.closeChannelVideos();
                }
            });


            this.$Elm.getElement('.ytp-player-controls-list').addEvents({
                click : function() {
                    self.openChannelVideos();
                }
            });


            this.$PlayerContainer.set( 'id', this.getId() );

            if ( !this.getAttribute( 'videos' ) ||
                  this.getAttribute( 'videos' ).length <= 1 )
            {
                this.$ControlContainer.setStyles({
                    display: 'none'
                });

                this.$BunttonPlay.setStyles({
                    width : '60%'
                });
            }

            this.Loader.inject( this.$Elm );
            this.Background.inject( this.$Elm );

            this.Background.addEvents({
                click : function() {
                    self.closeChannelVideos();
                }
            });

            return this.$Elm;
        },

        /**
         * Resize the player
         */
        resize : function()
        {
            var size  = this.$Elm.getSize(),
                cSize = this.$ControlContainer.getSize();

            this.$PlayerContainer.setStyles({
                height : size.y - cSize.y
            });

            if ( this.$Player && this.$Frame )
            {
                this.$Frame.setStyles({
                    height : size.y - cSize.y,
                    width  : size.x
                });

                /* -> not working :(
                this.$Player.setSize(
                    size.x,
                    size.y - listSize.y
                );
                */
            }


            if ( this.$ListContainer )
            {
                var listSize  = this.$ListContainer.getSize(),
                    titleSize = this.$ListTitle.getSize();

                this.$ListVideos.setStyles({
                    height : listSize.y - titleSize.y
                });
            }
        },

        /**
         * event : on inject
         */
        $onInject : function()
        {
            this.Loader.show();
            this.resize();

            if ( !document.id( 'ytPlayerApi' ) )
            {
                new Element('script', {
                    src : '//www.youtube.com/iframe_api',
                    id  : 'ytPlayerApi'
                }).inject( document.body );
            }

//            if ( ytReady ) {
//                this.load();
//            }
        },

        /**
         * load the youtube player
         */
        load : function()
        {
            if ( this.$Player ) {
                return;
            }

            if ( this.getAttribute( 'channel' ) )
            {
                this.loadChannelVideos();
                return;
            }

            this.loadPlayer();
        },

    /**
     * player methods
     */

        /**
         * load the first video
         */
        loadPlayer : function()
        {
            this.$Player = new YT.Player(this.$PlayerContainer, {
                autoplay   : this.getAttribute('autoplay') ? 1 : 0,
                playerVars : {
                    controls : 0,
                    showinfo : 0,
                    wmode    : "opaque"
                },
                events  : {
                    onReady       : this.$onReady,
                    onStateChange : this.$onStateChange
                }
            });
        },

        /**
         * play the player at the moment a video?
         *
         * @return {Boolean}
         */
        isRunning : function()
        {
            if ( !this.$Player ) {
                return false;
            }

            return ( YT.PlayerState.PLAYING == this.$Player.getPlayerState() );
        },

        /**
         * start the active video
         */
        play : function()
        {
            if ( this.$Player ) {
                this.$Player.playVideo();
            }
        },

        /**
         * start the active video
         */
        pause : function()
        {
            if ( this.$Player ) {
                this.$Player.pauseVideo();
            }
        },

        /**
         * toggle the play modus; play / pause
         */
        toggle : function()
        {
            if ( !this.$Player ) {
                return;
            }

            if ( YT.PlayerState.PLAYING == this.$Player.getPlayerState() )
            {
                this.pause();
                return;
            }

            this.play();
        },

        /**
         * plays the next video
         */
        next : function()
        {
            if ( this.$Player ) {
                this.$Player.nextVideo();
            }
        },

        /**
         * plays the prev video
         */
        prev : function()
        {
            if ( this.$Player ) {
                this.$Player.previousVideo();
            }
        },

        /**
         * Shows the title
         */
        showTitle : function()
        {
            var self = this;

            if ( !this.$Player ) {
                return;
            }

            if ( typeof this.$videoId === 'undefined' ) {
                return;
            }

            if ( typeof this.$videoData[ this.$videoId ] === 'undefined' )
            {
                this.loadVideoData( this.$videoId, function(result)
                {
                    // youtube error?
                    if ( typeof result === 'undefined' || typeof result.items === 'undefined' )
                    {
                        self.showError();
                        return;
                    }

                    self.$videoData[ self.$videoId ] = result.items[0];
                    self.showTitle();
                });

                return;
            }

            var title = '';

            if ( "snippet" in this.$videoData[ this.$videoId ] ) {
                title = this.$videoData[ this.$videoId].snippet.title;
            }

            if ( "title" in this.$videoData[ this.$videoId ] ) {
                title = this.$videoData[ this.$videoId].title;
            }

            this.$Title.set( 'html', this.$videoData[ this.$videoId ].title  );

            moofx( this.$Title ).animate({
                top : 0
            }, {
                duration : 1000,
                callback : function()
                {
                    (function() {
                        self.hideTitle();
                    }).delay( 1000 );
                }
            });
        },

        /**
         * Hide the title
         */
        hideTitle : function()
        {
            if ( !this.$Title ) {
                return;
            }

            moofx( this.$Title ).animate({
                top : -100
            }, {
                duration : 1000
            });
        },

        /**
         * Load video data
         *
         * @param {String} videoId - ID of the wanted YouTube Video
         * @param {Function} callback - callback function
         */
        loadVideoData : function(videoId, callback)
        {
            var params = Object.toQueryString({
                id : videoId,
                key : this.getAttribute('key'),
                part : "snippet,contentDetails,status"
            });

            new RequestJSONP({
                url        : 'https://www.googleapis.com/youtube/v3/videos?'+ params,
                onComplete : function(data) {
                    callback( data );
                }
            }).send();
        },

        /**
         * Show error
         */
        showError : function()
        {
            this.Loader.hide();

            new Element('div', {
                'class' : 'ytp-player-list-error'
            }).inject( this.$Elm );
        },

    /**
     * channel methods
     */

        /**
         *
         * @param callback
         * @returns {*}
         */
        $getPlaylistId :function(callback)
        {
            if ( this.$PlaylistId ) {
                return callback( this.$PlaylistId );
            }

            var self = this,
                params = Object.toQueryString({
                    part : "contentDetails",
                    forUsername : this.getAttribute( 'channel' ),
                    key : this.getAttribute( 'key' )
                });

            new RequestJSONP({
                url: 'https://www.googleapis.com/youtube/v3/channels?'+ params,
                onComplete: function (data)
                {
                    self.$PlaylistId = data.items[0].contentDetails.relatedPlaylists.uploads;

                    callback( self.$PlaylistId );
                }
            }).send();
        },

        /**
         * load the channel videos and start the player
         */
        loadChannelVideos : function()
        {
            var self = this,
                max  = this.getAttribute( 'channelVideoLimit' );

            this.$getPlaylistId(function(playlistId)
            {
                var params = Object.toQueryString({
                    part : "snippet",
                    maxResult : max,
                    playlistId : playlistId,
                    key : self.getAttribute( 'key' )
                });

                new RequestJSONP({
                    url: 'https://www.googleapis.com/youtube/v3/playlistItems?'+ params,
                    onComplete: function (data)
                    {
                        // youtube error?
                        if ( typeof data === 'undefined' ||
                             typeof data.items === 'undefined' ||
                             !data.items.length )
                        {
                            self.showError();
                            return;
                        }


                        var i, len, video, Entry;

                        var items  = data.items,
                            videos = [];

                        var itemClick = function() {
                            self.$onEntryClick( this.get( 'data-yid' ) );
                        };

                        for ( i = 0, len = items.length; i < len; i++ )
                        {
                            video = items[ i ].snippet;

                            var videoId = video.resourceId.videoId;

                            videos.push( videoId );

                            self.$videoData[ videoId ] = video;

                            // video vorschau
                            Entry = new Element('div', {
                                'class'    : 'ytp-player-list-entry',
                                'data-yid' : videoId,
                                html : '<div class="ytp-player-list-entry-image"></div>'+
                                       '<div class="ytp-player-list-entry-text">'+
                                           video.title +
                                       '</div>',
                                events : {
                                    click : itemClick
                                }
                            }).inject( self.$ListVideos );

                            Entry.getElement( '.ytp-player-list-entry-image' ).setStyles({
                                'background-image' : 'url("'+ video.thumbnails.default.url +'")'
                            });
                        }


                        if ( !self.getAttribute( 'videos' ) ||
                             self.getAttribute( 'videos' ).length <= 1 )
                        {
                            self.$ControlContainer.setStyles({
                                display: null
                            });

                            self.$BunttonPlay.setStyles({
                                width : '40%'
                            });
                        }

                        self.setAttribute( 'videos', videos );
                        self.resize();
                        self.loadPlayer();
                    }
                }).send();
            });
        },

        /**
         * opens the chanel video list
         */
        openChannelVideos : function()
        {
            this.Background.show();

            if ( this.isRunning() )
            {
                this.$justRun = true;
                this.pause();
            }

            moofx( this.$ListContainer ).animate({
                left : 0
            });
        },

        /**
         * close the chanel video list
         */
        closeChannelVideos : function()
        {
            this.Background.hide();

            if ( this.$justRun ) {
                this.play();
            }

            this.$justRun = false;

            moofx( this.$ListContainer ).animate({
                left : '-110%'
            });
        },

    /**
     * events
     */

        /**
         * event : click on an video entry
         *
         * @param {String} yid - youtube id
         */
        $onEntryClick : function(yid)
        {
            this.$Player.loadVideoById( yid );
            this.closeChannelVideos();
        },

        /**
         * event: player is ready
         */
        $onReady : function()
        {
            this.$Frame = this.$Elm.getElement('iframe');
            this.$Player.cuePlaylist( this.getAttribute('videos') );

            this.Loader.hide();
        },

        /**
         * on youtube state change
         */
        $onStateChange : function(event)
        {
            var data  = event.data,
                url   = event.target.getVideoUrl(),
                match = url.match(/[?&]v=([^&]+)/);

            this.$videoId = match[ 1 ];

//            YT.PlayerState.ENDED
//            YT.PlayerState.PLAYING
//            YT.PlayerState.PAUSED
//            YT.PlayerState.BUFFERING
//            YT.PlayerState.CUED

            if ( YT.PlayerState.PLAYING == data )
            {
                this.$BunttonPlay.set( 'html', '<div class="fa fa-pause"></div>' );
                this.showTitle();
                return;
            }

            if ( YT.PlayerState.PAUSED == data ||
                 YT.PlayerState.ENDED  == data )
            {
                this.$BunttonPlay.set( 'html', '<div class="fa fa-play"></div>' );
                return;
            }

            if ( YT.PlayerState.CUED == data )
            {
                this.showTitle();
            }
        }
    });
});
