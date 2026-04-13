/**
 */

var replaceCaptchaInFormAfterDivNumber = 6;

$(document).ready(function()
{
    //load l'user/pass pour si remember me.
    load_em();

    //position:fixed on .page-contenair > .header fuck the width from .page-contenair
    var widthPageContenair = $(".page-contenair").width();
    $(".page-contenair > .header").width(widthPageContenair);

    $( window ).resize(function() {
        var widthPageContenair = $(".page-contenair").width();
        $(".page-contenair > .header").width(widthPageContenair);
    });

    if ($(window).width() < 980) {
        resizeSidebarMini();
    }

    $(".sidebar-menu > .item-struct").on("click",function(){
        $(".sous-menu-structure").toggle(600)
    });

    $(document).keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            if($("#submit-form-auth").is(":visible")){
                $("#submit-form-auth").click();
            }else if($("#registration_form_register").is(":visible")){
                $("#registration_form_register").click();
            }
        }
    });

    /**
     *
     */
    $("#sidebar-toggle").on("click",function(){
        resizeSidebarMini();
    });

    /**
     *
     */
    $('.item-home-li').on("click",function(){
        removeAllLayersStruc();
        setTimeout(function(){
            $(".layers-menu").css("display","flex");
        }, 1100);
    });

    $(".sidebar-logo").on("click",function(){
        window.open('https://diversis.fr/','_blank');
    });

    /**
     * Gestion des onglets logins
     */
    $(".nav-login li").on("click",function(){
        $(".nav-login li").each(function( index ) {
            $(this).removeClass("active");
        });

        $(this).addClass("active");
    });

    /**
     *
     */
    $(".card-menu").on("click",function(e){
        var elemBody = $(this).find(".card-body");

        if(!elemBody.hasClass("link-to-portique") && !elemBody.hasClass("link-to-tour") && !elemBody.hasClass("link-to-totem"))
        {
            e.stopPropagation();
            return false;
        }
        var type = "";

        var classToAnime = $(".layers-menu");
        if(elemBody.hasClass("link-to-tour")){
            type = "tour";
        }else if(elemBody.hasClass("link-to-portique")){
            type = "portique";
        }else if(elemBody.hasClass("link-to-totem")){
            type = "totem";
        }

        animationMenuFadeOutLeftAndOpenStruct(type,classToAnime);

    });

    $(".reset-calcul").on("click",function(){
       var data = $(this).data("target");

        $(".layers-"+data+" input:text").each(function(i,v){
            $(this).val("");
        });
        $(".layers-"+data+" input[type='number']").each(function(i,v){
            $(this).val("");
        });
        $(".layers-"+data+" input:checkbox").each(function(i,v){
            $(this).prop("checked", false);
        });

        $("#row-diametre-"+data).css("display","none");

        $(".layers-"+data+" .card-footer").css("display","none");
    });

    /**
     *
     */
    $(".nav-item.item-user-li").on("click",function(){
        removeAllLayersStruc();
        setTimeout(function(){
            $(".layers-users").css("display","block");
        }, 1100);
    });

    /**
     * Anime le fade out du dashboard
     */
    $(".sous-menu-structure .sm-struct").on("click",function(){
        var span         = $(this).find("span");
        var type         = span.data("type");
        var classToAnime = $(".layers-menu");
        var visible      = $(".layers-menu").is(":visible");
        if(!visible){
            //take the visible item
            if($(".layers-portique").is(":visible")){
                classToAnime = $(".layers-portique");
            }else if($(".layers-tour").is(":visible")){
                classToAnime = $(".layers-tour");
            }else if($(".layers-totem").is(":visible")){
                classToAnime = $(".layers-totem");
            }else if($(".layers-users").is(":visible")){
                classToAnime = $(".layers-users");
            }
        }

        animationMenuFadeOutLeftAndOpenStruct(type,classToAnime);
    });

    /**
     * Test if user exist, or unactive account
     */
    $("#submit-form-auth").on("click",function(){
        var url = "/testUser";
        var email = $("#form-auth").find("input[name='_username']").val();
        var pass = $("#form-auth").find("input[name='_password']").val();

        $("div.box-message-login").remove();
        $.post({
            type: "POST",
            url: url,
            data: { "_username" : email, "_password": pass},
            success: function(data) {
                // do something with the data you received}
                console.log(data);
                if(data != "success"){
                    html = '<div class="box-message-login">'+data+'</div>';
                    $(html).insertAfter("#form-auth>div:first-child");
                }
                if(data == "success")
                {
                    if($("#remember_me").is(":checked")){
                        remember_me(email,pass);
                    }
                    window.location.replace($("#path-panel-admin").val());
                }
            }

        });
        return false;
    });

    $("td:contains('LEST A PREVOIR')").css("font-weight", "bold");

    $(".g-recaptcha").appendTo("#registration_form > div:nth-child("+replaceCaptchaInFormAfterDivNumber+")");

    //formatage conditions d'utilisation inscription
    $divParentCheckbox = $("#registration_form_p").parent();
    $divParentCheckbox.html("<div class=\"custom-control custom-checkbox\">\n" +
                                "  <input data-toggle=\"popover\" data-placement=\"top\" data-content=\"Vivamus sagittis lacus vel augue laoreet rutrum faucibus.\" type=\"checkbox\" class=\"custom-control-input\" id=\"customCheck1\">\n" +
                                "  <label class=\"custom-control-label\" for=\"customCheck1\">J'accepte les <a class='l-cond-util' href=\"/pdf/Charte d'utilisation WinDiv du 22 mai 2019.pdf\">conditions d'utilisation</a></label>\n" +
                                "<div id='hidden-error-accept'>Merci d'accepter les conditions générales</div>" +
                            "</div>");

    $("#showDetailPortique").on("click",function(){
        if($("#id-toggle-portique-pont").hasClass("active")){
            $("#portiqueSchema .img-modal-schema").attr('src',"/img/schemaPortiqueEchaf.PNG");
        }else
        {
            $("#portiqueSchema .img-modal-schema").attr('src',"/img/schemaPortiquePont.PNG");
        }
    });

    $("#showDetailTotem").on("click",function(){
        if($("#id-toggle-totem-type").hasClass("active")){
            $("#portiqueTotem .img-modal-schema").attr('src',"/img/schemaTotemTri.PNG");
        }else{
            $("#portiqueTotem .img-modal-schema").attr('src',"/img/schemaTotem.PNG");
        }
    });

    $("#showDetailTour").on("click",function(){
        $("#portiqueTour .img-modal-schema").attr('src',"/img/schemaTour.PNG");
    });

    $("#portiqueSchema").draggable();
    $("#portiqueTotem").draggable();
    $("#portiqueTour").draggable();
    $("#pressionSolDetails").draggable();
    $(".modal-backdrop").css("display","none");

    $("#registration_form_register").on("click",function(e){
        var checkbox = $("#customCheck1");
        if(!checkbox.is(":checked")){
            $("#hidden-error-accept").css("display","block");

            e.stopPropagation();
            return false;
        }
    });

    $("#customCheck1").on("click",function(){
        var value = $(this).is(":checked");
        if(value){
            $("#hidden-error-accept").css("display","none");
        }
    });

    /**
     * Test si la vitesse est > 200
     * Si elle ne l'ai pas, alors on la sauvegarde
     * Si elle est supérieur, alors on la remplace par la save d'avant
     */
    $(".cl-vitesse").on("input", function(e){
       var val = $(this).val();
       if($.isNumeric(val)){
            if(val > 200){
                alert("La vitesse ne doit pas dépasser 200 Km/h.");
                $(this).val(saveVitesseBefore200);
            }else{
                saveVitesseBefore200 = val;
            }
       }
    });

    if (pathName.indexOf("login") >= 0){
       $("body").addClass('without-after-element');
       $("body").css("background-color","#eee !important")
    }

    $("#calcul-lestage-input-tour, #calcul-lestage-input-totem, #calcul-lestage-input-portique").on("click",function(){
        var id = this.id;

        if(id == "calcul-lestage-input-portique"){
            $(".layers-portique .card:not(.card-menu)").css("height","800px");
            $(".layers-portique .card:not(.card-menu)").css("overflow-y","scroll");
        }else if(id == "calcul-lestage-input-totem"){
            $(".layers-totem .card:not(.card-menu)").css("height","800px");
            $(".layers-totem .card:not(.card-menu)").css("overflow-y","scroll");
        }else if(id == "calcul-lestage-input-tour"){
            $(".layers-tour .card:not(.card-menu)").css("height","800px");
            $(".layers-tour .card:not(.card-menu)").css("overflow-y","scroll");
        }
    });

});


