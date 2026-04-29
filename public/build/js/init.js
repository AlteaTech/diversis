var origin = window.location.href;
var pathName = window.location.pathname;
var hostName = window.location.hostname;

var listMessageAlert = {
	alertPortiqueSizePetit : "La hauteur totale ne peut pas être inférieur à 2 mètres.",
	alertPortiqueSizeGrand : "La hauteur totale ne peut pas excéder 6 mètres.",
	alertPortiqueEmptyInput : "Remplir toutes les informations principales avant.",
	alertPortiqueEmptyEvent : "Veuillez saisir le nom de l'évenement ainsi que la dénomination de la structure.",
	alertTourEmptyInput : "Remplir toutes les informations principales de la tour avant de continuer.",
	alertPortiqueOuvertunePetit : "L'ouverture minimum doit être de 1 fois la hauteur totale",
	alertPortiqueOuvertureGrand : "L'ouverture maximum doit être de 3 fois la hauteur totale",
	alertSaisiIncorrect : "La saisie est incorrect, vous devez saisir la vitesse",
	alertTourPetite : "La hauteur est de deux mètres minimum.",
	alertTourGrande : "La hauteur est trop grande par rapport à l'embase.",
	alertNoCocheCale : "Vous devez choisir au moins un type de cale, et saisir sa mesure.",
	alertLargLongDiam : "Vous devez saisir les dimensions des cales",
	alertLongDiam : 'Vous devez saisir le diamètre.',
	alertTotemEmptyInput : 'Vous devez saisir toutes les informations principales comme la hauteur, la masse, la face et la profondeur du totem',
	alertMaxHauteur : 'La hauteur total ne doit pas dépasser 12 mètres',
	alertLestageObligatoire : 'Veuillez faire le calcul du lestage an amont',
	alertFullCallRectangulaireObligatoire : 'Vous devez saisir la longueur ainsi que la largeur pour la cale',
	alertLargeurTropPetite : 'La hauteur ne peut pas être supérieur à 5 fois la plus petite dimension de la base',
    alertBaseStabilite : 'La hauteur ne peut pas être supérieur à 5 fois la base de stabilité',
	alertLargeurTropPetiteTotem : 'La hauteur ne peut pas être supérieur à 5 fois la plus petite dimension de la cale'
}

var pourcentSpriteBackgroudPositionY     = 33.455;
var pourcentSpritePontBackgroudPositionY = 33.45;
var portiqueePontMiddlePositionX = - 700;
var portiquePontMaxPositionX = - 1385;

var ObjStructPortique = null;
var ObjPressionSol = null;
var ObjLestagePortique = null;

var saveVitesseBefore200 = "";

const typeStruct = {
	tour : 'tour',
	portique : 'portique',
	totem : 'totem'
}

const typeCalcul = {
	do : 'DO',
	lestage : 'lestage',
	sol : 'sol'
}

const typeAction = {
	users : 'users'
}

const typePortique = {
	pont : "pont",
	echaf : "echaf"
}

const typeCale = {
	rec : "rectangulaire",
	cir : "circulaire"
}

var coef = {
	nu : 0.3,
	habil : 1
}

var infosEventPortique = {
	nameEvent : '',
	nameStruct : '',
}

var infosEventTour = {
	nameEvent : '',
	nameStruct : '',
}

var infosEventTotem = {
	nameEvent : '',
	nameStruct : '',
	formeStruct : '',
}

var typeStatusProfil = {
	low : 'Bas niveau',
	hight : 'Admin'
}

/**
 *
 * @type {{coef: number, type: string}}
 */
var HabillageStructure = {
	type: 'pont',
	coef: parseFloat(0.3)
}

/**
 *
 * @type {{chargePied: string, typeCale: string, diametre: string, pressionParPied: string, surfaceCale: string}}
 */
var dataPressionSolPortique = {
	typeCale : '',
	diametreLargeur : '',
	diametreLongueur : '',
	chargePied : '',
	surfaceCale : '',
	pressionParPied : ''
}

var dataLestagePortique = {
	vitMax     : '',
	vitMetr    : '',
	pressDyn   : '',
	effTour    : '',
	effPass    : '',
	mRenvers   : '',
	mStab      : '',
	ePlusOrMin : '',
	lestage    : ''
}

/**
 *
 * @type {{chargePied: string, typeCale: string, diametre: string, pressionParPied: string, surfaceCale: string}}
 */
var dataPressionSolTotem  = {
	typeCale: '',
	diametreLargeur: '',
	diametreLongueur: '',
	chargePied: '',
	surfaceCale: '',
	pressionParPied: ''
}

/**
 * @var dataLestageTotem
 * @type {{lestage: string, momentEquip: string, vitMetr: string, momentStab: string, effEquip: string, vitMax: string, momentMat: string, pressDyn: string, momentRenvers: string, effMat: string, ePlusOrMin: string}}
 */
var dataLestageTotem = {
	vitMax: '',
	vitMetr: '',
	pressDyn: '',
	effMat: '',
	effEquip:'',
	momentMat: '',
	momentEquip: '',
	momentRenvers: '',
	momentStab: '',
	ePlusOrMin: '',
	lestage: '',
	coef: '',

}

/**
 *
 * @type {{chargePied: string, typeCale: string, diametre: string, pressionParPied: string, surfaceCale: string}}
 */
var dataPressionSolTour = {
	typeCale: '',
	diametreLargeur: '',
	diametreLongueur: '',
	chargePied: '',
	surfaceCale: '',
	pressionParPied: ''
}

var dataLestageTour = {
	vitMax: '',
	vitMetr: '',
	pressDyn: '',
	effTour: '',
	effPass: '',
	mRenvers: '',
	mStab: '',
	ePlusOrMin: '',
	lestage: '',
	coef: '',
}

var StructureTour = function($h, $m, $f, $p) {
	this.hauteur = parseFloat($h),
	this.masse = parseFloat($m),
	this.face = parseFloat($f),
	this.profond = parseFloat($p)
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
var StructurePortique = function($ht, $hp, $m, $f, $pr, $o){
	this.hauteurT = parseFloat($ht),
	this.hauteurP = parseFloat($hp),
	this.masse   = parseFloat($m),
	this.face    = parseFloat($f),
	this.profond = parseFloat($pr),
	this.ouverture = parseFloat($o)
}


/**
 * @var StructureTotem
 * @param $ht
 * @param $mt
 * @param $lt
 * @param $hcdgt
 * @param $hcdgeq
 * @param $seq
 * @param $meq
 * @param $sb
 * @param $mb
 * @constructor
 */
var StructureTotem = function($ht, $mt, $lt, $hcdgt, $hcdgeq, $seq, $meq, $sb, $mb) {
	this.hauteurT = parseFloat($ht),
	this.masseT = parseFloat($mt),
	this.largT = parseFloat($lt),
	this.hauteurCDGT = parseFloat($hcdgt),
	this.hauteurCDGEQ = parseFloat($hcdgeq),
	this.surfaceEQ = parseFloat($seq),
	this.masseEQ = parseFloat($meq),
	this.stabB = parseFloat($sb),
	this.masseB = parseFloat($mb)
}

var profilUser = {
	id : ''
}

