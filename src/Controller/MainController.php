<?php
namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Spipu\Html2Pdf\Html2Pdf;

class MainController extends AbstractController
{
	/**
	 * @return Response / route redirect
	 */
	public function index(Request $request)
	{
		try {
			$em        = $this->getDoctrine()->getManager();
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

	public function init()
	{
		return Response("Hello ma chère.");
	}

	public function test()
	{
		$html2pdf = new Html2Pdf();
		$html2pdf->writeHTML($this->renderView('pdf/pdf.html.twig'));
		return $html2pdf->output();
	}
}