$(document).ready(function() {
	var tourStepPositionX = -158;
	var pattern=/^[1-9]\d{0,2}(\.?\d{3})*(,\d+)?$/;

	var ObjPressionSol = null;
	var ObjStructTour = null;
	var ObjLestageTour = null;

	var typeStruct = {
		tour: 'tour',
		portique: 'portique',
		totem: 'totem'
	}

	var typeCale = {
		rec: "rectangulaire",
		cir: "circulaire"
	}

	/**
	 *
	 * @type {{coef: number, type: string}}
	 */
	var HabillageStructure = {
		type: '',
		coef: parseFloat(0.3)
	}


	$("#div-input-tour>.box-calcul-obligatoire table th").on("dblclick", function() {
		$("#hauteur-totale-tour").val(8);
		$("#masse-tour").val(800);
		$("#face-tour").val(2);
		$("#prof-tour").val(2);
	});


	/**
	 *
	 */
	$("#calcul-lestage-input-tour").on("click", function() {
		$h = parseFloat($("#hauteur-totale-tour").val());
		if (!testInputTour() || (!testNameEventTour()) || !testHauteurStruct($h)) {
			event.stopPropagation();
			return false;
		} else {
			$m = parseFloat($("#masse-tour").val());
			$f = parseFloat($("#face-tour").val());
			$p = parseFloat($("#prof-tour").val());

			if(!testLargeurBaseTour($h, Math.min($f,$p ))){
				event.stopPropagation();
				return false;
			}

			ObjStructTour = new StructureTour($h, $m, $f, $p);
			
			$(".layers-tour .card-footer").css("display","block");
			$("#div-block-table-calcul-vent-tour").css("display", "block");
			$("#div-table-pression-sol-tour").css("display", "block");

			$eventName                = $("#nom_event_tour").val();
			$nameStruc                = $("#nom_struct_tour").val();
			infosEventTour.nameEvent  = $eventName;
			infosEventTour.nameStruct = $nameStruc;

			$('.card-tour').animate({
				scrollTop: $("#div-block-table-calcul-vent-tour").offset().top
			}, 1000);
		}
	});

	/**
	 *
	 */
	$(".btn-calcul-pression-sol-tour").on("click", function(event) {

		let checked = false;
		let valueCal = "";
		$(".chx-cale-tour").each(function(index, value) {
			checked = $(this).is(":checked");
			valueCal = $(this).val();
			if (checked) {
				return false;
			}
		});
		let valLestage = parseInt($("#resultLestageTour").val());
		if(!valLestage){
			alert(listMessageAlert.alertLestageObligatoire);
			event.stopPropagation();
			return false;
		}
		else if (!checked) {
			alert(listMessageAlert.alertNoCocheCale);
			event.stopPropagation();
			return false;
		}
		else {
			let lar = $(".input-v-t-DIAM-lar").val();
			let lon = $(".input-v-t-DIAM-lon").val();

			if (dataPressionSolTour.typeCale == typeCale.rec) {
				if (!lar && !lon) {
					alert(listMessageAlert.alertLargLongDiam);
					event.stopPropagation();
					return false;
				} else {
					if (lar && lon) {
						dataPressionSolTour.diametreLargeur = parseFloat(lar);
						dataPressionSolTour.diametreLongueur = parseFloat(lon);
						calculPressionSolTour();
						saveCalcul(dataPressionSolTour, dataLestageTour, ObjStructTour, typeStruct.tour);
					} else {
						alert(listMessageAlert.alertFullCallRectangulaireObligatoire);
						event.stopPropagation();
						return false;
					}
				}
			} else if (dataPressionSolTour.typeCale == typeCale.cir) {
				if (!lon) {
					alert(listMessageAlert.alertLongDiam);
					event.stopPropagation();
					return false;
				} else {
					if (lon) {
						dataPressionSolTour.diametreLongueur = parseFloat(lon);
						calculPressionSolTour();
						saveCalcul(dataPressionSolTour, dataLestageTour, ObjStructTour, typeStruct.tour);
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
	 *
	 */
	$(".btn-calcul-vent-tour").on("click", function(e) {
		let vent = $(".input-v-t-A").val();
		$("#div-table-pression-sol-tour table tbody input:not([type=checkbox])").each(function(){
			$(this).val("");
		});
		if (vent) {
			ObjLestageTour = new LestageTour(vent);
			ObjLestageTour.calculLestage();
		} else {
			alert(listMessageAlert.alertSaisiIncorrect);
		}
	});

	/**
	 *
	 */
	$("#hauteur-totale-tour").on("keyup input", function(event) {
		let currentOuverture = $(this).val();
		if (!currentOuverture) {
			event.stopPropagation();
			return false;
		} else {
			let backgroundPos = $("#spr-tour").css('backgroundPosition').split(" ");
			let xPos = backgroundPos[0],
				yPos = backgroundPos[1];

			if (currentOuverture < 3) {
				$("#spr-tour").css("background-position", "5px " + yPos);
			} else if (currentOuverture >= 3 && currentOuverture < 5) {
				$("#spr-tour").css("background-position", tourStepPositionX + "px " + yPos);
			} else if (currentOuverture >= 5 && currentOuverture < 7) {
				$("#spr-tour").css("background-position", tourStepPositionX * 2 - parseFloat(4.5) + "px " + yPos);
			} else if (currentOuverture >= 7) {
				$("#spr-tour").css("background-position", tourStepPositionX * 3 - 9 + "px " + yPos);
			}
		}
	});

	/**
	 *
	 */
	$("#id-toggle-tour-habille").on("click", function() {
		var backgroundPos = $("#spr-tour").css('backgroundPosition').split(" ");
		var xPos = backgroundPos[0],
			yPos = backgroundPos[1];

		if ($(this).hasClass("active")) {
			$("#spr-tour").css("background-position", xPos + " 5px");
			HabillageStructure.coef = 0.3;
		} else {
			$("#spr-tour").css("background-position", xPos + " 395px");
			HabillageStructure.coef = 1;
		}
	})

	/**
	 *
	 */
	$("#id-toggle-tour-type").on("click", function() {
		var backgroundPos = $("#spr-tour").css('backgroundPosition').split(" ");
		var xPos = backgroundPos[0],
			yPos = backgroundPos[1];

		if ($(this).hasClass("active")) {
			$("#spr-tour").css("background-position", xPos + " 5px");
			HabillageStructure.coef = 0.3;
		} else {
			$("#spr-tour").css("background-position", xPos + " 395px");
			HabillageStructure.coef = 1;
		}
	})

	/**
	 *
	 */
	$(".chx-cale-tour").on("click", function() {
		var type = $(this).val();
		var checked = $(this).is(":checked");
		$(".chx-cale-tour").each(function(index, value) {
			$(this).prop('checked', false);
		});

		if (checked) {
			$(this).prop('checked', true);
			$(".input-v-t-SC").val("");
			if (type == typeCale.cir) {
				$("#row-diametre-tour").show(1000);
				$("#row-diametre-tour > td:first-child").html("Diamètre (cm) = ");
				$(".input-v-t-DIAM-lon").removeAttr('placeholder');
				$(".input-v-t-DIAM-lon").css("pointer-events", "all");
				$(".input-v-t-DIAM-lar").css("pointer-events", "none");
				$(".input-v-t-DIAM-lar").removeClass("background-very-light-blue");
				$(".input-v-t-DIAM-lar").removeAttr('placeholder');
				$(".input-v-t-DIAM-lon").removeAttr('placeholder');
				dataPressionSolTour.typeCale = typeCale.cir;
			} else {
				dataPressionSolTour.typeCale = typeCale.rec;
				$("#row-diametre-tour").show(1000);
				$("#row-diametre-tour > td:first-child").html("Longueur (cm) x largeur (cm) = ");
				$(".input-v-t-DIAM-lar").css("pointer-events", "all");
				$(".input-v-t-DIAM-lon").css("pointer-events", "all");
				$(".input-v-t-DIAM-lar").addClass("background-very-light-blue");
				$(".input-v-t-DIAM-lar").attr('placeholder', 'largeur');
				$(".input-v-t-DIAM-lon").attr('placeholder', 'longueur');
			}
		} else {
			$(this).prop('checked', false);
			$("#row-diametre-tour").hide();
		}
	});

	/**
	 *
	 * @param $p
	 * @param $ObjLestage
	 */
	calculPressionSolTour = function() {
		//calcule descente de charge sur 1 pied
		calcTmp = (parseFloat(dataLestageTour.mRenvers) / (parseFloat(ObjStructTour.profond) / 2)) / 2;
		dataPressionSolTour.chargePied = (ObjStructTour.masse + dataLestageTour.lestage) / 4;
		dataPressionSolTour.chargePied += round(calcTmp,2)// J

		if (dataPressionSolTour.typeCale == typeCale.cir) {
			//calcul diametre circulaire

			calcTmp = parseFloat(dataPressionSolTour.diametreLongueur) * parseFloat(dataPressionSolTour.diametreLongueur);
			calcTmp = 3.14 * calcTmp;
			calcTmp = calcTmp / 4;
			dataPressionSolTour.surfaceCale = round(calcTmp,2); // K

			//calcule descente de charge sur 1 pied
			calcTmp = (parseFloat(dataLestageTour.mRenvers) / (parseFloat(dataPressionSolTour.diametreLongueur) / 2)) / 2;
		} else if (dataPressionSolTour.typeCale == typeCale.rec) {
			dataPressionSolTour.surfaceCale = round(parseFloat(dataPressionSolTour.diametreLongueur) * parseFloat(dataPressionSolTour.diametreLargeur),2);
		}

		dataPressionSolTour.pressionParPied = round(dataPressionSolTour.chargePied / dataPressionSolTour.surfaceCale,2); // L

		$(".input-v-t-CHARGE").val(round(dataPressionSolTour.chargePied, 1));
		$(".input-v-t-SC").val(round(dataPressionSolTour.surfaceCale, 1));
		$(".input-v-t-PPP").val(round(dataPressionSolTour.pressionParPied, 2));
	}


	/**
	 *
	 * @param vitesseMax
	 * @constructor
	 */
	class LestageTour {
		/**
		 *
		 * @param vitesseMax
		 * @constructor
		 */
		constructor(vitesseMax) {
			dataLestageTour.vitMax = parseFloat(vitesseMax.replace(',', '.'));
			dataLestageTour.coef = HabillageStructure.coef;
		}

		calculLestage() {
			dataLestageTour.vitMetr     = round(dataLestageTour.vitMax / 3.6,2); // B
			dataLestageTour.pressDyn    = round((dataLestageTour.vitMetr * dataLestageTour.vitMetr) / 16.3,2); // C
			dataLestageTour.pressDyn    = round(dataLestageTour.pressDyn * 1.5,2);
			dataLestageTour.effTour     = round(ObjStructTour.hauteur * ObjStructTour.face * HabillageStructure.coef * dataLestageTour.pressDyn,2); // D
			dataLestageTour.mRenvers    = round(dataLestageTour.effTour * ObjStructTour.hauteur / 2,2); // E
			dataLestageTour.mStab       = round(ObjStructTour.masse * (ObjStructTour.profond / 2),2); // F
			dataLestageTour.ePlusOrMin  = round(dataLestageTour.mStab - dataLestageTour.mRenvers,2); // G

			if (dataLestageTour.ePlusOrMin > 0) {
				dataLestageTour.lestage = 0; // H
				//this.lestage = round((Math.abs(ePlusOrMin) / (ObjStructPortique.profond / 2))/2,1);
			} else {
				dataLestageTour.lestage = round((Math.abs(dataLestageTour.ePlusOrMin) / (ObjStructTour.profond / 2)), 0); // H
			}

			//show the response data
			$(".input-v-t-B").val(round(dataLestageTour.vitMetr, 1));
			$(".input-v-t-C").val(round(dataLestageTour.pressDyn, 1));
			$(".input-v-t-D").val(round(dataLestageTour.effTour, 1));
			$(".input-v-t-E").val(round(dataLestageTour.mRenvers, 1));
			$(".input-v-t-F").val(round(dataLestageTour.mStab, 1));
			$(".input-v-t-G").val(round(dataLestageTour.ePlusOrMin, 1));
			$(".input-v-t-H").val(dataLestageTour.lestage);

			return dataLestageTour;
		}

		fixeColor() {
			if (dataLestageTour.ePlusOrMin < 0) {
				$(".input-v-t-H").css("color", "red");
			} else {
				$(".input-v-t-H").css("color", "green");
			}

			if (dataLestageTour.lestage > 0) {
				$(".input-v-t-L").css("color", "red");
			} else {
				$(".input-v-t-L").css("color", "green");
			}
		}
	}


	/**
	 * Arrondie à "precision" près
	 *
	 * @param value
	 * @param precision
	 * @returns {number}
	 */
	function round(value, precision) {
		var multiplier = Math.pow(10, precision || 0);
		return Math.round(value * multiplier) / multiplier;
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

	/**
	 *
	 * @returns {boolean}
	 */
	function testInputTour() {
		var stop = false;
		$("#div-input-tour>.box-calcul-obligatoire table input").each(function(i, v) {
			let val = $(v).val();
			if (!$(v).val()) {
				alert(listMessageAlert.alertTourEmptyInput);
				stop = true;
				return false;
			}
		});

		if (stop) {
			return false;
		}

		return true;
	}

	/**
	 *
	 * @param element
	 */
	function testFieldNumeric(element) {

	}

	/**
	 *
	 * @param $hauteur
	 * @param $largeur
	 * A VOIR AVEC MOULOUD L'ALGO EXACT
	 */
	function testLargeurBaseTour($hauteur, $largeur){
		if( $hauteur > ($largeur * 5)){
			alert(listMessageAlert.alertLargeurTropPetite);
			event.stopPropagation();
			return false;
		}
		return true;
	}

});