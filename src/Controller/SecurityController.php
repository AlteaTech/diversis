<?php

namespace App\Controller;

use App\Entity\User;
use App\Users\Users;
use App\Utils\Mail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use App\Utils\Utils;
use App\Utils\Constantes;
use App\Utils\UserConnected;
use App\Forms\RegistrationForm;

class SecurityController extends AbstractController
{
	private $linkMail;
	/**
	 * Test si l'user exist, ou s'il est inactif
	 *
	 * @param Request $request
	 *
	 * @return Response
	 */
    public function testUser(Request $request, \Swift_Mailer $SWmailer, Mail $mail)
    {
        $const     = new Constantes();
        $session   = $this->get('session');
        $em        = $this->getDoctrine()->getEntityManager();
        $email     = $request->request->get("_username");
        $pass      = $request->request->get("_password");
        $stateConn = $this->getLogged($em,$email,$pass,$request);

        if($stateConn == "success")
        {
            $session->set('logged', true);
            $session->set('email', $email);
            $message = $stateConn;
        }
        else if($stateConn == "error_2")
        {
            $session->set('logged', false);
            $message = $const::MESSAGE_INACTIF_USER;

			$linkMailConfirm   = $_SERVER['HTTP_HOST'] . "/confirm/" . $this->linkMail . $const::SEPARATOR_LINK_CONFIRM_MAIL . $email;

			$mail->send_mail_confirm($email, $linkMailConfirm, $this->renderView('email/registration-confirm.html.twig', array('link_confirm'=>$linkMailConfirm)));
        }
        else if($stateConn == "error_1")
		{
			$session->set('logged', false);
			$message = $const::MESSAGE_BADPASS_USER;
		}
        else
        {
            $session->set('logged', false);
            $message = $const::MESSAGE_UNEXIST_USER;
        }

        return new Response($message);
}
    /**
     * [Authentification]
     * @param  Request             $request
     * @param  AuthenticationUtils $authenticationUtils
     * @return [render] OR [redirectToRoute]
     */
    public function login(AuthenticationUtils $authUtils, Request $request, Users $user, Mail $mail )
	{
        $form          = $this->createForm(RegistrationForm::class);
		$util          = new Utils;
		$erreurCatched = "";
		$secret        = "6Lc6psAsAAAAAE9pCw8gun4Tw129eTD28mhlmitz";
		$response      = null;
		$userIP        = $_SERVER["REMOTE_ADDR"];
		$const		   = new Constantes();
		$form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid())
        {
            $captchaResponse = $request->request->get("g-recaptcha-response");
            $userIP = $_SERVER["REMOTE_ADDR"];
            $url = "https://www.google.com/recaptcha/api/siteverify?secret=$secret&response=$captchaResponse&remoteip=$userIP";
            $responseAPI = file_get_contents($url);
            $responseAPITMP = json_decode($responseAPI);

            //debug inscription
			//$responseAPITMP = (object)array('success' => true);
            if ($responseAPITMP != null && $responseAPITMP->success){
                if(!$form->getData())
                {
                    goto retour;
                }
                try{
                    $exist = $user->registerNewUser($form->getData());
                    if($exist == $const::ERROR_EMAIL_EXIST){

						return $this->render('security/login.html.twig', [
							'registrationForm' => $form->createView(),
							'message_conn' => $const::MESSAGE_EMAIL_EXISTANT,
							'is_authen_form' => 0
						]);
					}

					//envoyer le mail de confirmation d'inscription
					$linkMailConfirm   = $_SERVER['HTTP_HOST'] . "/confirm/" . $exist["link"] . $const::SEPARATOR_LINK_CONFIRM_MAIL . $exist["email"];

                    $mail->send_mail_confirm($exist["email"], $linkMailConfirm, $this->renderView('email/registration-confirm.html.twig', array('link_confirm'=>$linkMailConfirm)));

				}catch (\Exception $e){
                    $erreurCatched = "L'utilisateur existe déjà.";
                }
                return $this->render('security/login.html.twig', [
                    'registrationForm' => $form->createView(),
                    'message_conn' => "",
                    'is_authen_form' => 0
                    ]);
            }
            
            return $this->render('security/login.html.twig', [
                'registrationForm' => $form->createView(),
                'message_conn' => "Problème de recaptcha",
                'is_authen_form' => 1,
            ]);
            
        }
    retour:
        return $this->render('security/login.html.twig', [
                            'registrationForm' => $form->createView(),
                            'is_authen_form' => 0,
        ]);
    }

    /**
     * 
     */
    public function confirm(Request $request, $key)
    {
        try {
			$form = $this->createForm(RegistrationForm::class);
            $const   = new Constantes();

            //$em      = $this->getDoctrine()->getEntityManager();
            $expl    = explode($const::SEPARATOR_LINK_CONFIRM_MAIL, $key);
            $key     = $expl[0];
            $mail    = $expl[1];

            if($this->keyFromMailConfirmExsit($mail, $key))
            {
                return $this->render('security/login.html.twig', [
                                    'last_username' => $mail,
                                    'message_conn' => $const::MESSAGE_POSSIBLE_CONNEXION,
									'registrationForm' => $form->createView(),
                ]);
            }else
            {
                $error = 'la clé ne correpond pas au mail';
                return $this->render('security/login.html.twig', [
                                    'last_username' => '',
                                    'message_conn' => $error,
									'registrationForm' => $form->createView(),
                ]);
            }
        }catch (Exception $e) {
            $error = $e->getMessage();
            return $this->render('security/login.html.twig', [
                                'last_username' => '',
                                'message_conn' => $error,
								'registrationForm' => $form->createView(),
            ]);
        }
    }

    /**
     * [User exist ? or not ?]
     * @param  [type] $em
     * @param  [type] $username
     * @param  [type] $pass
     * @param  [type] $request
     * @return [type]
     */
    private function getLogged($em,$username,$pass,$request)
    {
        try {
            $session = $this->get('session');
            $user    = $this->getDoctrine()->getRepository("App\Entity\User");
            /** @var User $result */
            $result  = $user->findOneBy(array('email' => $username));
            $util    = new Utils();
            if(is_object($result))
            {
				//if the password entered is the same like the password verify from database
               	if(password_verify($pass, $result->getPassword())) {
                    $role  = (array)$result->getRoles();
                    $session->set('role', $role);
                    $this->linkMail = $result->getLinkConfirm();
                    if($result->getIsActive() == 0)
                    {
                        $session->set("error_auth", "user_unactive");
                        return "error_2";
                    }
                    $token = new UsernamePasswordToken($result, $pass, "main", $role);
                    $this->get("security.token_storage")->setToken($token);
                    $session->set("role", $role);
                    return "success";
               	}else{
					$session->set("error_auth", "bad_password");
					return "error_1";
				}
            }
            else
            {
                $session->set("error_auth", "bad_password");
				return false;
            }
        } catch (\PDOException $e) {
            $session->set("error_auth", "PLS");
            return false;
        }catch (Exception $e) {
            $session->set("error_auth", "PLS");
            return false;
        }
    }

    /**send_mail_confirm
     * [logout description]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function logout(Request $request)
    {
        $session = $this->get('session');
        $this->get('security.token_storage')->setToken(null);
        $session->clear();
        return $this->redirectToRoute("loginD");
    }

    public function keyFromMailConfirmExsit($mail, $key)
    {
        $em      = $this->getDoctrine()->getEntityManager();
        $repo    = $this->getDoctrine()->getRepository("App\Entity\User");
        $user  = $repo->findOneBy(array('email' => $mail, 'link_confirm' => $key));

        if(is_object($user))
        {
            $user->setIsActive(1);
            $em->persist($user);
            $em->flush();
            $em->clear();
            return true;
        }else
        {
            return false;
        }
    }
}
