QUIQQER YouTube Package
========

Das Paket stellt einen HTML YouTube Player zur Verfügung.

Name des Pakets:
    - quiqqer/youtube


Features
--------

- YouTube Player unterstützt YouTube Channel und einzelne YouTube Videos
- Einfaches YouTube Player Handling (Pause, Stop, nächstes / voriges Video)


Installation
------------

Installieren Sie das QUIQQER YouTube Paket über den Paketnamen:

    quiqqer/youtube


Mitwirken
----------

- Issue Tracker: https://dev.quiqqer.com/quiqqer/package-youtube/issues
- Source Code: https://dev.quiqqer.com/quiqqer/package-youtube


Support
-------

Falls Sie ein Fehler gefunden haben oder Verbesserungen wünschen,
Dann können Sie gerne an support@pcsg.de eine E-Mail schreiben.


License
-------

GPL-3.0+


Entwickler
--------

Das quiqqer/youtube Paket bringt ein YouTube Smarty Control und ein YouTube JavaScript Control mit.

Smarty PHP Control

```html
{control control="\QUI\YouTube\Controls\Player" videos="ID,ID,ID"}
{control control="\QUI\YouTube\Controls\Player" videos="ID"}
{control control="\QUI\YouTube\Controls\Player" channel="channel-ID"}

{control control="\QUI\YouTube\Controls\Player"
         channel="Channel-ID"
         key="BROWSER_KEY"
         style="height: 500px"
}
```


*Attribute*

- videos : YouTube Video ID oder mehrere VideoIds
- channel : YouTube Channel ID
- key : Browser Key für die Abfragen

JavaScript Control

```javascript
require(['package/quiqqer/youtube/bin/Player'], function(QUIYouTube)
{
    new QUIYouTube({
        videos : ['TY6CbRJlfho']
    }).inject( ParentNode );
});

```