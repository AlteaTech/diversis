
/**
 * Arrondie à "precision" près
 *
 * @param value
 * @param precision
 * @returns {number}
 */
function round(value, precision){
	var multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}

/**
 * Anime the element from parameter
 * @param type compare with typeStruct
 * @param clToAnime classe to animate
 */
function animationMenuFadeOutLeftAndOpenStruct(type, clToAnime){
	//animation
	clToAnime.addClass("fadeOutLeft");
	setTimeout(function(){
		if(type == typeStruct.tour){
			clToAnime.css("display","none");
			clToAnime.removeClass("fadeOutLeft");
			$(".layers-tour").css("display","block");
		}else if(type == typeStruct.portique){
			clToAnime.css("display","none");
			clToAnime.removeClass("fadeOutLeft");
			$(".layers-portique").css("display","block");
		}else if(type == typeStruct.totem){
			clToAnime.css("display","none");
			clToAnime.removeClass("fadeOutLeft");
			$(".layers-totem").css("display","block");
		}else if(type == typeAction.users){
			clToAnime.css("display","none");
			clToAnime.removeClass("fadeOutLeft");
			$(".layers-users").css("display","block");
		}
	}, 1100);
}

/**
 *
 * @param clToAnime
 */
function animationMenuFadeOutLeft(clToAnime){
	//animation
	clToAnime.addClass("fadeOutLeft");
	setTimeout(function(){
		clToAnime.css("display","none");
		clToAnime.removeClass("fadeOutLeft");
	}, 1100);
}

/**
 *
 */
function resizeSidebarMini(){
	if(!$(".sidebar").hasClass("is-smart"))
	{
		$(".sidebar").addClass("is-smart");
		$(".page-contenair").css("padding-left", "67px" );
		$(".sidebar-toggle").find("i").removeClass("ti-arrow-circle-left").addClass("ti-arrow-circle-right");
		fixLargeurPageContenaire();
	}else
	{
		$(".sidebar").removeClass("is-smart");
		$(".page-contenair").css("padding-left", "170px" );
		$(".sidebar-toggle").find("i").removeClass("ti-arrow-circle-right").addClass("ti-arrow-circle-left");
		fixLargeurPageContenaire();
	}
}

/**
 *
 */
function removeAllLayersStruc(){
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

	animationMenuFadeOutLeft(classToAnime);
}

/**
 *
 */
function fixLargeurPageContenaire()
{
	var widthPageContenair = $(".page-contenair").width();
	$(".page-contenair > .header").width(widthPageContenair);
}

function constructListTabUser($data){
	var list = "";
	var line = "";
	var r = "";
	var status = typeStatusProfil.low;
	$($data).each(function(i,v){
		if(v.roles == "ROLE_ADMIN"){
			status = typeStatusProfil.hight;
		}
		r = "<tr class='line-profil' data-idUser='"+ v.id +"'>";
		list = "<td>" + v.nom + "</td>";
		list += "<td>" + v.prenom + "</td>";
		list += "<td>" + v.email + "</td>";
		list += "<td>" + v.societe + "</td>";
		list += "<td>" + status + "</td>";
		list += "<td><span class=\"icon-holder\"><i class=\"ti-na c-red-dashboard\"></i></span></td>";
		line = r + list + "</tr>";
		$("#list-users tbody").append(line);
	});
}

function createElementStructProfil(data){
	var elem = "";
	$(".card-body > #user-structures").html("");
	$.each(data, function(i,v){
		var struct = v.typeStructure;
		elem = "<span class='struct-user-list' data-struct='"+struct+"'>"+struct+"</span>";
		$(".card-body > #user-structures").append(elem);
	});
}

/**
 *
 * @param data
 * @param typeStructure
 * @returns {string}
 */
