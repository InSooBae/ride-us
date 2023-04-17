package com.ssafy.rideus.repository.jpa;

import com.ssafy.rideus.domain.Coordinate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoordinateRepository extends JpaRepository<Coordinate, Long> {
}
