//step one: define functions and objects
function editButton() {
    $(".edit").on("click", "span", function() {
        $(".cross").toggle();
    });
}


function getInput() {
    var custInput = $(".custinput");
    var input = custInput.val();

    if ((input !== "") && ($.trim(input) !== "")) {
        addItem(input);
        custInput.val("");
    }
}

function displayResults(inputData) {
    console.log(JSON.stringify(inputData));
    //create an empty variable to store one LI for each one the results
    var buildTheHtmlOutput = "";
    for (var i = 0; i < JSON.stringify(inputData).length; i++) {
        buildTheHtmlOutput += "<li>";
        buildTheHtmlOutput += "<div class='text-wrapper'><h2>" + JSON.stringify(inputData)[i].name + "</h2>";
        buildTheHtmlOutput += "<form class='addGameToWishlist'>";
        buildTheHtmlOutput += "<input type='hidden' class='addGameToWishlistValue' value='" + JSON.stringify(inputData)[i].name + "'>";
        buildTheHtmlOutput += "<button type='submit' class='addToWishlistButton'>";
        buildTheHtmlOutput += "<img src='star.png' class='star-icon'>";
        buildTheHtmlOutput += "</button>";
        buildTheHtmlOutput += "</form>";
       
        buildTheHtmlOutput += "</li>";
    }
    $(".rate-output ul").html(buildTheHtmlOutput);
}

$(document).on('click', '.addToWishlistButton', function(event) {
    console.log('here');
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    event.preventDefault();
    //get the value from the input box
    var wishlistValue = $(this).parent().find('.addGameToWishlistValue').val();


    var nameObject = {
        'name': wishlistValue
    };

     $.ajax({
                type: "POST",
                url: "/wishlist/" + wishlistValue,
                // data: q_string,
                dataType: 'json'
            })
            .done(function(result) {
                //console.log(result);
                //   displayResults(result);
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });

        //get all items
        $.ajax({
                type: "GET",
                url: "/wishlist",
                dataType: 'json'
            })
            .done(function(result) {
                // console.log(result);
                displayWishlistResults(result);
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });

});

function displayWishlistResults(result) {

    console.log(result);

    //create an empty variable to store one LI for each one the results
    var buildTheHtmlOutput = "";
    for (var i = 0; i < result.length; i++) {
        buildTheHtmlOutput += "<li>";
        buildTheHtmlOutput += "<h3>";
        buildTheHtmlOutput += result[i].name;
        buildTheHtmlOutput += "<input type='hidden' class='delete-game-id' value='" + result[i]._id + "'/>";
        buildTheHtmlOutput += "<button class='delete-game-name'> x </button>";
        buildTheHtmlOutput += "</h3>";
        buildTheHtmlOutput += "</li>";
    }
    $(".wishlist-output ul").html(buildTheHtmlOutput);
}


function addItem(message) {

    $(".cross").hide();

    var checkbox = "<td class=\"check\">" + "<input type=\"checkbox\" id=\"item" + id + "\" class=\"box\">" + "<label for=\"item" + id + "\" class=\"check-label\"></label></td>";

    var content = "<td class=\"content\"><span>" + message + "</span></td>";

    var delIcon = "<td><img src=\"img/cross.png\" alt=\"cross\" class=\"cross\"></td>";

    $("tbody").append("<tr>" + checkbox + content + delIcon + "</tr>");

    id++;
}
//step two: use functions 
$(document).ready(function(e) {

    //port new wishlist item to the DB
    $("#add-game").submit(function(e) {
        e.preventDefault();
        var userInput = $("#game-input").val();

        var q_string = {
            'name': userInput
        };

        //send new item
        $.ajax({
                type: "POST",
                url: "/wishlist/" + userInput,
                // data: q_string,
                dataType: 'json'
            })
            .done(function(result) {
                //console.log(result);
                //   displayResults(result);
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });

        //get all items
        $.ajax({
                type: "GET",
                url: "/wishlist",
                dataType: 'json'
            })
            .done(function(result) {
                // console.log(result);
                displayWishlistResults(result);
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });

    });

    $("#s-f").submit(function(e) {
        e.preventDefault();
        var userInput = $("#game-search").val();
        //console.log(userInput);
        $.ajax({
                type: "GET",
                url: "/search/" + userInput,
                dataType: 'json'
            })
            .done(function(result) {
                console.log(result);
                displayResults(result);
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
        console.log(userInput);

    });


    //delete item  
    $('.wishlist-output').on('click', '.delete-game-name', function(event) {

        var userInput = $(this).closest('li').find('.delete-game-id').val();
        console.log(userInput);
        $.ajax({
                type: "DELETE",
                url: "/wishlist/" + userInput,
                dataType: 'json'
            })
            .done(function(result) {
                console.log(result);
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });

        //get all items
        $.ajax({
                type: "GET",
                url: "/wishlist",
                dataType: 'json'
            })
            .done(function(result) { //this waits for the ajax to return with a succesful promise object
                displayWishlistResults(result);
            })
            .fail(function(jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    });


    var id = 1;
    editButton();

    $("tbody").on("click", ".cross", function() {
        $(this).closest("tr").remove();
    });

    $("button").on("click", getInput);

    $("tbody").on("click", ".box", function() {
        $(this).closest("tr").find("span").toggleClass("checked");
    });

});


$(document).on("keydown", function(e) {
    if (e.keyCode === 13) {
        getInput();
    }
});
