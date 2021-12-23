import os; import io; import time
import picamera
import cv2; import numpy as np
fileName = ""
stream = io.BytesIO()
camera =picamera.PiCamera()
camera.start_preview()
camera.resolution = (320, 240)
time.sleep(1)

def takePicture() :
        global fileName, stream, camera

        stream.seek(0)  #파일포인터를 처음으로 옮김
        stream.truncate() #파일을 비우는 작업
        camera.capture(stream, format='jpeg', use_video_port=True) #사진을 찍음(화질은 선명하게 설정하고 확장자는 jpeg로 stream에 저장)
        data = np.frombuffer(stream.getvalue(), dtype=np.uint8) #바이너리 파일인 stream을 읽어서 data변수에 저장
        image = cv2.imdecode(data, 1) #얼굴인식을 위해 Binary 형태인 data를 읽은 다음 컬러이미지로 decode하기
        haar = cv2.CascadeClassifier('./haarCascades/haar-cascade-files-master/haarcascade_frontalface_default.xml') #객체 감지를 위한 CascadeClassifier 클래스를 이용
        image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) #이미지를 회색으로 처리
        faces = haar.detectMultiScale(image_gray,1.1,3) #입력 이미지에서 다양한 크기의 개체(얼굴)를 감지하고 감지된 얼굴(개체)은 사각형목록으로 반환
        for x, y, w, h in faces:
                cv2.rectangle(image, (x, y), (x + w, y + h), (255, 0, 0), 2) #이미지에 (x+y)와 (x+w, y+h)를 꼭짓점으로 하는사각형 그리기

        takeTime = time.time() #시간을 부동소수점으로 표현
        fileName = "./static/%d.jpg" %(takeTime*10)
        cv2.imwrite(fileName, image) #얼굴인식된 이미지 저장
        return fileName

if __name__ == '__main__' :
        while(True):
                name = takePicture()
                print("fname= %s" % name)
