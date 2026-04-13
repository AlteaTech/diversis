<?php

namespace App\Repository;

use App\Entity\DataCalcul;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method DataCalcul|null find($id, $lockMode = null, $lockVersion = null)
 * @method DataCalcul|null findOneBy(array $criteria, array $orderBy = null)
 * @method DataCalcul[]    findAll()
 * @method DataCalcul[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DataCalculRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, DataCalcul::class);
    }

    // /**
    //  * @return DataCalcul[] Returns an array of DataCalcul objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('d.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?DataCalcul
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
