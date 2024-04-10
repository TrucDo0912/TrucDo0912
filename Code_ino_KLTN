/*
  ngay 09.04.2024
*/
#include <Adafruit_Fingerprint.h>
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <String.h>
#include <RTClib.h>
#include <SPI.h>
#include <TFT_eSPI.h>
#include <WiFiManager.h> //tablatronix 2.0.17
#include <ESPAsyncWebServer.h>

RTC_DS3231 rtc;
#define mySerial Serial2  // use for ESP32
#define buzzer 13

#define FIREBASE_HOST "https://tinvatly-fingerprint-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "k2LiSfs7D4K2rirwQZWl6WWefrETOnU1zbLLlW0N"

AsyncWebServer server(80);
WiFiManager wifiManager;

FirebaseData firebaseData;
FirebaseConfig json;
TFT_eSPI tft = TFT_eSPI();
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

WiFiClient client;
//Tao cac bien de dung trong cac ham
int id;  // Bien dung de luu gia tri ID cua van tay
int id_add;
int id_xoa;
uint8_t a = 0;                          // Nhap gia tri de chon mode
int i = 0;                              // So lan sai van tay
int ngay, thang, nam, gio, phut, giay;  // time
String string1, string2;  // String2: tao chuoi de truy xuat vao bien ID tren Firebase , string1: Du lieu lay tu Firebase ve


void setup() {
  Serial.begin(115200);

  tft.init();
  tft.setRotation(2);
  tft.fillScreen(TFT_WHITE);
  pinMode(buzzer, OUTPUT);
  // start DS1207
  if (!rtc.begin()) {
    Serial.println("RTC module is NOT found");
    Serial.flush();
    while (1)
      ;
  }
  // automatically sets the RTC to the date & time on PC this sketch was compiled
  // rtc.adjust(DateTime(F(DATE), F(TIME)));

  //Connect Wifi
  WiFi.disconnect();
  delay(3000);
  Serial.println("START");
  WiFi.begin("Truc Mai", "trucmai2");  //Thiết lập kết nối Wifi
  while ((!(WiFi.status() == WL_CONNECTED))) {
    delay(300);
    Serial.print("..");
    hienthi0("Dang doi wifi");
    hienthi1("..");
  }
  Serial.println("Connected");
  Serial.println("Your IP is");
  // hienthi0("Connected Wifi");
  // delay(500);
  // hienthi0("");
  Serial.println((WiFi.localIP()));

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  WiFi.mode(WIFI_STA);

  // set the data rate for the sensor serial port
  finger.begin(57600);

  if (finger.verifyPassword()) {
    Serial.println("Found fingerprint sensor!");
  } else {
    Serial.println("Did not find fingerprint sensor ");
    while (1) {
      delay(1);
    }
  }
  finger.getTemplateCount();
  Serial.print("Sensor contains ");
  Serial.print(finger.templateCount);
  Serial.println(" templates");
  Serial.println("Waiting for valid finger...");
  // hienthi1("Wait ID");
}

void loop() {

  finger.LEDcontrol(FINGERPRINT_LED_ON, 0, FINGERPRINT_LED_BLUE);
  hienthitime();
  hienthidohoa();
  readtime();
  checkvantay();
  if (Firebase.getInt(firebaseData, "ID_ADD")) {
    int web_id_add = firebaseData.intData();
    if (web_id_add > 0) {
      id_add = web_id_add;
      layvantay(id_add);
    }
  }
  if (Firebase.getInt(firebaseData, "ID_Xoa")) {
    int web_id_xoa = firebaseData.intData();
    if (web_id_xoa > 0) {
      id_xoa = web_id_xoa;
      xoaid(id_xoa);
    }
  }
  web_add();
  web_xoa();
}
// đọc thời gian thực
void readtime() {
  DateTime nown = rtc.now();
  nam = nown.year();
  thang = nown.month();
  ngay = nown.day();
  gio = nown.hour();
  phut = nown.minute();
  giay = nown.second();
}
//lay van tay
uint8_t layvantay(uint8_t id_add) {
  int p = -1;
  Serial.println("Moi ban dua tay vao");
  hienthi2("Dua tay vao");
  //doi van tay cua user
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
  }
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
  }
  //xac nhan van tay
  p = finger.image2Tz(1);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  Serial.println("Moi ban lay tay ra khoi cam bien");
  hienthi2("Lay tay ra");
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }
  Serial.print("ban da chon ID ");
  Serial.println(id_add);
  p = -1;
  Serial.println("Moi ban xac thuc lai van tay");
  hienthi2("Xac thuc lai");
  //doi van tay cua user
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
      case FINGERPRINT_OK:
        Serial.println("Image taken");
        break;
      case FINGERPRINT_NOFINGER:
        Serial.print(".");
        break;
      case FINGERPRINT_PACKETRECIEVEERR:
        Serial.println("Communication error");
        break;
      case FINGERPRINT_IMAGEFAIL:
        Serial.println("Imaging error");
        break;
      default:
        Serial.println("Unknown error");
        break;
    }
  }

  p = finger.image2Tz(2);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }
  Serial.print("da tao room cho ");
  Serial.println(id_add);
  //tao model cho ID da chon
  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println("Prints matched!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_ENROLLMISMATCH) {
    Serial.println("Fingerprints did not match");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }

  // luu ID vao model
  p = finger.storeModel(id_add);
  if (p == FINGERPRINT_OK) {
    Serial.println("Stored!");
    String string3 = String("Da ADD ID ");
    string3 += id_add;
    hienthi2(string3);
    delay(2000);
    hienthi2("Wait ID");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("Could not store in that location");
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    Serial.println("Error writing to flash");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }
  if ((Firebase.setInt(firebaseData, "ID_ADD", (0))) == true)
    ;
}

