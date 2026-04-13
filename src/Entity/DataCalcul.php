<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * DataCalcul
 *
 * @ORM\Table(name="data_calcul", uniqueConstraints={@ORM\UniqueConstraint(name="id_user", columns={"id_user"})})
 * @ORM\Entity
 */
class DataCalcul
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="type_structure", type="string", length=100, nullable=false)
     */
    private $typeStructure;

    /**
     * @var string
     *
     * @ORM\Column(name="type_calcul", type="string", length=100, nullable=false)
     */
    private $typeCalcul;

    /**
     * @var string
     *
     * @ORM\Column(name="calcul_do", type="text", nullable=false)
     */
	private $calculDo;

	/**
     * @var string
     *
     * @ORM\Column(name="calcul_lestage", type="text", nullable=false)
     */
	private $calculLestage;

	/**
     * @var string
     *
     * @ORM\Column(name="calcul_sol", type="text", nullable=false)
     */
	private $calculSol;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="datetime", nullable=false)
     */
    private $date;

    /**
     * @var int
     *
     * @ORM\Column(name="id_user", type="integer", nullable=false)
     */
    private $idUser;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="nom_evenement", type="string", length=250, nullable=false)
	 */
	private $evenement;

	/**
	 * @var string
	 *
	 * @ORM\Column(name="denomination", type="string", length=250, nullable=false)
	 */
	private $denomination;

	public function getId(){
		return $this->id;
	}

	public function getTypeStructure(){
		return $this->typeStructure;
	}

	public function setTypeStructure($typeStructure){
		$this->typeStructure = $typeStructure;
	}

	public function getTypeCalcul(){
		return $this->typeCalcul;
	}

	public function setTypeCalcul($typeCalcul){
		$this->typeCalcul = $typeCalcul;
	}

	public function getDate(){
		return $this->date;
	}

	public function setDate($date){
		$this->date = $date;
	}

	public function getIdUser(){
		return $this->idUser;
	}

	public function setIdUser($idUser){
		$this->idUser = $idUser;
	}

	/**
	 * @return string
	 */
	public function getEvenement(): string
	{
		return $this->evenement;
	}

	/**
	 * @param string $evenement
	 */
	public function setEvenement(string $evenement): void
	{
		$this->evenement = $evenement;
	}

	/**
	 * @return string
	 */
	public function getDenomination(): string
	{
		return $this->denomination;
	}

	/**
	 * @param string $denomination
	 */
	public function setDenomination(string $denomination): void
	{
		$this->denomination = $denomination;
	}

	/**
	 * @return string
	 */
	public function getCalculDo(): string
	{
		return $this->calculDo;
	}

	/**
	 * @param string $calculDo
	 */
	public function setCalculDo(string $calculDo): void
	{
		$this->calculDo = $calculDo;
	}

	/**
	 * @return string
	 */
	public function getCalculLestage(): string
	{
		return $this->calculLestage;
	}

	/**
	 * @param string $calculLestage
	 */
	public function setCalculLestage(string $calculLestage): void
	{
		$this->calculLestage = $calculLestage;
	}

	/**
	 * @return string
	 */
	public function getCalculSol(): string
	{
		return $this->calculSol;
	}

	/**
	 * @param string $calculSol
	 */
	public function setCalculSol(string $calculSol): void
	{
		$this->calculSol = $calculSol;
	}

}
