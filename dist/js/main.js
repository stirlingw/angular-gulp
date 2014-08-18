(function (window, undefined) {
    var
        History = window.History, // Note: We are using a capital H instead of a lower h
        State = History.getState();

    // Bind to State Change
    History.Adapter.bind(window, 'statechange', function () { // Note: We are using statechange instead of popstate
        // Log the State
        var State = History.getState(); // Note: We are using History.getState() instead of event.state

        loadProject(State);

    });
})(window);


function loadMap() {

    var latlng = new google.maps.LatLng(53.794704, -1.538399);
    var mi = '/img/P53PIN.png';
    var mSize = new google.maps.Size(50, 50);
    if ($('html').hasClass('2x'))
        mi = '/img/P53PIN@2x.png';
    var image = {
        url: mi,
        size: mSize,
        scaledSize: mSize,
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(25, 50)
    };
    $('#map-canvas').gmap3({
        map: {
            options: {
                center: latlng,
                zoom: 16,
                styles: [{
                    "stylers": [{ "invert_lightness": true }, {
                        "saturation": -100
                    }, { "lightness": 3 }]
                }, {
                    "elementType": "labels.text",
                    "stylers": [{ "weight": 0.1 }, { "saturation": -100 }, {
                        "lightness": -44
                    }]
                }, {
                    "featureType": "road.highway", "stylers":
                        [{ "color": "#31927a" }, { "weight": 0.3 }]
                }, {
                    "featureType":
                        "road.arterial", "stylers": [{ "color": "#2f9f80" }, {
                        "weight":
                            0.3
                    }]
                }, {
                    "featureType": "road.local", "stylers": [{
                        "weight":
                            0.2
                    }, { "color": "#487380" }]
                }, {
                    "featureType": "transit.line",
                    "stylers": [{ "color": "#568080" }]
                }, {
                    "featureType": "water",
                    "stylers": [{ "color": "#437180" }, { "weight": 0.1 }]
                }],

                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: true,
                scrollwheel: false,
                mapTypeControlOptions: { mapTypeIds: [google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.ROADMAP] },
                navigationControl: false,
                navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
                panControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.LEFT_CENTER
                },
                streetViewControl: false
            }
        },
        marker: {
            latLng: latlng,
            options: { icon: image }
        }
    });
    gmap = $('#map-canvas').gmap3("get");
    google.maps.event.addDomListener(window, "resize", function () {
        var center = gmap.getCenter();
        google.maps.event.trigger(gmap, "resize");
        gmap.setCenter(center);
    });
}

$(document).ready(function () {

    $("#contact-form").submit(function (event) {
        $(".btn-primary").addClass("disabled");
        //$(this).slideUp();
        $.post("partials/contactengine.php",
            $("#contact-form").serialize(),
            function (data, txtMess, a) {
                $("#contact-form").slideUp();
                $(".message-sent").slideDown();
                ga('send', 'pageview', {
                    'page': '/contact-email-sent',
                    'title': 'Contact Email Sent'
                });
            });
        event.preventDefault();
    });

    $('.project').click(function () {
        $(this).toggleClass('on');
    });


    $('.project-details').click(function () {
        $('.project').removeClass('on');
    });

    $('.work-item').on('click', '.btn-nav', function (e) {
        e.preventDefault();

        if ($(this).attr('id') == "next-project") {
            curIndex++;
        } else {
            curIndex--;
        }

        $('#next-project').blur();


        if (curIndex >= projects.length) {
            curIndex = 0;
        } else if (curIndex < 0) {
            curIndex = projects.length;
        }
        History.pushState({
                project: projects[curIndex],
                nextProject: curIndex + 1 >= projects.length ? projects[0] : projects[curIndex + 1],
                prevProject: curIndex - 1 < 0 ? projects[projects.length - 1] : projects[curIndex - 1]
            },
            projects[curIndex].title + " | Projects | Project 53",
            projects[curIndex].name.toLowerCase());
    });

    $('.share .twitter').click(function (event) {
        event.preventDefault();
        window.open($(this).attr('href'), 'Share', 'width=320,height=400');
    });

    if (typeof projects != 'undefined') {
        if (projects.length > 0) {
            $('#next-project').attr('href', curIndex + 1 >= projects.length ? projects[0].name : projects[curIndex + 1].name);
            $('#previous-project').attr('href', curIndex - 1 < 0 ? projects[projects.length - 1].name : projects[curIndex - 1].name);
        }
    }

    var dave = "https://plus.google.com/104172745207620090435";
    var stephen = "https://plus.google.com/102287567218402952449";
    var nick = "https://plus.google.com/109744178232397680611";

    var currentAuthor = $("#article-author").text().replace(/\s/g, "");

    if (currentAuthor === "DaveRushton") {
        $("a[id='article-author']").attr('href', dave);
    }
    else if (currentAuthor === "StephenThomas") {
        $("#article-author").attr("href", stephen);
    } else if (currentAuthor === "NickGoodliff") {
        $("#article-author").attr("href", nick);
    }
});


function loadProject(state) {
    $.get('/projects/' + state.data.project.name, '', function (newhtml) {
        $('html,body').animate({ scrollTop: 0 }, 400);
        $(".work-item>.container:first-child").fadeOut(400, function () {
            $(".link-back").replaceWith($(newhtml).find('.link-back'));
            $(".work-item>.container:first-child>.project-wrapper").replaceWith($(newhtml).find('.project-wrapper'));
            $('#next-project').attr('href', state.data.nextProject.name.toLowerCase());
            $('#previous-project').attr('href', state.data.prevProject.name.toLowerCase());
            $(".work-item>.container:first-child").fadeIn(300);
            $('.twitter-project').attr('href', "https://twitter.com/share?url=http://p53.co.uk/projects/" + state.data.project.name.toLowerCase());
            $('.email-project').attr('href', "mailto:?subject=Re: Project 53 - " + state.data.project.name + "&body=http://p53.co.uk/projects/" + state.data.project.name.toLowerCase());
            makeImagesResponsive();
        });
    });

    ga('send', 'pageview', {
        'page': '/projects/' + state.data.project.name.toLowerCase(),
        'title': state.title
    });
    ;}