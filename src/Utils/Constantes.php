<?php

namespace App\Utils;


class Constantes
{

    const VERSION_INI = "1.2.4";
    const KEY_PASSWORD_HASH_STRING = "KDI8U2JHDY68*o_-YAG--676";
    const SEPARATOR_LINK_CONFIRM_MAIL = "@$*!]_-";

    const MESSAGE_INACTIF_USER = "Votre compte est inactif, veuillez confirmer votre compte via le lien de confirmation envoyé par email.";
    const MESSAGE_UNEXIST_USER = "Votre compte n'éxiste pas. Merci de passer par le formulaire d'inscription, via l'onglet au-dessus.";
    const MESSAGE_BADPASS_USER = "La combinaison Login + mot de passe n'éxiste pas.";
    const MESSAGE_POSSIBLE_CONNEXION = "Vous pouvez maintenant vous connecter.";
    const MESSAGE_EMAIL_EXISTANT = "Cette email existe déjà dans la base.";

    const TYPE_CALCUL_LESTAGE = "lestage";
    const TYPE_CALCUL_SOL = "sol";
    //ce sont les données que l'on renseignent au préalablre d'un calcul. poids, hauteur, etc...
	const TYPE_CALCUL_DATA_OBLIGATOIRE = "DO";

	const TYPE_PORTIQUE = "portique";
	const TYPE_TOUR = "tour";
	const TYPE_TOTEM = "totem";

	const TYPE_CALE_CIRC = "circulaire";

	const ERROR_EMAIL_EXIST = "email_exist";
}