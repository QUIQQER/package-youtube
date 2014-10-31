
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
            '$onInject',
            '$onImport'
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
                onInject : this.$onInject,
                onImport : this.$onImport
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
         * event : on import
         */
        $onImport : function()
        {
            var Options = this.$Elm.getElement( 'div' );

            this.setAttributes({
                videos  : Options.get( 'data-videos' ).split(','),
                channel : Options.get( 'data-channel' )
            });

            var i, len, parts, entries;
            var style  = Options.get( 'data-style' ),
                styles = {};

            if ( style !== '' )
            {
                entries = style.split(';');

                for ( i = 0, len = entries.length; i < len; i++ )
                {
                    parts = entries[ i ].trim().split(':');

                    if ( typeof parts[ 0 ] !== 'undefined' &&
                         typeof parts[ 1 ] !== 'undefined' )
                    {
                        styles[ parts[ 0 ].trim() ] = parts[ 1 ].trim();
                    }
                }
            }

            this.setAttribute( 'styles', styles );

            Options.destroy();

            var Elm = this.$Elm;

            this.$Elm = null;
            this.replaces( Elm );
            this.$Elm.setSt
            this.$onInject();
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
         * Set channel to the player
         *
         * @param {String} channel - YouTube Channel Name / ID
         */
        setChannel : function(channel)
        {
            this.setAttribute( 'videos', videos );
            this.$Elm.set('src', URL_OPT_DIR +'quiqqer/youtube/bin/frame.php?channel='+ channel);
        }
    });
});
