<?php

    require '../../../header.php';

?>
<!doctype html>
<!--[if lt IE 7 ]><html class="ie ie6" lang="de"> <![endif]-->
<!--[if IE 7 ]><html class="ie ie7" lang="de"> <![endif]-->
<!--[if IE 8 ]><html class="ie ie8" lang="de"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--><html lang="de"> <!--<![endif]-->
<head>

    <title>neXGam - youTube Player</title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1,maximum-scale=1" />

    <?php
        $qui_path     = URL_OPT_DIR .'bin/qui/';
        $qui_path_src = $qui_path .'qui/';
        $path         = URL_OPT_DIR .'quiqqer/youtube/';

        echo "
        <script>

        var URL_DIR         = '". URL_DIR ."',
            URL_OPT_DIR     = '". URL_OPT_DIR ."',
            QUI_PATH        = '{$qui_path}',
            QUI_PATH_SRC    = '{$qui_path_src}';
        </script>";
    ?>

    <!-- [begin] CSS -->
        <link href="<?php echo $path; ?>css/grid.css" rel="stylesheet" type="text/css" />

        <!--[if (lt IE 9) & (!IEMobile)]>
        <link href="<?php echo $path; ?>css/grid-ie.css" rel="stylesheet" type="text/css" />
        <![endif]-->

        <link href="<?php echo $qui_path; ?>extend/classes.css" rel="stylesheet" type="text/css" />
        <link href="<?php echo $qui_path; ?>extend/elements.css" rel="stylesheet" type="text/css" />
        <link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet" />

        <link href="<?php echo $path; ?>css/style.css" rel="stylesheet" type="text/css" />
    <!-- [end] CSS -->


    <!-- [begin] needle js -->
    <script src="<?php echo $qui_path_src; ?>lib/mootools-core.js"></script>
    <script src="<?php echo $qui_path_src; ?>lib/mootools-more.js"></script>
    <script src="<?php echo $qui_path_src; ?>lib/moofx.js"></script>

</head>
<body>

    <script src="<?php echo $qui_path_src; ?>lib/requirejs.js"></script>
    <script src="frameInit.js"></script>

</body>
</html>