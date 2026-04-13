<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * CalculType
 *
 * @ORM\Table(name="calcul_type")
 * @ORM\Entity
 */
class CalculType
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
     * @ORM\Column(name="type", type="string", length=50, nullable=false)
     */
    private $type;


}