function showCalculByStruc(data, typeStructure){
	var html = "";
	var list = "<div class='div-layer-calcul-detail'>";
	var dataTMP = data;
	var results = [];

	html = "<table class='table-liste-detail-calcul'>";
	html += "<thead>";
	html += "<th>"+ "Date" + "</th>";
	html += "<th>"+ "Dénomination" + "</th>";
	html += "<th>"+ "Evenement" + "</th>";
	html += "<th>"+ "Nombre de calcul réalisé" + "</th>";
	html += "</thead>";
	html += "<tbody>";

	$.each(data, function(i,v){
		var iduser = v.idUser
		var date   = v.date.date.split(".");
		var nb     = 0;
		var denom  = v.denomination;
		var event  = v.evenement;
		var filtre = denom + event + iduser;
		date = date[0].split(" ");
0
		//compte le nombre d'élement qui ont la même denom + event + id user etc//
		$.each(dataTMP, function(ind,va){
			if(denom == va.denomination && event == va.evenement && iduser == va.idUser){
				nb += 1;
			}
		});

		if(-1 == results.indexOf(filtre)){
			results.push(filtre);

			html += "<tr>";
			html += "<td>" + date[0] + "</td>";
			html += "<td>" + denom + "</td>";
			html += "<td>" + event + "</td>";
			html += "<td><div class=\"badge badge-primary badge-pill\">"+nb+"</div></td>";
			html += "</tr>";
		}
	});
	html += "</tbody>";
	html += "</table>";
	return html;
}

/**
 *
 * @param calcul
 * @param typeStructure
 */
