import time
import RPi.GPIO as GPIO

# 초음파 센서를 대한 전역 변수 선언 및 초기화
trig = 20
echo = 16
GPIO.setmode(GPIO.BCM)#BCM모드로 설정
GPIO.setwarnings(False)
GPIO.setup(trig, GPIO.OUT) #초음파센서 20번을 출력선으로 지정
GPIO.setup(echo, GPIO.IN) #초음파센서 16번을 입력선으로 지정
GPIO.output(trig, False)
led = 6 # LED를 사용할 핀번호 GPIO6 의미
GPIO.setup(led, GPIO.OUT) # GPIO 6번 핀을 출력 선으로 지정

def measureDistance():
        global trig, echo
        time.sleep(0.5)
        GPIO.output(trig, True) # 신호 1 발생
        time.sleep(0.00001) # 짧은 시간을 나타내기 위함
        GPIO.output(trig, False) # 신호 0 발생

        while(GPIO.input(echo) == 0):
                pulse_start = time.time() # 신호 1을 받았던 시간
        while(GPIO.input(echo) == 1):
                pulse_end = time.time() # 신호 0을 받았던 시간

        pulse_duration = pulse_end - pulse_start
        return 340*100/2*pulse_duration

if(__name__ == "__main__"):
        while(True):
                print("물체와의거리는 %f" %measureDistance())
def controlLED(led = 6, onOff =0 ): # led 번호의 핀에 onOff(0/1) 값 출력
        GPIO.output(led, onOff)
