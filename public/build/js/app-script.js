$(document).ready(function()
{
    var pourcentSpriteBackgroudPositionY     = 33.455;
    var pourcentSpritePontBackgroudPositionY = 33.45;

    //position:fixed on .page-contenair > .header fuck the width from .page-contenair
    var widthPageContenair = $(".page-contenair").width();
    $(".page-contenair > .header").width(widthPageContenair);

    $( window ).resize(function() {
        var widthPageContenair = $(".page-contenair").width();
        $(".page-contenair > .header").width(widthPageContenair);
    });

    $("#sidebar-toggle").on("click",function(){
        if(!$(".sidebar").hasClass("is-smart"))
        {
            $(".sidebar").addClass("is-smart");
            $(".page-contenair").css("padding-left", "67px" );
            fixLargeurPageContenaire();
        }else
        {
            $(".sidebar").removeClass("is-smart");
            $(".page-contenair").css("padding-left", "260px" );
            fixLargeurPageContenaire();
        }
    });

    function fixLargeurPageContenaire()
    {
        var widthPageContenair = $(".page-contenair").width();
        $(".page-contenair > .header").width(widthPageContenair);
    }

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
     * Verif champs mail
     */
    $("#form-inscr").on("submit",function(){
        var count = 0;
        allInput = $(this).find("input");
        allInput.each(function( index ) {
            var value = $(this).val();
            var type = $(this).attr('type');
            if(type == "checkbox")
            {
                if(!$(this).is(':checked'))
                {
                    $(this).parent().addClass("alert-accept-inscr");
                    count += 1;
                    return;
                }
            }

            if(type == "submit")
            {
                return;
            }

            if(!value)
            {
                $(this).addClass("alert alert-danger");
                count += 1;
            }
        });
        //Si un champs alert, return false pour stop le submit
        if(count > 0)
        {
            return false;
        }
    });

    $("#submit-form-auth").on("click",function(){
        var url = "/login";
        var email = $(this).find("input[name='_username']").val();
        var pass = $(this).find("input[name='_password']").val();
        $.post({
            type: "POST",
            url: url,
            data: { "email" : email, "pass": pass},
            success: function(data) {
                // do something with the data you received}
                console.log(data);
            }

        });
        return false;
    });

    /**
     * [Habille ou non la structure courante]
     */
    $("#id-toggle-portique-habille").on("click",function(){
        var bp = $('#spr-portique').css('backgroundPosition').split(' ');

        if(!$("#id-toggle-portique-pont").hasClass("active"))
        {
            if($(this).hasClass("active"))
            {
                $("#spr-portique").css("background-position","0 0");
            }else
            {
                $("#spr-portique").css("background-position","0 " + pourcentSpritePontBackgroudPositionY + "%");
            }
        }
        else
        {
            if($(this).hasClass("active"))
            {
                $("#spr-portique").css("background-position","0 " + pourcentSpriteBackgroudPositionY * 2 + "%");
            }else
            {
                $("#spr-portique").css("background-position","0 " + pourcentSpriteBackgroudPositionY * 3 + "%");
            }
        }
    });



    /**
     * [Change le type de structure, pont / echafaudage]
     */
    $("#id-toggle-portique-pont").on("click",function(){
        var bp = $('#spr-portique').css('backgroundPosition').split(' ');

        //si le toggle habille n'EST PAS ACTIF !
        if(!$("#id-toggle-portique-habille").hasClass("active"))
        {
            if($(this).hasClass("active"))
            {
                $("#spr-portique").css("background-position","0 0");
            }else
            {
                $("#spr-portique").css("background-position","0 " + pourcentSpriteBackgroudPositionY * 2 + "%");
            }
        }else
        {
            if($(this).hasClass("active"))
            {
                $("#spr-portique").css("background-position","0 " + pourcentSpriteBackgroudPositionY + "%");
            }else
            {
                $("#spr-portique").css("background-position","0 " + pourcentSpriteBackgroudPositionY * 3 + "%");
            }
        }
    });

});