function showDetailledCalcul(data, typeStructure, typeDeCalcule){
	if(typeStructure == typeStruct.portique) {
		if(typeDeCalcule ==  typeCalcul.do){
			var face        = data.face;
			var hauteurP    = data.hauteurP;
			var hauteurT    = data.hauteurT;
			var masse       = data.masse;
			var ouverture   = data.ouverture;
			var profond     = data.profond;

			var html = "";
			html += "<table class='table-detail-showcalcul-portique detail-showcalcul-do'>";
			html += "<tr>";
			html += "<td> Hauteur total : <b>"+hauteurT+"</b></td>";
			html += "<td> Hauteur de passage : <b>"+hauteurP+"</b></td>";
			html += "<td> Face : <b>"+face+"</b></td>";
			html += "<td> Ouverture : <b>"+ouverture+"</b></td>";
			html += "<td> Profondeur : <b>"+profond+"</b></td>";
			html += "<td> Masse : <b>"+masse+"</b></td>";
			html += "</tr>";
			html += "</table>";
			return html;
		}
		else if(typeDeCalcule ==  typeCalcul.lestage){
			var ePlusOrMin  = data.ePlusOrMin;
			var effPass     = data.effPass;
			var effTour     = data.effTour;
			var lestage     = data.lestage;
			var mRenvers    = data.mRenvers;
			var mStab       = data.mStab;
			var pressDyn    = data.pressDyn;
			var vitMax      = data.vitMax;
			var vitMetr     = data.vitMetr;

			var html = "";
			html += "<table class='table-detail-showcalcul-portique detail-showcalcul-lestage'>";
			html += "<tr><td> Vitesse du vent (saisie)  :  </td><td>"+vitMax+" </td></tr>";
			html += "<tr><td> Vitesse du vent (m/s) :  </td><td>"+vitMetr+" </td></tr>";
			html += "<tr><td> Pression dynamique (daN/m²) :  </td><td>"+pressDyn+" </td></tr>";
			html += "<tr><td> Effort sur tour (daN) :  </td><td>"+effTour+" </td></tr>";
			html += "<tr><td> Effort sur le passage (daN) :  </td><td>"+effPass+" </td></tr>";
			html += "<tr><td> Moment Renversant (daN.m) :  </td><td>"+mRenvers+" </td></tr>";
			html += "<tr><td> Moment Stabilisant (daN.m) :  </td><td>"+mStab+" </td></tr>";
			html += "<tr><td> Ecart :  </td><td>"+ePlusOrMin+" </td></tr>";
			html += "<tr><td> LEST A PREVOIR :  </td><td>"+lestage+" </td></tr>";
			html += "</table>";
			return html;
		}
		else if(typeDeCalcule ==  typeCalcul.sol){
			var chargePied          = data.chargePied;
			var diametreLargeur     = data.diametreLargeur;
			var diametreLongueur    = data.diametreLongueur;
			var pressionParPied     = data.pressionParPied;
			var surfaceCale         = data.surfaceCale;
			var typeCale            = data.typeCale;

			var html = "";
			html += "<table class='table-detail-showcalcul-portique detail-showcalcul-sol'>";
			html += "<tr><td> Type de cale :  </td><td>"+typeCale+" </td></tr>";
			html += "<tr><td> Surface cale :  </td><td>"+surfaceCale+" </td></tr>";
			html += "<tr><td> Descentes de charge par pied :  </td><td>"+chargePied+" </td></tr>";
			html += "<tr><td> Pression générée par pied :  </td><td>"+pressionParPied+" </td></tr>";
			html += "</table>";
			return html;
		}
	}
	else if(typeStructure == typeStruct.totem){
		if(typeDeCalcule ==  typeCalcul.do){
			var hauteurCDGEQ    = data.hauteurCDGEQ;
			var hauteurCDGT     = data.hauteurCDGT;
			var hauteurT        = data.hauteurT;
			var largT           = data.largT;
			var masseB          = data.masseB;
			var masseEQ         = data.masseEQ;
			var masseT          = data.masseT;
			var stabB           = data.stabB;
			var surfaceEQ       = data.surfaceEQ;

			var html = "";
			html += "<table class='table-detail-showcalcul-portique detail-showcalcul-do'>";
			html += "<tr>";

			html += "<td class='details-do-totem'>Equipement en hauteur</td>";
			html += "<td> Hauteur cdg : <b>"+hauteurCDGEQ+"</b></td>";
			html += "<td> Surface : <b>"+surfaceEQ+"</b></td>";
			html += "<td> Poids : <b>"+masseEQ+"</b></td>";

			html += "<td class='details-do-totem'>Le mât</td>";
			html += "<td> Hauteur : <b>"+hauteurT+"</b></td>";
			html += "<td> Hauteur cdg : <b>"+hauteurCDGT+"</b></td>";
			html += "<td> Largeur : <b>"+largT+"</b></td>";
			html += "<td> Poids : <b>"+masseT+"</b></td>";

			html += "<td class='details-do-totem'>La base</td>";
			html += "<td> Stabilité : <b>"+stabB+"</b></td>";
			html += "<td> Poids : <b>"+masseB+"</b></td>";
			html += "</tr>";
			html += "</table>";
			return html;
		}
		else if(typeDeCalcule ==  typeCalcul.lestage){
			var coef            = data.coef;
			var ePlusOrMin      = data.ePlusOrMin;
			var effEquip        = data.effEquip;
			var effMat          = data.effMat;
			var lestage         = data.lestage;
			var momentEquip     = data.momentEquip;
			var momentMat       = data.momentMat;
			var momentRenvers   = data.momentRenvers;
			var momentStab      = data.momentStab;
			var pressDyn        = data.pressDyn;
			var vitMax          = data.vitMax;
			var vitMetr         = data.vitMetr;

			var html = "";
			html += "<table class='table-detail-showcalcul-portique detail-showcalcul-lestage'>";
			html += "<tr><td> Vitesse du vent (saisie)  :  </td><td>"+vitMax+" </td></tr>";
			html += "<tr><td> Vitesse du vent (m/s) :  </td><td>"+vitMetr+" </td></tr>";
			html += "<tr><td> Pression dynamique (daN/m²) :  </td><td>"+pressDyn+" </td></tr>";
			html += "<tr><td> Effort sur mât (daN) :  </td><td>"+effMat+" </td></tr>";
			html += "<tr><td> Moment sur mât (daN.m) :  </td><td>"+momentMat+" </td></tr>";
			html += "<tr><td> Effort sur l'équip. (daN.m) :  </td><td>"+effEquip+" </td></tr>";
			html += "<tr><td> Moment sur l'équip. (daN.m) :  </td><td>"+momentEquip+" </td></tr>";
			html += "<tr><td> Moment Renversant  Total(daN.m) :  </td><td>"+momentRenvers+" </td></tr>";
			html += "<tr><td> Moment Stabilisant (daN.m) :  </td><td>"+momentStab+" </td></tr>";
			html += "<tr><td> Ecart :  </td><td>"+ePlusOrMin+" </td></tr>";
			html += "<tr><td> LEST A PREVOIR :  </td><td>"+lestage+" </td></tr>";
			html += "</table>";
			return html;
		}
		else if(typeDeCalcule ==  typeCalcul.sol){
			var chargePied          = data.chargePied;
			var diametreLargeur     = data.diametreLargeur;
			var diametreLongueur    = data.diametreLongueur;
			var pressionParPied     = data.pressionParPied;
			var surfaceCale         = data.surfaceCale;
			var typeCale            = data.typeCale;

			var html = "";
			html += "<table class='table-detail-showcalcul-portique detail-showcalcul-sol'>";
			html += "<tr><td> Type de cale :  </td><td>"+typeCale+" </td></tr>";
			html += "<tr><td> Surface cale :  </td><td>"+surfaceCale+" </td></tr>";
			html += "<tr><td> Descentes de charge par pied :  </td><td>"+chargePied+" </td></tr>";
			html += "<tr><td> Pression générée par pied :  </td><td>"+pressionParPied+" </td></tr>";
			html += "</table>";
			return html;
		}
	}
	else if(typeStructure == typeStruct.tour){
		if(typeDeCalcule ==  typeCalcul.do){
			var face        = data.face;
			var hauteur     = data.hauteur;
			var masse       = data.masse;
			var profond     = data.profond;

			var html = "";
			html += "<table class='table-detail-showcalcul-portique detail-showcalcul-do'>";
			html += "<tr>";
			html += "<td> Hauteur total : <b>"+hauteur+"</b></td>";
			html += "<td> Face : <b>"+face+"</b></td>";
			html += "<td> Profondeur : <b>"+profond+"</b></td>";
			html += "<td> Masse : <b>"+masse+"</b></td>";
			html += "</tr>";
			html += "</table>";
			return html;
		}
		else if(typeDeCalcule ==  typeCalcul.lestage){
			var ePlusOrMin  = data.ePlusOrMin;
			var effTour     = data.effTour;
			var lestage     = data.lestage;
			var mRenvers    = data.mRenvers;
			var mStab       = data.mStab;
			var pressDyn    = data.pressDyn;
			var vitMax      = data.vitMax;
			var vitMetr     = data.vitMetr;

			var html = "";
			html += "<table class='table-detail-showcalcul-portique detail-showcalcul-lestage'>";
			html += "<tr><td> Vitesse du vent (saisie)  :  </td><td>"+vitMax+" </td></tr>";
			html += "<tr><td> Vitesse du vent (m/s) :  </td><td>"+vitMetr+" </td></tr>";
			html += "<tr><td> Pression dynamique (daN/m²) :  </td><td>"+pressDyn+" </td></tr>";
			html += "<tr><td> Effort sur tour (daN) :  </td><td>"+effTour+" </td></tr>";
			html += "<tr><td> Moment Renversant (daN.m) :  </td><td>"+mRenvers+" </td></tr>";
			html += "<tr><td> Moment Stabilisant (daN.m) :  </td><td>"+mStab+" </td></tr>";
			html += "<tr><td> Ecart :  </td><td>"+ePlusOrMin+" </td></tr>";
			html += "<tr><td> LEST A PREVOIR :  </td><td>"+lestage+" </td></tr>";
			html += "</table>";
			return html;
		}
		else if(typeDeCalcule ==  typeCalcul.sol){
			var chargePied          = data.chargePied;
			var diametreLargeur     = data.diametreLargeur;
			var diametreLongueur    = data.diametreLongueur;
			var pressionParPied     = data.pressionParPied;
			var surfaceCale         = data.surfaceCale;
			var typeCale            = data.typeCale;

			var html = "";
			html += "<table class='table-detail-showcalcul-portique detail-showcalcul-sol'>";
			html += "<tr><td> Type de cale :  </td><td>"+typeCale+" </td></tr>";
			html += "<tr><td> Surface cale :  </td><td>"+surfaceCale+" </td></tr>";
			html += "<tr><td> Descentes de charge par pied :  </td><td>"+chargePied+" </td></tr>";
			html += "<tr><td> Pression générée par pied :  </td><td>"+pressionParPied+" </td></tr>";
			html += "</table>";
			return html;
		}
	}
}

