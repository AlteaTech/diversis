$(document).ready(function() {
	var totemStepPositionX = -158;

	var ObjPressionSol = null;

	var ObjStructTotem = null;

	var ObjLestageTotem = null;

	var typeStruct = {
		totem: 'totem',
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
		coef: parseFloat(0.7)
	}

	$("#div-input-totem>.box-calcul-obligatoire table th").on("dblclick", function() {
		$("#surface-eq-totem").val(0.3);
		$("#poids-eq-totem").val(10);
		$("#hauteur-eq-totem").val(3.5);
		$("#hauteur-totale-totem").val(3.5);
		$("#poids-totem").val(20);
		$("#largeur-totem").val(0.3);
		$("#base-stab-totem").val(0.8);
		$("#base-poids-totem").val(80);
	});

	/**
	 *
	 */
	$("#calcul-lestage-input-totem").on("click", function() {
		$ht     = parseFloat($("#hauteur-totale-totem").val());
		if (!testInputTotem() || (!testNameEventTotem()) || !testHauteurStruct($ht)) {
			event.stopPropagation();
			return false;
		} else {

            if(!testLargeurBaseTotem(parseFloat($("#hauteur-totale-totem").val()), parseFloat($("#base-stab-totem").val()))){
                event.stopPropagation();

                $("#div-block-table-calcul-vent-totem").css("display", "none");
                $("#div-table-pression-sol-totem").css("display", "none");
                $(".layers-totem .card-footer").css("display","none");
                return false;
            }

			$mt     = parseFloat($("#poids-totem").val());
			$lt     = parseFloat($("#largeur-totem").val());
			$hcdgt  = $ht / 2;
			$hcdgEQ = parseFloat($("#hauteur-eq-totem").val());
			$sEQ    = parseFloat($("#surface-eq-totem").val());
			$mEQ    = parseFloat($("#poids-eq-totem").val());
			$sB     = parseFloat($("#base-stab-totem").val());
			$mB     = parseFloat($("#base-poids-totem").val());

			/**
			 * @var StructureTotem
			 * @type {StructureTotem}
			 */
			ObjStructTotem = new StructureTotem($ht, $mt, $lt, $hcdgt, $hcdgEQ, $sEQ, $mEQ, $sB, $mB);

			$("#div-block-table-calcul-vent-totem").css("display", "block");
			$("#div-table-pression-sol-totem").css("display", "block");
			$(".layers-totem .card-footer").css("display","block");

			$eventName = $("#nom_event_totem").val();
			$nameStruc = $("#nom_struct_totem").val();
			infosEventTotem.nameEvent = $eventName;
			infosEventTotem.nameStruct = $nameStruc;




			$('.card-totem').animate({
                scrollTop: $("#div-block-table-calcul-vent-totem").offset().top
            }, 1000);
		}
	});

	/**
	 *
	 */
	$(".btn-calcul-pression-sol-totem").on("click", function(event) {

		var checked = false;
		var valueCal = "";
		$(".chx-cale-totem").each(function(index, value) {
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
			var lar = $(".input-v-tt-DIAM-lar").val();
			var lon = $(".input-v-tt-DIAM-lon").val();


			if (dataPressionSolTotem.typeCale == typeCale.rec) {
				if (!lar && !lon) {
					alert(listMessageAlert.alertLargLongDiam);
					event.stopPropagation();
					return false;
				} else {
					if (lar && lon) {

						dataPressionSolTotem.diametreLargeur = parseFloat(lar);
						dataPressionSolTotem.diametreLongueur = parseFloat(lon);
						calculPressionSolTotem();

						saveCalcul(dataPressionSolTotem, dataLestageTotem, ObjStructTotem, typeStruct.totem);
					} else {
						$(".input-v-tt-DIAM-lar").val("");
						$(".input-v-tt-DIAM-lon").val("");
						event.stopPropagation();
						return false;
					}
				}
			} else if (dataPressionSolTotem.typeCale == typeCale.cir) {
				if (!lon) {
					alert(listMessageAlert.alertLongDiam);
					event.stopPropagation();
					return false;
				} else {
					if (lon) {

						if(!testLargeurBaseTotem(parseFloat($("#hauteur-totale-totem").val()), lon)){
							event.stopPropagation();
							return false;
						}

						dataPressionSolTotem.diametreLongueur = parseFloat(lon);
						calculPressionSolTotem();
						saveCalcul(dataPressionSolTotem, dataLestageTotem, ObjStructTotem, typeStruct.totem);
					} else {
						$(".input-v-tt-DIAM-lon").val("");
						event.stopPropagation();
						return false;
					}
				}
			}


		}
	})

	/**
	 *
	 */
	$(".btn-calcul-vent-totem").on("click", function(e) {
		var vent = $(".input-v-tt-A").val();

		$("#div-table-pression-sol-totem table tbody input:not([type=checkbox])").each(function(){
			$(this).val("");
		});

		if (vent) {
			ObjLestageTotem = new LestageTotem(vent);
			ObjLestageTotem.calculLestage();
		} else {
			alert(listMessageAlert.alertSaisiIncorrect);
		}

	});

	/**
	 *
	 */
	$("#hauteur-totale-totem").on("keyup input", function(event) {
		var currentOuverture = $(this).val();
		if (!currentOuverture) {
			event.stopPropagation();
			return false;
		} else {
			var backgroundPos = $("#spr-totem").css('backgroundPosition').split(" ");
			var xPos = backgroundPos[0],
				yPos = backgroundPos[1];

			if (currentOuverture < 3) {
				$("#spr-totem").css("background-position", "5px " + yPos);
			} else if (currentOuverture >= 3 && currentOuverture < 5) {
				$("#spr-totem").css("background-position", totemStepPositionX + "px " + yPos);
			} else if (currentOuverture >= 5 && currentOuverture < 7) {
				$("#spr-totem").css("background-position", totemStepPositionX * 2 - parseFloat(4.5) + "px " + yPos);
			} else if (currentOuverture >= 7) {
				$("#spr-totem").css("background-position", totemStepPositionX * 3 - 9 + "px " + yPos);
			}
		}
	});

	/**
	 *
	 */
	$("#id-toggle-totem-habille").on("click", function() {
		var backgroundPos = $("#spr-totem").css('backgroundPosition').split(" ");
		var xPos = backgroundPos[0],
			yPos = backgroundPos[1];

		if ($(this).hasClass("active")) {
			$("#spr-totem").css("background-position", xPos + " 7px");
			HabillageStructure.coef = 0.3;
		} else {
			$("#spr-totem").css("background-position", xPos + " 397px");
			HabillageStructure.coef = 1;
		}
	});

	/**
	 *
	 */
	$("#id-toggle-totem-type").on("click", function() {
		var backgroundPos = $("#spr-totem").css('backgroundPosition').split(" ");
		var xPos = backgroundPos[0],
			yPos = backgroundPos[1];
		var hauteur = $("#hauteur-totale-totem").val();

		if ($(this).hasClass("active")) {
			infosEventTotem.formeStruct = "carre";
			$("#spr-totem").css("background-position", "5px " + yPos);//ne pas oublier l'espace après px
		} else {
			infosEventTotem.formeStruct = "triangle";
			$("#spr-totem").css("background-position", "330px " + yPos);
		}

		if ((hauteur)) {
			if (hauteur >= 5) {
				if($("#id-toggle-totem-type").hasClass("active")){
					$("#spr-totem").css("background-position", "-158px " + yPos);
				}else{
					$("#spr-totem").css("background-position", "168px " + yPos);
				}
			} else if (hauteur <= 4) {
				if($("#id-toggle-totem-type").hasClass("active")){
					$("#spr-totem").css("background-position", "5px " + yPos);
				}else{
					$("#spr-totem").css("background-position", "330px " + yPos);
				}
			}
		}
	});

	/**
	 * [Test si hauteur est numérique]
	 * [Deplace le sprite en fonction]
	 */
	$("#hauteur-totale-totem").on("keyup input", function(event) {
		var hauteur = $(this).val();
		if (!hauteur) {
			event.stopPropagation();
			return false;
		} else {
			var backgroundPos = $("#spr-totem").css('backgroundPosition').split(" ");
			var xPos = backgroundPos[0],
				yPos = backgroundPos[1];


			if (hauteur >= 5) {
				if($("#id-toggle-totem-type").hasClass("active")){
					$("#spr-totem").css("background-position", "168px " + yPos);
				}else{
					$("#spr-totem").css("background-position", "-158px " + yPos);
				}
			} else if (hauteur <= 4) {
				if($("#id-toggle-totem-type").hasClass("active")){
					$("#spr-totem").css("background-position", "330px " + yPos);
				}else{
					$("#spr-totem").css("background-position", "5px " + yPos);
				}
			}

		}
	});

	/**
	 *
	 */
	$(".chx-cale-totem").on("click", function() {
		var type = $(this).val();
		var checked = $(this).is(":checked");
		$(".chx-cale-totem").each(function(index, value) {
			$(this).prop('checked', false);
		});

		if (checked) {
			$(this).prop('checked', true);
			$(".input-v-t-SC").val("");
			if (type == typeCale.cir) {
				$("#row-diametre-totem").show(1000);
				$("#row-diametre-totem > td:first-child").html("Diamètre (cm) = ");
				$(".input-v-tt-DIAM-lon").css("pointer-events", "all");
				$(".input-v-tt-DIAM-lar").css("display", "none");
				$(".input-v-tt-DIAM-lar").removeClass("background-very-light-blue");
				$(".input-v-tt-DIAM-lar").removeAttr('placeholder');
				$(".input-v-tt-DIAM-lon").removeAttr('placeholder');
				dataPressionSolTotem.typeCale = typeCale.cir;
			} else {
				dataPressionSolTotem.typeCale = typeCale.rec;
				$("#row-diametre-totem").show(1000);
				$(".input-v-tt-DIAM-lar").css("display", "block");
				$("#row-diametre-totem > td:first-child").html("Longueur (cm) x largeur (cm) = ");
				$(".input-v-tt-DIAM-lar").css("pointer-events", "all");
				$(".input-v-tt-DIAM-lon").css("pointer-events", "all");
				$(".input-v-tt-DIAM-lar").addClass("background-very-light-blue");
				$(".input-v-tt-DIAM-lar").attr('placeholder', 'largeur');
			}
		} else {
			$(this).prop('checked', false);
			$("#row-diametre-totem").hide();
		}
	});

	/**
	 *
	 * @param $p
	 * @param $ObjLestage
	 */
	calculPressionSolTotem = function() {
		//calcule descente de charge sur 1 pied
		var ppTotal = round(parseFloat(ObjStructTotem.masseT) + parseFloat(ObjStructTotem.masseB) + parseFloat(ObjStructTotem.masseEQ),2);

		var calcTmp = (ppTotal + parseFloat(dataLestageTotem.lestage));
		dataPressionSolTotem.chargePied = round(calcTmp,2);//round(parseFloat(calcTmp) + parseFloat((dataLestageTotem.momentRenvers/(parseFloat(ObjStructTotem.stabB) / 2))),2); // K

		if (dataPressionSolTotem.typeCale == typeCale.cir) {
			//calcul diametre circulaire
			calcTmp = parseFloat(dataPressionSolTotem.diametreLongueur) * parseFloat(dataPressionSolTotem.diametreLongueur);
			calcTmp = 3.14 * calcTmp;
			calcTmp = calcTmp / 4;
			dataPressionSolTotem.surfaceCale = round(calcTmp,2); // L
		} else if (dataPressionSolTotem.typeCale == typeCale.rec) {
			dataPressionSolTotem.surfaceCale = round(parseFloat(dataPressionSolTotem.diametreLongueur) * parseFloat(dataPressionSolTotem.diametreLargeur),2);
		}

		dataPressionSolTotem.pressionParPied = round(dataPressionSolTotem.chargePied / dataPressionSolTotem.surfaceCale,2); // L

		$(".input-v-tt-CHARGE").val(round(dataPressionSolTotem.chargePied, 1));
		$(".input-v-tt-SC").val(round(dataPressionSolTotem.surfaceCale, 1));$(".input-v-tt-PPP").val("<"+round(dataPressionSolTotem.pressionParPied, 2));
		$(".input-v-tt-PPP").val(round(dataPressionSolTotem.pressionParPied, 2));
		if(dataPressionSolTotem.pressionParPied < 0.1){
			$(".input-v-tt-PPP").val("<0.1");
		}
	}


	/**
	 *
	 * @param vitesseMax
	 * @constructor
	 */
	class LestageTotem {
		/**
		 *
		 * @param vitesseMax
		 * @constructor
		 */
		constructor(vitesseMax) {

			dataLestageTotem.vitMax = parseFloat(vitesseMax.replace(',', '.'));
			dataLestageTotem.coef = HabillageStructure.coef;
		}

		calculLestage() {
			var ppTotal = parseFloat(ObjStructTotem.masseT) + parseFloat(ObjStructTotem.masseB) + parseFloat(ObjStructTotem.masseEQ);

			dataLestageTotem.vitMetr        = round(dataLestageTotem.vitMax / 3.6,2); // B
			dataLestageTotem.pressDyn       = round((dataLestageTotem.vitMetr * dataLestageTotem.vitMetr) / 16.3,2); // C
			dataLestageTotem.pressDyn       = round(dataLestageTotem.pressDyn * 1.5,2);
			dataLestageTotem.effMat         = round(parseFloat(ObjStructTotem.hauteurT) * parseFloat(ObjStructTotem.largT) * parseFloat(HabillageStructure.coef) * parseFloat(dataLestageTotem.pressDyn),2); // D
			dataLestageTotem.momentMat      = round(dataLestageTotem.effMat * parseFloat(ObjStructTotem.hauteurT) / 2,2); // E
			dataLestageTotem.effEquip       = round(dataLestageTotem.pressDyn * parseFloat(ObjStructTotem.surfaceEQ),2); // F
			dataLestageTotem.momentEquip    = round(dataLestageTotem.effEquip * parseFloat(ObjStructTotem.hauteurCDGEQ),2); // G
			dataLestageTotem.momentRenvers  = round(dataLestageTotem.momentMat + dataLestageTotem.momentEquip,2); // H
			dataLestageTotem.momentStab     = round(ppTotal * (parseFloat(ObjStructTotem.stabB) / 2),2); // I
			dataLestageTotem.ePlusOrMin     = round(dataLestageTotem.momentStab - dataLestageTotem.momentRenvers,2); // J
			dataLestageTotem.lestage        = round(Math.abs(dataLestageTotem.ePlusOrMin) / (parseFloat(ObjStructTotem.stabB) / 2),0)// K

			if(dataLestageTotem.ePlusOrMin > 0){
				dataLestageTotem.lestage = 0;
			}

			//show the response data
			$(".input-v-tt-B").val(round(dataLestageTotem.vitMetr, 1));
			$(".input-v-tt-C").val(round(dataLestageTotem.pressDyn, 1));
			$(".input-v-tt-D").val(round(dataLestageTotem.effMat, 1));
			$(".input-v-tt-E").val(round(dataLestageTotem.momentMat, 1));
			$(".input-v-tt-F").val(round(dataLestageTotem.effEquip, 1));
			$(".input-v-tt-G").val(round(dataLestageTotem.momentEquip, 1));
			$(".input-v-tt-H").val(round(dataLestageTotem.momentRenvers, 1));
			$(".input-v-tt-I").val(round(dataLestageTotem.momentStab, 1));
			$(".input-v-tt-J").val(round(dataLestageTotem.ePlusOrMin, 1));
			$(".input-v-tt-K").val(round(dataLestageTotem.lestage));
			$(".input-v-tt-pp-totale").val(round(ppTotal));

			return dataLestageTotem;
		}

		fixeColor() {
			if (dataLestageTotem.ePlusOrMin < 0) {
				$(".input-v-t-H").css("color", "red");
			} else {
				$(".input-v-t-H").css("color", "green");
			}

			if (dataLestageTotem.lestage > 0) {
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
	function testInputTotem() {
		var stop = false;
		$("#div-input-totem>.box-calcul-obligatoire table input").each(function(i, v) {
			if (!$(v).val()) {
				alert(window.listMessageAlert.alertTotemEmptyInput);
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
	 * @param $hauteur
	 * @param $EmBCompare
	 * @returns {boolean}
	 */
	function testHauteurTotemtest($hauteur, $EmBCompare) {
		if ($hauteur < 2) {
			alert(listMessageAlert.alertTotemPetite);
			return false;
		} else if (sizeHauteur > ($EmBCompare * 5)) {
			alert(listMessageAlert.alertTotemGrande);
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
	 * @param $max
	 */
	function testLargeurBaseTotem($hauteur, $max){
		max = parseFloat($max) * 5;
		haut = parseFloat($hauteur);
        console.log("hauteur : " + $hauteur);
        console.log("max input : " + $max);
        console.log("max : " + max);
		if( haut > max){
			alert(listMessageAlert.alertBaseStabilite);
			event.stopPropagation();
			return false;
		}
		return true;
	}

});