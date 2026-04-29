$(document).ready(function() {
	var pourcentSpriteBackgroudPositionY = 33.455;
	var pourcentSpritePontBackgroudPositionY = 33.45;
	var portiqueePontMiddlePositionX = -700;
	var portiquePontMaxPositionX = -1385;

	var pattern=/^[1-9]\d{0,2}(\.?\d{3})*(,\d+)?$/;

	var ObjStructPortique = null;
	var ObjPressionSol = null;
	var ObjLestagePortique = null;

	var typeStruct = {
		tour: 'tour',
		portique: 'portique',
		totem: 'totem'
	}

	var typePortique = {
		pont: "pont",
		echaf: "echaf"
	}

	var typeCale = {
		rec: "rectangulaire",
		cir: "circulaire"
	}

	var coef = {
		nu: 0.7,
		habil: 1
	}

	var coefPont = {
		nu: 0.7,
		habil: 1
	}

	var coefEchaf = {
		nu: 0.3,
		habil: 1
	}

	/**
	 *
	 * @type {{coef: number, type: string}}
	 */
	var HabillageStructure = {
		type: 'pont',
		coef: parseFloat(0.7)
	}

	/**
	 *
	 * @type {{chargePied: string, typeCale: string, diametre: string, pressionParPied: string, surfaceCale: string}}
	 */
	var dataPressionSolPortique = {
		typeCale: '',
		diametreLargeur: '',
		diametreLongueur: '',
		chargePied: '',
		surfaceCale: '',
		pressionParPied: ''
	}

	var dataLestagePortique = {
		vitMax: '',
		vitMetr: '',
		pressDyn: '',
		effTour: '',
		effPass: '',
		mRenvers: '',
		mStab: '',
		ePlusOrMin: '',
		lestage: '',
		coef: ''
	}

	/**
	 *
	 * @param $ht
	 * @param $hm
	 * @param $m
	 * @param $f
	 * @param $pr
	 * @param $pe
	 * @param $o
	 * @constructor
	 */
	var StructurePortique = function($ht, $hp, $m, $f, $pr, $o, $tp) {
		this.hauteurT = parseFloat($ht),
		this.hauteurP = parseFloat($hp),
		this.masse = parseFloat($m),
		this.face = parseFloat($f),
		this.profond = parseFloat($pr),
		this.ouverture = parseFloat($o),
		this.typeStruct = $tp
	}

	/**
	 * [Habille ou non la structure courante]
	 */
	$("#id-toggle-portique-habille").on("click", function() {
		var backgroundPos = $("#spr-portique").css('backgroundPosition').split(" ");
		var xPos = backgroundPos[0],
			yPos = backgroundPos[1];

		if (!$("#id-toggle-portique-pont").hasClass("active")) {
			if ($(this).hasClass("active")) {
				$("#spr-portique").css("background-position", xPos + " 0");
				HabillageStructure.coef = coef.nu;
			} else {
				$("#spr-portique").css("background-position", xPos + " " + pourcentSpritePontBackgroudPositionY + "%");
				HabillageStructure.coef = coef.habil;
			}
		} else {
			if ($(this).hasClass("active")) {
				$("#spr-portique").css("background-position", xPos + " " + pourcentSpriteBackgroudPositionY * 2 + "%");
				HabillageStructure.coef = coefEchaf.nu;
			} else {
				$("#spr-portique").css("background-position", xPos + " " + pourcentSpriteBackgroudPositionY * 3 + "%");
				HabillageStructure.coef = coef.habil;
			}
		}
	});

	/**
	 * [Change le type de structure, pont / echafaudage]
	 */
	$("#id-toggle-portique-pont").on("click", function() {
		var backgroundPos = $("#spr-portique").css('backgroundPosition').split(" ");
		var xPos = backgroundPos[0],
			yPos = backgroundPos[1];

		//si le toggle habille n'EST PAS ACTIF !
		if (!$("#id-toggle-portique-habille").hasClass("active")) {
			if ($(this).hasClass("active")) {
				HabillageStructure.type = typePortique.pont;
				HabillageStructure.coef = coefPont.nu;
				$("#spr-portique").css("background-position", xPos + " 0");
			} else {
				HabillageStructure.type = typePortique.echaf;
				HabillageStructure.coef = coefEchaf.nu;
				$("#spr-portique").css("background-position", xPos + " " + pourcentSpriteBackgroudPositionY * 2 + "%");
			}
		} else {
			if ($(this).hasClass("active")) {
				HabillageStructure.type = typePortique.pont;
				HabillageStructure.coef = coefPont.habil;
				$("#spr-portique").css("background-position", xPos + " " + pourcentSpriteBackgroudPositionY + "%");
			} else {
				HabillageStructure.type = typePortique.echaf;
				HabillageStructure.coef = coefEchaf.habil;
				$("#spr-portique").css("background-position", xPos + " " + pourcentSpriteBackgroudPositionY * 3 + "%");
			}
		}
	});

	/**
	 * on click calcul lestage input
	 */
	$("#calcul-lestage-input-portique").on("click", function(event) {

		$ht = $("#hauteur-totale-portique").val();
		if ((!testInputsPont()) || (!testNameEventPortique()) || !testHauteurStruct($ht)) {
			event.stopPropagation();
			return false;
		} else {

			$hp = $("#hauteur-pass-portique").val();
			$m = $("#masse-portique").val();
			$f = $("#face-portique").val();
			$pr = $("#prof-portique").val();
			$o = $("#ouverture-portique").val();

            if(!testLargeurBasePortique($("#hauteur-totale-portique").val(), $pr)){
                event.stopPropagation();

                $("#div-block-table-calcul-vent-portique").css("display", "none");
                $("#div-table-pression-sol-portique").css("display", "none");
                $(".layers-portique .card-footer").css("display","none");

                return false;
            }

			$eventName = $("#nom_event_portique").val();
			$nameStruc = $("#nom_struct_portique").val();

			infosEventPortique.nameEvent = $eventName;
			infosEventPortique.nameStruct = $nameStruc;

			ObjStructPortique = new StructurePortique($ht, $hp, $m, $f, $pr, $o,HabillageStructure.type);
			$("#div-block-table-calcul-vent-portique").css("display", "block");
			$("#div-table-pression-sol-portique").css("display", "block");
			$(".layers-portique .card-footer").css("display","block");


			$('.card-portique').animate({
                scrollTop: $("#div-block-table-calcul-vent-portique").offset().top
            }, 1000);
		}
	});

	/**
	 * [Calcule de lestage pour le portique]
	 */
	$(".btn-calcul-vent-portique").on("click", function() {

		var vent = $(".input-v-A").val();
		$("#div-table-pression-sol-portique table tbody input:not([type=checkbox])").each(function(){
			$(this).val("");
		});

			if (vent) {
				ObjLestagePortique = new LestagePortique(vent);
				ObjLestagePortique.calculLestage();
				ObjLestagePortique.fixeColor();
			} else {
				alert(listMessageAlert.alertSaisiIncorrect);
			}

	});

	/**
	 * [Calcule de lestage pour le portique]
	 */
	$(".btn-calcul-pression-sol-portique").on("click", function() {

		var checked = false;
		var valueCal = "";
		$(".chx-cale-portique").each(function(index, value) {
			checked = $(this).is(":checked");
			valueCal = $(this).val();
			if (checked) {
				return false;
			}
		});
		if (!checked) {
			alert(listMessageAlert.alertNoCocheCale);
			event.stopPropagation();
			return false;
		} else {
			var lar = $(".input-v-DIAM-lar").val();
			var lon = $(".input-v-DIAM-lon").val();

			if (dataPressionSolPortique.typeCale == typeCale.rec) {
				if (!lar && !lon) {
					alert(listMessageAlert.alertLargLongDiam);
					event.stopPropagation();
					return false;
				} else {

					if (lar && lon) {
						dataPressionSolPortique.diametreLargeur = parseFloat(lar);
						dataPressionSolPortique.diametreLongueur = parseFloat(lon);
						calculPressionSolPortique();
						saveCalcul(dataPressionSolPortique, dataLestagePortique, ObjStructPortique, typeStruct.portique);
					} else {
						$(".input-v-DIAM-lar").val("");
						$(".input-v-DIAM-lon").val("");
						event.stopPropagation();
						return false;
					}
				}
			} else if (dataPressionSolPortique.typeCale == typeCale.cir) {
				if (!lon) {
					alert(listMessageAlert.alertLongDiam);
					event.stopPropagation();
					return false;
				} else {
					if (lon) {

						dataPressionSolPortique.diametreLongueur = parseFloat(lon);
						calculPressionSolPortique();
						saveCalcul(dataPressionSolPortique, dataLestagePortique, ObjStructPortique, typeStruct.portique);
					} else {
						$(".input-v-t-DIAM-lon").val("");
						event.stopPropagation();
						return false;
					}
				}
			}


		}
	});

	/**
	 * [Test si hauteur est numeric]
	 */
	$("#hauteur-totale-portique").on("keyup input", function(event) {
		var currentHauteur = $(this).val();
		if (!currentHauteur) {
			event.stopPropagation();
			return false;
		}
	});

	/**
	 * [Test si ouverture est numérique]
	 * [Deplace le sprite en fonction]
	 */
	$("#ouverture-portique").on("keyup input", function(event) {
		var currentOuverture = $(this).val();
		if (!currentOuverture) {

			event.stopPropagation();
			return false;
		} else {
			var backgroundPos = $("#spr-portique").css('backgroundPosition').split(" ");
			var xPos = backgroundPos[0],
				yPos = backgroundPos[1];
			if (currentOuverture < 4) {
				$("#spr-portique").css("background-position", "0 " + yPos);
			} else if (currentOuverture >= 4 && currentOuverture < 6) {
				$("#spr-portique").css("background-position", portiqueePontMiddlePositionX + "px " + yPos);
			} else if (currentOuverture >= 6) {
				$("#spr-portique").css("background-position", portiquePontMaxPositionX + "px " + yPos);
			}
		}
	});

	class LestagePortique {
		/**
		 *
		 * @param vitesseMax
		 * @constructor
		 */
		constructor(vitesseMax) {

			dataLestagePortique.vitMax = parseFloat(vitesseMax.replace(',', '.'));
			dataLestagePortique.coef = HabillageStructure.coef;
		}

		calculLestage() {
			dataLestagePortique.vitMetr     = round(dataLestagePortique.vitMax / 3.6,2);
			dataLestagePortique.pressDyn    = round((dataLestagePortique.vitMetr * dataLestagePortique.vitMetr) / 16.3,2);
			dataLestagePortique.pressDyn    = round(dataLestagePortique.pressDyn * 1.5,2);
			dataLestagePortique.effTour     = round(ObjStructPortique.hauteurT * ObjStructPortique.face * HabillageStructure.coef * dataLestagePortique.pressDyn,2);
			dataLestagePortique.effPass     = round((ObjStructPortique.hauteurT - ObjStructPortique.hauteurP) * ObjStructPortique.ouverture * HabillageStructure.coef * dataLestagePortique.pressDyn,2);

			var calculTmp = (dataLestagePortique.effPass * (ObjStructPortique.hauteurT - (ObjStructPortique.hauteurT - ObjStructPortique.hauteurP) / 2));
			calculTmp = (2 * (dataLestagePortique.effTour * ObjStructPortique.hauteurT / 2)) + calculTmp;
			dataLestagePortique.mRenvers = round(calculTmp,2);

			dataLestagePortique.mStab = round(ObjStructPortique.masse * (ObjStructPortique.profond / 2),2);
			dataLestagePortique.ePlusOrMin = round(dataLestagePortique.mStab - dataLestagePortique.mRenvers,2);
			dataLestagePortique.lestage = round((Math.abs(dataLestagePortique.ePlusOrMin) / (ObjStructPortique.profond / 2)) / 2, 0);

			if(dataLestagePortique.ePlusOrMin > 0){
				dataLestagePortique.lestage = 0;
			}

			//show the response data
			$(".input-v-B").val(round(dataLestagePortique.vitMetr, 1));
			$(".input-v-C").val(round(dataLestagePortique.pressDyn, 1));
			$(".input-v-D").val(round(dataLestagePortique.effTour, 1));
			$(".input-v-E").val(round(dataLestagePortique.effPass, 1));
			$(".input-v-F").val(round(dataLestagePortique.mRenvers, 1));
			$(".input-v-G").val(round(dataLestagePortique.mStab, 1));
			$(".input-v-H").val(round(dataLestagePortique.ePlusOrMin, 1));
			$(".input-v-L").val(dataLestagePortique.lestage);

			return dataLestagePortique;
		}

		fixeColor() {
			/*if (dataLestagePortique.ePlusOrMin < 0) {
				$(".input-v-H").css("color", "red");
			} else {
				$(".input-v-H").css("color", "green");
			}

			if (dataLestagePortique.lestage > 0) {
				$(".input-v-L").css("color", "red");
			} else {
				$(".input-v-L").css("color", "green");

			}*/
		}
	}

	/**
	 *
	 * @param $p
	 * @param $ObjLestage
	 */
	calculPressionSolPortique = function() {
		var nbPiedPTour = 4;
		var nbPied      = 8;

		calcTmp = (dataLestagePortique.mRenvers / (ObjStructPortique.profond / 2)) / 4;
		if(HabillageStructure.type == typePortique.pont){
			nbPied      = 2;
			calcTmp     = 0;
			nbPiedPTour = 1;
		}

		//calcule descente de charge sur 1 pied
		dataPressionSolPortique.chargePied  = round(parseFloat(ObjStructPortique.masse) / nbPied + (dataLestagePortique.lestage / nbPiedPTour) + calcTmp,2);
		dataPressionSolPortique.surfaceCale = round(parseFloat(dataPressionSolPortique.diametreLongueur) * parseFloat(dataPressionSolPortique.diametreLargeur),2);

		if (dataPressionSolPortique.typeCale == typeCale.cir) {
			//calcul diametre circulaire
			calcTmp = parseFloat(dataPressionSolPortique.diametreLongueur) * parseFloat(dataPressionSolPortique.diametreLongueur);
			calcTmp = calcTmp / 4;
			calcTmp = 3.14 * calcTmp;
			calcTmp = calcTmp;
			dataPressionSolPortique.surfaceCale = round(calcTmp,2);
		}

		dataPressionSolPortique.pressionParPied = round(parseFloat(dataPressionSolPortique.chargePied) / dataPressionSolPortique.surfaceCale,2);

		$(".input-v-SC").val(round(dataPressionSolPortique.surfaceCal, 1));
		$(".input-v-CHARGE").val(round(dataPressionSolPortique.chargePied, 1));
		$(".input-v-SC").val(round(dataPressionSolPortique.surfaceCale, 1));
		$(".input-v-PPP").val(round(dataPressionSolPortique.pressionParPied, 2));
	}

	/**
	 *
	 */
	$(".chx-cale-portique").on("click", function() {
		var type = $(this).val();
		var checked = $(this).is(":checked");
		$(".chx-cale-portique").each(function(index, value) {
			$(this).prop('checked', false);
		});

		if (checked) {
			$(this).prop('checked', true);
			$(".input-v-SC").val("");
			if (type == typeCale.cir) {
				$("#row-diametre-portique").show(1000);
				$("#row-diametre-portique > td:first-child").html("Diamètre (cm) = ");
				$(".input-v-DIAM-lon").css("pointer-events", "all");
				$(".input-v-DIAM-lar").css("display", "none");
				$(".input-v-DIAM-lar").removeClass("background-very-light-blue");
				$(".input-v-DIAM-lar").removeAttr('placeholder');
				$(".input-v-DIAM-lon").removeAttr('placeholder');
				dataPressionSolPortique.typeCale = typeCale.cir;
			} else {
				dataPressionSolPortique.typeCale = typeCale.rec;
				$("#row-diametre-portique").show(1000);
				$("#row-diametre-portique > td:first-child").html("Longueur (cm) x largeur (cm) = ");
				$(".input-v-DIAM-lar").css("pointer-events", "all");
				$(".input-v-DIAM-lon").css("pointer-events", "all");
				$(".input-v-DIAM-lar").css("display", "block");
				$(".input-v-DIAM-lar").addClass("background-very-light-blue");
				$(".input-v-DIAM-lar").attr('placeholder', 'largeur');
			}
		} else {
			$(this).prop('checked', false);
			$("#row-diametre-portique").hide();
		}
	});

	/**
	 * bouchon saisie
	 */
	$("#div-input-portique>.box-calcul-obligatoire table th").on("dblclick", function() {
		$("#hauteur-totale-portique").val(3.6);
		$("#hauteur-pass-portique").val(2.8);
		$("#masse-portique").val(500);
		$("#face-portique").val(0.8);
		$("#ouverture-portique").val(2.6);
		$("#prof-portique").val(0.8);
	});



	function testHauteurPont() {
		var sizeHauteur = $("#hauteur-totale-portique").val();
		if (sizeHauteur < 2 && sizeHauteur > 0) {
			alert(listMessageAlert.alertPortiqueSizePetit);
			return false;
		} else if (sizeHauteur > 6) {
			alert(listMessageAlert.alertPortiqueSizeGrand);
			return false;
		}
		return true;
	}

	function testOuverturePont() {
		//regle pour l'ouverture maximum ou minimum
		var sizeHauteur = parseFloat($("#hauteur-totale-portique").val());
		var sizeOuverture = parseFloat($("#ouverture-portique").val());
		var compareValueMin = sizeHauteur;
		var compareValueMax = sizeHauteur * 3;
		if (sizeOuverture < compareValueMin) {
			alert(listMessageAlert.alertPortiqueOuvertunePetit);
			return false;
		} else if (sizeOuverture > compareValueMax) {
			alert(listMessageAlert.alertPortiqueOuvertureGrand + " (max : ".compareValueMax + "m");
			return false;
		}
		return true;
	}

	function testLargeurBasePortique($hauteur, $largeur){
		larg = parseFloat($largeur * 5);
		haut = parseFloat($hauteur);
		if( haut > larg){
			alert(listMessageAlert.alertLargeurTropPetite);
			event.stopPropagation();
			return false;
		}
		return true;
	}

});