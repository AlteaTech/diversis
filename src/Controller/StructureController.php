<?php


namespace App\Controller;


use App\Entity\DataCalcul;
use App\Structures\Portique;
use App\Structures\Totem;
use App\Structures\Tour;
use App\Utils\Constantes;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Constraints\Date;

class StructureController extends AbstractController
{

	public function saveCalcul(Request $request, Tour $Tour, Portique $Portique, Totem $Totem){

		$const       = new Constantes();
		$session     = $this->get('session');
		$dataSol     = $request->request->get('dataSol');
		$dataLestage = $request->request->get('dataLestage');
		$dataDo      = $request->request->get('dataDo');
		$typeStruct  = $request->request->get('typeStruct');
		$infosEvent  = $request->request->get('infosEvent');
		$infosEvent  = $infosEvent;

		if($typeStruct == $const::TYPE_TOUR){
			$Tour->saveCalculFinal($dataSol, $dataLestage, $dataDo, $infosEvent);
		}else if($typeStruct == $const::TYPE_PORTIQUE){
			$Portique->saveCalculFinal($dataSol, $dataLestage, $dataDo, $infosEvent);
		}else if($typeStruct == $const::TYPE_TOTEM){
			$Totem->saveCalculFinal($dataSol, $dataLestage, $dataDo, $infosEvent);
		}

		return new JsonResponse(array("lastInsertId" => $session->get("lastIdCalcul")));
	}

	/**
	 * @param Request $request
	 * @param EntityManagerInterface $em
	 *
	 * @return JsonResponse
	 */
	public function showCalcul(Request $request, EntityManagerInterface $em){
		$id 		= $request->request->get('iduser');
		$typeStruct = $request->request->get('typeStruct');
		$repoCalcul = $em->getRepository("App\Entity\DataCalcul");

		$query = $repoCalcul->createQueryBuilder('u')
			->where('u.idUser = :id')
			->andWhere('u.typeStructure = :typeStructure')
			->setParameter('id', $id)
			->setParameter('typeStructure', $typeStruct)
			->orderBy('u.date', 'ASC')
			->setMaxResults(15);
		$results = $query->getQuery()->getArrayResult();

		return new JsonResponse(json_encode($results , JSON_FORCE_OBJECT));
	}
}