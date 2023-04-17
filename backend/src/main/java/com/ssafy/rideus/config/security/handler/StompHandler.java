package com.ssafy.rideus.config.security.handler;

import com.ssafy.rideus.config.security.util.JwtTokenProvider;
import com.ssafy.rideus.config.security.util.JwtUtil;
import com.ssafy.rideus.service.CoordinateService;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
public class StompHandler implements ChannelInterceptor {

    @Value("${token.secret}")
    private String secretKey;

    private final JwtTokenProvider jwtTokenProvider;

    private final Map<String, String> sessionRoomIds;

    private final CoordinateService coordinateService;

    private final StringBuilder stringBuilder;

    @Autowired
    public StompHandler(JwtTokenProvider jwtTokenProvider, CoordinateService coordinateService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.sessionRoomIds = new HashMap<>();
        this.coordinateService = coordinateService;
        this.stringBuilder = new StringBuilder();
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT == accessor.getCommand()) {
            if (!jwtTokenProvider.validateToken(extractToken(accessor))) {
                throw new AccessDeniedException("연결 거부");
            }
        } else if (StompCommand.SUBSCRIBE == accessor.getCommand()) { // 채팅룸 구독요청
            // header정보에서 구독 destination정보를 얻고, roomId를 추출한다.
            String roomId = coordinateService.getRoomId(Optional.ofNullable((String) message.getHeaders().get("simpDestination")).orElse("InvalidRoomId"));
            UsernamePasswordAuthenticationToken simpUser = (UsernamePasswordAuthenticationToken) message.getHeaders().get("simpUser");
            String userName = Optional.ofNullable(simpUser.getName()).orElse("no-name");
            // 채팅방에 들어온 클라이언트 sessionId를 roomId와 맵핑해 놓는다.(나중에 특정 세션이 어떤 채팅방에 들어가 있는지 알기 위함)
            String sessionId = (String) message.getHeaders().get("simpSessionId");
            sessionRoomIds.put(sessionId, roomId);
            log.info("headers.simpSessionId -> {}", sessionId);
            String fileName = buildFileName(userName, sessionId, roomId);

            // 유저 이름_세션 id_룸 id로 파일 생성
            coordinateService.makeFile(fileName);

        } else if (StompCommand.DISCONNECT == accessor.getCommand()) { // Websocket 연결 종료
//            String sessionId = (String) message.getHeaders().get("simpSessionId");
//            String roomId = sessionRoomIds.get(sessionId);
//            String name = Optional.ofNullable((Principal) message.getHeaders().get("simpUser")).map(Principal::getName).orElse("UnknownUser");
//            String fileName = buildFileName(name, sessionId, roomId);
//            coordinateService.readFile(fileName);

        } else if (StompCommand.SEND == accessor.getCommand()) {
            UsernamePasswordAuthenticationToken simpUser = (UsernamePasswordAuthenticationToken) message.getHeaders().get("simpUser");
            String userName = Optional.ofNullable(simpUser.getName()).orElse("no-name");
            // 채팅방에 들어온 클라이언트 sessionId를 roomId와 맵핑해 놓는다.(나중에 특정 세션이 어떤 채팅방에 들어가 있는지 알기 위함)
            String sessionId = (String) message.getHeaders().get("simpSessionId");

            String fileName = buildFileName(userName, sessionId, sessionRoomIds.get(sessionId));
            byte[] payload = (byte[]) message.getPayload();
            int from = payload.length - 3;
            int to = payload.length - 2;
            while (payload[from] != 34) {
                from--;
            }
            from++;
            coordinateService.writeDataInFile(fileName, copyOfRangeForByteAppendSpace(payload, from, to));
        }

        return message;
    }

    synchronized private String buildFileName(String userName, String sessionId, String roomId) {
        String fileName = stringBuilder.append("D:/").append(userName).append("_").append(roomId).append("_").append(sessionId).append(".txt").toString();
        stringBuilder.setLength(0);
        return fileName;
    }

    /**
     *
     * @param original
     * @param from
     * @param to
     * @return byte 배열 마지막에 32(공백) 입력하여 리턴
     */
    public static byte[] copyOfRangeForByteAppendSpace(byte[] original, int from, int to) {
        int newLength = to - from + 1;
        if (newLength < 0)
            throw new IllegalArgumentException(from + " > " + to);
        byte[] copy = new byte[newLength];
        System.arraycopy(original, from, copy, 0,
                Math.min(original.length - from, newLength - 1));
        copy[copy.length - 1] = 32;
        return copy;
    }

    private String extractToken(StompHeaderAccessor accessor) {
        String bearerToken = accessor.getFirstNativeHeader(HttpHeaders.AUTHORIZATION);

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public boolean isValidToken(String jwtToken) {
        try {
            return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(jwtToken) != null;
        } catch (SignatureException ex) {
            log.error("Invalid JWT signature");
            throw ex;
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
            throw ex;
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
            throw ex;
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
            throw ex;
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty.");
            throw ex;
        }catch (Exception e) {
            throw e;
        }
    }
}