function removeGoodBoxCaluclDetailProfil(type){
	$(".div-layer-calcul-detail-"+type+"").remove();
}

$(".detail-tableau-vent-toggle").on("click",function(){
	var struct = $(this).data("target");
	var elemI = $(this).find("i");
	if(elemI.hasClass("ti-arrow-circle-down")){
		elemI.removeClass("ti-arrow-circle-down");
		elemI.addClass("ti-arrow-circle-up");
	}else
	{
		elemI.removeClass("ti-arrow-circle-up");
		elemI.addClass("ti-arrow-circle-down");
	}
	if(struct ==  typeStruct.tour){
		showDetailTour();
	}
	else if(struct ==  typeStruct.totem){
		showDetailTotem();
	}
	else if(struct ==  typeStruct.portique){
		showDetailPortique();
	}
});

function showDetailTour(){
	if($("#div-block-table-calcul-vent-tour #data-vent-table tbody tr:nth-child(2)").is(":visible")){
		$("#div-block-table-calcul-vent-tour #data-vent-table tbody tr.start").nextUntil("tr.rowResultLestageTour").hide(800);
	}else{
		$("#div-block-table-calcul-vent-tour #data-vent-table tbody tr.start").nextUntil("tr.rowResultLestageTour").show(800);
	}
}

