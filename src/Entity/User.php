<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Table(name="user")
 * @UniqueEntity(fields="email")
 * @ORM\Entity()
 */
class User implements UserInterface, \Serializable {

	/**
	 * @ORM\Id
	 * @ORM\Column(type="integer")
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	private $id;


	/**
	 * @ORM\Column(name="prenom", type="string")
	 */
	private $nom;

	/**
	 * @ORM\Column(name="nom", type="string")
	 */
	private $prenom;

	/**
	 * @ORM\Column(name="societe", type="string")
	 */
	private $societe;

	/**
	 * @ORM\Column(type="string", length=255, unique=true)
	 * @Assert\NotBlank()
	 * @Assert\Email(
	 *     message = "The email '{{ value }}' is not a valid email.",
	 *     checkMX = true
	 * )
	 */
	private $email;

	/**
	 * @Assert\NotBlank()
	 * @Assert\Length(max=250)
	 */
	private $plainPassword;

	/**
	 * The below length depends on the "algorithm" you use for encoding
	 * the password, but this works well with bcrypt.
	 *
	 * @ORM\Column(type="string", length=64)
	 */
	private $password;

	/**
	 * @ORM\Column(name="is_active", type="boolean")
	 */
	private $isActive;

	/**
	 * @ORM\Column(name="roles", type="string")
	 */
	private $roles;

	/**
	 * @ORM\Column(name="link_confirm", type="string")
	 */
	private $link_confirm;

	public function __construct() {
	}

	public function getUsername() {
		return $this->email;
	}

	public function getSalt() {
		// you *may* need a real salt depending on your encoder
		// see section on salt below
		return null;
	}

	public function getPassword() {
		return $this->password;
	}

	public function setPassword($password) {
		$this->password = $password;
	}

	public function setRoles($roles) {
		$this->roles = $roles;
	}

	public function getRoles() {
		if (empty($this->roles)) {
			return ['ROLE_USER'];
		}
		return $this->roles;
	}

	function addRole($role) {
		$this->roles[] = $role;
	}

	public function eraseCredentials() {

	}

	/** @see \Serializable::serialize() */
	public function serialize() {
		return serialize(array(
			$this->id,
			$this->email,
			$this->password,
			$this->isActive,
			$this->nom,
			$this->prenom,
			$this->link_confirm,
			$this->societe,
			// see section on salt below
			// $this->salt,
		));
	}

	/** @see \Serializable::unserialize() */
	public function unserialize($serialized) {
		list (
			$this->id,
			$this->email,
			$this->password,
			$this->isActive,
			$this->nom,
			$this->prenom,
			$this->link_confirm,
			$this->societe,
			// see section on salt below
			// $this->salt
			) = unserialize($serialized);
	}

	public function getId() {
		return $this->id;
	}

	public function getEmail() {
		return $this->email;
	}

	public function getPlainPassword() {
		return $this->plainPassword;
	}

	public function getIsActive() {
		return $this->isActive;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function setEmail($email) {
		$this->email = $email;
	}

	public function setPlainPassword($plainPassword) {
		$this->plainPassword = $plainPassword;
	}

	public function setIsActive($isActive) {
		$this->isActive = $isActive;
	}

	public function getLinkConfirm() {
		return $this->link_confirm;
	}

	public function setLinkConfirm($link_confirm) {
		$this->link_confirm = $link_confirm;
	}

	public function getNom(){
		return $this->nom;
	}

	public function setNom($nom){
		$this->nom = $nom;
	}

	public function getSociete(){
		return $this->societe;
	}

	public function setSociete($societe){
		$this->societe = $societe;
	}

	public function getPrenom(){
		return $this->prenom;
	}

	public function setPrenom($prenom){
		$this->prenom = $prenom;
	}

}