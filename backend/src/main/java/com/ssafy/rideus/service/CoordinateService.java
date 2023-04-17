package com.ssafy.rideus.service;


import com.ssafy.rideus.domain.Coordinate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

@Service
@Transactional(readOnly = true)
public class CoordinateService {
    private final ByteBuffer buffer;

    private final StringBuilder sb;

    private static final int bufferSize = 1024 * 1024; // 1MB 버퍼 사이즈

    public CoordinateService() {
        this.buffer = ByteBuffer.allocateDirect(bufferSize);
        this.sb = new StringBuilder();
    }

    public void makeFile(String filePath) {
        Path path = Paths.get(filePath);
        boolean exists = Files.exists(path, LinkOption.NOFOLLOW_LINKS);
        if (!exists) {
            try {
                Files.createFile(path);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    public void writeDataInFile(String filePath, byte[] message) {
        Path path = Paths.get(filePath);
        boolean exists = Files.exists(path, LinkOption.NOFOLLOW_LINKS);
        if (exists) {
            try (FileChannel fileChannel = FileChannel.open(path, StandardOpenOption.APPEND)) {
                synchronized (this) {
                    buffer.put(message);
                    buffer.flip();
                    fileChannel.write(buffer);
                    buffer.clear();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }

    public String findFile(String dir, String similarFileName) {
        // 디렉토리 객체 생성
        File directory = new File(similarFileName);

        // 디렉토리에 포함된 파일 목록 가져오기
        File[] files = directory.listFiles();

        // 파일명에 "Room"이 포함된 파일 출력
        for (File file : files) {
            if (file.isFile() && file.getName().contains(similarFileName)) {
                return file.getAbsolutePath();
            }
        }
        return "";
    }
    public void readFile(String filePath) {
        Path path = Paths.get(filePath);
        boolean exists = Files.exists(path, LinkOption.NOFOLLOW_LINKS);
        if (exists) {
            try (FileChannel channel = FileChannel.open(path)) {
                synchronized (this) {
                    while (channel.read(buffer) != -1) {
                        buffer.flip();
                        sb.append(StandardCharsets.UTF_8.decode(buffer));
                        buffer.clear();
                    }
                }

//                System.out.println(sb);
//                StringTokenizer st = new StringTokenizer(sb.toString())
                sb.setLength(0);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public List<Coordinate> makeCoordinateFromFile(String filePath) {
        Path path = Paths.get(filePath);
        boolean exists = Files.exists(path, LinkOption.NOFOLLOW_LINKS);
        if (exists) {
            try (FileChannel channel = FileChannel.open(path)) {
                synchronized (this) {
                    while (channel.read(buffer) != -1) {
                        buffer.flip();
                        sb.append(StandardCharsets.UTF_8.decode(buffer));
                        buffer.clear();
                    }
                }

//                System.out.println(sb);
                StringTokenizer st = new StringTokenizer(sb.toString()," ");
                List<Coordinate> coordinates = new ArrayList<>();
                while (!st.hasMoreTokens()) {
                    String[] coord = st.nextToken().split(",");
                    coordinates.add(Coordinate.create(coord[0],coord[1]));
                }

                sb.setLength(0);
                return coordinates;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    public String getRoomId(String destination) {
        int lastIndex = destination.lastIndexOf('/');
        if (lastIndex != -1)
            return destination.substring(lastIndex + 1);
        else
            return "";
    }
}
