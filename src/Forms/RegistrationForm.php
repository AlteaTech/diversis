<?php

namespace App\Forms;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Validator\Constraints\Email;
use App\Utils\Utils;

class RegistrationForm extends AbstractType
{
    private $encoder;
    private $u;

    public function __construct(UserPasswordEncoderInterface $e, Utils $u)
    {
        $this->encoder = $e;
        $this->util = $u;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username', TextType::class, ['label' => false, 'attr' => ['class' => 'form-control', 'placeholder' => 'Prénom']])
            ->add('fullname', TextType::class, ['label' => false, 'attr' => ['class' => 'form-control', 'placeholder' => 'Nom']])
			->add('societe', TextType::class, ['label' => false, 'attr' => ['class' => 'form-control', 'placeholder' => 'Société']])
			->add('email', EmailType::class, ['label' => false, 'attr' => ['class' => 'form-control', 'placeholder' => 'Email']])
			->add('password', RepeatedType::class, ['type' => PasswordType::class,
                                                                'first_options' => ['label' => false, 'attr' => ['class' => 'form-control first-password-input', 'placeholder' => 'Password']],
                                                                'second_options' => ['label' => false,  'attr' => ['class' => 'form-control', 'placeholder' => 'Confirm Pass.']]])
			->add('p', CheckboxType::class, [
				'label'    => '',
				'required' => true,
				'attr'	   => ['class'    => 'label-conditions-utilisation custom-control-input']
			])
            ->add('register', SubmitType::class, ['label' => 'Incription', 'attr' => ['class' => 'btn btn-lg btn-primary btn-block']])
        ;

        $encoder = $this->encoder;
       /* $builder->get('password')->addEventListener(FormEvents::POST_SUBMIT,function(FormEvent $e) use ($encoder){
            $currentElement = $e->getForm(); // getForm devrait s'appeller getElement; sauf quand est sur le root element qui lui renvoit un form
            dd($currentElement);
            $pass = $currentElement->getData();

            //Crypt password to encoder;
            $passCrypted = $this->util->_crypt($pass);

            $e->setData($passCrypted);
            dd($currentElement);
        });*/
    }


    public function configureOptions(OptionsResolver $resolver)
    {

    }
}
