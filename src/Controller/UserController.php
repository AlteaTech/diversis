<?php
namespace App\Controller;

use App\Users\Users;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class UserController extends AbstractController
{
	/**
	 * @return mixed list of users
	 */
	public function getListUser(Users $user){
		return new JsonResponse($user->getListUser());
	}

	/**
	 *
	 */
	public function getStructureFromUser(Request $request, Users $user){
		$idUser = $request->request->get('iduser');
		$tabStruct = $user->getAllDistinctStructFromUserCalcul($idUser);
		return new JsonResponse(json_encode($tabStruct));
	}

	/**
	 *
	 */
	public function delteUserByID(Request $request, Users $user){
		$idUser = $request->request->get('iduser');
		$user->delteUserByID($idUser);
		return new Response("true");
	}
}