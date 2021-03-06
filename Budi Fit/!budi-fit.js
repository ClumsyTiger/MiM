$(document).ready(function () {
    $("#sidebar").mCustomScrollbar({ theme: "minimal", });

    $("#sidebar-collapse, #sidebar-dismiss").on('click', function () {
        $("#sidebar").toggleClass("active");
    });

    // ---- kod vezan za treninge -------------------------------------------------------------------------------------------------
    // ---- ocenjivanje
    let stranica = $(location).attr('pathname').split('/').slice(-1)[0].split('.').slice(0)[0].split('-').slice(0,2);
    let jezik = $(location).attr('pathname').split('/').slice(-1)[0].split('.').slice(0)[0].split('-').slice(-1)[0];
    if($('#natpis-ocena')!=null && localStorage.getItem(stranica+' ocena')!=null) {
        let ocena = parseFloat(localStorage.getItem(stranica+' ocena'));
        if(jezik==="en") $('#natpis-ocena').text('Rating: '+ocena.toFixed(2));
        else $('#natpis-ocena').text('Prosečna ocena: '+ocena.toFixed(2));
    }

    function prisustvovao(stranica) {
        let termins = getTermins();
        let tip = stranica[0].slice(0,4)+"-"+stranica[1].slice(0,3);
        for(day of days['sr']) {
            for(time of times) {
                if(termins[day][time].type === tip && termins[day][time].taken && hasTerminPassed(day, time)) return true;
            }
        }
        return false;
    }

    $('.dugme-ocena').on('click', function() {
        let stranica = $(location).attr('pathname').split('/').slice(-1)[0].split('.').slice(0)[0].split('-').slice(0,2);
        if(prisustvovao(stranica)) {
            if(localStorage.getItem(stranica+' ocena')!=null) {
                let ocena = parseFloat(localStorage.getItem(stranica+' ocena'));
                let brocena = parseInt(localStorage.getItem(stranica+' brocena'));
                ocena=(ocena*brocena+parseInt($(this).attr('id')))/++brocena;
                localStorage.setItem(stranica+' ocena', ocena.toFixed(2));
                localStorage.setItem(stranica+' brocena', brocena);
                if(jezik==="en") $('#natpis-ocena').text('Rating: '+ocena.toFixed(2));
            else $('#natpis-ocena').text('Prosečna ocena: '+ocena.toFixed(2));
            } else {
                let ocena=parseInt($(this).attr('id'));
                localStorage.setItem(stranica+' ocena', ocena);
                localStorage.setItem(stranica+' brocena', 1);
                if(jezik==="en") $('#natpis-ocena').text('Rating: '+ocena.toFixed(2));
            else $('#natpis-ocena').text('Prosečna ocena: '+ocena.toFixed(2));
            }
        } else {
            alert("Ne možete oceniti trening kome niste prisustvovali");
        }
    })

    // ---- komentarisanje
    $('#komentar').on('submit', function() {
        let stranica = $(location).attr('pathname').split('/').slice(-1)[0].split('.').slice(0)[0].split('-').slice(0,2);
        if(prisustvovao(stranica)) {
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
        } else {
            alert("Ne možete komentarisati trening kome niste prisustvovali");
        }
    })

    //prikaz komentara
    let brkomentara = localStorage.getItem(stranica+' brkomentara');
    if(brkomentara!=null) {
        for(let i=0; i<brkomentara; i++) {
            let komentar = localStorage.getItem(stranica+' komentar'+i);
            let datum = localStorage.getItem(stranica+' datum'+i);
            if(jezik==="en") $(komentari).append('<div class="kom border border-info"><p>'+komentar+'</p>Submitted: '+datum+'</div>');
            else $(komentari).append('<div class="kom border border-info"><p>'+komentar+'</p>Postavljeno: '+datum+'</div>');
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
        let validity  = 'false';   // 'false' is false, '' is valid
        let tip       = nbsp;           // non breaking space -- &nbsp;
        let lang      = getLang();
        
        // check if the full name length is appropriate
        if     ( firstname.val().length === 0 ) validity = '';
        else if( firstname.val().length > 32  ) tip = {'sr': 'ime predugačko', 'en': 'first name too long'}[lang];
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
        let tip      = nbsp;          // non breaking space -- &nbsp;
        let lang     = getLang();
        
        // check if the full name length is appropriate
        if     ( lastname.val().length === 0 ) validity = '';
        else if( lastname.val().length > 64  ) tip = {'sr': 'prezime predugačko', 'en': 'last name too long'}[lang];
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
        let date  = $(this);
        let valid = date[0].checkValidity();
        let tip   = nbsp;      // non breaking space -- &nbsp;
        let lang  = getLang();

        // check if the date is in the correct format
        if( !valid ) tip = {'sr': 'neispravan format datuma', 'en': 'invalid date format'}[lang];
        
        // set the help tip
        $('#datum-help').html(tip);
        // reset the general form tip
        $("#forma-help").html('');
    });

    // check if the email field is valid, if it isn't output help text and change field background color
    $("#imejl").on('input', function() {
        let email    = $(this);
        let validity = 'false';   // 'false' is false, '' is valid
        let tip      = nbsp;      // non breaking space -- &nbsp;
        let lang     = getLang();
        let regex    = RegExp(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
        
        // check if the email length is appropriate and that it is in the correct format (html standard)
        if     ( email.val().length === 0 ) validity = '';
        else if( email.val().length > 128 ) tip = {'sr': 'email predugačak',          'en': 'email too long'      }[lang];
        else if( !regex.test(email.val()) ) tip = {'sr': 'neispravan format email-a', 'en': 'invalid email format'}[lang];
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
        let lang     = getLang();
        let regex    = RegExp(/\+[0-9]+/);
        
        // check if the username length is appropriate and that it only contains ascii symbols and spaces
        if     ( phonenum.val().length === 0 ) validity = '';
        else if( phonenum.val().length < 8   ) tip = {'sr': 'broj telefona previše kratak',     'en': 'phone number too short'     }[lang];
        else if( phonenum.val().length > 16  ) tip = {'sr': 'broj telefona predugačak',         'en': 'phone number too long'      }[lang];
        else if( !regex.test(phonenum.val()) ) tip = {'sr': 'neispravan format broja telefona', 'en': 'invalid phone number format'}[lang];
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
        // get the current language
        let lang = getLang();
        
        // if any of the form fields is invalid, don't send the request
        if( $("#ime-help"     ).html() != nbsp
         || $("#prezime-help" ).html() != nbsp
         || $("#datum-help"   ).html() != nbsp
         || $("#imejl-help"   ).html() != nbsp
         || $("#telefon-help" ).html() != nbsp
         || $("#napomena-help").html() != nbsp
        )
        {
            $("#forma-help").html({'sr': 'forma nije ispravno popunjena', 'en': 'invalid form'}[lang]);
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
            $("#forma-help").html({'sr': 'forma nije dovršena', 'en': 'incomplete form'}[lang]);
            return;
        }

        // save the request to local storage
        let pagename = $('meta[name="page-name"]').attr("content");
        localStorage.setItem('zahtev-' + pagename, JSON.stringify(request));
    });



    // get the current page and language
    function getPage()
    {
        let page = window.location.pathname.split("/").pop();
        let regex   = /^(.*)-(sr|en).html$/;

        page = regex.exec(page);
        if( page.length < 3 ) return { "file": "pocetna", "lang": "sr" };

        return { "file": page[1], "lang": page[2] };
    }

    function getLang() { return getPage().lang; }

    // change the language to English
    $("#en").on('click', function() {
        let page = getPage();
        if( !page || page.lang == 'en' ) return;

        let path = page.file + '-en.html';
        window.location.replace(path);
    });

    // change the language to Serbian
    $("#sr").on('click', function() {
        let page = getPage();
        if( !page || page.lang == 'sr' ) return;

        let path = page.file + '-sr.html';
        window.location.replace(path);
    });

    // set the language buttons active status
    $("#" + getLang()).addClass("active");



    // define times of the day and days on which trainings are held
    let times = ['08', '10', '12', '14', '16', '18', '20'];
    let days  = { 'sr': ['pon', 'uto', 'sre', 'cet', 'pet', 'sub', 'ned'],
                  'en': ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], };

    // define training types
    let training_kind = [
        'all', 'card', 'core', 'pila', 'yoga',
    ];
    let training_type = [
        'card-aer', 'card-box', 'card-spi',
        'core-bar', 'core-kla', 'core-yog',
        'pila-kla', 'pila-ref', 'pila-sto',
        'yoga-ash', 'yoga-pow', 'yoga-vin',
    ];

    let training_badge = {
        'card': 'badge-success',
        'core': 'badge-warning',
        'pila': 'badge-primary',
        'yoga': 'badge-info',
    };

    // get termins for the current week and their type and availability
    function getTermins()
    {
        let termins = JSON.parse(localStorage.getItem('termins'));
        if( termins ) return termins;

        termins = {};
        for( let i = 0; i < days['sr'].length; i++ )
        {
            let day = days['sr'][i];
            termins[day] = {};
            
            for( let j = 0; j < times.length; j++ )
            {
                let time = times[j];
                termins[day][time] = {
                    'type' : training_type[Math.floor(Math.random()*12)],
                    'taken': false,
                };
            }

        }

        setTermins(termins);
        return termins;
    }

    // set termins for the current week
    function setTermins(termins)
    {
        if( !termins ) return;
        localStorage.setItem('termins', JSON.stringify(termins));
    }

    // check if the termin has passed
    function hasTerminPassed(day, time)
    {
        if( jQuery.inArray(day,  days['sr']) == -1 ) return;
        if( jQuery.inArray(time, times     ) == -1 ) return;

        let curr_date  = new Date();
        let curr_iday  = (curr_date.getDay() - 1) % 7;
        let curr_itime = curr_date.getHours();

        let iday = 0;
        for( ; iday < days['sr'].length; iday++ )
            if( day == days['sr'][iday] )
                break;

        let itime = parseInt(time);
        
        return ( curr_iday >  iday
            || ( curr_iday == iday && curr_itime >= itime ) );
    }

    // reserve a termin for a particular day and time, return true if the termin has been reserved
    function reserveTermin(day, time)
    {
        if( jQuery.inArray(day,  days['sr'] ) == -1 ) return;
        if( jQuery.inArray(time, times      ) == -1 ) return;
        
        let termins = getTermins();
        if( termins[day][time]['taken'] ) return false;
        if( hasTerminPassed(day, time) ) return false;

        termins[day][time]['taken'] = true;
        setTermins(termins);
        return true;
    }

    // cancel a termin for a particular day and time, return if the termin has been cancelled
    function cancelTermin(day, time)
    {
        if( jQuery.inArray(day,  days['sr'] ) == -1 ) return;
        if( jQuery.inArray(time, times      ) == -1 ) return;
        
        let termins = getTermins();
        if( !termins[day][time]['taken'] ) return false;
        if( hasTerminPassed(day, time) ) return false;
            
        termins[day][time]['taken'] = false;
        setTermins(termins);
        return true;
    }



    // initialize termins page section
    $("#termini").ready(function() {
        drawTermins('all');
    });

    // initialize filters
    $(".filter").on('click', function() {
        let filter = $(this).attr('filter');
        drawTermins(filter);
    });
    
    // draw the week calendar with termin badges
    function drawTermins(type)
    {
        if( !type || jQuery.inArray(type, training_kind.concat(training_type)) == -1 ) return;

        let tbody = $("#termini tbody");
        if( !tbody ) return;

        tbody.empty();
        let termins = getTermins();

        
        for( const time of times )
        {
            let row = $('<tr></tr>').appendTo(tbody);

            for( const day of ['vreme'].concat(days['sr']) )
            {
                let cell = $("<td></td>").appendTo(row);
                let cont = '';

                if( day === 'vreme' )
                {
                    cont = document.createTextNode(time + ':00');
                    cont = $(cont).appendTo(cell);
                    continue;
                }

                let training      = termins[day][time];
                let training_type = training['type'];
                let training_kind = training_type.split('-')[0];
                let badge         = training_badge[training_kind];

                if( type !== 'all' &&  type !== training_kind && training_type !== type )
                    continue;

                cont = '<button id="' + 'termin-' + termins[day] + '-' + termins[day][time] + '" class="btn w-75 badge">' + termins[day][time]['type'] + '</button>';
                cont = $(cont).appendTo(cell);

                if     ( hasTerminPassed(day, time) ) cont.addClass('badge-secondary');
                else if( training['taken'] === true ) cont.addClass('badge-light');
                else                                  cont.addClass(badge);

                cont.on('click', function() {
                    if( reserveTermin(day, time) )
                    {
                        $(this).removeClass(badge);
                        $(this).addClass('badge-light');
                    }
                    else if( cancelTermin(day, time) )
                    {
                        $(this).removeClass('badge-light');
                        $(this).addClass(badge);
                    }
                });
            }

        }

    }



    // initialize reserved termins
    $("zakazano").ready(function() {
        drawReservedTermins();
    });

    // draw reserved termins
    function drawReservedTermins() {
        let lang = getLang();
        let termins = getTermins();
        
        let tbody = $("#zakazano tbody");
        if( !tbody ) return;
        tbody.empty();


        for( let d = 0; d < days['sr'].length; d++ )
        {
            const day = days['sr'][d];
            for( const time of times )
            {
                if( termins[day][time]['taken'] === true )
                {
                    let row = $('<tr></tr>').appendTo(tbody);
                    let cell, cont;

                    cell = $("<td></td>").appendTo(row);
                    cont = document.createTextNode(days[lang][d]);
                    cont = $(cont).appendTo(cell);

                    cell = $("<td></td>").appendTo(row);
                    cont = document.createTextNode(time + ':00');
                    cont = $(cont).appendTo(cell);
                    
                    cell = $("<td></td>").appendTo(row);
                    cont = $('<div class="badge w-50">' + termins[day][time]['type'] + '</div>').appendTo(cell);

                    let training      = termins[day][time];
                    let training_type = training['type'];
                    let training_kind = training_type.split('-')[0];
                    let badge         = training_badge[training_kind];
    
                    if( hasTerminPassed(day, time) ) cont.addClass('badge-secondary');
                    else                             cont.addClass(badge);
    
                    cont = $('<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>').appendTo(cell);
                    cont = $("<div class='btn badge btn-outline-dark'>x</div>").appendTo(cell);
                    cont.on('click', function() {
                        if( cancelTermin(day, time) )
                            drawReservedTermins();
                    });
                }
            }
        }
    }

    // ------------- najpopularniji treninzi -----------------------------------------------------------------------------------------
    var i, ocene = [];
    let query1 = / ocena/g;
    for (i in localStorage) {
        if (localStorage.hasOwnProperty(i)) {
            if (i.match(query1) || (!query1 && typeof i === 'string')) {
                value = localStorage.getItem(i);
                ocene.push({key:i,val:value});
            }
        }
    }
    ocene.sort(function (a, b) { return a.val-b.val; });
    if(ocene.length>=3) {
        let jezik = $(location).attr('pathname').split('/').slice(-1)[0].split('.').slice(0)[0].split('-').slice(1)[0];
        for(let i = 0; i<3; i++) {
            let prvi = ocene.pop();
            let putanja =  prvi.key.split(" ")[0].split(",")[0]+"-"+prvi.key.split(" ")[0].split(",")[1];
            $("#najpopularniji"+(i+1)).html("<h4>"+prvi.key.split(" ")[0].split(",")[0]+" - "+prvi.key.split(" ")[0].split(",")[1]+
            "</h4><hr><a href='"+putanja+"-"+jezik+".html'><img src='assets/"+putanja+"1.jpg'></a>");
        }
    }
    
});

