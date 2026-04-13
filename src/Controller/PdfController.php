<?php
namespace App\Controller;

use App\Entity\DataCalcul;
use App\Utils\Constantes;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Bundle\SnappyBundle\Snappy\Response\PdfResponse;
use Knp\Snappy\GeneratorInterface;
use Knp\Snappy\Pdf;
use Mpdf\Mpdf;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Spipu\Html2Pdf\Html2Pdf;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class PdfController extends AbstractController
{
	private $sizeStructure;
	/**
	 * @return Response / route redirect
	 */
	public function index(Request $request)
	{
		try {
			$em = $this->getDoctrine()->getManager();
			$em->getConnection()->connect();
			$connected = $em->getConnection()->isConnected();
			if($connected)
			{
				$securityContext = $this->container->get('security.authorization_checker');
				if ($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
					return $this->redirectToRoute('panel_admin');
				}
				return $this->redirectToRoute('login');
			}else
			{
				return new Response("Impossible de se connecter à la base de données.");
			}
		} catch (\Exception $e) {
			echo "connexion BDD impossible, verifier les infos.";die;
		}
	}

	/**
	 * @param $idPDF
	 * @param Request $request
	 * @param EntityManagerInterface $em
	 * @param TokenStorageInterface $user
	 *
	 * @return Response
	 * @throws \Mpdf\MpdfException
	 */
	public function showPDF( $idPDF, Request $request, EntityManagerInterface $em, TokenStorageInterface $user, SessionInterface $session)
	{
		$idCalcul = $idPDF;
		$habille  = 0;
		$html2pdf = new Mpdf();
		$date     = new \DateTime();
		$calcRepo = $this->getDoctrine()->getRepository(DataCalcul::class);
		$user   = $user->getToken()->getUser();
		if($user == "anon."){
			return new Response("Vous n'êtes pas authorisé.");
		}
		$id     = $user->getId();
		$auteur = $user->getPrenom() . " " . $user->getNom();
		$email  = $user->getEmail();
		$dataResult = $calcRepo->findOneBy(['id' => $idCalcul]);
		$idUserFromCalcul = $dataResult->getIdUser();
		if($id != $idUserFromCalcul){
			return new Response("Vous n'êtes pas authorisé.");
		}

		$typeStruct = $dataResult->getTypeStructure();
		$denoStruct = $dataResult->getDenomination();
		$nomEvent   = $dataResult->getEvenement();

		$html2pdf->SetTitle($denoStruct);
		$dataLestage   = json_decode($dataResult->getCalculLestage());
		$vitesseVent = $dataLestage->vitMax;

		$listData   = $this->getListData($dataResult);
		$listResult = $this->getListResult($dataResult);
		$listConclu = $this->getListConclu($dataResult);

		if($dataLestage->coef >= 1){
			$habille = 1;
		}

		$dataDo  = json_decode($dataResult->getCalculDo());
		//dd($dataDo);
		$typePortique = "";
		if(isset($dataDo->typeStruct)){
			$typePortique = $dataDo->typeStruct;
		}

		//totem triangle ou carre
		$formeTotem = $session->get("formeTotem");
		
		$html2pdf = new Mpdf();
		$html2pdf->writeHTML($this->render('pdf/pdf.html.twig',array(
			'nom_struct' 		=> $denoStruct,
			'nom_event' 		=> $nomEvent,
			'date' 				=> $date->format('d/m/Y'),
			'auteur' 			=> $auteur,
			'email' 			=> $email,
			'listData' 			=> $listData,
			'listResult'		=> $listResult,
			'listConclu'		=> $listConclu,
			'typeStruct' 		=> $typeStruct,
			'vitesseVent'		=> $vitesseVent,
			'habille'  			=> $habille,
			'typePortique'		=> $typePortique,
			'sizeStructure'		=> $this->sizeStructure,
			'formeTotem' 		=> $formeTotem,
		)));

		$html2pdf->SetAlpha(0.2);
		$html2pdf->Image('http://diversis.fr/wp-content/uploads/2019/03/1441114107.jpg',30,130,160);
		//$html2pdf->WriteHTML('<img class="box-filigrame" src="http://diversis.fr/wp-content/uploads/2019/03/1441114107.jpg" alt="logo diversis"/>');
		$html2pdf->SetAlpha(1);

		$html2pdf->output($denoStruct.'.pdf', 'I');

	}

	/**
	 * @param $dataResult
	 *
	 * @return array|false|string
	 */
	public function getListData($dataResult){
		$const         = new Constantes();
		$result        = array();
		$dataDo        = json_decode($dataResult->getCalculDo());
		$dataLestage   = json_decode($dataResult->getCalculLestage());
		$dataSol       = json_decode($dataResult->getCalculSol());
		$typeStructure = $dataResult->getTypeStructure();
		if($typeStructure == $const::TYPE_PORTIQUE){
			$habille = $dataLestage->coef > 0.6 ? "oui" : "non";
			$dimensionCale = $dataSol->typeCale == $const::TYPE_CALE_CIRC ? $dataSol->diametreLongueur." cm (diamètre)" : $dataSol->diametreLargeur." cm X ".$dataSol->diametreLongueur." cm";
			$this->calculSizeStructure($dataDo->ouverture,$typeStructure);
			$result = array("Type de structure :" => $typeStructure,
				"Dimension de base :" => array(
					"Hauteur :" => $dataDo->hauteurT." m",
					"Largeur totale :" => $dataDo->face." m",
					"Ouverture :" => $dataDo->ouverture." m",
					"Profondeur :" => $dataDo->profond." m",
				),
				"Poids propre estimé :" => $dataDo->masse." kg",
				"Habillage :" => $habille,
				"Vitesse de vent limite en exploitation : " => $dataLestage->vitMax." km/h",
				"Dimension des cales :" => $dimensionCale
			);
			$result = (array) $result;
		}
		else if($typeStructure == $const::TYPE_TOUR){
			$habille       = $dataLestage->coef > 0.6 ? "oui" : "non";
			$dimensionCale = $dataSol->typeCale == $const::TYPE_CALE_CIRC ? $dataSol->diametreLongueur . " cm (diamètre)" : $dataSol->diametreLargeur . " cm X " . $dataSol->diametreLongueur . " cm";
			$this->calculSizeStructure($dataDo->hauteur,$typeStructure);
			$result = array(
				"Type de structure :" => $typeStructure,
				"Dimension de base :" => array(
					"Hauteur :" => $dataDo->hauteur . " m",
					"Largeur totale :" => $dataDo->face . " m",
					"Profondeur :" => $dataDo->profond . " m",
				),
				"Poids propre estimé :" => $dataDo->masse . " kg",
				"Habillage :" => $habille,
				"Vitesse de vent limite en exploitation :" => $dataLestage->vitMax . " km/h",
				"Dimension des cales :" => $dimensionCale
			);
			$result = (array)$result;
		}
		else if($typeStructure == $const::TYPE_TOTEM){
			$habille       = $dataLestage->coef > 0.6 ? "oui" : "non";
			$dimensionCale = $dataSol->typeCale == $const::TYPE_CALE_CIRC ? $dataSol->diametreLongueur . " cm (diamètre)" : $dataSol->diametreLargeur . " cm X " . $dataSol->diametreLongueur . " cm";
			$this->calculSizeStructure($dataDo->hauteurT,$typeStructure);
			$result = array(
				"Type de structure :" => $typeStructure,
				"Dimension de base :" => array(
					"Hauteur :" => $dataDo->hauteurT . " m",
					"Largeur totale :" => $dataDo->largT . " cm",
				),
				"Poids propre estimé :" => $dataDo->masseT . " kg",
				"Habillage :" => $habille,
				"Vitesse de vent limite en exploitation :" => $dataLestage->vitMax . " km/h",
				"Dimension des cales :" => $dimensionCale,
				"Equipement en hauteur :" => array(
					"Surface :" => $dataDo->surfaceEQ . " m",
					"Poids :" => $dataDo->masseEQ . " kg",
					"Hauteur centre de gravité :" => $dataDo->hauteurCDGEQ . " m",
				),
			);
			$result = (array)$result;
		}
		return $result;
	}

	public function getListResult($dataResult){
		$const         = new Constantes();
		$result        = array();
		$dataDo        = json_decode($dataResult->getCalculDo());
		$dataLestage   = json_decode($dataResult->getCalculLestage());
		$dataSol       = json_decode($dataResult->getCalculSol());
		$typeStructure = $dataResult->getTypeStructure();
		if($typeStructure == $const::TYPE_PORTIQUE || $typeStructure == $const::TYPE_TOUR){
			$poidParPiedLestage = $dataLestage->lestage . " kg" . " par pied soit ". $dataLestage->lestage * 2 ." kg en tout";
			if($typeStructure == $const::TYPE_TOUR){
				$poidParPiedLestage = $dataLestage->lestage . " kg en tout";
			}
			$result = array(
				"lestage" => $poidParPiedLestage ,
				"charge" => intval($dataSol->chargePied) . " kg",
				"pression" => $dataSol->pressionParPied . " bar(s)"
			);

			$result = (array) $result;
		}else if($typeStructure == $const::TYPE_TOTEM){

			$result = array(
				"lestage" => $dataLestage->lestage . " kg en tout" ,
				"charge" => intval($dataSol->chargePied) . " kg",
				"pression" => $dataSol->pressionParPied . " bar(s)"
			);

			$result = (array) $result;
		}
		return $result;
	}

	public function getListConclu($dataResult){

		$const         = new Constantes();
		$result        = array();
		$dataLestage   = json_decode($dataResult->getCalculLestage());
		$dataSol       = json_decode($dataResult->getCalculSol());
		$typeStructure = $dataResult->getTypeStructure();
		if($typeStructure == $const::TYPE_PORTIQUE || $typeStructure == $const::TYPE_TOUR || $typeStructure == $const::TYPE_TOTEM){

			$result = array(
				"lestage" => $dataLestage->lestage. " kg",
				"vent" => $dataLestage->vitMax . " km/h",
				"pression" => $dataSol->pressionParPied . " bar(s)"
			);

			$result = (array) $result;
		}
		return $result;
	}

	public function calculSizeStructure($taille,$typeStructure)
	{
		//défini la taille de la structure.
		$const = new Constantes();
		if ($typeStructure == $const::TYPE_PORTIQUE){
			if ($taille >= 0 && $taille <= 3) {
				$this->sizeStructure = 1;
			} else if ($taille >= 4 && $taille <= 5) {
				$this->sizeStructure = 2;
			} else {
				$this->sizeStructure = 3;
			}
		}else if($typeStructure == $const::TYPE_TOUR){
			if ($taille >= 0 && $taille <= 2) {
				$this->sizeStructure = 1;
			} else if ($taille >= 3 && $taille <= 4) {
				$this->sizeStructure = 2;
			} else if($taille >= 5 && $taille <= 6){
				$this->sizeStructure = 3;
			}else {
				$this->sizeStructure = 4;
			}
		}else if($typeStructure == $const::TYPE_TOTEM){
			if ($taille >= 0 && $taille <= 4) {
				$this->sizeStructure = 1;
			} else {
				$this->sizeStructure = 2;
			}
		}
	}
}