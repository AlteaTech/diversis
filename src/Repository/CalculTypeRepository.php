<?php

namespace App\Repository;

use App\Entity\CalculType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method CalculType|null find($id, $lockMode = null, $lockVersion = null)
 * @method CalculType|null findOneBy(array $criteria, array $orderBy = null)
 * @method CalculType[]    findAll()
 * @method CalculType[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CalculTypeRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, CalculType::class);
    }

    // /**
    //  * @return CalculType[] Returns an array of CalculType objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?CalculType
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
