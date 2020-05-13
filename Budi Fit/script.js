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
    })

});

