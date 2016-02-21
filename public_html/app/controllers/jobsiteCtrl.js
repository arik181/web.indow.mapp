'use strict';

mapp.config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});

mapp.controller('jobsiteCtrl', ['$scope', '$location', '$interval', '$http',
function($scope, $location, $interval, $http) {

    //window.MY_SCOPE = $scope;
    //localStorage.clear();
    
    /*** Pages ***/


    if ($location.host() == 'localhost') {
        $scope.baseURL = 'http://localhost:8081';
    } else if ($location.host() == '192.168.1.4') {
        $scope.baseURL = 'http://192.168.1.4:8081';
    } else if ($location.host() == '192.168.33.10'
    ||         $location.host() == '192.168.33.11'
    ||         $location.host() == '192.168.33.12') {
        $scope.baseURL = 'http://192.168.33.20';
    } else {
        $scope.baseURL = 'http://indowdev.com';
    }
    //$scope.baseURL             = ($location.host() == 'localhost'?"http://localhost:8081":'http://indowdev.com');
    $scope.site_list           = "true";

    $scope.jobsite_create      = "true";
    $scope.contact_edit        = "false";
    $scope.jobsite_edit        = "false";

    $scope.room_list           = "false";
    $scope.window_detail       = "false";

    $scope.roomfieldvisible    = "false";
    $scope.roomfield           = "";
    
    /*** Defaults ***/
    $scope.username = '';
    $scope.password = '';
    $scope.window_order = function(window) {
        if (window.id === undefined) {
            return 9999999999;
        } else {
            return window.id;
        }
    };

    $scope.customerinfo = {
        first_name     : "",
        last_name      : "",
        company        : "",
        emailOne       : "",
        emailOneType   : "",
        emailTwo       : "",
        emailTwoType   : "",
        phoneOne       : "",
        phoneOneType   : "",
        phoneTwo       : "",
        phoneTwoType   : "",
        phoneThree     : "",
        phoneThreeType : ""
    };

    $scope.jobsiteinfo = {
        address        : "",
        address_ext    : "",
        city           : "",
        state          : "",
        zip            : "",
        type           : "",
        notes          : "",
        window_count   : 0,
        measured_count : 0,
        modified       : 0
    };

    /*** State ***/
    $scope.currentwindow = {
        id                    : "",
        shape                 : "Rectangle",
        room                  : "",
        location              : "",
        floor                 : "",
        status                : "Include",
        product               : "Insert",
        product_type          : "Standard",
        gasket                : "White",
        frame_step            : "1",
        frame_depth           : { id: 1, value : 0.5, string : 'Less than 5/8 in.' },
        points                : ['','','','','',''],
        extensions            : [0,0,0,0,0,0],
        extension             : "false",
        notes                 : "",
        drafty_window         : false,
        max_width             : "",
        max_height            : "",
        dirty                 : false,
        top_spine             : "false",
        side_spines           : "false",
        top_side_spines       : "false",
        validation_status     : "",
        validation_passed     : false,
        validation_warning    : false,
        current_well_type     : "",
        validation_visibility : false
    };

    $scope.currentroom = {
        index   : 0,
        name    : "",
        windows : []
    };

    $scope.current_site_index   = 0;
    $scope.current_room_index   = 0;
    $scope.current_window_index = 0;

    $scope.current_input_focus = 0;
    $scope.current_highlight   = 'A';
    $scope.well_status_visible = false;
    $scope.current_well_status = '';
    $scope.current_well_type   = 'alert-message';
    $scope.selected_room       = '';

    $scope.sort_by         = "room";

    $scope.flipped   = false;
    $scope.checked   = false;
    $scope.dirty     = false;
    $scope.logged_in = false;
    $scope.mapp_key  = '';

    $scope.actives   = [];
    $scope.deleted   = [];

    /*** Options ***/
    $scope.shape_options = [
        'Select a Shape',
        'Rectangle',
        'Trapezoid',
        'Custom'
    ];

    $scope.status_options = [
        'Select a Status',
        'Include',
        'Hold'
    ];

    $scope.room_options = [ ];

    $scope.products = [
        'Select a Product',
        'T2 Insert',
        'Legacy Insert',
        'Skylight Insert',
    ];

    $scope.product_types = [
        'Select a Product Type',
        'Standard',
        'Museum',
        'Commercial',
        'Privacy',
        'Blackout',
        'Acoustic',
        'Acoustic Blackout',
        'Acoustic Commercial',
        'Shade'

    ];

    $scope.insert_product_types   = [ ];
    $scope.skylight_product_types = [ ];
    $scope.t2_product_types       = [ ];

    $scope.product_type_max_lookup = [
        { max_width : 73.5 , max_height : 97.5 },
        { max_width : 73.5 , max_height : 97.5 },
        { max_width : 73.5 , max_height : 97.5 },
        { max_width : 49.5 , max_height : 97.5 },
        { max_width : 49.5 , max_height : 73.5 },
        { max_width : 73.5 , max_height : 97.5 },
        { max_width : 49.5 , max_height : 97.5 },
        { max_width : 49.5 , max_height : 97.5 }
    ];

    $scope.insert_max_lookup   = [ ];
    $scope.skylight_max_lookup = [ ];
    $scope.t2_max_lookup = [ ];

    $scope.gaskets = [
        'Select Tubing',
        'White',
        'Brown',
        'Black'
    ];

    $scope.frame_steps = [
        'Select Step',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10'
    ];

    $scope.frame_depths = [
        { id: 0, value : 0,    string : 'Select Depth'         },
        { id: 1, value : 0.5,  string : 'Less than 5/8 in.'    },
        { id: 2, value : 0.75, string : 'Narrow (5/8 - 1 in.)' },
        { id: 3, value : 1.5,  string : 'Med (1 - 2 in.)'      },
        { id: 4, value : 2.1,  string : 'Deep (2+ in.)'        }
    ];

    /*** Types ***/
    $scope.email_types = 
    [
        'Home',
        'Work'
    ]

    $scope.phone_types = 
    [
        'Home',
        'Work',
        'Mobile'
    ]

    $scope.measurement_characters =
    [ 'A', 'B', 'C', 'D', 'E', 'F' ];

    $scope.measurement_tooltips =
    [ 'Width Top', 
      'Width Bottom', 
      'Height Left', 
      'Height Right', 
      'Diagonal Left', 
      'Diagonal Right' ];

    // ( 51 with DC )
    $scope.states = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
        'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
        'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
        'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
        'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI',
        'WY', 'AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 
        'PE', 'QC', 'SK', 'YT' 
    ];

    $scope.address_types = [
        'Home',
        'Billing',
        'Shipping'
    ];

    /** Defaults **/
    $scope.settings = 
    {
        gasket       : "White",
        product_type : "Standard",
        frame_depth  : { id: 1, value : 0.5,  string : 'Less than 5/8 in.'      },
        username     : "",
        password     : ""
    };

    /** Status **/
    $scope.well_status = 
    {  
        'Rectangle' :
        [
            'Measure between the top left and top right corner',
            'Measure between the bottom left and bottom right corner',
            'Measure between the bottom left and top left corner',
            'Measure between the bottom right and top right corner',
            'Measure between the bottom left and top right corner',
            'Measure between the top left and bottom right corner'
        ],
        'Trapezoid' :
        [
            'Measure between the top left and top right corner',
            'Measure between the bottom left and bottom right corner',
            'Measure between the bottom left and top left corner',
            'Measure between the bottom right and top right corner',
            'Measure between the bottom left and top right corner',
            'Measure between the top left and bottom right corner'
        ],
       'Custom' :
        [
            'Measure between the top left and top right corner',
            'Measure between the bottom left and bottom right corner',
            'Measure between the bottom left and top left corner',
            'Measure between the bottom right and top right corner',
            'Measure between the bottom left and top right corner',
            'Measure between the top left and bottom right corner'
        ]
    };

    /*** Internal functions ***/
    var getSettings = function()
    {
        if ( localStorage["mapp.settings.storage"] === "true" )
        {
            return JSON.parse(localStorage["mapp.settings"]);

        } else {

            var settings = [];

            localStorage["mapp.settings"] = JSON.stringify($scope.settings);
            localStorage["mapp.settings.storage"]  = "true";

            return settings;
        }
    }

    // Gets a list of all jobsites and sets the $scope.jobsites variable
    var getLocalJobSites = function()
    {
        if ( localStorage["mapp.jobsites.storage"] === "true" )
        {
            return JSON.parse(localStorage["mapp.jobsites"]);

        } else {

            var jobsites = [];

            localStorage["mapp.jobsites"] = JSON.stringify(jobsites);
            localStorage["mapp.jobsites.storage"]  = "true";

            return jobsites;
        }
    }

    // Gets currently active window state
    var getActiveWindows = function()
    {
        if ( localStorage["mapp.actives.storage"] === "true" )
        {
            return JSON.parse(localStorage["mapp.actives"]);

        } else {

            var actives = [];

            localStorage["mapp.actives"] = JSON.stringify(actives);
            localStorage["mapp.actives.storage"]  = "true";

            return actives;
        }
    }

    var buildEmptyActives = function()
    {
        var actives = [];

        var si_length = $scope.jobsites.length;
        for ( var si_idx = 0; si_idx < si_length; ++si_idx )
        {
            actives.push( {} ); // push a site
            actives[si_idx].rooms = []; // add a roomlist to site

            if ( $scope.jobsites[si_idx].hasOwnProperty('rooms') )
            {
                var ro_length = $scope.jobsites[si_idx].rooms.length;
                for ( var ro_idx = 0; ro_idx < ro_length; ++ro_idx )
                {
                    actives[si_idx].rooms.push( {} ); // push a room
                    actives[si_idx].rooms[ro_idx].windows = []; // add a windowlist to room

                    if ( $scope.jobsites[si_idx].hasOwnProperty('windows') )
                    {
                        var wi_length =  $scope.jobsites[si_idx].rooms[ro_idx].windows.length;
                        for ( var wi_idx = 0;  wi_idx < wi_length; ++wi_idx )
                        {
                            actives[si_idx].rooms[ro_idx].windows.push(false); // push a window state
                        }
                    }
                }
            }
        }

        return actives;
    }

    var setActiveWindow = function(site_index, room_index, window_index)
    {
        $scope.actives = buildEmptyActives();
        $scope.actives[site_index].rooms[room_index].windows[window_index] = true;
    }

    // Returns a list of rooms given a jobsite id
    var getRooms = function(site_index)
    {
        console.log("**getRooms()");
        $scope.jobsites = getLocalJobSites();
        $scope.actives  = getActiveWindows();

        if ( site_exists(site_index)
        &&   $scope.jobsites[site_index].hasOwnProperty('rooms') )
        {
            return $scope.jobsites[site_index].rooms;
        } 

        return [];
    }

    var addRoom = function(site_index, room_name)
    {
        console.log("**addRoom()");

        if ( ! site_exists(site_index) )
            return;

        var new_room = 
        {
            name        : room_name,
            windows     : []
        };

        $scope.jobsites = getLocalJobSites();
        $scope.actives  = getActiveWindows();

        var index;

        if ($scope.jobsites[site_index].hasOwnProperty('rooms'))
        {
            index = $scope.jobsites[site_index].rooms.length;
            $scope.jobsites[site_index].rooms.push(new_room);

        } else if ( site_exists(site_index) ) {

            index = 0;
            $scope.jobsites[site_index].rooms = [];
            $scope.jobsites[site_index].rooms.push(new_room);
        }

        /*
        $scope.currentwindow.room = new_room.name;
        $scope.currentroom.name   = new_room.name;
        $scope.currentroom.index  = new_room.index;*/

        $scope.dirty                        = true;
        $scope.jobsites[site_index].dirty   = true;

        saveLocalJobSites();
        saveActiveWindows();

        getSelectionRoomOptions($scope.current_site_index);

        getRoomList($scope.current_site_index);

        return index;
    }

    var setCurrentWindow = function(site_index, room_index, window_index)
    {
        console.log("**setCurrentWindow()");

        if ( ! room_exists(site_index, room_index) )
            return;

        $scope.current_window_index = window_index;
        $scope.current_room_index   = room_index;
        $scope.current_site_index   = site_index;

        var attr;
        for ( attr in $scope.currentwindow )
        {
            $scope.currentwindow[attr] = 
                $scope.jobsites[site_index].rooms[room_index].windows[window_index][attr];
        }

        $scope.jobsites = getLocalJobSites();
        $scope.actives  = getActiveWindows();

        $scope.currentwindow.room        = $scope.jobsites[site_index].rooms[room_index].name;
        $scope.currentroom.name          = $scope.jobsites[site_index].rooms[room_index].name;

        $scope.current_validation_status = $scope.currentwindow.validation_status;
        $scope.current_validation_passed = $scope.currentwindow.validation_passed;
        $scope.current_validation_passed = $scope.currentwindow.validation_warning;
        $scope.current_well_type         = $scope.currentwindow.current_well_type;
        $scope.validation_visbile        = $scope.currentwindow.validation_visibility;
        $scope.checked                   = false;

        activateWindow(site_index, room_index, window_index);

        saveLocalJobSites();
        saveActiveWindows();

        getRoomList(site_index);
    }

    var setCurrentProductDropdown = function(site_index, room_index, window_index)
    {
        if ( window_exists(site_index, room_index, window_index) )
        {
            if ( $scope.currentwindow.product == 'Insert' || $scope.currentwindow.product == 'Legacy Insert')
            {
                $scope.product_types = [ 'Select a Product Type' ];
                $scope.product_types = $scope.product_types.concat($scope.insert_product_types);

            } else if ($scope.currentwindow.product == 'T2 Insert') {
                $scope.product_types = [ 'Select a Product Type' ];
                $scope.product_types = $scope.product_types.concat($scope.t2_product_types);
            } else {

                $scope.product_types = [ 'Select a Product Type' ];
                $scope.product_types = $scope.product_types.concat($scope.skylight_product_types);
            }
        }
        //$scope.currentwindow.product_type = 'Select a Product Type';
    }

    var activateWindow = function(site_index, room_index, window_index)
    {
        console.log("**activateWindow()");

        if ( window_exists(site_index, room_index, window_index) )
        {
            setActiveWindow(site_index, room_index, window_index);
            setCurrentProductDropdown(site_index, room_index, window_index);
        }
    }

    var deactivateAllWindowsInSite = function(site_index)
    {
        console.log("**deactivateAllWindowsInSite()");

        $scope.actives = buildEmptyActives();
    }

    var setNewWindow = function(site_index, room_index)
    {
        console.log("**setNewWindow()");
        var def_gas = $scope.jobsites[$scope.current_site_index].jobsiteinfo.default_tubing;
        var def_prod = $scope.jobsites[$scope.current_site_index].jobsiteinfo.default_product;
        var def_frame = $scope.jobsites[$scope.current_site_index].jobsiteinfo.default_frame_depth;
        console.log('defaults', def_gas, def_prod, def_frame);

        $scope.currentwindow = {
            id                    : "",
            shape                 : "Rectangle",
            room                  : "",
            location              : "",
            floor                 : "",
            status                : "Include",
            product               : "T2 Insert",
            product_type          : def_prod ? def_prod : "Standard",
            gasket                : def_gas ? def_gas : "White",
            frame_step            : "1",
            frame_depth           : def_frame ? def_frame : { id: 1, value : 0.5,  string : 'Less than 5/8 in.'      },
            points                : ['','','','','',''],
            extensions            : [0,0,0,0,0,0],
            extension             : "false",
            notes                 : "",
            drafty_window         : false,
            max_width             : "",
            max_height            : "",
            dirty                 : true,
            top_spine             : "false",
            side_spines           : "false",
            top_side_spines       : "false",
            validation_status     : "",
            validation_visibility : false
        };

        if ( room_exists(site_index, room_index) )
        {
            $scope.current_window_index = $scope.jobsites[site_index].rooms[room_index].windows.length;

        } else {

            $scope.current_window_index = 0;
        }

        $scope.current_well_status = "";
        $scope.current_well_type   = 'alert-message';
        $scope.well_status_visible = false;

        $scope.jobsites = getLocalJobSites();
        $scope.actives  = getActiveWindows();
    }

    var clearWindow = function(site_index, room_index, window_index)
    {
        console.log("**clearWindow()");

        // May be necessary for future shapes...
        //$scope.changeShape(site_index, room_index, window_index);

        $scope.currentwindow = {
            id                    : "",
            shape                 : "Rectangle",
            room                  : "",
            location              : "",
            floor                 : "",
            status                : "Include",
            product               : "Insert",
            product_type          : "Standard",
            gasket                : "White",
            frame_step            : "1",
            frame_depth           : { id: 1, value : 0.5,  string : 'Less than 5/8 in.'      },
            points                : ['','','','','',''],
            extensions            : [0,0,0,0,0,0],
            extension             : "false",
            notes                 : "",
            drafty_window         : false,
            dirty                 : true,
            top_spine             : "false",
            side_spines           : "false",
            top_side_spines       : "false",
            validation_status     : "",
            validation_passed     : false,
            validation_warning    : false,
            current_well_type     : "",
            validation_visibility : false
        };
    }

    // Returns a list of windows given a site id and a room id 
    var getWindows = function(site_index, room_index)
    {
        console.log("**getWindows()");

        if ( ! room_exists(site_index, room_index) )
            return;

        var rooms = getRooms(site_index);

        if ( rooms[room_index].hasOwnProperty('windows') )
        {
            return rooms[room_index].windows;

        } else {
            return [];
        }

        return rooms[room_index].windows;
    }

    var saveLocalJobSites = function()
    {
        localStorage["mapp.jobsites"] = JSON.stringify($scope.jobsites);
        localStorage["mapp.jobsites.storage"]  = "true";
    }

    var saveActiveWindows = function()
    {
        localStorage["mapp.actives"] = JSON.stringify($scope.actives);
        localStorage["mapp.actives.storage"]  = "true";
    }

    var saveSettings = function()
    {
        if (!$scope.site_list || $scope.site_list === "false") {
            $scope.jobsites[$scope.current_site_index].jobsiteinfo.default_tubing = $scope.defaults.tubing;
            $scope.jobsites[$scope.current_site_index].jobsiteinfo.default_product = $scope.defaults.product;
            $scope.jobsites[$scope.current_site_index].jobsiteinfo.default_frame_depth = $scope.defaults.frame_depth;
        }
        if ($('#apply_all').prop('checked')) {
            $scope.updateAllWindows($scope.current_site_index, {
                product_type: $scope.defaults.product,
                frame_depth: $scope.defaults.frame_depth,
                frame_depth_id: $scope.defaults.frame_depth.id,
                gasket: $scope.defaults.tubing
            });
        }
        console.log("**saveSettings()");

        localStorage["mapp.settings"] = JSON.stringify($scope.settings);
        localStorage["mapp.settings.storage"]  = "true";
    }

    var createJobSite = function()
    {
        var new_site = {};

        var customerinfo        = JSON.parse(localStorage["mapp.temp.customerinfo"]);
        var jobsiteinfo         = JSON.parse(localStorage["mapp.temp.jobsiteinfo"]);

        new_site.customerinfo   = customerinfo;
        new_site.jobsiteinfo    = jobsiteinfo;
        new_site.jobsiteinfo.default_product = 'Standard';
        new_site.jobsiteinfo.default_tubing = 'White';
        new_site.jobsiteinfo.default_frame_depth = {id: 1, value: 0.5, string: 'Less than 5/8 in.'};

        $scope.jobsites         = getLocalJobSites();
        $scope.actives          = getActiveWindows();

        new_site.dirty          = true;
        $scope.dirty            = true;

        $scope.jobsites.push(new_site);

        localStorage["mapp.jobsites"] = JSON.stringify($scope.jobsites);
    }

    var createWindow = function(site_index, room_index)
    {
        console.log("**createWindow()");
        $scope.jobsites = getLocalJobSites();
        $scope.actives  = getActiveWindows();

        addWindow(site_index, room_index, $scope.currentwindow);
    }

    var updateWindow = function(site_index, room_index, window_index)
    {
        console.log("**updateWindow()");
        $scope.jobsites = getLocalJobSites();
        $scope.actives  = getActiveWindows();

        changeWindow(site_index, room_index, window_index, $scope.currentwindow);
    }

    var addWindow = function(site_index, room_index, window_index)
    {
        console.log("**addWindow()");

        addWindowToJobsiteRoom(site_index, room_index, window_index);
    }

    var addRoomListIfEmpty = function(site_index)
    {
        if ( ~ $scope.jobsites[site_index].rooms )
        {
            $scope.jobsites[site_index].rooms = [];
            saveLocalJobSites();
            saveActiveWindows();
        }
    }

    var changeWindow = function(site_index, room_index, window_index, new_window)
    {
        console.log("**changeWindow()");

        updateWindowInJobsiteRoom(site_index, room_index, window_index, new_window);
    }

    var saveCustomerInfo = function()
    {
        localStorage["mapp.temp.customerinfo"] = JSON.stringify($scope.customerinfo);
    }

    var saveJobSiteInfo = function()
    {
        console.log("**saveJobSiteInfo()");
        localStorage["mapp.temp.jobsiteinfo"] = JSON.stringify($scope.jobsiteinfo);
    }

    var saveJobSiteNotes = function(site_index)
    {
        console.log("**saveJobNotes()");
        
        saveLocalJobSites();
        saveActiveWindows();

        setDirtyJobsite(site_index);
    }

    // Sets the $scope.rooms variable
    var getRoomList = function(site_index, room_index)
    {
        console.log("**getRoomList()");
        $scope.rooms = getRooms(site_index);
    }

    var getCustomerName = function(site_index)
    {
        if (site_exists(site_index))
        {
            return $scope.jobsites[site_index].customerinfo.first_name + ' ' + 
                   $scope.jobsites[site_index].customerinfo.last_name;
        }
        return '';
    }

    var getSiteAddress = function(site_index)
    {
        if (site_exists(site_index))
        {
            return $scope.jobsites[site_index].jobsiteinfo.address + '\n' +
                   $scope.jobsites[site_index].jobsiteinfo.address_ext + '\n' +
                   $scope.jobsites[site_index].jobsiteinfo.city + ', ' +
                   $scope.jobsites[site_index].jobsiteinfo.state + ' ' +
                   $scope.jobsites[site_index].jobsiteinfo.zip_code;
        }
        return '';
    }

    var getSelectionRoomOptions = function(site_index)
    {
        console.log("**getSelectionRoomOptions()");

        if ( ! site_exists(site_index) )
            return;

        $scope.jobsites = getLocalJobSites();
        $scope.actives  = getActiveWindows();

        if ($scope.jobsites[site_index].hasOwnProperty('rooms'))
        {
            $scope.room_options = [];
            $scope.jobsites[site_index].rooms.forEach( function(room) {
                $scope.room_options.push(room.name);
            });

            return $scope.room_options;
        }

        return [];
    }

    var getSelectionNewRoomOptions = function(site_index)
    {
        console.log("**getSelectionRoomOptions()");

        $scope.jobsites = getLocalJobSites();
        $scope.actives  = getActiveWindows();

        if ( ! site_exists(site_index) )
            return [];

        if ($scope.jobsites[site_index].hasOwnProperty('rooms'))
        {
            var rooms = [];
            $scope.jobsites[site_index].rooms.forEach( function(room) {
                if (!room.windows.length) {
                    rooms.push(room.name);
                }
            });

            return rooms;
        }

        return [];
    }

    var getPointExtensionState = function(site_index, room_index, window_index, point_index)
    {
        return $scope.currentwindow.extensions[point_index];
    }

    var resetTempInfo = function()
    {
        console.log("**resetTempInfo()");
        // Reset temporary customer and jobsite info

        $scope.customerinfo = {
            first_name     : "",
            last_name      : "",
            company        : "",
            emailOne       : "",
            emailOneType   : "",
            emailTwo       : "",
            emailTwoType   : "",
            phoneOne       : "",
            phoneOneType   : "",
            phoneTwo       : "",
            phoneTwoType   : "",
            phoneThree     : "",
            phoneThreeType : ""
        };

        localStorage["mapp.temp.customerinfo"] = $scope.customerinfo;

        $scope.jobsiteinfo = {
            address        : "",
            address_ext    : "",
            city           : "",
            state          : "",
            zip            : "",
            type           : "",
            notes          : "",
            window_count   : 0,
            measured_count : 0,
            modified       : (new Date).getTime()
        };

        localStorage["mapp.temp.jobsiteinfo"] = $scope.jobsiteinfo;
    }

    // Adds a window to a room, given a window and a room_index, 
    // returns a newly updated list of rooms.
    var addWindowToJobsiteRoom = function(site_index, room_index, window_index)
    {
        console.log("**addWindowToJobsiteRoom()");

        if ( ! room_exists(site_index, room_index) )
            return;

        var new_window = {};

        new_window.id                    = $scope.currentwindow.id;
        new_window.shape                 = $scope.currentwindow.shape;
        new_window.room                  = $scope.currentwindow.room;
        new_window.location              = $scope.currentwindow.location;
        new_window.floor                 = $scope.currentwindow.floor;
        new_window.status                = $scope.currentwindow.status;
        new_window.product               = $scope.currentwindow.product;
        new_window.product_type          = $scope.currentwindow.product_type;
        new_window.gasket                = $scope.currentwindow.gasket;
        new_window.frame_step            = $scope.currentwindow.frame_step;
        new_window.frame_depth           = $scope.currentwindow.frame_depth;
        new_window.points                = $scope.currentwindow.points;
        new_window.extensions            = $scope.currentwindow.extensions;
        new_window.extension             = $scope.currentwindow.extension;
        new_window.notes                 = $scope.currentwindow.notes;
        new_window.drafty_window         = $scope.currentwindow.drafty_window;
        new_window.max_width             = $scope.currentwindow.max_width;
        new_window.max_height            = $scope.currentwindow.max_height;
        new_window.dirty                 = $scope.currentwindow.dirty;
        new_window.top_spine             = $scope.currentwindow.top_spine;
        new_window.side_spines           = $scope.currentwindow.side_spines;
        new_window.top_side_spines       = $scope.currentwindow.top_side_spines;
        new_window.measured              = $scope.currentwindow.measured;
        new_window.validation_status     = $scope.currentwindow.validation_status;
        new_window.validation_passed     = $scope.currentwindow.validation_passed;
        new_window.validation_warning    = $scope.currentwindow.validation_warning;
        new_window.current_well_type     = $scope.currentwindow.current_well_type;
        new_window.validation_visibility = $scope.currentwindow.validation_visibility;

        $scope.dirty = true;

        $scope.jobsites[site_index].rooms[room_index].windows.push(new_window);

        $scope.current_window_index = $scope.jobsites[site_index].rooms[room_index].windows.length - 1;

        saveLocalJobSites();
        saveActiveWindows();

        getRoomList($scope.current_site_index);
    }

    var deleteRoomFromJobsite = function(site_index, room_index)
    {
        console.log("**deleteRoomFromJobsite()");

        if ( ! room_exists(site_index, room_index) )
            return;

        if ( room_index in $scope.jobsites[site_index].rooms )
        {
            $scope.jobsites[site_index].rooms.splice(room_index, 1);
            localStorage["mapp.jobsites"] = JSON.stringify($scope.jobsites);
        }
    }

    var deleteWindowFromJobsiteRoom = function(site_index, room_index, window_index)
    {
        console.log("**deleteWindowFromJobsiteRoom()");

        if ( ! room_exists(site_index, room_index) )
            return;

        if ( window_index in $scope.jobsites[site_index].rooms[room_index].windows )
        {
            $scope.jobsites[site_index].rooms[room_index].windows.splice(window_index, 1);
            localStorage["mapp.jobsites"] = JSON.stringify($scope.jobsites);
        }
    }

    var addWindowToDeletedList = function(site_index, room_index, window_index)
    {
        console.log("**addWindowToDeletedList()");

        if ( ! window_exists(site_index, room_index, window_index) )
            return;

        $scope.deleted.push($scope.jobsites[site_index].rooms[room_index].windows[window_index].id);
    }

    var updateWindowInJobsiteRoom = function(site_index, room_index, window_index, window_thing)
    {
        console.log("**updateWindowInJobsiteRoom()");

        if ( ! window_exists(site_index, room_index, window_index) )
            return;

        for (var attr in $scope.jobsites[site_index].rooms[room_index].windows[window_index] )
        {
            $scope.jobsites[site_index].rooms[room_index].windows[window_index][attr] = 
                $scope.currentwindow[attr];
        }

        $scope.jobsites[site_index].rooms[room_index].windows[window_index].measured = "true";
        $scope.jobsites[site_index].rooms[room_index].windows[window_index].dirty    = true;
        $scope.jobsites[site_index].jobsiteinfo.measured_count 
            = recalculateMeasuredWindows(site_index);
        $scope.jobsites[site_index].rooms[room_index].windows[window_index].frame_depth
            = getFrameDepthFromID($scope.currentwindow.frame_depth.id);
        $scope.jobsites[site_index].jobsiteinfo.modified = (new Date).getTime();

        saveLocalJobSites();
        saveActiveWindows();

        getRoomList($scope.current_site_index);
    }

    var updateRoomInJobsite = function(site_index, room_index, new_room)
    {
        console.log("**updateRoomInJobsite()");

        var jobsites = $scope.jobsites;
        var jobsite  = jobsites[site_index];

        jobsite.rooms[room_index] = new_room;
        jobsites[site_index] = jobsite;

        $scope.jobsites[site_index].rooms[room_index] = new_room;

    }

    // Inserts a window list into a room, given a room list and a room_index.
    // Returns a room list
    var insertWindowListIntoRoomList = function(room_list, room_index, window_list)
    {
        console.log("insertWindowListIntoRoomList()");

        var new_room_list   = room_list;
        var new_window_list = window_list;

        //console.log(new_window_list);

        new_room_list[room_index].windows = new_window_list;

        return new_room_list;
    }

    // Inserts a room into a list of rooms
    var insertRoomIntoList = function(room_list, room)
    {
        console.log("**insertRoomIntoList()");
        return insertThingIntoList(room_list, room);
    }

    // Inserts a window into a list of windows
    var insertWindowIntoList = function(window_list, window_thing)
    {
        console.log("**insertWindowIntoList()");
        return insertThingIntoList(window_list, window_thing);
    }

    // inserts a thing into a list of things
    var insertThingIntoList = function(list, thing)
    {
        console.log("**InsertThingIntoList()");
        list.push(thing);

        return list;
    }

    var getMeasuredWindowCount = function( site_index )
    {
        var measured = 0;

        if ( ! $scope.jobsites[site_index] ) return 0;
        if ( ! $scope.jobsites[site_index].rooms ) return 0;

        for ( var room_index in $scope.jobsites[site_index].rooms )
        {
            var room = $scope.jobsites[site_index].rooms[room_index];
            
            if ( ! room.windows ) continue;

            for ( var win_index in room.windows )
            {
                ++measured;
            }
        }

        return measured;
    }

    var getCurrentExtensionState = function(site_index, room_index, window_index)
    {
        /*
        if ( window_exists(site_index, room_index, window_index) )
        {
            return $scope.jobsites[site_index].rooms[room_index].windows[window_index].extension;
        }
        */
        return $scope.currentwindow.extension;
    }

    var turnOnExtensionState = function(site_index, room_index, window_index)
    {
        console.log("**turnOnExtensionState()");
        if ( window_exists(site_index, room_index, window_index) )
        {
            $scope.jobsites[site_index].rooms[room_index].windows[window_index].extension = "true";
        }
        $scope.currentwindow.extension = "true";
    }

    var turnOffExtensionState = function(site_index, room_index, window_index)
    {
        console.log("**turnOffExtensionState()");
        if ( window_exists(site_index, room_index, window_index) )
        {
            $scope.jobsites[site_index].rooms[room_index].windows[window_index].extension = "false";
        }
        $scope.currentwindow.extension = "false";
    }

    var applyExtensionState = function(site_index, room_index, window_index, point_index)
    {
        console.log("**applyExtensionState()");
        var ext = getCurrentExtensionState(site_index, room_index, window_index);
        $scope.currentwindow.extensions[point_index] = ext;
        $scope.currentwindow.extension = ext;
    }

    var applyDiagramHighlight = function(site_index, room_index, window_index, point_index)
    {
        console.log("**applyDiagramHighlight()");
        $scope.current_highlight = $scope.measurement_characters[point_index];
    }

    var applyMeasurementWellStatus = function(site_index, room_index, window_index, point_index)
    {
        console.log("**applyMeasurementWellStatus()");
        var current_shape          = $scope.currentwindow.shape; 
        $scope.current_well_type   = 'alert-message';
        $scope.current_well_status = $scope.well_status[current_shape][point_index];
        $scope.well_status_visible = true;
    }

    var applyValidationWellStatus = function(site_index, room_index, window_index, validation_status)
    {
        console.log("**applyValidationWellStatus()");

        $scope.current_well_type                = validation_status.well_type;
        $scope.current_well_status              = validation_status.alert_notes;
        $scope.currentwindow.validation_status  = validation_status.alert_notes;
        $scope.currentwindow.validation_warning = validation_status.warning;
        $scope.currentwindow.validation_passed  = validation_status.passed;
        $scope.currentwindow.measured = 'true';

        if ( window_exists(site_index, room_index, window_index) )
        {
            $scope.jobsites[site_index].rooms[room_index].windows[window_index].validation_status = validation_status.alert_notes;
            $scope.jobsites[site_index].rooms[room_index].windows[window_index].validation_passed = validation_status.passed;
            $scope.jobsites[site_index].rooms[room_index].windows[window_index].validation_warning = validation_status.warning;
            $scope.jobsites[site_index].rooms[room_index].windows[window_index].current_well_type = $scope.current_well_type;
            $scope.jobsites[site_index].rooms[room_index].windows[window_index].validation_visibility = true;
        }

        saveLocalJobSites();
        saveActiveWindows();

        $scope.well_status_visible = true;
    }

    var applyErrorWellStatus = function(error_message)
    {
        console.log("**applyErrorWellStatus()");

        $scope.current_well_status           = error_message;
        $scope.well_status_visible           = true;
    }

    var applyWarningWellStatus = function(error_message)
    {
        console.log("**applyWarningWellStatus()");

        $scope.current_well_status           = error_message;
        $scope.well_status_visible           = true;
    }

    var applySavedWellStatus = function(site_index, room_index, window_index)
    {
        console.log("**applySavedWellStatus()");

        $scope.current_well_status           = "Save Successful";
        $scope.current_well_type             = "alert-message";
        $scope.well_status_visible           = true;
    }

    var applySpines = function(site_index, room_index, window_index, ret)
    {
        console.log("**applySpines()");

        $scope.currentwindow.top_spine       = ret.spines.top_spine;
        $scope.currentwindow.side_spines     = ret.spines.side_spines;
        $scope.currentwindow.top_side_spines = ret.spines.top_side_spines;

        if ( window_exists(site_index, room_index, window_index) )
        {
            $scope.jobsites[site_index].rooms[room_index].windows[window_index].top_spine
                = ret.spines.top_spine;
            $scope.jobsites[site_index].rooms[room_index].windows[window_index].side_spines
                = ret.spines.side_spines;
            $scope.jobsites[site_index].rooms[room_index].windows[window_index].top_side_spines
                = ret.spines.top_side_spines;

            saveLocalJobSites();
            saveActiveWindows();
        }
    }

    var saveCurrentInputFocus = function(site_index, room_index, window_index, point_index)
    {
        console.log("**saveCurrentInputFocus()");
        $scope.current_input_focus = point_index;
    }

    var resetWindowSyncStatus = function()
    {
        console.log("**resetWindowSyncStatus()");

        setClean();
    }

    var recalculateMeasuredWindows = function(site_index)
    {
        console.log("**recalculateMeasuredWindows()");
        var measured = 0;

        console.log("measured " + measured);
        for ( var rm in $scope.jobsites[site_index].rooms )
        {
            for ( var win in $scope.jobsites[site_index].rooms[rm].windows )
            {
                if ( $scope.jobsites[site_index].rooms[rm].windows[win].measured == "true" )
                {
                    ++measured;
                }
            }
        }

        return measured;
    }

    var loadDropdownsFromData = function (data) {
        // Update dropdown tables
        $scope.insert_max_lookup      = data.insert_max_lookup;
        $scope.skylight_max_lookup    = data.skylight_max_lookup;
        $scope.t2_max_lookup          = data.t2_max_lookup;
        $scope.insert_product_types   = data.insert_product_types;
        $scope.skylight_product_types = data.skylight_product_types;
        $scope.t2_product_types       = data.t2_product_types;
        $scope.gaskets = ['Select Tubing'];
        $scope.gaskets = $scope.gaskets.concat(data.gaskets);

        // Create frame_depths dropdown value
        // association objects
        var depth;
        $scope.frame_depths = [ ];
        for ( depth in data.frame_depths )
        {
            $scope.frame_depths.push( data.frame_depths[depth] );
            $scope.frame_depths[depth].id = parseInt($scope.frame_depths[depth].id);
            $scope.frame_depths[depth].value = parseFloat($scope.frame_depths[depth].value);
        }

        
        /*
        // Set current product dropdowns
        if ( $scope.currentwindow.product == 'Legacy Insert' || $scope.currentwindow.product == 'Insert')
        {
            $scope.product_type_max_lookup = $scope.insert_max_lookup;
          //  $scope.product_types = [ 'Select a Product Type' ];
           // $scope.product_types = $scope.product_types.concat($scope.insert_product_types);

        } else if ($scope.currentwindow.product == 'T2 Insert') {
            $scope.product_type_max_lookup = $scope.t2_max_lookup;
            $scope.product_types = [ 'Select a Product Type' ];
            $scope.product_types = $scope.product_types.concat($scope.t2_product_types);
        } else {

            $scope.product_type_max_lookup = $scope.skylight_max_lookup;
            $scope.product_types = [ 'Select a Product Type' ];
            $scope.product_types = $scope.product_types.concat($scope.skylight_product_types);
        }
        */

        // Set current values
        //$scope.currentwindow.frame_depth
    };

    var doDropdownSync = function()
    {
        console.log("**doDropdownSync()");

        $http.get( $scope.baseURL + "/mapp/v1/fetch_dropdowns" ).success(function( data )
        {
            if ( data.code === 2000 )
            {
                loadDropdownsFromData(data);
                localStorage["mapp.dropdowns"] = JSON.stringify(data);
            }
        }).error(function () {
            var data;
            if (localStorage["mapp.dropdowns"]) {
                data = JSON.parse(localStorage["mapp.dropdowns"]);
                loadDropdownsFromData(data);
            }
        });
    }

    var activateWindowById = function(id) {
        $.each($scope.jobsites, function (site_index, site) {
            $.each(site.rooms, function (room_index, room) {
                $.each(room.windows, function (window_index, window) {
                    if (window.id == id) {
                        if ($scope.window_detail == 'true') {
                            //$scope.clickWindowDetail(site_index, room_index, window_index);
                            activateWindow(site_index, room_index, window_index);
                        } else {
                            activateWindow(site_index, room_index, window_index);
                        }
                    }
                });
            });
        });
    };

    var markCurrentActive = function () {
        if (window_exists($scope.current_site_index, $scope.current_room_index, $scope.current_window_index)) {
            $scope.jobsites[$scope.current_site_index].rooms[$scope.current_room_index].windows[$scope.current_window_index].current = 1;
        }
    };
    var unMarkCurrentActive = function () {
        if (window_exists($scope.current_site_index, $scope.current_room_index, $scope.current_window_index)) {
            delete $scope.jobsites[$scope.current_site_index].rooms[$scope.current_room_index].windows[$scope.current_window_index].current;
        }
    };

    var doSync = function()
    {
        console.log("**doSync()");
        
        doDropdownSync();
        doJobSiteSync();
    }

    var doJobSiteSync = function()
    {
        console.log("**doJobSiteSync()");
        markCurrentActive();
        var old_data = {
            "mapp_key" : $scope.mapp_key,
            "sites"    : JSON.stringify($scope.jobsites),
            "deleted"  : $scope.deleted
        };
        unMarkCurrentActive(); //if user isnt logged in or sync doesnt complete, we dont want a bunch of different windows to remain marked active.

        //localStorage.removeItem('mapp.jobsites');
        //localStorage["mapp.jobsites.storage"]  = "false"

        //console.log($scope.settings.username);
        //console.log(old_data);

        $http.post( $scope.baseURL + "/mapp/v1/fetch_job_sites", old_data ).success(function( data )
        {
            var newrooms = getSelectionNewRoomOptions($scope.current_site_index);
            if ( data.code == 2000 )
            {
                localStorage["mapp.jobsites"] = "[]";
                $scope.jobsites = data.data.jobsites;
                $scope.dirty    = false;

                saveLocalJobSites();
                saveActiveWindows();

                activateWindowById(data.current);
                $scope.room_options = getSelectionRoomOptions($scope.current_site_index);
                getRoomList($scope.current_site_index);

                $.each(newrooms, function (i, room) {
                    if ($.inArray(room, $scope.room_options) === -1) {
                        //$scope.current_room_index = 
                        addRoom($scope.current_site_index, room);
                    }
                });

                while($scope.deleted.length > 0) 
                {
                    $scope.deleted.pop();
                }

            } 
            else if ( data.code == 3000 )
            {
                console.log(data);
            }
        });

        resetWindowSyncStatus();

    }

    var doAuth = function()
    {
        var username = $scope.settings.username;
        var password = $scope.settings.password;

        var data = { 
             "username" : username,
             "password" : password
        };

        $http.post( $scope.baseURL + "/mapp/v1/login", data )
            .success(function( data ) 
        {
            if ( data.code == 2000 )
            {
                $scope.mapp_key = data.mapp_key;
                $scope.logged_in = true;
                $scope.dirty     = false;
                doSync();
                $('#loginModal').modal('hide');

            } else {
                console.log(data);
                if (data.error) {
                    $scope.login_error = data.error;
                }

                $scope.logged_in = false;
            }

        });
    }

    var doLogout = function()
    {
        localStorage.removeItem('mapp.settings.username');
        localStorage.removeItem('mapp.settings.password');
        $scope.settings.username = '';
        $scope.settings.password = '';
        $scope.mapp_key = "";
        $scope.logged_in = false;
    }

    var site_exists = function(site_index)
    {
        if ( $scope.jobsites 
        &&   $scope.jobsites[site_index] )
        {
            return true;
        }
        return false;
    }

    var room_exists = function(site_index, room_index)
    {
        if ( $scope.jobsites 
        &&   $scope.jobsites[site_index] 
        &&   $scope.jobsites[site_index].rooms 
        &&   $scope.jobsites[site_index].rooms[room_index] )
        {
            return true;
        }
        return false;
    }

    var window_exists = function(site_index, room_index, window_index)
    {
        if ( $scope.jobsites 
        &&   $scope.jobsites[site_index] 
        &&   $scope.jobsites[site_index].rooms 
        &&   $scope.jobsites[site_index].rooms[room_index]
        &&   $scope.jobsites[site_index].rooms[room_index].windows
        &&   $scope.jobsites[site_index].rooms[room_index].windows[window_index] )
        {
            return true;
        }
        return false;
    }

    var setClean = function()
    {
        if ( $scope.dirty == true ) return;

        var si_length = $scope.jobsites.length;
        if ( site_exists($scope.jobsites[si_idx]) 
        &&   $scope.jobsites[si_idx].rooms )
        {
            for ( var si_idx = 0; si_idx < si_length; ++si_idx )
            {
                $scope.jobsites[si_idx].dirty = false;

                    var ro_length = $scope.jobsites[si_idx].rooms.length;
                    for ( var ro_idx = 0; ro_idx < ro_length; ++ro_idx )
                    {
                        var wi_length =  $scope.jobsites[si_idx].rooms[ro_idx].windows.length;
                        for ( var wi_idx = 0;  wi_idx < wi_length; ++wi_idx )
                        {
                            $scope.jobsites[si_idx].rooms[ro_idx].windows[wi_idx].dirty = false;
                        }
                    }
            }
        }
    }

    var setDirty = function()
    {
        $scope.dirty = true;
    }

    var setDirtyJobsite = function(site_index)
    {
        $scope.dirty = true;

        if ( site_exists(site_index) )
        {
            $scope.jobsites[site_index].dirty = true;
        }
    }

    var setDirtyWindow = function(site_index, room_index, window_index)
    {
        $scope.dirty = true;

        if ( site_exists(site_index) )
        {
            $scope.jobsites[site_index].dirty = true;
        }
        if ( window_exists(site_index, room_index, window_index) )
        {
            $scope.jobsites[site_index].rooms[room_index].windows[window_index].dirty = true;
        }
    }

    var getFrameDepthFromID = function(frame_depth_id)
    {
        switch( frame_depth_id )
        {
            case 0:
                return { id: 0, value : 0,    string : 'Select Depth'         };
                break;
            case 1:
                return { id: 1, value : 0.5,  string : 'Less than 5/8 in.'    };
                break;
            case 2:
                return { id: 2, value : 0.75, string : 'Narrow (5/8in.-1in.)' };
                break;
            case 3:
                return { id: 3, value : 1.5,  string : 'Med (1 - 2 in.)'      };
                break;
            case 4:
                return { id: 4, value : 2.1,  string : 'Deep (2+ in.)'        };
                break;
            default:
                return { id: 1, value : 0.5,  string : 'Less than 5/8 in.'    };
                break;
        }
    }

    /**
     *
     * Helper Functions
     *
     **/
    var clone = function(obj) 
    {
        var copy;

        if (null == obj || "object" != typeof obj) return obj;

        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        return [];
    }

    
    var convertToDecimal = function(fraction)
    {
        var piecearr, piececount, ndarr, ndarrcount, calcnd, addbig; //dunno why i had to declare these. maybe the other scope wasn't in strict mode? very strange.
        var result 	 = 0.00;
        if (fraction.indexOf('/') != -1)  // does it look like a fractional value?
        {
            if (fraction.indexOf(' '))
            {
                piecearr   = fraction.split(" ");
                piececount = piecearr.length;
                // if there is a whole integer part as well as a fraction
                if (piececount > 1)
                {
                    var numdenom = piecearr[1]; // this is the whole number, if there is one 
                    var whereisslash = numdenom.indexOf('/'); // does it look like a fractional value?
                    if (whereisslash == -1) // did we find a slash?
                    {
                        result = 'noslash'; // we have only a whole value
                        console.log('whole value'); // ttt
                    }
                    else
                    {
                        ndarr = numdenom.split("/"); // split the value at the slash
                        ndarrcount = ndarr.length;  // count the numerators and denominators
                        if (ndarrcount > 1)  // is there a numerator and a denominator?
                        {  
                            calcnd = ndarr[0] / ndarr[1]; // divide numerator by the denominator
                            addbig = parseFloat(piecearr[0]) + parseFloat(calcnd); // add whole number and decimal equivalent of fraction
                            result = addbig.toFixed(3); // trim to three decimal places and save
                            console.log('fraction with numerator: ' + result); // ttt
                        }
                        else
                        {
                            result = 'badnumdenom'; // we don't have a properly formatted fraction
                        }
                    }
                }
                else // if there is only a fraction without a numerator
                {
                    var numdenom = piecearr[0]; // this is the first element when we have a fraction without a whole number
                    ndarr = numdenom.split("/"); // split the value at the slash
                    ndarrcount = ndarr.length; // count the numerators and denominators
                    if (ndarrcount > 1) // is there a numerator and a denominator?
                    {  
                        calcnd = ndarr[0] / ndarr[1]; // divide numerator by the denominator
                        addbig = 0 + parseFloat(calcnd); // add whole number and decimal equivalent of fraction - in this case it is zero
                        result = addbig.toFixed(3); // trim to three decimal places and save
                        console.log('fraction without numerator: ' + result); // ttt 
                    }
                    else
                    {
                        result = 'badnumdenom'; // we don't have a properly formatted fraction
                    }
                }
            }
            else
            {
                alert('Your fractional value must be separated from the whole integer by a space.');  // we expect a space in the value
            }
        }
        else
        {
            result = fraction;
        }
        return result;
    }

    var print_popup = function (data) {
        var printwin = window.open('', 'print_win', 'height=400,width=600');
        printwin.document.write('<html><head><title>MAPP Inserts</title>');
        printwin.document.write('<link rel="stylesheet" href="assets/css/bootstrap.css" type="text/css" />');
        printwin.document.write('<link rel="stylesheet" href="assets/css/style.css" type="text/css" />');
        printwin.document.write('</head><body >');
        printwin.document.write(data);
        printwin.document.write('</body></html>');

        //printwin.document.close(); // necessary for IE >= 10
        printwin.focus(); // necessary for IE >= 10
        setTimeout(function() {
            printwin.print();
        }, 500);

        //printwin.close();

        return true;
    }

    /*** Click Handlers ***/
    $scope.clickSync = function()
    {
        console.log("**click() : clickSync()");
        doSync();
    }

    $scope.clickDropdownSync = function()
    {
        console.log("**click() : clickDropdownSync()");
        doDropdownSync();
    }

    $scope.clickLogin = function()
    {
        console.log("**click() : clickLogin()");
        doAuth();
        //doSync();
    }

    $scope.clickRoomDetail = function(site_index, room_index, window_index)
    {
        console.log("**click() : clickRoomDetail()");

        activateWindow(site_index, room_index, window_index);
        $scope.currentwindow.room = room_index;
    }

    $scope.clickWindowDetail = function(site_index, room_index, window_index)
    {
        setCurrentWindow(site_index, room_index, window_index);

        //buildEmptyActives();
        saveJobSiteInfo();
        getRoomList($scope.current_site_index, room_index);
        $scope.room_options = getSelectionRoomOptions($scope.current_site_index);

        if ( window_exists( site_index, room_index, window_index ) )
        {
            $scope.current_well_status = $scope.jobsites[site_index].rooms[room_index].windows[window_index].validation_status;

            $scope.current_well_type = $scope.jobsites[site_index].rooms[room_index].windows[window_index].current_well_type;

            $scope.well_status_visible 
                = $scope.jobsites[site_index].rooms[room_index].windows[window_index].validation_visibility;
        }

        activateWindow(site_index, room_index, window_index);
        pageWindowDetail();
    }

    $scope.clickDeleteRoom = function(site_index, room_index)
    {
        console.log("**clickDeleteRoom()");

        event.stopPropagation();

        if (confirm('Are you sure you want to delete this room? All windows in this room will be deleted.')) {
            deleteRoomFromJobsite(site_index, room_index);

            deactivateAllWindowsInSite(site_index);

            setDirtyJobsite(site_index);

            pageCreateWindow();
        }
    }

    $scope.clickDeleteWindow = function(site_index, room_index, window_index)
    {
        console.log("**clickDeleteWindow()");

        event.stopPropagation();

        if (confirm('Are you sure you want to delete this window?')) {
            addWindowToDeletedList(site_index, room_index, window_index);
            deleteWindowFromJobsiteRoom(site_index, room_index, window_index);

            deactivateAllWindowsInSite(site_index);

            setDirtyJobsite(site_index);

            pageCreateWindow();
        }
    }

    $scope.clickAddNewRoomName = function()
    {
        console.log("**click() : clickAddNewRoomName()");
        $scope.roomfield          = "";
        $scope.roomfieldvisible   = "true";
    }

    $scope.clickTypeNewRoomName = function(site_index, room_index)
    {
        console.log("**click() : clickTypeNewRoomName()");
        //$scope.current_room_index =
        addRoom(site_index, $scope.roomfield);
        
        getRoomList($scope.current_site_index, room_index);

        $scope.roomfieldvisible = "false";

        $scope.room_options = getSelectionRoomOptions($scope.current_site_index);

        pageWindowDetail();
    }

    $scope.clickCreateNewJobSite = function()
    {
        console.log("**click() : clickCreateNewJobSite()");
        resetTempInfo();
        pageEditContact();
    }

    $scope.clickSaveCustomerInfo = function()
    {
        console.log("click() : clickSaveCustomerInfo()");
        saveCustomerInfo();
        pageEditJobSite();
    }

    $scope.clickSaveJobSiteInfo = function()
    {
        console.log("click() : clickSaveJobSiteInfo()");
        saveJobSiteInfo();
        createJobSite();
        setDirty();

        pageCreateJobSite();
    }

    $scope.clickSaveJobSiteNotes = function(site_index)
    {
        console.log("click() : clickSaveJobSiteNotes()");
        saveJobSiteNotes(site_index);

        pageRoomList();
    }

    $scope.clickSettings = function () {
        $scope.defaults = {
            tubing: $scope.jobsites[$scope.current_site_index].jobsiteinfo.default_tubing,
            product: $scope.jobsites[$scope.current_site_index].jobsiteinfo.default_product,
            frame_depth: $scope.jobsites[$scope.current_site_index].jobsiteinfo.default_frame_depth,
        };
    };

    $scope.clickJobSiteDetail = function(site_index, room_index, window_index)
    {
        console.log("click() : clickJobSiteDetail()");

        if ( site_exists(site_index) )
        {
            var customer_name = getCustomerName(site_index);
            var site_address  = getSiteAddress(site_index);

            if (confirm('CONFIRM YOU ARE ABOUT TO MEASURE\n' + customer_name + '\n' + site_address))
            {
                $scope.current_site_index = site_index;
                getRoomList($scope.current_site_index);
                $scope.measured = getMeasuredWindowCount( site_index );
                deactivateAllWindowsInSite(site_index);

                pageCreateWindow();
            }
        }
    }

    $scope.clickAddJobSite = function()
    {
        console.log("click() : clickAddJobSite()");

        pageBlank();
    }

    $scope.clickDeleteJobSite = function()
    {
        console.log("click() : clickDeleteJobSite()");

        pageBlank();
    }

    $scope.clickJobSiteList = function()
    {
        console.log("click() : clickJobSiteList()");

        $scope.actives = buildEmptyActives();

        pageCreateJobSite();
    }

    $scope.clickAddWindow = function(site_index, room_index)
    {
        console.log("click() : clickAddWindow()");
        setNewWindow(site_index, room_index);
        $scope.room_options = getSelectionRoomOptions($scope.current_site_index);

        pageWindowDetail();
    }

    $scope.clickClearWindow = function(site_index, room_index, window_index)
    {
        console.log("click() : clickClearWindow()");
        if (confirm('Are you sure you want to clear the form?')) {
            clearWindow(site_index, room_index, window_index);
            $scope.room_options = getSelectionRoomOptions($scope.current_site_index);
            $scope.jobsites = getLocalJobSites();
            $scope.actives  = getActiveWindows();

            pageWindowDetail();
        }
    }

    $scope.clickValidateWindow = function(site_index, room_index, window_index)
    {
        var lookup, products;
        console.log("**click() : clickValidateWindow()");
        if ($.inArray($scope.currentwindow.product, ['Insert', 'Legacy Insert']) !== -1) {
            lookup = $scope.insert_max_lookup;
            products = $scope.insert_product_types;
        } else if ($scope.currentwindow.product == 'T2 Insert') {
            lookup = $scope.t2_max_lookup;
            products = $scope.t2_product_types;
        } else {
            lookup = $scope.skylight_max_lookup;
            products = $scope.skylight_product_types
        }
        var product_type_index = products.indexOf($scope.currentwindow.product_type);
		if (!lookup[product_type_index]) {
			alert('Please select a valid product type.');
		}
        var max_w = lookup[product_type_index].max_width;
        var max_h = lookup[product_type_index].max_height;

        $scope.convertFractions();

        var product = $scope.currentwindow.product + '/' + $scope.currentwindow.product_type;

        var ret = validateWindow(max_w, max_h, product);

        $scope.checked = true;

        applyValidationWellStatus(site_index, room_index, window_index, ret);
        applySpines(site_index, room_index, window_index, ret);

        if (window_exists(site_index, room_index, window_index))
        {
            /*
            updateWindow(site_index, room_index, window_index);
            $scope.measured = getMeasuredWindowCount( site_index );
            $scope.room_options = getSelectionRoomOptions($scope.current_site_index);
            getRoomList($scope.current_site_index);
            setDirtyWindow(site_index, room_index, window_index);
            */
        }

        pageWindowDetail();
    }

    $scope.convertFractions = function () {
        for ( var point in $scope.currentwindow.points )
        {
            var point_integer = parseInt(point);
            if (typeof($scope.currentwindow.points[point_integer]) == "string")
            {
                var parsed = parseFloat(convertToDecimal($scope.currentwindow.points[point_integer]));
                $scope.currentwindow.points[point_integer] = parsed;
                //$scope.jobsites[site_index].rooms[room_index].windows[window_index].points[point_integer] = parsed;
            }
        }
    }

    $scope.updateAllWindows = function (site_index, data) {
        var i, j, numwins, numrooms, win;
        numrooms = $scope.jobsites[site_index].rooms.length;
        for (i=0; i<numrooms; ++i) {
            numwins = $scope.jobsites[site_index].rooms[i].windows.length;
            for (j=0; j<numwins; ++j) {
                $.each(data, function (p, e) {
                    $scope.jobsites[site_index].rooms[i].windows[j][p] = e;
                    $scope.currentwindow[p] = e;
                });
                setDirtyWindow(site_index, i, j);
                console.log($scope.jobsites[site_index].rooms[i].windows[j]);
            }
        }
        $scope.jobsites[site_index].jobsiteinfo.modified = (new Date).getTime();
        saveLocalJobSites();
        saveActiveWindows();
    };

    $scope.clickSaveWindow = function(site_index, room_index, window_index)
    {
        console.log("**click() : clickSaveWindow()");

        if ( ! room_exists(site_index, room_index)
        ||   $scope.rooms[room_index].name == ""
        ||   $scope.jobsites[site_index].rooms[room_index].name == "")
        {
            var error_message = "Unable to save window with no room";
            applyErrorWellStatus(error_message);
            return;
        }

        $scope.convertFractions();

        if ( window_index >= $scope.jobsites[site_index].rooms[room_index].windows.length )
        {
            createWindow(site_index, room_index);

        } else {

            updateWindow(site_index, room_index, window_index);
        }


        saveLocalJobSites();

        $scope.measured = getMeasuredWindowCount( site_index );
        $scope.room_options = getSelectionRoomOptions($scope.current_site_index);
        
        getRoomList($scope.current_site_index);
        activateWindow(site_index, room_index, $scope.current_window_index);

        applySavedWellStatus(site_index, room_index, window_index);

        setDirtyWindow(site_index, room_index, window_index);

        pageWindowDetail();
    }

    $scope.clickSaveSettings = function()
    {
        console.log("**click() : clickSaveSettings()");
        saveSettings();
    }

    $scope.clickClearStorage = function()
    {
        console.log("**click() : clickClearStorage()");
        localStorage.clear();
        pageCreateJobSite();
    }

    $scope.clickTurnOnExtension = function(site_index, room_index, window_index)
    {
        turnOnExtensionState(site_index, room_index, window_index);
        applyExtensionState(site_index, room_index, window_index, 4);
        applyExtensionState(site_index, room_index, window_index, 5);
    }

    $scope.clickTurnOffExtension = function(site_index, room_index, window_index)
    {
        turnOffExtensionState(site_index, room_index, window_index);
        applyExtensionState(site_index, room_index, window_index, 4);
        applyExtensionState(site_index, room_index, window_index, 5);
    }

    $scope.focusInputMeasurement = function(site_index, room_index, window_index, point_index)
    {
        console.log("**focus() : focusInputMeasurement()");
        saveCurrentInputFocus(site_index, room_index, window_index, point_index);
        applyDiagramHighlight(site_index, room_index, window_index, point_index);
        applyMeasurementWellStatus(site_index, room_index, window_index, point_index);

        $scope.room_options = getSelectionRoomOptions($scope.current_site_index);

        pageWindowDetail();
    }

    $scope.blurInputMeasurement = function()
    {
        console.log("**blur() : blurInputMeasurement()");

        pageWindowDetail();
    }

    $scope.changeRoom = function(site_index, room_index, window_index)
    {
        console.log("**changeRoom()");

        if ( window_exists(site_index, room_index, window_index) )
        {
            var window_sort_function = function(a,b) {
                if (a.id == '') {
                    return 1; // force no ids to the bottom of the list.
                }
                a = a.id ? a.id : 0;
                b = b.id ? b.id : 0;
                return parseInt(a, 10) - parseInt(b, 10);
            };
            var old_room_index = room_index;
            var new_room_index = $scope.room_options.indexOf($scope.currentroom.name);
            if (new_room_index === old_room_index) {
                return;
            }
            var moving_window = $scope.jobsites[site_index].rooms[old_room_index].windows[window_index];
            moving_window.room = $scope.rooms[new_room_index].name;
            $scope.jobsites[site_index].jobsiteinfo.modified = (new Date).getTime();

            var new_index = $scope.jobsites[site_index].rooms[new_room_index].windows.push(moving_window) - 1;
            /*
            $scope.jobsites[site_index].rooms[new_room_index].windows.sort(window_sort_function);
            if (moving_window.id !== '') {
                $.each($scope.jobsites[site_index].rooms[new_room_index].windows, function (i, e) {
                    if (e === moving_window) {
                        new_index = i;
                    }
                });
            }*/
            if ($.inArray(moving_window, $scope.rooms[new_room_index].windows) === -1) {
                $scope.rooms[new_room_index].windows.push(moving_window) - 1;
                //$scope.rooms[new_room_index].windows.sort(window_sort_function);
            }
            $scope.jobsites[site_index].rooms[old_room_index].windows.splice(window_index, 1);
            if ($scope.rooms[old_room_index].windows[window_index] === moving_window) { // i dont think this ever actually happens. was causing problems so i wrapped it in if statement
                $scope.rooms[old_room_index].windows.splice(window_index, 1);
            }
            $scope.current_room_index = new_room_index;
            $scope.currentroom = $scope.rooms[new_room_index];
            setDirtyWindow(site_index, new_room_index, new_index);

            saveLocalJobSites();
            saveActiveWindows();

            getRoomList($scope.current_site_index);

            $scope.room_options = getSelectionRoomOptions($scope.current_site_index);
            setCurrentWindow(site_index, new_room_index, new_index);
            console.log($scope.rooms[old_room_index].windows, $scope.jobsites[site_index].rooms[old_room_index].windows, '???');
        } else {

            var new_room_index = $scope.room_options.indexOf($scope.currentroom.name);
            $scope.current_room_index = new_room_index;
        }
            
        pageWindowDetail();
    }

    $scope.changeProduct = function(site_index, room_index, window_index)
    {
        console.log("**changeProduct()");

        setCurrentProductDropdown(site_index, room_index, window_index);

        pageWindowDetail();
    }

    $scope.helpmessage = function (message) {
        var messages = {
            test: 'This is a test message.'
        };
        if (messages[message]) {
            message = messages[message];
        }
        $scope.helptext = message;
        $('#helptextmodal').modal('show');
    }

    $scope.print_popup = function () {
        var data = $('#review-data').clone();
        data.find('.modal-header').remove();
        data.find('.modal-footer').remove();
        data.find('.modal-title').remove();
        var newdata = $('<div>').append(data.find('.modal-content').children());
        print_popup(newdata.html());
    };

    /* Currently unncessesary. May become necessary for future shapes.
     * Rectangle and Trapezoid both have six measurement points at present.
     *
    $scope.changeShape = function(site_index, room_index, window_index)
    {
        console.log("**change() : changeShape()");
        var newshape = $scope.currentwindow.shape;
        var point_count = $scope.currentwindow.points.length;

        switch(newshape)
        {
        case 'Rectangle':
            if (point_count == 6) 
            {
               $scope.currentwindow.points.splice(-2,2);
               $scope.currentwindow.extensions.splice(-2,2);
               $scope.measurement_characters.splice(-2,2);
               var e1 = $('#' + $scope.measurement_characters[4]);
               var e2 = $('#' + $scope.measurement_characters[5]);
               e1.remove();
               e2.remove();
            }
            break;
        case 'Trapezoid':
            if (point_count == 4) 
            {
               $scope.currentwindow.points.push(0);
               $scope.currentwindow.points.push(0);
               $scope.currentwindow.extensions.push(0);
               $scope.currentwindow.extensions.push(0);
               $scope.measurement_characters.push('E');
               $scope.measurement_characters.push('F');
            }
            break;
        default:
            break;
        } 

        updateWindow(site_index, room_index, window_index);
    }
    */

    /*** Page Turns ***/
    var pageCreateJobSite = function()
    {
        $scope.site_list      = "true";

        $scope.jobsite_create = "true";
        $scope.window_create  = "false";
        $scope.contact_edit   = "false";
        $scope.jobsite_edit   = "false";

        $scope.room_list      = "false";
        $scope.window_detail  = "false";
    }

    var pageCreateWindow = function()
    {
        $scope.site_list      = "false";

        $scope.jobsite_create = "false";
        $scope.window_create  = "true";
        $scope.contact_edit   = "false";
        $scope.jobsite_edit   = "false";

        $scope.room_list      = "true";
        $scope.window_detail  = "false";
    }

    var pageEditContact = function()
    {
        $scope.site_list      = "true";

        $scope.jobsite_create = "false";
        $scope.window_create  = "false";
        $scope.contact_edit   = "true";
        $scope.jobsite_edit   = "false";

        $scope.room_list      = "false";
        $scope.window_detail  = "false";
    }

    var pageEditJobSite = function()
    {
        $scope.site_list      = "true";

        $scope.jobsite_create = "false";
        $scope.window_create  = "false";
        $scope.contact_edit   = "false";
        $scope.jobsite_edit   = "true";

        $scope.room_list      = "false";
        $scope.window_detail  = "false";
    }

    var pageBlank = function()
    {
        $scope.site_list      = "true";

        $scope.jobsite_create = "false";
        $scope.window_create  = "false";
        $scope.contact_edit   = "false";
        $scope.jobsite_edit   = "false";

        $scope.room_list      = "false";
        $scope.window_detail  = "false";
    }

    var pageRoomList = function()
    {
        $scope.site_list      = "false";

        $scope.jobsite_create = "false";
        $scope.window_create  = "false";
        $scope.contact_edit   = "false";
        $scope.jobsite_edit   = "false";

        $scope.room_list      = "true";
        $scope.window_detail  = "false";
    }

    var pageWindowDetail = function()
    {
        $scope.site_list      = "false";

        $scope.jobsite_create = "false";
        $scope.window_create  = "false";
        $scope.contact_edit   = "false";
        $scope.jobsite_edit   = "false";

        $scope.room_list      = "true";
        $scope.window_detail  = "true";
    }

    /*** Initialization ***/
    /*** Initialize JobSites List ***/
    $scope.jobsites = getLocalJobSites();
    $scope.actives  = getActiveWindows();
    $scope.settings = getSettings();
    $('#loginModal').modal();
    /*** Initialize sync timer ***/
    doSync();
    $interval(function () {doSync();}, 30000);

}]);
