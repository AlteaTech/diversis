<?php
namespace App\Utils;




class Mail
{

	private $mailer;
	private $twig;

	public function __construct(\Swift_Mailer $mailer)
	{
		$this->mailer = $mailer;
	}

	/**
	 * [send_mail_confirm description]
	 * @param  [type] $object [description]
	 * @param  [type] $from   [description]
	 * @param  [type] $to     [description]
	 * @return [type]         [description]
	 */
	function send_mail_confirm($email, $link, $body)
	{
		//SURCHARGE
		$this->to = $email;
		$message = (new \Swift_Message('[Confirmation] Inscription Diversis'))
			->setFrom("registration@diversis.com")
			->setTo($this->to)
			->setBody(
				$body,
				'text/html' // Mark the content-type as HTML,
			)
			/*
			 * If you also want to include a plaintext version of the message
			->addPart(
				$this->renderView(
					'emails/registration.txt.twig',
					['name' => $name]
				),
				'text/plain'
			)
			*/
		;
		$this->mailer->send($message);
	}
}

