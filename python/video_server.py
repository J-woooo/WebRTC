# video_server.py
from simple_websocket_server import WebSocketServer, WebSocket
import base64
import cv2
import numpy as np
import warnings
warnings.simplefilter("ignore", DeprecationWarning)


class SimpleEcho(WebSocket):
    # 웹소켓을 통해 메시지를 받으면 opencv로 읽을 수 있는 형태로 변환
    def handle(self):
        msg = self.data
        img = cv2.imdecode(np.fromstring(base64.b64decode(
            msg.split(',')[1]), np.uint8), cv2.IMREAD_COLOR)
        cv2.imshow('image', img)
        cv2.waitKey(1)

    def connected(self):
        print(self.address, 'connected')

    def handle_close(self):
        print(self.address, 'closed')


# 서버 생성. videosender의 포트 번호와 동일해야 한다
server = WebSocketServer('localhost', 3000, SimpleEcho)
server.serve_forever()
