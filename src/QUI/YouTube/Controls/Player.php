<?php

/**
 * This file contains \QUI\YouTube\Controls\Player
 */

namespace QUI\YouTube\Controls;

use QUI;

/**
 * YouTube Player Control
 *
 * @author www.pcsg.de (Henning Leutz)
 */
class Player extends QUI\Control
{
    /**
     * constructor
     *
     * @param array $attributes
     */
    public function __construct($attributes = array())
    {
        parent::__construct($attributes);

        $this->setAttribute('qui-class', 'package/quiqqer/youtube/bin/Player');
        $this->setAttribute('class', 'quiqqer-youtube-player');

        $this->setAttribute('videos', '');
        $this->setAttribute('channel', '');
        $this->setAttribute('clientid', '');
        $this->setAttribute('key', '');
    }

    /**
     * (non-PHPdoc)
     *
     * @see \QUI\Control::getBody()
     */
    public function getBody()
    {
        $str = '<div ';
        $str .= 'data-videos="' . $this->getAttribute('videos') . '" ';
        $str .= 'data-channel="' . $this->getAttribute('channel') . '" ';
        $str .= 'data-clientid="' . $this->getAttribute('clientid') . '" ';
        $str .= 'data-key="' . $this->getAttribute('key') . '" ';
        $str .= 'data-style="' . $this->getAttribute('style') . '" ';
        $str .= '></div>';

        return $str;
    }
}
