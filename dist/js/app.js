$(function () {
    $('#dtpCreateEventStartDate').datetimepicker();
    $('#dtpCreateEventEndDate ').datetimepicker();
    $('#dtpCreateEventRegistrationDeadline').datetimepicker();
    console.log("I'm Alive");
});

var images =[];
// Imgur api!
function upload(file, imglabel) {
    if (!file || !file.type.match(/image.*/))
        return;
    
    $("#" + imglabel+"Label").val(file.name);
    

    console.log("Image Name: " + file.name + "\nFile type: " + file.type );
    console.log();

    document.body.className = "uploading";

    var fd = new FormData();
    fd.append("image", file);
    fd.append("key", "6528448c258cff474ca9701c5bab6927");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://api.imgur.com/2/upload.json");
    xhr.onload = function () {
    link = JSON.parse(xhr.responseText).upload.links.imgur_page;
    link = link + ".png";
    images.push({"id":imglabel,"image": link});
        

        
        console.log(images);

    };
    xhr.send(fd);
}

function getValuesTest() {
    console.log("Submit Initiated");
    console.log($('#name').val());
    var name = $('#createEventName').val();
    var hostedBy = $('#createEventHostedBy').val();
    var about = $('#createEventAbout').val();
    var rules = $('#createEventRules').val();
    var banner = document.all["createEventBanner"].value;
    console.log(link);
    //    var logo = $('#lrd-sellitemAmount').val();
    //    var startDate = $('#lrd-sellitemPrice').val();
    //    var endDate = $('#lrd-sellitemModel').val();
    //    var location = $('#lrd-sellitemBrand').val();
    //    var registrationDeadline = $('#lrd-dimensions').val();
    //    var sponsors = $('#lrd-sellitemAmount').val();
    //    var spec_fee = $('#lrd-sellitemPrice').val();

    //Tournaments Array
}

//Changes to file input for asthetics
$(document).on('change', '.btn-file :file', function () {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
});

$(document).ready(function () {
    $('.btn-file :file').on('fileselect', function (event, numFiles, label) {

        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }

    });
});