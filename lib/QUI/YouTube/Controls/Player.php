<?php

/**
 * This file contains \QUI\YouTube\Controls\Player
 */

namespace QUI\YouTube\Controls;

/**
 * YouTube Player Control
 *
 * @author www.pcsg.de (Henning Leutz)
 */

class Player extends \QUI\Control
{
    /**
     * constructor
     * @param Array $attributes
     */
    public function __construct($attributes=array())
    {
        parent::setAttributes( $attributes );

        $this->setAttribute( 'qui-class', 'package/quiqqer/youtube/bin/Player' );
        $this->setAttribute( 'class', 'quiqqer-youtube-player' );

        $this->setAttribute( 'videos', '' );
        $this->setAttribute( 'channel', '' );
    }

    /**
     * (non-PHPdoc)
     * @see \QUI\Control::getBody()
     */
    public function getBody()
    {
        $str  = '<div ';
        $str .= 'data-videos="'. $this->getAttribute( 'videos' ) .'" ';
        $str .= 'data-channel="'. $this->getAttribute( 'channel' ) .'" ';
        $str .= 'data-style="'. $this->getAttribute( 'style' ) .'" ';
        $str .= '></div>';

        return $str;
    }
}