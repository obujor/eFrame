var userData = null,
    appsData = null;

$(function () {
    hideUnusedElements();
    setupLoginForm();
    fillLayoutTemplate();
    fillAppListTemplate();
    setupLayout();
    setDefaultLayout();
    setupHours();
    setupSaveSettings();
    setupShowLayouts();

    Handlebars.registerHelper('getAppIcon', function(name) {
        return name && $('.appItem[data-name='+name+']').children('img').attr('src');
    });

    Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if( lvalue!=rvalue ) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    });

    function hideUnusedElements() {
        $('#mainView').hide();
        $('#settingsActions .alert').hide();
        $('form[name=login] .alert').hide();
    }
    
    function setupLoginForm() {
        var loginForm = $('form[name=login]');
    
        loginForm.submit(function(event){
            waitingDialog.show();
            event.preventDefault();
            getUserData(function(res) {
                if (res.success) {
                    userData = res;
                    setAppSettingDialogs();
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

    function getUserData(cb) {
        var user = $('#inputID').val();
        $.getJSON('/login/'+user, cb);
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

        $.getJSON('/apps', function(apps) {
            var result = compiledTemplate({apps: apps});
            $('#appList').html(result);
            setDraggables();
            appsData = apps;
        });
    }

    function setAppSettingDialogs() {
        var dialogTemplate = $('#appDialogTemplate').html();
        var dialogCompiled = Handlebars.compile(dialogTemplate);
        var dialogs = dialogCompiled({apps: appsData.map(function(data) {
            data.title = capitalizeString(data.name);
            if (data.interactionView && userData && userData[data.name]) {
                var interactionTemplate = Handlebars.compile(data.interactionView);
                data.interactionView = interactionTemplate(userData[data.name]);
            }
            return data;
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

    function setupHours() {
        $('#checkAllHours').click(function() {
            var state = !$(this).is('.active');
            $('#hoursCheckers .btn-group label').toggleClass('active', state);
            $('#hoursCheckers .btn-group input').prop('checked', state);
        });

        var toggleAllDay = function(state) {
            $('#checkAllHours').toggleClass('active', state);
            $('#checkAllHours').prop('aria-pressed', state);
        };

        var checks = $('#hours input[type=checkbox]');
        checks.change(function() {
            var selected = $('#hours').serializeArray();
            toggleAllDay(selected.length == checks.length);
        });
    }
    
    function setupSaveSettings () {
        $('#saveSettings').click(function() {
            var layout = $('input[name=layout]:checked').val(),
                apps = $('.screen.visible').data('apps'),
                user = $('#inputID').val(),
                hours = $('#hours').serializeArray().reduce(function(prev, cur) {
                    return prev+cur.name+',';
                }, "");

            hours = hours.length && hours.substring(0, hours.length-1);

            if (layout && apps) {
                waitingDialog.show();
                var data = {
                    hours: hours || "00-24",
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

    function setupShowLayouts() {
        var removeLayout = function() {
            $(this).parent().remove()
        };

        var saveLayouts = function() {
            var $dialog = $(this),
                user = $('#inputID').val(),
                layouts = $dialog.find('.layoutPreview').map(function(i, el){
                    return $(el).data('layout');
                }).toArray();

            waitingDialog.show();
            layouts = (layouts.length) ? layouts : 0;
            $.post('apps/'+user, {
                layoutsSaved: layouts
            }, function(res) {
                if (res.success)
                    showAlert('#settingsActions .alert-success');
                else 
                    showAlert('#settingsActions .alert-danger');
                waitingDialog.hide();
                $dialog.dialog( "close" );
            }, 'json');
        };

        $('#savedLayouts').dialog({
          autoOpen: false,
          height: 500,
          width: 450,
          modal: true,
          buttons: {
            Chiudi: function() {
              $(this).dialog( "close" );
            },
            Salva: saveLayouts
          }
        });


        $('#showLayouts').click(function() {
            var $btn = $(this).button('loading')
            getUserData(function(res) {
                var layouts = Object.keys(res.layouts).map(function (key) {
                    res.layouts[key].id = key;
                    return res.layouts[key];
                });
                var template = $('#layoutListTemplate').html();
                var compiledTemplate = Handlebars.compile(template);
                var result = compiledTemplate({
                    layouts: layouts
                });
                $('#savedLayouts').html(result);
                $('#savedLayouts').dialog('open');
                $btn.button('reset');

                $('.removeLayout').click(removeLayout);
            });
        });


    }

    function showAlert(selector) {
        $(selector).show();
        setTimeout(function() {
            $(selector).hide();
        }, 2000);
    };

    
    function setupAppSettings() {
        $('.hiddenInitial').hide();
        $('.appSettings').click(function() {
            var app = $(this).parent().data('name');
            $('.appDialog[data-name="'+app+'"]').dialog( "open" );
        });
        $('.removeApp').click(function() {
            var app = $(this).parent().data('name');
            resetApp(app);
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
        $(this).attr('data-app', ui.draggable.data('name'));
        if ( ui.draggable.data('settings') ) {
            ui.draggable.children('.appSettings').show();
        }
        ui.draggable.children('.removeApp').show();
    }

    function resetApp(name) {
        var selector = '.appItem';
        if (name) selector+= '[data-name='+name+']';
        $(selector).removeClass('correct').draggable( 'enable' )
                    .draggable( 'option', 'revert', true )
                    .animate({
                        top: "0px",
                        left: "0px"
                    })
                    .each(function() {
                        $('.cell[data-app='+name+']')
                            .data('app', "")
                            .droppable( 'enable' )
                            .children('span').show();
                    })
                    .children('.hiddenInitial').hide();
    }

    function resetDraggable() {
        resetApp();
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
