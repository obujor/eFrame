$(function () {
    var loginForm = $('form[name=login]');

    $('#mainView').hide();
    $('#settingsActions .alert').hide();
    $('form[name=login] .alert').hide();
    loginForm.submit(function(event){
        var user = $('#inputID').val();
        waitingDialog.show();
        event.preventDefault();
        $.getJSON('/login/'+user, function(res) {
            if (res.success) {
                loginForm.fadeOut(200, function() {
                    $('#mainView').show();
                    waitingDialog.hide();
                });
            } else {
                showAlert('form[name=login] .alert');
                waitingDialog.hide();
            }
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
            apps = $('.screen.visible').data('apps'),
            user = $('#inputID').val();

        if (layout && apps) {
            waitingDialog.show();
            var data = {
                layout: layout,
                apps: apps
            };
            $.post('apps/'+user, data, function(res) {
                if (res.success) {
                    showAlert('#settingsActions .alert-success');
                } else {
                    showAlert('#settingsActions .alert-danger');
                }
                waitingDialog.hide();

            }, 'json');
        }
    });
    
    function showAlert(selector) {
        $(selector).show();
        setTimeout(function() {
            $(selector).hide();
        }, 2000);
    };
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
