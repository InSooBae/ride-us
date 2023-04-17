package com.ssafy.rideus.repository.query;

import com.ssafy.rideus.domain.Coordinate;
import com.ssafy.rideus.domain.Record;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.sql.PreparedStatement;
import java.util.List;
import java.util.StringTokenizer;

@Repository
@RequiredArgsConstructor
public class CoordinateBulkRepository {

    private final JdbcTemplate jdbcTemplate;

    @Transactional
    public void saveAll(List<Coordinate> coordinates, String recordId) {
        String sql = "INSERT INTO coordinate (pos, record_id) " +
                "VALUES (?, ?)";

        jdbcTemplate.batchUpdate(sql,
                coordinates,
                coordinates.size(),
                (PreparedStatement ps, Coordinate coordinate) -> {
                    ps.setObject(1, coordinate.getPos());
                    ps.setString(2, recordId);
                });
    }
}
