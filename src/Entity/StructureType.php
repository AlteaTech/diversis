<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * StructureType
 *
 * @ORM\Table(name="structure_type")
 * @ORM\Entity
 */
class StructureType
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
     * @ORM\Column(name="type", type="string", length=40, nullable=false)
     */
    private $type;


}
