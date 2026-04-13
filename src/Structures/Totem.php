<?php


namespace App\Structures;


use App\Entity\DataCalcul;
use App\Utils\Constantes;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class Totem
{
	private $objDO;
	private $repo;
	private $em;
	private $date;
	private $const;
	private $user;
	private $session;

	/**
	 * @var DataCalcul
	 */
	private $dataCalcul;

	/**
	 * Tour constructor.
	 *
	 * @param EntityManagerInterface $em
	 * @param TokenStorageInterface $user
	 *
	 * @throws \Exception
	 */
	public function __construct(EntityManagerInterface $em, TokenStorageInterface $user, SessionInterface $session)
	{
		$this->em = $em;
		$this->dataCalcul = new DataCalcul();
		$this->date = new \DateTime();
		$this->const = new Constantes();
		$this->user = $user;
		$this->session = $session;
	}

	public function setRepo($repo){
		$this->repo = $repo;
	}

	public function saveCalculFinal($dataSol, $dataLestage, $dataDo, $infosEvent){

		$session   		  = $this->session;
		$this->objDO      = json_encode($dataDo);
		$this->objLestage = json_encode($dataLestage);
		$this->objSol     = json_encode($dataSol);
		$idUser           = $this->user->getToken()->getUser()->getId();

		$this->dataCalcul->setDate($this->date);
		$this->dataCalcul->setTypeStructure($this->const::TYPE_TOTEM);

		$this->dataCalcul->setCalculDo($this->objDO);
		$this->dataCalcul->setCalculLestage($this->objLestage);
		$this->dataCalcul->setCalculSol($this->objSol);

		$this->dataCalcul->setIdUser($idUser);
		$this->dataCalcul->setEvenement($infosEvent['nameEvent']);;
		$this->dataCalcul->setDenomination($infosEvent['nameStruct']);

		$session->set("formeTotem", $infosEvent["formeStruct"]);

		$this->em->persist($this->dataCalcul);
		$this->em->flush();
		$this->em->clear();

		$lastId = $this->dataCalcul->getId();
		$session->set('lastIdCalcul', $lastId);

	}

}