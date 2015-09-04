$(function () {
    var loginForm = $('form[name=login]');

    $('#mainView').hide();
    loginForm.submit(function(event){
        event.preventDefault();
        loginForm.fadeOut(200, function() {
            $('#mainView').show();
        });
    });

    fillLayoutTemplate();
    fillAppListTemplate();

    $('input:radio[name="layout"]').change(function() {
        $('.screen.visible span').show();
        $('.screen.visible').toggleClass('visible');
        $('.screen.'+$(this).val()).toggleClass('visible');
        resetDraggable();
    });

    setDefaultLayout();


    function setDefaultLayout() {
        $('input:radio[value="full"]').prop( "checked", true );
        $('.screen.full').toggleClass('visible');
    }

    function fillLayoutTemplate() {
        var template = $('#layoutSelectionTemplate').html();
        var compiledTemplate = Handlebars.compile(template);
        var result = compiledTemplate({
            layouts: ['full', 'leftright', 'topbottom', 'cells', 'lleftright', 'rrightleft', 'ttopbottom', 'bbottomtop']
        });
        $('#layoutSelectors').html(result);
    }

    function fillAppListTemplate() {
        var template = $('#appListTemplate').html();
        var compiledTemplate = Handlebars.compile(template);
        var result = compiledTemplate({
            apps: [{
                name: 'news',
                description: 'Aggregatore di notizie da diverse testate giornalistiche',
                icon: 'http://localhost:9006/appsStatic/news/resources/icon.png'
            },{
                name: 'weather',
                description: 'Meteo della tua citta\'',
                icon: 'http://localhost:9006/appsStatic/weather/resources/icon.png'
            },{
                name: 'twitter',
                description: 'Visualizzatore di twitts dell\'attualita\'',
                icon: 'http://localhost:9006/appsStatic/twitter/resources/icon.png'
            }]
        });
        $('#appList').html(result);

        $('.appItem').draggable( {
          containment: 'document',
          stack: '.appItem',
          cursor: 'move',
          revert: true
        } );

        $('.cell').droppable( {
          accept: '.appItem',
          hoverClass: 'hovered',
          drop: handleCardDrop
        } );
    }

    function handleCardDrop( event, ui ) {
        ui.draggable.addClass( 'correct' );
        ui.draggable.draggable( 'disable' );
        $(this).droppable( 'disable' );
        ui.draggable.position( { of: $(this), my: 'center center', at: 'center center' } );
        ui.draggable.draggable( 'option', 'revert', false );
        $(this).children('span').hide();
    }

    function resetDraggable() {
        $('.appItem').removeClass('correct').draggable( 'enable' )
                    .draggable( 'option', 'revert', false )
                    .animate({
                        top: "0px",
                        left: "0px"
                    });

        $('.screen.visible .cell').droppable( 'enable' );
    }

});
