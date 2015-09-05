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

    $('#saveSettings').click(function() {
        var layout = $('input[name=layout]:checked').val(),
            apps = $('.screen.visible').data('apps');
        
        if (layout && apps) {
            var data = {
                layout: layout,
                apps: apps
            };
            $.post('apps', data, function(res) {
                console.log(res);
            }, 'json');
        }
    });

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

        var setDraggables = function() {
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
        };

        $.getJSON('/apps', function(apps) {
            var result = compiledTemplate({apps: apps});
            $('#appList').html(result);
            setDraggables();
        });

    }

    function handleCardDrop( event, ui ) {
        ui.draggable.addClass( 'correct' );
        ui.draggable.draggable( 'disable' );
        $(this).droppable( 'disable' );
        ui.draggable.position( { of: $(this), my: 'center center', at: 'center center' } );
        ui.draggable.draggable( 'option', 'revert', false );
        $(this).children('span').hide();

        var layout = $(this).parent();
        var apps = layout.data('apps') || [];
        if (!apps.length) {
            apps.length = layout.children().length;
        }
        apps[$(this).index()] = ui.draggable.data('name');
        layout.data('apps', apps);
    }

    function resetDraggable() {
        $('.appItem').removeClass('correct').draggable( 'enable' )
                    .draggable( 'option', 'revert', true )
                    .animate({
                        top: "0px",
                        left: "0px"
                    });

        $('.screen.visible .cell').droppable( 'enable' );
    }

});
