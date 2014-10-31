
/**
 * YouTube Player Control for QUIQQER
 *
 * @module package/quiqqer/youtube/bin/Player
 * @author www.pcsg.de (Henning Leutz)
 */

define([

    'qui/QUI',
    'qui/controls/Control'

], function(QUI, QUIControl)
{
    "use strict";

    return new Class({

        Extends : QUIControl,
        Type    : 'package/quiqqer/youtube/bin/Player',

        Binds : [
            '$onInject'
        ],

        options : {
            styles  : false,
            videos  : [],
            channel : false
        },

        initialize : function(options)
        {
            this.parent( options );

            this.$Elm = null;

            this.addEvents({
                onInject : this.$onInject
            });
        },

        /**
         * Creates the DOMNode Element
         *
         * @return {DOMNode}
         */
        create : function()
        {
            this.$Elm = new Element('iframe', {
                'class' : 'quiqqer-youtube-player',
                styles  : {
                    border : 'none',
                    height : 200,
                    width  : '100%'
                },
                frameborder : 'none'
            });

            if ( this.getAttribute( 'styles' ) ) {
                this.$Elm.setStyles( this.getAttribute( 'styles' ) );
            }

            return this.$Elm;
        },

        /**
         * event : on inject
         */
        $onInject : function()
        {
            if ( this.getAttribute( 'videos' ) )
            {
                var videos = this.getAttribute( 'videos' );

                if ( typeOf( videos ) == 'array' && videos.length )
                {
                    this.setVideos( this.getAttribute( 'videos' ) );
                    return;
                }
            }

            if ( this.getAttribute( 'channel' ) )
            {
                this.setChannel( this.getAttribute( 'channel' ) );
                return;
            }

            console.warn( 'No YouTube Videos and no YouTube Channel given.' );
        },

        /**
         * Set videos to the player
         *
         * @param {Array} videos - list of YouTube-ID's
         */
        setVideos : function(videos)
        {
            if ( typeOf( videos ) != 'array' || !videos.length ) {
                return;
            }

            this.setAttribute( 'videos', videos );
            this.$Elm.set('src', URL_OPT_DIR +'quiqqer/youtube/bin/frame.php?videos='+ videos.join(','));
        },

        /**
         *
         */
        setChannel : function(videos)
        {
//          + index.php?channel=CHANNEL


        }

    });
});