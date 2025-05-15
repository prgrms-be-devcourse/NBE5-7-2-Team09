package ninegle.Readio.tosspay.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ninegle.Readio.tosspay.domain.Subscriptiontest;

@Repository
public interface SubscriptiontestRepository extends JpaRepository<Subscriptiontest, Integer> {
}
