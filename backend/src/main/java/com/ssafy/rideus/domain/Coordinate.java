package com.ssafy.rideus.domain;


import com.ssafy.rideus.domain.base.BaseEntity;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.WKTReader;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class Coordinate extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coordinate_id")
    private Long id;

    // GPS 로 부터 받는 위치 정보를 저장하기 위해 WGS 84 좌표계(SRID=3857, 4326)으로 이중 lon,lat 순서로 하기 위해 3857로 컬럼을 정의
    @Column(columnDefinition = "POINT SRID 3857", nullable = false)
    private Point pos;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id")
    private Record record;

    public static Coordinate create(String lon, String lng) {
        Coordinate coordinate = new Coordinate();
//        coordinate.record = record;
        String pointWKT = String.format("POINT(%s %s)", lon, lng);
        try {
            coordinate.pos = ((Point) new WKTReader().read(pointWKT));
            coordinate.pos.setSRID(3857);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return coordinate;
    }
}
