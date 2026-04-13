<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Utils\Utils;
use App\Utils\Constantes;

class AdminController extends AbstractController
{

	public function index(Request $request)
	{
		$session = $this->get('session');
		$mail    = $session->get("email");
		$role    = $session->get("role");
		$logged  = $session->get("logged") != null ? $session->get("logged") : "";
		$user 	 = $this->get("security.token_storage")->getToken()->getUser();

		if (!is_object($user) && !$logged) {
	    	return $this->redirectToRoute("login");
		}

		return $this->render('admin/pannel.html.twig',
		[
			"mail" => $mail,
			"role" => $role[0]
		]);
	}
}