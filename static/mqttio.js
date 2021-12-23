var port = 9001 // mosquitto의 디폴트 웹 포트
var client = null; // null이면 연결되지 않았음
var time=null; //날짜를 저장하기 위한 변수
var first=null; //처음 찍힌 날짜를 저장하기 위한 변수
var month=null; //처음 찍힌 날짜중 월을 저장하기 위한 변수
var tmonth=null; // 몇월달인지를 저장하기 위한 변수
function startConnect() { // 접속을 시도하는 함수
    clientID = "clientID-" + parseInt(Math.random() * 100); // 랜덤한 사용자 ID 생성

    // 사용자가 입력한 브로커의 IP 주소와 포트 번호 알아내기
    broker = document.getElementById("broker").value; // 브로커의 IP 주소

    // id가 message인 DIV 객체에 브로커의 IP와 포트 번호 출력
    // MQTT 메시지 전송 기능을 모두 가징 Paho client 객체 생성
    client = new Paho.MQTT.Client(broker, Number(port), clientID);

    // client 객체에 콜백 함수 등록
    client.onConnectionLost = onConnectionLost; // 접속이 끊어졌을 때 실행되는 함수 등록
    client.onMessageArrived = onMessageArrived; // 메시지가 도착하였을 때 실행되는 함수 등록

    // 브로커에 접속. 매개변수는 객체 {onSuccess : onConnect}로서, 객체의 프로퍼틴느 onSuccess이고 그 값이 onConnect.
    // 접속에 성공하면 onConnect 함수를 실행하라는 지시
    client.connect({
        onSuccess: onConnect,
    });
}

var isConnected = false;

// 브로커로의 접속이 성공할 때 호출되는 함수
function onConnect() {
    isConnected = true;

    document.getElementById("messages").innerHTML += '<span><strong>*자전거 모니터링을 시작합니다.</strong></span><br/>';
    topic = "image"

    // 토픽으로 subscribe 하고 있음을 id가 message인 DIV에 출력
    document.getElementById("messages").innerHTML += '<span><strong>*자전거가 없어지면 사진과 아래 이력들을 확인하세요.</strong></span><br/>';
    document.getElementById("sub").innerHTML = '<span><strong>자전거가 안전하게 보관중</strong></span><br/>';

    client.subscribe(topic, qos = 0); // 브로커에 subscribe

}


function publish(topic,msg){
    if(client == null) return; // 연결되지 않았음
    client.send(topic, msg, 0, false);
}

function unsubscribe(topic) {
    if(client == null || isConnected != true) return;

    // 토픽으로 subscribe 하고 있음을 id가 message인 DIV에 출력

    document.getElementById("sub").innerHTML += '<span><strong>'+first.getFullYear()+'/'+first.getMonth()+'/'+month+'/'+first.getHours()+'시'+first.getMinutes()+'분'+first.getSeconds()+'초에 없어졌습니다.'+'</strong></span><br/>';
    document.getElementById("sub").innerHTML += '<span><strong>찍은 사진들은 static폴더에 저장되었으니  확인해주십시오.'+ '</strong></span><br/>';

    client.unsubscribe(topic, null); // 브로커에 subscribe
}

// 접속이 끊어졌을 때 호출되는 함수
function onConnectionLost(responseObject) { // 매개변수인 responseObject는 응답 패킷의 정보를 담은 개체
    document.getElementById("messages").innerHTML += '<span> 접속을 끊고</span><br/>';
    if (responseObject.errorCode !== 0) {
        document.getElementById("messages").innerHTML += '<span>오류 : ' + + responseObject.errorMessage + '</span><br/>';
    }
}
// 메시지가 도착할 때 호출되는 함수
function onMessageArrived(msg) { // 매개변수 msg는 도착한 MQTT 메시지를 담고 있는 객체
    console.log("onMessageArrived: " + msg.payloadString);

    // 토픽 image가 도착하면 payload에 담긴 파일 이름의 이미지 그리기
    if(msg.destinationName == "image") {
            drawImage(msg.payloadString); // 메시지에 담긴 파일 이름으로 drawImage() 호출. drawImage()는 웹 페이지에 있음
    }
    if(time==null){ //처음 사진이 찍힌 날짜 저장하기 위한 조건문
        first=new Date();
        time=new Date();
        month=first.getMonth()+1;
        tmonth=time.getMonth()+1;
    }
    else{ //처음 찍힌것이 아니라면 관리이력에 표시하기 위한 시간저장
        time=new Date();
        tmonth=time.getMonth()+1;
    }
    document.getElementById("sub").innerHTML = '<span><strong> ' + '자전거가 없어짐!!' + '</strong></span><br/>';


    // 도착한 메시지 출력
    document.getElementById("messages").innerHTML += '<span>'+'자전거없어짐!!'  + '  | ' + '사진을 확인하세요!'+' | '+' 시각 : '+time.getFullYear()+'/'+tmonth+'/'+time.getDate()+'/'+time.getHours()+'시'+time.getMinutes()+'분'+time.getSeconds()+'초' +'</span><br/>';
}

// disconnection 버튼이 선택되었을 때 호출되는 함수
function startDisconnect() {
    client.disconnect(); // 브로커에 접속 해제
    document.getElementById("messages").innerHTML += '<span>모니터링을 종료합니다 </span><br/>';
}
