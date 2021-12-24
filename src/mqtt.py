# publisher

import time
import paho.mqtt.client as mqtt
import circuit # 초음파 센서 입력 모듈 임포트
import mycamera


broker_ip = "localhost" # 현재 이 컴퓨터를 브로커로 설정

client = mqtt.Client()

client.connect(broker_ip, 1883)
client.loop_start()

while(True):
        d= circuit.measureDistance()
        t=time.localtime()
        print("측정거리는 %.2fcm 입니다"%d)
        if(d>30):
                img=mycamera.takePicture() #자전거와 초음파센서까지의 거리가 30cm이상이면 사진을 찍음
                client.publish("image", img, qos=0) #broker에게 image라는 토픽으로 publish
                circuit.controlLED(onOff=1) #자전거와 초음파센서까지의 거리가 30cm이상이면 LED ON
        else:
                circuit.controlLED(onOff=0) #거리가 다시 30cm이하면 LED끄기

client.loop_stop()
client.disconnect()