function showDetailTotem(){

	if($("#div-block-table-calcul-vent-totem #data-vent-table tbody tr:nth-child(2)").is(":visible")){
		$("#div-block-table-calcul-vent-totem #data-vent-table tbody tr.start").nextUntil("tr.rowResultLestagetotem").hide(800);
	}else{
		$("#div-block-table-calcul-vent-totem #data-vent-table tbody tr.start").nextUntil("tr.rowResultLestagetotem").show(800);
	}
}

function showDetailPortique(){

	if($("#div-block-table-calcul-vent-portique #data-vent-table tbody tr:nth-child(2)").is(":visible")){
		$("#div-block-table-calcul-vent-portique #data-vent-table tbody tr.start").nextUntil("tr.rowResultLestagePortique").hide(800);
	}else{
		$("#div-block-table-calcul-vent-portique #data-vent-table tbody tr.start").nextUntil("tr.rowResultLestagePortique").show(800);
	}
}

function testNameEventPortique(){
	var stop = false;
	$("#infos_event_portique input").each(function(i, v) {
		if (!$(v).val()) {
			alert(listMessageAlert.alertPortiqueEmptyEvent);
			stop = true;
			return false;
		}
	});

	if (stop) {
		return false;
	}

	return true;
}

function testNameEventTour(){
	var stop = false;
	$("#infos_event_tour input").each(function(i, v) {
		if (!$(v).val()) {
			alert(listMessageAlert.alertPortiqueEmptyEvent);
			stop = true;
			return false;
		}
	});

	if (stop) {
		return false;
	}

	return true;
}

function testNameEventTotem(){
	var stop = false;
	$("#infos_event_totem input").each(function(i, v) {
		if (!$(v).val()) {
			alert(listMessageAlert.alertPortiqueEmptyEvent);
			stop = true;
			return false;
		}
	});

	if (stop) {
		return false;
	}

	return true;
}

function testInputsPont() {
	var stop = false;
	$("#div-input-portique>.box-calcul-obligatoire table input").each(function(i, v) {
		if (!$(v).val()) {
			alert(listMessageAlert.alertPortiqueEmptyInput);
			stop = true;
			return false;
		}
	});

	if (stop) {
		return false;
	}

	return true;
}


function remember_me(u, p){
	$.cookie("username", u, { expires: 365 }); //1 an
	$.cookie("password", p, { expires: 365 });
}

function load_em(){
	var u = $.cookie("username");
	var p = $.cookie("password");

	$("#form-auth").find("input[name='_username']").val(u);
	$("#form-auth").find("input[name='_password']").val(p);
}



/**
 *
 * @param $hauteur
 * @returns {boolean}
 */
function testHauteurStruct($hauteur) {
	if ($hauteur > 12) {
		alert(listMessageAlert.alertMaxHauteur);
		return false;
	}
	return true;
}

/**
 * Transforme toutes les virgules en pts.
 */
$(".config-commat").on("input",function(){
	let saisie = $(this).val();
	if (saisie.indexOf(',') >= 0) {
		saisie = saisie.replace(',', '.');
		$(this).val(saisie);
	}
})



