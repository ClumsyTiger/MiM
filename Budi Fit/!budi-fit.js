$(document).ready(function () {
    $("#sidebar").mCustomScrollbar({ theme: "minimal", });

    $("#sidebar-collapse, #sidebar-dismiss").on('click', function () {
        $("#sidebar").toggleClass("active");
    });

    // ---- kod vezan za treninge -------------------------------------------------------------------------------------------------
    // ---- ocenjivanje
    let stranica = $(location).attr('pathname').split('/').slice(-1)[0].split('.').slice(0)[0];
    if($('#natpis-ocena')!=null && localStorage.getItem(stranica+' ocena')!=null) {
        let ocena = parseFloat(localStorage.getItem(stranica+' ocena'));
        $('#natpis-ocena').text('Prosečna ocena: '+ocena.toFixed(2));
    }

    $('.dugme-ocena').on('click', function() {
        let stranica = $(location).attr('pathname').split('/').slice(-1)[0].split('.').slice(0)[0];
        if(localStorage.getItem(stranica+' ocena')!=null) {
            let ocena = parseFloat(localStorage.getItem(stranica+' ocena'));
            let brocena = parseInt(localStorage.getItem(stranica+' brocena'));
            ocena=(ocena*brocena+parseInt($(this).attr('id')))/++brocena;
            localStorage.setItem(stranica+' ocena', ocena.toFixed(2));
            localStorage.setItem(stranica+' brocena', brocena);
            $('#natpis-ocena').text('Prosečna ocena: '+ocena.toFixed(2)); 
        } else {
            let ocena=parseInt($(this).attr('id'));
            localStorage.setItem(stranica+' ocena', ocena);
            localStorage.setItem(stranica+' brocena', 1);
            $('#natpis-ocena').text('Prosečna ocena: '+ocena); 
        }
    })

    // ---- komentarisanje
    $('#komentar').on('submit', function() {
        let stranica = $(location).attr('pathname').split('/').slice(-1)[0].split('.').slice(0)[0];
        let brkomentara = localStorage.getItem(stranica+' brkomentara'); 
        if(brkomentara==null) {
            brkomentara=0;
        } else {
            brkomentara=parseInt(brkomentara);
        }
        let komentar=$('#komentar-text').val();
        if(komentar=='') return;
        let datum = new Date().toISOString().replace(/T/,', ').replace(/Z/, ' ').replace(/\.[0-9]{3}/,' ');
        localStorage.setItem(stranica+' komentar'+brkomentara, komentar);
        localStorage.setItem(stranica+' brkomentara',brkomentara+1);
        localStorage.setItem(stranica+' datum'+brkomentara,datum);
    })

    //prikaz komentara
    let brkomentara = localStorage.getItem(stranica+' brkomentara');
    if(brkomentara!=null) {
        for(let i=0; i<brkomentara; i++) {
            let komentar = localStorage.getItem(stranica+' komentar'+i);
            let datum = localStorage.getItem(stranica+' datum'+i);
            $(komentari).append('<div class="kom border border-info"><p>'+komentar+'</p>Postavljeno: '+datum+'</div>');
        }
    }

    // ---- kod vezan za sortiranje treninga ----------------------------------------------------------------------------------------
    $('.sortiranje').on('change', function() {
        // sortiranje yoge
        if($(this).attr('id') == 'sortiranje-yoga') {
            if($(this).children('option:selected').val()=='poimenu') {
                $('#ashtanga-yoga').insertBefore('#power-yoga');
                $('#vinyasa-yoga').insertAfter('#power-yoga');
            }
            if($(this).children('option:selected').val()=='potrajanju') {
                $('#ashtanga-yoga').insertAfter('#power-yoga');
                $('#vinyasa-yoga').insertAfter('#power-yoga');
            }
            if($(this).children('option:selected').val()=='potezini') {
               $('#vinyasa-yoga').insertBefore('#power-yoga');
               $('#ashtanga-yoga').insertBefore('#power-yoga');
            }
        }
        // sortiranje pilatesa
        if($(this).attr('id') == 'sortiranje-pilates') {
            if($(this).children('option:selected').val()=='poimenu') {
                $('#stot-pilates').insertAfter('#klasicni-pilates');
                $('#reformer-pilates').insertAfter('#klasicni-pilates');
            }
            if($(this).children('option:selected').val()=='potrajanju') {
                $('#reformer-pilates').insertBefore('#klasicni-pilates');
                $('#stot-pilates').insertAfter('#klasicni-pilates');
            }
            if($(this).children('option:selected').val()=='potezini') {
               $('#stot-pilates').insertBefore('#klasicni-pilates');
               $('#reformer-pilates').insertAfter('#klasicni-pilates');
            }
        }
        // sortiranje core
        if($(this).attr('id') == 'sortiranje-core') {
            if($(this).children('option:selected').val()=='poimenu') {
                $('#barre').insertBefore('#core-yoga');
                $('#core').insertBefore('#core-yoga');
            }
            if($(this).children('option:selected').val()=='potrajanju') {
                $('#core').insertBefore('#core-yoga');
                $('#barre').insertAfter('#core-yoga');
            }
            if($(this).children('option:selected').val()=='potezini') {
                $('#core').insertBefore('#core-yoga');
                $('#barre').insertAfter('#core-yoga');
            }
        }
        // sortiranje cardio
        if($(this).attr('id') == 'sortiranje-cardio') {
            if($(this).children('option:selected').val()=='poimenu') {
                $('#aerobik').insertBefore('#cardio-box');
                $('#spin').insertAfter('#cardio-box');
            }
            if($(this).children('option:selected').val()=='potrajanju') {
                $('#aerobik').insertAfter('#cardio-box');
                $('#spin').insertBefore('#cardio-box');
            }
            if($(this).children('option:selected').val()=='potezini') {
                $('#aerobik').insertBefore('#cardio-box');
                $('#spin').insertBefore('#cardio-box');
            }
        }
    })



    // ---- forma za zakazivanje nutricioniste i masaze ----------------------------------------------------------------------------------------
    // ====== constants ======
    const nbsp = '&nbsp;';
    
    
    // check if the firstname field is valid, if it isn't output help text and change field background color
    $("#ime").on('input', function() {
        let firstname = $(this);
        
        let validity = 'false';   // 'false' is false, '' is valid
        let tip      = nbsp;      // non breaking space -- &nbsp;
        
        // check if the full name length is appropriate
        if     ( firstname.val().length === 0 ) validity = '';
        else if( firstname.val().length > 32  ) tip = 'ime predugačko';
        else                                    validity = '';
        
        // set the input background colour according to validity
        firstname[0].setCustomValidity(validity);
        // set the help tip
        $('#ime-help').html(tip);
        // reset the general form tip
        $("#forma-help").html('');
    });

    // check if the user lastname field is valid, if it isn't output help text and change field background color
    $("#prezime").on('input', function() {
        let lastname = $(this);
        
        let validity = 'false';   // 'false' is false, '' is valid
        let tip      = nbsp;      // non breaking space -- &nbsp;
        
        // check if the full name length is appropriate
        if     ( lastname.val().length === 0 ) validity = '';
        else if( lastname.val().length > 64  ) tip = 'ime predugačko';
        else                                   validity = '';
        
        // set the input background colour according to validity
        lastname[0].setCustomValidity(validity);
        // set the help tip
        $('#prezime-help').html(tip);
        // reset the general form tip
        $("#forma-help").html('');
    });
    
    // check if the date field is valid, if it isn't output help text and change field background color
    $("#datum").on('input', function() {
        let date = $(this);
        
        let valid = date[0].checkValidity();
        let tip   = nbsp;      // non breaking space -- &nbsp;
        
        // check if the date is in the correct format
        if( !valid ) tip = 'neispravan format datuma';
        
        // set the help tip
        $('#datum-help').html(tip);
        // reset the general form tip
        $("#forma-help").html('');
    });

    // check if the email field is valid, if it isn't output help text and change field background color
    $("#imejl").on('input', function() {
        let email = $(this);
        
        let validity = 'false';   // 'false' is false, '' is valid
        let tip      = nbsp;      // non breaking space -- &nbsp;
        let regex    = RegExp(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
        
        // check if the email length is appropriate and that it is in the correct format (html standard)
        if     ( email.val().length === 0 ) validity = '';
        else if( email.val().length > 128 ) tip = 'email predugačak';
        else if( !regex.test(email.val()) ) tip = 'neispravan format email-a';
        else                                validity = '';
        
        // set the input background colour according to validity
        email[0].setCustomValidity(validity);
        // set the help tip
        $('#imejl-help').html(tip);
        // reset the general form tip
        $("#forma-help").html('');
    });
    
    // check if the phone number field is valid, if it isn't output help text and change field background color
    $("#telefon").on('input', function() {
        let phonenum = $(this);
        
        let validity = 'false';   // 'false' is false, '' is valid
        let tip      = nbsp;      // non breaking space -- &nbsp;
        let regex    = RegExp(/\+[0-9]+/);
        
        // check if the username length is appropriate and that it only contains ascii symbols and spaces
        if     ( phonenum.val().length === 0 ) validity = '';
        else if( phonenum.val().length < 8   ) tip = 'broj telefona previše kratak';
        else if( phonenum.val().length > 16  ) tip = 'broj telefona predugačak';
        else if( !regex.test(phonenum.val()) ) tip = 'neispravan format broja telefona';
        else                                   validity = '';
        
        // set the input background colour according to validity
        phonenum[0].setCustomValidity(validity);
        // set the help tip
        $('#telefon-help').html(tip);
        // reset the general form tip
        $("#forma-help").html('');
    });

    // check if the phone number field is valid, if it isn't output help text and change field background color
    $("#napomena").on('input', function() {
        // reset the general form tip
        $("#forma-help").html('');
    });
    
    
    // check the form fields when the user clicks the register button, if they are valid send a request
    $("#zakazi").on('click', function() {
        // reset the general form tip
        $("#forma-help").html('');
        
        // if any of the form fields is invalid, don't send the request
        if( $("#ime-help"     ).html() != nbsp
         || $("#prezime-help" ).html() != nbsp
         || $("#datum-help"   ).html() != nbsp
         || $("#imejl-help"   ).html() != nbsp
         || $("#telefon-help" ).html() != nbsp
         || $("#napomena-help").html() != nbsp
        )
        {
            $("#forma-help").html('forma nije ispravno popunjena');
            return;
        }
    
        // create a request
        let request = {
            ime:      $("#ime"     ).val(),
            prezime:  $("#prezime" ).val(),
            datum:    $("#datum"   ).val(),
            imejl:    $("#imejl"   ).val(),
            telefon:  $("#telefon" ).val()

        };
        
        // if any of the form fields is empty, don't send the request
        if( request.ime      === ""
         || request.prezime  === ""
         || request.datum    === ""
         || request.imejl    === ""
         || request.telefon  === ""
         || request.napomena === ""
        )
        {
            $("#forma-help").html('forma nije dovršena');
            return;
        }

        // save the request in localstorage
        // TODO: dovrsiti
    });



    // change the language to English
    $("#en").on('click', function() {
        let file = window.location.pathname.split("/").pop();
        let regex   = /^(.*)-sr.html$/;
        
        file = regex.exec(file);
        if( file.length < 2 ) return;
        
        file = file[1];
        file += '-en.html';
        window.location.replace(file);
    });

    // change the language to Serbian
    $("#en").on('click', function() {
        let file = window.location.pathname.split("/").pop();
        let regex   = /^(.*)-en.html$/;
        
        file = regex.exec(file);
        if( file.length < 2 ) return;
        
        file = file[1];
        file += '-sr.html';
        window.location.replace(file);
    });

});

