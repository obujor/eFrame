$(function () {
    hideUnusedElements();
    setupLoginForm();
    fillLayoutTemplate();
    fillAppListTemplate();
    setupLayout();
    setDefaultLayout();
    setupSaveSettings();

    function hideUnusedElements() {
        $('#mainView').hide();
        $('#settingsActions .alert').hide();
        $('form[name=login] .alert').hide();
    }
    
    function setupLoginForm() {
        var loginForm = $('form[name=login]');
    
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
        var dialogTemplate = $('#appDialogTemplate').html();
        var dialogCompiled = Handlebars.compile(dialogTemplate);

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
            setupAppSettings();
        };

        var setDialogs = function(apps) {
            var dialogs = dialogCompiled({apps: apps.map(function(app) {
                app.title = 'Impostazioni per '+capitalizeString(app.name);
                return app;
            })});

            $('body').append(dialogs);

            $('.appDialog').dialog({
              autoOpen: false,
              height: 400,
              width: 450,
              modal: true,
              buttons: {
                Annulla: function() {
                  $(this).dialog( "close" );
                },
                Salva: saveAppSettings
              }
            });
            $('.ui-dialog-buttonset button').addClass('btn btn-sm btn-primary');
        };

        $.getJSON('/apps', function(apps) {
            var result = compiledTemplate({apps: apps});
            $('#appList').html(result);
            setDraggables();
            setDialogs(apps);
        });
    }

    function saveAppSettings() {
        var dialog = $(this),
            data = dialog.find('form').serializeArray(),
            app = dialog.data('name'),
            user = $('#inputID').val();

        if (!data.length) return;

        data = data.reduce(function(prev, cur){
            var obj = {};
            obj[cur.name] = cur.value;
            return merge(prev, obj);
        }, {});

        waitingDialog.show();
        $.post('apps/'+user+'/'+app, data, function(res) {
            if (res.success) {
                dialog.dialog('close');
                showAlert('#settingsActions .alert-success');
            } else {
                dialog.parent().effect('shake');
                showAlert('#settingsActions .alert-danger');
            }
            waitingDialog.hide();
        }, 'json');
    }

    function setupLayout() {
        $('input:radio[name="layout"]').change(function() {
            $('.screen.visible span').show();
            $('.screen.visible').toggleClass('visible');
            $('.screen.'+$(this).val()).toggleClass('visible');
            resetDraggable();
        });
    }

    function setDefaultLayout() {
        $('input:radio[value="full"]').prop( "checked", true );
        $('.screen.full').toggleClass('visible');
    }
    
    function setupSaveSettings () {
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
    }

    function showAlert(selector) {
        $(selector).show();
        setTimeout(function() {
            $(selector).hide();
        }, 2000);
    };

    
    function setupAppSettings() {
        $('.appSettings').hide();
        $('.appSettings').click(function() {
            var app = $(this).parent().data('name');
            console.log(app);
            $('.appDialog[data-name="'+app+'"]').dialog( "open" );
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

        if ( ui.draggable.data('settings') ) {
            ui.draggable.children('.appSettings').show();
        }
    }

    function resetDraggable() {
        $('.appItem').removeClass('correct').draggable( 'enable' )
                    .draggable( 'option', 'revert', true )
                    .animate({
                        top: "0px",
                        left: "0px"
                    }).children('.appSettings').hide();

        $('.screen.visible .cell').droppable( 'enable' );
    }

    function capitalizeString(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function merge(object1, object2) {
        Object.keys(object2).forEach(function (key) {
            object1[key] = object2[key];
        });
        return object1;
    }

});
