<?php

namespace App\Users;

use App\Entity\User;
use App\Utils\Constantes;
use App\Utils\Mail;
use App\Utils\Utils;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;


/**
 * Class Users
 * @package App\Users
 *
 * INFOS :
 * 		Link pour le link confirm
 *		$link   = $_SERVER['SERVER_NAME'] . "/confirm/" . $key . $this->const::SEPARATOR_LINK_CONFIRM_MAIL . $email;
 */
class Users
{
	private $em;
	private $encoder;
	private $const;

	/**
	 * @var App\Utils\Utils
	 */
	private $util;
	private $mailer;
	private $repoUser;
	private $repoDataCalcul;

	public function __construct(EntityManagerInterface $em, UserPasswordEncoderInterface $encoder, Constantes $c, Utils $util, Mail $mailer, \Swift_Mailer $SWmailer )
	{
		$this->em             = $em;
		$this->encoder        = $encoder;
		$this->const          = $c;
		$this->util           = $util;
		$this->mailer         = $mailer;
		$this->repoUser       = $this->em->getRepository("App\Entity\User");
		$this->repoDataCalcul = $this->em->getRepository("App\Entity\DataCalcul");
	}

	/**
	 * @param $data : les datas du form inscription
	 * @return string
	 */
	public function registerNewUser($data)
	{
		try{
			$user   = new User($data);
			$prenom = $data["username"];
			$email  = $data["email"];
			$nom    = $data["fullname"];
			$pass   = $data["password"];
			$societe   = $data["societe"];


			$userRepo    = $this->em->getRepository("App\Entity\User");
			/** @var User $result */
			$result  = $userRepo->findOneBy(array('email' => $email)) ? $user : null;

			if($result != NULL){
				return $this->const::ERROR_EMAIL_EXIST;
			}


			$link   = $this->util->better_crypt($this->const::KEY_PASSWORD_HASH_STRING);
			$link 	= str_replace('/', '_', $link);
			$link 	= str_replace('%', '_', $link);

			$user->setEmail($email);
			$user->setIsActive(1);
			$user->setLinkConfirm(addslashes($link));
			$user->setPrenom($prenom);
			$user->setNom($nom);
			$user->setSociete($societe);
			$user->setRoles("ROLE_USER");
			$user->setPassword($this->util->_crypt($pass));

			$this->em->persist($user);
			$this->em->flush();
			$this->em->clear();
			$array = array('link'=>$link, 'email'=>$email);
			return $array;
		}catch (\PDOException $e){
			return $e->getMessage();
		}
	}

	/**
	 * [test if user exist from email]
	 * @return [bool] [return true if user exist]
	 */
	public function ifUserExist($mail)
	{
		$result  = $this->repoUser->findOneBy(array('email' => $mail));

		if(is_object($result))
		{
			return true;
		}else
		{
			return false;
		}
	}


	/**
	 * Return la liste des users en base
	 * @return mixed
	 */
	public function getListUser(){
		$users = $this->repoUser->createQueryBuilder('u')
			->getQuery()
			->getArrayResult();

		foreach($users as &$u){
			$this->util->delete_col($u, "password");
			$this->util->delete_col($u, "link_confirm");
		}

		return $users;
	}

	/**
	 * Renvoit la liste de toutes les structures rattachés aux calculs de l'id user
	 * @param $id
	 *
	 * @return $results (tableau structure)
	 */
	public function getAllDistinctStructFromUserCalcul($id){
		$query = $this->repoDataCalcul->createQueryBuilder('u')
			->select('u.typeStructure')
			->where('u.idUser = :id')
			->groupBy('u.typeStructure')
			->setParameter('id', $id);
		$results = $query->getQuery()->getResult();

		return $results;
	}

	public function delteUserByID($id){
		$user = $this->repoUser->findOneBy(array('id' => $id));
		if(is_object($user))
		{
			$this->em->remove($user);
			$this->em->flush();
			$this->em->clear();
		}
	}


}