// xoa van tay
uint8_t xoaid(uint8_t id_xoa) {
  uint8_t p = -1;

  p = finger.deleteModel(id_xoa);

  if (p == FINGERPRINT_OK) {
    Serial.println("Deleted!");
    String string3 = String("Da Xoa ID ");
    string3 += id_xoa;
    hienthi2(string3);
    delay(2000);
    hienthi2("Wait ID");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("Could not delete in that location");
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    Serial.println("Error writing to flash");
    return p;
  } else {
    Serial.print("Unknown error: 0x");
    Serial.println(p, HEX);
    return p;
  }
  if ((Firebase.setInt(firebaseData, "ID_Xoa", (0))) == true)
    ;
}

//ham check van tay
int checkvantay() {
  uint8_t p = finger.getImage();
  switch (p) {
    case FINGERPRINT_OK:

      break;
    case FINGERPRINT_NOFINGER:
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  // OK success!

  p = finger.image2Tz();
  switch (p) {
    case FINGERPRINT_OK:

      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  // OK converted!
  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK) {
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_NOTFOUND) {
    Serial.println("Did not find a match");

    finger.LEDcontrol(FINGERPRINT_LED_FLASHING, 25, FINGERPRINT_LED_RED, 8);
    hienthitdauX_DO();
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }

  i = 0;
  // found a match!
  Serial.print("Found ID #");
  Serial.print(finger.fingerID);
  finger.LEDcontrol(FINGERPRINT_LED_FLASHING, 25, FINGERPRINT_LED_PURPLE, 5);
  digitalWrite(buzzer, HIGH);
  delay(50);
  digitalWrite(buzzer, LOW);
  delay(50);
  hienthitich_XANH();
  Serial.print(" with confidence of ");
  Serial.println(finger.confidence);
  int id = finger.fingerID;
  Firebase.getInt(firebaseData, id);
  String string3 = String("Found ID");
  string3 += id;
  hienthi2(string3);
  // delay(50);
  // hienthi2("Wait ID");
  //Lấy dữ liệu từ Firebase về và so sánh với vân tay
  string2 = String("/TVL_TEST/ID") + id + "/ID";
  // string2 += id;
  // string2 += "/ID";

  if (Firebase.getInt(firebaseData, string2)) {
    Serial.println("Download success: " + String(firebaseData.intData()));
    //int id_fr = firebaseData.intData();
    string1 = String("/TVL_TEST/ID") + id + "/Check";
    //  string1 += id_fr;
    //  string1 += "/Check";
    //  if (id_fr == id) {
    //if (Firebase.getInt(firebaseData, string1)) {
    int check = Firebase.getInt(firebaseData, string1);
    //firebaseData.intData();
    if (check == 0) {
      guitime_firebase_giovao(id);
      delay(200);
      if ((Firebase.setInt(firebaseData, string1, 1)) == true) {}
    } else {
      guitime_firebase_giora(id);
      delay(200);
      if ((Firebase.setInt(firebaseData, string1, 0)) == true) {}
    }
    // }
    delay(500);
  }
  else {
    Serial.println("Download fail: " + String(firebaseData.intData()));
  }
  // }
  return finger.fingerID;
}
int web_add() {
  if (Firebase.getInt(firebaseData, "ID_ADD")) {
    int web_id_add = firebaseData.intData();
    if (web_id_add > 0) {
      id_add = web_id_add;
      layvantay(id_add);
    }
  }
}
int web_xoa() {
  if (Firebase.getInt(firebaseData, "ID_Xoa")) {
    int web_id_xoa = firebaseData.intData();
    if (web_id_xoa > 0) {
      id_xoa = web_id_xoa;
      xoaid(id_xoa);
    }
  }
}
void guitime_firebase_giovao(int vantay_now) {
  String his;
  String giovao;
  String phutvao;
  his = String("/History_Check/Năm_");

  his += nam;
  his += String("/Tháng_");
  his += thang;
  his += String("/Ngày_");
  his += ngay;
  his += String("/ID");
  his += vantay_now;
  giovao = his + String("/Giờ vào");
  phutvao = his + String("/Phút vào");
  if ((Firebase.setInt(firebaseData, giovao, gio)) == true) {}
  if ((Firebase.setInt(firebaseData, phutvao, phut)) == true) {}
}
void guitime_firebase_giora(int vantay_now) {
  String his;
  String giora;
  String phutra;
  his = String("/History_Check/Năm_");
  his += nam;
  his += String("/Tháng_");
  his += thang;
  his += String("/Ngày_");
  his += ngay;
  his += String("/ID");
  his += vantay_now;
  giora = his + String("/Giờ ra");
  phutra = his + String("/Phút ra");


  if ((Firebase.setInt(firebaseData, giora, gio)) == true) {
  }
  if ((Firebase.setInt(firebaseData, phutra, phut)) == true) {}
}
void hienthi0(String b) {
  tft.setCursor(60, 190);
  tft.setTextColor(TFT_BLACK);
  // tft.loadFont(Final_Frontier_28);
  tft.setTextSize(3);
  tft.println(b);
  delay(1500);

  tft.fillRect(60, 190, 230, 25, TFT_WHITE);
}
void hienthi1(String b) {
  tft.setCursor(60, 220);
  tft.setTextColor(TFT_BLACK);
  // tft.loadFont(Final_Frontier_28);
  tft.setTextSize(3);
  tft.println(b);
  delay(1500);

  tft.fillRect(60, 220, 200, 25, TFT_WHITE);
}
void hienthi2(String b) {

  tft.setCursor(130, 90);
  tft.setTextColor(TFT_GREEN);
  // tft.loadFont(Final_Frontier_28);
  tft.setTextSize(3.5);
  tft.println(b);
  delay(1500);
  tft.fillRect(130, 90, 200, 25, TFT_WHITE);
}
void hienthidohoa() {
  for (int i = 390; i > 1; i -= 5) {
    tft.drawLine(1, i, 491 - (i * 1.6), 10, TFT_CYAN);
  }
}
void hienthitich_XANH() {
  tft.setCursor(118, 130);
  tft.setTextColor(TFT_GREEN);
  tft.setTextSize(3.5);
  // tft.loadFont(Final_Frontier_28);
  tft.print("Valid");
  // hình tròn màu xanh
  tft.drawCircle(160, 245, 70, TFT_GREEN);
  tft.drawCircle(160, 245, 71, TFT_GREEN);
  tft.drawCircle(160, 245, 72, TFT_GREEN);
  tft.drawCircle(160, 245, 73, TFT_GREEN);
  // dấu tích màu xanh
  tft.drawLine(120, 240, 150, 280, TFT_GREEN);
  tft.drawLine(150, 280, 210, 210, TFT_GREEN);
  tft.drawLine(121, 240, 151, 280, TFT_GREEN);
  tft.drawLine(149, 280, 209, 210, TFT_GREEN);
  tft.drawLine(122, 240, 152, 280, TFT_GREEN);
  tft.drawLine(148, 280, 208, 210, TFT_GREEN);
  delay(1000);
  tft.fillRect(80, 130, 250, 240, TFT_WHITE);
}
void hienthitdauX_DO() {

  tft.setCursor(85, 130);
  tft.setTextColor(TFT_RED);
  tft.setTextSize(3.5);
  // tft.loadFont(Final_Frontier_28);
  tft.print("Not Found");
  // hình tròn màu đỏ
  tft.drawCircle(160, 245, 70, TFT_RED);
  tft.drawCircle(160, 245, 71, TFT_RED);
  tft.drawCircle(160, 245, 72, TFT_RED);
  tft.drawCircle(160, 245, 73, TFT_RED);
  /// Tọa độ tâm
  int centerX = 160;
  int centerY = 245;
  int centerX1 = 159;
  int centerX2   = 161;

  // int centerY = 245;
  // Độ dài nửa đường chéo của dấu X
  int halfDiagonalLength = 35;
  // Vẽ dấu X  màu đỏ
  for (int i = 0; i < 5; i++) {
    //
    tft.drawLine(centerX - halfDiagonalLength - i, centerY - halfDiagonalLength - i, centerX + halfDiagonalLength + i, centerY + halfDiagonalLength + i, TFT_RED);
    tft.drawLine(centerX - halfDiagonalLength - i, centerY + halfDiagonalLength + i, centerX + halfDiagonalLength + i, centerY - halfDiagonalLength - i, TFT_RED);
    //
    tft.drawLine(centerX1 - halfDiagonalLength - i, centerY - halfDiagonalLength - i, centerX1 + halfDiagonalLength + i, centerY + halfDiagonalLength + i, TFT_RED);
    tft.drawLine(centerX1 - halfDiagonalLength - i, centerY + halfDiagonalLength + i, centerX1 + halfDiagonalLength + i, centerY - halfDiagonalLength - i, TFT_RED);
    //
    tft.drawLine(centerX2 - halfDiagonalLength - i, centerY - halfDiagonalLength - i, centerX2 + halfDiagonalLength + i, centerY + halfDiagonalLength + i, TFT_RED);
    tft.drawLine(centerX2 - halfDiagonalLength - i, centerY + halfDiagonalLength + i, centerX2 + halfDiagonalLength + i, centerY - halfDiagonalLength - i, TFT_RED);
  }
  delay(1000);
  tft.fillRect(80, 130, 250, 240, TFT_WHITE);
}

// void hienthitime() {

//   tft.fillRect(65, 390, 320, 50, TFT_WHITE);
//   DateTime nown = rtc.now();
//   nam = nown.year();
//   thang = nown.month();
//   ngay = nown.day();
//   gio = nown.hour();
//   phut = nown.minute();
//   giay = nown.second();
//   tft.setCursor(100, 440);
//   tft.setTextSize(2);
//   // tft.loadFont(Final_Frontier_28);
//   tft.setTextColor(TFT_BLACK);
//   // tft.setFreeFont(MYFONT32);

//   // hiển thị ngày, tháng , năm
//   if (nown.day() < 10) {
//     tft.print('0');
//   }
//   tft.print(nown.day(), DEC);
//   tft.print('/');
//   if (nown.month() < 10) {
//     tft.print('0');
//   }
//   tft.print(nown.month(), DEC);
//   tft.print('/');
//   if (nown.day() < 10) {
//     tft.print('0');
//   }
//   tft.print(nown.year(), DEC);
//   tft.print(' ');
//   // hiển thị giờ, phút, giây
//   tft.setCursor(65, 390);
//   tft.setTextSize(4);
//   tft.setTextColor(TFT_BLACK);

//   tft.print(nown.hour(), DEC);
//   tft.print(':');
//   if (nown.minute() < 10) {
//     tft.print('0');
//   }
//   tft.print(nown.minute(), DEC);
//   tft.print(':');
//   if (nown.second() < 10) {
//     tft.print('0');
//   }
//   tft.println(nown.second(), DEC);
// }
void hienthitime() {
  tft.fillRect(65, 390, 320, 50, TFT_WHITE);
  DateTime nown = rtc.now();

  // Lưu trữ giá trị trước đó của ngày, tháng, năm
  static uint8_t prev_day = 0;
  static uint8_t prev_month = 0;
  static uint16_t prev_year = 0;

  // Hiển thị ngày, tháng, năm nếu có sự thay đổi
  if (prev_day != nown.day() || prev_month != nown.month() || prev_year != nown.year()) {
    tft.setCursor(100, 440);
    tft.setTextSize(2);
    tft.setTextColor(TFT_BLACK);
    tft.printf("%02d/%02d/%04d ", nown.day(), nown.month(), nown.year());

    // Cập nhật giá trị trước đó
    prev_day = nown.day();
    prev_month = nown.month();
    prev_year = nown.year();
  }

  // Hiển thị giờ, phút, giây
  tft.setCursor(65, 390);
  tft.setTextSize(4);
  tft.setTextColor(TFT_BLACK);
  tft.printf("%02d:%02d:%02d", nown.hour(), nown.minute(), nown.second());
}
